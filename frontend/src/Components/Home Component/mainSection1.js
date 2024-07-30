import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./home.css";
import "./meadiQuerry.css";

function MainSection() {
  const imgAdd =
    "https://cdn.blablacar.com/kairos/assets/images/scamDetective-653544b71d88f51797db.svg";
  const imgSS =
    "https://cdn.blablacar.com/kairos/assets/images/driver-c3bdd70e6a29c6af9ef1.svg";
  return (
    <>
      <main className="mainSection2  flex">
        <div className="sections1 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"coins"}
          ></FontAwesomeIcon>
          <h3>Your pick of rides at low prices</h3>
          <p>
            No matter where you’re going, by bus or carpool find the perfect
            ride from our wide range of destinations and routes at low prices
          </p>
        </div>
        <div className="sections2 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"address-card"}
          ></FontAwesomeIcon>
          <h3>Trust who you travel with</h3>
          <p>
            We take the time to get to know each of our members and bus
            partners. We check reviews, profiles and IDs, so you know who you’re
            travelling with and can book your ride at ease
          </p>
        </div>
        <div className="sections3 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"bolt"}
          ></FontAwesomeIcon>
          <h3>Your pick of rides at low prices</h3>
          <p>
            No matter where you’re going, by bus or carpool find the perfect
            ride from our wide range of destinations and routes at low prices
          </p>
        </div>
      </main>
      <main className="mainSection3  flex">
        <div className="sectionImg">
          <img src={imgAdd} alt="" />
        </div>
        <div className="sectionText">
          <h1>Your safety is our priority</h1>
          <p>
            At BlaBlaCar, we're working hard to make our platform as secure as
            it can be. But when scams do happen, we want you to know exactly how
            to avoid and report them. Follow our tips to help us keep you safe.
          </p>
          <button id="btn">Learn More</button>
        </div>
      </main>
      <main className="mainSection4 flex">
        <div className="sectionText">
          <h1>Driving in your car soon?</h1>
          <p>
            Good news, drivers: get rewarded for your good habits! Earn the
            Carpool Bonus by completing 3 carpools in 3 months. See eligibility
            conditions.{" "}
          </p>
          <button id="btn">Offer a Ride</button>
        </div>
        <div className="sectionImg">
          <img src={imgSS} alt="" srcset="" />
        </div>
      </main>
    </>
  );
}

export default MainSection;
