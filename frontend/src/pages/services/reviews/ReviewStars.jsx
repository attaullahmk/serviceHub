// import ReactStars from "react-stars";

// const ReviewStars = ({ reviews }) => {
//   const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

//   return (
//     <ReactStars
//       count={5}
//       value={averageRating}
//       edit={false}
//       size={24}
//       color1="#ccc"
//       color2="#ffd700"
//     />
//   );
// };

// export default ReviewStars;
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewStars = ({ rating }) => {
  // Ensure rating is a number between 0 and 5
  const normalizedRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const yellow = "#fbc02d"; // or use "gold"

  return (
    <div className="star-rating d-flex align-items-center">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} color={yellow} className="star full-star" />
      ))}
      {hasHalfStar && (
        <FaStarHalfAlt key="half" color={yellow} className="star half-star" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} color={yellow} className="star empty-star" />
      ))}
      <span className="ms-2">{normalizedRating.toFixed(1)}</span>
    </div>
  );
};

export default ReviewStars;
