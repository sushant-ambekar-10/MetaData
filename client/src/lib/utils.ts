export const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

export const isExternal = (href: string) => /^https?:\/\//i.test(href);

export const isActivePath = (pathname: string, to: string) =>
  to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);