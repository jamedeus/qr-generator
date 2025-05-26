import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeButton from '../DarkModeButton.js';

describe('DarkModeButton', () => {
    // Reset localStorage theme after each test
    afterEach(() => {
        localStorage.removeItem('theme');
    });

    it('shows moon icon in light mode', () => {
        // Set localStorage theme to light
        localStorage.setItem('theme', 'light');

        // Render, should match light mode snapshot
        const { getByRole } = render(<DarkModeButton />);
        expect(getByRole('button')).toMatchSnapshot();
    });

    it('shows sun icon in dark mode', () => {
        // Set localStorage theme to dark
        localStorage.setItem('theme', 'dark');

        // Render, should match dark mode snapshot
        const { getByRole } = render(<DarkModeButton />);
        expect(getByRole('button')).toMatchSnapshot();
    });

    it('saves theme to localStorage when clicked', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<DarkModeButton />);
        const darkModeButton = getByRole('button');

        // Confirm localStorage theme is not set before user clicks button
        expect(localStorage.getItem('theme')).toBeNull();

        // Click button, confirm localStorage theme changes to dark
        await user.click(darkModeButton);
        expect(localStorage.getItem('theme')).toBe('dark');

        // Click button again, confirm localStorage theme changes to light
        await user.click(darkModeButton);
        expect(localStorage.getItem('theme')).toBe('light');
    });
});
