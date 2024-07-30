import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Validation from "../../Components/Validations/SignupValidation.jsx";
import Axios from "axios";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [showPassword, setShowPassword] = useState(false);

  
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const passwordVisibilty = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate the fields
    const errors = Validation(name, email, password);
    
    if (Object.keys(errors).length === 0) {
      try {
        // If there are no errors
        // Call the signup API
        const response = await Axios.post("http://localhost:4000/auth/signup", {
          name,
          email,
          password,
          phoneNumber,
          role:'admin',
        });
        toast.success(response.data.message);
        navigate("/adminlogin");
      } catch (err) {
        if(err.response.status === 401) {
          toast.error(err.response.data.message);

        }else{
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
              
              <div className="nameinput ">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="nameinput ">
                <input
                  type="number"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="emailinput ">
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
                <FontAwesomeIcon onClick={passwordVisibilty} style={{cursor:'pointer'}} icon="fa-solid fa-eye" />
                </div>

                {errors.password && (
                  <span className="err">{errors.password}</span>
                )}
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
