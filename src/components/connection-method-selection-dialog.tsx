import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isMobile as isMobileDevice } from '@walletconnect/browser-utils';

import {
  KeplrInstallCTAPreset,
  LikeCoinWalletConnectorMethod,
  LikeCoinWalletConnectorMethodConfig,
  LikeCoinWalletConnectorMethodType,
} from '../types';

import { SignInIcon } from './icons/sign-in';

import { Alert } from './alert';
import { ConnectionMethodList } from './connection-method-list';
import { Dialog } from './dialog';

const connectionMethodMap = [
  {
    type: LikeCoinWalletConnectorMethodType.Keplr,
    name: 'Keplr',
    tier: 1,
    isInstalled: false,
    isMobileOk: false,
    url:
      'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
    description: 'connect_wallet_method_description_keplr',
  },
  {
    type: LikeCoinWalletConnectorMethodType.KeplrMobile,
    name: 'Keplr Mobile',
    tier: 1,
    isInstalled: false,
    isMobileOk: true,
    url: 'https://keplr.app/app',
    description: 'connect_wallet_method_description_keplr_mobile',
  },
  {
    type: LikeCoinWalletConnectorMethodType.LikerId,
    name: 'Liker ID',
    tier: 1,
    isInstalled: false,
    isMobileOk: true,
    url: 'https://liker.land/getapp',
    description: 'connect_wallet_method_description_liker_land_app',
  },
  {
    type: LikeCoinWalletConnectorMethodType.Cosmostation,
    name: 'Cosmostation',
    tier: 2,
    isInstalled: false,
    isMobileOk: false,
    url:
      'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf',
    description: 'connect_wallet_method_description_cosmostation',
  },
  {
    type: LikeCoinWalletConnectorMethodType.CosmostationMobile,
    name: 'Cosmostation App',
    tier: 2,
    isInstalled: false,
    isMobileOk: true,
    url: 'https://www.cosmostation.io/wallet',
    description: 'connect_wallet_method_description_cosmostation_mobile',
  },
  {
    type: LikeCoinWalletConnectorMethodType.Leap,
    name: 'Leap Wallet',
    tier: 2,
    isInstalled: false,
    isMobileOk: false,
    url:
      'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    description: 'connect_wallet_method_description_leap',
  },
  {
    type: LikeCoinWalletConnectorMethodType.WalletConnectV2,
    name: 'WalletConnect V2',
    tier: 2,
    isInstalled: false,
    isMobileOk: true,
    url: '',
    description: 'connect_wallet_method_description_wallet_connect_v2',
  },
].reduce(
  (map, method) => {
    map[method.type] = method;
    return map;
  },
  {} as {
    [type in LikeCoinWalletConnectorMethodType]: LikeCoinWalletConnectorMethod;
  }
);

export interface ConnectionMethodSelectionDialogProps
  extends HTMLAttributes<HTMLDivElement> {
  methods: LikeCoinWalletConnectorMethodConfig[];
  isShowMobileWarning?: boolean;
  keplrInstallURLOverride?: string;
  keplrInstallCTAPreset?: KeplrInstallCTAPreset;
  title?: string;
  mobileWarning?: string;
  onClose?: () => void;
  onConnect?: (method: LikeCoinWalletConnectorMethodType, params?: any) => void;
}

/**
 * Connection Method Selection Dialog
 */
export const ConnectionMethodSelectionDialog: FC<ConnectionMethodSelectionDialogProps> = ({
  methods,
  isShowMobileWarning = true,
  keplrInstallURLOverride,
  keplrInstallCTAPreset,
  title,
  mobileWarning,
  onClose,
  onConnect,
}) => {
  const intl = useIntl();
  const [isDialogOpen, setDialogOpen] = React.useState(true);

  const isMobile = React.useMemo(isMobileDevice, []);

  const isKeplrNotInstalled = !isMobile && !window.keplr;

  const tieredConnectionMethods = React.useMemo(() => {
    const filteredMethods: LikeCoinWalletConnectorMethod[] = [];
    methods.forEach(config => {
      let type: LikeCoinWalletConnectorMethodType;
      let method: LikeCoinWalletConnectorMethod;
      if (Array.isArray(config)) {
        type = config[0];
        method = { ...connectionMethodMap[type], ...config[1] };
      } else {
        type = config;
        method = { ...connectionMethodMap[type] };
      }

      // Hide desktop only method in mobile
      if (isMobile && !method.isMobileOk) {
        return;
      }

      if (
        type === LikeCoinWalletConnectorMethodType.Keplr &&
        keplrInstallURLOverride
      ) {
        method.url = keplrInstallURLOverride;
      }
      method.description = intl.formatMessage({ id: method.description });

      switch (type) {
        case LikeCoinWalletConnectorMethodType.Keplr:
          method.isInstalled = !!window.keplr;
          break;
        case LikeCoinWalletConnectorMethodType.Cosmostation:
          method.isInstalled = !!window.cosmostation;
          break;
        case LikeCoinWalletConnectorMethodType.Leap:
          method.isInstalled = !!window.leap;
          break;
        default:
          method.isInstalled = false;
          break;
      }
      filteredMethods.push(method);
    });
    let hasShownInstalledWallet = !filteredMethods.some(
      method => method.isInstalled
    );
    const getTier = (method: LikeCoinWalletConnectorMethod) => {
      if (!hasShownInstalledWallet) {
        if (method.isInstalled) {
          // Show only one installed wallet method
          hasShownInstalledWallet = true;
          return 1;
        }
        return 2;
      }
      // Collapse tier 1 mobile connection method in desktop
      if (!isMobile && method.isMobileOk && method.tier === 1) {
        return 2;
      }
      // if none of wallet is detected, fallback to default tier
      return method.tier || 2;
    };
    const tieredMethods = filteredMethods.reduce((tieredMethods, method) => {
      const tier = getTier(method);
      if (!tieredMethods[tier]) {
        tieredMethods[tier] = new Array<LikeCoinWalletConnectorMethod>();
      }
      tieredMethods[tier].push(method);
      return tieredMethods;
    }, {} as { [tier: number]: LikeCoinWalletConnectorMethod[] });
    // The returned array will be sorted by tier
    return Object.values(tieredMethods);
  }, [methods, isMobile, keplrInstallURLOverride, intl]);

  function closeDialog() {
    setDialogOpen(false);
    if (onClose) onClose();
  }

  return (
    <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
      {!(isKeplrNotInstalled && keplrInstallCTAPreset === 'fancy-banner') && (
        <h1 className="lk-flex lk-items-center lk-gap-x-[12px] lk-text-like-green lk-font-bold lk-mb-[24px]">
          <SignInIcon className="lk-w-[20px] lk-h-[20px] lk-shrink-0" />
          <span>{title || <FormattedMessage id="connect_wallet_title" />}</span>
        </h1>
      )}
      {isMobile && isShowMobileWarning && (
        <Alert className="lk-mb-[24px]">
          <p>
            {mobileWarning || (
              <FormattedMessage id="warning_wallet_connect_mobile" />
            )}
          </p>
        </Alert>
      )}
      {tieredConnectionMethods.map((methods, index) => (
        <ConnectionMethodList
          key={`group-${index}`}
          methods={methods}
          isMobile={isMobile}
          keplrInstallCTAPreset={keplrInstallCTAPreset}
          isCollapsible={index !== 0}
          collapsibleToggleButtonTitle={intl.formatMessage({
            id: 'connect_wallet_other_methods',
          })}
          onSelectMethod={onConnect}
        />
      ))}
    </Dialog>
  );
};
