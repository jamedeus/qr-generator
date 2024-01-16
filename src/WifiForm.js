import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

function WifiForm({ onSubmit }) {
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
            <FloatingLabel label="SSID" className="mb-3">
                <Form.Control type="text" name="ssid" placeholder="SSID" required />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mb-3">
                <Form.Control type="password" name="password" placeholder="Password" required />
            </FloatingLabel>

            <div className="d-flex">
                <Button variant="primary" type="submit" className="mx-auto">
                    Generate
                </Button>
            </div>
        </Form>
    );
}

WifiForm.propTypes = {
    onSubmit: PropTypes.func,
};

export default WifiForm;
