import { AccountData, OfflineSigner } from '@cosmjs/proto-signing';
import { KeplrSignOptions } from '@keplr-wallet/types';

export enum LikeCoinWalletConnectorMethodType {
  Keplr = 'keplr',
  KeplrMobile = 'keplr-mobile',
  Cosmostation = 'cosmostation',
  CosmostationMobile = 'cosmostation-mobile',
  LikerId = 'liker-id',
}

export type KeplrInstallCTAPreset = 'origin' | 'simple-banner' | 'fancy-banner';

export interface LikeCoinWalletConnectorConfig {
  chainId: string;
  chainName: string;
  rpcURL: string;
  restURL: string;
  coinType: number;
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
  bech32PrefixAccAddr: string;
  bech32PrefixAccPub: string;
  bech32PrefixValAddr: string;
  bech32PrefixValPub: string;
  bech32PrefixConsAddr: string;
  bech32PrefixConsPub: string;
  gasPriceStepLow?: number;
  gasPriceStepAverage?: number;
  gasPriceStepHigh?: number;

  initAttemptCount?: number;

  /**
   * Usage: https://docs.keplr.app/api/#interaction-options
   */
  keplrSignOptions?: KeplrSignOptions;
  keplrMobileWCBridge?: string;
  keplrInstallURLOverride?: string;
  keplrInstallCTAPreset?: KeplrInstallCTAPreset;

  likerLandAppWCBridge?: string;

  cosmostationAppWCBridge?: string;
  cosmostationDirectSignEnabled?: boolean;

  isShowMobileWarning?: boolean;

  availableMethods?: LikeCoinWalletConnectorMethodType[];
}

export type LikeCoinWalletConnectorOptions = Required<
  LikeCoinWalletConnectorConfig
>;

export interface LikeCoinWalletConnectorMethod {
  name: string;
  type: LikeCoinWalletConnectorMethodType;
  tier: number;
  isMobileOk: boolean;
  url: string;
  description: string;
}

export interface LikeCoinWalletConnectorSession {
  method: LikeCoinWalletConnectorMethodType;
  accounts: AccountData[];
}

export interface LikeCoinWalletConnectorConnectionResult
  extends LikeCoinWalletConnectorSession {
  offlineSigner: OfflineSigner;
}

export type LikeCoinWalletConnectorConnectionResponse =
  | LikeCoinWalletConnectorConnectionResult
  | undefined;

export interface LikeCoinWalletConnectorInitResult {
  accounts: AccountData[];
  offlineSigner: OfflineSigner;
}

export type LikeCoinWalletConnectorInitResponse =
  | LikeCoinWalletConnectorInitResult
  | undefined;

export interface WalletConnectAccountResponse {
  address: Uint8Array;
  algo: string;
  bech32Address: string;
  isNanoLedger: boolean;
  name: string;
  pubKey: string; // In hex
}
