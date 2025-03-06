import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = { name, email, password, amount: 1000 };

    try {
      await axios.post("https://bank-server-uydm.onrender.com/create", userData);
      alert("Registration Successful!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error submitting data: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
        />

        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />

        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
