export function isAllowedOrigin(origin: string | undefined, configuredOrigins: string[], allowCodespacesOrigins: boolean): boolean {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/$/, '');
  if (configuredOrigins.includes(normalizedOrigin)) return true;
  if (allowCodespacesOrigins && /^https:\/\/[-a-z0-9]+-5173\.app\.github\.dev$/i.test(normalizedOrigin)) return true;
  if (allowCodespacesOrigins && /^https:\/\/[-a-z0-9]+-3001\.app\.github\.dev$/i.test(normalizedOrigin)) return true;
  if (/^http:\/\/localhost:(\d+)$/i.test(normalizedOrigin) || /^http:\/\/127\.0\.0\.1:(\d+)$/i.test(normalizedOrigin)) return true;
  return false;
}
