function LoginValidation(email, password) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
  
    if (!email || typeof email !== "string") {
      errors.email = "Email is required";
    } else if (email.trim() === "") {
      errors.email = "Email should not be empty";
    } else if (!email_pattern.test(email)) {
      errors.email = "Email is not valid";
    }
  
    if (!password || typeof password !== "string") {
      errors.password = "Password is required";
    } else if (password.trim() === "") {
      errors.password = "Password should not be empty";
    } else if (!password_pattern.test(password)) {
      errors.password = "Password is not valid";
    }
  
    // Only return errors if there are any
    if (Object.keys(errors).length > 0) {
      return errors;
    }
  
    return {}; // Return an empty object if there are no errors
  }
  
  export default LoginValidation;
  