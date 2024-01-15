// Check if user is in dark mode, change theme (runs once on page load)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme','dark');
}

// Listen for system theme changes, switch to dark/light mode to reflect (responsive)
window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    if (e.matches) { // Returns True for dark mode, False otherwise
        document.documentElement.setAttribute('data-bs-theme','dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme','light');
    }
});
