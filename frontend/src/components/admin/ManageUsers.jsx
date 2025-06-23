import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";
import "./ManageUsers.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (userId, action) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.patch(
        `${BASE_URL}/admin/users/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActionMsg(`User ${action}ed successfully`);
      fetchUsers();
    } catch (err) {
      console.error(`❌ Failed to ${action} user`, err);
      setActionMsg("Failed to update user status.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="container py-5 manage-users">
      <h2 className="mb-4 text-center">Manage Users</h2>

      {actionMsg && <div className="alert alert-info">{actionMsg}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="provider">Providers</option>
          </Form.Select>
        </div>
        <div className="col-md-4">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-muted text-center">No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {/* <th>Status</th> */}
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user._id}>
                  <td>{i + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.isBlocked ? (
                      <span className="badge bg-danger">Blocked</span>
                    ) : (
                      <span className="badge bg-success">Active</span>
                    )}
                  </td>
                  {/* <td>
                    <Button
                      variant={user.isBlocked ? "success" : "danger"}
                      size="sm"
                      onClick={() =>
                        handleBlockToggle(
                          user._id,
                          user.isBlocked ? "unblock" : "block"
                        )
                      }
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
