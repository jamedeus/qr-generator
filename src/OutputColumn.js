import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Right column (bottom on mobile) with QR code image and download button
const OutputColumn = ({ captionVisible, setCaptionVisible, qrCodes, downloadQR }) => {
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

OutputColumn.propTypes = {
    captionVisible: PropTypes.bool.isRequired,
    setCaptionVisible: PropTypes.func.isRequired,
    qrCodes: PropTypes.object.isRequired,
    downloadQR: PropTypes.func.isRequired
};

export default OutputColumn;
