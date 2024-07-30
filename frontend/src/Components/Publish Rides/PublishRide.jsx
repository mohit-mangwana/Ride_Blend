import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Carousel from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PublishRide.css";
import Footer from "../Home Component/Footer";
import "../Home/meadiQuerry.css";
import PublishForm from "./PublishForm";

export default function PublishRide() {

  return (
    <>
      <div className="publish-form-container">
        <div className="form-header">
          <h1>
            Become a Ride Blender Driver and save on travel cost by sharing your
            ride with passenger
          </h1>

          <div className="form-container">
            <PublishForm/>
            <div className="form-img"></div>
          </div>
        </div>
      </div>
      <div className="publish-text-heading">
        <h1>The best of car pooling with Ride Blend</h1>
      </div>
      <main className="mainSectionn  flex">
        <div className="sections1 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"coins"}
          ></FontAwesomeIcon>
          <h3>Save on travel costs</h3>
          <p>
            Share your ride with passengers on your way, and save every time you
            travel by car. Sign up as a driver to start saving on travel costs.
          </p>
        </div>
        <div className="sections2 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"address-card"}
          ></FontAwesomeIcon>
          <h3>Join a trustworthy community</h3>
          <p>
            We know each of our members: both drivers and passengers. We verify
            ratings, profiles and IDs, so you know exactly who you’re travelling
            with.
          </p>
        </div>
        <div className="sections3 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"bolt"}
          ></FontAwesomeIcon>
          <h3>Carpooling made simple</h3>
          <p>
            Our technology makes the entire experience with Ride Blend simple,
            so you can easily find, chat with and meet passengers right on your
            way.
          </p>
        </div>
      </main>
      <div class="kirk-card">
        <ul class=" flex">
          <li class="sc-5f081ebf-3 hFofJD">
            <h1 class="">Join 21 million </h1>
            <span class="">drivers already using BlaBlaCar</span>
          </li>
          <li class="sc-5f081ebf-3 hFofJD">
            <h1 class="">More than 100 million</h1>
            <span class="">BlaBlaCar members worldwide</span>
          </li>
          <li class="sc-5f081ebf-3 hFofJD">
            <h1 class="sc-8c6da2f4-0 sc-f0db4122-0 izgkiJ eudZoN">
              Over 40 million
            </h1>
            <span class="sc-8c6da2f4-0 sc-ee53e3e7-0 izgkiJ kLMtxC">
              rides shared per year
            </span>
          </li>
        </ul>
      </div>
      <div className="carousal ">
        <div className="photo-section"></div>
        <div className="carousal-parent">
          <div className="carousel-section">
            <Carousel
              dots={true} // Enable dot navigation
              infinite={true}
              slidesToShow={1} // Display three slides at a time
              slidesToScroll={1}
            >
              {/* Your carousel slides go here */}
              <div className="slide">
                <h2>
                  5 years of using Ride Blend, dozens of journeys, as many
                  meetings and exchanges, not a single disappointment. THANK
                  YOU!
                </h2>
                <p>Mohit</p>
              </div>
              <div className="slide">
                <h2>
                  The benefit is always mutual, it only takes one passenger to
                  turn a simple ride into an unexpected journey.
                </h2>
                <p>Simons</p>
              </div>
              <div className="slide">
                <h2>
                  More than 400€ paid into my account thanks to BlaBlaCar, even
                  though I've only been using it for a few months... There's no
                  denying how good their app is!
                </h2>
                <p>Daniel</p>
              </div>
              {/* Add more slides as needed */}
            </Carousel>
          </div>
        </div>
      </div>
      <div
        className="publish-text-heading"
        style={{ backgroundColor: "#ededed" }}
      >
        <h1 style={{ padding: "1rem" }}>We’re here every step of the way</h1>
      </div>
      <main
        className="mainSectionn  flex"
        style={{ backgroundColor: "#ededed" }}
      >
        <div className="sections1 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"fa-message"}
          ></FontAwesomeIcon>
          <h3>At your service 24/7</h3>
          <p>
            Our team is at your disposal to answer any questions by email or
            social media. You can also have a live chat directly with
            experienced members.
          </p>
        </div>
        <div className="sections2 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"fa-taxi"}
          ></FontAwesomeIcon>
          <h3>Ride Blend at your side</h3>
          <p>
            For just 2 €, benefit from the reimbursement of up to 1,500€ of your
            excess when you publish a ride as a driver on Ride Blend.
          </p>
        </div>
        <div className="sections3 sections">
          <FontAwesomeIcon
            className="iconColor"
            icon={"bolt"}
          ></FontAwesomeIcon>
          <h3>100% secure information</h3>
          <p>
            Our team is dedicated to the protection of your data, which is
            always 100% confidential thanks to monitoring tools, secure
            navigation and encrypted data.
          </p>
        </div>
      </main>
      <main class="helpCenter overflow">
        <div class="helpheading">
          <h1>Everything you need as a driver, in our Help Centre</h1>
        </div>
        <div class="helpGrid1">
          <div class="helpSection">
            <h4>How do I set the passenger contribution for my ride?</h4>
            <p>
              We recommend a contribution per passenger on your rides. These
              suggestions help you set fair contributions for your rides (those
              most likely to get your seats filled!)
            </p>
          </div>
          <div class="helpSection">
            <h4>When do I get my money?</h4>
            <p>
              We send your money 48 hours after the ride if you travelled as
              planned. You’ll get your money 1 to 5 weekdays (not counting
              weekends and holidays) after we send it.{" "}
            </p>
          </div>
          <div class="helpSection">
            <h4>How much does a carpool ride cost?</h4>
            <p>
              The costs of a carpool ride can vary greatly, and depend on
              factors like distance, time of departure, the demand of that ride
              and more. It is also up to the driver to decide how much to charge
              per seat, so it’s hard to put an exact price tag on a ride.{" "}
            </p>
          </div>
          <div class="helpSection">
            <h4>What should I do if there’s an error with my ride?</h4>
            <p>
              You should edit your ride as soon as you spot the error. If you
              can’t edit your ride because passengers have already booked,
              contact them explaining the mistake.{" "}
            </p>
          </div>
        </div>
        <div class="hlepbtn">
          <button id="helpbtn">Read Our Help Center</button>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
