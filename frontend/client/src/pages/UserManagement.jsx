import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    age: "",
  });
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'edit' or 'delete'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Show password verification modal
  const showPasswordVerification = (userId, type) => {
    setSelectedUserId(userId);
    setActionType(type);
    setShowPasswordModal(true);
    setPassword("");
    setError("");
    
    // If editing, set the form data
    if (type === 'edit') {
      const user = users.find(u => u._id === userId);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        age: user.age,
      });
    }
  };

  // Verify password and proceed with action
  const verifyPasswordAndProceed = async () => {
    try {
      // First verify the password
      const verifyResponse = await axios.post(`http://localhost:8000/users/verify-password`, {
        userId: selectedUserId,
        password: password
      });
      
      if (verifyResponse.data.verified) {
        // Password verified, proceed with the action
        if (actionType === 'edit') {
          setEditingUser(selectedUserId);
        } else if (actionType === 'delete') {
          handleDelete(selectedUserId);
        }
        setShowPasswordModal(false);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Password verification error:", error);
      setError("Password verification failed. Please try again.");
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    showPasswordVerification(user._id, 'edit');
  };

  // Handle update user
  const handleUpdate = async (userId) => {
    try {
      await axios.put(`http://localhost:8000/users/${userId}`, formData);
      setEditingUser(null);
      fetchUsers();
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/users/${userId}`);
      fetchUsers();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>User Management</h1>
        <p>Manage and monitor user accounts</p>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.age}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => showPasswordVerification(user._id, 'delete')}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-header">
              {actionType === 'edit' ? 'Edit User' : 'Delete User'}
            </h3>
            <p>Please enter your password to confirm this action:</p>
            <input
              type="password"
              className="modal-input"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
            />
            {error && <div className="error-message">{error}</div>}
            <div className="modal-buttons">
              <button
                className="modal-button cancel-button"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm-button"
                onClick={verifyPasswordAndProceed}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-header">Edit User</h3>
            <input
              type="text"
              name="firstName"
              className="modal-input"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              className="modal-input"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              className="modal-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="username"
              className="modal-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="number"
              name="age"
              className="modal-input"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
            />
            <div className="modal-buttons">
              <button
                className="modal-button cancel-button"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm-button"
                onClick={() => handleUpdate(editingUser)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 