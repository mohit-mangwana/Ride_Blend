export default function Validation(name, email, phoneNumber) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone_pattern = /^\d{10}$/; // Example pattern for a 10-digit phone number

  if (name.trim() === "") {
    errors.name = "Name should not be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email should not be empty";
  } else if (!email_pattern.test(email)) {
    errors.email = "Email is not valid";
  }

  if (phoneNumber.trim() === "") {
    errors.phoneNumber = "Phone number should not be empty";
  } else if (!phone_pattern.test(phoneNumber.trim())) {
    errors.phoneNumber = "Phone number is not valid";
  }

  return errors;
}
