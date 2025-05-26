import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { BsList, BsPersonLinesFill, BsWifi, BsLink45Deg } from 'react-icons/bs';

// Navbar dropdown used to change QR code form
const QrTypeDropdown = ({ qrType, showForm }) => {
    return (
        <Dropdown align="end">
            <Dropdown.Toggle
                className="d-flex my-auto px-2"
                style={{ fontSize: "1.25rem" }}
                data-testid="dropdown"
            >
                <BsList />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={(() => {showForm('contact');})}
                    active={qrType === "contact"}
                >
                    <BsPersonLinesFill className="me-3" />Contact
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(() => {showForm('wifi');})}
                    active={qrType === "wifi"}
                >
                    <BsWifi className="me-3" />Wifi
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={(() => {showForm('link');})}
                    active={qrType === "link"}
                >
                    <BsLink45Deg className="me-3" />Link
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

QrTypeDropdown.propTypes = {
    qrType: PropTypes.string.isRequired,
    showForm: PropTypes.func.isRequired
};

export default QrTypeDropdown;
