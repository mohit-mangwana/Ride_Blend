import { Link,useNavigate } from "react-router-dom";
import "./email.css";
import { useState, useEffect } from "react";
import Validation from "../Validations/LoginValidation";
import Axios from "axios";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {handleLogin} from '../utils/handleLogin'
import Cookies from 'js-cookie'



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [errors, setErrors] = useState({});

  const passwordVisibilty = () => {
    setShowPassword((prevState) => !prevState);
  };

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the fields
    const errors = Validation(email, password);
    if (Object.keys(errors).length === 0) {
      try {
        // If there are no errors
        // Call the login AP
        const response = await Axios.post("/auth/login", {
          
          email,
          password,
        });
        const token = response.data.token;
        let role = response.data.role;
        if(role === 'admin') role = 'user';
        if (response.status === 200) {
          setEmail("")
            setPassword("");
          toast.success(response.data.message);
          handleLogin(token,role);
          // console.log(token)
          // localStorage.setItem('isLoggedIn', 'true');

          const notificationsResponse = await Axios.get('/notification/getnotifications', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const notifications = notificationsResponse.data;
          // toast.success(notifications.message)
          navigate('/')

        }
       
      } catch (err) {
       
        if (err.response.status === 404) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Something went wrong");
        }
      }
    } else {
      // Set the validation errors
      setErrors(errors);
    }
  };
  // console.log(loggedIn)

  useEffect(() => {
    // Check if the user is logged in (stored in a cookie)
    const isLoggedInCookie = Cookies.get('isLoggedIn');
    if (isLoggedInCookie === 'true') {
      // User is logged in
      setLoggedIn(true);
    } else {
      // User is not logged in
      setLoggedIn(false);
        }
  }, []);

  return (
    <>
      <div className="container">
        <nav id="nav"></nav>
        <main className="mainSection">
          <div className="emailwrapper">
            <div className="emailheading">
              <h1>What's your email and password?</h1>
            </div>
            <form action="" onSubmit={handleSubmit} className="emailform">
              <div className="emailinput ">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className="passwordinput ">
                <div className="pass-div flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    onClick={passwordVisibilty}
                    style={{ cursor: "pointer" }}
                    icon="fa-solid fa-eye"
                  />
                </div>
                {errors.password && (
                  <span className="err">{errors.password}</span>
                )}
              </div>
              <div className="rememberme flex">
                <p>Remember me</p>

                <input type="checkbox" name="remember" id="" />
              </div>
              <div className="forgotpass">
                <Link to="/forgotpassword">Forgot Password</Link>
              </div>
              <div className="loginbtn">
                <button>Log in</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Login;
