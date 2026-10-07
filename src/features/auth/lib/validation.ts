const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

function emailError(email: string) {
  const value = email.trim();

  if (!value) return "Enter your email address";
  if (value.length > 254 || !EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address";
  }

  return undefined;
}

function passwordError(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 72) return "Password must be at most 72 characters";
  if (!/[A-Za-z]/.test(password)) return "Password must include a letter";
  if (!/\d/.test(password)) return "Password must include a number";
  return undefined;
}

function nameError(value: string, label: string) {
  const name = value.trim();
  if (!name) return `${label} is required`;
  if (name.length > 50) return `${label} must be 50 characters or fewer`;
  return undefined;
}

export function validateLogin(
  values: LoginValues,
): FieldErrors<keyof LoginValues> {
  const errors: FieldErrors<keyof LoginValues> = {};
  const email = emailError(values.email);

  if (email) errors.email = email;
  if (!values.password.trim()) errors.password = "Enter your password";
  else if (values.password.length > 72) {
    errors.password = "Password must be at most 72 characters";
  }

  return errors;
}

export function validateRegister(
  values: RegisterValues,
): FieldErrors<keyof RegisterValues> {
  const errors: FieldErrors<keyof RegisterValues> = {};
  const email = emailError(values.email);
  const password = passwordError(values.password);
  const firstName = nameError(values.firstName, "First name");
  const lastName = nameError(values.lastName, "Last name");
  const phone = values.phone.trim();

  if (firstName) errors.firstName = firstName;
  if (lastName) errors.lastName = lastName;
  if (email) errors.email = email;
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number for the selected country";
  }
  if (password) errors.password = password;
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
