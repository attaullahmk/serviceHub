import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Spinner, Image } from "react-bootstrap";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    address: "",
    availability: false,
    imageGallery: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/services/${id}`)
      .then(response => {
        setService(response.data.service);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching service details:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prevImages => [...prevImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", service.title);
    formData.append("description", service.description);
    formData.append("price", service.price);
    formData.append("category", service.category);
    formData.append("address", service.address);
    formData.append("availability", service.availability);
    
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.put(`http://localhost:3000/api/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Service updated successfully!");
      navigate(`/services/${id}`);
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service.");
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <Container className="mt-5">
      <h2>Edit Service</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
            type="text" 
            name="title"
            value={service.title} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            as="textarea"
            name="description"
            value={service.description} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control 
            type="number" 
            name="price"
            value={service.price} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control 
            type="text" 
            name="category"
            value={service.category} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control 
            type="text" 
            name="address"
            value={service.address} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Availability</Form.Label>
          <Form.Check 
            type="checkbox" 
            name="availability"
            checked={service.availability} 
            onChange={(e) => setService({ ...service, availability: e.target.checked })}
            label="Available"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Current Images</Form.Label>
          <div className="d-flex flex-wrap">
            {service.imageGallery.length > 0 && service.imageGallery.map((img, index) => (
              <Image key={index} src={img} thumbnail width={100} className="me-2" />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload New Images</Form.Label>
          <Form.Control type="file" name="images" multiple onChange={handleImageChange} />
          <div className="d-flex flex-wrap mt-2">
            {selectedImages.map((img, index) => (
              <Image key={index} src={URL.createObjectURL(img)} thumbnail width={100} className="me-2" />
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">Save Changes</Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>Cancel</Button>
      </Form>
    </Container>
  );
};

export default EditService;
