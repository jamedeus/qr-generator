import React, { useState } from 'react';
import ContactForm from './ContactForm';
import WifiForm from './WifiForm';
import LinkForm from './LinkForm';


function App() {
    // Default to contact QR code form
    const [qrType, setQrType] = useState('contact');

    // State object for base64 QR code string
    const [qrString, setQrString] = useState('');

    const showContact = () => {
        setQrType("contact");
        setQrString("");
    }

    const showWifi = () => {
        setQrType("wifi");
        setQrString("");
    }

    const showLink = () => {
        setQrType("link");
        setQrString("");
    }

    // Called by generate buttons, takes submit event as arg
    async function generate(e) {
        e.preventDefault();

        // Get form data, add QR type
        const data = Object.fromEntries(new FormData(e.target).entries())
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
            <nav className="navbar navbar-dark bg-primary fixed-top">
                <div className="container-fluid">
                    <button type="button" className="btn" style={{visibility: "hidden"}}><i className="bi-list"></i></button>
                    <h1 className="mb-0 navbar-brand mx-auto">QR Code Generator</h1>

                    {/* Dropdown to select QR Code type */}
                    <div className="dropdown my-auto">
                        <button type="button" className="btn" id="menu_button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi-list" style={{color: "#fff"}}></i></button>
                        <ul id="settings_menu" className="dropdown-menu dropdown-menu-end" aria-labelledby="settings_button">
                            <li>
                                <a className={"dropdown-item " + (qrType === "contact" ? "active" : "")} onClick={showContact}>
                                    <i className="bi bi-person-lines-fill me-3"></i>Contact
                                </a>
                            </li>
                            <li>
                                <a className={"dropdown-item " + (qrType === "wifi" ? "active" : "")} onClick={showWifi}>
                                    <i className="bi bi-wifi me-3"></i>Wifi
                                </a>
                            </li>
                            <li>
                                <a className={"dropdown-item " + (qrType === "link" ? "active" : "")} onClick={showLink}>
                                    <i className="bi bi-link-45deg me-3"></i>Link
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Container reserves remaining space */}
            <div className="container d-flex flex-column h-100">
                {/* Side by side on desktop, stacked on mobile */}
                <div className="row h-100">
                    {/* Same height as container to vertically center contents */}
                    <div className="col-md-6 d-flex flex-column justify-content-center py-3 h-100">
                        {(() => {
                            switch(qrType) {
                                case "contact":
                                    return <ContactForm onSubmit={generate} />;
                                case "wifi":
                                    return <WifiForm onSubmit={generate} />;
                                case "link":
                                    return <LinkForm onSubmit={generate} />;
                                default:
                                    return null;
                            }
                        })()}
                    </div>

                    <div id="output_column" className={(qrString ? "col-md-6 d-flex flex-column justify-content-center align-items-center py-3 h-100" : "d-none")}>
                        {/* Keep QR vertically centered, hidden button negates download button impact on layout */}
                        <a style={{visibility: "hidden"}} className="btn btn-primary mb-3">Download</a>

                        {/* Output image + download button */}
                        <img id="output" src={"data:image/png;base64," + qrString}></img>
                        <a className="btn btn-primary mb-3" onClick={downloadQR}>Download</a>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default App;
