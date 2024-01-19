import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // Setup, runs once when mounted
    useEffect(() => {
        // Check system theme once, override default (light) if user prefers dark
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }

        // Listen for system theme changes, switch to dark/light mode responsively
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            if (e.matches) { // Returns True for dark mode, False otherwise
                setTheme('dark');
            } else {
                setTheme('light');
            }
        });
    }, []);

    // Change theme data attribute when state object changes
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node,
};
