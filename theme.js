// Theme Management System

// Current theme state
let currentTheme = 'dark';

// Initialize theme system
function initializeTheme() {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('travaTheme') || 'dark';
    setTheme(savedTheme, false); // false = don't animate on initial load
}

// Set theme
function setTheme(theme, animate = true) {
    currentTheme = theme;
    
    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button
    updateThemeToggle(theme, animate);
    
    // Update particles colors if particles exist
    updateParticleColors(theme);
    
    // Save preference
    localStorage.setItem('travaTheme', theme);
}

// Toggle between themes
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, true);
}

// Update theme toggle button appearance
function updateThemeToggle(theme, animate = true) {
    const toggle = document.querySelector('.theme-toggle');
    const slider = document.querySelector('.theme-toggle-slider');
    const icon = document.querySelector('.theme-toggle-icon');
    
    if (!toggle || !slider || !icon) return;
    
    // Add animation class if needed
    if (animate) {
        slider.style.transition = 'all 0.3s ease';
    } else {
        slider.style.transition = 'none';
        // Re-enable transition after a brief delay
        setTimeout(() => {
            slider.style.transition = 'all 0.3s ease';
        }, 50);
    }
    
    // Update icon and position based on theme
    if (theme === 'light') {
        icon.textContent = '☀️';
        slider.style.transform = 'translateX(30px)';
    } else {
        icon.textContent = '🌙';
        slider.style.transform = 'translateX(0)';
    }
}

// Update particle colors based on theme
function updateParticleColors(theme) {
    // This will be called when particles are created
    // The colors are handled by CSS variables, but we can trigger a refresh
    if (typeof particles !== 'undefined' && particles.length > 0) {
        particles.forEach(particle => {
            if (theme === 'light') {
                particle.color = Math.random() > 0.5 ? '#7c3aed' : '#a855f7';
            } else {
                particle.color = Math.random() > 0.5 ? '#3b82f6' : '#60a5fa';
            }
        });
    }
}

// Update particle creation in your existing script.js
// Add this to your Particle class constructor:
function updateParticleConstructor() {
    // This function updates the existing Particle class
    if (typeof Particle !== 'undefined') {
        const originalConstructor = Particle;
        
        window.Particle = function() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            
            // Theme-aware color selection
            if (currentTheme === 'light') {
                this.color = Math.random() > 0.5 ? '#7c3aed' : '#a855f7';
            } else {
                this.color = Math.random() > 0.5 ? '#3b82f6' : '#60a5fa';
            }
        };
        
        // Copy methods from original
        window.Particle.prototype = originalConstructor.prototype;
    }
}

// System preference detection
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Listen for system theme changes
function setupSystemThemeListener() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const savedTheme = localStorage.getItem('travaTheme');
            if (!savedTheme) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Enhanced theme initialization with system detection
function initializeThemeAdvanced() {
    // Check for saved preference first
    let savedTheme = localStorage.getItem('travaTheme');
    
    // If no saved preference, detect system preference
    if (!savedTheme) {
        savedTheme = detectSystemTheme();
    }
    
    setTheme(savedTheme, false);
    setupSystemThemeListener();
}

// Keyboard shortcut for theme toggle
function setupThemeKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + T to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Add theme transition class to prevent flash of unstyled content
function addThemeTransition() {
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition * {
            transition: background-color 0.3s ease, 
                       border-color 0.3s ease, 
                       color 0.3s ease, 
                       box-shadow 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add class during theme changes
    const originalSetTheme = setTheme;
    window.setTheme = function(theme, animate = true) {
        if (animate) {
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        }
        originalSetTheme(theme, animate);
    };
}

// Initialize theme system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeThemeAdvanced();
    setupThemeKeyboardShortcut();
    addThemeTransition();
    
    // Update particle constructor after a delay to ensure particles are loaded
    setTimeout(() => {
        updateParticleConstructor();
    }, 1000);
});

// Export functions for global access
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.currentTheme = () => currentTheme;

// Theme persistence across page navigation
window.addEventListener('beforeunload', () => {
    localStorage.setItem('travaTheme', currentTheme);
});

// Flash of unstyled content prevention
(function() {
    // Set theme immediately from localStorage to prevent flash
    const savedTheme = localStorage.getItem('travaTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();