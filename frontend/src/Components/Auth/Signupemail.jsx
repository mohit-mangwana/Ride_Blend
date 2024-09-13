import "./email.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Validation from "../Validations/SignupValidation";
import Axios from "axios";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIurl } from "../utils/utils";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [travelPreferences, setTravelPreferences] = useState([
    { name: "Smoking", option: "Non-smoking" },
    { name: "Music", option: "No preference" },
  ]);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const passwordVisibilty = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("outside");
    // Validate the fields
    const errors = Validation(name, email, phoneNumber);

    if (Object.keys(errors).length === 0) {
      try {
        // If there are no errors
        // Call the signup API
        console.log("inside");

        // Log the data being sent
        console.log("Sending data:", { name, email, password, phoneNumber, role: 'user', travelPreferences });

        const response = await Axios.post(`${APIurl}/auth/signup`, {
          name,
          email,
          password,
          phoneNumber,
          role: 'user',
          travelPreferences,
        });

        console.log("Response received:", response);

        toast.success(response.data.message);
        navigate("/loginemail");
      } catch (err) {
        console.error("Error during signup:", err);
        if (err.response && err.response.status === 401) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    } else {
      // Set the validation errors
      setErrors(errors);
    }
  };

  return (
    <>
      <div className="container">
        <nav id="nav"></nav>
        <main className="mainSection">
          <div className="emailwrapper">
            <div className="emailheading">
              <h1>What's your email and password?</h1>
            </div>
            <form onSubmit={handleSubmit} className="emailform">
              <div className="nameinput">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="nameinput">
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && <span className="err">{errors.phoneNumber}</span>}
              </div>
              <div className="emailinput">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className="passwordinput">
                <div className="pass-div flex">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FontAwesomeIcon onClick={passwordVisibilty} style={{ cursor: 'pointer' }} icon="fa-solid fa-eye" />
                </div>
                {errors.password && <span className="err">{errors.password}</span>}
              </div>
              <div className="rememberme flex">
                <p>Remember me</p>
                <input type="checkbox" name="remember" id="" />
              </div>
              <div className="loginbtn">
                <button>Sign In</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Register;
