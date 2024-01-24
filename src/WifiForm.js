import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

function WifiForm({ generate, validated }) {
    return (
        <Form noValidate validated={validated} onSubmit={generate}>
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

            <div className="d-flex">
                <Button variant="primary" type="submit" className="mx-auto">
                    Generate
                </Button>
            </div>
        </Form>
    );
}

WifiForm.propTypes = {
    generate: PropTypes.func,
    validated: PropTypes.bool
};

export default WifiForm;
