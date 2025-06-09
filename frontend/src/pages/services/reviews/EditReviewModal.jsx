import { Modal, Button, Form } from "react-bootstrap";

const EditReviewModal = ({
  editModal,
  setEditModal,
  editComment,
  setEditComment,
  editRating,
  setEditRating,
  submitEdit
}) => {
  return (
    <Modal show={editModal} onHide={() => setEditModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Edit form content */}
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
  );
};

export default EditReviewModal;