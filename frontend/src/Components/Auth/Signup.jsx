import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./login.css";
// import "./meadiQuerry.css";

function SignUp() {
  const linkO = "https://www.blablacar.in/login";
  return (
    <>
      <div class="container">
        <nav id="nav"></nav>
        <main class="mainSection">
          <div class="loginwrapper">
            <div class="loginheading">
              <h1>How do you want to Sign Up?</h1>
            </div>
            <div class="loginlist">
              <ul>
                <li>
                  <Link to={linkO} class="flex facebook">
                    <span>Continue With Facebook</span>
                    <span>
                      <FontAwesomeIcon icon={"facebook"}></FontAwesomeIcon>
                      <FontAwesomeIcon icon={"caret-right"}></FontAwesomeIcon>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/signupemail" class="flex">
                    <span>Continue With email</span>
                    <span>
                      <FontAwesomeIcon icon={"caret-right"}></FontAwesomeIcon>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div class="loginoption">
              <span>
                Already a member? <Link to="/login">login</Link>
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default SignUp;
