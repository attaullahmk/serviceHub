import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, Dropdown } from "react-bootstrap";
import ReviewStars from "./ReviewStars";
import './ReviewList.css';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from "react-redux";
import defaultAvatar from '../../../assets/image/logoo.jpg';

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

  const currentUser = useSelector((state) => state.auth.user);

  // Validate and normalize review data
  const validateReview = (review) => {
    if (!review || typeof review !== 'object') return null;
    
    return {
      _id: review._id || Math.random().toString(36).substr(2, 9),
      userId: {
        _id: review.userId?._id || 'unknown',
        name: review.userId?.name || 'Anonymous'
      },
      rating: typeof review.rating === 'number' ? Math.min(5, Math.max(1, review.rating)) : 3,
      comment: typeof review.comment === 'string' ? review.comment : '',
      createdAt: review.createdAt || new Date().toISOString(),
      userProfile: review.userProfile || null
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
          
          setReviews(prev => [validated, ...prev]);
        }
      }
    };
    
    processNewReview();
  }, [newReview]);

  // Update review in state
  const updateReviewInState = (updatedReview) => {
    const validated = validateReview(updatedReview);
    if (validated) {
      setReviews(prev => prev.map(r => 
        r._id === validated._id ? validated : r
      ));
    }
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
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
  };

  // const handleEdit = (review) => {
  //   setSelectedReview(review);
  //   setEditComment(review.comment);
  //   setEditRating(review.rating);
  //   setEditModal(true);
  // };

    const handleEdit = (review, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    setSelectedReview(null); // Close details modal if open
    setEditComment(review.comment);
    setEditRating(review.rating);
    setEditModal(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      alert("Error deleting review.");
    }
  };

  // const submitEdit = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.put(
  //       `${BASE_URL}/api/reviews/${selectedReview._id}`,
  //       { comment: editComment, rating: editRating },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
      
  //     if (response.data?.success) {
  //       updateReviewInState(response.data.updatedReview);
  //       setEditModal(false);
  //     }
  //   } catch {
  //     alert("Failed to update review.");
  //   }
  // };



  const submitEdit = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${BASE_URL}/api/reviews/${selectedReview._id}`,
      { comment: editComment, rating: editRating },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data?.success) {
      await fetchReviews();  // Refresh the list from server
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
              <div key={review._id} className="modern-review-card position-relative">
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

                {/* {currentUser && currentUser._id === review.userId._id && (
                 <Dropdown className="review-options-dropdown dropstart">
  <Dropdown.Toggle variant="link" bsPrefix="three-dot-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
  </Dropdown.Toggle>
  <Dropdown.Menu className="dropdown-menu-end">
    <Dropdown.Item onClick={() => handleEdit(review)}>Edit</Dropdown.Item>
    <Dropdown.Item onClick={() => handleDelete(review._id)}>Delete</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>


                )} */}
                {currentUser && currentUser._id === review.userId._id && (
  <div className="review-actions-wrapper">
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" bsPrefix="three-dot-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleEdit(review)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => handleDelete(review._id)}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
)}

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
        <p className="no-reviews-message">No reviews yet. Be the first to review!</p>
      )}

      <Modal show={!!selectedReview} onHide={() => setSelectedReview(null)} centered className="review-modal">
        {selectedReview && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Review Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="reviewer-info-modal">
                <div className="reviewer-avatar">
                  <img 
                    src={selectedReview.userProfile?.profilePicture || defaultAvatar} 
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
              color: star <= editRating ? "gold" : "lightgray"
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






















// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form, Modal } from "react-bootstrap";
// import ReviewStars from "./ReviewStars";
// import './ReviewList.css';
// import { formatDistanceToNow } from 'date-fns';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const ReviewList = ({ serviceId, newReview, user }) => {
//   const [reviews, setReviews] = useState([]);
//   const [sortOption, setSortOption] = useState("latest");
//   const [error, setError] = useState(null);
//   const [showAllReviews, setShowAllReviews] = useState(false);
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/api/services/${serviceId}`);
//         if (response.data.success) {
//           const reviewsWithProfiles = await Promise.all(
//             response.data.service.reviews.map(async (review) => {
//               try {
//                 const profileResponse = await axios.get(
//                   `${BASE_URL}/api/userProfiles/${review.userId._id}`
//                 );
//                 return {
//                   ...review,
//                   userProfile: profileResponse.data.profile || null
//                 };
//               } catch (profileError) {
//                 console.error("Error fetching profile:", profileError);
//                 return {
//                   ...review,
//                   userProfile: null
//                 };
//               }
//             })
//           );
//           setReviews(reviewsWithProfiles);
//         } else {
//           setError("No reviews available.");
//         }
//       } catch (err) {
//         setError("Failed to load reviews.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReviews();
//   }, [serviceId]);

//   useEffect(() => {
//     if (newReview) {
//       setReviews((prevReviews) => [newReview, ...prevReviews]);
//     }
//   }, [newReview]);

//   const sortedReviews = [...reviews].sort((a, b) => {
//     if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sortOption === "highest") return b.rating - a.rating;
//     if (sortOption === "lowest") return a.rating - b.rating;
//     return 0;
//   });

//   const displayedReviews = sortedReviews.slice(0, 6);
//   const hasMoreReviews = reviews.length > 6;

// const formatTime = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffMins = Math.floor(diffMs / (1000 * 60));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffMins < 1) return "Just now";
//   if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
//   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

//   const openReviewModal = (review) => {
//     setSelectedReview(review);
//   };

//   return (
//     <div className="reviews-container">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>Customer Reviews</h3>
//         {reviews.length > 0 && (
//           <Form.Select 
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//             className="sort-select"
//           >
//             <option value="latest">Most Recent</option>
//             <option value="highest">Highest Rated</option>
//             <option value="lowest">Lowest Rated</option>
//           </Form.Select>
//         )}
//       </div>

//       {error && <p className="text-danger">{error}</p>}

//       {loading ? (
//         <div>Loading reviews...</div>
//       ) : reviews.length > 0 ? (
//         <>
//           <div className="review-grid">
//             {displayedReviews.map((review) => (
//               <div key={review._id} className="review-card">
//                 <div className="review-header">
//                   <div className="d-flex align-items-center mb-2">
//                     <div className="reviewer-avatar me-3">
//                       <img 
//                         src={review.userProfile?.profilePicture || "/default-avatar.jpg"} 
//                         alt={review.userId?.name || "Anonymous"}
//                         className="profile-image"
//                         onError={(e) => {
//                           e.target.src = "/default-avatar.jpg";
//                         }}
//                       />
//                     </div>
//                     <div className="reviewer-info">
//                       <span className="reviewer-name">
//                         <strong>{review.userId?.name || "Anonymous"}</strong>
//                       </span>
//                       {review.userProfile?.location && (
//                         <span className="reviewer-location d-block">
//                           {review.userProfile.location}
//                         </span>
//                       )}
//                     </div>
//                   </div>
// <div className="review-meta">
//   <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//     <ReviewStars rating={review.rating} />
//     <span className="review-time">{formatTime(review.createdAt)}</span>
//   </span>
// </div>


//                 </div>
//                 <p className="review-comment">
//                   {review.comment.length > 150 ? (
//                     <>
//                       {review.comment.substring(0, 150)}...
//                       <button 
//                         className="show-more-btn"
//                         onClick={() => openReviewModal(review)}
//                       >
//                         Show more
//                       </button>
//                     </>
//                   ) : (
//                     review.comment
//                   )}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {hasMoreReviews && (
//             <div className="text-center mt-4">
//               <Button 
//                 variant="outline-primary" 
//                 onClick={() => setShowAllReviews(true)}
//                 className="show-all-btn"
//               >
//                 Show all {reviews.length} reviews
//               </Button>
//             </div>
//           )}
//         </>
//       ) : (
//         <p>No reviews yet. Be the first to review!</p>
//       )}

//       {/* Modals remain the same */}
//       <Modal show={showAllReviews} onHide={() => setShowAllReviews(false)} size="lg" centered>
//         {/* ... modal content ... */}
//       </Modal>

//       <Modal show={!!selectedReview} onHide={() => setSelectedReview(null)} centered>
//         {/* ... modal content ... */}
//       </Modal>
//     </div>
//   );
// };

// export default ReviewList;


















// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form, ListGroup } from "react-bootstrap";
// import ReviewItem from "./ReviewItem";
// import ReviewStars from "./ReviewStars";
// import ConfirmDeleteModal from "./ConfirmDeleteModal";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const ReviewList = ({ serviceId, newReview, user }) => {
//   const [reviews, setReviews] = useState([]);
//   const [sortOption, setSortOption] = useState("latest");
//   const [error, setError] = useState(null);
//   const [editingReview, setEditingReview] = useState(null);
//   const [editedComment, setEditedComment] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 5;

//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [reviewToDelete, setReviewToDelete] = useState(null);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/services/${serviceId}`);
//         if (response.data.success && response.data.service?.reviews) {
//           setReviews(response.data.service.reviews || []);
//         } else {
//           setError("No reviews available.");
//           setReviews([]);
//         }
//       } catch (err) {
//         setError("Failed to load reviews.");
//         setReviews([]);
//       }
//     };
//     fetchReviews();
//   }, [serviceId]);

//   useEffect(() => {
//     if (newReview) {
//       setReviews((prevReviews) => [newReview, ...prevReviews]);
//     }
//   }, [newReview]);

//   const sortedReviews = [...reviews].sort((a, b) => {
//     if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sortOption === "highest") return b.rating - a.rating;
//     if (sortOption === "lowest") return a.rating - b.rating;
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
//   const paginatedReviews = sortedReviews.slice(
//     (currentPage - 1) * reviewsPerPage,
//     currentPage * reviewsPerPage
//   );

//   const confirmDelete = (reviewId) => {
//     setReviewToDelete(reviewId);
//     setShowConfirmModal(true);
//   };

//   const handleDeleteConfirmed = async () => {
//     try {
//       await axios.delete(`${BASE_URL}/api/reviews/${reviewToDelete}`);
//       setReviews(reviews.filter((r) => r._id !== reviewToDelete));
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       alert("Failed to delete review.");
//     } finally {
//       setShowConfirmModal(false);
//       setReviewToDelete(null);
//     }
//   };

//   const handleEditClick = (review) => {
//     setEditingReview(review._id);
//     setEditedComment(review.comment);
//   };

//   const handleEditSubmit = async (reviewId) => {
//     try {
//       const response = await axios.put(`${BASE_URL}/api/reviews/${reviewId}`, { 
//         comment: editedComment 
//       });
//       if (response.data.success) {
//         setReviews(
//           reviews.map((review) =>
//             review._id === reviewId ? { ...review, comment: editedComment } : review
//           )
//         );
//         setEditingReview(null);
//       }
//     } catch (error) {
//       console.error("Error updating review:", error);
//       alert("Failed to update review.");
//     }
//   };

//   // Calculate average rating
//   const averageRating = reviews.length > 0 
//     ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
//     : 0;

//   return (
//     <div className="mt-4">
//       <h4>Customer Reviews</h4>

//       {reviews.length > 0 && (
//         <div className="mb-3">
//           <h5>Overall Rating</h5>
//           <ReviewStars rating={averageRating} />
//           <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
//         </div>
//       )}

//       <Form.Select 
//         value={sortOption}
//         onChange={(e) => setSortOption(e.target.value)} 
//         className="mb-3"
//       >
//         <option value="latest">Most Recent</option>
//         <option value="highest">Highest Rated</option>
//         <option value="lowest">Lowest Rated</option>
//       </Form.Select>

//       {error && <p className="text-danger">{error}</p>}

//       <ListGroup>
//         {paginatedReviews.map((review) => (
//           <ReviewItem
//             key={review._id}
//             review={review}
//             user={user}
//             editingReview={editingReview}
//             editedComment={editedComment}
//             handleEditClick={handleEditClick}
//             handleEditSubmit={handleEditSubmit}
//             setEditedComment={setEditedComment}
//             setEditingReview={setEditingReview}
//             confirmDelete={confirmDelete}
//           />
//         ))}
//       </ListGroup>

//       {/* Pagination */}
//       {reviews.length > reviewsPerPage && (
//         <div className="d-flex justify-content-between mt-3">
//           <Button 
//             variant="secondary" 
//             disabled={currentPage === 1} 
//             onClick={() => setCurrentPage(currentPage - 1)}
//           >
//             Previous
//           </Button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <Button 
//             variant="primary" 
//             disabled={currentPage === totalPages} 
//             onClick={() => setCurrentPage(currentPage + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <ConfirmDeleteModal
//         show={showConfirmModal}
//         handleClose={() => setShowConfirmModal(false)}
//         handleConfirm={handleDeleteConfirmed}
//       />
//     </div>
//   );
// };

// export default ReviewList;







// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form, ListGroup } from "react-bootstrap";
// import ReviewItem from "./ReviewItem";
// import ReviewStars from "./ReviewStars";
// import ConfirmDeleteModal from "./ConfirmDeleteModal";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const ReviewList = ({ serviceId, newReview, user }) => {
//   const [reviews, setReviews] = useState([]);
//   const [sortOption, setSortOption] = useState("latest");
//   const [error, setError] = useState(null);
//   const [editingReview, setEditingReview] = useState(null);
//   const [editedComment, setEditedComment] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 5;

//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [reviewToDelete, setReviewToDelete] = useState(null);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/services/${serviceId}`);
//         if (response.data.success && response.data.service) {
//           setReviews(response.data.service.reviews);
//         } else {
//           setError("No reviews available.");
//         }
//       } catch (err) {
//         setError("Failed to load reviews.");
//       }
//     };
//     fetchReviews();
//   }, [serviceId]);

//   useEffect(() => {
//     if (newReview) {
//       setReviews((prevReviews) => [newReview, ...prevReviews]);
//     }
//   }, [newReview]);

//   const sortedReviews = [...reviews].sort((a, b) => {
//     if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sortOption === "highest") return b.rating - a.rating;
//     if (sortOption === "lowest") return a.rating - b.rating;
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
//   const paginatedReviews = sortedReviews.slice(
//     (currentPage - 1) * reviewsPerPage,
//     currentPage * reviewsPerPage
//   );

//   const confirmDelete = (reviewId) => {
//     setReviewToDelete(reviewId);
//     setShowConfirmModal(true);
//   };

//   const handleDeleteConfirmed = async () => {
//     try {
//       await axios.delete(`${BASE_URL}/api/reviews/${reviewToDelete}`);
//       setReviews(reviews.filter((r) => r._id !== reviewToDelete));
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       alert("Failed to delete review.");
//     } finally {
//       setShowConfirmModal(false);
//       setReviewToDelete(null);
//     }
//   };

//   const handleEditClick = (review) => {
//     setEditingReview(review._id);
//     setEditedComment(review.comment);
//   };

//   const handleEditSubmit = async (reviewId) => {
//     try {
//       const response = await axios.put(`${BASE_URL}/api/reviews/${reviewId}`, { comment: editedComment });
//       if (response.data.success) {
//         setReviews(
//           reviews.map((review) =>
//             review._id === reviewId ? { ...review, comment: editedComment } : review
//           )
//         );
//         setEditingReview(null);
//       }
//     } catch (error) {
//       console.error("Error updating review:", error);
//       alert("Failed to update review.");
//     }
//   };

//   return (
//     <div className="mt-4">
//       <h4>Customer Reviews</h4>

//       {reviews.length > 0 && (
//         <div className="mb-3">
//           <h5>Overall Rating</h5>
//           <ReviewStars reviews={reviews} />
//           <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
//         </div>
//       )}

//       <Form.Select onChange={(e) => setSortOption(e.target.value)} className="mb-3">
//         <option value="latest">Most Recent</option>
//         <option value="highest">Highest Rated</option>
//         <option value="lowest">Lowest Rated</option>
//       </Form.Select>

//       {error && <p className="text-danger">{error}</p>}

//       <ListGroup>
//         {paginatedReviews.map((review) => (
//           <ReviewItem
//             key={review._id}
//             review={review}
//             user={user}
//             editingReview={editingReview}
//             editedComment={editedComment}
//             handleEditClick={handleEditClick}
//             handleEditSubmit={handleEditSubmit}
//             setEditedComment={setEditedComment}
//             setEditingReview={setEditingReview}
//             confirmDelete={confirmDelete}
//           />
//         ))}
//       </ListGroup>

//       {/* Pagination */}
//       <div className="d-flex justify-content-between mt-3">
//         <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
//           Previous
//         </Button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <Button variant="primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
//           Next
//         </Button>
//       </div>

//       {/* Modal */}
//       <ConfirmDeleteModal
//         show={showConfirmModal}
//         handleClose={() => setShowConfirmModal(false)}
//         handleConfirm={handleDeleteConfirmed}
//       />
//     </div>
//   );
// };

// export default ReviewList;













//  import { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, ListGroup, Button, Form, Modal } from "react-bootstrap";
// import ReactStars from "react-stars";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const ReviewList = ({ serviceId, newReview, user }) => {
//   const [reviews, setReviews] = useState([]);
//   const [sortOption, setSortOption] = useState("latest");
//   const [error, setError] = useState(null);
//   const [editingReview, setEditingReview] = useState(null);
//   const [editedComment, setEditedComment] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 5;

//   // Modal state
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [reviewToDelete, setReviewToDelete] = useState(null);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/api/services/${serviceId}`
//         );
//         if (response.data.success && response.data.service) {
//           setReviews(response.data.service.reviews);
//         } else {
//           setError("No reviews available.");
//         }
//       } catch (err) {
//         setError("Failed to load reviews.");
//       }
//     };
//     fetchReviews();
//   }, [serviceId]);

//   useEffect(() => {
//     if (newReview) {
//       setReviews((prevReviews) => [newReview, ...prevReviews]);
//     }
//   }, [newReview]);

//   const sortedReviews = [...reviews].sort((a, b) => {
//     if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
//     if (sortOption === "highest") return b.rating - a.rating;
//     if (sortOption === "lowest") return a.rating - b.rating;
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
//   const paginatedReviews = sortedReviews.slice(
//     (currentPage - 1) * reviewsPerPage,
//     currentPage * reviewsPerPage
//   );

  // const confirmDelete = (reviewId) => {
  //   setReviewToDelete(reviewId);
  //   setShowConfirmModal(true);
  // };

  // const handleDeleteConfirmed = async () => {
  //   try {
  //     await axios.delete(`${BASE_URL}/api/reviews/${reviewToDelete}`);
  //     setReviews(reviews.filter((r) => r._id !== reviewToDelete));
  //   } catch (error) {
  //     console.error("Error deleting review:", error);
  //     alert("Failed to delete review.");
  //   } finally {
  //     setShowConfirmModal(false);
  //     setReviewToDelete(null);
  //   }
  // };

  // const handleEditClick = (review) => {
  //   setEditingReview(review._id);
  //   setEditedComment(review.comment);
  // };

  // const handleEditSubmit = async (reviewId) => {
  //   try {
  //     const response = await axios.put(
  //       `${BASE_URL}/api/reviews/${reviewId}`,
  //       { comment: editedComment }
  //     );
  //     if (response.data.success) {
  //       setReviews(
  //         reviews.map((review) =>
  //           review._id === reviewId ? { ...review, comment: editedComment } : review
  //         )
  //       );
  //       setEditingReview(null);
  //     }
  //   } catch (error) {
  //     console.error("Error updating review:", error);
  //     alert("Failed to update review.");
  //   }
  // };

//   return (
//     <div className="mt-4">
//       <h4>Customer Reviews</h4>

//       {reviews.length > 0 && (
//         <div className="mb-3">
//           <h5>Overall Rating</h5>
//           <ReactStars
//             count={5}
//             value={
//               reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
//             }
//             edit={false}
//             size={24}
//             color1="#ccc"
//             color2="#ffd700"
//           />
//           <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
//         </div>
//       )}

//       <Form.Select
//         onChange={(e) => setSortOption(e.target.value)}
//         className="mb-3"
//       >
//         <option value="latest">Most Recent</option>
//         <option value="highest">Highest Rated</option>
//         <option value="lowest">Lowest Rated</option>
//       </Form.Select>

//       {error && <p className="text-danger">{error}</p>}

//       <ListGroup>
//         {paginatedReviews.map((review) => {
//           const isReviewOwner = user?._id === review.userId?._id;
//           return (
//             <ListGroup.Item key={review._id} className="mb-3">
//               <Card>
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-start">
//                     <Card.Title className="mb-0">
//                       <strong>{review.userId?.name || "Anonymous"}</strong>
//                     </Card.Title>

//                     {isReviewOwner && !editingReview && (
//                       <div className="dropdown">
//                         <button
//                           className="btn btn-light"
//                           type="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                           style={{
//                             border: "none",
//                             background: "transparent",
//                             fontSize: "20px",
//                             padding: 0,
//                           }}
//                         >
//                           ⋮
//                         </button>
//                         <ul className="dropdown-menu dropdown-menu-end">
//                           <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() => handleEditClick(review)}
//                             >
//                               Edit
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               className="dropdown-item text-danger"
//                               onClick={() => confirmDelete(review._id)}
//                             >
//                               Delete
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>

//                   <Card.Text>
//                     <ReactStars
//                       count={5}
//                       value={review.rating}
//                       edit={false}
//                       size={24}
//                       color1="#ccc"
//                       color2="#ffd700"
//                     />
//                   </Card.Text>

//                   {editingReview === review._id ? (
//                     <>
//                       <Form.Control
//                         as="textarea"
//                         value={editedComment}
//                         onChange={(e) => setEditedComment(e.target.value)}
//                       />
//                       <Button
//                         variant="success"
//                         className="mt-2 me-2"
//                         onClick={() => handleEditSubmit(review._id)}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         className="mt-2"
//                         onClick={() => setEditingReview(null)}
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   ) : (
//                     <Card.Text>{review.comment}</Card.Text>
//                   )}

//                   <Card.Footer className="text-muted">
//                     {new Date(review.createdAt).toLocaleString()}
//                   </Card.Footer>
//                 </Card.Body>
//               </Card>
//             </ListGroup.Item>
//           );
//         })}
//       </ListGroup>

//       {/* Pagination Controls */}
//       <div className="d-flex justify-content-between mt-3">
//         <Button
//           variant="secondary"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(currentPage - 1)}
//         >
//           Previous
//         </Button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button
//           variant="primary"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage(currentPage + 1)}
//         >
//           Next
//         </Button>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDeleteConfirmed}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ReviewList;


