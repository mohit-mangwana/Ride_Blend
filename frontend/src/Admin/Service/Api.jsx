// src/services/api.js

import axios from 'axios';

axios.defaults.withCredentials = true;

export const fetchCounts = async () => {
    try {
        const response = await axios.get('http://localhost:4000/admin/getcount');
        return response.data;
    } catch (error) {
        console.error('Error fetching counts:', error);
        throw error;
    }
};

export const fetchAllUsers = async () => {
    try {
        const response = await axios.get('http://localhost:4000/admin/getUsers');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const fetchAllRides = async () => {
    try {
        const response = await axios.get('http://localhost:4000/admin/getRides');
        return response.data;
    } catch (error) {
        console.error('Error fetching rides:', error);
        throw error;
    }
};

export const fetchAllBookings = async () => {
    try {
        const response = await axios.get('http://localhost:4000/admin/getBookings');
        return response.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};
