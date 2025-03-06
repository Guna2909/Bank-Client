import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cashback.css"; // Import corresponding CSS file

export default function Cashback() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  
  const API_URL = "https://bank-server-uydm.onrender.com"; // Backend API URL

  // Validate inputs dynamically
  const validateForm = () => {
    const isValidAmount = !isNaN(withdrawAmount) && withdrawAmount > 0;
    setIsValid(email.trim() !== "" && password.trim() !== "" && isValidAmount);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const amountToWithdraw = parseFloat(withdrawAmount);
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      setErrorMessage("Invalid withdrawal amount.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/withdraw`, {
        email,
        password,
        amount: amountToWithdraw,
      });

      setSuccessMessage(`Successfully withdrawn $${amountToWithdraw}. Your new balance is $${response.data.newBalance}`);
      setWithdrawAmount("");
      setIsValid(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Withdrawal failed. Please try again.");
    }
  };

  return (
    <div className="cashback-background">
      <div className="cashback-container">
        <h1 className="cashback-heading">Withdraw Funds</h1>

        {successMessage && <div className="cashback-alert cashback-alert-success">{successMessage}</div>}
        {errorMessage && <div className="cashback-alert cashback-alert-error">{errorMessage}</div>}

        <Form className="cashback-form" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              className="cashback-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateForm();
              }}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="cashback-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateForm();
              }}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="cashback-input"
              type="number"
              placeholder="Enter withdrawal amount"
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                validateForm();
              }}
              required
            />
          </Form.Group>

          <Button className="cashback-button" variant="primary" type="submit" disabled={!isValid}>
            Withdraw
          </Button>
        </Form>
      </div>
    </div>
  );
}
