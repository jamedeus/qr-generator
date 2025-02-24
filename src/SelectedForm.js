import React from 'react';
import PropTypes from 'prop-types';
import ContactForm from './ContactForm';
import WifiForm from './WifiForm';
import LinkForm from './LinkForm';

const SelectedForm = ({ qrType }) => {
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
};

SelectedForm.propTypes = {
    qrType: PropTypes.string.isRequired
};

export default SelectedForm;
