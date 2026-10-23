import type { APIContext } from 'astro';
import { feed } from '../../lib/rss';
import { localePaths, prefixed } from '../../lib/paths';
import type { Locale } from '../../i18n/ui';

export const getStaticPaths = () => localePaths(prefixed);
export const GET = (ctx: APIContext) => feed(ctx.props.locale as Locale, ctx);
