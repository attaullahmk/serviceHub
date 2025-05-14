// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Form,
//   Button,
//   Container,
//   Row,
//   Col,
//   Alert,
//   Spinner,
//   Card,
// } from "react-bootstrap";
// import axios from "axios";
// import "./BookingForm.css";
// import { useSelector } from "react-redux";
// import socket from "../../socket"; // adjust the path if needed


// const BookingForm = ({ service }) => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [bookingDate, setBookingDate] = useState("");
//   const [totalPrice, setTotalPrice] = useState(service.service.price);
//   const [specialRequests, setSpecialRequests] = useState(""); // ✅ new state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("${BASE_URL}/api/bookings", {
//         user: user._id,
//         service: service.service._id,
//         provider: service.service.provider._id,
//         bookingDate,
//         totalPrice,
//         specialRequests, // ✅ included in payload
//       });

//       setSuccess("Booking successful!");
//       setTimeout(() => navigate("/bookings"), 2000);
//     } catch (err) {
//       setError("You have already booked this service.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center my-5">
//       <Card
//         className="booking-card shadow-lg p-4 w-100"
//         style={{ maxWidth: "500px", borderRadius: "20px" }}
//       >
//         <h3 className="text-center mb-4 fw-bold">Book Service</h3>
//         {error && <Alert variant="danger">{error}</Alert>}
//         {success && <Alert variant="success">{success}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="bookingDate" className="mb-4">
//             <Form.Label className="fw-semibold">Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={bookingDate}
//               onChange={(e) => setBookingDate(e.target.value)}
//               required
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Form.Group controlId="totalPrice" className="mb-4">
//             <Form.Label className="fw-semibold">Total Price</Form.Label>
//             <Form.Control
//               type="number"
//               value={totalPrice}
//               onChange={(e) => setTotalPrice(e.target.value)}
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           {/* ✅ Special Requests Field */}
//           <Form.Group controlId="specialRequests" className="mb-4">
//             <Form.Label className="fw-semibold">Special Requests (optional)</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Any specific instructions?"
//               value={specialRequests}
//               onChange={(e) => setSpecialRequests(e.target.value)}
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Button
//             variant="primary"
//             type="submit"
//             className="w-100 py-2 rounded-pill"
//             disabled={loading}
//           >
//             {loading ? (
//               <Spinner as="span" animation="border" size="sm" />
//             ) : (
//               "Book Now"
//             )}
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default BookingForm;


// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Form,
//   Button,
//   Container,
//   Alert,
//   Spinner,
//   Card,
// } from "react-bootstrap";
// import axios from "axios";
// import "./BookingForm.css";
// import { useSelector } from "react-redux";
// import socket from "../../socket"; // ✅ Import socket instance

// const BookingForm = ({ service }) => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [bookingDate, setBookingDate] = useState("");
//   const [totalPrice, setTotalPrice] = useState(service.service.price);
//   const [specialRequests, setSpecialRequests] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(`${BASE_URL}/api/bookings`, {
//         user: user._id,
//         service: service.service._id,
//         provider: service.service.provider._id,
//         bookingDate,
//         totalPrice,
//         specialRequests,
//       });

//       // ✅ Emit a notification to the provider
//       socket.emit("sendNotification", {
//         recipientId: service.service.provider._id,
//         type: "booking",
//         message: `${user.name} booked your service: ${service.service.title}`,
//         relatedId: service.service._id,  // Use the booking ID as the related ID
//         relatedModel: "booking", // Specify the related model
//       });
//       console.log("Notification sent to provider:", {
//         recipientId: service.service.provider._id,
//         type: "booking",
//         message: `${user.name} booked your service: ${service.service.title}`,
//         relatedId: service.service._id,
//         relatedModel: "booking",
//       });

//       setSuccess("Booking successful!");
//       setTimeout(() => navigate("/bookings"), 2000);
//     } catch (err) {
//       setError("You have already booked this service.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center my-5">
//       <Card
//         className="booking-card shadow-lg p-4 w-100"
//         style={{ maxWidth: "500px", borderRadius: "20px" }}
//       >
//         <h3 className="text-center mb-4 fw-bold">Book Service</h3>
//         {error && <Alert variant="danger">{error}</Alert>}
//         {success && <Alert variant="success">{success}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="bookingDate" className="mb-4">
//             <Form.Label className="fw-semibold">Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={bookingDate}
//               onChange={(e) => setBookingDate(e.target.value)}
//               required
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Form.Group controlId="totalPrice" className="mb-4">
//             <Form.Label className="fw-semibold">Total Price</Form.Label>
//             <Form.Control
//               type="number"
//               value={totalPrice}
//               onChange={(e) => setTotalPrice(e.target.value)}
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Form.Group controlId="specialRequests" className="mb-4">
//             <Form.Label className="fw-semibold">Special Requests (optional)</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Any specific instructions?"
//               value={specialRequests}
//               onChange={(e) => setSpecialRequests(e.target.value)}
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Button
//             variant="primary"
//             type="submit"
//             className="w-100 py-2 rounded-pill"
//             disabled={loading}
//           >
//             {loading ? (
//               <Spinner as="span" animation="border" size="sm" />
//             ) : (
//               "Book Now"
//             )}
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default BookingForm;



// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Form,
//   Button,
//   Container,
//   Alert,
//   Spinner,
//   Card,
// } from "react-bootstrap";
// import axios from "axios";
// import "./BookingForm.css";
// import { useSelector } from "react-redux";

// const BookingForm = ({ service }) => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [bookingDate, setBookingDate] = useState("");
//   const [totalPrice, setTotalPrice] = useState(service.service.price);
//   const [specialRequests, setSpecialRequests] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
  
//     try {
//       // Create the booking
//       const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, {
//         user: user._id,
//         service: service.service._id,
//         provider: service.service.provider._id,
//         bookingDate,
//         totalPrice,
//         specialRequests,
//       });
//    console.log("Booking response:", bookingResponse.data);
//       const booking = bookingResponse.data.data;
//   //  console.log("Booking created:", booking.data._id);
//    console.log("Booking created:", booking.user);
//       try {
//         // Create the notification after booking is confirmed
//         // Make the notification API call after booking is created
// await axios.post(`${BASE_URL}/api/notifications`, {
//   recipient: service.service.provider._id,
//   type: "booking",
//   message: `${user.name} booked your service: ${service.service.title}`,
//   targetId: booking._id, // Use targetId as expected by the Joi schema
//   targetType: "booking", // Use targetType as expected by the Joi schema
// });

//   //  console.log(targetId, targetType);
//         setSuccess("Booking successful!");
//         setTimeout(() => navigate("/bookings"), 2000);
//       } catch (notifError) {
//         console.error("Error creating notification:", notifError);
//         setError("Booking successful, but failed to send notification.");
//       }
  
//     } catch (bookingError) {
//       console.error("Error creating booking:", bookingError);
//       if (bookingError.response?.status === 409) {
//         setError("You have already booked this service.");
//       } else {
//         setError("Failed to book the service. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <Container className="d-flex justify-content-center align-items-center my-5">
//       <Card
//         className="booking-card shadow-lg p-4 w-100"
//         style={{ maxWidth: "500px", borderRadius: "20px" }}
//       >
//         <h3 className="text-center mb-4 fw-bold">Book Service</h3>
//         {error && <Alert variant="danger">{error}</Alert>}
//         {success && <Alert variant="success">{success}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="bookingDate" className="mb-4">
//             <Form.Label className="fw-semibold">Select Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={bookingDate}
//               onChange={(e) => setBookingDate(e.target.value)}
//               required
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Form.Group controlId="totalPrice" className="mb-4">
//             <Form.Label className="fw-semibold">Total Price</Form.Label>
//             <Form.Control
//               type="number"
//               value={totalPrice}
//               onChange={(e) => setTotalPrice(e.target.value)}
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Form.Group controlId="specialRequests" className="mb-4">
//             <Form.Label className="fw-semibold">Special Requests (optional)</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Any specific instructions?"
//               value={specialRequests}
//               onChange={(e) => setSpecialRequests(e.target.value)}
//               className="form-control-lg rounded-3"
//             />
//           </Form.Group>

//           <Button
//             variant="primary"
//             type="submit"
//             className="w-100 py-2 rounded-pill"
//             disabled={loading}
//           >
//             {loading ? (
//               <Spinner as="span" animation="border" size="sm" />
//             ) : (
//               "Book Now"
//             )}
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default BookingForm;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "./BookingForm.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const BookingForm = ({ service }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookingDate, setBookingDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(service.service.price);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Initialize socket
  const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
  });

  useEffect(() => {
    // Join the current user for real-time notifications
    if (user) {
      socket.emit("join", user._id);
      console.log(`User ${user._id} connected for notifications`);
    }

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      // Create the booking
      const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, {
        user: user._id,
        service: service.service._id,
        provider: service.service.provider._id,
        bookingDate,
        totalPrice,
        specialRequests,
      });

      const booking = bookingResponse.data.data;
      console.log("Booking created:", booking);

      // Send real-time notification
      const notification = {
        recipientId: service.service.provider._id,
        type: "booking",
        message: `${user.name} booked your service: ${service.service.title}`,
        targetId: booking._id,
        targetType: "booking",
      };

      // Emit the notification to the server
      socket.emit("sendNotification", notification);

      setSuccess("Booking successful!");
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (bookingError) {
      console.error("Error creating booking:", bookingError);
      if (bookingError.response?.status === 409) {
        setError("You have already booked this service.");
      } else {
        setError("Failed to book the service. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center my-5">
      <Card
        className="booking-card shadow-lg p-4 w-100"
        style={{ maxWidth: "500px", borderRadius: "20px" }}
      >
        <h3 className="text-center mb-4 fw-bold">Book Service</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="bookingDate" className="mb-4">
            <Form.Label className="fw-semibold">Select Date</Form.Label>
            <Form.Control
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="form-control-lg rounded-3"
            />
          </Form.Group>

          <Form.Group controlId="totalPrice" className="mb-4">
            <Form.Label className="fw-semibold">Total Price</Form.Label>
            <Form.Control
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              className="form-control-lg rounded-3"
            />
          </Form.Group>

          <Form.Group controlId="specialRequests" className="mb-4">
            <Form.Label className="fw-semibold">Special Requests (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Any specific instructions?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="form-control-lg rounded-3"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 rounded-pill"
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Book Now"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default BookingForm;
