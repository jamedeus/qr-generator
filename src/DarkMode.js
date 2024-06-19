import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { BrightnessHighFill, MoonFill } from 'react-bootstrap-icons';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Load theme from localStorage (or default to light)
    const initialTheme = localStorage.getItem('theme') || 'light';
    const [theme, setTheme] = useState(initialTheme);

    // Change theme data attribute when state object changes
    // Write new theme to  localStorage for persistence
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
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
                    <MoonFill className="mb-1" />
                </Button>
            );
        case "dark":
            return (
                <Button
                    className="my-auto"
                    title="Switch to light mode"
                    onClick={(() => {setTheme('light');})}
                >
                    <BrightnessHighFill className="mb-1" />
                </Button>
            );
    }
};
