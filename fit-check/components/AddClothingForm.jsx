import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddClothingForm = ({ handleInventoryUpdate }) => {
    const [clothingItem, setClothingItem] = useState({
        category: '',
        brand: '',
        color: '',
        size: '',
        price: '',
        quantity: '',
        purchase: '',
        description: '',
        thrift: false,
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setClothingItem((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setClothingItem((prev) => ({
            ...prev,
            file: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(clothingItem);
        const formData = new FormData();
        Object.keys(clothingItem).forEach((key) => {
            if (clothingItem[key] !== null && clothingItem[key] !== undefined) {
                formData.append(key, clothingItem[key]);
            }
        });

        try {
            const response = await fetch(`http:localhost:5000/add-clothing`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            console.log('Success:', data);
            handleInventoryUpdate(); // Trigger a re-fetch of the inventory
            // Clear the form
            setClothingItem({
                category: '',
                brand: '',
                color: '',
                size: '',
                price: '',
                quantity: '',
                purchase: '',
                description: '',
                thrift: false,
                file: null,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={clothingItem.category}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                name="brand"
                                value={clothingItem.brand}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                                type="text"
                                name="color"
                                value={clothingItem.color}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Size</Form.Label>
                            <Form.Control
                                type="text"
                                name="size"
                                value={clothingItem.size}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={clothingItem.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={clothingItem.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Thrifted?</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="thrift"
                                checked={clothingItem.thrift}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={clothingItem.quantity}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Purchase Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="purchase"
                                value={clothingItem.purchase}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Photo</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Clothing Item
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddClothingForm;
