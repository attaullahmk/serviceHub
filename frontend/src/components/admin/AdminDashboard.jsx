

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { Form, Button, Alert } from "react-bootstrap";
// import "./AdminDashboard.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminDashboard = () => {
//   const [newAdminEmail, setNewAdminEmail] = useState("");
//   const [admins, setAdmins] = useState([]);
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("adminToken");

//   // ✅ Fetch all non-super admins
//   const fetchAdmins = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/admin/manage-admins`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAdmins(res.data.admins);
//     } catch (err) {
//       console.error("❌ Failed to fetch admins:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   // ✅ Add Admin
//   const handleAddAdmin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/admin/manage-admins`,
//         { email: newAdminEmail },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage(res.data.message);
//       setNewAdminEmail("");
//       fetchAdmins();
//     } catch (err) {
//       console.error("❌ Add admin error:", err);
//       setMessage("Failed to add admin.");
//     }
//   };

//   // 🗑 Delete Admin
//   const handleDeleteAdmin = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/admin/manage-admins/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("Admin removed.");
//       fetchAdmins();
//     } catch (err) {
//       console.error("❌ Delete admin error:", err);
//       setMessage("Failed to remove admin.");
//     }
//   };

//   return (
//     <div className="container-fluid admin-dashboard py-5">
//       <div className="text-center mb-5">
//         <h1 className="dashboard-title">Welcome, Admin 👋</h1>
//         <p className="text-muted">Manage everything from a single panel</p>
//       </div>

//       <div className="row g-4 justify-content-center">
//         <div className="col-md-3">
//           <div className="card dashboard-card shadow-sm border-0">
//             <div className="card-body text-center">
//               <h5 className="card-title">Services</h5>
//               <p className="card-text">Approve or reject service listings</p>
//               <Link to="/admin/services" className="btn btn-primary btn-sm">Manage</Link>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card dashboard-card shadow-sm border-0">
//             <div className="card-body text-center">
//               <h5 className="card-title">Users</h5>
//               <p className="card-text">View and manage users & providers</p>
//               <Link to="/admin/users" className="btn btn-info btn-sm">View</Link>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card dashboard-card shadow-sm border-0">
//             <div className="card-body text-center">
//               <h5 className="card-title">Bookings</h5>
//               <p className="card-text">Monitor service bookings</p>
//               <Link to="/admin/bookings" className="btn btn-success btn-sm">Check</Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 👥 Manage Admins Section */}
//       <div className="mt-5 px-3">
//         <h4 className="mb-3">Manage Admins</h4>
//         {message && <Alert variant="info">{message}</Alert>}

//         <Form onSubmit={handleAddAdmin} className="d-flex gap-2 mb-4">
//           <Form.Control
//             type="email"
//             placeholder="Enter email to promote"
//             value={newAdminEmail}
//             onChange={(e) => setNewAdminEmail(e.target.value)}
//             required
//           />
//           <Button type="submit" variant="dark">Add Admin</Button>
//         </Form>

//         <ul className="list-group">
//           {admins.map((admin) => (
//             <li key={admin._id} className="list-group-item d-flex justify-content-between align-items-center">
//               {admin.email}
//               <Button
//                 variant="danger"
//                 size="sm"
//                 onClick={() => handleDeleteAdmin(admin._id)}
//               >
//                 Remove
//               </Button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import "./AdminDashboard.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [newAdmin, setNewAdmin] = useState({ 
    name: "",
    email: "", 
    password: "",
    role: "admin" 
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/manage-admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data.admins);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setMessage({ text: "Failed to fetch admins", variant: "danger" });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const validatePassword = () => {
    if (newAdmin.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    if (newAdmin.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/manage-admins`,
        newAdmin,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message, variant: "success" });
      setNewAdmin({ 
        name: "",
        email: "", 
        password: "",
        role: "admin" 
      });
      setConfirmPassword("");
      setShowAddModal(false);
      fetchAdmins();
    } catch (err) {
      console.error("Add admin error:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to add admin",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;
    
    try {
      await axios.delete(`${BASE_URL}/admin/manage-admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Admin removed successfully", variant: "success" });
      fetchAdmins();
    } catch (err) {
      console.error("Delete admin error:", err);
      setMessage({ text: "Failed to remove admin", variant: "danger" });
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage your platform administration</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-tools"></i>
          </div>
          <div className="stat-content">
            <h3>Services</h3>
            <p>Manage service listings</p>
            <Link to="/admin/services" className="stat-link">
              View Services
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-content">
            <h3>Users</h3>
            <p>Manage user accounts</p>
            <Link to="/admin/users" className="stat-link">
              View Users
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>Bookings</h3>
            <p>Monitor appointments</p>
            <Link to="/admin/bookings" className="stat-link">
              View Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Management Section */}
      <div className="admin-management">
        <div className="section-header">
          <h2>Admin Management</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add New Admin
          </Button>
        </div>

        {message.text && (
          <Alert variant={message.variant} className="alert-message">
            {message.text}
          </Alert>
        )}

        <div className="admins-table">
          <div className="table-header">
            <div className="header-cell">Name</div>
            <div className="header-cell">Email</div>
            <div className="header-cell">Role</div>
            <div className="header-cell">Actions</div>
          </div>
          {admins.map((admin) => (
            <div key={admin._id} className="table-row">
              <div className="table-cell">{admin.name}</div>
              <div className="table-cell">{admin.email}</div>
              <div className="table-cell">
                <span className={`role-badge ${admin.role}`}>{admin.role}</span>
              </div>
              <div className="table-cell">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteAdmin(admin._id)}
                  disabled={admin.role === "superadmin"}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAdmin}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && (
                <Form.Text className="text-danger">{passwordError}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Admin Role</Form.Label>
              <Form.Select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </Form.Select>
            </Form.Group>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Admin"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;