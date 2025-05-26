import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { BsBrightnessHighFill, BsMoonFill } from 'react-icons/bs';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Load theme from localStorage (or default to light)
    const initialTheme = localStorage.getItem('theme') || 'light';
    const [theme, setTheme] = useState(initialTheme);

    // Changes state and data attribute, writes to localStorage for persistence
    const changeTheme = (newTheme) => {
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export const DarkModeButton = () => {
    // Get theme state + hook to change
    const { theme, changeTheme } = useContext(ThemeContext);

    switch(theme) {
        case "light":
            return (
                <Button
                    className="d-flex my-auto px-2"
                    title="Switch to dark mode"
                    style={{ fontSize: "1.25rem" }}
                    onClick={(() => {changeTheme('dark');})}
                >
                    <BsMoonFill />
                </Button>
            );
        case "dark":
            return (
                <Button
                    className="d-flex my-auto px-2"
                    title="Switch to light mode"
                    style={{ fontSize: "1.25rem" }}
                    onClick={(() => {changeTheme('light');})}
                >
                    <BsBrightnessHighFill />
                </Button>
            );
    }
};
