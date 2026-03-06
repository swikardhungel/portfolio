/* ═══════════════════════════════════════════════════
   Portfolio — Main JavaScript (Restored & Refined)
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Configuration ────────────────────────────────── */
    const BASE_API_URL = 'http://localhost:5000/api';

    /* ── DOM References ──────────────────────────────── */
    const loader = document.getElementById('loader');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const siteHeader = document.getElementById('site-header');
    const typedText = document.getElementById('typed-text');
    const projectsGrid = document.getElementById('projects-grid');
    const contactForm = document.getElementById('contact-form');
    const particlesCanvas = document.getElementById('particles-bg');

    // Modals
    const researchModal = document.getElementById('research-modal');
    const collabModal = document.getElementById('collab-modal');
    const modalBody = document.getElementById('modal-body');
    const interestedBtn = document.getElementById('interested-btn');
    const collabForm = document.getElementById('collab-form');

    const allModals = [researchModal, collabModal];

    /* ═══════════════════════════════════════════════════
       1. INITIALIZATION & LOADER
       ═══════════════════════════════════════════════════ */
    window.addEventListener('load', () => {
        if (window.AOS) window.AOS.init({ duration: 800, once: true });
        setTimeout(() => { loader.classList.add('hidden'); }, 800);
        initParticles();
    });

    /* ═══════════════════════════════════════════════════
       2. SUBTLE PARTICLE BACKGROUND
       ═══════════════════════════════════════════════════ */
    function initParticles() {
        if (!particlesCanvas) return;
        const ctx = particlesCanvas.getContext('2d');
        let dots = [];
        let w, h;

        function resize() {
            w = particlesCanvas.width = window.innerWidth;
            h = particlesCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < 40; i++) {
            dots.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: Math.random() * 0.4 - 0.2,
                vy: Math.random() * 0.4 - 0.2,
                r: Math.random() * 2 + 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
            dots.forEach(d => {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0 || d.x > w) d.vx *= -1;
                if (d.y < 0 || d.y > h) d.vy *= -1;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ═══════════════════════════════════════════════════
       3. NAVIGATION & THEME
       ═══════════════════════════════════════════════════ */
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    window.addEventListener('scroll', () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ═══════════════════════════════════════════════════
       4. TYPING ANIMATION
       ═══════════════════════════════════════════════════ */
    const roles = ['Backend Developer (Django)', 'Data Science Learner'];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        if (!typedText) return;
        const full = roles[roleIdx];
        typedText.textContent = isDeleting ? full.substring(0, charIdx - 1) : full.substring(0, charIdx + 1);
        charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === full.length) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 500; }
        setTimeout(type, speed);
    }
    type();

    /* ═══════════════════════════════════════════════════
       5. MODALS & COLLABORATION
       ═══════════════════════════════════════════════════ */
    const researchData = {
        'physics': '<h3>Physics + Programming</h3><p>Detailed exploration of computational physics simulations. Focus on Newtonian mechanics and electromagnetic field solvers using Python.</p>',
        'math': '<h3>Mathematics + Programming</h3><p>Interactive tools for fractals and differential equations. Visualizing complex systems through iterative functions.</p>',
        'astronomy': '<h3>Astrophysics Visualisation</h3><p>Stellar mapping and exoplanet transit analysis using Astropy and dataset from Gaia mission.</p>',
        'simulations': '<h3>Scientific Simulations</h3><p>Environmental modeling and fluid dynamics research using high-performance Python libraries.</p>'
    };

    function closeAllModals() {
        allModals.forEach(m => { if (m) m.classList.add('hidden'); });
        document.body.style.overflow = '';
    }

    function openModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    // Modal Events
    document.querySelectorAll('.transition-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            modalBody.innerHTML = researchData[id];
            document.getElementById('collab-project').value = card.querySelector('h3').textContent;
            openModal(researchModal);
        });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeAllModals();
    });

    // ESC Key closure
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    interestedBtn.addEventListener('click', () => {
        researchModal.classList.add('hidden');
        openModal(collabModal);
    });

    collabForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(collabForm));
        try {
            const res = await fetch(`${BASE_API_URL}/collaboration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                document.getElementById('collab-status').textContent = 'Request Sent!';
                setTimeout(() => { closeAllModals(); collabForm.reset(); }, 2000);
            }
        } catch (err) { console.error(err); }
    });

    /* ═══════════════════════════════════════════════════
       6. DATA FETCHING
       ═══════════════════════════════════════════════════ */
    async function loadContent() {
        try {
            const pRes = await fetch(`${BASE_API_URL}/projects`);
            const projects = await pRes.json();

            projectsGrid.innerHTML = projects.map(p => `
                <article class="project-card glass-card">
                    <div class="project-thumb">${p.image ? `<img src="${p.image}">` : '📁'}</div>
                    <div class="project-body">
                        <h3>${p.title}</h3>
                        <p>${p.description}</p>
                        <div class="project-tags">${p.technologies.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    </div>
                </article>
            `).join('');

        } catch (e) { console.error(e); }
    }
    loadContent();

    // Contact form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(contactForm));
        try {
            const res = await fetch(`${BASE_API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) { contactForm.reset(); document.getElementById('form-status').textContent = 'Message Sent!'; }
        } catch (e) { console.error(e); }
    });

})();
