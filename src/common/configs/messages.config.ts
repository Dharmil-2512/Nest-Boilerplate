/**
 * Description - Constant Error Messages
 */
export const errorMessages = {
  UNEXPECTED_ERROR: 'Unexpected Error',
  USER_NOT_FOUND: 'User not found.',
  RESET_TOKEN_EXPIRED: 'Reset password token is expired.',
  INVALID_SUBJECT: 'Invalid subject type or subject not define, please add valid subject.',
  INCORRECT_PASSWORD: 'Invalid Email or Password.',
  USER_ALREADY_REGISTERED: 'User already registered. Please log in or use a different email to create a new account',
  VERIFICATION_LINK_EXPIRED: 'Email verification link is either invalid or expired',
  INCORRECT_DETAILS: 'Invalid email or password',
  USER_NOT_REGISTERED:
    'The email address is not associated with any account. Please check the email you entered or sign up for an account.',
  EMAIL_NOT_VERIFIED: 'Email not verified. Please verify your email before accessing your account',
  INVALID_TOKEN: 'Invalid token. Please provide a valid authentication token.',
  USER_UNAUTHORIZED: 'Your session has expired. Please log in again.',
};

/**
 * Description - Constant Success Messages
 */
export const successMessages = {
  PASSWORD_RESET: 'Password changed successfully.',
  USER_ADDED: 'User added successfully.',
  USER_LOGGED_IN: 'User logged in successfully.',
  EMAIL_VERIFIED: 'Email verified successfully. You can now access your account.',
  FORGOT_PASSWORD: 'Please check your email for the password reset link.',
};

/**
 * Description - Constant Validation Messages
 */
export const validationMessages = {
  FIRST_NAME_IS_ALPHA: 'Invalid input. Special characters or numbers are not allowed in the first name',
  LAST_NAME_IS_ALPHA: 'Invalid input. Special characters or numbers are not allowed in the last name',
  PASSWORD_IS_VALID:
    'Password should contain minimum 8 characters 1 small letter or capital letter , 1 number and 1 special characters',
  DATE_OF_BIRTH_ISO_STRING: 'The date of birth should be represented in the ISO 8601 standard format',
};

/**
 * Description - Common function for required field validation message
 * @param fieldName string
 * @returns Validation message
 */
export const fieldRequired = (fieldName: string): string => {
  return `Invalid input. The field is required.${fieldName}`;
};

/**
 * Description - Common function for invalid field validation message
 * @param fieldName string
 * @returns Validation message
 */
export const fieldInvalid = (fieldName: string): string => {
  return `${fieldName} is invalid`;
};

/**
 * Description - Common function for minimum length field validation
 * @param fieldName string
 * @param length number
 * @returns Validation message
 */
export const minimumLength = (fieldName: string, length: number): string => {
  return `${fieldName} should have atleast ${length} characters`;
};

/**
 * Description - Common function for maximum length field validation
 * @param fieldName string
 * @param length number
 * @returns Validation message
 */
export const maximumLength = (fieldName: string, length: number): string => {
  return `${fieldName} should have maximum ${length} characters`;
};
