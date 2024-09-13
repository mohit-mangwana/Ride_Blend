import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import './Chat.css';
import { APIurl } from '../utils/utils';


const socket = io(process.env.REACT_APP_SOCKET_URL);


const Chat = () => {
  const { rideId } = useParams();
  const location = useLocation();
  const otherUser = location.state?.recipientUsername;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [rideInfo, setRideInfo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const messageListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${APIurl}/message/ride/${rideId}/messages?page=${page}`, {
          withCredentials: true
        });
        setMessages(prevMessages => [...response.data.messages, ...prevMessages]);
        setRideInfo(response.data.ride || null);
        setLoading(false);
      } catch (error) {
        toast.error('Error Fetching Messages');
        console.error(error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${APIurl}/auth/user`, {
          withCredentials: true,
        });
        setCurrentUser(response.data.name);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.error || 'Error fetching user details');
      }
    };

    fetchMessages();
    fetchUserDetails();
  }, [rideId, page]);

  useEffect(() => {
    socket.emit('joinRoom', { rideId });
    
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', ({ user }) => {
      if (user !== currentUser) {
        setIsTyping(true);
      }
    });

    socket.on('stopTyping', ({ user }) => {
      if (user !== currentUser) {
        setIsTyping(false);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('An error occurred with the chat connection');
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('error');
    };
  }, [rideId, currentUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const messageData = {
        rideId,
        sender: currentUser,
        recipient: otherUser,
        content: newMessage,
        createdAt: new Date().toISOString(),
      };
      socket.emit('chatMessage', messageData, (status) => {
        if (status.success) {
          setNewMessage('');
        } else {
          toast.error('Failed to send message');
        }
      });
    } catch (error) {
      toast.error('Error Sending Message');
      console.error(error);
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { rideId, user: currentUser });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { rideId, user: currentUser });
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleScroll = () => {
    if (messageListRef.current.scrollTop === 0) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <h2>Chat with {otherUser}</h2>
      {rideInfo && (
        <div className="ride-info">
          <h3>Ride Information</h3>
          <p><strong>From:</strong> {rideInfo.rideDetails.pickupAddress}</p>
          <p><strong>To:</strong> {rideInfo.rideDetails.dropAddress}</p>
          <p><strong>Date:</strong> {formatDate(rideInfo.rideDetails.date)}</p>
          <p><strong>Price:</strong> {rideInfo.rideDetails.price}</p>
        </div>
      )}
      <div className="message-list" ref={messageListRef} onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}>
            <p>{msg.content}</p>
            <span className="timestamp">{formatDate(msg.createdAt)}</span>
          </div>
        ))}
      </div>
      {isTyping && <div className="typing-indicator">{otherUser} is typing...</div>}
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className='send-btn'>Send</button>
      </div>
    </div>
  );
};

export default Chat;