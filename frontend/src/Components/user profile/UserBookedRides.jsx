import { useEffect, useState } from "react";
import axios from "axios";
import UserSideBar from "./UserSideBar";
import toast from "react-hot-toast";

const BookedRidesPage = () => {
  const [bookedRides, setBookedRides] = useState([]);

  useEffect(() => {
    fetchBookedRides();
  }, []);

  axios.defaults.withCredentials = true;

  const fetchBookedRides = async () => {
    try {
      const response = await axios.get(
        "/bookride/bookedrides",
        {}
      );
      
      setBookedRides(response.data.bookedRides);

    } catch (error) {
      console.error("Error fetching booked rides:", error);
    }
  };

  const cancelRide = async (rideId) => {
    try {
      
      const response = await axios.put(
        `/bookride/cancel/${rideId}`
      );
      toast.success("ride cancelled successfully")
      // After cancelling the ride, fetch the updated list of booked rides
      fetchBookedRides();
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  return (
    <div>
      <div className="parent-rides-container">
        <UserSideBar></UserSideBar>
        <div className="my-rides">
          <h2>Your Booked Rides</h2>
          <div className="rides">
            <ul>
              {bookedRides.length === 0?
     <p style={{width:'90vw',height:'100vh',textAlign:'center',display:'flex',justifyContent:'center',alignItems:'center'}}>No rides available</p>
                :
                <ul>
               {bookedRides.map((ride, index) => (
                  <li key={index}>
                    <li key={index} className="flex rides-lists">
                    <div className="tavel-section column">
                      <div className="div">
                    <h4> {ride.ride.leavingFrom}</h4>
                    <div className="line"></div>                   
                    <h4>{ride.ride.goingTo}</h4>
                    </div>
                    <h4> {new Date(ride.ride.date).toLocaleDateString()}</h4>
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
                  {/* <div className="rides-buttons " style={{border:'none'}}>
                  <button className="buttons" >Cancel Ride</button>
                </div> */}
                {ride.user && (
                      <div className="column" >
                        <div className="div">
                        <h4>Publisher</h4>
                          <h4>{ride.ride.user.name}</h4>
                        </div>
                        <div className="div">
                        <h4>Phone Number:</h4>
                          <h4>{ride.ride.user.phoneNumber}</h4>
                          </div>
                      </div>
                    )}
                    <div style={{width:"22%"}}>
                    <button className="buttons" onClick={() => cancelRide(ride.ride._id)}>
                      Cancel
                    </button >
                    </div>
                  </li>
                    
                  </li>
                ))}
                </ul>
}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedRidesPage;
