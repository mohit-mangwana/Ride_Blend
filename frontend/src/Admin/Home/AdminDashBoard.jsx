import { useEffect,useState } from 'react';
import React from 'react'
import  './AdminDashboard.css'
import { fetchCounts} from '../Service/Api';

export default function AdminDashBoard() {

  const [counts, setCounts] = useState({ users: 0, rides: 0, bookings: 0 });


  useEffect(() => {
    const getCounts = async () => {
        try {
            const data = await fetchCounts();
            setCounts(data);
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };
    getCounts();
}, []);


  return (
    <>
    <div className='dashboard-parent' > 
      <div className="dashborad-detail">
        <div className="dash-detail" >
          <h1>No. of Users</h1>
          <p>{counts.users}</p>
        </div>
        <div className="dash-detail" >
        <h1>No. of Rides</h1>
        <p>{counts.rides}</p>
        </div>
        <div className="dash-detail">
        <h1>No. of Bookings</h1>
        <p>{counts.bookings}</p>
        </div>
       
      </div>
     
    </div>
    </>
  )
}
