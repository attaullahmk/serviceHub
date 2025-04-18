import { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Button, Form } from "react-bootstrap";
import ReactStars from "react-stars"; // Import react-stars

const ReviewList = ({ serviceId, newReview, user }) => {
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/services/${serviceId}`);
        if (response.data.success && response.data.service) {
          setReviews(response.data.service.reviews);
        } else {
          setError("No reviews available.");
        }
      } catch (err) {
        setError("Failed to load reviews.");
      }
    };
    fetchReviews();
  }, [serviceId]);

  useEffect(() => {
    if (newReview) {
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    }
  }, [newReview]);

  // Sort Reviews based on user selection
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "highest") {
      return b.rating - a.rating;
    } else if (sortOption === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Paginated Reviews
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review.");
      }
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditedComment(review.comment);
  };

  const handleEditSubmit = async (reviewId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/reviews/${reviewId}`, {
        comment: editedComment,
      });
      if (response.data.success) {
        setReviews(reviews.map((review) =>
          review._id === reviewId ? { ...review, comment: editedComment } : review
        ));
        setEditingReview(null);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review.");
    }
  };

  return (
    <div className="mt-4">
      <h4>Customer Reviews</h4>
      
      {/* Display Summary of Ratings */}
      {reviews.length > 0 && (
        <div className="mb-3">
          <h5>Overall Rating</h5>
          <ReactStars 
            count={5}
            value={reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length} 
            edit={false} 
            size={24}
            color1="#ccc"
            color2="#ffd700"
          />
          <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
        </div>
      )}

      {/* Sort Reviews Dropdown */}
      <Form.Select onChange={(e) => setSortOption(e.target.value)} className="mb-3">
        <option value="latest">Most Recent</option>
        <option value="highest">Highest Rated</option>
        <option value="lowest">Lowest Rated</option>
      </Form.Select>

      {error && <p className="text-danger">{error}</p>}
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <>
          <ListGroup>
            {paginatedReviews.map((review) => {
              const isReviewOwner = user?._id === review.userId?._id;
              return (
                <ListGroup.Item key={review._id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <strong>{review.userId?.name || "Anonymous"}</strong>
                      </Card.Title>
                      <Card.Text>
                        <ReactStars
                          count={5}
                          value={review.rating}
                          edit={false}
                          size={24}
                          color1="#ccc"
                          color2="#ffd700"
                        />
                      </Card.Text>
                      {editingReview === review._id ? (
                        <>
                          <Form.Control
                            as="textarea"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                          />
                          <Button 
                            variant="success" 
                            className="mt-2 me-2"
                            onClick={() => handleEditSubmit(review._id)}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="mt-2"
                            onClick={() => setEditingReview(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Card.Text>{review.comment}</Card.Text>
                      )}
                      <Card.Footer className="text-muted">
                        {new Date(review.createdAt).toLocaleString()}
                      </Card.Footer>
                      {isReviewOwner && !editingReview && (
                        <div className="d-flex justify-content-end mt-2">
                          <Button 
                            variant="warning" 
                            className="me-2"
                            onClick={() => handleEditClick(review)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              );
            })}
          </ListGroup>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between mt-3">
            <Button 
              variant="secondary" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button 
              variant="primary" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewList;
