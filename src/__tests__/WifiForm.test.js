import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';
import WifiForm from '../WifiForm';

describe('WifiForm', () => {
    // Mock generate hook
    const mockGenerate = jest.fn(e => e.preventDefault());

    it('matches snapshot', () => {
        const component = renderer.create(
            <WifiForm generate={mockGenerate} validated={false} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('calls generate function when button clicked', () => {
        const { getByText } = render(
            <WifiForm generate={mockGenerate} validated={false} />
        );

        const generateButton = getByText(/generate/i);
        fireEvent.click(generateButton);

        expect(mockGenerate).toHaveBeenCalled();
    });

    it('shows validation highlights when validated is true', () => {
        const { getByText } = render(
            <WifiForm generate={mockGenerate} validated={true} />
        );

        // Get form element, confirm correct type
        const form = getByText(/generate/i).parentElement.parentElement;
        expect(form.tagName).toBe('FORM');

        expect(form.classList).toContainEqual('was-validated');
    });

    it('does not show validation highlights when validated is false', () => {
        const { getByText } = render(
            <WifiForm generate={mockGenerate} validated={false} />
        );

        // Get form element, confirm correct type
        const form = getByText(/generate/i).parentElement.parentElement;
        expect(form.tagName).toBe('FORM');

        expect(form.classList).not.toContainEqual('was-validated');
    });

    it('requires all fields', async () => {
        const { getByPlaceholderText } = render(
            <WifiForm generate={mockGenerate} validated={false} />
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
