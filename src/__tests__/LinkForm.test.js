import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';
import LinkForm from '../LinkForm';

describe('LinkForm', () => {
    // Mock generate hook
    const mockGenerate = jest.fn(e => e.preventDefault());

    it('matches snapshot', () => {
        const component = renderer.create(
            <LinkForm generate={mockGenerate} validated={false} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('calls generate function when button clicked', () => {
        const { getByText } = render(
            <LinkForm generate={mockGenerate} validated={false} />
        );

        const generateButton = getByText(/generate/i);
        fireEvent.click(generateButton);

        expect(mockGenerate).toHaveBeenCalled();
    });

    it('shows validation highlights when validated is true', () => {
        const { getByText } = render(
            <LinkForm generate={mockGenerate} validated={true} />
        );

        // Get form element, confirm correct type
        const form = getByText(/generate/i).parentElement.parentElement;
        expect(form.tagName).toBe('FORM');

        expect(form.classList).toContainEqual('was-validated');
    });

    it('does not show validation highlights when validated is false', () => {
        const { getByText } = render(
            <LinkForm generate={mockGenerate} validated={false} />
        );

        // Get form element, confirm correct type
        const form = getByText(/generate/i).parentElement.parentElement;
        expect(form.tagName).toBe('FORM');

        expect(form.classList).not.toContainEqual('was-validated');
    });

    it('requires URL field, but not text field', async () => {
        const { getByPlaceholderText } = render(
            <LinkForm generate={mockGenerate} validated={false} />
        );

        // Get reference to each field
        const urlField = getByPlaceholderText('URL');
        const textField = getByPlaceholderText('Optional');

        // Empty text field should be valid (optional)
        expect(textField.validity.valid).toBeTruthy();

        // URL field with default text (https://) should fail pattern match
        expect(urlField.validity.valid).toBeFalsy();
        expect(urlField.validity.patternMismatch).toBeTruthy();

        // Add arbitrary text, should fail pattern match
        urlField.value = "https://foobar";
        expect(urlField.validity.valid).toBeFalsy();
        expect(urlField.validity.patternMismatch).toBeTruthy();

        // Add valid URLs, should be valid with http, https, querystring, etc
        urlField.value = "https://foo.bar";
        expect(urlField.validity.valid).toBeTruthy();
        urlField.value = "http://foo.bar";
        expect(urlField.validity.valid).toBeTruthy();
        urlField.value = "https://foo.bar?param=value";
        expect(urlField.validity.valid).toBeTruthy();
    });
});
