// src/components/AddClothingModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddClothingForm from './AddClothingForm';

const AddClothingModal = ({ show, handleClose, handleInventoryUpdate }) => {
  return (
    <Modal show={show} onHide={handleClose} className = 'my-modal'>
      <Modal.Header closeButton className='px-3 py-2'>
        <Modal.Title className = 'font-sans font-bold'>Add Clothing Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddClothingForm handleInventoryUpdate={handleInventoryUpdate} handleClose={handleClose}/>
      </Modal.Body>
      <Modal.Footer className='px-3 py-2'>
        <button className='font-mono border-2 border-black px-2 uppercase tracking-wider font-semibold bg-slate-400 hover:bg-sky-500 hover:text-white' onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddClothingModal;
