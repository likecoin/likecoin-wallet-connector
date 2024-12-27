import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth2';

const createMagic = (key) => {
  return (
    typeof window !== 'undefined' &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
    })
  );
};

export const magic = createMagic("pk_live_FA94FAA174E624B6");
