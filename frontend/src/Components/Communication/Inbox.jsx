import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import './Inbox.css';
import UserSideBar from "../user profile/UserSideBar";
import { APIurl } from "../utils/utils";

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chatsResponse, userResponse] = await Promise.all([
          axios.get(`${APIurl}/api/chats`, { withCredentials: true }),
          axios.get(`${APIurl}/auth/user`, { withCredentials: true })
        ]);
          setChats(chatsResponse.data);
        setCurrentUser(userResponse.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chats. Please try again later.");
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChatClick = (chat) => {
    navigate(`/chat/${chat.rideId}`, {
      state: { recipientUsername: chat.recipient },
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    <UserSideBar></UserSideBar>
    <div className="inbox-page">
      <h2>Inbox</h2>
      {chats.length > 0 ? (
        <ul className="chat-list">
          {chats.map((chat) => (
            <li key={chat.rideId} className="chat-item" onClick={() => handleChatClick(chat)}>
              <div className="chat-profile">
                <img src={chat.recipientProfilePicture} alt="Profile" />
              </div>
              <div className="chat-details">
                <p className="chat-title">{chat.title}</p>
                <p className="chat-last-message">{chat.lastMessage}</p>
                <p className="chat-time">{new Date(chat.createdAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-chats">No chats available</p>
      )}
    </div>
    </>
  );
};

export default Inbox;