import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import imgSrc from "../Assets/ride-blend-favicon-color.png";
import Fb from "../Assets/asset 124.svg";
import X from "../Assets/asset 125.svg";
import IG from "../Assets/asset 126.svg";
import YT from "../Assets/asset 128.svg";
import SC from "../Assets/asset 129.svg";
import "../Home/footer.css";

function footerSection() {
  // const imgSrc = '../Assets/ride-blend-favicon-color.png'

  return (
    <>
      <footer className="footerContainer  overflow ">
        <div className="listitems ">
          <div className="listitem flex">
            <h3>Top Carpool Routes</h3>
            <Link>
              Mumbai
              <FontAwesomeIcon
                className="iconColor"
                icon={"arrow-right"}
              ></FontAwesomeIcon>
              Pune
            </Link>
            <Link>
              Kanpur
              <FontAwesomeIcon
                className="iconColor"
                icon={"arrow-right"}
              ></FontAwesomeIcon>
              Lucknow
            </Link>
            <Link>
              Delhi
              <FontAwesomeIcon
                className="iconColor"
                icon={"arrow-right"}
              ></FontAwesomeIcon>
              Chandigarh
            </Link>
            <Link>
              Bengluru
              <FontAwesomeIcon
                className="iconColor"
                icon={"arrow-right"}
              ></FontAwesomeIcon>
              Chennai
            </Link>
            <Link>
              Pune
              <FontAwesomeIcon
                className="iconColor"
                icon={"arrow-right"}
              ></FontAwesomeIcon>
              Mumbai
            </Link>
            <Link>All Car Poll routes</Link>
            <Link>All Car Poll Destinations</Link>
          </div>
          <div className="listitem flex">
            <h3>About Us</h3>
            <Link>How It Work</Link>
            <Link>About Us</Link>
            <Link>Help Center</Link>
            <Link>Press</Link>
            <Link>We are Hiring!</Link>
          </div>
        </div>
        <div className="footerLogo overflow ">
          <div className="language flex">
            <span>Language</span>
            <select name="" className="languages">
              <option hidden>Select A Language</option>
              <option value="eng">Punjabi</option>
              <option value="eng">Hindi</option>
              <option value="eng">English</option>
              <option value="eng">Marathi</option>
              <option value="eng">Tamil</option>
              <option value="eng">Telgu</option>
            </select>
          </div>
          <div className="logo flex " style={{gap:'20px'}}>
            <Link>
            <img src={Fb} style={{height:'30px'}} alt="" />
            </Link>
            <Link>
            <img src={X} style={{height:'30px'}} alt="" />
            </Link>
            <Link>
            <img src={YT} style={{height:'30px'}} alt="" />
            </Link>
            <Link>
            <img src={IG} style={{height:'30px'}} alt="" />
            </Link>
            <Link>
            <img src={SC} style={{height:'30px'}} alt="" />
            </Link>
          </div>
        </div>
      </footer>
      <footer className="footerterms padding flex" style={{justifyContent:"space-around"}}>
        <div className="conditions">
          <span>Terms & Conditions</span>
        </div>
        <div className="footerText">
          <span className="flex spanText">
            <img
              src={imgSrc}
              style={{ width: "50px", height: "50px" }}
              alt=""
            />
            <span>Ride Blend,2023 ©</span>
          </span>
        </div>
      </footer>
    </>
  );
}

export default footerSection;
