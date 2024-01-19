import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { BrightnessHighFill, MoonFill } from 'react-bootstrap-icons';

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

export const DarkModeButton = () => {
    // Get theme state + hook to change
    const { theme, setTheme } = useContext(ThemeContext);

    switch(theme) {
        case "light":
            return (
                <Button
                    className="my-auto"
                    title="Switch to dark mode"
                    onClick={(() => {setTheme('dark');})}
                >
                    <MoonFill />
                </Button>
            );
        case "dark":
            return (
                <Button
                    className="my-auto"
                    title="Switch to light mode"
                    onClick={(() => {setTheme('light');})}
                >
                    <BrightnessHighFill />
                </Button>
            );
    }
};
