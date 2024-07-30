import React from 'react'
import {useNavigate, useParams } from "react-router-dom";
import "./email.css";
import { useState } from "react";
import Axios from "axios";
import { toast } from "react-hot-toast";


export default function ResetPassword() {
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const {token} = useParams ();

  const handleSubmit = (event) => {
    event.preventDefault();

    
      Axios.post("/auth/resetpassword/"+ token, {
        password,
      })
        .then((res) => {
          toast.success(res.data.message);
          navigate("/loginemail");
        })
        .catch((err) => {
          toast.error("Email Does't not exist")
        });
    
  };

  return (
    <div>
        <main className="mainSection">
          <div className="emailwrapper">
            <div className="emailheading">
              <h1>Create New  password???</h1>
            </div>
            <form action=""  onSubmit={handleSubmit} className="emailform">
              <div className="emailinput ">
                <input
                  type="password"
                  name="email"
                  placeholder="Create New Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                
              </div>
              <div className="loginbtn">
                <button>Forgot Password</button>
              </div>
            </form>
          </div>
        </main>
    </div>
  )
}
