// Slider.js (React Component)
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Slider.css';



const Slider = () => {
  return (
    <div id="imageSlider" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="image/doctor.jpg" className="d-block w-100" alt="Image 1" />
        </div>
        <div className="carousel-item">
          <img src="image/dirver.jpg" className="d-block w-100" alt="Image 2" />
        </div>
        <div className="carousel-item">
          <img src="/image/electrition.jpg" className="d-block w-100" alt="Image 3" />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#imageSlider" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#imageSlider" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
};

export default Slider;
