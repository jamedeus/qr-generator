import renderer from 'react-test-renderer';
import userEvent from "@testing-library/user-event";
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../DarkMode.js';
import App from '../App';

describe('App', () => {
    let app, nav, form, submitButton;
    let getByText, getByPlaceholderText, queryByPlaceholderText;

    // Setup: render App component, save references to buttons etc
    beforeEach(() => {
        // Mock window.scroll
        window.scroll = jest.fn();

        // Mock fetch function
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve('mock_image_string')
            })
        );

        // Render component
        app = render(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );

        // Export references to each component used by tests
        nav = app.getByText(/QR Code Generator/).parentElement;
        submitButton = app.getByText(/generate/i);
        form = submitButton.parentElement.parentElement;

        // Export query functions
        getByText = app.getByText;
        getByPlaceholderText = app.getByPlaceholderText;
        queryByPlaceholderText = app.queryByPlaceholderText;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('matches snapshot', () => {
        const component = renderer.create(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders the correct form when dropdown buttons are clicked', () => {
        // Click top-right menu button (open dropdown, render options inside)
        act(() => {
            nav.childNodes[2].childNodes[0].click();
        });

        // Get reference to each button that just rendered
        const ContactButton = nav.childNodes[2].childNodes[1].childNodes[0];
        const WifiButton = nav.childNodes[2].childNodes[1].childNodes[1];
        const LinkButton = nav.childNodes[2].childNodes[1].childNodes[2];

        // Should show contact by default
        expect(queryByPlaceholderText('First Name').nodeName).toBe('INPUT');
        expect(queryByPlaceholderText('SSID')).toBeNull();
        expect(queryByPlaceholderText('URL')).toBeNull();

        // Click wifi button, should show wifi form + hide other forms
        act(() => {
            fireEvent.click(WifiButton);
        });
        expect(queryByPlaceholderText('First Name')).toBeNull();
        expect(queryByPlaceholderText('SSID').nodeName).toBe('INPUT');
        expect(queryByPlaceholderText('URL')).toBeNull();

        // Click link button, should show link form + hide other forms
        act(() => {
            fireEvent.click(LinkButton);
        });
        expect(queryByPlaceholderText('First Name')).toBeNull();
        expect(queryByPlaceholderText('SSID')).toBeNull();
        expect(queryByPlaceholderText('URL').nodeName).toBe('INPUT');

        // Click contact button, should show contact form + hide other forms
        act(() => {
            fireEvent.click(ContactButton);
        });
        expect(queryByPlaceholderText('First Name').nodeName).toBe('INPUT');
        expect(queryByPlaceholderText('SSID')).toBeNull();
        expect(queryByPlaceholderText('URL')).toBeNull();

    });

    it('sends correct request when valid form is submitted', async () => {
        // Confirm form not validated, output column not rendered
        expect(form.classList).not.toContainEqual('was-validated');
        expect(app.container.querySelector('img')).toBeNull();

        // Populate all fields, click generate button
        getByPlaceholderText('First Name').value = 'first';
        getByPlaceholderText('Last Name').value = 'last';
        getByPlaceholderText('Email').value = 'first.last@mail.com';
        getByPlaceholderText('Phone').value = '(123) 456-7890';
        await userEvent.click(submitButton);

        // Confirm correct data posted to /generate endpoint
        expect(global.fetch).toHaveBeenCalledWith('/generate', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                "firstName": "first",
                "lastName": "last",
                "email": "first.last@mail.com",
                "phone": "(123) 456-7890",
                "type": "contact-qr"
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }));

        // Confirm form is now validated, output column rendered, img has correct source
        expect(form.classList).toContainEqual('was-validated');
        expect(app.container.querySelector('img')).not.toBeNull();
        expect(app.container.querySelector('img').src).toBe(
            'data:image/png;base64,mock_image_string'
        );
    });

    it('does not make a request when form is invalid', async () => {
        // Confirm form not validated, output column not rendered
        expect(form.tagName).toBe('FORM');
        expect(form.classList).not.toContainEqual('was-validated');
        expect(app.container.querySelector('img')).toBeNull();

        // Click generate button without filling in fields
        act(() => {
            fireEvent.click(submitButton);
        });

        // Confirm fetch was NOT called
        expect(global.fetch).not.toHaveBeenCalled();

        // Confirm form is now validated, but output column still did not render
        expect(form.classList).toContainEqual('was-validated');
        expect(app.container.querySelector('img')).toBeNull();
    });

    it('shows an alert if an error is received from backend', async () => {
        // Spy on window.alert, mock fetch function to return expected error
        const alertSpy = jest.spyOn(window, 'alert');
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                text: () => Promise.resolve('Unsupported QR code type')
            })
        );

        // Populate all fields, click generate button
        getByPlaceholderText('First Name').value = 'first';
        getByPlaceholderText('Last Name').value = 'last';
        getByPlaceholderText('Email').value = 'first.last@mail.com';
        getByPlaceholderText('Phone').value = '(123) 456-7890';
        await userEvent.click(submitButton);

        // Confirm window.alert was called, output column did not render
        expect(alertSpy).toHaveBeenCalled();
        expect(app.container.querySelector('img')).toBeNull();
    });

    it('correctly handles downloadQR function', async () => {
        // Mock atob to ignore input and return a known value
        jest.spyOn(window, 'atob').mockImplementation(() => 'base64_string');

        // Mock Blob function, save reference to confirm data
        const blobMock = jest.fn();
        global.Blob = blobMock;

        // Mock createObjectURL to return a known value
        URL.createObjectURL = jest.fn(() => 'blob:url');

        // Populate fields and click generate to render download button
        getByPlaceholderText('First Name').value = 'first';
        getByPlaceholderText('Last Name').value = 'last';
        getByPlaceholderText('Email').value = 'first.last@mail.com';
        getByPlaceholderText('Phone').value = '(123) 456-7890';
        await userEvent.click(submitButton);

        // Click download button
        const downloadButton = app.getByText(/download/i);
        act(() => {
            fireEvent.click(downloadButton);
        });

        // Confirm Blob was created with correct data
        expect(blobMock).toMatchSnapshot();

        // Confirm correct URL was generated
        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(downloadButton.href).toBe('blob:url');

        // Confirm correct filename
        expect(downloadButton.download).toBe('contact-qr.png');
    });

    it('unmounts QR code image when form type is changed', async () => {
        // Populate all fields, click generate button
        getByPlaceholderText('First Name').value = 'first';
        getByPlaceholderText('Last Name').value = 'last';
        getByPlaceholderText('Email').value = 'first.last@mail.com';
        getByPlaceholderText('Phone').value = '(123) 456-7890';
        await userEvent.click(submitButton);

        // Confirm output column was rendered, img has expected source
        expect(form.classList).toContainEqual('was-validated');
        expect(app.container.querySelector('img')).not.toBeNull();
        expect(app.container.querySelector('img').src).toBe(
            'data:image/png;base64,mock_image_string'
        );

        // Click top-right menu button (open dropdown, render options inside)
        act(() => {
            nav.childNodes[2].childNodes[0].click();
        });

        // Switch to wifi form
        act(() => {
            const WifiButton = nav.childNodes[2].childNodes[1].childNodes[1];
            fireEvent.click(WifiButton);
        });

        // Confirm fade-exit class is added to output column
        await waitFor(() => {
            expect(
                app.container.querySelector('img').parentElement.classList
            ).toContain('fade-exit');
        }, { timeout: 50});


        // Confirm output column is umounted after animation completes
        await waitFor(() => {
            expect(app.container.querySelector('img')).toBeNull();
        }, { timeout: 500 });

        // Confirm new form is not validated
        const newForm = getByText(/generate/i).parentElement.parentElement;
        expect(newForm.classList).not.toContainEqual('was-validated');
    });
});
