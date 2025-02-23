import React from "react";
import { Row, Col, Form } from "react-bootstrap";

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
    <Row className="mb-3 justify-content-center">
      <Col xs="auto">
        <Form.Select value={sortByPrice} onChange={(e) => setSortByPrice(e.target.value)}>
          <option value="">Sort By Price</option>
          <option value="price_asc">Lowest Price</option>
          <option value="price_desc">Highest Price</option>
        </Form.Select>
      </Col>

      <Col xs="auto">
        <Form.Select value={sortByRating} onChange={(e) => setSortByRating(e.target.value)}>
          <option value="">Sort By Rating</option>
          <option value="rating_desc">Best Rating</option>
          <option value="rating_asc">Lowest Rating</option>
        </Form.Select>
      </Col>

      <Col xs="auto">
        <Form.Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </Form.Select>
      </Col>

      <Col xs="auto">
        <Form.Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">All Prices</option>
          <option value="low">Below $50</option>
          <option value="medium">$50 - $200</option>
          <option value="high">Above $200</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default ServiceFilters;
