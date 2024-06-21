import React from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function LinkForm() {
    return (
        <>
            <FloatingLabel label="URL" className="mb-3">
                <Form.Control
                    type="text"
                    name="url"
                    placeholder="URL"
                    defaultValue="https://"
                    pattern="http(s?):\/\/([a-zA-Z0-9\-_]+\.)*[a-zA-Z0-9\-_]+\.[a-zA-Z]{2,}([\/\?].*)?"
                    required
                />
            </FloatingLabel>

            <FloatingLabel label="Text" className="mb-3">
                <Form.Control
                    type="text"
                    name="text"
                    placeholder="Optional"
                />
            </FloatingLabel>
        </>
    );
}

export default LinkForm;
