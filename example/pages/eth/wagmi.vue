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
              @click="connect({ connector, chainId })"
            >Connect {{ connector }}</v-btn>
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
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useDisconnect,
  useSignMessage,
  useWaitForTransactionReceipt,
} from 'use-wagmi'
import { parseEther, verifyMessage } from 'viem';

export default {
  setup() {
    const { address, connector } = useAccount()
    const { connect } = useConnect()
    const { data: hash, sendTransaction } = useSendTransaction()
    const { disconnect } = useDisconnect()
    const { signMessage } = useSignMessage()
    return {
      walletAddress: address,
      connector,
      connect,
      txHash: hash,
      sendTransaction,
      disconnect,
      signMessage,
      useWaitForTransactionReceipt,
    };
  },
  data() {
    return {
      tab: 'send',
      isLoading: false,

      toAddress: '0xCb3152aCb16a60325Abd5Ab0e0CD2174a5292414',
      amount: 1,

      signArbitraryMessage: 'Hello, @likecoin/wallet-connector!',
      signArbitraryResult: '',

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
      this.signArbitraryResult = '';

      this.txHash = '';
      this.error = '';
      this.isSending = false;
      this.isShowAlert = false;
    },
    logout() {
      this.disconnect()
      this.reset()
    },
    async handleAccountChange(method) {
    },

    async send() {
      try {
        this.error = '';
        this.isShowAlert = false;
        this.isSending = true;
        this.sendTransaction({
          to: this.toAddress,
          value: parseEther(this.amount.toString()),
        })
        const { isLoading:isConfirming, isSuccess: isConfirmed } = this.useWaitForTransactionReceipt({
          hash: this.txHash,
        })
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

        this.signArbitraryResult = await this.signMessage({ message: this.signArbitraryMessage });
        const valid = await verifyMessage(
          { message: this.signArbitraryMessage,
            signature: this.signArbitraryResult,
            address: this.walletAddress
          })
        if (!valid) {
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
