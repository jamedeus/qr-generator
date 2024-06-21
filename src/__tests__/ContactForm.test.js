import renderer from 'react-test-renderer';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

describe('ContactForm', () => {
    it('matches snapshot', () => {
        const component = renderer.create(
            <ContactForm />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('formats phone number correctly, blocks invalid characters', async () => {
        const { getByPlaceholderText } = render(
            <ContactForm />
        );

        const phoneInput = getByPlaceholderText('Phone');

        // Should not accept non-numeric characters
        await userEvent.type(phoneInput, 'asdf!@#$%^&*()-_=+');
        expect(phoneInput.value).toBe('');

        // Simulate user input, confirm each block correctly formatted
        await userEvent.type(phoneInput, '123');
        expect(phoneInput.value).toBe('(123');
        await userEvent.type(phoneInput, '456');
        expect(phoneInput.value).toBe('(123) 456');
        await userEvent.type(phoneInput, '7890');
        expect(phoneInput.value).toBe('(123) 456-7890');

        // Simulate 10 backspaces, should automatically remove formatting characters
        const backspaces = '{backspace}'.repeat(10);
        await userEvent.type(phoneInput, backspaces);
        expect(phoneInput.value).toBe('');
    });

    it('blocks spaces in email field', async () => {
        const { getByPlaceholderText } = render(
            <ContactForm />
        );

        const emailInput = getByPlaceholderText('Email');
        await userEvent.type(emailInput, 'test space@example.com');

        expect(emailInput.value).toBe('testspace@example.com');
    });

    it('requires all fields, correct email and phone format', async () => {
        const { getByPlaceholderText } = render(
            <ContactForm />
        );

        // Get reference to each field
        const firstName = getByPlaceholderText('First Name');
        const lastName = getByPlaceholderText('Last Name');
        const emailInput = getByPlaceholderText('Email');
        const phoneInput = getByPlaceholderText('Phone');

        // All empty fields should be invalid
        expect(firstName.validity.valueMissing).toBeTruthy();
        expect(lastName.validity.valueMissing).toBeTruthy();
        expect(emailInput.validity.valueMissing).toBeTruthy();
        expect(phoneInput.validity.valueMissing).toBeTruthy();

        // Add arbitrary text to name fields, should be valid
        firstName.value = "foobar";
        expect(firstName.validity.valid).toBeTruthy();
        lastName.value = "foobar";
        expect(lastName.validity.valid).toBeTruthy();

        // Add arbitrary text to email, should fail type match
        emailInput.value = "foobar";
        expect(emailInput.validity.valid).toBeFalsy();
        expect(emailInput.validity.typeMismatch).toBeTruthy();

        // Add arbitrary text to phone, should fail pattern match
        phoneInput.value = "foobar";
        expect(phoneInput.validity.valid).toBeFalsy();
        expect(phoneInput.validity.patternMismatch).toBeTruthy();

        // Add correct email format, should be valid
        emailInput.value = "foo@bar.com";
        expect(emailInput.validity.valid).toBeTruthy();

        // Add correct phone format, should be valid
        phoneInput.value = "(123) 456-7890";
        expect(phoneInput.validity.valid).toBeTruthy();
    });
});
