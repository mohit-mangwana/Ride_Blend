import { React, useState, useEffect, useRef } from "react";
import UserSideBar from "./UserSideBar";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Userprofile.css";
import Validation from "../Validations/EditValidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faMusic,
  faSmokingBan,
  faDog,
} from "@fortawesome/free-solid-svg-icons";
import { Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Box, TextField } from '@mui/material';
export default function UserProfile() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: "",
  });
  const videoRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showProfilePictureOptions, setShowProfilePictureOptions] =
    useState(false);
  const icons = {
    Chattiness: faComments,
    Music: faMusic,
    Smoking: faSmokingBan,
    Pets: faDog,
  };
  const [travelPreferences, setTravelPreferences] = useState([
    {
      name: 'Chattiness',
      options: [
        "I'm chatty when I feel comfortable",
        'I prefer quiet rides',
        "I'm up for conversation",
      ],
    },
    {
      name: 'Music',
      options: [
        "I'll jam depending on the mood",
        'I love music during rides',
        'I prefer quiet rides',
      ],
    },
    {
      name: 'Smoking',
      options: [
        'Cigarette breaks outside the car are ok',
        'No smoking please',
        'Smoking in the car is fine',
      ],
    },
    {
      name: 'Pets',
      options: [
        'Pets welcome. woof!',
        "I'll travel with pets depending on the animal",
        "I'd prefer not to travel with pets",
      ],
    },
  ]);

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  const [selectedPreferences, setSelectedPreferences] = useState([]);


  const [bio, setBio] = useState("");
  const [isAddingBio, setIsAddingBio] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/auth/user`, {
        withCredentials: true,
      });
      setUserData(response.data);
      // console.log(userData.travelPreferences);
      setBio(response.data.bio || "");
      if (response.data.travelPreferences) {
        setSelectedPreferences(response.data.travelPreferences);
      }
      if (response.data.vehicles) {
        setVehicleData(response.data.vehicles);
      }
      if (response.data.profilePicture) {
        if (
          response.data.profilePicture.data &&
          response.data.profilePicture.contentType
        ) {
          const imageData = `data:${response.data.profilePicture.contentType};base64,${response.data.profilePicture.data}`;
          setProfilePhoto(imageData);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const addBio = async () => {
    try {
      await axios.post(
        "/auth/bio",
        { bio },
        { withCredentials: true }
      );
      toast.success("Bio added successfully");
      setIsAddingBio(false);
      fetchUserDetails(); // Refresh user data to reflect changes
    } catch (error) {
      toast.error("Failed to add bio");
    }
  };

  const updateBio = async () => {
    try {
      await axios.post(
        "/auth/bio",
        { bio },
        { withCredentials: true }
      );
      toast.success("Bio updated successfully");
      setIsEditingBio(false);
    } catch (error) {
      toast.error("Failed to update bio");
    }
  };

  const updateTravelPreferences = async () => {
    try {
      await axios.post(
        '/auth/travel-preferences',
        { preferences: selectedPreferences },
        { withCredentials: true }
      );
      toast.success('Travel preferences updated successfully');
    } catch (error) {
      console.error('Failed to update travel preferences:', error);
      toast.error('Failed to update travel preferences');
    }
  };

  const handlePreferenceChange = (preferenceName, selectedOption) => {
    // Check if preference is already selected
    const existingPreferenceIndex = selectedPreferences.findIndex(pref => pref.name === preferenceName);

    if (existingPreferenceIndex !== -1) {
      // Update existing preference
      const updatedPreferences = [...selectedPreferences];
      updatedPreferences[existingPreferenceIndex].option = selectedOption;
      setSelectedPreferences(updatedPreferences);
    } else {
      // Add new preference
      const newPreference = {
        name: preferenceName,
        option: selectedOption,
      };
      setSelectedPreferences([...selectedPreferences, newPreference]);
    }
  };

  const handleSubmit = () => {
    // Check if all preferences have been selected
    const preferencesSelected = travelPreferences.every(pref => selectedPreferences.some(userPref => userPref.name === pref.name));

    if (preferencesSelected) {
      // Proceed with form submission or any other actionconsole.log
    } else {
      toast.error("Please select at least one option for each travel preference.");
    }
  };


  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch (error) {
      if (error.name === "NotAllowedError") {
        toast.error(
          "Camera access was denied. Please grant camera permissions and try again."
        );
      } else if (error.name === "NotFoundError") {
        toast.error("No camera was found on your device.");
      } else if (error.name === "InsecureContextError") {
        toast.error(
          "Camera access is not allowed in an insecure context. Please use HTTPS or configure your browser to treat localhost as a secure context."
        );
      } else {
        toast.error("Failed to access the camera: " + error.message);
      }
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const captureImage = () => {
    if (cameraStream) {
      const canvas = document.createElement("canvas");
      canvas.width = 220;
      canvas.height = 220;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 220, 220);

      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_image.png", {
          type: "image/png",
        });
        setSelectedFile(file);
        setCapturedImage(URL.createObjectURL(file));
      }, "image/png");

      closeCamera();
    }
  };

  const handleSetProfilePicture = () => {
    setShowProfilePictureOptions((prevState) => !prevState);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setProfilePhoto(fileUrl);
  };

  const uploadProfilePhoto = async () => {
    if (!selectedFile) {
      toast.error("No file selected.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      await axios.put("/auth/profilepicture", formData, {
        withCredentials: true,
      });

      toast.success("Profile photo uploaded successfully");
      setShowProfilePictureOptions(false);
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Failed to upload profile photo.");
    }
  };

  const fetchTravelPreferences = async () => {
    try {
      const response = await axios.get('/auth/travel-preferences', { withCredentials: true });
      setTravelPreferences(response.data.preferences);
      setSelectedPreferences(response.data.selectedPreferences);
    } catch (error) {
      console.error('Error fetching travel preferences:', error);
    }
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleSubmitVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/vehicle", vehicleData, {
        withCredentials: true,
      });
      const response = await axios.get("/auth/user", {
        withCredentials: true,
      });
      setUserData(response.data);
      setVehicleData(response.data.vehicles);
      toast.success("Vehicle added successfully!");

      setShowForm(false);
      // Optionally, update UI or fetch user data again to reflect changes
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="parent-info-container">
        <UserSideBar />
        <div className="info-container">
          <div className="user-details flex">
            <div className="profile-photo-upload">
              <div className="camera-container">
                {cameraStream && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    style={{
                      width: "220px",
                      height: "220px",
                      borderRadius: "50%",
                      outline: "none",
                      objectFit: "cover",
                      border: "1px solid black",
                      maxHeight: "220px",
                      maxWidth: "220px",
                    }}
                  ></video>
                )}
                {!cameraStream && (
                  <img
                    src={
                      capturedImage ||
                      profilePhoto ||
                      "https://freesvg.org/img/abstract-user-flat-4.png"
                    }
                    alt="Profile"
                    style={{
                      width: "220px",
                      height: "220px",
                      borderRadius: "50%",
                      outline: "none",
                      objectFit: "cover",
                      border: "1px solid black",
                      maxHeight: "220px",
                      maxWidth: "220px",
                    }}
                  />
                )}
                <div>
                  <button className="buttons" onClick={handleSetProfilePicture}>
                    Set Profile Picture
                  </button>
                </div>
              </div>
              <div className="buttons-container">
                {showProfilePictureOptions && (
                  <>
                    <div>
                      <p>Choose from PC:</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ width: "70%" }}
                      />
                    </div>
                    <div>
                      <label>
                        <p>Take a Picture:</p>
                        <div>
                          <button className="buttons" onClick={openCamera}>
                            Open Camera
                          </button>
                        </div>
                        <div>
                          <button className="buttons" onClick={captureImage}>
                            Capture Image
                          </button>
                        </div>
                        <div>
                          <button
                            className="buttons"
                            onClick={uploadProfilePhoto}
                          >
                            Upload Profile Photo
                          </button>
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="details">
              <h2>Name:</h2> <p className="detail">{userData.name}</p>
              <h2>Email:</h2> <p className="detail">{userData.email}</p>
              <h2>Phone Number:</h2>{" "}
              <p className="detail">{userData.phoneNumber}</p>
            </div>
          </div>
          <div className="verify-details margin">
            <h1>Verify Your Profile</h1>
            <p className="pdetail">
              {userData.email}
              <FontAwesomeIcon
                icon="fa-solid fa-circle-check"
                className="iconColor"
              />
            </p>
            <p className="pdetail">
              {userData.phoneNumber}
              <FontAwesomeIcon
                icon="fa-solid fa-circle-check"
                className="iconColor"
              />
            </p>
          </div>
          <div className="about-bio margin">
            <h1>About You</h1>
            <div>
              {userData.bio ? (
                <p className="pdetail">{userData.bio}</p>
              ) : (
                <p className="pdetail" onClick={() => setIsAddingBio(true)}>
                  <FontAwesomeIcon
                    className="iconColor"
                    icon="fa-solid fa-circle-plus"
                  />
                  Add Your Bio
                </p>
              )}
            </div>
            {isAddingBio && (
              <div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                />
                <button onClick={addBio}>Save</button>
                <button onClick={() => setIsAddingBio(false)}>Cancel</button>
              </div>
            )}
            {isEditingBio && (
              <div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                />
                <button onClick={updateBio}>Save</button>
                <button onClick={() => setIsEditingBio(false)}>Cancel</button>
              </div>
            )}
          </div>
          <div className="travel-preferences margin">
      {isLoading ? (
        <Typography variant="h4" component="h2">
          Loading...
        </Typography>
      ) : (
        <>
          <Typography variant="h4" component="h2">
            Travel Preferences
          </Typography>

          {selectedPreferences.length > 0 ? (
            <Box marginBottom={2}>
              {selectedPreferences.map(pref => (
                <Typography key={pref.name} variant="body1">
                  {pref.name}: {pref.option}
                </Typography>
              ))}
              <Button variant="contained" color="primary" onClick={toggleFormVisibility}>
                {isFormVisible ? 'Hide Preferences' : 'Edit Preferences'}
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" onClick={toggleFormVisibility} className="pdetail">
              <FontAwesomeIcon className="iconColor" icon="fa-solid fa-circle-plus" />
              Add Your Travel Preferences
            </Typography>
          )}

          {isFormVisible && (
            <Box marginTop={2}>
              {travelPreferences.map(preference => (
                <FormControl component="fieldset" key={preference.name} className="preference">
                  <FormLabel component="legend">
                    <Typography variant="h6" component="h3">
                      {preference.name}
                    </Typography>
                  </FormLabel>
                  <RadioGroup
                    name={preference.name}
                    value={
                      selectedPreferences.find(pref => pref.name === preference.name)?.option || ''
                    }
                    onChange={(e) => handlePreferenceChange(preference.name, e.target.value)}
                  >
                    {preference.options.map(option => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
              <Button variant="contained" color="secondary" onClick={updateTravelPreferences}>
                Save Preferences
              </Button>
              <Button variant="contained" onClick={toggleFormVisibility}>
                Cancel
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
          <div className="vehicle-in margin">
            <h1>Vehicles</h1>
            {userData.vehicles && userData.vehicles.length > 0 ? (
              <div>
                {userData.vehicles.map((vehicle, index) => (
                  <div key={index}>
                    <h3>
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p>Year: {vehicle.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No vehicles added</p>
            )}
            {!showForm && (
              <p
                style={{ cursor: "pointer", marginLeft: "5px" }}
                onClick={() => setShowForm(true)}
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-circle-plus"
                  className="iconColor"
                />
                Add Vehicle
              </p>
            )}
            {showForm && (
              <form onSubmit={handleSubmitVehicle}>
                <input
                  type="text"
                  name="make"
                  value={vehicleData.make}
                  onChange={handleVehicleInputChange}
                  placeholder="Make"
                  required
                />
                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleVehicleInputChange}
                  placeholder="Model"
                  required
                />
                <input
                  type="number"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleVehicleInputChange}
                  placeholder="Year"
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
