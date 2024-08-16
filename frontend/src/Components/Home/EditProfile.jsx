import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import UserSideBar from '../user profile/UserSideBar';
import './EditProfile.css'
import Validation from '../Validations/EditValidation';
import { Link } from 'react-router-dom';

export default function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/auth/user", {
          withCredentials: true,
        });
        setUserData(response.data);
        setEditData({
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          bio: response.data.bio || "",
        });
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.error);
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = Validation(
      editData.name,
      editData.email,
      editData.phoneNumber
    );
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    try {
      const response = await axios.put(
        "/auth/update",
        editData,
        {
          withCredentials: true,
        }
      );
      toast.success("Profile updated successfully");
      setUserData(response.data.user);
      setEditData(response.data.user);
      console.log(editData);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (<>
      <UserSideBar />
    <div className="edit-parent">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div>
            <label>Name:</label>
            <input
              className="input"
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>
          <div>
            <label>Email:</label>
            <input
              className="input"
              type="email"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
              disabled
            />
            {errors.email && <div className="err">{errors.email}</div>}
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              className="input"
              type="text"
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleInputChange}
            />
            {errors.phoneNumber && (
              <div className="err">{errors.phoneNumber}</div>
            )}
          </div>
          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={editData.bio}
              onChange={handleInputChange}
            />
            {errors.bio && <p className="error">{errors.bio}</p>}
          </div>
          <button className="buttons" type="submit">
            Save
          </button>
          <Link to="/profile">
            <button className="buttons" type="button">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
    </>
  );
}
