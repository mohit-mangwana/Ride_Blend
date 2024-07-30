// BookingConfirmation.js
import React from 'react';
import { motion } from 'framer-motion';
import './BookingConfirmation.css';

const BookingConfirmation = ({ message }) => {
  return (
    <motion.div
      className="booking-confirmation"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{message}</h2>
    </motion.div>
  );
};

// export default BookingConfirmation;

// import React, { useContext, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { RideContext } from '../utils/RideProvider';

// const CheckCircleIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="text-green-500 w-16 h-16"
//   >
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//     <polyline points="22 4 12 14.01 9 11.01"></polyline>
//   </svg>
// );

// const BookingConfirmation = () => {
//   const { resetRideDetails } = useContext(RideContext);

//   useEffect(() => {
//     resetRideDetails();
//   }, [resetRideDetails]);

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <motion.div
//         className="bg-white p-8 rounded-lg shadow-lg text-center"
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//         >
//           <CheckCircleIcon />
//         </motion.div>
//         <motion.h2
//           className="text-2xl font-bold text-gray-800 mb-2"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           Ride Published Successfully!
//         </motion.h2>
//         <motion.p
//           className="text-gray-600"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.6 }}
//         >
//           Your ride has been published and is now available for others to join.
//         </motion.p>
//       </motion.div>
//     </div>
//   );
// };

export default BookingConfirmation;
