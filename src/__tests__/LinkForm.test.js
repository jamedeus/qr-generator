import { render } from '@testing-library/react';
import LinkForm from '../LinkForm';

describe('LinkForm', () => {
    it('matches snapshot', () => {
        const component = render(
            <LinkForm />
        );
        expect(component).toMatchSnapshot();
    });

    it('requires URL field, but not text field', async () => {
        const { getByPlaceholderText } = render(
            <LinkForm />
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
