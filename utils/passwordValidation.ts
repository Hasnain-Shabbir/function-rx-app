export const validatePassword = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLetters || !hasNumbers || !hasSpecialChar) {
    return "Must contain a special character, numbers, and letters";
  }

  return "";
};
