import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-hot-toast';
import Validation from '../Validations/Forgotpassword'; // Assuming this is the correct path for your validation function
import './email.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState(" ");
  const [errors, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(email); // Renamed errors variable to avoid shadowing
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await Axios.post('/auth/forgotpassword', {
          email,
        });
        toast.success(response.data.message);
        navigate('/login');
      } catch (e) {
        if (e.response && (e.response.status === 500 || e.response.status === 401)) {
          toast.error(e.response.data.message);
        }
      }
    } else {
      setError(validationErrors);
    }
  };

  return (
    <div>
      <main className="mainSection">
        <div className="emailwrapper">
          <div className="emailheading">
            <h1>Forgot Your Password???</h1>
          </div>
          <form onSubmit={handleSubmit} className="emailform">
            <div className="emailinput">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email} // Added value attribute to keep input synced with state
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="err">{errors.email}</span>}
            </div>
            <div className="loginbtn">
              <button type='submit'>Forgot Password</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
