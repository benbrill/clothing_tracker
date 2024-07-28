// src/components/AddClothingModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddClothingForm from './AddClothingForm';

const AddClothingModal = ({ show, handleClose, handleInventoryUpdate }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Clothing Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddClothingForm handleInventoryUpdate={handleInventoryUpdate}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddClothingModal;
