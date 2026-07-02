(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = () => reducedMotionQuery.matches;
    const revealSelector = '.btn-primary, .btn-secondary, .stat-badge, .social-pill, .faq-item, .bubble-card, .project-card, .future-card, .glass-card, .stack-bubble, .cert-card, .tab-btn, .version-tab, .active-goal-card, .interest-card, .featured-card, .cta-card, .hobby-card, .spec-item, .tool-compact, .filter-btn, .hire-section';

    let particlesLoaded = false;
    let particlesActive = false;
    let revealObserver = null;
    let lastScrollTop = 0;
    let scrollQueued = false;

    function applyTheme(theme) {
        document.documentElement.classList.remove('dark', 'light');
        if (theme === 'dark' || theme === 'light') {
            document.documentElement.classList.add(theme);
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        }
    }

    function initTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || (mediaQuery.matches ? 'dark' : 'light');
        applyTheme(initialTheme);

        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', nextTheme);
            applyTheme(nextTheme);
        });

        const syncSystemTheme = (event) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(event.matches ? 'dark' : 'light');
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', syncSystemTheme);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(syncSystemTheme);
        }
    }

    function initParticlesToggle() {
        const toggle = document.getElementById('particles-toggle');
        if (!toggle) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches || navigator.maxTouchPoints > 0;
        const savedPreference = localStorage.getItem('particles') === 'true';

        toggle.setAttribute('aria-pressed', savedPreference ? 'true' : 'false');

        if (savedPreference) {
            enableParticles(toggle, isMobile);
        }

        toggle.addEventListener('click', () => {
            if (particlesActive) {
                disableParticles(toggle);
            } else {
                enableParticles(toggle, isMobile);
            }
        });
    }

    function enableParticles(toggleBtn, isMobile) {
        const particleLayer = document.getElementById('tsparticles');
        if (!toggleBtn || !particleLayer) return;

        document.body.classList.add('particles-enabled');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-pressed', 'true');
        localStorage.setItem('particles', 'true');
        particlesActive = true;

        if (!particlesLoaded) {
            loadTsParticles(isMobile);
            return;
        }

        initParticlesEffect(isMobile);
    }

    function disableParticles(toggleBtn) {
        document.body.classList.remove('particles-enabled');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-pressed', 'false');
        localStorage.setItem('particles', 'false');
        particlesActive = false;

        if (window.tsParticles) {
            try {
                window.tsParticles.domItem(0)?.destroy();
            } catch (error) {
                // Ignore teardown errors when the animation is already gone.
            }
        }
    }

    function loadTsParticles(isMobile) {
        if (document.querySelector('script[data-tsparticles-loader]')) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js';
        script.async = true;
        script.dataset.tsparticlesLoader = 'true';
        script.onload = () => {
            particlesLoaded = true;
            initParticlesEffect(isMobile);
        };
        document.head.appendChild(script);
    }

    function initParticlesEffect(isMobile) {
        if (!window.tsParticles || !document.getElementById('tsparticles')) return;

        window.tsParticles.load('tsparticles', {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: !isMobile,
                        mode: 'repulse'
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 140,
                        duration: 9,
                        factor: 10,
                        speed: 0.5,
                        easing: 'ease-out-sine'
                    }
                }
            },
            particles: {
                color: { value: ['#6DD6FF', '#8B9CF6', '#A7F3D0', '#E2E8F0'] },
                links: { enable: false },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: { default: 'out' },
                    random: true,
                    speed: { min: 0.12, max: 0.42 },
                    straight: false
                },
                number: { density: { enable: true, area: 800 }, value: isMobile ? 16 : 28 },
                opacity: {
                    value: { min: 0.18, max: 0.5 },
                    animation: { enable: true, speed: 0.35, minimumValue: 0.18, sync: false }
                },
                shape: {
                    type: 'image',
                    options: {
                        image: {
                            src: 'estrelas.svg',
                            width: 32,
                            height: 32,
                            replaceColor: false
                        }
                    }
                },
                size: {
                    value: { min: 8, max: 14 },
                    animation: { enable: true, speed: 1.2, minimumValue: 8, sync: false }
                },
                rotate: {
                    value: { min: 0, max: 360 },
                    direction: 'random',
                    animation: { enable: true, speed: 2.5, sync: false }
                }
            },
            detectRetina: true
        });
    }

    function ensureRevealObserver() {
        if (revealObserver || !('IntersectionObserver' in window)) {
            return revealObserver;
        }

        revealObserver = new IntersectionObserver((entries, observer) => {
            let delayCounter = 0;

            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                if (!element.style.getPropertyValue('--pop-delay')) {
                    element.style.setProperty('--pop-delay', `${delayCounter * 0.08}s`);
                }

                element.classList.add('pop-visible');
                observer.unobserve(element);
                delayCounter += 1;
            });
        }, {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.15
        });

        return revealObserver;
    }

    function revealTargets(targets) {
        if (!targets || targets.length === 0) return;

        if (isReducedMotion() || !('IntersectionObserver' in window)) {
            targets.forEach((element) => element.classList.add('pop-visible'));
            return;
        }

        const observer = ensureRevealObserver();
        targets.forEach((element) => {
            if (element && !element.classList.contains('pop-visible')) {
                observer.observe(element);
            }
        });
    }

    function initSharedReveal() {
        revealTargets(Array.from(document.querySelectorAll(revealSelector)));
    }

    function animateFaqContent(details, shouldOpen) {
        const content = details.querySelector('.faq-content');
        if (!content) return;

        if (isReducedMotion()) {
            details.open = shouldOpen;
            return;
        }

        if (shouldOpen) {
            details.setAttribute('open', '');
            content.style.overflow = 'hidden';
            content.style.height = '0px';
            content.style.paddingTop = '0px';
            content.style.paddingBottom = '0px';
            content.offsetHeight;

            const targetHeight = content.scrollHeight;
            content.style.height = `${targetHeight}px`;
            content.style.paddingTop = '';
            content.style.paddingBottom = '';

            window.setTimeout(() => {
                content.style.height = '';
                content.style.overflow = '';
            }, 300);
            return;
        }

        content.style.overflow = 'hidden';
        content.style.height = `${content.scrollHeight}px`;
        content.offsetHeight;
        content.style.height = '0px';
        content.style.paddingTop = '0px';
        content.style.paddingBottom = '0px';

        window.setTimeout(() => {
            details.removeAttribute('open');
            content.style.height = '';
            content.style.paddingTop = '';
            content.style.paddingBottom = '';
            content.style.overflow = '';
        }, 300);
    }

    function initFaqAccordion() {
        document.querySelectorAll('details.faq-item').forEach((details) => {
            const summary = details.querySelector('summary');
            if (!summary) return;

            summary.addEventListener('click', (event) => {
                event.preventDefault();
                animateFaqContent(details, !details.open);
            });
        });
    }

    function initCvPopup() {
        const cvButton = document.getElementById('download-cv-btn');
        const cvPopup = document.getElementById('cv-popup');
        const closeButton = document.getElementById('close-cv-popup');

        if (!cvButton || !cvPopup || !closeButton) return;

        cvButton.addEventListener('click', (event) => {
            event.preventDefault();
            cvPopup.classList.remove('hidden');
        });

        closeButton.addEventListener('click', () => {
            cvPopup.classList.add('hidden');
        });

        cvPopup.addEventListener('click', (event) => {
            if (event.target === cvPopup) {
                cvPopup.classList.add('hidden');
            }
        });
    }

    function initFolderTabs() {
        const folderTabs = Array.from(document.querySelectorAll('.folder-tab'));
        if (!folderTabs.length) return;

        folderTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;

                const panelId = tab.dataset.panel;
                const nextPanel = document.getElementById(panelId);
                if (!nextPanel) return;

                folderTabs.forEach((button) => button.classList.remove('active'));
                document.querySelectorAll('.folder-panel').forEach((panel) => panel.classList.remove('active'));

                tab.classList.add('active');
                nextPanel.classList.add('active');
                revealTargets(Array.from(nextPanel.querySelectorAll('.cert-card, .active-goal-card, .glass-card')));
            });
        });
    }

    function initLightbox() {
        const lightbox = document.getElementById('cert-lightbox');
        const image = document.getElementById('lb-img');
        const title = document.getElementById('lb-title');
        const description = document.getElementById('lb-desc');

        if (!lightbox || !image || !title || !description) return;

        const closeLightbox = () => {
            lightbox.classList.remove('open');
        };

        window.openLightbox = (src, certTitle, certDescription) => {
            image.src = src;
            title.textContent = certTitle;
            description.textContent = certDescription;
            lightbox.classList.add('open');
        };

        window.closeLightbox = closeLightbox;

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.floating-header');
        if (!header) return;

        const updateHeaderVisibility = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }

            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
            scrollQueued = false;
        };

        window.addEventListener('scroll', () => {
            if (scrollQueued) return;
            scrollQueued = true;
            window.requestAnimationFrame(updateHeaderVisibility);
        }, { passive: true });
    }

    function initDevelopmentPopup() {
        const devPopup = document.getElementById('dev-popup');
        const closeButton = document.getElementById('close-popup');

        if (!devPopup || !closeButton) return;

        window.setTimeout(() => {
            const loadsRaw = localStorage.getItem('dev_popup_loads');
            const loads = loadsRaw ? Number.parseInt(loadsRaw, 10) : 0;

            if (!loads || loads >= 3) {
                devPopup.classList.remove('hidden');
                localStorage.setItem('dev_popup_loads', '1');
                return;
            }

            localStorage.setItem('dev_popup_loads', String(loads + 1));
        }, 100);

        closeButton.addEventListener('click', () => {
            devPopup.classList.add('hidden');
        });

        devPopup.addEventListener('click', (event) => {
            if (event.target === devPopup) {
                devPopup.classList.add('hidden');
            }
        });
    }

    // --- Project Filters ---
    function initProjectFilters() {
        const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
        const projectCards = Array.from(document.querySelectorAll('.project-card[data-category]'));

        if (!filterButtons.length || !projectCards.length) return;

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Update active button
                filterButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter cards
                projectCards.forEach((card) => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('filter-hidden');
                    } else {
                        card.classList.add('filter-hidden');
                    }
                });
            });
        });
    }

    // --- GitHub Stats ---
    function pluralize(value, singular, plural) {
        return `${value} ${value === 1 ? singular : plural}`;
    }

    function timeAgo(date) {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `há ${pluralize(interval, 'ano', 'anos')}`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `há ${pluralize(interval, 'mês', 'meses')}`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `há ${pluralize(interval, 'dia', 'dias')}`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `há ${pluralize(interval, 'hora', 'horas')}`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `há ${pluralize(interval, 'minuto', 'minutos')}`;
        return 'agora mesmo';
    }

    function renderStats(container, data) {
        const starLabel = data.stars === 1 ? 'Star' : 'Stars';
        const commitLabel = data.commits === 1 ? 'Commit' : 'Commits';
        const timeDisplay = data.lastDate ? timeAgo(data.lastDate) : 'Desconhecido';

        container.innerHTML = `
            <div class="stat-item" title="Estrelas no GitHub">
                <span>⭐</span> <strong>${data.stars}</strong> ${starLabel}
            </div>
            <div class="stat-item" title="Total de Commits">
                <span>🔄</span> <strong>${data.commits}</strong> ${commitLabel}
            </div>
            <div class="stat-item" title="Autor do último commit">
                <span>👤</span> ${data.lastAuthor}
            </div>
            <div class="stat-item" title="Data do último commit">
                <span>📅</span> ${timeDisplay}
            </div>
        `;
    }

    async function fetchGitHubStats() {
        const containers = Array.from(document.querySelectorAll('.github-stats-container'));
        if (!containers.length) return;

        const cacheTime = 60 * 60 * 1000;

        await Promise.all(containers.map(async (container) => {
            const repo = container.getAttribute('data-repo');
            if (!repo) return;

            container.innerHTML = `
                <div class="stat-skeleton skeleton-sm"></div>
                <div class="stat-skeleton skeleton-md"></div>
                <div class="stat-skeleton skeleton-lg"></div>
            `;

            try {
                const cacheKey = `gh_stats_${repo}`;
                const cachedValue = localStorage.getItem(cacheKey);

                if (cachedValue) {
                    const { data, timestamp } = JSON.parse(cachedValue);
                    if (Date.now() - timestamp < cacheTime) {
                        renderStats(container, data);
                        return;
                    }
                }

                const [repoResponse, commitsResponse] = await Promise.all([
                    fetch(`https://api.github.com/repos/${repo}`),
                    fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`)
                ]);

                if (!repoResponse.ok || !commitsResponse.ok) {
                    throw new Error('GitHub API error');
                }

                const repoData = await repoResponse.json();
                const commitsData = await commitsResponse.json();

                let totalCommits = commitsData.length;
                const linkHeader = commitsResponse.headers.get('Link');
                if (linkHeader) {
                    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                    totalCommits = match ? Number.parseInt(match[1], 10) : totalCommits;
                }

                const stats = {
                    stars: repoData.stargazers_count ?? 0,
                    commits: totalCommits,
                    lastDate: commitsData[0]?.commit?.author?.date || null,
                    lastAuthor: commitsData[0]?.author?.login || commitsData[0]?.commit?.author?.name || '?'
                };

                localStorage.setItem(cacheKey, JSON.stringify({ data: stats, timestamp: Date.now() }));
                renderStats(container, stats);
            } catch (error) {
                console.error(`Erro GitHub (${repo}):`, error);
                container.innerHTML = '<div class="stat-error">⚠️ Erro ao carregar métricas do GitHub.</div>';
            }
        }));
    }

    // --- Page-specific initialization ---
    function initHirePage() {
        initCvPopup();
        initFaqAccordion();
        initFolderTabs();
        initLightbox();
    }

    function initProjectsPage() {
        initProjectFilters();
        fetchGitHubStats();
        initProjectCarousels();
    }

    function initProjectCarousels() {
        document.querySelectorAll('.project-carousel').forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            if (slides.length <= 1) {
                const controls = carousel.querySelectorAll('.carousel-control-btn');
                const indicators = carousel.querySelector('.carousel-indicators');
                controls.forEach(c => c.style.display = 'none');
                if (indicators) indicators.style.display = 'none';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initParticlesToggle();
        initHeaderScroll();
        initDevelopmentPopup();
        initSharedReveal();

        // All features initialize regardless of page — each gracefully exits if elements don't exist
        initHirePage();
        initProjectsPage();
        initFaqAccordion();
        initFolderTabs();
        initLightbox();
    });
})();

window.toggleCollapse = function(btn) {
    const grid = btn.previousElementSibling;
    if (grid && grid.classList.contains('stack-grid')) {
        const hiddenArea = grid.querySelector('.collapsible-hidden-area');
        if (hiddenArea) {
            hiddenArea.classList.toggle('expanded');
            btn.classList.toggle('expanded');
            if (hiddenArea.classList.contains('expanded')) {
                btn.innerHTML = 'Mostrar menos <i class="fas fa-chevron-up"></i>';
            } else {
                btn.innerHTML = 'Mostrar mais <i class="fas fa-chevron-down"></i>';
            }
        }
    }
};

window.toggleProjectMedia = function(btn) {
    const collapseArea = btn.nextElementSibling;
    if (collapseArea && collapseArea.classList.contains('project-media-collapse')) {
        const isExpanding = !collapseArea.classList.contains('expanded');
        collapseArea.classList.toggle('expanded');
        btn.classList.toggle('expanded');
        
        if (isExpanding) {
            btn.innerHTML = '📂 Ocultar Capturas <i class="fas fa-chevron-up"></i>';
        } else {
            btn.innerHTML = '📂 Ver Capturas de Tela <i class="fas fa-chevron-down"></i>';
        }
    }
};

window.setCarouselSlide = function(carousel, index) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.indicator-dot');
    if (slides.length === 0) return;
    
    let newIndex = (index + slides.length) % slides.length;
    carousel.setAttribute('data-current-slide', newIndex);
    
    slides.forEach((slide, idx) => {
        if (idx === newIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    dots.forEach((dot, idx) => {
        if (idx === newIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
};

window.shiftSlide = function(btn, direction) {
    const carousel = btn.closest('.project-carousel');
    const currentIndex = parseInt(carousel.getAttribute('data-current-slide') || '0', 10);
    window.setCarouselSlide(carousel, currentIndex + direction);
};

window.goToSlide = function(dot, index) {
    const carousel = dot.closest('.project-carousel');
    window.setCarouselSlide(carousel, index);
};
