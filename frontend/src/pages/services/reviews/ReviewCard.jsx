import { motion } from "framer-motion";
import { FaLightbulb, FaRegHandPaper, FaHeart, FaSadTear } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import ReviewStars from "./ReviewStars";
import { formatDistanceToNow } from 'date-fns';

const ReviewCard = ({
  review,
  currentUser,
  handleEdit,
  handleDelete,
  handleReactionClick,
  hasReacted,
  clickedReaction,
  openReviewModal
}) => {
  return (
    <div className="modern-review-card position-relative">
      <div className="review-header">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="reviewer-avatar">
            <img 
              src={review.userProfile?.profilePicture || defaultAvatar} 
              alt={review.userId.name}
              className="profile-image"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
          </div>
          <div className="reviewer-info">
            <span className="reviewer-name">{review.userId.name}</span>
            {review.userProfile?.location && (
              <span className="reviewer-location">{review.userProfile.location}</span>
            )}
          </div>
        </div>
        <div className="review-meta d-flex justify-content-between align-items-center">
          <ReviewStars rating={review.rating} />
          <span className="review-time">{formatTime(review.createdAt)}</span>
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
          ) : review.comment}
        </p>
      </div>

      {currentUser && currentUser._id === review.userId._id && (
        <div className="review-actions-wrapper">
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" bsPrefix="three-dot-button">
              {/* Three dots icon */}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => handleEdit(review, e)}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(review._id)}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      <div className="review-reactions mt-3">
        {[
          { type: "helpful", icon: <FaLightbulb />, color: "orange" },
          { type: "thanks", icon: <FaRegHandPaper />, color: "green" },
          { type: "loveThis", icon: <FaHeart />, color: "red" },
          { type: "ohNo", icon: <FaSadTear />, color: "blue" }
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
              cursor: "pointer"
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
  );
};

export default ReviewCard;