// KnowLex Theme Toggle - Enhanced Dark/Light Mode
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 KnowLex Theme System - Initializing...');
    
    // Theme configuration
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };
    
    const STORAGE_KEY = 'knowlex-theme-preference';
    const THEME_ATTRIBUTE = 'data-theme';
    
    // Theme elements - handle both desktop and mobile
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const themeIcon = document.getElementById('themeIcon');
    const themeIconMobile = document.getElementById('themeIconMobile');
    const themeText = document.getElementById('themeText');
    const htmlElement = document.documentElement;
    
    if (!themeToggle && !themeToggleMobile) {
        console.warn('🎨 Theme toggle buttons not found');
        return;
    }
    
    // Get system preference
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.DARK;
        }
        return THEMES.LIGHT;
    }
    
    // Get stored preference
    function getStoredPreference() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.warn('🎨 Unable to access localStorage:', error);
            return null;
        }
    }
    
    // Store preference
    function storePreference(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
            console.log(`🎨 Theme preference saved: ${theme}`);
        } catch (error) {
            console.warn('🎨 Unable to save theme preference:', error);
        }
    }
    
    // Update UI elements
    function updateThemeUI(theme) {
        const icons = [themeIcon, themeIconMobile].filter(Boolean);
        const buttons = [themeToggle, themeToggleMobile].filter(Boolean);
        
        if (theme === THEMES.DARK) {
            icons.forEach(icon => icon.className = 'fas fa-sun');
            if (themeText) themeText.textContent = 'Modalità Chiara';
            buttons.forEach(btn => {
                btn.setAttribute('aria-label', 'Passa alla modalità chiara');
                btn.title = 'Passa alla modalità chiara';
            });
        } else {
            icons.forEach(icon => icon.className = 'fas fa-moon');
            if (themeText) themeText.textContent = 'Modalità Scura';
            buttons.forEach(btn => {
                btn.setAttribute('aria-label', 'Passa alla modalità scura');
                btn.title = 'Passa alla modalità scura';
            });
        }
    }
    
    // Apply theme
    function applyTheme(theme) {
        // Remove existing theme classes
        htmlElement.removeAttribute(THEME_ATTRIBUTE);
        document.body.classList.remove('theme-transitioning');
        
        // Add transition class for smooth animation
        document.body.classList.add('theme-transitioning');
        
        // Apply new theme
        if (theme === THEMES.DARK) {
            htmlElement.setAttribute(THEME_ATTRIBUTE, THEMES.DARK);
        }
        
        // Update UI
        updateThemeUI(theme);
        
        // Store preference
        storePreference(theme);
        
        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: theme }
        }));
        
        console.log(`🎨 Theme applied: ${theme}`);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }
    
    // Toggle theme
    function toggleTheme(button = null) {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        
        // Add click animation to the clicked button
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
        
        applyTheme(newTheme);
    }
    
    // Get current theme
    function getCurrentTheme() {
        return htmlElement.getAttribute(THEME_ATTRIBUTE) || THEMES.LIGHT;
    }
    
    // Initialize theme
    function initializeTheme() {
        // Priority: stored preference > system preference > light mode
        const storedTheme = getStoredPreference();
        const systemTheme = getSystemPreference();
        const initialTheme = storedTheme || systemTheme || THEMES.LIGHT;
        
        console.log(`🎨 Initializing with theme: ${initialTheme}`);
        console.log(`   - Stored preference: ${storedTheme || 'none'}`);
        console.log(`   - System preference: ${systemTheme}`);
        
        applyTheme(initialTheme);
    }
    
    // Event listeners for both buttons
    if (themeToggle) {
        themeToggle.addEventListener('click', () => toggleTheme(themeToggle));
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', () => toggleTheme(themeToggleMobile));
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't set a preference
            if (!getStoredPreference()) {
                const systemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
                console.log(`🎨 System theme changed to: ${systemTheme}`);
                applyTheme(systemTheme);
            }
        });
    }
    
    // Keyboard accessibility
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // Enhanced visual feedback on hover
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'translateY(-1px) scale(1.05)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = '';
    });
    
    // Initialize theme system
    initializeTheme();
    
    // Global theme utilities
    window.KnowLexTheme = {
        getCurrentTheme,
        toggleTheme,
        applyTheme,
        THEMES
    };
    
    console.log('🎨 KnowLex Theme System - Ready!');
});

// Add smooth transition styles when theme is changing
const style = document.createElement('style');
style.textContent = `
    .theme-transitioning * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
    
    .theme-transitioning *:before,
    .theme-transitioning *:after {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
`;
document.head.appendChild(style);
