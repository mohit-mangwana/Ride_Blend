// UserInfo.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Userinfo.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from '../Home Component/Footer.jsx'
import { APIurl } from '../utils/utils.jsx';


const UserInfo = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${APIurl}/auth/info/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);


  if (!user) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="user-info-container">
      <div className="user-info-card">
        <div className="user-pro-name flex">
        {user.profilePicture && (
        <img
          src={`data:${user.profilePicture.contentType};base64,${user.profilePicture.data}`}
          alt="Profile" className='user-profile-pic'
        />
      )}
      <h1>{user.name}</h1>
      
        </div>
        <div className="ask-question" style={{padding:'1.5rem'}}>
          <h4>Experience level : {user.publishedRidesCount < 10 ? 'Newcomer' : 'Experienced'}</h4>
        </div>
        <hr style={{width:'100%',height:'1px'}}/>
        <div className="verify-details" style={{padding:'1.5rem'}}>
            <h2>{user.name} has a Verifed Profile</h2>
            <p className="pdetail">
              {user.email}
              <FontAwesomeIcon
                icon="fa-solid fa-circle-check"
                className="iconColor"
              />
            </p>
            <p className="pdetail">
              {user.phoneNumber}
              <FontAwesomeIcon
                icon="fa-solid fa-circle-check"
                className="iconColor"
              />
            </p>
          </div>
          <hr className='line-hr' />
          <div className="about-details" style={{padding:'1.5rem'}}>
          <h2>About {user.name}</h2>
          
          </div>
      <h3 style={{padding:'1rem'}} >{user.bio}</h3>
      {user.travelPreferences && user.travelPreferences.length > 0 ? (
        user.travelPreferences.map((preference, index) => (
          <h3 style={{padding:'1rem'}} key={index}>
            {preference.name}: {preference.option}
          </h3>
        ))
      ) : (
        <p>No travel preferences selected yet.</p>
      )}
          <hr className='line-hr' />
          <div className="join-date">
          <h3 style={{padding:'1rem'}}>{user.publishedRidesCount} rides published</h3>
          <h3 style={{padding:'1rem'}}>Member since {formatDate(user.joinedDate)}</h3>
          </div>
          <hr className='line-hr' />
     
      <div className="vechile-sec" style={{padding:'1.5rem'}}>
      <h3>Vehicles:</h3>
      {user.vehicles && user.vehicles.length > 0 ? (
        user.vehicles.map((vehicle, index) => (
          <div style={{padding:'1rem'}} key={index}>
            <h3> {vehicle.make}</h3>
            <p>{vehicle.model}</p>
          </div>
        ))
      ) : (
        <p>No vehicles added yet.</p>
      )}
      </div>
      
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UserInfo;
