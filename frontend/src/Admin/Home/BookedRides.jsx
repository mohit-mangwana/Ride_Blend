import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIurl } from "../../Components/utils/utils";

export default function BookedRides() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axios.get(
          `${APIurl}/admin/getBookings`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
    };
    fetchAllBookings();
  }, []);
  return (
    <>
      <div className="my-rides">
        <h2>Your Booked Rides</h2>
        <div className="rides">
          <ul>
            {bookings.length === 0 ? (
              <p>No Ride Booked</p>
            ) : (
              <ul>
                {bookings.map((ride, index) => (
                  <li key={index}>
                    <li key={index} className="flex rides-lists">
                      <div className="tavel-section column">
                        <div className="div">
                          <h4> {ride.ride.leavingFrom}</h4>
                          <div className="line"></div>
                          <h4>{ride.ride.goingTo}</h4>
                        </div>
                        <h4>
                          {" "}
                          {new Date(ride.ride.date).toLocaleDateString()}
                        </h4>
                      </div>
                      <div className="pass-price column">
                        <div className="div">
                          <h4>Passengers </h4>
                          <h4>{ride.ride.passengers}</h4>
                        </div>
                        <div className="div">
                          <h4>price</h4>
                          <h4> {ride.ride.price}</h4>
                        </div>
                      </div>

                      {ride.user && (
                        <div className="column">
                          <div className="div">
                            <h4>Booked Person</h4>
                            <h4>{ride.user.name}</h4>
                          </div>
                          <div className="div">
                            <h4>Phone Number:</h4>
                            <h4>{ride.user.phoneNumber}</h4>
                          </div>
                        </div>
                      )}
                    </li>
                  </li>
                ))}
              </ul>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
