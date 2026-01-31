document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('top-announcement')) {
        document.body.classList.add('has-announcement');
    }

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

    // Auth State
    let currentUser = null; // 'hector' or 'admin'

    // Load Admin Credentials from LocalStorage
    const getAdminCreds = () => {
        const saved = localStorage.getItem('robcab-admin-cfg');
        return saved ? JSON.parse(saved) : { user: 'admin', pass: 'admin123' };
    };

    // Sync admin label on load
    const initialCreds = getAdminCreds();
    const displayUserLabel = document.getElementById('display-admin-username');
    if (displayUserLabel) displayUserLabel.textContent = initialCreds.user.toUpperCase();

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value;
            const password = passwordInput.value;
            const adminCreds = getAdminCreds();

            // Superadmin Credentials Check
            if (username === 'Hector' && password === 'Cassiel') {
                currentUser = 'hector';
                showToast('Acceso Superadmin', 'Bienvenido, Héctor. Control total activado.', 'success');
                enterAdminPanel();
            }
            // Standard Admin Credentials Check
            else if (username === adminCreds.user && password === adminCreds.pass) {
                currentUser = 'admin';
                showToast('Acceso Administrador', `Bienvenido, ${username}.`, 'success');
                enterAdminPanel();
            }
            else {
                showToast('Error de Acceso', 'Usuario o contraseña incorrectos.', 'warning');
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        });
    }

    function enterAdminPanel() {
        closeModal();
        loginForm.reset();
        const adminPanelElement = document.getElementById('admin-panel');
        if (adminPanelElement) {
            adminPanelElement.classList.add('active');

            // Toggle Superadmin-only UI
            const superadminControls = document.getElementById('superadmin-only-controls');
            const standardView = document.getElementById('standard-admin-view');

            if (currentUser === 'hector') {
                if (superadminControls) superadminControls.style.display = 'block';
                // if (standardView) standardView.style.display = 'none';
            } else {
                if (superadminControls) superadminControls.style.display = 'none';
                // if (standardView) standardView.style.display = 'block';
            }

            // Sync current admin info to inputs if Hector
            const adminCreds = getAdminCreds();
            const manageUser = document.getElementById('manage-admin-user');
            const managePass = document.getElementById('manage-admin-pass');
            const displayUserLabel = document.getElementById('display-admin-username');

            if (manageUser) manageUser.value = adminCreds.user;
            if (managePass) managePass.value = adminCreds.pass;
            if (displayUserLabel) displayUserLabel.textContent = adminCreds.user.toUpperCase();
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

        // Hero Background Upload Logic
        const bgTrigger = document.getElementById('admin-hero-bg-trigger');
        const bgInput = document.getElementById('admin-hero-bg-input');
        const bgStatus = document.getElementById('admin-hero-bg-status');
        let selectedBgData = null;

        if (bgTrigger && bgInput) {
            bgTrigger.addEventListener('click', () => bgInput.click());

            bgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        selectedBgData = event.target.result;
                        bgStatus.textContent = `Imagen seleccionada: ${file.name}`;

                        // Immediate Preview
                        const heroSection = document.querySelector('.hero');
                        if (heroSection) {
                            heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${selectedBgData})`;
                            heroSection.style.backgroundSize = 'cover';
                            heroSection.style.backgroundPosition = 'center';
                        }

                        showToast('Imagen Lista', 'Pulsa "Confirmar Cambios" para aplicar permanentemente.', 'info');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Sync Function Creator
        const createSyncFunction = () => {
            return () => {
                // 1. Hero Content
                const heroSubtitle = document.getElementById('hero-subtitle-text');
                const heroTitle = document.getElementById('hero-main-title');
                const heroDesc = document.getElementById('hero-description-text');

                const adminHeroSubtitle = document.getElementById('admin-hero-subtitle');
                const adminHeroTitle = document.getElementById('admin-hero-title');
                const adminHeroDesc = document.getElementById('admin-hero-desc');

                if (heroSubtitle && adminHeroSubtitle) heroSubtitle.textContent = adminHeroSubtitle.value;
                if (heroTitle && adminHeroTitle) {
                    const titleVal = adminHeroTitle.value;
                    if (titleVal.includes('2026')) {
                        heroTitle.innerHTML = titleVal.replace('2026', '<span class="highlight">2026</span>');
                    } else {
                        heroTitle.textContent = titleVal;
                    }
                }
                if (heroDesc && adminHeroDesc) heroDesc.textContent = adminHeroDesc.value;

                // Background Sync
                if (selectedBgData) {
                    const heroSection = document.querySelector('.hero');
                    if (heroSection) {
                        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${selectedBgData})`;
                        heroSection.style.backgroundSize = 'cover';
                        heroSection.style.backgroundPosition = 'center';
                    }
                }

                // 2. Announcement Bar
                const annBar = document.getElementById('top-announcement');
                const annContent = document.getElementById('announcement-content');
                const adminAnnToggle = document.getElementById('admin-topbar-toggle');
                const adminAnnText = document.getElementById('admin-topbar-text');

                if (annBar && adminAnnToggle) {
                    if (adminAnnToggle.checked) {
                        annBar.style.display = 'block';
                        document.body.classList.add('has-announcement');
                    } else {
                        annBar.style.display = 'none';
                        document.body.classList.remove('has-announcement');
                    }
                }
                if (annContent && adminAnnText) {
                    annContent.innerHTML = `<i class="fa-solid fa-bolt"></i> ${adminAnnText.value}`;
                }

                // 3. Vendors Sync (Loops through 4 vendors)
                for (let i = 1; i <= 4; i++) {
                    const adminName = document.getElementById(`vendor${i}-name`);
                    const adminRole = document.getElementById(`vendor${i}-role`);
                    const adminPhone = document.getElementById(`vendor${i}-phone`);

                    const labelName = document.getElementById(`vendor-name-label-${i}`);
                    const labelRole = document.getElementById(`vendor-role-label-${i}`);
                    const labelPhone = document.getElementById(`vendor-phone-label-${i}`);
                    const linkCard = document.getElementById(`vendor-link-${i}`);
                    const imgElem = document.getElementById(`vendor-img-${i}`);

                    if (adminName && labelName) labelName.textContent = adminName.value;
                    if (adminRole && labelRole) labelRole.textContent = adminRole.value;
                    if (adminPhone && labelPhone) labelPhone.textContent = `+${adminPhone.value}`;

                    if (adminName && imgElem) {
                        imgElem.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName.value)}&background=25D366&color=fff`;
                    }

                    if (adminPhone && linkCard) {
                        linkCard.href = `https://wa.me/${adminPhone.value.replace(/\s+/g, '')}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
                    }
                }
            };
        };

        const syncChanges = createSyncFunction();

        // Confirm All Changes Button Logic
        const confirmAllBtn = document.getElementById('confirm-all-changes');
        if (confirmAllBtn) {
            confirmAllBtn.addEventListener('click', () => {
                const originalText = confirmAllBtn.innerHTML;
                confirmAllBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>GUARDANDO...</span>';
                confirmAllBtn.style.pointerEvents = 'none';
                confirmAllBtn.style.opacity = '0.8';

                setTimeout(() => {
                    syncChanges();
                    showToast('Éxito', 'Todos los cambios han sido aplicados correctamente.', 'success');
                    confirmAllBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>¡CAMBIOS APLICADOS!</span>';
                    confirmAllBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';

                    setTimeout(() => {
                        confirmAllBtn.innerHTML = originalText;
                        confirmAllBtn.style.pointerEvents = 'auto';
                        confirmAllBtn.style.opacity = '1';
                        confirmAllBtn.style.background = '';
                    }, 2000);
                }, 1000);
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
                logoutModal.style.opacity = '0';
                setTimeout(() => {
                    logoutModal.style.display = 'none';
                    adminPanel.classList.remove('active');
                    currentUser = null; // Clear session
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
                e.stopPropagation();
                notifDropdown.classList.toggle('active');
                if (notifDropdown.classList.contains('active') && notifBadge) {
                    notifBadge.style.display = 'none';
                }
            });

            document.addEventListener('click', (e) => {
                if (!notifBtn.contains(e.target)) {
                    notifDropdown.classList.remove('active');
                }
            });
        }

        // Link Generic Buttons to Toasts
        const addListener = (id, title, msg, type = 'info') => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => showToast(title, msg, type));
        };

        addListener('admin-view-all-activity', 'Actividad', 'Cargando historial completo...', 'info');
        addListener('admin-export-inventory', 'Exportar', 'Generando reporte en formato PDF...', 'success');
        addListener('admin-add-product', 'Inventario', 'Abriendo formulario de nuevo equipo...', 'info');
        addListener('admin-add-user', 'Seguridad', 'Configurando nuevo acceso de usuario...', 'info');
        addListener('admin-save-system-settings', 'Sistema', 'Ajustes globales actualizados.', 'success');

        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => showToast('Edición', 'Cargando datos del registro...', 'info'));
        });
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => showToast('Eliminar', '¿Estás seguro de borrar este registro?', 'warning'));
        });
    }

    // Contact Modal Logic
    const contactModal = document.getElementById('contact-modal');
    const closeContactModalBtn = document.getElementById('close-contact-modal');
    const cotizarBtns = document.querySelectorAll('a[href="#cotizar"], .btn-cotizar');

    if (contactModal && closeContactModalBtn) {
        cotizarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.style.display = 'flex';
                setTimeout(() => contactModal.classList.add('show'), 10);
            });
        });

        const closeContactModal = () => {
            contactModal.classList.remove('show');
            setTimeout(() => {
                contactModal.style.display = 'none';
            }, 300);
        };

        closeContactModalBtn.addEventListener('click', closeContactModal);
        window.addEventListener('click', (e) => {
            if (e.target === contactModal) closeContactModal();
        });
    }

    // Save Vendors Configuration
    const saveVendorsBtn = document.getElementById('save-vendors-btn');
    if (saveVendorsBtn) {
        saveVendorsBtn.addEventListener('click', () => {
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

            localStorage.setItem('robcab-vendors', JSON.stringify(vendorsData));
            updateContactModal(vendorsData);

            const originalText = saveVendorsBtn.innerHTML;
            saveVendorsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Guardado Exitosamente';
            saveVendorsBtn.style.background = '#10b981';
            setTimeout(() => {
                saveVendorsBtn.innerHTML = originalText;
                saveVendorsBtn.style.background = '';
            }, 2000);
        });
    }

    function updateContactModal(data) {
        const vendorCards = document.querySelectorAll('.vendor-card');
        if (vendorCards[0]) {
            const v1 = data.vendor1;
            vendorCards[0].href = `https://wa.me/${v1.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[0].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v1.name)}&background=25D366&color=fff`;
            vendorCards[0].querySelector('.vendor-info h3').textContent = v1.name;
            vendorCards[0].querySelector('.vendor-role').textContent = v1.role;
            vendorCards[0].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v1.phone}`;
        }
        if (vendorCards[1]) {
            const v2 = data.vendor2;
            vendorCards[1].href = `https://wa.me/${v2.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[1].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v2.name)}&background=25D366&color=fff`;
            vendorCards[1].querySelector('.vendor-info h3').textContent = v2.name;
            vendorCards[1].querySelector('.vendor-role').textContent = v2.role;
            vendorCards[1].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v2.phone}`;
        }
        if (vendorCards[2]) {
            const v3 = data.vendor3;
            vendorCards[2].href = `https://wa.me/${v3.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[2].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v3.name)}&background=25D366&color=fff`;
            vendorCards[2].querySelector('.vendor-info h3').textContent = v3.name;
            vendorCards[2].querySelector('.vendor-role').textContent = v3.role;
            vendorCards[2].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v3.phone}`;
        }
        if (vendorCards[3]) {
            const v4 = data.vendor4;
            vendorCards[3].href = `https://wa.me/${v4.phone}?text=Hola,%20me%20interesa%20información%20sobre%20cámaras%20de%20seguridad`;
            vendorCards[3].querySelector('.vendor-avatar img').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v4.name)}&background=25D366&color=fff`;
            vendorCards[3].querySelector('.vendor-info h3').textContent = v4.name;
            vendorCards[3].querySelector('.vendor-role').textContent = v4.role;
            vendorCards[3].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${v4.phone}`;
        }
        if (vendorCards[4]) {
            const support = data.support;
            vendorCards[4].href = `https://wa.me/${support.phone}?text=Hola,%20necesito%20ayuda%20con%20un%20reclamo%20o%20devolución`;
            vendorCards[4].querySelector('.vendor-info h3').textContent = support.name;
            vendorCards[4].querySelector('.vendor-role').textContent = support.role;
            vendorCards[4].querySelector('.vendor-phone').innerHTML = `<i class="fa-brands fa-whatsapp"></i> +${support.phone}`;
        }
    }

    const savedVendors = localStorage.getItem('robcab-vendors');
    if (savedVendors) {
        const data = JSON.parse(savedVendors);
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
        updateContactModal(data);
    }

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
                const title = card.querySelector('h3').textContent;
                const price = card.querySelector('.price').textContent;
                const imgSrc = card.querySelector('img').src;
                const description = card.getAttribute('data-description');
                const features = card.getAttribute('data-features') ? card.getAttribute('data-features').split('|') : [];
                const tag = card.getAttribute('data-tag') || 'ROBCAB 2026';

                document.getElementById('modal-product-title').textContent = title;
                document.getElementById('modal-product-price').textContent = price;
                document.getElementById('modal-product-img').src = imgSrc;
                document.getElementById('modal-product-description').textContent = description;
                document.getElementById('modal-product-tag').textContent = tag;

                const featuresList = document.getElementById('modal-product-features');
                featuresList.innerHTML = '';
                features.forEach(feat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class=\"fa-solid fa-check\"></i> ${feat}`;
                    featuresList.appendChild(li);
                });

                const waNumber = "51987654321";
                const waBtn = document.getElementById('modal-whatsapp-btn');
                waBtn.href = `https://wa.me/${waNumber}?text=Hola,%20me%20interesa%20más%20información%20sobre:%20${encodeURIComponent(title)}`;

                productModal.style.display = 'flex';
                setTimeout(() => productModal.classList.add('show'), 10);
            };

            if (btnDetail) btnDetail.addEventListener('click', openDetail);
            if (btnQuickView) btnQuickView.addEventListener('click', openDetail);
        });

        const closeProductModal = () => {
            productModal.classList.remove('show');
            setTimeout(() => { productModal.style.display = 'none'; }, 300);
        };
        closeProductModalBtn.addEventListener('click', closeProductModal);
        window.addEventListener('click', (e) => {
            if (e.target === productModal) closeProductModal();
        });
    }

    // Hero Products Parallax
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
        window.addEventListener('mouseleave', () => {
            heroCards.forEach(card => {
                card.style.transition = 'transform 0.5s ease-out';
                card.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0deg)`;
            });
        });
    }

    // Main Search & Suggestions Functionality
    const searchInput = document.getElementById('main-search-input');
    const searchBtn = document.getElementById('main-search-btn');
    const searchDropdown = document.getElementById('search-results-dropdown');
    const allProducts = document.querySelectorAll('.product-card');

    const updateSearch = () => {
        const query = searchInput.value.toLowerCase().trim();

        // 1. Filter visible products on page
        allProducts.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.getAttribute('data-description').toLowerCase();
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });

        // 2. Update Suggestions Dropdown
        if (query.length === 0) {
            searchDropdown.classList.remove('active');
            searchDropdown.innerHTML = '';
            return;
        }

        let matches = [];
        allProducts.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const imgSrc = card.querySelector('img').src;
            const desc = card.getAttribute('data-description') || "";

            if (title.toLowerCase().includes(query) || desc.toLowerCase().includes(query)) {
                matches.push({ title, price, imgSrc, card });
            }
        });

        if (matches.length > 0) {
            searchDropdown.innerHTML = '';
            matches.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="search-result-info">
                        <span class="search-result-title">${item.title}</span>
                        <span class="search-result-price">${item.price}</span>
                    </div>
                `;
                resultItem.addEventListener('click', () => {
                    const detailBtn = item.card.querySelector('.btn-view-details') || item.card.querySelector('.open-product-detail');
                    if (detailBtn) detailBtn.click();
                    searchDropdown.classList.remove('active');
                    searchInput.value = '';
                });
                searchDropdown.appendChild(resultItem);
            });
            searchDropdown.classList.add('active');
        } else {
            searchDropdown.innerHTML = '<div class="search-no-results">No se encontraron productos</div>';
            searchDropdown.classList.add('active');
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', updateSearch);
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', updateSearch);
    }

    // Managed Admin Credentials Save (Hector Only)
    const saveAdminCredsBtn = document.getElementById('save-admin-creds');
    if (saveAdminCredsBtn) {
        saveAdminCredsBtn.addEventListener('click', () => {
            const newUser = document.getElementById('manage-admin-user').value;
            const newPass = document.getElementById('manage-admin-pass').value;

            if (newUser && newPass) {
                localStorage.setItem('robcab-admin-cfg', JSON.stringify({ user: newUser, pass: newPass }));
                const displayUserLabel = document.getElementById('display-admin-username');
                if (displayUserLabel) displayUserLabel.textContent = newUser.toUpperCase();

                showToast('Éxito', 'Credenciales de Administrador actualizadas.', 'success');
            } else {
                showToast('Error', 'El usuario y contraseña no pueden estar vacíos.', 'warning');
            }
        });
    }

    // Toast System
    function showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i><div class="toast-content"><span class="toast-title">${title}</span><span class="toast-message">${message}</span></div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('active'), 10);
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }
});
