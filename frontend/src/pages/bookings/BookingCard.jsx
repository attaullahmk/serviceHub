// import { Col, Button } from "react-bootstrap";
// import { FaCalendarAlt, FaDollarSign, FaInfoCircle, FaTrash } from "react-icons/fa";
// import PaymentForm from "./PaymentForm";

// const BookingCard = ({ booking, onCancelClick, onDetailsClick }) => {
//   const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");

//   return (
//     <Col xs={12} sm={6} md={6} lg={4} xl={3}>
//       <div className="border rounded shadow-sm overflow-hidden position-relative p-3 bg-white h-100">
//         <div className={`position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-semibold ${
//           booking.status === "confirmed" ? "bg-success-subtle text-success"
//           : booking.status === "pending" ? "bg-warning-subtle text-warning"
//           : "bg-danger-subtle text-danger"
//         }`}>
//           {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//         </div>

//         <div className="bg-light text-center mb-3" style={{ height: "160px" }}>
//           <img
//             src={booking.service.imageGallery[0]}
//             alt={booking.service.title}
//             className="img-fluid h-100 object-fit-contain"
//           />
//         </div>

//         <h6 className="fw-bold text-truncate">{booking.service.title}</h6>

//         <div className="small mb-1">
//           <FaCalendarAlt className="me-2" />
//           {formatDate(booking.bookingDate)}
//         </div>

//         <div className="small mb-2">
//           <FaDollarSign className="me-2" />
//           PKR {booking.totalPrice.toFixed(2)}
//         </div>

//         <div className="d-flex justify-content-between align-items-center mt-3">
//           <Button variant="light" size="sm" onClick={() => onDetailsClick(booking)}>
//             <FaInfoCircle className="me-1" /> Details
//           </Button>

//           {booking.status !== "confirmed" && (
//             <Button variant="outline-danger" size="sm" onClick={() => onCancelClick(booking._id)}>
//               <FaTrash className="me-1" /> Cancel
//             </Button>
//           )}
//         </div>

//         {booking.paymentStatus === "paid" && (
//           <span className="position-absolute bottom-0 end-0 m-2 small bg-success-subtle text-success px-2 py-1 rounded-pill">
//             Paid
//           </span>
//         )}

//         {booking.status === "confirmed" && booking.paymentStatus !== "paid" && (
//           <div className="mt-3 p-2 border-top">
//             <PaymentForm bookingId={booking._id} />
//           </div>
//         )}
//       </div>
//     </Col>
//   );
// };

// export default BookingCard;


import { Col, Button } from "react-bootstrap";
import { FaCalendarAlt, FaDollarSign, FaInfoCircle, FaTrash } from "react-icons/fa";
import PaymentForm from "./PaymentForm";

const BookingCard = ({ booking, onCancelClick, onDetailsClick }) => {
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");

  const getStatusClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-success-subtle text-success";
      case "pending":
        return "bg-warning-subtle text-warning";
      case "cancelled":
        return "bg-danger-subtle text-danger";
      case "completed":
        return "bg-primary-subtle text-primary";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <Col xs={12} sm={6} md={6} lg={4} xl={3}>
      <div className="border rounded shadow-sm overflow-hidden position-relative p-3 bg-white h-100">
        <div
          className={`position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-semibold ${getStatusClasses(
            booking.status
          )}`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>

        <div className="bg-light text-center mb-3" style={{ height: "160px" }}>
          <img
            src={booking.service.imageGallery[0]}
            alt={booking.service.title}
            className="img-fluid h-100 object-fit-contain"
          />
        </div>

        <h6 className="fw-bold text-truncate">{booking.service.title}</h6>

        <div className="small mb-1">
          <FaCalendarAlt className="me-2" />
          {formatDate(booking.bookingDate)}
        </div>

        <div className="small mb-2">
          <FaDollarSign className="me-2" />
          PKR {booking.totalPrice.toFixed(2)}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button variant="light" size="sm" onClick={() => onDetailsClick(booking)}>
            <FaInfoCircle className="me-1" /> Details
          </Button>

          {booking.status !== "confirmed" && booking.status !== "completed" && (
            <Button variant="outline-danger" size="sm" onClick={() => onCancelClick(booking._id)}>
              <FaTrash className="me-1" /> Cancel
            </Button>
          )}
        </div>

        {booking.status === "completed" ? (
          <span className="position-absolute bottom-0 end-0 m-2 small bg-primary-subtle text-primary px-2 py-1 rounded-pill">
            Completed
          </span>
        ) : booking.paymentStatus === "paid" ? (
          <span className="position-absolute bottom-0 end-0 m-2 small bg-success-subtle text-success px-2 py-1 rounded-pill">
            Paid
          </span>
        ) : null}

        {booking.status === "confirmed" && booking.paymentStatus !== "paid" && (
          <div className="mt-3 p-2 border-top">
            <PaymentForm bookingId={booking._id} />
          </div>
        )}
      </div>
    </Col>
  );
};

export default BookingCard;
