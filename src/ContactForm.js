import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';


function ContactForm({ onSubmit }) {
    return (
        <Form onSubmit={onSubmit}>
            <FloatingLabel label="First Name" className="mb-3">
                <Form.Control type="text" name="firstName" placeholder="First Name" />
            </FloatingLabel>

            <FloatingLabel label="Last Name" className="mb-3">
                <Form.Control type="text" name="lastName" placeholder="Last Name" />
            </FloatingLabel>

            <FloatingLabel label="Email" className="mb-3">
                <Form.Control type="email" name="email" placeholder="Email" />
            </FloatingLabel>

            <FloatingLabel label="Phone" className="mb-3">
                <Form.Control type="tel" name="phone" placeholder="Phone" />
            </FloatingLabel>

            <div className="d-flex">
                <Button variant="primary" type="submit" className="mx-auto">
                    Generate
                </Button>
            </div>
        </Form>
    )
}


export default ContactForm;
