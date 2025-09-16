// KnowLex Enhanced Navbar System - Desktop Dropdown + Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 KnowLex Navbar System - Initializing...');
    
    // ==========================================
    // MOBILE MENU MANAGEMENT
    // ==========================================
    
    // Mobile menu elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    // Mobile menu state
    let mobileMenuOpen = false;
    
    // Open mobile menu
    function openMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            mobileMenuOpen = true;
            console.log('📱 Mobile menu opened');
            
            // Update hamburger animation
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.add('active');
            }
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            mobileMenuOpen = false;
            console.log('📱 Mobile menu closed');
            
            // Reset hamburger animation
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        if (mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Mobile menu event listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking overlay (but not menu content)
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when clicking on mobile nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add small delay to allow navigation
            setTimeout(() => {
                closeMobileMenu();
            }, 200);
        });
    });
    
    // ==========================================
    // DESKTOP DROPDOWN MANAGEMENT
    // ==========================================
    
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu-enhanced');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    
    if (navDropdown && dropdownMenu) {
        let dropdownTimeout;
        
        // Show dropdown on hover (desktop only)
        function showDropdown() {
            // Only on desktop/tablet
            if (window.innerWidth >= 992) {
                clearTimeout(dropdownTimeout);
                dropdownMenu.style.display = 'block';
                // Force reflow
                dropdownMenu.offsetHeight;
                dropdownMenu.classList.add('show');
                console.log('🖥️ Desktop dropdown shown');
            }
        }
        
        // Hide dropdown
        function hideDropdown() {
            if (dropdownMenu) {
                dropdownMenu.classList.remove('show');
                dropdownTimeout = setTimeout(() => {
                    if (!dropdownMenu.matches(':hover') && !navDropdown.matches(':hover')) {
                        dropdownMenu.style.display = 'none';
                        console.log('🖥️ Desktop dropdown hidden');
                    }
                }, 300);
            }
        }
        
        // Mouse enter events
        navDropdown.addEventListener('mouseenter', showDropdown);
        dropdownMenu.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
        });
        
        // Mouse leave events
        navDropdown.addEventListener('mouseleave', hideDropdown);
        dropdownMenu.addEventListener('mouseleave', hideDropdown);
        
        // Click event for dropdown trigger (backup for touch devices)
        if (dropdownTrigger) {
            dropdownTrigger.addEventListener('click', function(e) {
                // Only prevent default on mobile to allow hover on desktop
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    
                    if (dropdownMenu.classList.contains('show')) {
                        hideDropdown();
                    } else {
                        showDropdown();
                    }
                }
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (dropdownMenu && !navDropdown.contains(e.target)) {
                hideDropdown();
            }
        });
    }
    
    // ==========================================
    // RESPONSIVE BEHAVIOR
    // ==========================================
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Close mobile menu if switching to desktop
        if (window.innerWidth >= 992 && mobileMenuOpen) {
            closeMobileMenu();
        }
        
        // Hide desktop dropdown if switching to mobile
        if (window.innerWidth < 992 && dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
            dropdownMenu.style.display = 'none';
        }
    });
    
    // ==========================================
    // NAVBAR SCROLL BEHAVIOR
    // ==========================================
    
    const navbar = document.querySelector('.enhanced-navbar');
    let lastScrollY = window.scrollY;
    
    // Add scroll behavior to navbar
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ==========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================
    
    // Add keyboard navigation for dropdown
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (window.innerWidth >= 992) {
                    showDropdown();
                    // Focus first dropdown item
                    const firstItem = dropdownMenu.querySelector('.dropdown-item-enhanced');
                    if (firstItem) {
                        setTimeout(() => firstItem.focus(), 100);
                    }
                }
            } else if (e.key === 'Escape') {
                hideDropdown();
                dropdownTrigger.focus();
            }
        });
    }
    
    // Add keyboard navigation for dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item-enhanced');
    dropdownItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = dropdownItems[index + 1];
                if (nextItem) {
                    nextItem.focus();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = dropdownItems[index - 1];
                if (prevItem) {
                    prevItem.focus();
                } else {
                    dropdownTrigger.focus();
                }
            } else if (e.key === 'Escape') {
                hideDropdown();
                dropdownTrigger.focus();
            }
        });
    });
    
    // ==========================================
    // MOBILE THEME TOGGLE INTEGRATION
    // ==========================================
    
    // Ensure mobile theme toggle works
    const mobileThemeToggle = document.getElementById('themeToggleMobile');
    if (mobileThemeToggle && window.KnowLexTheme) {
        mobileThemeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.KnowLexTheme.toggleTheme(this);
        });
    }
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    // Global navbar utilities
    window.KnowLexNavbar = {
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
        showDropdown,
        hideDropdown,
        isMobileMenuOpen: () => mobileMenuOpen
    };
    
    console.log('🚀 KnowLex Navbar System - Ready!');
    console.log('   - Mobile menu:', mobileMenuToggle ? '✅' : '❌');
    console.log('   - Desktop dropdown:', navDropdown ? '✅' : '❌');
    console.log('   - Theme integration:', window.KnowLexTheme ? '✅' : '❌');
});

// Add CSS for hamburger animation
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-btn.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-btn.active .hamburger-line:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .enhanced-navbar.scrolled {
        backdrop-filter: blur(25px);
        box-shadow: 0 6px 30px var(--navbar-shadow, rgba(30, 64, 175, 0.15));
    }
    
    .dropdown-menu-enhanced.show {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
        display: block !important;
    }
`;
document.head.appendChild(style);