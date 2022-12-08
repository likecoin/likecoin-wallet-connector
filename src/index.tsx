import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { AccountData } from '@cosmjs/proto-signing';
import WalletConnect from '@walletconnect/client';
import { IQRCodeModal } from '@walletconnect/types';
import EventEmitter from 'events';

import { ConnectionMethodSelectionDialog } from './components/connection-method-selection-dialog';
import { WalletConnectQRCodeDialog } from './components/walletconnect-dialog';

import {
  initCosmostation,
  listenCosmostationAccountChange,
  removeCosmostationAccountChangeListener,
} from './utils/cosmostation';
import {
  getCosmostationMobileWCConnector,
  initCosmostationMobile,
} from './utils/cosmostation-mobile';
import {
  initKeplr,
  listenKeplrKeyStoreChange,
  removeKeplrKeyStoreChangeListener,
} from './utils/keplr';
import {
  getKeplrMobileWCConnector,
  initKeplrMobile,
} from './utils/keplr-mobile';
import {
  getLikerLandAppWCConnector,
  initLikerLandApp,
} from './utils/liker-land-app';
import { deserializePublicKey, serializePublicKey } from './utils/wallet';

import {
  LikeCoinWalletConnectorConfig,
  LikeCoinWalletConnectorConnectionResponse,
  LikeCoinWalletConnectorConnectionResult,
  LikeCoinWalletConnectorInitResponse,
  LikeCoinWalletConnectorMethodType,
  LikeCoinWalletConnectorOptions,
  LikeCoinWalletConnectorSession,
} from './types';

import './style.css';
import { IntlProvider } from './i18n';

export * from './types';

const CONTAINER_ID = 'likecoin-wallet-connector';
const SESSION_KEY = 'likecoin_wallet_connector_session';

const WC_BRIGDE = 'https://bridge.walletconnect.org';

export class LikeCoinWalletConnector {
  public options: LikeCoinWalletConnectorOptions;

  public sessionAccounts: AccountData[];
  public sessionMethod?: LikeCoinWalletConnectorMethodType;

  private _events: EventEmitter;

  private _renderingRoot: Root;

  private _isConnectionMethodSelectDialogOpen = false;
  private _isWalletConnectQRCodeDialogOpen = false;

  private _accountChangeListener?: () => void;

  constructor(options: LikeCoinWalletConnectorConfig) {
    this.options = {
      chainId: options.chainId,
      chainName: options.chainName,
      rpcURL: options.rpcURL,
      restURL: options.restURL,
      coinType: options.coinType,
      coinDenom: options.coinDenom,
      coinMinimalDenom: options.coinMinimalDenom,
      coinDecimals: options.coinDecimals,
      coinGeckoId: options.coinGeckoId || '',
      bech32PrefixAccAddr: options.bech32PrefixAccAddr,
      bech32PrefixAccPub: options.bech32PrefixAccPub,
      bech32PrefixValAddr: options.bech32PrefixValAddr,
      bech32PrefixValPub: options.bech32PrefixValPub,
      bech32PrefixConsAddr: options.bech32PrefixConsAddr,
      bech32PrefixConsPub: options.bech32PrefixConsPub,
      gasPriceStepLow: options.gasPriceStepLow || 1,
      gasPriceStepAverage: options.gasPriceStepAverage || 10,
      gasPriceStepHigh: options.gasPriceStepHigh || 1000,
      initAttemptCount: options.initAttemptCount || 3,
      availableMethods: options.availableMethods || [
        LikeCoinWalletConnectorMethodType.Keplr,
        LikeCoinWalletConnectorMethodType.KeplrMobile,
        LikeCoinWalletConnectorMethodType.LikerId,
        LikeCoinWalletConnectorMethodType.Cosmostation,
      ],
      keplrSignOptions: options.keplrSignOptions || {},
      keplrMobileWCBridge: options.keplrMobileWCBridge || WC_BRIGDE,
      keplrInstallURLOverride: options.keplrInstallURLOverride || '',
      keplrInstallCTAPreset: options.keplrInstallCTAPreset || 'origin',
      likerLandAppWCBridge: options.likerLandAppWCBridge || WC_BRIGDE,
      cosmostationAppWCBridge: options.cosmostationAppWCBridge || WC_BRIGDE,
      cosmostationDirectSignEnabled:
        options.cosmostationDirectSignEnabled || false,
      isShowMobileWarning:
        options.isShowMobileWarning !== undefined
          ? !!options.isShowMobileWarning
          : true,

      language: options.language || 'en',
    };

    this.sessionAccounts = [];

    this._events = new EventEmitter();

    const container = document.createElement('div');
    container.setAttribute('id', CONTAINER_ID);
    document.body.appendChild(container);
    this._renderingRoot = createRoot(container);
  }

  /**
   * @deprecated Please use openConnectionMethodSelectionDialog() instead
   */
  openConnectWalletModal = () => this.openConnectionMethodSelectionDialog();

  openConnectionMethodSelectionDialog = ({
    language = this.options.language,
  } = {}) => {
    if (this._isConnectionMethodSelectDialogOpen)
      return Promise.resolve(undefined);

    if (this.options.language !== language) {
      this.options.language = language;
    }

    return new Promise<LikeCoinWalletConnectorConnectionResponse>(resolve => {
      this._renderingRoot.render(
        <IntlProvider language={language}>
          <ConnectionMethodSelectionDialog
            methods={this.options.availableMethods}
            isShowMobileWarning={this.options.isShowMobileWarning}
            keplrInstallURLOverride={this.options.keplrInstallURLOverride}
            keplrInstallCTAPreset={this.options.keplrInstallCTAPreset}
            onClose={() => {
              this.closeDialog();
              resolve(undefined);
            }}
            onConnect={async method => {
              const result = await this.selectMethod(method);
              resolve(result);
            }}
          />
        </IntlProvider>
      );

      this._isConnectionMethodSelectDialogOpen = true;
    });
  };

  private openWalletConnectQRCodeDialog = (
    type: LikeCoinWalletConnectorMethodType,
    uri: string,
    { language = this.options.language } = {}
  ) => {
    if (this._isWalletConnectQRCodeDialogOpen)
      return Promise.resolve(undefined);

    if (this.options.language !== language) {
      this.options.language = language;
    }

    return new Promise<LikeCoinWalletConnectorConnectionResponse>(resolve => {
      this._renderingRoot.render(
        <IntlProvider language={language}>
          <WalletConnectQRCodeDialog
            type={type}
            uri={uri}
            onClose={() => {
              this.closeDialog();
              resolve(undefined);
            }}
          />
        </IntlProvider>
      );

      this._isWalletConnectQRCodeDialogOpen = true;
    });
  };

  closeDialog = () => {
    this._renderingRoot.render(null);
    this._isConnectionMethodSelectDialogOpen = false;
    this._isWalletConnectQRCodeDialogOpen = false;
  };

  private selectMethod = async (method: LikeCoinWalletConnectorMethodType) => {
    this.closeDialog();

    return this.init(method);
  };

  disconnect = async () => {
    const session = this.loadSession();
    if (session) {
      let wcConnector: WalletConnect | undefined;
      switch (session.method) {
        case LikeCoinWalletConnectorMethodType.Keplr:
          removeKeplrKeyStoreChangeListener(this._accountChangeListener);
          break;

        case LikeCoinWalletConnectorMethodType.KeplrMobile:
          wcConnector = getKeplrMobileWCConnector({
            bridge: this.options.keplrMobileWCBridge,
          });
          break;

        case LikeCoinWalletConnectorMethodType.Cosmostation:
          removeCosmostationAccountChangeListener();
          break;

        case LikeCoinWalletConnectorMethodType.CosmostationMobile:
          wcConnector = getCosmostationMobileWCConnector({
            bridge: this.options.cosmostationAppWCBridge,
          });
          break;

        case LikeCoinWalletConnectorMethodType.LikerId:
          wcConnector = getLikerLandAppWCConnector({
            bridge: this.options.likerLandAppWCBridge,
          });
          break;

        default:
          break;
      }
      if (wcConnector) {
        await wcConnector.killSession();
      }
    }
    this.deleteSession();
    this._events.removeAllListeners();
  };

  private getWCQRCodeDialog: (
    methodType: LikeCoinWalletConnectorMethodType
  ) => IQRCodeModal = (methodType: LikeCoinWalletConnectorMethodType) => ({
    open: uri => {
      this.openWalletConnectQRCodeDialog(methodType, uri);
    },
    close: () => {
      this.closeDialog();
    },
  });

  init = async (methodType: LikeCoinWalletConnectorMethodType) => {
    let initiator: Promise<LikeCoinWalletConnectorInitResponse>;

    switch (methodType) {
      case LikeCoinWalletConnectorMethodType.Keplr:
        initiator = initKeplr(this.options);
        break;

      case LikeCoinWalletConnectorMethodType.KeplrMobile:
        initiator = initKeplrMobile(
          this.options,
          this.getWCQRCodeDialog(LikeCoinWalletConnectorMethodType.KeplrMobile),
          this.sessionMethod,
          this.sessionAccounts
        );
        break;

      case LikeCoinWalletConnectorMethodType.Cosmostation:
        initiator = initCosmostation(this.options);
        break;

      case LikeCoinWalletConnectorMethodType.CosmostationMobile:
        initiator = initCosmostationMobile(
          this.options,
          this.getWCQRCodeDialog(
            LikeCoinWalletConnectorMethodType.CosmostationMobile
          ),
          this.sessionMethod,
          this.sessionAccounts
        );
        break;

      case LikeCoinWalletConnectorMethodType.LikerId:
        initiator = initLikerLandApp(
          this.options,
          this.getWCQRCodeDialog(LikeCoinWalletConnectorMethodType.LikerId),
          this.sessionMethod,
          this.sessionAccounts
        );
        break;

      default:
        this._accountChangeListener = undefined;
        throw new Error('METHOD_NOT_SUPPORTED');
    }

    const result = await initiator;
    if (!result) throw new Error('ACCOUNT_INIT_FAILED');

    this._accountChangeListener = () => {
      this.handleAccountChange(methodType);
    };

    switch (methodType) {
      case LikeCoinWalletConnectorMethodType.Keplr:
        listenKeplrKeyStoreChange(this._accountChangeListener);
        break;

      case LikeCoinWalletConnectorMethodType.Cosmostation:
        listenCosmostationAccountChange(this._accountChangeListener);
        break;

      default:
        break;
    }

    this.saveSession({
      method: methodType,
      accounts: [...result.accounts],
    });

    return {
      method: methodType,
      ...result,
    } as LikeCoinWalletConnectorConnectionResult;
  };

  initIfNecessary: () => Promise<
    LikeCoinWalletConnectorConnectionResponse
  > = async () => {
    const session = this.restoreSession();
    return session?.method ? this.init(session.method) : undefined;
  };

  /**
   * Session
   */
  private saveSession = ({
    method,
    accounts,
  }: LikeCoinWalletConnectorSession) => {
    this.sessionAccounts = accounts;
    this.sessionMethod = method;
    try {
      window.localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          method,
          accounts: accounts.map(account => ({
            ...account,
            pubkey: serializePublicKey(account.pubkey),
          })),
        })
      );
    } catch (error) {
      console.warn(error);
    }
  };

  private loadSession = () => {
    try {
      const serializedSession = window.localStorage.getItem(SESSION_KEY);
      if (serializedSession) {
        const { method, accounts = [] } = JSON.parse(serializedSession);
        if (
          Object.values(LikeCoinWalletConnectorMethodType).includes(method) &&
          Array.isArray(accounts)
        ) {
          return {
            method,
            accounts: accounts.map(account => ({
              ...account,
              pubkey: deserializePublicKey(account.pubkey),
            })),
          } as LikeCoinWalletConnectorSession;
        }
      }
    } catch (error) {
      // Not allow to access local storage/unable to decode session
      console.warn(error);
    }
    return undefined;
  };

  restoreSession = () => {
    const session = this.loadSession();
    if (session) {
      this.sessionAccounts = session.accounts;
      this.sessionMethod = session.method;
      this._accountChangeListener = () => {
        this.handleAccountChange(session.method);
      };
      switch (session.method) {
        case LikeCoinWalletConnectorMethodType.Keplr:
          listenKeplrKeyStoreChange(this._accountChangeListener);
          break;

        default:
          break;
      }
    }
    return session;
  };

  private deleteSession = () => {
    this.sessionAccounts = [];
    this.sessionMethod = undefined;
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.warn(error);
    }
  };

  /**
   * Event
   */
  on = (name: string, listener: (...args: any[]) => void) => {
    return this._events.on(name, listener);
  };

  once = (name: string, listener: (...args: any[]) => void) => {
    return this._events.once(name, listener);
  };

  off = (name: string, listener: (...args: any[]) => void) => {
    return this._events.off(name, listener);
  };

  removeListener = (name: string, listener: (...args: any[]) => void) => {
    return this._events.removeListener(name, listener);
  };

  private handleAccountChange = (
    methodType: LikeCoinWalletConnectorMethodType
  ) => {
    this._events.emit('account_change', methodType);
  };
}
