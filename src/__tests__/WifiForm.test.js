import { render } from '@testing-library/react';
import WifiForm from '../WifiForm';

describe('WifiForm', () => {
    it('matches snapshot', () => {
        const component = render(
            <WifiForm />
        );
        expect(component).toMatchSnapshot();
    });

    it('requires all fields', async () => {
        const { getByPlaceholderText } = render(
            <WifiForm />
        );

        // Get reference to each field
        const ssidField = getByPlaceholderText('SSID');
        const passField = getByPlaceholderText('Password');

        // All empty fields should be invalid
        expect(ssidField.validity.valueMissing).toBeTruthy();
        expect(passField.validity.valueMissing).toBeTruthy();

        // Add arbitrary text, should be valid
        ssidField.value = "foobar";
        expect(ssidField.validity.valid).toBeTruthy();
        passField.value = "foobar";
        expect(passField.validity.valid).toBeTruthy();
    });
});
