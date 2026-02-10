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
    const catBtns = document.querySelectorAll('.cat-btn-drop, .menu-categorias a');

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

        // Re-select products as they might have been dynamically rendered
        const currentProducts = document.querySelectorAll('.p-card');
        currentProducts.forEach(p => {
            const productCat = (p.getAttribute('data-cat') || "").toLowerCase();
            const normalizedCat = (cat || "").toLowerCase();

            // Check for match
            if (normalizedCat === 'all' || normalizedCat === 'todo' || normalizedCat === 'ver todo' || productCat === normalizedCat) {
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

            // Show all current products
            const currentProducts = document.querySelectorAll('.p-grid .p-card');
            currentProducts.forEach(p => {
                p.style.display = 'block';
                setTimeout(() => p.style.opacity = '1', 10);
            });

            // Clear search
            if (searchInput) searchInput.value = '';
            if (searchDropdown) {
                searchDropdown.classList.remove('active');
                searchDropdown.innerHTML = '';
            }
        });
    }

    // ---------------------------------------------------------
    // 4. SEARCH & FILTER LOGIC
    // ---------------------------------------------------------
    const updateSearch = () => {
        const query = normalize(searchInput.value.trim());
        const currentProducts = document.querySelectorAll('.p-grid .p-card');

        if (query.length === 0) {
            currentProducts.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
            });
            searchDropdown.classList.remove('active');
            searchDropdown.innerHTML = '';
            return;
        }

        let matches = [];
        currentProducts.forEach(card => {
            const title = normalize(card.querySelector('h3').textContent);
            const desc = normalize(card.getAttribute('data-description') || "");

            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);

                // Collect for dropdown
                const rawTitle = card.querySelector('h3').textContent;
                const price = (card.querySelector('.price-neon') || card.querySelector('.price'))?.textContent || "";
                const imgSrc = card.querySelector('img').src;
                matches.push({ title: rawTitle, price, imgSrc, card });
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });

        if (matches.length > 0) {
            searchDropdown.innerHTML = '';
            matches.slice(0, 5).forEach(item => { // Limit to 5 results for cleaner UI
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="search-result-info">
                        <span class="search-result-title">${item.title}</span>
                        <span class="search-result-price">${item.price}</span>
                    </div>`;
                resultItem.addEventListener('click', () => {
                    // Scroll to card or open detail
                    item.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    item.card.style.boxShadow = "0 0 30px var(--neon-gold)";
                    setTimeout(() => item.card.style.boxShadow = "", 2000);

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
    // ---------------------------------------------------------
    // 5. NUEVO ASESOR FIJO + SISTEMA ADMIN (ROBCAB FINAL SYNC)
    // ---------------------------------------------------------

    // CONFIGURACIÓN SUPABASE
    const SUPABASE_URL = 'https://ernfxavvwhduvkutjdau.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_ZxOiNqLYGpUlcyVqUsVFqQ_27NTzG5C';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // BASE DE DATOS LOCAL (Cache/Fallback)
    // Estructura nueva: { hero: {title, sub, img}, asesores: [{nom, num}...], cats: "...", users: [...] }
    let db = JSON.parse(localStorage.getItem('robcab_final')) || {
        hero: { title: "ROBCAB 2026", sub: "Garantía Maestra", img: "" },
        asesores: [
            { nom: "Asesor Ventas 1", num: "51900000001" },
            { nom: "Asesor Ventas 2", num: "51900000002" },
            { nom: "Reclamos", num: "51900000006" }
        ],
        cats: "Tecnología y Audio: Tablets, Cámaras, Drones, Proyectores, Videojuegos, TV Box, Auriculares, Parlantes, Micrófonos, Cargadores, Tecnología General | Hogar y Cocina: Ventiladores, Licuadoras, Ollas, Freidoras, Cocina, Hogar, Organizadores, Luminaria & Sandalias | Motores y Herramientas: Carros, Motos, Herramientas, Hidrolavadoras | Oficina y Muebles: Sillas, Oficina | Moda y Accesorios: Relojes, Mochilas, Carteras, Morrales, Gorras, Pijamas, Perfumes | Salud y Belleza: Salud, Masajeadores, Belleza, Fitness | Niños y Varios: Peluches, Juguetes, Didácticos & Hidrogel, Mascotas, Regalos, Tomatodos & Kawai",
        users: [{ u: "admin", p: "1234", r: "Admin" }]
    };

    // MOSTRAR/OCULTAR LISTA DE WHATSAPP
    window.toggleLista = function () {
        const panel = document.getElementById('panel-numeros');
        if (panel) panel.classList.toggle('hidden-robcab');
    };

    // RENDERIZAR PRODUCTOS DINÁMICOS EN LA WEB
    function renderProductosWeb() {
        const grid = document.querySelector('.p-grid');
        if (!grid || !db.products || db.products.length === 0) return;

        const isCategoryPage = window.location.pathname.includes('category.html');
        let productsToShow = db.products;

        // Si es la página principal (Home), solo mostrar Packs
        if (!isCategoryPage) {
            productsToShow = db.products.filter(p => p.cat.toLowerCase().includes('pack'));

            // Opcional: Cambiar el título de la sección si existe
            const sectionHeader = document.querySelector('.products .section-header h2');
            if (sectionHeader) sectionHeader.textContent = "Packs en Oferta";
        }

        grid.innerHTML = productsToShow.map(p => `
            <div class="p-card" data-cat="${p.cat.toLowerCase()}" data-description="${p.desc}">
                <div class="p-content">
                    <div class="p-img-box">
                        <img src="${p.img}" alt="${p.name}">
                    </div>
                    <h3>${p.name}</h3>
                    <p class="price-neon">S/ ${parseFloat(p.price).toFixed(2)}</p>
                    <button class="btn-purchase open-product-detail">Ver Detalles</button>
                    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // RENDERIZAR NÚMEROS Y ELEMENTOS UI EN LA WEB
    function renderWeb() {
        const lista = document.getElementById('lista-asesores');
        const reclamosDiv = document.getElementById('contacto-reclamos');

        // Separar asesores de ventas vs reclamos basado en nombre
        const asesores = Array.isArray(db.asesores) ? db.asesores : [];
        let ventas = asesores.filter(a => !a.nom.toLowerCase().includes('reclamo'));
        let reclamosList = asesores.filter(a => a.nom.toLowerCase().includes('reclamo'));
        let reclamoItem = reclamosList.length > 0 ? reclamosList[0] : { num: "51900000006" };

        if (lista) {
            lista.innerHTML = ventas.map((a, i) =>
                `<a class="contacto-link" href="https://wa.me/${a.num}" target="_blank">🟢 ${a.nom}</a>`
            ).join('');
        }

        if (reclamosDiv) {
            reclamosDiv.innerHTML =
                `<a class="contacto-link" style="background:#ff4757; color:white; border:none;" href="https://wa.me/${reclamoItem.num}" target="_blank">⚠️ Reclamos y Consultas</a>`;
        }

        // Actualizar Elementos UI (Hero)
        const heroTitle = document.querySelector('.hero-box h2');
        const heroSub = document.querySelector('.hero-box p:not(.hero-subtitle)');
        const heroSection = document.getElementById('inicio');

        if (heroTitle && db.hero && db.hero.title) heroTitle.textContent = db.hero.title;
        if (heroSub && db.hero && db.hero.sub) heroSub.textContent = db.hero.sub;
        if (heroSection && db.hero && db.hero.img && db.hero.img.length > 5) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${db.hero.img}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundRepeat = 'no-repeat';
        }

        // Actualizar Categorías (Menú Dropdown con Subcategorías)
        const catMenus = document.querySelectorAll('.menu-categorias');
        if (catMenus.length > 0 && db.cats) {
            let catHtml = "";

            // Verificamos si las categorías vienen en formato de grupos (con '|')
            if (db.cats.includes('|') || db.cats.includes(':')) {
                const groups = db.cats.split('|').map(g => g.trim());
                groups.forEach(groupStr => {
                    const parts = groupStr.split(':');
                    const groupTitle = parts[0]?.trim() || "Otros";
                    const subs = parts[1] ? parts[1].split(',').map(s => s.trim()) : [];

                    catHtml += `
                        <details class="grupo" style="margin-bottom: 5px;">
                            <summary style="padding: 10px; cursor: pointer; color: var(--primary); font-weight: 700; list-style: none;">${groupTitle}</summary>
                            <ul style="padding-left: 20px;">
                                ${subs.map(s => `<li><a href="#" data-cat="${s.toLowerCase()}" style="color: #aaa; text-decoration: none; padding: 5px 0; display: block;">${s}</a></li>`).join('')}
                            </ul>
                        </details>
                    `;
                });
                catHtml += `<div style="padding:15px; border-top:1px solid #222;"><a href="#" data-cat="all" style="color: var(--primary); font-weight: bold; text-decoration:none;">VER TODO</a></div>`;
            } else {
                // Formato plano (solo comas)
                const categories = db.cats.split(',').map(c => c.trim()).filter(c => c !== "");
                catHtml = '<ul>' +
                    categories.map(cat => `<li><a href="#" data-cat="${cat.toLowerCase()}">${cat}</a></li>`).join('') +
                    '<li><a href="#" data-cat="all" style="color: var(--primary); font-weight: bold;">VER TODO</a></li>' +
                    '</ul>';
            }

            catMenus.forEach(menu => {
                menu.innerHTML = catHtml;
            });

            // Re-bind click events para todos los enlaces generados
            const newLinks = document.querySelectorAll('.menu-categorias a');
            newLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const cat = link.getAttribute('data-cat');
                    const isCategoryPage = window.location.pathname.includes('category.html');

                    if (isCategoryPage) {
                        applyFilter(cat);
                        document.querySelectorAll('.menu-categorias a').forEach(a => a.classList.remove('active'));
                        link.classList.add('active');
                        const dropdownList = document.getElementById('cat-dropdown-list');
                        if (dropdownList) dropdownList.classList.remove('active');
                    } else {
                        window.location.href = `category.html?cat=${cat}`;
                    }
                });
            });
        }

        // Renderizar productos dinámicos
        renderProductosWeb();
    }

    // Admin legacy cleanup
    window.toggleAdmin = function () { };

    // Carga inicial (Sincronizada con Nube)
    async function syncAndRender() {
        try {
            // 1. Cargar Configuración
            const { data: config } = await supabaseClient.from('site_config').select('data').eq('id', 'robcab_settings').single();
            if (config) {
                db.hero = config.data.hero;
                db.cats = config.data.cats;
                if (config.data.asesores) db.asesores = config.data.asesores;
            }

            // 2. Cargar Productos
            const { data: prods } = await supabaseClient.from('products').select('*');
            if (prods) {
                db.products = prods.map(p => ({
                    id: p.id,
                    name: p.name,
                    cat: p.cat,
                    price: p.price,
                    badge: p.badge,
                    desc: p.description,
                    img: p.img
                }));
            }

            // Actualizar LocalStorage para offline
            localStorage.setItem('robcab_final', JSON.stringify(db));
        } catch (e) {
            console.log("Modo Offline: Usando datos locales");
        }
        renderWeb();
    }

    syncAndRender();

    // ---------------------------------------------------------
    // Toast Notification Helper
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // 6. PRODUCT DETAIL MODAL (MODERNO)
    // ---------------------------------------------------------
    function openProductModal(data) {
        // Create modal overlay if not exists
        let modal = document.getElementById('product-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'product-detail-modal';
            modal.className = 'product-detail-overlay';
            modal.innerHTML = `
                <div class="product-detail-card glass">
                    <button class="modal-close-btn">&times;</button>
                    <div class="modal-grid">
                        <div class="modal-img-container">
                            <img id="m-detail-img" src="" alt="Producto">
                        </div>
                        <div class="modal-info-container">
                            <span class="m-detail-badge" id="m-detail-badge">NUEVO</span>
                            <h2 id="m-detail-name">Nombre del Producto</h2>
                            <p class="m-detail-price" id="m-detail-price">S/ 0.00</p>
                            <div class="m-detail-desc-box">
                                <h3>Descripción</h3>
                                <p id="m-detail-desc">Cargando descripción...</p>
                            </div>
                            <div class="m-detail-actions">
                                <a id="m-detail-wa" href="#" target="_blank" class="btn-wa">
                                    <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close events
            modal.querySelector('.modal-close-btn').onclick = () => modal.classList.remove('active');
            modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
        }

        // Fill data
        document.getElementById('m-detail-img').src = data.img;
        document.getElementById('m-detail-name').textContent = data.name;
        document.getElementById('m-detail-price').textContent = data.price;
        document.getElementById('m-detail-desc').textContent = data.desc;

        const badge = document.getElementById('m-detail-badge');
        if (data.badge) {
            badge.textContent = data.badge;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }

        // WhatsApp Link logic
        const waLink = document.getElementById('m-detail-wa');
        const firstNum = db.asesores && db.asesores.length > 0 ? db.asesores[0].num : "51900000001";
        const message = `Hola! Estoy interesado en el producto: *${data.name}* (Precio: ${data.price}). Me gustaría recibir más información.`;
        waLink.href = `https://wa.me/${firstNum}?text=${encodeURIComponent(message)}`;

        // Show
        modal.classList.add('active');
    }

    // Delegate click events to all products (including dynamic ones)
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.p-card');
        if (!card) return;

        // Si se hizo click en la imagen, el botón de detalles o el título
        if (e.target.closest('.p-img-box') || e.target.classList.contains('open-product-detail') || e.target.tagName === 'H3') {
            const data = {
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price-neon').textContent,
                img: card.querySelector('img').src,
                desc: card.getAttribute('data-description') || "Sin descripción disponible.",
                badge: card.querySelector('.badge')?.textContent || ""
            };
            openProductModal(data);
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
