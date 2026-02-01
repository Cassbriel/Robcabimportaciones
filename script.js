document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. GLOBAL STATE & SELECTORS
    // ---------------------------------------------------------
    let currentUser = null; // 'hector' or 'admin'
    const navbar = document.querySelector('.navbar');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const searchInput = document.getElementById('main-search-input');
    const searchDropdown = document.getElementById('search-results-dropdown');
    const allProducts = document.querySelectorAll('.p-card');

    // ---------------------------------------------------------
    // 2. AUTH & LOGIN LOGIC
    // ---------------------------------------------------------
    const getAdminCreds = () => {
        const saved = localStorage.getItem('robcab-admin-cfg');
        const defaultCreds = {
            user: 'admin',
            pass: 'admin123',
            permissions: ['inventory', 'orders']
        };
        if (!saved) return defaultCreds;
        try {
            const parsed = JSON.parse(saved);
            if (!parsed.permissions) parsed.permissions = defaultCreds.permissions;
            return parsed;
        } catch (e) { return defaultCreds; }
    };

    const syncAdminDisplay = () => {
        const creds = getAdminCreds();
        const displayUserLabel = document.getElementById('display-admin-username');
        if (displayUserLabel) displayUserLabel.textContent = creds.user.toUpperCase();

        const tagsContainer = document.getElementById('admin-permissions-display');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            const allPerms = [
                { id: 'inventory', label: 'Inventario' },
                { id: 'orders', label: 'Pedidos' },
                { id: 'content', label: 'Contenido' },
                { id: 'users', label: 'Usuarios' }
            ];
            allPerms.forEach(p => {
                const span = document.createElement('span');
                const hasPerm = creds.permissions.includes(p.id);
                if (hasPerm) {
                    span.innerHTML = `<i class="fa-solid fa-check"></i> ${p.label}`;
                } else {
                    span.className = 'disabled';
                    span.innerHTML = `<i class="fa-solid fa-xmark"></i> ${p.label}`;
                }
                tagsContainer.appendChild(span);
            });
        }
    };

    const openLoginModal = (e) => {
        if (e) e.preventDefault();
        if (loginModal) {
            loginModal.style.display = 'flex';
            setTimeout(() => loginModal.classList.add('active'), 10);
        }
    };

    const closeModal = () => {
        if (loginModal) {
            loginModal.classList.remove('active');
            setTimeout(() => loginModal.style.display = 'none', 300);
        }
    };

    const enterAdminPanel = () => {
        closeModal();
        if (loginForm) loginForm.reset();
        if (adminPanel) {
            adminPanel.classList.add('active');
            const adminCreds = getAdminCreds();
            const superadminControls = document.getElementById('superadmin-only-controls');
            const hectorCard = document.getElementById('hector-superadmin-card');
            const sidebarTabs = document.querySelectorAll('.sidebar-nav li');

            if (currentUser === 'hector') {
                if (superadminControls) superadminControls.style.display = 'block';
                if (hectorCard) hectorCard.style.display = 'block';
                sidebarTabs.forEach(t => t.style.display = 'flex');
            } else {
                if (superadminControls) superadminControls.style.display = 'none';
                if (hectorCard) hectorCard.style.display = 'none';
                sidebarTabs.forEach(tab => {
                    const tabId = tab.getAttribute('data-tab');
                    if (tabId === 'settings') tab.style.display = 'none';
                    else if (!adminCreds.permissions.includes(tabId) && tabId !== 'dashboard') tab.style.display = 'none';
                    else tab.style.display = 'flex';
                });
            }
            syncAdminDisplay();
        }
    };

    // Event Listeners for Login
    const navbarLoginBtn = document.getElementById('navbar-login');
    if (navbarLoginBtn) navbarLoginBtn.addEventListener('click', openLoginModal);

    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            const adminCreds = getAdminCreds();

            if (username === 'Hector' && password === 'Cassiel') {
                currentUser = 'hector';
                showToast('Acceso Superadmin', 'Bienvenido, Héctor. Control total activado.', 'success');
                enterAdminPanel();
            } else if (username === adminCreds.user && password === adminCreds.pass) {
                currentUser = 'admin';
                showToast('Acceso Administrador', `Bienvenido, ${username}.`, 'success');
                enterAdminPanel();
            } else {
                showToast('Error de Acceso', 'Usuario o contraseña incorrectos.', 'warning');
            }
        });
    }

    // ---------------------------------------------------------
    // 3. SEARCH & FILTER LOGIC
    // ---------------------------------------------------------
    const updateSearch = () => {
        const query = searchInput.value.toLowerCase().trim();

        allProducts.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.getAttribute('data-description')?.toLowerCase() || "";
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });

        if (query.length === 0) {
            searchDropdown.classList.remove('active');
            searchDropdown.innerHTML = '';
            return;
        }

        let matches = [];
        allProducts.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const price = (card.querySelector('.price-neon') || card.querySelector('.price')).textContent;
            const imgSrc = card.querySelector('img').src;
            if (title.toLowerCase().includes(query)) {
                matches.push({ title, price, imgSrc, card });
            }
        });

        if (matches.length > 0) {
            searchDropdown.innerHTML = '';
            matches.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `<img src="${item.imgSrc}" alt="${item.title}">
                    <div class="search-result-info">
                        <span class="search-result-title">${item.title}</span>
                        <span class="search-result-price">${item.price}</span>
                    </div>`;
                resultItem.addEventListener('click', () => {
                    const detailBtn = item.card.querySelector('.open-product-detail');
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

    // Category Filtering
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-cat');
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            allProducts.forEach(p => {
                const productCat = p.getAttribute('data-cat');
                if (cat === 'all' || productCat === cat) {
                    p.style.display = 'block';
                    setTimeout(() => p.style.opacity = '1', 10);
                } else {
                    p.style.opacity = '0';
                    setTimeout(() => p.style.display = 'none', 300);
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 4. ADMIN PANEL INTERACTIVITY
    // ---------------------------------------------------------
    if (adminPanel) {
        const sidebarItems = document.querySelectorAll('.sidebar-nav li');
        const adminTabs = document.querySelectorAll('.admin-tab');
        const closeAdminBtn = document.getElementById('close-admin');

        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-tab');
                if (!targetId) return;

                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                adminTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.id === `tab-${targetId}`) tab.classList.add('active');
                });
            });
        });

        if (closeAdminBtn) {
            closeAdminBtn.addEventListener('click', () => {
                adminPanel.classList.remove('active');
            });
        }
    }

    // ---------------------------------------------------------
    // 5. UTILS & TOASTS
    // ---------------------------------------------------------
    function showToast(title, message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
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

    // Initialize display
    syncAdminDisplay();
});
