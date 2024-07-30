import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [isButtonvisible, setButtonvisible] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
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
    setButtonvisible(!isButtonvisible);
    e.preventDefault();
  }

  const handleAdd = (e) => {
    if (passengers < 8) {
      setPassengers(passengers + 1);
      e.preventDefault();
    }
  };

  const handleMinus = (e) => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
      e.preventDefault();
    }
  };

  axios.defaults.withCredentials = true;

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!pickupAddress || !dropAddress || !date) {
        toast.error("Please fill in all fields");
        return;
      }
      const response = await axios.get(
        "/ride/rides/search",
        {
        params:{
            pickupAddress,
            dropAddress,
            date,
            passengers
        },
        }
      );
      // setPickupAddress("");
      // setDropAddress("");
      // setDate("");
      // setPassengers(1);
      navigate(
        `/search-results?pickupAddress=${pickupAddress}&dropAddress=${dropAddress}&date=${date}&passengers=${passengers}`, 
        {
          state: { rides: response.data }
        }
      );
    } catch (error) {
      toast.error(error.response.data.message || 'Error searching for rides');
      console.error("Error searching for rides:", error);
    }
  };

  return (
    <>
      <form action="" method="GET" className="searchBar">
        <div className="leaving flex">
          <FontAwesomeIcon className="iconColor" icon={"circle"} />
          <input
            type="text"
            id="pickupAddress"
            placeholder="Leaving From.."
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
          />
        </div>
        <div className="going flex">
          <FontAwesomeIcon className="iconColor" icon={"circle"} />
          <input
            type="text"
            id="dropAddress"
            placeholder="Going to..."
            value={dropAddress}
            onChange={(e) => setDropAddress(e.target.value)}
          />
        </div>
        <div className="date flex">
          <FontAwesomeIcon className="iconColor" icon={"calendar-day"} />
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="countProfile flex">
          <button className="flex" id="counterBtn" onClick={setButtonvisiblity}>
            <FontAwesomeIcon className="iconColor" icon={"user-alt"} />
            <span id="counter1">{passengers}</span>
          </button>
        </div>
        {isButtonvisible && (
          <div className="counterBox">
            <span>Passenger</span>
            <span>
              <button
                id="add"
                className="botn"
                disabled={passengers >= 8}
                onClick={handleAdd}
              >
                <FontAwesomeIcon className="iconColor" icon={"circle-plus"} />
              </button>
              <span id="counter2">{passengers}</span>
              <button
                id="minus"
                className="botn"
                disabled={passengers <= 1}
                onClick={handleMinus}
              >
                <FontAwesomeIcon className="iconColor" icon={"circle-minus"} />
              </button>
            </span>
          </div>
        )}
        <div className="searchButton">
          <button onClick={handleSearch}>Search</button>
        </div>
      </form>
    </>
  );
}
