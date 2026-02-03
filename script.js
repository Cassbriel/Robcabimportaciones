document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. GLOBAL STATE & SELECTORS
    // ---------------------------------------------------------
    const searchInput = document.getElementById('main-search-input');
    const searchDropdown = document.getElementById('search-results-dropdown');
    const allProducts = document.querySelectorAll('.p-card');

    // Dropdown Selectors
    const dropdownBtn = document.getElementById('cat-dropdown-toggle');
    const dropdownList = document.getElementById('cat-dropdown-list');
    const catBtns = document.querySelectorAll('.cat-btn-drop');

    // ---------------------------------------------------------
    // 2. DROPDOWN INTERACTION
    // ---------------------------------------------------------
    if (dropdownBtn && dropdownList) {
        // Toggle Dropdown
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownList.classList.toggle('active');
            const icon = dropdownBtn.querySelector('i');
            if (dropdownList.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownList.contains(e.target)) {
                dropdownList.classList.remove('active');
                const icon = dropdownBtn.querySelector('i');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }

    // ---------------------------------------------------------
    // 3. CATEGORY FILTERING
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // 3. CATEGORY LOGIC (Navigation & Filtering)
    // ---------------------------------------------------------
    const normalize = (str) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Helper: Apply Filter
    const applyFilter = (cat) => {
        // Update Title if on category page
        const titleEl = document.getElementById('category-title');
        if (titleEl) {
            titleEl.textContent = (cat === 'all' || cat === 'todo' || cat === 'ver todo') ? 'Todos los Productos' : cat;
        }

        allProducts.forEach(p => {
            const productCat = p.getAttribute('data-cat');
            // Check for match
            if (cat === 'all' || cat === 'todo' || cat === 'ver todo' || productCat === cat) {
                p.style.display = 'block';
                setTimeout(() => p.style.opacity = '1', 10);
            } else {
                p.style.opacity = '0';
                setTimeout(() => p.style.display = 'none', 300);
            }
        });
    }

    // Check if we are on the category page
    const isCategoryPage = window.location.pathname.includes('category.html');

    // Initial Load for Category Page
    if (isCategoryPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const initialCat = urlParams.get('cat');
        if (initialCat) {
            applyFilter(initialCat);
            // Highlight button
            catBtns.forEach(b => {
                let c = b.getAttribute('data-cat') || normalize(b.textContent.trim());
                if (c === initialCat) b.classList.add('active');
            });
        }
    }

    // Event Listeners for Buttons
    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let cat = btn.getAttribute('data-cat');
            if (!cat) {
                cat = normalize(btn.textContent.trim());
            }

            if (isCategoryPage) {
                // If already on page, just filter
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilter(cat);

                // Update URL without reload
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('cat', cat);
                window.history.pushState({}, '', newUrl);

                // Close dropdown
                if (dropdownList) {
                    dropdownList.classList.remove('active');
                    /* Reset icon if needed */
                }

            } else {
                // If on Home (index.html), redirect
                window.location.href = `category.html?cat=${cat}`;
            }
        });
    });

    // Make Logo reset categories
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            catBtns.forEach(b => b.classList.remove('active'));
            // Reset Dropdown selection visual if needed

            // Show all products
            allProducts.forEach(p => {
                p.style.display = 'block';
                setTimeout(() => p.style.opacity = '1', 10);
            });
        });
    }

    // ---------------------------------------------------------
    // 4. SEARCH & FILTER LOGIC
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

    // ---------------------------------------------------------
    // 5. UTILS & MODALS
    // ---------------------------------------------------------

    // Handing Asesor / Contact Modal
    const asesorBtn = document.getElementById('asesor-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeContactModal = document.getElementById('close-contact-modal');

    if (asesorBtn && contactModal) {
        asesorBtn.addEventListener('click', () => {
            contactModal.style.display = 'flex';
            setTimeout(() => contactModal.classList.add('active'), 10);
        });
    }

    if (closeContactModal && contactModal) {
        closeContactModal.addEventListener('click', () => {
            contactModal.classList.remove('active');
            setTimeout(() => contactModal.style.display = 'none', 300);
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (contactModal && e.target === contactModal) {
            contactModal.classList.remove('active');
            setTimeout(() => contactModal.style.display = 'none', 300);
        }
    });

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
});
