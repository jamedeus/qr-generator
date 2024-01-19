import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import ContactForm from './ContactForm';
import WifiForm from './WifiForm';
import LinkForm from './LinkForm';
import { DarkModeButton } from './DarkMode';
import { List, PersonLinesFill, Wifi, Link45deg } from 'react-bootstrap-icons';

function App() {
    // Default to contact QR code form
    const [qrType, setQrType] = useState('contact');

    // State object for base64 QR code string
    const [qrString, setQrString] = useState('');

    // State object for QR code visibility (controls fade effect)
    const [qrVisible, setQrVisible] = useState(false);

    // Create form validation state object
    const [validated, setValidated] = useState(false);

    // Takes type string (contact, wifi, or link)
    // Shows chosen form, resets validation, and hides old QR code (if present)
    const showForm = (type) => {
        setQrType(type);
        setValidated(false);
        resetQR();
    };

    // Fades out QR code, clears QR string once animation complete
    const resetQR = () => {
        setQrVisible(false);
        setTimeout(() => {
            setQrString("");
        }, 468);
    };

    // Add fade in/out classes when QR code visibility changes
    // Mobile: Scroll to bottom when QR shown, scroll to top when hidden
    useEffect(() => {
        const outputColumn = document.getElementById('output_col');
        if (qrVisible) {
            // Show output column if hidden
            outputColumn.classList.remove('d-none');
            outputColumn.classList.add('d-flex');
            // Start fade in effect, scroll to bottom
            outputColumn.classList.remove('fade-out');
            outputColumn.classList.add('fade-in');
            window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });

        } else {
            // Start fade out effect, scroll to top
            outputColumn.classList.remove('fade-in');
            outputColumn.classList.add('fade-out');
            window.scroll({ top: 0, behavior: 'smooth' });
        }
    });

    // Called by generate buttons, takes submit event as arg
    async function generate(event) {
        // Prevent page refresh when form submitted
        event.preventDefault();

        // Show validation highlights, don't generate if invalid fields present
        setValidated(true);
        if (event.currentTarget.checkValidity() === false) {
            return false;
        }

        // Get form data, add QR type
        const data = Object.fromEntries(new FormData(event.target).entries());
        data['type'] = `${qrType}-qr`;
        console.log(data);

        // Post form data, receive base64 PNG
        var result = await fetch('/generate', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });

        // Write result string to state object (shows QR image)
        result = await result.text();
        setQrString(result);
        setQrVisible(true);
        console.log(result);
    }

    // Decodes base64 image string from event to binary, serves download
    function downloadQR(event) {
        // Decode base64 image data to binary
        const imageData = atob(qrString);

        // Create Uint8Array with same length
        const imageBuffer = new ArrayBuffer(imageData.length);
        const imageBytes = new Uint8Array(imageBuffer);

        // Read bytes into array
        for (let i = 0; i < imageData.length; i++) {
            imageBytes[i] = imageData.charCodeAt(i);
        }

        // Create blob object from buffer, set MIME type
        const qr = new Blob([imageBytes], { type: 'image/png' });

        // Set download url and filename, downloads immediately
        event.target.href = URL.createObjectURL(qr);
        event.target.download = `${qrType}-qr.png`;
    }

    return (
        <div className="d-flex flex-column vh-100">
            {/* Fixed nav bar reserves space */}
            <Navbar fixed="top" variant="dark" className="bg-primary">
                <Container fluid>
                    {/* Dark mode switch */}
                    <DarkModeButton />

                    {/* Header */}
                    <Navbar.Brand className="mx-auto">QR Code Generator</Navbar.Brand>

                    {/* Dropdown to select QR Code type */}
                    <Dropdown align="end">
                        <Dropdown.Toggle className="my-auto"><List /></Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(() => {showForm('contact');})} active={qrType === "contact"}>
                                <PersonLinesFill className="me-3" />Contact
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(() => {showForm('wifi');})} active={qrType === "wifi"}>
                                <Wifi className="me-3" />Link
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(() => {showForm('link');})} active={qrType === "link"}>
                                <Link45deg className="me-3" />Link
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Navbar>

            {/* Container reserves remaining space */}
            <Container className="d-flex flex-column h-100">
                {/* Side by side on desktop, stacked on mobile */}
                <Row className="h-100">
                    {/* Same height as container to vertically center contents */}
                    <Col md={6} className="d-flex flex-column justify-content-center py-3 h-100">
                        {(() => {
                            switch(qrType) {
                                case "contact":
                                    return <ContactForm generate={generate} validated={validated} />;
                                case "wifi":
                                    return <WifiForm generate={generate} validated={validated} />;
                                case "link":
                                    return <LinkForm generate={generate} validated={validated} />;
                                default:
                                    return null;
                            }
                        })()}
                    </Col>

                    <Col id="output_col" md={6} className="d-none flex-column justify-content-center py-3 h-100">
                        {/* Vertically center QR code, hidden button negates download button impact on layout */}
                        <Button variant="primary" as="a" className="mb-3 invisible">Download</Button>

                        {/* Output image + download button */}
                        <img src={"data:image/png;base64," + qrString}></img>
                        <Button variant="primary" as="a" className="mb-3 mx-auto" onClick={downloadQR}>
                            Download
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
