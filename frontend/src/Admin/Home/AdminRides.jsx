import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { APIurl } from '../../Components/utils/utils';


export default function AdminRides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchAllRides = async () => {
      try {
        const response = await axios.get(
          `${APIurl}/admin/getRides`
        );
        setRides(response.data.rides);
        
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
    };
    fetchAllRides();
  }, []);

  

  return (
    <>
    {rides.length > 0 ? (
        <div className="search-rides">
         
          <div className="rides">
            <ul>
              {rides.map((ride, index) => (
                <>
                  <li
                    key={index}
                    className="flex rides-lists"
                    style={{ width: "100%"}}
                  >
                    <div className="tavel-section column">
                      <div className="div">
                        <h4> {ride.leavingFrom}</h4>
                        <div className="line"></div>
                        <h4>{ride.goingTo}</h4>
                      </div>
                      <h4> {new Date(ride.date).toLocaleDateString()}</h4>
                    </div>
                    <div className="pass-price column">
                      <div className="div">
                        <h4>Passengers </h4>
                        <h4>{ride.passengers}</h4>
                      </div>
                      <div className="div">
                        <h4>price</h4>
                        <h4> {ride.price}</h4>
                      </div>
                    </div>
                    {/* <div className="rides-buttons " style={{border:'none'}}>
                  <button className="buttons" >Cancel Ride</button>
                </div> */}

                    <div className="column">
                      <div className="div">
                        <h4>Publisher</h4>
                        <h4>{ride.user.name}</h4>
                      </div>
                      <div className="div">
                        <h4>Phone Number:</h4>
                        <h4>{ride.user.phoneNumber}</h4>
                      </div>
                    </div>

                    
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No rides found.</p>
      )}
    </>
  )
}
