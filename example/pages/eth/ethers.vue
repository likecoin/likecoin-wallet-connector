<template>
  <v-app>
    <v-app-bar app>
      <template v-if="walletAddress">
        <v-chip label>{{ method }}</v-chip>
        <v-toolbar-title class="ml-4">{{ formattedWalletAddress }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          class="text-truncate"
          outlined
          style="max-width: 150px"
          @click="logout"
        >Logout</v-btn>
      </template>
      <template v-if="walletAddress" v-slot:extension>
        <v-tabs
          v-model="tab"
          grow
        >
          <v-tab key="send">Send</v-tab>
          <v-tab key="sign-arbitrary">Sign Arbitrary</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <v-container v-if="!walletAddress" fill-height>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn
              :loading="isLoading"
              elevation="2"
              @click="connect"
            >Connect</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else fill-height>
        <v-row>
          <v-col>
            <v-card
              :loading="isSending || isSigningArbitrary"
              class="mx-auto my-12"
              max-width="480"
              outlined
            >
              <v-tabs-items v-model="tab">

                <v-tab-item key="send">
                  <v-form
                    class="pa-4"
                    @submit.prevent="send"
                  >
                    <v-text-field
                      :value="walletAddress"
                      label="From address"
                      readonly
                    />
                    <v-text-field
                      v-model="toAddress"
                      label="To address"
                      :disabled="isSending"
                      required
                    />
                    <v-text-field
                      v-model="amount"
                      label="Amount"
                      type="number"
                      :disabled="isSending"
                      suffix="ETH"
                      required
                    />
                    <div class="d-flex justify-end">
                      <v-btn
                        type="submit"
                        :elevation="isSending ? 0 : 2"
                        :disabled="isSending"
                        :loading="isSending"
                      >Send</v-btn>
                    </div>
                  </v-form>
                </v-tab-item>

                <v-tab-item key="sign-arbitrary">
                  <v-form
                    class="pa-4"
                    @submit.prevent="signArbitrary"
                  >
                    <v-text-field
                      :value="signArbitraryMessage"
                      label="Message to sign"
                      required
                    />
                    <div class="d-flex justify-end">
                      <v-btn
                        type="submit"
                        :elevation="isSigningArbitrary ? 0 : 2"
                        :disabled="isSigningArbitrary"
                        :loading="isSigningArbitrary"
                      >Sign</v-btn>
                    </div>
                  </v-form>
                  <v-divider />
                  <v-textarea
                    class="mt-4 mx-4"
                    :value="signArbitraryResult"
                    label="Signature"
                    background-color="grey lighten-4"
                    placeholder="Result"
                    persistent-placeholder
                    outlined
                    readonly
                    auto-grow
                  />
                </v-tab-item>

              </v-tabs-items>
            </v-card>
            <v-alert
              v-model="isShowAlert"
              class="mx-auto"
              :type="error ? 'error' : 'success'"
              elevation="2"
              max-width="480"
              prominent
              dismissible
            >
              <div v-if="error">{{ error }}</div>
              <v-row
                v-else
                align="center"
              >
                <v-col class="grow">The transaction is broadcasted.</v-col>
                <v-col class="shrink">
                  <v-btn
                    :href="txURL"
                    color="white"
                    target="_blank"
                    rel="noreferrer noopener"
                    small
                    outlined
                  >Details</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app>
      <v-container>Demo of ethers + @likecoin/wallet-connector</v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { JsonRpcProvider, formatEther, verifyMessage, parseEther } from 'ethers';

import { LikeCoinWalletConnector, LikeCoinWalletConnectorMethodType } from '../../../dist';

import { AuthcoreSigner } from '~/utils/ethers/AuthcoreSigner';

export default {
  data() {
    return {
      tab: 'send',
      isLoading: true,

      method: undefined,
      walletAddress: '',

      toAddress: '0xCb3152aCb16a60325Abd5Ab0e0CD2174a5292414',
      amount: 1,

      ethSigner: null,
      ethProvider: null,
      ethBalance: 0,

      signArbitraryMessage: 'Hello, @likecoin/wallet-connector!',
      signArbitraryResult: '',

      txHash: '',
      error: '',
      isSending: false,
      isSigningArbitrary: false,
      isShowAlert: false,
    };
  },
  computed: {
    formattedWalletAddress() {
      const address = this.walletAddress;
      const length = address.length;
      return `${address.substring(0, 8)}...${address.substring(length - 3, length)}`;
    },
    txURL() {
      return `https://sepolia-optimism.etherscan.io/tx/${this.txHash}`
    },
    isEthSupported() {
      return !!this.ethSigner;
    },
  },
  async mounted() {
    this.connector = new LikeCoinWalletConnector({
      chainId: 'likecoin-mainnet-2',
      chainName: 'LikeCoin',
      rpcURL: 'https://mainnet-node.like.co/rpc/',
      restURL: 'https://mainnet-node.like.co',
      coinType: 118,
      coinDenom: 'LIKE',
      coinMinimalDenom: 'nanolike',
      coinDecimals: 9,
      coinGeckoId: 'likecoin',
      bech32PrefixAccAddr: 'like',
      bech32PrefixAccPub: 'likepub',
      bech32PrefixValAddr: 'likevaloper',
      bech32PrefixValPub: 'likevaloperpub',
      bech32PrefixConsAddr: 'likevalcons',
      bech32PrefixConsPub: 'likevalconspub',
      availableMethods: [
        LikeCoinWalletConnectorMethodType.LikerId,
        // LikeCoinWalletConnectorMethodType.Keplr,
        // LikeCoinWalletConnectorMethodType.Cosmostation,
      ],
      keplrSignOptions: {
        disableBalanceCheck: true,
        preferNoSetFee: true,
        preferNoSetMemo: true,
      },
      keplrInstallURLOverride: 'https://www.keplr.app/download',
      keplrInstallCTAPreset: 'fancy-banner',
      cosmostationDirectSignEnabled: true,
      language: 'zh',

      authcoreClientId: 'likecoin-app-hidesocial',
      authcoreApiHost: 'https://likecoin-integration-test.authcore.io',
      authcoreRedirectUrl: `http://localhost:3000/in/register?method=liker-id&page=${encodeURIComponent('/eth/ethers')}`,

      onEvent: ({ type, ...payload}) => {
        console.log('onEvent', type, payload);
      },
    });
    const { code, method, ...query } = this.$route.query;
    if (method && code) {
      this.$router.replace({ query })
      const connection = await this.connector.handleRedirect(method, { code });
      if (connection) this.handleConnection(connection);
    } else {
      this.connector.restoreSession();
      const connection = await this.connector.initIfNecessary();
      this.handleConnection(connection);
    }
    this.isLoading = false;
  },
  watch: {
    txHash(value) {
      if (value) {
        this.isShowAlert = true;
      }
    },
    error(value) {
      if (value) {
        this.isShowAlert = true;
      }
    },
  },
  methods: {
    reset() {
      this.offlineSigner = undefined;
      this.walletAddress = '';
      this.signArbitraryResult = '';

      this.txHash = '';
      this.error = '';
      this.isSending = false;
      this.isShowAlert = false;
    },
    handleConnection(connection) {
      if (!connection) return;
      const { method, accounts: [account], offlineSigner, params } = connection;
      this.method = method;
      this.walletAddress = account.address;
      this.offlineSigner = offlineSigner;
      if (params.ethereumProvider) {
        // Connect to the Ethereum network
        const provider = new JsonRpcProvider("https://opt-sepolia.g.alchemy.com/v2/6-pw8XvhGc-oOc-xY3vkWKdrM8lzrtUc");
        this.ethSigner = new AuthcoreSigner(params.ethereumProvider, provider);
        this.ethProvider = provider;
        this.initEth()
      }
      this.connector.once('account_change', this.handleAccountChange);
    },
    async initEth() {
      const walletAddress = await this.ethSigner.getAddress();
      this.walletAddress = walletAddress;
      this.ethBalance = formatEther(await this.ethProvider.getBalance(walletAddress))
    },
    async connect() {
      const connection = await this.connector.openConnectWalletModal();
      if (connection) this.handleConnection(connection);
    },
    logout() {
      this.connector.disconnect();
      this.reset();
    },
    async handleAccountChange(method) {
      const connection = await this.connector.init(method);
      this.handleConnection(connection);
    },

    async send() {
      try {
        this.txHash = '';
        this.error = '';
        this.isShowAlert = false;
        this.isSending = true;
        const tx = await this.ethSigner.sendTransaction({
          to: this.toAddress,
          value: parseEther(this.amount.toString()),
        });
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          this.txHash = receipt.transactionHash;
        } else {
          this.error = receipt;
        }
      } catch (error) {
        this.error = `${error.message || error.name || error}`;
        console.error(error);
      } finally {
        this.isSending = false;
      }
    },

    async signArbitrary() {
      try {
        this.error = '';
        this.isShowAlert = false;
        this.signArbitraryResult = '';
        this.isSigningArbitrary = true;

        this.signArbitraryResult = await this.ethSigner.signMessage(this.signArbitraryMessage);
        if (verifyMessage(this.signArbitraryMessage, this.signArbitraryResult) !== this.walletAddress) {
          throw new Error('Invalid signature');
        }
      } catch (error) {
        this.error = `${error.message || error.name || error}`;
        console.error(error);
      } finally {
        this.isSigningArbitrary = false;
      }
    },
  },
};
</script>
