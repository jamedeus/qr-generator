import React, { useState, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
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

    // State object containing 2 base64 QR code strings
    const [qrCodes, setQrCodes] = useState({caption: '', no_caption: ''});

    // State bool controls which base64 string is visible
    const [captionVisible, setCaptionVisible] = useState(true);

    // State object for QR code visibility (controls fade effect)
    const [qrVisible, setQrVisible] = useState(false);

    // Create form validation state object
    const [validated, setValidated] = useState(false);

    // Takes type string (contact, wifi, or link), shows form
    const showForm = (type) => {
        setQrType(type);
        // Reset form validation
        setValidated(false);
        // Fade out and unmount old QR code
        setQrVisible(false);
    };

    // Mobile: Scroll to bottom when QR shown, scroll to top when hidden
    useEffect(() => {
        const top = qrVisible ? document.body.scrollHeight : 0;
        window.scroll({ top: top, behavior: 'smooth' });
    }, [qrVisible]);

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
        const response = await fetch('/generate', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Write result JSON to state object, show QR code
            const result = await response.json();
            setQrCodes(result);
            setQrVisible(true);
            console.log(result);
        } else {
            const error = await response.text();
            alert(error);
        }
    }

    // Decodes base64 image string from event to binary, serves download
    function downloadQR(event) {
        // Decode base64 image data for visible QR code to binary
        let imageData;
        if (captionVisible) {
            imageData = atob(qrCodes.caption);
        } else {
            imageData = atob(qrCodes.no_caption);
        }

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

    // Navbar dropdown used to select QR code type
    const FormDropdown = () => {
        return (
            <Dropdown align="end">
                <Dropdown.Toggle className="my-auto" data-testid="dropdown">
                    <List className="mb-1" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item
                        onClick={(() => {showForm('contact');})}
                        active={qrType === "contact"}
                    >
                        <PersonLinesFill className="me-3" />Contact
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={(() => {showForm('wifi');})}
                        active={qrType === "wifi"}
                    >
                        <Wifi className="me-3" />Wifi
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={(() => {showForm('link');})}
                        active={qrType === "link"}
                    >
                        <Link45deg className="me-3" />Link
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    // Right column (bottom on mobile) with QR code image and download button
    const OutputColumn = () => {
        return (
            <Col md={6} className='d-flex flex-column justify-content-center py-3 h-100'>
                {/* Hidden button to vertically center QR code */}
                <Button as="a" className="m-2 mb-3 invisible">D</Button>

                {/* QR code image */}
                <img src={`data:image/png;base64,${
                    captionVisible ? qrCodes.caption : qrCodes.no_caption
                }`} />

                {/* Download and hide/show caption buttons */}
                <div className="d-flex mx-auto mt-2">
                    <Button
                        variant="primary"
                        className="m-2"
                        onClick={() => setCaptionVisible(!captionVisible)}
                    >
                        {captionVisible? "Hide text" : "Show text"}
                    </Button>
                    <Button
                        variant="primary"
                        as="a"
                        className="m-2"
                        onClick={downloadQR}
                    >
                        Download
                    </Button>
                </div>
            </Col>
        );
    };

    return (
        <div className="d-flex flex-column vh-100">
            {/* Fixed nav bar reserves space */}
            <Navbar fixed="top" variant="dark" className="bg-primary">
                <Container fluid>
                    {/* Dark mode switch */}
                    <DarkModeButton />

                    {/* Header */}
                    <Navbar.Brand className="mx-auto">
                        QR Code Generator
                    </Navbar.Brand>

                    {/* Dropdown to select QR Code type */}
                    <FormDropdown />
                </Container>
            </Navbar>

            {/* Container reserves remaining space */}
            <Container className="d-flex flex-column h-100">
                {/* Side by side on desktop, stacked on mobile */}
                <Row className="h-100">
                    {/* Same height as container to vertically center contents */}
                    <Col md={6} className="d-flex flex-column justify-content-center py-3 h-100">
                        <Form
                            noValidate
                            validated={validated}
                            onSubmit={generate}
                            aria-label="form"
                        >
                            {(() => {
                                switch(qrType) {
                                    case "contact":
                                        return <ContactForm />;
                                    case "wifi":
                                        return <WifiForm />;
                                    case "link":
                                        return <LinkForm />;
                                    /* istanbul ignore next */
                                    default:
                                        return null;
                                }
                            })()}

                            <div className="d-flex">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="mx-auto"
                                >
                                    Generate
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <CSSTransition
                        in={qrVisible}
                        timeout={250}
                        classNames='fade'
                        unmountOnExit={true}
                    >
                        <OutputColumn />
                    </CSSTransition>
                </Row>
            </Container>
        </div>
    );
}

export default App;
