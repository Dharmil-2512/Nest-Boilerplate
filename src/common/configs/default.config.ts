/**
 * Description - Default values
 */
export const Defaults = {
  LOGS_ZIP_FILE: 'logs.zip',
  ERROR_LOG_PATH: 'logs/error.log',
  COMBINED_LOG_PATH: 'logs/combined.log',
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/,
  TOKEN_EXPIRY_TIME: 24,
  FORGOT_PASSWORD_SUBJECT: 'forgot-password',
  REDIRECT_URL_PATH: 'http://localhost:5000/api/auth/reset-password/',
  PASSWORD_CHARS:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  SALT_ROUND: 10,
  RESET_TOKEN_EXPIRY: '1m',
  EMAIL_VERIFICATION_TOKEN_EXPIRY: '2m',
  EMAIL_VERIFY_URL: 'https://www.google.com?token=',
  RESET_PASSWORD_URL: 'https://www.google.com?token=',
  VERIFY_USER_SUBJECT: 'verify-user',
};
