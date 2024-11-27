import {
  AbstractSigner,
  Transaction,
  hexlify,
  copyRequest,
  resolveAddress,
  resolveProperties,
  toUtf8Bytes,
} from 'ethers';

export class AuthcoreSigner extends AbstractSigner {
  /**
   *  The signer address.
   */
  address = '';
  AuthcoreEthereumProvider = null;

  /**
   *  Creates a new **AuthcoreSigner** with %%AuthcoreEthereumProvider%% attached to
   *  %%provider%%.
   */
  constructor(AuthcoreEthereumProvider, provider) {
    super(provider);
    this.AuthcoreEthereumProvider = AuthcoreEthereumProvider;
  }

  async getAddress() {
    if (this.address) {
      return this.address;
    }
    const addresses = await this.AuthcoreEthereumProvider.getAddresses();
    this.address = addresses[0];
    return this.address;
  }

  connect(provider) {
    return new AuthcoreSigner(this.AuthcoreEthereumProvider, provider);
  }

  #throwUnsupported(suffix, operation) {
    assert(false, `AuthcoreSigner cannot sign ${suffix}`, "UNSUPPORTED_OPERATION", { operation });
  }

  // Modified from https://github.com/ethers-io/ethers.js/blob/9e7e7f3e2f2d51019aaa782e6290e079c38332fb/src.ts/wallet/base-wallet.ts#L71
  async signTransaction(_tx) {
    const tx = copyRequest(_tx);

    const { to, from } = await resolveProperties({
      to: (tx.to ? resolveAddress(tx.to, this.provider) : undefined),
      from: (tx.from ? resolveAddress(tx.from, this.provider) : undefined)
    });

    if (to != null) { tx.to = to; }
    if (from != null) { tx.from = from; }

    if (tx.from != null) {
      assertArgument(getAddress((tx.from)) === this.address,
        "transaction from address mismatch", "tx.from", tx.from);
      delete tx.from;
    }

    const btx = Transaction.from(tx);
    btx.signature = await this.AuthcoreEthereumProvider.signTransaction(btx.unsignedSerialized, this.address.toLowerCase());
    return btx.serialized;
  }

  async signMessage(_message) {
    const message = ((typeof (_message) === "string") ? toUtf8Bytes(_message) : _message);
    return await this.AuthcoreEthereumProvider.signMessage(hexlify(message), this.address.toLowerCase());
  }

  async signTypedData(domain, types, value) {
    this.#throwUnsupported("typed-data", "signTypedData");
  }
}

export default AuthcoreSigner;
