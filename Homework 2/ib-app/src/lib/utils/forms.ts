import { SigninFormData } from "@/app/auth/signin/signin-form";
import { SignupFormData } from "@/app/auth/signup/signup-form";

export function validateSignupForm(formData: SignupFormData) {
  const { username, email, password, confirmPassword } = formData;

  if (!username || !email || !password || !confirmPassword) {
    return "All fields are required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return "Invalid email address";
  }

  return null;
}

export function validateSigninForm(formData: SigninFormData) {
  const { email, password } = formData;

  if (!email || !password) {
    return "All fields are required";
  }

  return null;
}

export function validateSignupCode(code: string) {
  if (!code || code.length !== 6) {
    return "Invalid code";
  }

  return null;
}
