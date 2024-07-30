import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Link } from "react-router-dom";
import "./login.css";
// import "../Home Component/";

function LogIn() {
  const linkO = "https://www.blablacar.in/login";

  return (
    <>
      <div class="container">
        <nav id="nav"></nav>
        <main class="mainSection">
          <div class="loginwrapper">
            <div class="loginheading">
              <h1>How do you want to log in?</h1>
            </div>
            <div class="loginlist">
              <ul>
                <li>
                  <Link to={linkO} class="flex facebook">
                    <span>Continue With Facebook</span>
                    <span>
                      <FontAwesomeIcon
                        icon={"face-smile-plus"}
                      ></FontAwesomeIcon>
                      <FontAwesomeIcon icon={"caret-right"}></FontAwesomeIcon>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/loginemail" class="flex">
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
                Not a member Yet? <Link to="/signup">sign up</Link>
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default LogIn;
