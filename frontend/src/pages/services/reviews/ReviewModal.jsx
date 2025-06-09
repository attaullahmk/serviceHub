import { Modal } from "react-bootstrap";
import ReviewStars from "./ReviewStars";

const ReviewModal = ({ selectedReview, onHide, formatTime }) => {
  return (
    <Modal show={!!selectedReview} onHide={onHide} centered className="review-modal">
      {selectedReview && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Review Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Modal content */}
          </Modal.Body>
        </>
      )}
    </Modal>
  );
};

export default ReviewModal;