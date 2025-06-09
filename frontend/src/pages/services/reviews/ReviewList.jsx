import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, Dropdown } from "react-bootstrap";
import ReviewStars from "./ReviewStars";
import "./ReviewList.css";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import defaultAvatar from "../../../assets/image/logoo.jpg";
import {
  FaLightbulb,
  FaRegHandPaper,
  FaHeart,
  FaSadTear,
} from "react-icons/fa";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewList = ({ serviceId, newReview }) => {
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [clickedReaction, setClickedReaction] = useState(null);

  const currentUser = useSelector((state) => state.auth.user);
  const [detailModal, setDetailModal] = useState(false);

  // Validate and normalize review data
  const validateReview = (review) => {
    if (!review || typeof review !== "object") return null;

    return {
      _id: review._id || Math.random().toString(36).substr(2, 9),
      userId: {
        _id: review.userId?._id || "unknown",
        name: review.userId?.name || "Anonymous",
      },
      rating:
        typeof review.rating === "number"
          ? Math.min(5, Math.max(1, review.rating))
          : 3,
      comment: typeof review.comment === "string" ? review.comment : "",
      createdAt: review.createdAt || new Date().toISOString(),
      userProfile: review.userProfile || null,
      reactions: review.reactions || {
        helpful: [],
        thanks: [],
        loveThis: [],
        ohNo: [],
      },
    };
  };

  // Fetch reviews with proper error handling
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/services/${serviceId}`);

      if (response.data?.success) {
        const validReviews = [];

        // Process reviews sequentially to ensure proper error handling
        for (const review of response.data.service?.reviews || []) {
          const validated = validateReview(review);
          if (!validated) continue;

          try {
            const profileResponse = await axios.get(
              `${BASE_URL}/api/userProfiles/${validated.userId._id}`
            );
            validated.userProfile = profileResponse.data?.profile || null;
          } catch (profileError) {
            validated.userProfile = null;
          }

          validReviews.push(validated);
        }

        setReviews(validReviews);
      } else {
        setError("No reviews available.");
      }
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  // Handle reaction click
  const handleReactionClick = async (reviewId, reactionType) => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/reviews/${reviewId}/reactions`,
        {
          reactionType,
          userId: currentUser._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? { ...review, reactions: response.data.review.reactions }
              : review
          )
        );
        setClickedReaction(reactionType);
        setTimeout(() => setClickedReaction(null), 300);
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  // Check if current user has reacted
  const hasReacted = (review, reactionType) => {
    return review.reactions?.[reactionType]?.includes(currentUser?._id);
  };

  // Handle initial load
  useEffect(() => {
    fetchReviews();
  }, [serviceId]);

  // Handle new reviews
  useEffect(() => {
    const processNewReview = async () => {
      if (newReview) {
        const validated = validateReview(newReview);
        if (validated) {
          try {
            const profileResponse = await axios.get(
              `${BASE_URL}/api/userProfiles/${validated.userId._id}`
            );
            validated.userProfile = profileResponse.data?.profile || null;
          } catch (profileError) {
            validated.userProfile = null;
          }

          setReviews((prev) => [validated, ...prev]);
        }
      }
    };

    processNewReview();
  }, [newReview]);

  // Update review in state
  const updateReviewInState = (updatedReview) => {
    const validated = validateReview(updatedReview);
    if (validated) {
      setReviews((prev) =>
        prev.map((r) => (r._id === validated._id ? validated : r))
      );
    }
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "latest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "highest") return b.rating - a.rating;
    if (sortOption === "lowest") return a.rating - b.rating;
    return 0;
  });

  const displayedReviews = sortedReviews.slice(0, 6);
  const hasMoreReviews = reviews.length > 6;

  const formatTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setDetailModal(true);
  };

  const handleEdit = (review, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    setSelectedReview(review); // Keep the selected review
    setEditComment(review.comment);
    setEditRating(review.rating);

    setEditModal(true);
    setDetailModal(false); // 👈 This ensures detail modal doesn't open
  };

  const handleDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert("Error deleting review.");
    }
  };

  const submitEdit = async () => {
    console.log("Submitting edit for review:", selectedReview);
    try {
      // const token = localStorage.getItem('token');
      console.log(`${BASE_URL}/api/reviews/${selectedReview._id}`);
      const response = await axios.put(
        `${BASE_URL}/api/reviews/${selectedReview._id}`,
        { comment: editComment, rating: editRating }
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        await fetchReviews(); // Refresh the list from server
        setEditModal(false);
      }
    } catch {
      alert("Failed to update review.");
    }
  };

  return (
    <div className="reviews-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="reviews-title">Customer Reviews</h3>
        {reviews.length > 0 && (
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="modern-sort-select"
          >
            <option value="latest">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </Form.Select>
        )}
      </div>

      {error && <p className="text-danger">{error}</p>}

      {loading ? (
        <div className="loading-spinner">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <>
          <div className="review-grid">
            {displayedReviews.map((review) => (
              <div
                key={review._id}
                className="modern-review-card position-relative"
              >
                <div className="review-header">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="reviewer-avatar">
                      <img
                        src={
                          review.userProfile?.profilePicture || defaultAvatar
                        }
                        alt={review.userId.name}
                        className="profile-image"
                        onError={(e) => {
                          e.target.src = defaultAvatar;
                        }}
                      />
                    </div>
                    <div className="reviewer-info">
                      <span className="reviewer-name">
                        {review.userId.name}
                      </span>
                      {review.userProfile?.location && (
                        <span className="reviewer-location">
                          {review.userProfile.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="review-meta d-flex justify-content-between align-items-center">
                    <ReviewStars rating={review.rating} />
                    <span className="review-time">
                      {formatTime(review.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="review-content">
                  <p className="review-comment">
                    {review.comment.length > 150 ? (
                      <>
                        {review.comment.substring(0, 150)}...
                        <button
                          className="modern-show-more-btn"
                          onClick={() => openReviewModal(review)}
                        >
                          Show more
                        </button>
                      </>
                    ) : (
                      review.comment
                    )}
                  </p>
                </div>

                {currentUser && currentUser._id === review.userId._id && (
                  <div className="review-actions-wrapper">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="link"
                        bsPrefix="three-dot-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEdit(review)}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(review._id)}>
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}

                {/* Add this reactions section */}
                <div className="review-reactions mt-3">
                  {[
                    { type: "helpful", icon: <FaLightbulb />, color: "orange" },
                    {
                      type: "thanks",
                      icon: <FaRegHandPaper />,
                      color: "green",
                    },
                    { type: "loveThis", icon: <FaHeart />, color: "red" },
                    { type: "ohNo", icon: <FaSadTear />, color: "blue" },
                  ].map(({ type, icon, color }) => (
                    <motion.div
                      key={type}
                      whileTap={{ scale: 1.3 }}
                      animate={{
                        scale: clickedReaction === type ? [1, 1.4, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="reaction-icon"
                      onClick={() => handleReactionClick(review._id, type)}
                      style={{
                        color: hasReacted(review, type) ? color : "#666",
                        cursor: "pointer",
                      }}
                      title={type.charAt(0).toUpperCase() + type.slice(1)}
                    >
                      {icon}
                      <span className="reaction-count">
                        {review.reactions?.[type]?.length || 0}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {hasMoreReviews && (
            <div className="text-center mt-4">
              <Button
                variant="primary"
                onClick={() => setShowAllReviews(true)}
                className="modern-show-all-btn"
              >
                Show all {reviews.length} reviews
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="no-reviews-message">
          No reviews yet. Be the first to review!
        </p>
      )}

      <Modal
        show={!!selectedReview}
        onHide={() => setSelectedReview(null)}
        centered
        className="review-modal"
      >
        {selectedReview && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Review Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="reviewer-info-modal">
                <div className="reviewer-avatar">
                  <img
                    src={
                      selectedReview.userProfile?.profilePicture ||
                      defaultAvatar
                    }
                    alt={selectedReview.userId.name}
                    className="profile-image"
                  />
                </div>
                <div>
                  <h5>{selectedReview.userId.name}</h5>
                  {selectedReview.userProfile?.location && (
                    <p>{selectedReview.userProfile.location}</p>
                  )}
                </div>
              </div>
              <div className="review-meta-modal">
                <ReviewStars rating={selectedReview.rating} />
                <span>{formatTime(selectedReview.createdAt)}</span>
              </div>
              <div>
                <p>{selectedReview.comment}</p>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      <Modal show={editModal} onHide={() => setEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Your Rating:</label>
            <div className="editable-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setEditRating(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: star <= editRating ? "gold" : "lightgray",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <Form.Group controlId="editComment">
            <Form.Label>Your Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewList;
