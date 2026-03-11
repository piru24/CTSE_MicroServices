export const validateEmail = (email) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => 
  password.length >= 8;

export const validatePhone = (phone) =>
  /^[0-9]{10}$/.test(phone);

export const validateName = (name) => 
  /^[A-Za-z\s]{2,}$/.test(name);
  // Exporting all validators as a single object for easier imports
  const validators = {
    validateEmail,
    validatePassword,
    validatePhone,
    validateName,
  };

  export default validators;