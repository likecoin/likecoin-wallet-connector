<template>
  <v-app>
    <v-app-bar app />

    <v-main>
      <v-container fill-height>
        <v-row>
          <v-col class="d-flex flex-column justify-center align-center">
            <v-progress-circular
              indeterminate
              color="primary"
            />

            Redirecting...
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
import { magic } from "~/utils/magic-link";

export default {
  name: 'MagicLinkDemoOAuthRedirect',
  async mounted() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      try {
        const result = await magic.oauth2.getRedirectResult();
        console.log(result);
        this.$router.push({ name: 'demo-magic-link' });
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  }
}
</script>
