// import { Button } from "react-bootstrap";

// const PaymentForm = ({ bookingId }) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Payment submitted for booking ID: ${bookingId}`);
//     // TODO: Replace with real payment API logic
//   };

//   return (
//     <>
//       <h6 className="mb-2">Complete Your Payment</h6>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-2">
//           <input type="text" className="form-control form-control-sm" placeholder="Card Number" required />
//         </div>
//         <div className="mb-2">
//           <input type="text" className="form-control form-control-sm" placeholder="Card Holder Name" required />
//         </div>
//         <div className="mb-2 d-flex gap-2">
//           <input type="text" className="form-control form-control-sm" placeholder="MM/YY" required />
//           <input type="text" className="form-control form-control-sm" placeholder="CVV" required />
//         </div>
//         <Button type="submit" size="sm" variant="primary">Pay Now</Button>
//       </form>
//     </>
//   );
// };

// export default PaymentForm;


import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const PaymentForm = ({ bookingId }) => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const { cardNumber, cardHolder, expiry, cvv } = formData;

    if (!/^\d{16}$/.test(cardNumber)) errs.cardNumber = "Card number must be 16 digits";
    if (cardHolder.trim() === "") errs.cardHolder = "Card holder name is required";
    // if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = "Expiry must be in MM/YY format";
    if (!/^\d{3,4}$/.test(cvv)) errs.cvv = "CVV must be 3 or 4 digits";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
console.log("Form data:", formData, "Booking ID:", bookingId);
console.log(BASE_URL , "Booking ID:", bookingId);
    try {
const response = await axios.patch(
  `${BASE_URL}/api/bookings/${bookingId}/status`,
  { status: "completed" }, // ✅ use "completed" as your schema expects
  // {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }
);
console.log(response.data);
window.location.reload();
    // setTimeout(() => navigate("/bookings"), 1000);
// useNavigate('/bookings', { replace: true });
      // alert("Payment successful and booking status updated!");
       // Redirect to bookings page
      
      // Refresh the page to ensure latest data is loaded
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  return (
    <>
      <h6 className="mb-2">Complete Your Payment</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            size="sm"
            value={formData.cardNumber}
            onChange={handleChange}
            isInvalid={!!errors.cardNumber}
          />
          <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            name="cardHolder"
            placeholder="Card Holder Name"
            size="sm"
            value={formData.cardHolder}
            onChange={handleChange}
            isInvalid={!!errors.cardHolder}
          />
          <Form.Control.Feedback type="invalid">{errors.cardHolder}</Form.Control.Feedback>
        </Form.Group>

        <div className="mb-2 d-flex gap-2">
          <Form.Group className="w-50">
            <Form.Control
              type="text"
              name="expiry"
              placeholder="MM/YY"
              size="sm"
              value={formData.expiry}
              onChange={handleChange}
              isInvalid={!!errors.expiry}
            />
            <Form.Control.Feedback type="invalid">{errors.expiry}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="w-50">
            <Form.Control
              type="text"
              name="cvv"
              placeholder="CVV"
              size="sm"
              value={formData.cvv}
              onChange={handleChange}
              isInvalid={!!errors.cvv}
            />
            <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
          </Form.Group>
        </div>

        <Button type="submit" size="sm" variant="primary">
          Pay Now
        </Button>
      </Form>
    </>
  );
};

export default PaymentForm;
