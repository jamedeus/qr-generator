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
        expect(ssidField.validity.valid).toBe(false);
        expect(passField.validity.valid).toBe(false);

        // Add arbitrary text, should be valid
        ssidField.value = "foobar";
        expect(ssidField.validity.valid).toBe(true);
        passField.value = "foobar";
        expect(passField.validity.valid).toBe(true);
    });
});
