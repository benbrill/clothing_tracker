import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ClothingCardModal = ({item, show, handleClose}) => {
  return (
    <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>{item.brand}</Modal.Title>
        </Modal.Header>

        </Modal>
    </div>
  )
}

export default ClothingCardModal