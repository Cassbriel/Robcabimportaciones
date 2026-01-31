document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 17, 23, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(13, 17, 23, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Simple fade-in animation on scroll
    const fadeInElements = document.querySelectorAll('.feature-card, .product-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Login Modal Logic
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');

    if (loginBtn && loginModal && closeModalBtn) {
        // Open Modal
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            // Small delay to allow display:flex to apply before adding opacity class
            setTimeout(() => {
                loginModal.classList.add('show');
            }, 10);
        });

        // Close Modal Function
        const closeModal = () => {
            loginModal.classList.remove('show');
            setTimeout(() => {
                loginModal.style.display = 'none';
            }, 300); // Wait for transition
        };

        // Close on X click
        closeModalBtn.addEventListener('click', closeModal);

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeModal();
            }
        });

        // Handle Form Submit
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                // Simple check (accept any non-empty username for demo)
                if (username) {
                    // alert(`Bienvenido al Control Maestro, ${username}`); // Removed alert
                    closeModal();
                    loginForm.reset();

                    // Show Admin Panel
                    const adminPanel = document.getElementById('admin-panel');
                    if (adminPanel) {
                        adminPanel.classList.add('active');
                    }
                }
            });
        }
    }

    // Admin Panel Logic (Professional Version)
    const adminPanel = document.getElementById('admin-panel');
    const closeAdminBtn = document.getElementById('close-admin');
    const logoutBtn = document.getElementById('logout-btn');
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');

    if (adminPanel) {
        // Toggle Tabs
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-tab');
                if (!targetId) return;

                // Update Menu Active State
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Show Content Tab
                adminTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.id === `tab-${targetId}`) {
                        tab.classList.add('active');
                    }
                });

                // On mobile, close sidebar after clicking
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-active');
                }
            });
        });

        // Close Admin (X)
        if (closeAdminBtn) {
            closeAdminBtn.addEventListener('click', () => {
                adminPanel.classList.remove('active');
            });
        }

        // Toggle Sidebar (Mobile)
        if (toggleSidebarBtn && sidebar) {
            toggleSidebarBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-active');
            });
        }

        // Logout Logic with Modal
        const logoutModal = document.getElementById('logout-modal');
        const confirmLogoutBtn = document.getElementById('confirm-logout');
        const cancelLogoutBtn = document.getElementById('cancel-logout');

        if (logoutBtn && logoutModal) {
            logoutBtn.addEventListener('click', () => {
                logoutModal.style.display = 'flex';
                setTimeout(() => {
                    logoutModal.style.opacity = '1';
                }, 10);
            });
        }

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', () => {
                // Close Modal
                logoutModal.style.opacity = '0';
                setTimeout(() => {
                    logoutModal.style.display = 'none';
                    // Close Admin Panel
                    adminPanel.classList.remove('active');
                    // Reset to dashboard for next login
                    if (sidebarItems[0]) sidebarItems[0].click();
                }, 300);
            });
        }

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', () => {
                logoutModal.style.opacity = '0';
                setTimeout(() => {
                    logoutModal.style.display = 'none';
                }, 300);
            });
        }

        // Notification Dropdown Logic
        const notifBtn = document.getElementById('notifications-btn');
        const notifDropdown = document.getElementById('notifications-dropdown');
        const notifBadge = document.getElementById('notif-badge');

        if (notifBtn && notifDropdown) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing immediately
                notifDropdown.classList.toggle('active');

                // Hide badge on open
                if (notifDropdown.classList.contains('active') && notifBadge) {
                    notifBadge.style.display = 'none';
                }
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!notifBtn.contains(e.target)) {
                    notifDropdown.classList.remove('active');
                }
            });
        }
    }
});
