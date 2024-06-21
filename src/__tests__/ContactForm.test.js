import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

describe('ContactForm', () => {
    let component, user;

    beforeEach(() => {
        // Render component, create userEvent instance
        user = userEvent.setup();
        component = render(
            <ContactForm />
        );
    });

    it('matches snapshot', () => {
        expect(component).toMatchSnapshot();
    });

    it('formats phone number correctly, blocks invalid characters', async () => {
        const phoneInput = component.getByPlaceholderText('Phone');

        // Should not accept non-numeric characters
        await user.type(phoneInput, 'asdf!@#$%^&*()-_=+');
        expect(phoneInput.value).toBe('');

        // Simulate user input, confirm each block correctly formatted
        await user.type(phoneInput, '123');
        expect(phoneInput.value).toBe('(123');
        await user.type(phoneInput, '456');
        expect(phoneInput.value).toBe('(123) 456');
        await user.type(phoneInput, '7890');
        expect(phoneInput.value).toBe('(123) 456-7890');

        // Simulate 10 backspaces, should automatically remove formatting characters
        const backspaces = '{backspace}'.repeat(10);
        await user.type(phoneInput, backspaces);
        expect(phoneInput.value).toBe('');
    });

    it('blocks spaces in email field', async () => {
        const emailInput = component.getByPlaceholderText('Email');
        await user.type(emailInput, 'test space@example.com');

        expect(emailInput.value).toBe('testspace@example.com');
    });

    it('requires all fields, correct email and phone format', async () => {
        // Get reference to each field
        const firstName = component.getByPlaceholderText('First Name');
        const lastName = component.getByPlaceholderText('Last Name');
        const emailInput = component.getByPlaceholderText('Email');
        const phoneInput = component.getByPlaceholderText('Phone');

        // All empty fields should be invalid
        expect(firstName.validity.valueMissing).toBe(true);
        expect(lastName.validity.valueMissing).toBe(true);
        expect(emailInput.validity.valueMissing).toBe(true);
        expect(phoneInput.validity.valueMissing).toBe(true);

        // Add arbitrary text to name fields, should be valid
        firstName.value = "foobar";
        expect(firstName.validity.valid).toBe(true);
        lastName.value = "foobar";
        expect(lastName.validity.valid).toBe(true);

        // Add arbitrary text to email, should fail type match
        emailInput.value = "foobar";
        expect(emailInput.validity.valid).toBe(false);
        expect(emailInput.validity.typeMismatch).toBe(true);

        // Add arbitrary text to phone, should fail pattern match
        phoneInput.value = "foobar";
        expect(phoneInput.validity.valid).toBe(false);
        expect(phoneInput.validity.patternMismatch).toBe(true);

        // Add correct email format, should be valid
        emailInput.value = "foo@bar.com";
        expect(emailInput.validity.valid).toBe(true);

        // Add correct phone format, should be valid
        phoneInput.value = "(123) 456-7890";
        expect(phoneInput.validity.valid).toBe(true);
    });
});
