import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeContext, ThemeProvider, DarkModeButton } from '../DarkMode.js';

// Consumes theme state, renders current value in div
const ExposeStateObject = () => {
    const { theme } = useContext(ThemeContext);
    return <div data-testid="theme">{theme}</div>;
};

describe('DarkModeButton', () => {
    // Reset localStorage theme after each test
    afterEach(() => {
        localStorage.removeItem('theme');
    });

    it('shows moon icon in light mode', () => {
        // Set localStorage theme to light
        localStorage.setItem('theme', 'light');

        // Render, should match light mode snapshot
        const { getByRole } = render(
            <ThemeProvider>
                <DarkModeButton />
            </ThemeProvider>
        );
        expect(getByRole('button')).toMatchSnapshot();
    });

    it('shows sun icon in dark mode', () => {
        // Set localStorage theme to dark
        localStorage.setItem('theme', 'dark');

        // Render, should match dark mode snapshot
        const { getByRole } = render(
            <ThemeProvider>
                <DarkModeButton />
            </ThemeProvider>
        );
        expect(getByRole('button')).toMatchSnapshot();
    });

    it('toggles state object when clicked', async () => {
        const user = userEvent.setup();
        // Render button and test component that exposes state value
        const { getByRole, getByTestId } = render(
            <ThemeProvider>
                <DarkModeButton />
                <ExposeStateObject />
            </ThemeProvider>
        );
        const darkModeButton = getByRole('button');

        // Confirm defaulted to light mode
        expect(getByTestId('theme').innerHTML).toBe('light');

        // Click button, confirm state and button title change
        await user.click(darkModeButton);
        expect(darkModeButton.title).toBe('Switch to light mode');
        expect(getByTestId('theme').innerHTML).toBe('dark');

        // Click button again, confirm state and button title change back
        await user.click(darkModeButton);
        expect(darkModeButton.title).toBe('Switch to dark mode');
        expect(getByTestId('theme').innerHTML).toBe('light');
    });

    it('saves theme to localStorage when clicked', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <ThemeProvider>
                <DarkModeButton />
            </ThemeProvider>
        );
        const darkModeButton = getByRole('button');

        // Confirm localStorage theme defaults to light
        expect(localStorage.getItem('theme')).toBe('light');

        // Click button, confirm localStorage theme changes to dark
        await user.click(darkModeButton);
        expect(localStorage.getItem('theme')).toBe('dark');

        // Click button again, confirm localStorage theme changes to light
        await user.click(darkModeButton);
        expect(localStorage.getItem('theme')).toBe('light');
    });
});
