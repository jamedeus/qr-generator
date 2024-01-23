import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../DarkMode.js';
import App from '../App';

describe('App', () => {
    let nav, form, submitButton, downloadButton, outputCol;
    let getByText, getByPlaceholderText, queryByPlaceholderText;

    // Setup: render App component, save references to buttons etc
    beforeEach(() => {
        // Mock window.scroll
        window.scroll = jest.fn();

        // Mock fetch function
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve('mock_image_string')
            })
        );

        // Render component
        const utils = render(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );

        // Export references to each component used by tests
        nav = utils.getByText(/QR Code Generator/).parentElement;
        submitButton = utils.getByText(/generate/i);
        downloadButton = utils.getByText(/download/i);
        form = submitButton.parentElement.parentElement;
        outputCol = form.parentElement.parentElement.childNodes[1];

        // Export query functions
        getByText = utils.getByText;
        getByPlaceholderText = utils.getByPlaceholderText;
        queryByPlaceholderText = utils.queryByPlaceholderText;
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
        // Confirm form not validated, output not visible, output img has default source
        expect(form.classList).not.toContainEqual('was-validated');
        expect(outputCol.classList).toContainEqual('d-none');
        expect(outputCol.childNodes[1].src).toBe('data:image/png;base64,');

        // Populate all fields, click generate button
        getByPlaceholderText('First Name').value = 'first';
        getByPlaceholderText('Last Name').value = 'last';
        getByPlaceholderText('Email').value = 'first.last@mail.com';
        getByPlaceholderText('Phone').value = '(123) 456-7890';
        await act(() => {
            fireEvent.click(submitButton);
        });

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

        // Confirm form is now validated, output column is visible, img has correct source
        expect(form.classList).toContainEqual('was-validated');
        expect(outputCol.classList).not.toContainEqual('d-none');
        expect(outputCol.childNodes[1].src).toBe('data:image/png;base64,mock_image_string');
    });

    it('does not make a request when form is invalid', async () => {
        // Confirm form not validated, output not visible, output img has default source
        expect(form.tagName).toBe('FORM');
        expect(form.classList).not.toContainEqual('was-validated');
        expect(outputCol.classList).toContainEqual('d-none');
        expect(outputCol.childNodes[1].src).toBe('data:image/png;base64,');

        // Click generate button without filling in fields
        await act(() => {
            fireEvent.click(submitButton);
        });

        // Confirm fetch was NOT called
        expect(global.fetch).not.toHaveBeenCalled();

        // Confirm form is now validated, but output is not visible and img still default
        expect(form.classList).toContainEqual('was-validated');
        expect(outputCol.classList).toContainEqual('d-none');
        expect(outputCol.childNodes[1].src).toBe('data:image/png;base64,');
    });

    it('correctly handles downloadQR function', async () => {
        // Mock atob to ignore input and return a known value
        jest.spyOn(window, 'atob').mockImplementation(() => 'base64_string');

        // Mock Blob function, save reference to confirm data
        const blobMock = jest.fn();
        global.Blob = blobMock;

        // Mock createObjectURL to return a known value
        URL.createObjectURL = jest.fn(() => 'blob:url');

        // Click download button
        await act(() => {
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

    it('hides QR code when form type is changed', async () => {
        // Populate all fields, click generate button
        getByPlaceholderText('First Name').value = 'first';
        getByPlaceholderText('Last Name').value = 'last';
        getByPlaceholderText('Email').value = 'first.last@mail.com';
        getByPlaceholderText('Phone').value = '(123) 456-7890';
        await act(() => {
            fireEvent.click(submitButton);
        });

        // Confirm output column is visible, img has expected source
        expect(form.classList).toContainEqual('was-validated');
        expect(outputCol.classList).not.toContainEqual('d-none');
        expect(outputCol.childNodes[1].src).toBe('data:image/png;base64,mock_image_string');

        // Click top-right menu button (open dropdown, render options inside)
        act(() => {
            nav.childNodes[2].childNodes[0].click();
        });

        // Switch to wifi form
        await act(() => {
            const WifiButton = nav.childNodes[2].childNodes[1].childNodes[1];
            fireEvent.click(WifiButton);
        });

        // Wait for animation (state doesn't update until complete)
        await waitFor(() => {
            // Get new references (old were replaced by re-render)
            const form = getByText(/generate/i).parentElement.parentElement;
            const outputCol = form.parentElement.parentElement.childNodes[1];

            // Confirm output column hidden, img source reset
            expect(form.classList).not.toContainEqual('was-validated');
            expect(outputCol.classList).toContainEqual('fade-out');
            expect(outputCol.childNodes[1].src).toBe('data:image/png;base64,');
        }, { timeout: 500 });
    });
});
