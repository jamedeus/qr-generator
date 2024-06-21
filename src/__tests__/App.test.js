import userEvent from "@testing-library/user-event";
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../DarkMode.js';
import App from '../App';

describe('App', () => {
    let app, user;

    beforeEach(() => {
        // Mock fetch function
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            text: () => Promise.resolve('mock_image_string')
        }));

        // Mock window.scroll
        window.scroll = jest.fn();

        // Render component, create userEvent instance
        user = userEvent.setup();
        app = render(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );
    });

    it('matches snapshot', () => {
        const component = render(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );
        expect(component).toMatchSnapshot();
    });

    it('renders the correct form when dropdown buttons are clicked', async () => {
        // Confirm contact form is mounted by default, other forms are not
        expect(app.queryByPlaceholderText('First Name').nodeName).toBe('INPUT');
        expect(app.queryByPlaceholderText('SSID')).toBeNull();
        expect(app.queryByPlaceholderText('URL')).toBeNull();

        // Click top-right menu button, click Wifi option
        await user.click(app.getByTestId('dropdown'));
        await user.click(app.getByText('Wifi'));

        // Confirm Wifi form is mounted, other forms are not
        expect(app.queryByPlaceholderText('First Name')).toBeNull();
        expect(app.queryByPlaceholderText('SSID').nodeName).toBe('INPUT');
        expect(app.queryByPlaceholderText('URL')).toBeNull();

        // Click top-right menu button, click Link option
        await user.click(app.getByTestId('dropdown'));
        await user.click(app.getByText('Link'));

        // Confirm Link form is mounted, other forms are not
        expect(app.queryByPlaceholderText('First Name')).toBeNull();
        expect(app.queryByPlaceholderText('SSID')).toBeNull();
        expect(app.queryByPlaceholderText('URL').nodeName).toBe('INPUT');

        // Click top-right menu button, click Contact option
        await user.click(app.getByTestId('dropdown'));
        await user.click(app.getByText('Contact'));

        // Confirm Contact form is mounted, other forms are not
        expect(app.queryByPlaceholderText('First Name').nodeName).toBe('INPUT');
        expect(app.queryByPlaceholderText('SSID')).toBeNull();
        expect(app.queryByPlaceholderText('URL')).toBeNull();

    });

    it('sends correct request when valid form is submitted', async () => {
        // Confirm form not validated, output column not mounted
        expect(app.getByRole('form').classList).not.toContainEqual('was-validated');
        expect(app.container.querySelector('img')).toBeNull();

        // Populate all fields, click generate button
        app.getByPlaceholderText('First Name').value = 'first';
        app.getByPlaceholderText('Last Name').value = 'last';
        app.getByPlaceholderText('Email').value = 'first.last@mail.com';
        app.getByPlaceholderText('Phone').value = '(123) 456-7890';
        await user.click(app.getByText('Generate'));

        // Confirm correct data posted to /generate endpoint
        expect(global.fetch).toHaveBeenCalledWith('/generate', {
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
        });

        // Confirm form validated, output column mounted, img has correct source
        expect(app.getByRole('form').classList).toContainEqual('was-validated');
        expect(app.container.querySelector('img')).not.toBeNull();
        expect(app.container.querySelector('img').src).toBe(
            'data:image/png;base64,mock_image_string'
        );
    });

    it('does not make a request when form is invalid', async () => {
        // Confirm form not validated, output column not rendered
        expect(app.getByRole('form').classList).not.toContainEqual('was-validated');
        expect(app.container.querySelector('img')).toBeNull();

        // Click generate button without filling in fields
        await user.click(app.getByText('Generate'));

        // Confirm fetch was NOT called
        expect(global.fetch).not.toHaveBeenCalled();

        // Confirm form is now validated, but output column still not mounted
        expect(app.getByRole('form').classList).toContainEqual('was-validated');
        expect(app.container.querySelector('img')).toBeNull();
    });

    it('shows an alert if an error is received from backend', async () => {
        // Spy on window.alert, mock fetch function to return expected error
        const alertSpy = jest.spyOn(window, 'alert');
        global.fetch = jest.fn(() => Promise.resolve({
            ok: false,
            status: 400,
            text: () => Promise.resolve('Unsupported QR code type')
        }));

        // Populate all fields, click generate button
        app.getByPlaceholderText('First Name').value = 'first';
        app.getByPlaceholderText('Last Name').value = 'last';
        app.getByPlaceholderText('Email').value = 'first.last@mail.com';
        app.getByPlaceholderText('Phone').value = '(123) 456-7890';
        await user.click(app.getByText('Generate'));

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
        app.getByPlaceholderText('First Name').value = 'first';
        app.getByPlaceholderText('Last Name').value = 'last';
        app.getByPlaceholderText('Email').value = 'first.last@mail.com';
        app.getByPlaceholderText('Phone').value = '(123) 456-7890';
        await user.click(app.getByText('Generate'));

        // Click download button
        const downloadButton = app.getByText("Download");
        await user.click(downloadButton);

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
        app.getByPlaceholderText('First Name').value = 'first';
        app.getByPlaceholderText('Last Name').value = 'last';
        app.getByPlaceholderText('Email').value = 'first.last@mail.com';
        app.getByPlaceholderText('Phone').value = '(123) 456-7890';
        await user.click(app.getByText('Generate'));

        // Confirm output column was rendered, img has expected source
        expect(app.getByRole('form').classList).toContainEqual('was-validated');
        expect(app.container.querySelector('img')).not.toBeNull();
        expect(app.container.querySelector('img').src).toBe(
            'data:image/png;base64,mock_image_string'
        );

        // Click top-right menu button, click Wifi option
        await user.click(app.getByTestId('dropdown'));
        await user.click(app.getByText('Wifi'));

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
        expect(app.getByRole('form').classList).not.toContainEqual('was-validated');
    });
});
