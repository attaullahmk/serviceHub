import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, ListGroup } from "react-bootstrap";
import ReviewItem from "./ReviewItem";
import ReviewStars from "./ReviewStars";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewList = ({ serviceId, newReview, user }) => {
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/services/${serviceId}`);
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

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "highest") return b.rating - a.rating;
    if (sortOption === "lowest") return a.rating - b.rating;
    return 0;
  });

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const confirmDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/reviews/${reviewToDelete}`);
      setReviews(reviews.filter((r) => r._id !== reviewToDelete));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    } finally {
      setShowConfirmModal(false);
      setReviewToDelete(null);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditedComment(review.comment);
  };

  const handleEditSubmit = async (reviewId) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/reviews/${reviewId}`, { comment: editedComment });
      if (response.data.success) {
        setReviews(
          reviews.map((review) =>
            review._id === reviewId ? { ...review, comment: editedComment } : review
          )
        );
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

      {reviews.length > 0 && (
        <div className="mb-3">
          <h5>Overall Rating</h5>
          <ReviewStars reviews={reviews} />
          <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
        </div>
      )}

      <Form.Select onChange={(e) => setSortOption(e.target.value)} className="mb-3">
        <option value="latest">Most Recent</option>
        <option value="highest">Highest Rated</option>
        <option value="lowest">Lowest Rated</option>
      </Form.Select>

      {error && <p className="text-danger">{error}</p>}

      <ListGroup>
        {paginatedReviews.map((review) => (
          <ReviewItem
            key={review._id}
            review={review}
            user={user}
            editingReview={editingReview}
            editedComment={editedComment}
            handleEditClick={handleEditClick}
            handleEditSubmit={handleEditSubmit}
            setEditedComment={setEditedComment}
            setEditingReview={setEditingReview}
            confirmDelete={confirmDelete}
          />
        ))}
      </ListGroup>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-3">
        <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button variant="primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </Button>
      </div>

      {/* Modal */}
      <ConfirmDeleteModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={handleDeleteConfirmed}
      />
    </div>
  );
};

export default ReviewList;













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
//       const response = await axios.put(
//         `${BASE_URL}/api/reviews/${reviewId}`,
//         { comment: editedComment }
//       );
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


