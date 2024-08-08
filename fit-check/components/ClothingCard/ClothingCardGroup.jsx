import React from 'react'
import { CardGroup, Row, Col } from 'react-bootstrap'
import ClothingCard from './ClothingCard'

const ClothingCardGroup = ({clothingItems, handleSelectItem, selectedItems, viewDetails}) => {
  return (
    <Row md = {4} xs = {2}>
        {clothingItems.map((item) => (
            <Col key={item.id} className='d-flex align-items-stretch'>
                <ClothingCard 
                    item={item}
                    onSelect={handleSelectItem}
                    isSelected={selectedItems ? selectedItems.includes(item.id) : null}
                    viewDetails={viewDetails}
                />
            </Col>
        ))}
    </Row>
  )
}

export default ClothingCardGroup