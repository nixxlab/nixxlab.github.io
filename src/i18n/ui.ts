export const locales = ['ru', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

/** BCP 47 tags for <html lang>, hreflang and og:locale. */
export const htmlLang: Record<Locale, string> = { ru: 'ru', en: 'en', zh: 'zh-Hans' };
export const ogLocale: Record<Locale, string> = { ru: 'ru_RU', en: 'en_US', zh: 'zh_CN' };
export const localeLabel: Record<Locale, string> = { ru: 'Рус', en: 'Eng', zh: '中文' };

export const ui = {
  ru: {
    'site.description': 'Лаборатория Николая Низовцева',
    'nav.home': 'Записи',
    'nav.projects': 'Проекты',
    'feed.empty': 'Первые записи скоро появятся.',
    'post.discuss': 'Обсудить в Telegram',
    'post.project': 'Проект',
    'tag.title': 'Тема',
    'projects.title': 'Проекты',
    'project.status.idea': 'идея',
    'project.status.active': 'в работе',
    'project.status.released': 'выпущен',
    'project.status.paused': 'на паузе',
    'project.posts': 'Записи о проекте',
    'project.links': 'Ссылки',
    'notFound.title': 'Здесь ничего нет',
    'notFound.home': 'На главную',
  },
  en: {
    'site.description': "Nick's lab",
    'nav.home': 'Writing',
    'nav.projects': 'Projects',
    'feed.empty': 'The first pieces are on their way.',
    'post.discuss': 'Discuss on Telegram',
    'post.project': 'Project',
    'tag.title': 'Topic',
    'projects.title': 'Projects',
    'project.status.idea': 'idea',
    'project.status.active': 'in progress',
    'project.status.released': 'released',
    'project.status.paused': 'paused',
    'project.posts': 'Writing about the project',
    'project.links': 'Links',
    'notFound.title': 'Nothing here',
    'notFound.home': 'Home',
  },
  zh: {
    'site.description': '尼可工坊',
    'nav.home': '文章',
    'nav.projects': '项目',
    'feed.empty': '第一批文章即将发布。',
    'post.discuss': '在 Telegram 讨论',
    'post.project': '项目',
    'tag.title': '主题',
    'projects.title': '项目',
    'project.status.idea': '构想',
    'project.status.active': '进行中',
    'project.status.released': '已发布',
    'project.status.paused': '暂停',
    'project.posts': '关于该项目的文章',
    'project.links': '链接',
    'notFound.title': '这里什么都没有',
    'notFound.home': '返回首页',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['ru'];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}

/** Path of a page in a locale: ru has no prefix, others get /en, /zh. `path` starts with "/". */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  return locale === defaultLocale ? clean : `/${locale}${clean === '/' ? '/' : clean}`;
}

/** Splits a pathname into its locale and the locale-free rest ("/en/blog/x/" → ["en", "/blog/x/"]). */
export function splitLocale(pathname: string): [Locale, string] {
  const [, first, ...rest] = pathname.split('/');
  if ((locales as readonly string[]).includes(first) && first !== defaultLocale) {
    return [first as Locale, `/${rest.join('/')}`];
  }
  return [defaultLocale, pathname];
}

export function formatDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(htmlLang[locale], { dateStyle: 'long' }).format(date);
}
