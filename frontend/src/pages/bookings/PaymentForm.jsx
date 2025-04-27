import { Button } from "react-bootstrap";

const PaymentForm = ({ bookingId }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Payment submitted for booking ID: ${bookingId}`);
    // TODO: Replace with real payment API logic
  };

  return (
    <>
      <h6 className="mb-2">Complete Your Payment</h6>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input type="text" className="form-control form-control-sm" placeholder="Card Number" required />
        </div>
        <div className="mb-2">
          <input type="text" className="form-control form-control-sm" placeholder="Card Holder Name" required />
        </div>
        <div className="mb-2 d-flex gap-2">
          <input type="text" className="form-control form-control-sm" placeholder="MM/YY" required />
          <input type="text" className="form-control form-control-sm" placeholder="CVV" required />
        </div>
        <Button type="submit" size="sm" variant="primary">Pay Now</Button>
      </form>
    </>
  );
};

export default PaymentForm;
