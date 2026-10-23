import type { Locale } from './i18n/ui';

/** Site identity and external links. An empty value hides its block. */
export const site = {
  name: 'nixxlab',
  author: { ru: 'Николай Низовцев', en: 'Nick Nizovtsev', zh: '尼可·尼佐夫采夫' } satisfies Record<Locale, string>,
  /** Telegram: the channel once it exists; for now the public group. */
  telegram: 'https://t.me/nixxlab',
  /** GoatCounter code: https://<code>.goatcounter.com */
  goatcounter: 'nixxlab',
  email: '',
} as const;
