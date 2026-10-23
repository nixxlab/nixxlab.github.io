import type { Locale } from './i18n/ui';

/** Site identity and external links. An empty value hides its block. */
export const site = {
  name: 'nixxlab',
  author: { ru: 'Николай Низовцев', en: 'Nick Nizovtsev', zh: '尼可·尼佐夫采夫' } satisfies Record<Locale, string>,
  /** Telegram channel (announcements, work in progress). */
  telegramChannel: '',
  /** GoatCounter code: https://<code>.goatcounter.com */
  goatcounter: '',
  email: '',
} as const;
