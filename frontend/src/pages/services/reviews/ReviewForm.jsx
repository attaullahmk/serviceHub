import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactStars from "react-stars"; // Import ReactStars
import "./ReviewForm.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewForm = ({ serviceId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const userId = user ? user._id : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("You must be logged in to submit a review.");
      return;
    }

    try {
      console.log({ serviceId, rating, comment, userId });

      const response = await axios.post(`${BASE_URL}/api/reviews`, {
        serviceId,
        rating,
        comment,
        userId,
      });

      setSuccess("Review submitted successfully!");
      setComment("");
      setRating(5);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(err.response.data);
        setError(err.response.data.message || "Failed to submit review. Please try again.");
      } else {
        console.log("err",err.response.status)
        
        setError("Failed to submit review. Please try again.");
      }
    }
  };

  return (
    <div className="mt-4">
      <h4>Leave a Review</h4>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="rating">
          <Form.Label>Rating</Form.Label>
          <div className="star-rating">
            <ReactStars
              count={5}
              size={30}
              value={rating}
              onChange={(newRating) => setRating(newRating)}
              color1={"#ddd"} // Inactive stars color
              color2={"#ffd700"} // Active stars color (gold)
            />
          </div>
        </Form.Group>

        <Form.Group controlId="comment" className="mt-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm;