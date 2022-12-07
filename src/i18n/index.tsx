import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from './translations';

function normalizedLanguage(language?: string) {
  switch (language) {
    case 'en':
      return 'en';

    case 'zh':
    default:
      return 'zh';
  }
}

export function initIntl(language?: string) {
  const locale = normalizedLanguage(language);
  const cache = createIntlCache();
  return createIntl(
    {
      locale,
      messages: messages[locale],
      onError: err => {
        if (err.code === 'MISSING_DATA') return;
        console.error(err);
      },
    },
    cache
  );
}

export function IntlProvider(
  props: React.PropsWithChildren<{ language?: string }>
) {
  return (
    <RawIntlProvider value={initIntl(props.language)}>
      {props.children}
    </RawIntlProvider>
  );
}
