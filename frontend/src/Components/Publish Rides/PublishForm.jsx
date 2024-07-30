import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PublishRide.css";
import { toast } from "react-hot-toast";
import { fetchToken } from "../utils/fetchToken";
import { useNavigate } from "react-router-dom";

export default function PublishForm() {
  const [isButtonvisible, setButtonvisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isButtonvisible && !event.target.closest(".countProfile")) {
        setButtonvisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isButtonvisible]);

  function setButtonvisiblity(e) {
    e.preventDefault();
    setButtonvisible(!isButtonvisible);
  }

  const handleAdd = (e) => {
    e.preventDefault();
    if (passengers < 4) {
      const newPassengers = passengers + 1;
      setPassengers(newPassengers);
      setPrice(pricePerPassenger * newPassengers);
    }
  };
  const handleMinus = (e) => {
      e.preventDefault();
      if (passengers > 1) {
        const newPassengers = passengers - 1;
        setPassengers(newPassengers);
        setPrice(pricePerPassenger * newPassengers);
      }

  };

  const [leavingFrom, setLeavingFrom] = useState("Delhi");
  const [goingTo, setGoingTo] = useState("Pune");
  const [passengers, setPassengers] = useState(1);
  const [price,setPrice] = useState(580)
  const pricePerPassenger = 580; // base price

  // Assuming default value is 1

  // Before making an API request
  Axios.defaults.withCredentials = true;

  const tokenToSend = fetchToken();

  const handleSubmit = async (e) => {
    e.preventDefault(); // You can include additional validation here if needed

    // Send POST request to publish the ride
    if (tokenToSend) {
      navigate('/offerseat/depature')
    }
    else{
      toast.error('Please Login First')
    }
  };

  return (
    <div>
      <form
        action=""
        className="Publish-Form"
        onSubmit={handleSubmit}
        method="POST"
      >
        <div className="leaving flex">
          <FontAwesomeIcon
            className="iconColor"
            icon={"circle"}
          ></FontAwesomeIcon>
          <input
            type="text"
            id="leaving"
            placeholder="Leaving From.."
            value={leavingFrom}
            onChange={(e) => setLeavingFrom(e.target.value)}
          />
        </div>
        <div className="going flex">
          <FontAwesomeIcon
            className="iconColor"
            icon={"circle"}
          ></FontAwesomeIcon>
          <input
            type="text"
            id="leaving"
            placeholder="Going to..."
            value={goingTo}
            onChange={(e) => setGoingTo(e.target.value)}
          />
        </div>
        <div className="countProfile flex">
          <button className="flex" id="counterBtn" onClick={setButtonvisiblity}>
            <FontAwesomeIcon
              className="iconColor"
              icon={"user-alt"}
            ></FontAwesomeIcon>
            <span id="counter1">{passengers}</span>
          </button>
        </div>
        {isButtonvisible && (
          <div className="counterBox">
            <span>Passengers</span>
            <span>
              <button
                id="add"
                className="botn"
                disabled={passengers >= 8}
                onClick={handleAdd}
              >
                <FontAwesomeIcon
                  className="iconColor"
                  icon={"circle-plus"}
                ></FontAwesomeIcon>
              </button>
              <span id="counter2">{passengers}</span>
              <button
                id="minus"
                className="botn"
                disabled={passengers <= 1}
                onClick={handleMinus}
              >
                <FontAwesomeIcon
                  className="iconColor"
                  icon={"circle-minus"}
                ></FontAwesomeIcon>
              </button>
            </span>
          </div>
        )}
        <div className="save-money">
          <h2>Save Up to <FontAwesomeIcon icon="fa-solid fa-indian-rupee-sign" className="iconColor"/> {price} on your first Ride</h2>
        </div>
        <div className="searchButton">
          <button>Publish Ride</button>
        </div>
      </form>
    </div>
  );
}
