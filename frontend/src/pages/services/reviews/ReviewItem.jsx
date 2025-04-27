import { Card, Button, Form, ListGroup } from "react-bootstrap";
import ReactStars from "react-stars";
import { FaLightbulb, FaRegHandPaper, FaHeart, FaSadTear } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux"; // Redux hook
import { motion } from "framer-motion";    // 👈 Import Framer Motion

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewItem = ({
  review,
  editingReview,
  editedComment,
  handleEditClick,
  handleEditSubmit,
  setEditedComment,
  setEditingReview,
  confirmDelete,
}) => {
  const currentUser = useSelector((state) => state.auth.user);

  const isReviewOwner = currentUser?._id === review.userId?._id;

  const [localReview, setLocalReview] = useState(review);
  const [clickedReaction, setClickedReaction] = useState(null); // For animation

  const handleReactionClick = async (reactionType) => {
    if (!currentUser) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/reviews/${localReview._id}/reactions`,
        {
          reactionType,
          userId: currentUser._id,
        }
      );

      if (response.data.success) {
        setLocalReview(response.data.review);
        setClickedReaction(reactionType); // trigger animation
        setTimeout(() => setClickedReaction(null), 300); // Reset animation after 300ms
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const hasReacted = (reactionType) => {
    return localReview.reactions?.[reactionType]?.includes(currentUser._id);
  };

  return (
    <ListGroup.Item className="mb-3">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title className="mb-0">
              <strong>{localReview.userId?.name || "Anonymous"}</strong>
            </Card.Title>

            {isReviewOwner && !editingReview && (
              <div className="dropdown">
                <button
                  className="btn btn-light"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "20px",
                    padding: 0,
                  }}
                >
                  ⋮
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleEditClick(localReview)}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => confirmDelete(localReview._id)}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <ReactStars
              count={5}
              value={localReview.rating}
              edit={false}
              size={24}
              color1="#ccc"
              color2="#ffd700"
            />
            <small className="text-muted">
              {new Date(localReview.createdAt).toLocaleDateString()}
            </small>
          </div>

          {editingReview === localReview._id ? (
            <>
              <Form.Control
                as="textarea"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <Button
                variant="success"
                className="mt-2 me-2"
                onClick={() => handleEditSubmit(localReview._id)}
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
            <Card.Text>{localReview.comment}</Card.Text>
          )}

          {/* Reactions */}
          <div className="d-flex justify-content-start gap-4 mt-3">
            {["helpful", "thanks", "loveThis", "ohNo"].map((type) => {
              const icons = {
                helpful: <FaLightbulb size={24} />,
                thanks: <FaRegHandPaper size={24} />,
                loveThis: <FaHeart size={24} />,
                ohNo: <FaSadTear size={24} />,
              };

              const colors = {
                helpful: "orange",
                thanks: "green",
                loveThis: "red",
                ohNo: "blue",
              };

              return (
                <motion.div
                  key={type}
                  whileTap={{ scale: 1.3 }} // 👈 Pop on tap
                  animate={{
                    scale: clickedReaction === type ? [1, 1.4, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                  onClick={() => handleReactionClick(type)}
                  style={{
                    cursor: "pointer",
                    color: hasReacted(type) ? colors[type] : "inherit",
                  }}
                >
                  {icons[type]}
                  <div className="small text-muted">
                    {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                    {localReview.reactions?.[type]?.length || 0}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </Card.Body>
      </Card>
    </ListGroup.Item>
  );
};

export default ReviewItem;






























// import { Card, Button, Form, ListGroup } from "react-bootstrap";
// import ReactStars from "react-stars";
// import { FaLightbulb, FaRegHandPaper, FaHeart, FaSadTear } from "react-icons/fa"; // Import icons

// const ReviewItem = ({
//   review,
//   user,
//   editingReview,
//   editedComment,
//   handleEditClick,
//   handleEditSubmit,
//   setEditedComment,
//   setEditingReview,
//   confirmDelete,
// }) => {
//   const isReviewOwner = user?._id === review.userId?._id;

//   return (
//     <ListGroup.Item className="mb-3">
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-start">
//             <Card.Title className="mb-0">
//               <strong>{review.userId?.name || "Anonymous"}</strong>
//             </Card.Title>

//             {isReviewOwner && !editingReview && (
//               <div className="dropdown">
//                 <button
//                   className="btn btn-light"
//                   type="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                   style={{
//                     border: "none",
//                     background: "transparent",
//                     fontSize: "20px",
//                     padding: 0,
//                   }}
//                 >
//                   ⋮
//                 </button>
//                 <ul className="dropdown-menu dropdown-menu-end">
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => handleEditClick(review)}
//                     >
//                       Edit
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item text-danger"
//                       onClick={() => confirmDelete(review._id)}
//                     >
//                       Delete
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div className="d-flex align-items-center gap-2 mb-2">
//             <ReactStars
//               count={5}
//               value={review.rating}
//               edit={false}
//               size={24}
//               color1="#ccc"
//               color2="#ffd700"
//             />
//             <small className="text-muted">
//               {new Date(review.createdAt).toLocaleDateString()}
//             </small>
//           </div>

//           {editingReview === review._id ? (
//             <>
//               <Form.Control
//                 as="textarea"
//                 value={editedComment}
//                 onChange={(e) => setEditedComment(e.target.value)}
//               />
//               <Button
//                 variant="success"
//                 className="mt-2 me-2"
//                 onClick={() => handleEditSubmit(review._id)}
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="mt-2"
//                 onClick={() => setEditingReview(null)}
//               >
//                 Cancel
//               </Button>
//             </>
//           ) : (
//             <Card.Text>{review.comment}</Card.Text>
//           )}

//           {/* Icon section */}
//           <div className="d-flex justify-content-start gap-4 mt-3">
//             <div className="text-center">
//               <FaLightbulb size={24} />
//               <div className="small text-muted">Helpful 3</div>
//             </div>
//             <div className="text-center">
//               <FaRegHandPaper size={24} />
//               <div className="small text-muted">Thanks 0</div>
//             </div>
//             <div className="text-center">
//               <FaHeart size={24} />
//               <div className="small text-muted">Love this 0</div>
//             </div>
//             <div className="text-center">
//               <FaSadTear size={24} />
//               <div className="small text-muted">Oh no 2</div>
//             </div>
//           </div>

//         </Card.Body>
//       </Card>
//     </ListGroup.Item>
//   );
// };

// export default ReviewItem;
