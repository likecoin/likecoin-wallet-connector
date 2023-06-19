
import Client from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import { AminoSignResponse } from '@cosmjs/amino';
import {
  AccountData,
  DirectSignResponse,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  isMobile as isMobileDevice,
} from '@walletconnect/browser-utils';
import {
  SessionTypes,
  SignClientTypes,
} from '@walletconnect/types';

import {
  LikeCoinWalletConnectorInitResponse,
  LikeCoinWalletConnectorMethodType,
  LikeCoinWalletConnectorOptions,
} from '../types';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';

let session: SessionTypes.Struct | null = null;
let client: SignClient | null = null;
let realAccounts: AccountData[] | null = null;

export async function getWalletConnectV2Connector(
  options: SignClientTypes.Options = {}
) {
  if (!client) {
    client = await Client.init({
      projectId: options.projectId,
      metadata: options.metadata,
    });
  }
  return client
}

export async function initWalletConnectV2Connector(
  options: LikeCoinWalletConnectorOptions,
  sessionMethod?: LikeCoinWalletConnectorMethodType,
  sessionAccounts: AccountData[] = []
): Promise<LikeCoinWalletConnectorInitResponse> {

  const wcConnector = await getWalletConnectV2Connector({
    projectId: options.walletConnectProjectId,
    metadata: options.walletConnectMetadata,
  });
  const lastKeyIndex = wcConnector.session.getAll().length - 1
  // TODO: allow selecting sessions
  if (lastKeyIndex > -1) {
    const lastSession = wcConnector.session.getAll()[lastKeyIndex]
    if (lastSession) session = lastSession
  }
  let accounts: AccountData[] = [];

  const getAccounts = async () => {
    const accs = await wcConnector.request({
      topic: session!.topic,
      chainId: `cosmos:${options.chainId}`,
      request: {
        method: "cosmos_getAccounts",
        params: {},
      },
    }).then((acc) => (acc as any[]).map(a => {
      const {
        pubkey, ...accounts
      } = a;
      const isHex = pubkey.length === 66 && pubkey.match(/[0-9A-Fa-f]{6}/g);
      return {
        ...accounts,
        pubkey: Buffer.from(pubkey, isHex ? 'hex' : 'base64'),
      };
    }));
    realAccounts = accs;
    return accs;
  };

  if (
    client && session &&
    sessionMethod === LikeCoinWalletConnectorMethodType.WalletConnectV2 &&
    sessionAccounts.length > 0
  ) {
    accounts = sessionAccounts;
  } else {
    await onWalletConnectV2Disconnect(session);
    const walletConnectModal = new WalletConnectModal({
      projectId: options.walletConnectProjectId,
      standaloneChains: [`cosmos:${options.chainId}`],
      themeMode: 'light', // cosmostation doesn't scan dark theme
      walletConnectVersion: 2,
      explorerRecommendedWalletIds: [
        '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb', // keplr
        'feb6ff1fb426db18110f5a80c7adbde846d0a7e96b2bc53af4b73aaf32552bea', // cosmostation
        '3ed8cc046c6211a798dc5ec70f1302b43e07db9639fd287de44a9aa115a21ed6', // leap
      ]
    });
    let connectRes;
    try {
      connectRes = await wcConnector.connect({
        pairingTopic: session?.topic,
        requiredNamespaces: {
          cosmos: {
            methods: ['cosmos_getAccounts', 'cosmos_signDirect', 'cosmos_signAmino'],
            chains: [`cosmos:${options.chainId}`],
            events: [],
          },
        },
      });
    } catch (err) {
      if (session) {
        console.error(err)
        session = null;
        connectRes = await wcConnector.connect({
          requiredNamespaces: {
            cosmos: {
              methods: ['cosmos_getAccounts', 'cosmos_signDirect', 'cosmos_signAmino'],
              chains: [`cosmos:${options.chainId}`],
              events: [],
            },
          },
        });
      } else {
        throw err
      }
    }
    const { uri, approval } = connectRes;
    if (uri) {
      walletConnectModal.openModal({ uri });
    }

    session = await approval();

    if (!isMobileDevice()) {
      accounts = await getAccounts();
    } else {
      accounts = Object.values(session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()
        .map(address => ({
          address: address.split(':')[2], algo: 'secp256k1', pubkey: Uint8Array.from([]),
        }));
    }

    walletConnectModal.closeModal()
  }
  const offlineSigner: OfflineSigner = {
    getAccounts: async() => realAccounts ? Promise.resolve(realAccounts) : await getAccounts(),
    signAmino: async (
      signerBech32Address,
      signDoc,
    ) => {
      const result = await wcConnector.request({
        topic: session!.topic,
        chainId: `cosmos:${options.chainId}`,
        request: {
          method: "cosmos_signAmino",
          params: {
            signerAddress: signerBech32Address,
            signDoc,
          },
        },
      });
      return result as AminoSignResponse;
    },
    signDirect: async (signerBech32Address, signDoc) => {
      const {
        signed: signedInJSON,
        signature,
      } = await wcConnector.request({
        topic: session!.topic,
        chainId: `cosmos:${options.chainId}`,
        request: {
          method: "cosmos_signDirect",
          params: {
            signerAddress: signerBech32Address,
            signDoc: SignDoc.toJSON(signDoc),
          },
        },
      }) as any;
      return {
        signed: SignDoc.fromJSON(signedInJSON),
        signature,
      } as DirectSignResponse;
    },
  };

  return {
    accounts,
    offlineSigner,
  };
}

export async function listenWalletConnectV2StoreChange(
  handler?: EventListenerOrEventListenerObject
) {
  const client = await getWalletConnectV2Connector()
  client.on('session_update', ({ topic, params }) => {
    const { namespaces } = params
    const _session = client.session.get(topic)
    const updatedSession = { ..._session, namespaces } as SessionTypes.Struct
    session = updatedSession
    if (typeof handler === 'function') handler(new Event('session_update'));
  })
  client.on('session_delete', () => {
    session = null
    if (typeof handler === 'function') handler(new Event('session_delete'));
  })
}

export async function onWalletConnectV2Disconnect(targetSession = session) {
  if (targetSession) {
    const client = await getWalletConnectV2Connector()
    client.disconnect({ topic: targetSession.topic, reason: {
      code: 0,
      message: 'USER_DISCONNECTED',
    } })
  }
}

