import { useState, useEffect } from "react";
import axios from "axios";
import "./Alldata.css"; // Import CSS

export default function Alldata() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", amount: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const result = await axios.get("https://bank-server-uydm.onrender.com/data");
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await axios.delete(`https://bank-server-uydm.onrender.com/delete/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      setErrorMessage("Error deleting record.");
    }
  }

  function handleEdit(item) {
    setEditId(item._id);
    setFormData({ name: item.name, email: item.email, password: item.password, amount: item.amount });
  }

  async function handleUpdate() {
    if (!formData.name || !formData.email || !formData.password || formData.amount === "") {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      await axios.put(`https://bank-server-uydm.onrender.com/update/${editId}`, formData);
      setData(data.map((item) => (item._id === editId ? { ...item, ...formData } : item)));
      setEditId(null);
      setErrorMessage("");
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
      setErrorMessage("Failed to update record.");
    }
  }

  return (
    <div className="alldata-container">
      <h1 className="alldata-heading">All Data</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <table className="alldata-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
                <td>${item.amount}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Editing Data */}
      {editId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Data</h2>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Amount" />

            <button className="update-button" onClick={handleUpdate}>Update</button>
            <button className="cancel-button" onClick={() => setEditId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
