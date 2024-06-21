import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function WifiForm() {
    return (
        <>
            <FloatingLabel label="SSID" className="mb-3">
                <Form.Control
                    type="text"
                    name="ssid"
                    placeholder="SSID"
                    required
                />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mb-3">
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
            </FloatingLabel>
        </>
    );
}

export default WifiForm;
