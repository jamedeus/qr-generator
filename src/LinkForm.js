import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';


function LinkForm({ onSubmit }) {
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

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel label="URL" className="mb-3">
                <Form.Control type="text" name="url" placeholder="URL" required />
            </FloatingLabel>

            <FloatingLabel label="Text" className="mb-3">
                <Form.Control type="text" name="text" placeholder="Optional" />
            </FloatingLabel>

            <div className="d-flex">
                <Button variant="primary" type="submit" className="mx-auto">
                    Generate
                </Button>
            </div>
        </Form>
    )
}


export default LinkForm;
