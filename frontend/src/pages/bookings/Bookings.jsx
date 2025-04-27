// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaDollarSign,
//   FaInfoCircle,
//   FaTrash,
// } from "react-icons/fa";
// import "./bookings.css";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user) return;

//     const fetchBookings = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/bookings/user/${user._id}`
//         );
//         setBookings(response.data.data);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [user]);

//   const handleCancelClick = (bookingId) => {
//     setSelectedBooking(bookings.find((b) => b._id === bookingId));
//     setShowModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     try {
//       await axios.delete(
//         `http://localhost:3000/api/bookings/${selectedBooking._id}`
//       );
//       setBookings((prev) =>
//         prev.filter((b) => b._id !== selectedBooking._id)
//       );
//     } catch (error) {
//       console.error("Cancellation failed:", error);
//     } finally {
//       setShowModal(false);
//     }
//   };

//   const handleDetailsClick = (booking) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   const formatDate = (dateStr) =>
//     new Date(dateStr).toLocaleDateString("en-US");

//   return (
//     <Container fluid className="my-5">
//       <h4 className="fw-bold px-2 px-sm-4 mb-4">My Bookings</h4>

//       {loading ? (
//         <div className="text-center my-5">
//           <Spinner animation="border" className="text-primary" />
//           <p className="mt-2">Fetching bookings...</p>
//         </div>
//       ) : bookings.length === 0 ? (
//         <div className="text-center text-muted my-5">
//           <h4>No bookings found</h4>
//           <p>Try booking a service.</p>
//         </div>
//       ) : (
//         <Row className="g-4 px-2 px-sm-4">
//           {bookings.map((booking) => (
          
//             <Col key={booking._id} xs={12} sm={6} md={6} lg={4} xl={3}>
//               <div className="border rounded shadow-sm overflow-hidden position-relative p-3 bg-white h-100">
//                 <div
//                   className={`position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-semibold ${
//                     booking.status === "confirmed"
//                       ? "bg-success-subtle text-success"
//                       : booking.status === "pending"
//                       ? "bg-warning-subtle text-warning"
//                       : "bg-danger-subtle text-danger"
//                   }`}
//                 >
//                   {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                 </div>
//                 {console.log("booking delelte ",booking.isDeleted)}
//                 <div className="bg-light text-center mb-3" style={{ height: "160px" }}>
//                   <img
//                     src={booking.service.imageGallery[0]}
//                     alt={booking.service.title}
//                     className="img-fluid h-100 object-fit-contain"
//                   />
//                 </div>

//                 <h6 className="fw-bold text-truncate">{booking.service.title}</h6>

//                 <div className="small mb-1">
//                   <FaCalendarAlt className="me-2" />
//                   {formatDate(booking.bookingDate)}
//                 </div>
//                 {/* <div className="small mb-1">
//                   <FaClock className="me-2" />
//                   05:00 AM
//                 </div> */}
//                 <div className="small mb-2">
//                   <FaDollarSign className="me-2" />
//                   PKR {booking.totalPrice.toFixed(2)}
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mt-3">
//                   <Button
//                     variant="light"
//                     size="sm"
//                     onClick={() => handleDetailsClick(booking)}
//                   >
//                     <FaInfoCircle className="me-1" /> Details
//                   </Button>

//                   {/* Only show cancel button if not confirmed */}
//                   {booking.status !== "confirmed" && (
//                     <Button
//                       variant="outline-danger"
//                       size="sm"
//                       onClick={() => handleCancelClick(booking._id)}
//                     >
//                       <FaTrash className="me-1" /> Cancel
//                     </Button>
//                   )}
//                 </div>

//                 {booking.paymentStatus === "paid" && (
//                   <span className="position-absolute bottom-0 end-0 m-2 small bg-success-subtle text-success px-2 py-1 rounded-pill">
//                     Paid
//                   </span>
//                 )}

//                 {/* Show payment form if confirmed but not yet paid */}
//                 {booking.status === "confirmed" && booking.paymentStatus !== "paid" && (
//                   <div className="mt-3 p-2 border-top">
//                     <h6 className="mb-2">Complete Your Payment</h6>
//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         alert(`Payment submitted for booking ID: ${booking._id}`);
//                         // TODO: Replace with API call to mark payment as paid
//                       }}
//                     >
//                       <div className="mb-2">
//                         <input
//                           type="text"
//                           className="form-control form-control-sm"
//                           placeholder="Card Number"
//                           required
//                         />
//                       </div>
//                       <div className="mb-2">
//                         <input
//                           type="text"
//                           className="form-control form-control-sm"
//                           placeholder="Card Holder Name"
//                           required
//                         />
//                       </div>
//                       <div className="mb-2 d-flex gap-2">
//                         <input
//                           type="text"
//                           className="form-control form-control-sm"
//                           placeholder="MM/YY"
//                           required
//                         />
//                         <input
//                           type="text"
//                           className="form-control form-control-sm"
//                           placeholder="CVV"
//                           required
//                         />
//                       </div>
//                       <Button type="submit" size="sm" variant="primary">
//                         Pay Now
//                       </Button>
//                     </form>
//                   </div>
//                 )}
//               </div>
//             </Col>
//           ))}
//         </Row>
//       )}

//       {/* Booking Details & Cancel Modal */}
//       <Modal
//         show={showModal && selectedBooking}
//         onHide={() => setShowModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedBooking && selectedBooking.status === "canceled"
//               ? "Booking Canceled"
//               : "Booking Details"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedBooking && (
//             <>
//               <p className="text-muted">
//                 Complete information about your booking
//               </p>
//               <p><strong>Service:</strong> {selectedBooking.service.title}</p>
//               <p><strong>Provider:</strong> {selectedBooking.provider.name}</p>
//               <p><strong>Date:</strong> {formatDate(selectedBooking.bookingDate)}</p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 <span className="badge bg-success-subtle text-success">
//                   {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
//                 </span>
//               </p>
//               <p>
//                 <strong>Payment:</strong>{" "}
//                 <span className="badge bg-success-subtle text-success">
//                   {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
//                 </span>
//               </p>
//               <p><strong>Price:</strong> PKR {selectedBooking.totalPrice.toFixed(2)}</p>
//               <p><strong>Booked on:</strong> {formatDate(selectedBooking.createdAt)}</p>
//               {selectedBooking.specialRequests && (
//                 <p><strong>Special Requests:</strong> {selectedBooking.specialRequests}</p>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           {/* {selectedBooking && selectedBooking.status !== "canceled" && ( */}
//             <Button variant="danger" onClick={handleConfirmCancel}>
//               Cancel Booking
//             </Button>
//           {/* )} */}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default MyBookings;
