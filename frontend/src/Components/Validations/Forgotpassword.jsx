function Validation(email) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
  
    if (email.trim() === "") {
      errors.email = "Email should not be empty";
    } else if (!email_pattern.test(email)) {
      errors.email = "Email is not valid";
    }

    if (Object.keys(errors).length > 0) {
        return errors;
      }
    
      return {};
}

export default Validation;