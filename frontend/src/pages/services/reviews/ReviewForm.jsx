import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";
import "./ReviewForm.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewForm = ({ serviceId, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const userId = user ? user._id : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!userId) {
      setError("You must be logged in to submit a review.");
      setIsSubmitting(false);
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/reviews`, {
        serviceId,
        rating,
        comment,
        userId,
      });

      setSuccess("Review submitted successfully!");
      setComment("");
      setRating(5);
      // Call the callback to update the parent component
      if (onReviewSubmit) {
        onReviewSubmit(response.data.review);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "Failed to submit review.");
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h4 className="review-form-title ">Leave a Review</h4>
      {success && <Alert variant="success" className="review-alert">{success}</Alert>}
      {error && <Alert variant="danger" className="review-alert">{error}</Alert>}
      
      <Form onSubmit={handleSubmit} className="review-form">
        <Form.Group controlId="rating" className="mb-4">
          {/* <Form.Label className="rating-label">Your Rating</Form.Label> */}
          <div className="star-rating">
            <ReactStars
              count={5}
              size={36}
              value={rating}
              onChange={setRating}
              color1={"#e0e0e0"} // Inactive stars
              color2={"#ffb400"} // Active stars
              half={false}
            />
            <span className="rating-value">{rating} out of 5</span>
          </div>
        </Form.Group>

        <Form.Group controlId="comment" className="mb-4">
          {/* <Form.Label className="comment-label">Your Review</Form.Label> */}
          <Form.Control
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this service..."
            className="review-textarea"
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="submit-review-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm;


