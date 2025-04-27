import ReactStars from "react-stars";

const ReviewStars = ({ reviews }) => {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  return (
    <ReactStars
      count={5}
      value={averageRating}
      edit={false}
      size={24}
      color1="#ccc"
      color2="#ffd700"
    />
  );
};

export default ReviewStars;
