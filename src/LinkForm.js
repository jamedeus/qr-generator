import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';


function LinkForm({ onSubmit }) {
    return (
        <Form onSubmit={onSubmit}>
            <FloatingLabel label="URL" className="mb-3">
                <Form.Control type="text" name="url" placeholder="URL" />
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
