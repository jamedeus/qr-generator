import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import { List, PersonLinesFill, Wifi, Link45deg } from 'react-bootstrap-icons';

// Navbar dropdown used to change QR code form
const QrTypeDropdown = ({ qrType, showForm }) => {
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

QrTypeDropdown.propTypes = {
    qrType: PropTypes.string.isRequired,
    showForm: PropTypes.func.isRequired
};

export default QrTypeDropdown;
