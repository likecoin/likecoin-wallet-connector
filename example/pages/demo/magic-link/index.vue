<template>
  <v-app>
    <v-app-bar app>
      <template v-if="isLoggedIn">
        <v-toolbar-title class="ml-4">{{ formattedWalletAddress }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          class="text-truncate"
          outlined
          style="max-width: 150px"
          :disabled="isLoading"
          @click="logout"
        >Logout</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container v-if="isLoading" fill-height>
        <v-row>
          <v-col class="d-flex justify-center align-center">
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="isLoggedIn" fill-height>
        <v-row>
          <v-col class="d-flex flex-column justify-center align-center">
            You are logged in.

            <v-btn
              class="mt-3"
              elevation="2"
              @click="showWalletUI"
            >Wallet UI</v-btn>
            <v-btn
              class="mt-3"
              elevation="2"
              @click="showSettings"
            >Settings</v-btn>
            <v-btn
              class="mt-3"
              elevation="2"
              @click="exportPrivateKey"
            >Export Private Key</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else fill-height>
        <v-row>
          <v-col class="d-flex flex-column justify-center align-center">
            <v-btn
              elevation="2"
              @click="loginWithEmail"
            >Login With Email</v-btn>
            <v-btn
              class="mt-3"
              elevation="2"
              @click="loginWithGoogle"
            >Login With Google</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <v-container>Demo of Magic Link</v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { magic } from '~/utils/magic-link';

export default {
  name: 'MagicLinkDemo',
  data() {
    return {
      magic: null,
      isLoading: true,
      isLoggedIn: false,
      walletAddress: '',
    }
  },
  computed: {
    formattedWalletAddress() {
      const address = this.walletAddress;
      const length = address.length;
      return `${address.substring(0, 8)}...${address.substring(length - 3, length)}`;
    },
  },
  async mounted() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      try {
        this.isLoggedIn = await magic.user.isLoggedIn();
        if (this.isLoggedIn) {
          const userMetadata = await magic.user.getMetadata();
          console.log(userMetadata);
          this.walletAddress = userMetadata.publicAddress;
        }
      } finally {
        this.isLoading = false;
      }
    },
    async loginWithEmail() {
      try {
        const [accounts] = await magic.wallet.connectWithUI();
        this.walletAddress = accounts[0];
      } catch (error) {
        console.error(error);
      }
    },
    async loginWithGoogle() {
      try {
        const result = await magic.oauth2.loginWithRedirect({
          provider: 'google',
          redirectURI: new URL("/demo/magic-link/oauth/redirect", window.location.origin).href,
          scope: [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ],
        });
        const { publicAddress } = result.magic.userMetadata;
        this.walletAddress = publicAddress;
      } catch (error) {
        console.error(error);
      }
    },
    async showWalletUI() {
      try {
        await magic.wallet.showUI();
      } catch (error) {
        console.error(error);
      }
    },
    async showSettings() {
      try {
        await magic.user.showSettings();
      } catch (error) {
        console.error(error);
      }
    },
    async exportPrivateKey() {
      try {
        await magic.user.revealPrivateKey();
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      if (!this.isLoggedIn || this.isLoading) {
        return;
      }
      try {
        this.isLoading = true
        await magic.user.logout();
        this.isLoggedIn = await magic.user.isLoggedIn();
        this.walletAddress = '';
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  }
}
</script>
