import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";
import "./ManageBookings.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${BASE_URL}/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${BASE_URL}/admin/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      console.error("❌ Cancel failed:", err);
      setMessage("Failed to cancel booking.");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container py-5 manage-bookings">
      <h2 className="mb-4 text-center">Manage Bookings</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
        <div className="col-md-4">
          <Form.Control
            type="text"
            placeholder="Search by user or service"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <p className="text-muted text-center">No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>User</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, i) => (
                <tr key={booking._id}>
                  <td>{i + 1}</td>
                  <td>{booking.service?.title || "N/A"}</td>
                  <td>{booking.user?.name || "N/A"}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        booking.status === "cancelled"
                          ? "danger"
                          : booking.status === "completed"
                          ? "success"
                          : "secondary"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status !== "cancelled" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
