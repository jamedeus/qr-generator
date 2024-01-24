import React, { useContext } from 'react';
import { act } from 'react-dom/test-utils';
import {render, fireEvent} from '@testing-library/react';
import { ThemeContext, ThemeProvider, DarkModeButton } from '../DarkMode.js';

// Consumes theme state, renders current value in div
const ExposeStateObject = () => {
    const { theme } = useContext(ThemeContext);
    return <div>{theme}</div>;
};

// Mocks window.matchMedia, adds function to manually change theme in tests
const mockMatchMedia = () => {
    // Mock theme change listener
    let mockListener = jest.fn();

    // Bool is true if prefers-color-scheme is dark, false if light
    let matches = false;

    // Mock window.matchMedia to return object containing matches bool,
    // add/remove listener functions that overwrite mockListener
    window.matchMedia = jest.fn().mockImplementation(query => {
        return {
            matches: matches,
            media: query,
            addListener: jest.fn(listener => {
                mockListener = listener;
            }),
            removeListener: jest.fn(listener => {
                mockListener = jest.fn();
            }),
        };
    });

    // Add function to manually overwrite matches, trigger mockListener
    window.triggerMatchMediaListener = (newMatches) => {
        matches = newMatches;
        mockListener({ matches: newMatches });
    };
};

describe('ThemeProvider', () => {
    // Mock window.matchMedia
    beforeEach(mockMatchMedia);

    it('sets theme state to dark when prefers-color-scheme is dark', () => {
        // Set prefers-color-scheme to dark
        window.triggerMatchMediaListener(true);

        // Render, state object should contain "dark"
        const { getByText } = render(
            <ThemeProvider>
                <ExposeStateObject />
            </ThemeProvider>
        );
        expect(getByText('dark'));
    });

    it('sets theme state to light when prefers-color-scheme is light', () => {
        // Set prefers-color-scheme to light
        window.triggerMatchMediaListener(false);

        // Render, state object should contain "light"
        const { getByText } = render(
            <ThemeProvider>
                <ExposeStateObject />
            </ThemeProvider>
        );
        expect(getByText('light'));
    });

    it('switches theme dynamically when prefers-color-scheme changes', () => {
        // Render without setting prefers-color-scheme, should default to light
        const { getByText, rerender } = render(
            <ThemeProvider>
                <ExposeStateObject />
            </ThemeProvider>
        );
        expect(getByText('light'));

        // Change preferse-color-scheme to dark
        act(() => {
            window.triggerMatchMediaListener(true);
        });

        // Re-render component, state object should contain "dark"
        rerender(
            <ThemeProvider>
                <ExposeStateObject />
            </ThemeProvider>
        );
        expect(getByText('dark'));

        // Change preferse-color-scheme to light
        act(() => {
            window.triggerMatchMediaListener(false);
        });

        // Re-render component, state object should contain "light"
        rerender(
            <ThemeProvider>
                <ExposeStateObject />
            </ThemeProvider>
        );
        expect(getByText('light'));
    });
});


describe('DarkModeButton', () => {
    // Mock window.matchMedia
    beforeEach(mockMatchMedia);

    it('shows moon icon in light mode', () => {
        // Set prefers-color-scheme to light
        window.triggerMatchMediaListener(false);

        // Render, should match light mode snapshot
        const { getByRole } = render(
            <ThemeProvider>
                <DarkModeButton />
            </ThemeProvider>
        );
        expect(getByRole('button')).toMatchSnapshot();
    });

    it('shows sun icon in dark mode', () => {
        // Set prefers-color-scheme to dark
        window.triggerMatchMediaListener(true);

        // Render, should match dark mode snapshot
        const { getByRole } = render(
            <ThemeProvider>
                <DarkModeButton />
            </ThemeProvider>
        );
        expect(getByRole('button')).toMatchSnapshot();
    });

    it('toggles state object when clicked', async () => {
        // Render button and test component that exposes state value
        const { getByRole, getByText } = render(
            <ThemeProvider>
                <DarkModeButton />
                <ExposeStateObject />
            </ThemeProvider>
        );
        const darkModeButton = getByRole('button');

        // Confirm defaulted to light mode
        expect(getByText('light'));

        // Click button, confirm state and button title change
        await act(() => {
            fireEvent.click(darkModeButton);
        });
        expect(darkModeButton.title).toBe('Switch to light mode');
        expect(getByText('dark'));

        // Click button again, confirm state and button title change back
        await act(() => {
            fireEvent.click(darkModeButton);
        });
        expect(darkModeButton.title).toBe('Switch to dark mode');
        expect(getByText('light'));
    });
});
