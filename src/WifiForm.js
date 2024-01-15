import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';


function WifiForm({ onSubmit }) {
    return (
        <Form onSubmit={onSubmit}>
            <FloatingLabel label="SSID" className="mb-3">
                <Form.Control type="text" name="ssid" placeholder="SSID" />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mb-3">
                <Form.Control type="password" name="password" placeholder="Password" />
            </FloatingLabel>

            <div className="d-flex">
                <Button variant="primary" type="submit" className="mx-auto">
                    Generate
                </Button>
            </div>
        </Form>
    )
}


export default WifiForm;
