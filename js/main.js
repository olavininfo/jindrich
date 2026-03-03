/* ===========================================
   Jindrich — Main JS
   Navigation, scroll effects, animations
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initServicesDropdown();
});

/**
 * Navbar scroll effect — transparent to solid
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function checkScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // Check on load
}

/**
 * Mobile hamburger menu
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('open');
        });
    });
}

/**
 * Scroll-triggered fade-in animations
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

/**
 * Services dropdown on nav (desktop hover)
 */
function initServicesDropdown() {
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');

    // Desktop hover
    dropdown.addEventListener('mouseenter', () => {
        menu.classList.add('show');
    });

    dropdown.addEventListener('mouseleave', () => {
        menu.classList.remove('show');
    });

    // Mobile click
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                menu.classList.toggle('show');
            }
        });
    }
}
