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

    // Navbar Background & Style Change on Scroll + Progress Bar
    const navbar = document.querySelector('.navbar');
    const scrollBar = document.getElementById('scroll-bar');

    window.addEventListener('scroll', () => {
        // Navbar styling
        if (window.scrollY > 50) {
            navbar.classList.add('scroll-active');
        } else {
            navbar.classList.remove('scroll-active');
        }

        // Progress bar logic
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) {
            scrollBar.style.width = scrolled + "%";
        }
    });

    // Ensure the new Cotizar button works
    const navCotizarBtn = document.getElementById('navbar-cotizar');
    if (navCotizarBtn) {
        navCotizarBtn.addEventListener('click', (e) => {
            const contactModal = document.getElementById('contact-modal');
            if (contactModal) {
                contactModal.style.display = 'flex';
                setTimeout(() => contactModal.classList.add('show'), 10);
            }
        });
    }

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
    const navbarLoginBtn = document.getElementById('navbar-login');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');

    const closeModal = () => {
        if (loginModal) {
            loginModal.classList.remove('show');
            setTimeout(() => {
                loginModal.style.display = 'none';
            }, 300);
        }
    };

    const openLoginModal = (e) => {
        if (e) e.preventDefault();
        if (loginModal) {
            loginModal.style.display = 'flex';
            setTimeout(() => {
                loginModal.classList.add('show');
            }, 10);
        }
    };

    if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
    if (navbarLoginBtn) navbarLoginBtn.addEventListener('click', openLoginModal);

    if (loginModal && closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) closeModal();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            if (username) {
                closeModal();
                loginForm.reset();
                const adminPanel = document.getElementById('admin-panel');
                if (adminPanel) {
                    adminPanel.classList.add('active');
                }
            }
        });
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

        // Confirm All Changes Button Logic
        const confirmAllBtn = document.getElementById('confirm-all-changes');
        if (confirmAllBtn) {
            confirmAllBtn.addEventListener('click', () => {
                const originalText = confirmAllBtn.innerHTML;
                confirmAllBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>GUARDANDO...</span>';
                confirmAllBtn.style.pointerEvents = 'none';
                confirmAllBtn.style.opacity = '0.8';

                // Simulate saving delay
                setTimeout(() => {
                    confirmAllBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>¡GUARDADO!</span>';
                    confirmAllBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';

                    // Show a simple toast or alert if needed
                    // In this case, just reset after a bit
                    setTimeout(() => {
                        confirmAllBtn.innerHTML = originalText;
                        confirmAllBtn.style.pointerEvents = 'auto';
                        confirmAllBtn.style.opacity = '1';
                        confirmAllBtn.style.background = ''; // Back to CSS default
                    }, 2000);
                }, 1500);
            });
        }

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

    // Contact Modal Logic
    const contactModal = document.getElementById('contact-modal');
    const closeContactModalBtn = document.getElementById('close-contact-modal');
    const cotizarBtns = document.querySelectorAll('a[href="#cotizar"], .btn-cotizar');

    if (contactModal && closeContactModalBtn) {
        // Open Modal when clicking "Cotizar Ahora" buttons
        cotizarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.style.display = 'flex';
                setTimeout(() => {
                    contactModal.classList.add('show');
                }, 10);
            });
        });

        // Close Modal Function
        const closeContactModal = () => {
            contactModal.classList.remove('show');
            setTimeout(() => {
                contactModal.style.display = 'none';
            }, 300);
        };

        // Close on X click
        closeContactModalBtn.addEventListener('click', closeContactModal);

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }

    // Save Vendors Configuration
    const saveVendorsBtn = document.getElementById('save-vendors-btn');
    if (saveVendorsBtn) {
        saveVendorsBtn.addEventListener('click', () => {
            // Get all vendor data from form
            const vendorsData = {
                vendor1: {
                    name: document.getElementById('vendor1-name').value,
                    role: document.getElementById('vendor1-role').value,
                    phone: document.getElementById('vendor1-phone').value
                },
                vendor2: {
                    name: document.getElementById('vendor2-name').value,
                    role: document.getElementById('vendor2-role').value,
                    phone: document.getElementById('vendor2-phone').value
                },
                vendor3: {
                    name: document.getElementById('vendor3-name').value,
                    role: document.getElementById('vendor3-role').value,
                    phone: document.getElementById('vendor3-phone').value
                },
                vendor4: {
                    name: document.getElementById('vendor4-name').value,
                    role: document.getElementById('vendor4-role').value,
                    phone: document.getElementById('vendor4-phone').value
                },
                support: {
                    name: document.getElementById('support-name').value,
                    role: document.getElementById('support-role').value,
                    phone: document.getElementById('support-phone').value
                }
            };

            // Save to localStorage
            localStorage.setItem('robcab-vendors', JSON.stringify(vendorsData));

            // Update the contact modal immediately
            updateContactModal(vendorsData);

            // Show success message
            const originalText = saveVendorsBtn.innerHTML;
            saveVendorsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Guardado Exitosamente';
            saveVendorsBtn.style.background = '#10b981';
            setTimeout(() => {
                saveVendorsBtn.innerHTML = originalText;
                saveVendorsBtn.style.background = '';
            }, 2000);
        });
    }

    // Function to update contact modal with vendor data
    function updateContactModal(data) {
        const vendorCards = document.querySelectorAll('.vendor-card');

        // Update Vendor 1
        if (vendorCards[0]) {
            const v1 = data.vendor1;
            vendorCards[0].href = `https://wa.me/${v1.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[0].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v1.name)}&background=25D366&color=fff`;
            vendorCards[0].querySelector('.vendor-info h3').textContent = v1.name;
            vendorCards[0].querySelector('.vendor-role').textContent = v1.role;
            vendorCards[0].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v1.phone}`;
        }

        // Update Vendor 2
        if (vendorCards[1]) {
            const v2 = data.vendor2;
            vendorCards[1].href = `https://wa.me/${v2.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[1].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v2.name)}&background=25D366&color=fff`;
            vendorCards[1].querySelector('.vendor-info h3').textContent = v2.name;
            vendorCards[1].querySelector('.vendor-role').textContent = v2.role;
            vendorCards[1].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v2.phone}`;
        }

        // Update Vendor 3
        if (vendorCards[2]) {
            const v3 = data.vendor3;
            vendorCards[2].href = `https://wa.me/${v3.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[2].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v3.name)}&background=25D366&color=fff`;
            vendorCards[2].querySelector('.vendor-info h3').textContent = v3.name;
            vendorCards[2].querySelector('.vendor-role').textContent = v3.role;
            vendorCards[2].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v3.phone}`;
        }

        // Update Vendor 4
        if (vendorCards[3]) {
            const v4 = data.vendor4;
            vendorCards[3].href = `https://wa.me/${v4.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[3].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v4.name)}&background=25D366&color=fff`;
            vendorCards[3].querySelector('.vendor-info h3').textContent = v4.name;
            vendorCards[3].querySelector('.vendor-role').textContent = v4.role;
            vendorCards[3].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v4.phone}`;
        }

        // Update Support
        if (vendorCards[4]) {
            const support = data.support;
            vendorCards[4].href = `https://wa.me/${support.phone}?text=Hola,%20necesito%20ayuda%20con%20un%20reclamo%20o%20devolución`;
            vendorCards[4].querySelector('.vendor-info h3').textContent = support.name;
            vendorCards[4].querySelector('.vendor-role').textContent = support.role;
            vendorCards[4].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${support.phone}`;
        }
    }

    // Load saved vendors data on page load
    const savedVendors = localStorage.getItem('robcab-vendors');
    if (savedVendors) {
        const data = JSON.parse(savedVendors);

        // Update form fields
        if (document.getElementById('vendor1-name')) {
            document.getElementById('vendor1-name').value = data.vendor1.name;
            document.getElementById('vendor1-role').value = data.vendor1.role;
            document.getElementById('vendor1-phone').value = data.vendor1.phone;

            document.getElementById('vendor2-name').value = data.vendor2.name;
            document.getElementById('vendor2-role').value = data.vendor2.role;
            document.getElementById('vendor2-phone').value = data.vendor2.phone;

            document.getElementById('vendor3-name').value = data.vendor3.name;
            document.getElementById('vendor3-role').value = data.vendor3.role;
            document.getElementById('vendor3-phone').value = data.vendor3.phone;

            document.getElementById('vendor4-name').value = data.vendor4.name;
            document.getElementById('vendor4-role').value = data.vendor4.role;
            document.getElementById('vendor4-phone').value = data.vendor4.phone;

            document.getElementById('support-name').value = data.support.name;
            document.getElementById('support-role').value = data.support.role;
            document.getElementById('support-phone').value = data.support.phone;
        }

        // Update contact modal
        updateContactModal(data);
    } // Cierre de if (savedVendors)

    // Product Detail Modal Logic
    const productModal = document.getElementById('product-modal');
    const closeProductModalBtn = document.getElementById('close-product-modal');
    const productCards = document.querySelectorAll('.product-card');

    if (productModal && closeProductModalBtn) {
        productCards.forEach(card => {
            const btnDetail = card.querySelector('.open-product-detail');
            const btnQuickView = card.querySelector('.btn-view-details');

            const openDetail = (e) => {
                e.preventDefault();

                // Get data from card
                const title = card.querySelector('h3').textContent;
                const price = card.querySelector('.price').textContent;
                const imgSrc = card.querySelector('img').src;
                const description = card.getAttribute('data-description');
                const features = card.getAttribute('data-features') ? card.getAttribute('data-features').split('|') : [];
                const tag = card.getAttribute('data-tag') || 'ROBCAB 2026';

                // Populate Modal
                document.getElementById('modal-product-title').textContent = title;
                document.getElementById('modal-product-price').textContent = price;
                document.getElementById('modal-product-img').src = imgSrc;
                document.getElementById('modal-product-description').textContent = description;
                document.getElementById('modal-product-tag').textContent = tag;

                // Features list
                const featuresList = document.getElementById('modal-product-features');
                featuresList.innerHTML = '';
                features.forEach(feat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-check"></i> ${feat}`;
                    featuresList.appendChild(li);
                });

                // WhatsApp Link for this specific product
                const waNumber = "51987654321"; // Default or dynamic from vendors
                const waBtn = document.getElementById('modal-whatsapp-btn');
                waBtn.href = `https://wa.me/${waNumber}?text=Hola,%20me%20interesa%20más%20información%20sobre:%20${encodeURIComponent(title)}`;

                // Show Modal
                productModal.style.display = 'flex';
                setTimeout(() => {
                    productModal.classList.add('show');
                }, 10);
            };

            if (btnDetail) btnDetail.addEventListener('click', openDetail);
            if (btnQuickView) btnQuickView.addEventListener('click', openDetail);
        });

        // Close Modal
        const closeProductModal = () => {
            productModal.classList.remove('show');
            setTimeout(() => {
                productModal.style.display = 'none';
            }, 300);
        };

        closeProductModalBtn.addEventListener('click', closeProductModal);

        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeProductModal();
            }
        });
    }

    // Hero Products Parallax Effect
    const heroProducts = document.querySelector('.hero-products');
    const heroCards = document.querySelectorAll('.hero-product-card');

    if (heroProducts) {
        window.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;

            heroCards.forEach(card => {
                card.style.transition = 'transform 0.1s ease-out';
                card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(${yAxis}px)`;
            });
        });

        // Reset transform when mouse leaves Window or stays still
        window.addEventListener('mouseleave', () => {
            heroCards.forEach(card => {
                card.style.transition = 'transform 0.5s ease-out';
                card.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0deg)`;
            });
        });
    }
});
