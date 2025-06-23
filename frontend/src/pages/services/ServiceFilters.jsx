// import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./ServiceFilters.css"; // Create this CSS file

const ServiceFilters = ({
  sortByPrice,
  setSortByPrice,
  sortByRating,
  setSortByRating,
  availability,
  setAvailability,
  priceRange,
  setPriceRange,
}) => {
  return (
    <Row className="service-filters-container g-2 ">
      <Col xs={6} sm={4} md={3} lg="auto">
        <Form.Select 
          value={sortByPrice} 
          onChange={(e) => setSortByPrice(e.target.value)}
          className="modern-filter-select"
        >
          <option value="">Sort By Price</option>
          <option value="price_asc">Lowest Price</option>
          <option value="price_desc">Highest Price</option>
        </Form.Select>
      </Col>

      <Col xs={6} sm={4} md={3} lg="auto">
        <Form.Select 
          value={sortByRating} 
          onChange={(e) => setSortByRating(e.target.value)}
          className="modern-filter-select "
        >
          <option value="">Sort By Rating</option>
          <option value="rating_desc">Best Rating</option>
          <option value="rating_asc">Lowest Rating</option>
        </Form.Select>
      </Col>

      <Col xs={6} sm={4} md={3} lg="auto">
        <Form.Select 
          value={availability} 
          onChange={(e) => setAvailability(e.target.value)}
          className="modern-filter-select"
        >
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </Form.Select>
      </Col>

      <Col xs={6} sm={4} md={3} lg="auto">
        <Form.Select 
          value={priceRange} 
          onChange={(e) => setPriceRange(e.target.value)}
          className="modern-filter-select"
        >
          <option value="">All Prices</option>
          <option value="low">Below Rs:500</option>
          <option value="medium">Rs:500 - Rs:2000</option>
          <option value="high">Above Rs:2000</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default ServiceFilters;