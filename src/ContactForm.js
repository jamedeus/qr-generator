import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';


function ContactForm({ onSubmit }) {
    // Create form validation state object
    const [validated, setValidated] = useState(false);

    // Wrap submit handler, validate fields before calling
    const handleSubmit = (event) => {
        // Prevent submitting with invalid fields
        if (event.currentTarget.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        // Pass event to submit handler if all fields valid
        } else {
            onSubmit(event);
        }

        // Show validation highlights
        setValidated(true);
    };

    // Format phone number as user types
    function formatPhone(event) {
        // Remove all non-numeric characters, 10 digits max
        const input = event.target.value.replace(/\D/g,'').substring(0,10);

        // Parse phone number sections
        const areaCode = input.substring(0,3);
        const middle = input.substring(3,6);
        const last = input.substring(6,10);

        // Format based on current length
        if (input.length > 6) {
            event.target.value = `(${areaCode}) ${middle}-${last}`;
        } else if (input.length > 3) {
            event.target.value = `(${areaCode}) ${middle}`;
        } else if (input.length > 0) {
            event.target.value = `(${areaCode}`;
        } else if (input.length == 0) {
            event.target.value = ``;
        }
    }

    // Allow all characters except spaces in email field
    function formatEmail(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel label="First Name" className="mb-3">
                <Form.Control type="text" name="firstName" placeholder="First Name" required />
            </FloatingLabel>

            <FloatingLabel label="Last Name" className="mb-3">
                <Form.Control type="text" name="lastName" placeholder="Last Name" required />
            </FloatingLabel>

            <FloatingLabel label="Email" className="mb-3">
                <Form.Control type="email" name="email" placeholder="Email" onKeyDown={formatEmail} required />
            </FloatingLabel>

            <FloatingLabel label="Phone" className="mb-3">
                <Form.Control type="tel" name="phone" placeholder="Phone" onChange={formatPhone} pattern="^(\d{10}|\(\d{3}\) \d{3}-\d{4})$" required />
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
