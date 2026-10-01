const REQUIRED = [
  'DATABASE_URL',
  'WEB_URL',
  'JWT_ACCESS_SECRET',
  'JWT_RESET_SECRET',
  'TURNSTILE_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'MAIL_FROM',
] as const;

export function validateEnv(config: Record<string, unknown>) {
  const missing = REQUIRED.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return config;
}
