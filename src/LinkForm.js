import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

function LinkForm({ generate, validated }) {
    return (
        <Form noValidate validated={validated} onSubmit={generate}>
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
    );
}

LinkForm.propTypes = {
    generate: PropTypes.func,
    validated: PropTypes.bool
};

export default LinkForm;
