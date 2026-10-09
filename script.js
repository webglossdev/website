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
        const isLight = theme === 'light';
        document.documentElement.classList.remove('dark', 'light', 'light-theme');
        if (document.body) {
            document.body.classList.remove('dark', 'light', 'light-theme');
        }
        if (isLight) {
            document.documentElement.classList.add('light', 'light-theme');
            if (document.body) document.body.classList.add('light', 'light-theme');
        } else {
            document.documentElement.classList.add('dark');
            if (document.body) document.body.classList.add('dark');
        }

        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.setAttribute('aria-pressed', isLight ? 'false' : 'true');
            toggle.setAttribute(
                'title',
                isLight ? 'Tapa-olho Selado (Modo Claro) — Despertar Jao Shingan' : 'Jao Shingan Ativado (Modo Escuro) — Selar com Tapa-olho'
            );
        });
    }

    function initTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || (mediaQuery.matches ? 'dark' : 'light');
        applyTheme(initialTheme);

        const themeToggles = document.querySelectorAll('.theme-toggle');
        if (!themeToggles.length) return;

        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.add('activating');
                setTimeout(() => toggle.classList.remove('activating'), 200);

                const isCurrentLight = document.documentElement.classList.contains('light') || document.documentElement.classList.contains('light-theme');
                const nextTheme = isCurrentLight ? 'dark' : 'light';
                localStorage.setItem('theme', nextTheme);
                applyTheme(nextTheme);
            });
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

    function calculateParticleCount(isMobile) {
        if (isReducedMotion()) return 0;
        const width = window.innerWidth || 1920;
        const height = window.innerHeight || 1080;
        const baselineArea = 1920 * 1080;
        const currentArea = width * height;
        // Padrão de referência: máximo de 30 estrelas em 1920x1080 com bom desempenho
        let targetCount = Math.round(30 * (currentArea / baselineArea));
        const isLowEnd = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
        if (isLowEnd || isMobile) {
            targetCount = Math.round(targetCount * 0.55);
        }
        return Math.min(30, Math.max(8, targetCount));
    }

    function initParticlesToggle() {
        const toggles = document.querySelectorAll('.particles-toggle');
        if (!toggles.length) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches || navigator.maxTouchPoints > 0;
        const savedPreference = localStorage.getItem('particles');
        // Ativo por padrão se não houver preferência expressa salva e se o usuário não preferir redução de movimento
        const shouldEnable = savedPreference === null ? !isReducedMotion() : savedPreference === 'true';

        toggles.forEach(t => t.setAttribute('aria-pressed', shouldEnable ? 'true' : 'false'));

        if (shouldEnable) {
            enableParticles(isMobile);
        }

        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                if (particlesActive) {
                    disableParticles();
                } else {
                    enableParticles(isMobile);
                }
            });
        });
    }

    function enableParticles(isMobile) {
        const particleLayer = document.getElementById('tsparticles');
        const toggles = document.querySelectorAll('.particles-toggle');
        if (!particleLayer) return;

        document.body.classList.add('particles-enabled');
        toggles.forEach(t => {
            t.classList.add('active');
            t.setAttribute('aria-pressed', 'true');
        });
        localStorage.setItem('particles', 'true');
        particlesActive = true;

        if (!particlesLoaded) {
            loadTsParticles(isMobile);
            return;
        }

        initParticlesEffect(isMobile);
    }

    function disableParticles() {
        const toggles = document.querySelectorAll('.particles-toggle');
        document.body.classList.remove('particles-enabled');
        toggles.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-pressed', 'false');
        });
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

        const count = calculateParticleCount(isMobile);
        const theme = document.body.dataset.theme || '';

        // Configuração de formatos e cores calibrada por identidade de anime
        let shapeConfig;
        let colorConfig = undefined;
        let sizeConfig;

        if (theme === 'chuunibyou') {
            // Chuunibyou: Estrelas da Utena + Faíscas arcanas (Schwarz Sechs / Jao Shingan)
            shapeConfig = {
                type: ['image', 'circle'],
                options: {
                    image: {
                        src: '/assets/estrelas.svg',
                        width: 32,
                        height: 32,
                        replaceColor: false
                    },
                    circle: {}
                }
            };
            colorConfig = {
                value: ['#22d3ee', '#fbbf24', '#8b5cf6', '#ef4444', '#ffffff']
            };
            sizeConfig = {
                value: { min: 4, max: 20 },
                animation: { enable: true, speed: 0.8, minimumValue: 3, sync: false }
            };
        } else if (theme === 'gosick') {
            // Gosick: Poeira dourada de biblioteca antiga + Estrelas da Utena
            shapeConfig = {
                type: ['image', 'circle'],
                options: {
                    image: {
                        src: '/assets/estrelas.svg',
                        width: 32,
                        height: 32,
                        replaceColor: false
                    },
                    circle: {}
                }
            };
            colorConfig = {
                value: ['#d4af37', '#10b981', '#fdfbf7', '#b45309']
            };
            sizeConfig = {
                value: { min: 3, max: 18 },
                animation: { enable: true, speed: 0.6, minimumValue: 2, sync: false }
            };
        } else if (theme === 'abyss') {
            // Made in Abyss: Neblina ascendente, relíquias e fagulhas dos exploradores
            shapeConfig = {
                type: ['image', 'circle'],
                options: {
                    image: {
                        src: '/assets/estrelas.svg',
                        width: 32,
                        height: 32,
                        replaceColor: false
                    },
                    circle: {}
                }
            };
            colorConfig = {
                value: ['#facc15', '#ea580c', '#f8fafc', '#22c55e', '#e11d48', '#9333ea', '#0d9488']
            };
            sizeConfig = {
                value: { min: 3, max: 18 },
                animation: { enable: true, speed: 0.7, minimumValue: 2, sync: false }
            };
        } else if (theme === 'madoka') {
            // Madoka Magica: Soul Gems luminescentes + Estrelas cósmicas
            shapeConfig = {
                type: ['image', 'circle'],
                options: {
                    image: {
                        src: '/assets/estrelas.svg',
                        width: 32,
                        height: 32,
                        replaceColor: false
                    },
                    circle: {}
                }
            };
            colorConfig = {
                value: ['#f472b6', '#c084fc', '#f59e0b', '#2563eb', '#dc2626', '#ffffff']
            };
            sizeConfig = {
                value: { min: 4, max: 20 },
                animation: { enable: true, speed: 0.9, minimumValue: 3, sync: false }
            };
        } else if (theme === 'kon') {
            // K-ON!: Fagulhas quentes de chá da tarde + Estrelas da Utena
            shapeConfig = {
                type: ['image', 'circle'],
                options: {
                    image: {
                        src: '/assets/estrelas.svg',
                        width: 32,
                        height: 32,
                        replaceColor: false
                    },
                    circle: {}
                }
            };
            colorConfig = {
                value: ['#f59e0b', '#fda4af', '#b45309', '#fbbf24', '#ffffff']
            };
            sizeConfig = {
                value: { min: 3, max: 18 },
                animation: { enable: true, speed: 0.6, minimumValue: 2, sync: false }
            };
        } else if (theme === 'rezero' || theme === 'mahoako') {
            // Re:Zero: Brilho mágico de partículas etéreas, borboletas e runas luminosas (Beatrice, Rem, Ram, Subaru)
            shapeConfig = {
                type: ['circle', 'star'],
                options: {
                    star: { sides: 5 }
                }
            };
            colorConfig = {
                value: ['#ec4899', '#38bdf8', '#fbbf24', '#fb7185', '#a855f7', '#ffffff']
            };
            sizeConfig = {
                value: { min: 2.5, max: 8 },
                animation: { enable: true, speed: 1.2, minimumValue: 1.5, sync: false }
            };
        } else {
            // Padrão global: Estrelas da Utena
            shapeConfig = {
                type: 'image',
                options: {
                    image: {
                        src: '/assets/estrelas.svg',
                        width: 32,
                        height: 32,
                        replaceColor: false
                    }
                }
            };
            sizeConfig = {
                value: { min: 14, max: 22 },
                animation: { enable: true, speed: 0.8, minimumValue: 14, sync: false }
            };
        }

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
                        distance: 100,
                        duration: 6,
                        factor: 8,
                        speed: 0.4,
                        easing: 'ease-out-sine'
                    }
                }
            },
            particles: {
                color: colorConfig,
                links: { enable: false },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: { default: 'out' },
                    random: true,
                    speed: { min: 0.12, max: 0.28 },
                    straight: false
                },
                number: {
                    density: { enable: false },
                    value: count
                },
                opacity: {
                    value: { min: 0.25, max: 0.70 },
                    animation: { enable: true, speed: 0.4, minimumValue: 0.25, sync: false }
                },
                shape: shapeConfig,
                size: sizeConfig,
                rotate: {
                    value: { min: 0, max: 360 },
                    direction: 'random',
                    animation: { enable: true, speed: 0.5, sync: false }
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
        if (!lightbox) return;

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox || event.target.classList.contains('lightbox-backdrop')) {
                if (typeof window.closeLightbox === 'function') {
                    window.closeLightbox();
                }
            }
        });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.floating-header');
        if (!header) return;

        const updateHeaderVisibility = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (header.classList.contains('island-open')) {
                header.classList.remove('header-hidden');
                scrollQueued = false;
                return;
            }

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

window.toggleCollapse = function (btn) {
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

window.toggleProjectMedia = function (btn) {
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

window.setCarouselSlide = function (carousel, index) {
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

window.shiftSlide = function (btn, direction) {
    const carousel = btn.closest('.project-carousel');
    const currentIndex = parseInt(carousel.getAttribute('data-current-slide') || '0', 10);
    window.setCarouselSlide(carousel, currentIndex + direction);
};

window.goToSlide = function (dot, index) {
    const carousel = dot.closest('.project-carousel');
    window.setCarouselSlide(carousel, index);
};

// ==========================================================================
// SOBRE MIM: Collapsible Sections
// ==========================================================================
window.toggleCollapse = function (btn) {
    const section = btn.closest('.glass-card') || btn.closest('.about-section');
    if (!section) return;
    const hiddenArea = section.querySelector('.collapsible-hidden-area');
    if (!hiddenArea) return;

    const isExpanded = hiddenArea.classList.contains('expanded');
    hiddenArea.classList.toggle('expanded');

    if (isExpanded) {
        btn.innerHTML = 'Mostrar mais <i class="fas fa-chevron-down"></i>';
    } else {
        btn.innerHTML = 'Mostrar menos <i class="fas fa-chevron-up"></i>';
    }
};

// ==========================================================================
// SOBRE MIM: Folder Tab System (Certificates)
// ==========================================================================
// ==========================================
// SOBRE MIM: Switch Workstation (Atual vs Sonhos)
// ==========================================
window.switchWorkstation = function (mode) {
    const btnCurrent = document.getElementById('btn-ws-current');
    const btnDream = document.getElementById('btn-ws-dream');
    const panelCurrent = document.getElementById('ws-panel-current');
    const panelDream = document.getElementById('ws-panel-dream');

    if (!panelCurrent || !panelDream) return;

    // Fechar popovers abertos ao trocar de painel
    document.querySelectorAll('.hw-popover.open').forEach(p => {
        p.classList.remove('open', 'popover-left', 'popover-right', 'popover-inside', 'popover-bottom-up');
        p.style.left = '';
        p.style.right = '';
        p.style.top = '';
        p.style.bottom = '';
    });
    document.querySelectorAll('.hw-info-btn.active').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.hw-card.has-popover-open').forEach(c => c.classList.remove('has-popover-open'));
    document.querySelectorAll('.workstation-section.has-active-popover').forEach(s => s.classList.remove('has-active-popover'));

    if (mode === 'dream') {
        if (btnCurrent) btnCurrent.classList.remove('active');
        if (btnDream) btnDream.classList.add('active');
        panelCurrent.classList.remove('active');
        panelDream.classList.add('active');
    } else {
        if (btnDream) btnDream.classList.remove('active');
        if (btnCurrent) btnCurrent.classList.add('active');
        panelDream.classList.remove('active');
        panelCurrent.classList.add('active');
    }
};

// ==========================================
// SOBRE MIM: Popovers Interativos de Hardware (Meu Setup)
// ==========================================
// MODAL / POPOVER LATERAL DE ESPECIFICAÇÕES DO SETUP (NUNCA CORTA FORA DA BOLHA)
// ==========================================
window.toggleHwModal = function (btn, event) {
    if (event) event.stopPropagation();
    const card = btn.closest('.hw-card');
    if (!card) return;

    const popover = card.querySelector('.hw-popover');
    if (!popover) return;

    const isOpen = popover.classList.contains('open');

    // Fechar outros popovers abertos
    document.querySelectorAll('.hw-popover.open').forEach(p => {
        p.classList.remove('open', 'popover-left', 'popover-right', 'popover-inside', 'popover-bottom-up');
        p.style.left = '';
        p.style.right = '';
        p.style.top = '';
        p.style.bottom = '';
    });
    document.querySelectorAll('.hw-info-btn.active').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.hw-card.has-popover-open').forEach(c => c.classList.remove('has-popover-open'));
    document.querySelectorAll('.workstation-section.has-active-popover').forEach(s => s.classList.remove('has-active-popover'));

    if (!isOpen) {
        const workstationSection = card.closest('.workstation-section');
        if (workstationSection) {
            workstationSection.classList.add('has-active-popover');
        }

        if (window.innerWidth > 920) {
            if (card.classList.contains('hw-card-full')) {
                popover.classList.add('popover-inside');
            } else {
                const grid = card.closest('.hw-grid');
                const gridRect = grid ? grid.getBoundingClientRect() : null;
                const cardRect = card.getBoundingClientRect();

                // Posicionamento horizontal inteligente (abre para o centro da grade)
                if (gridRect && (cardRect.left + cardRect.width / 2 > gridRect.left + gridRect.width / 2)) {
                    popover.classList.add('popover-left');
                } else {
                    popover.classList.add('popover-right');
                }

                // Posicionamento vertical inteligente: se estiver na metade inferior da grade ou proximo do rodape da tela, abre para cima
                const isLowerHalf = gridRect ? ((cardRect.top - gridRect.top) > (gridRect.height * 0.42)) : false;
                const isNearScreenBottom = (window.innerHeight - cardRect.bottom < 320);
                if (isLowerHalf || isNearScreenBottom) {
                    popover.classList.add('popover-bottom-up');
                }
            }
        }

        card.classList.add('has-popover-open');
        popover.classList.add('open');
        btn.classList.add('active');

        // Clamping ativo em tempo de execucao: garante 100% que o popover nunca ultrapasse as bordas da tela nem da grade
        if (window.innerWidth > 920) {
            requestAnimationFrame(() => {
                const grid = card.closest('.hw-grid');
                const gRect = grid ? grid.getBoundingClientRect() : null;
                let pRect = popover.getBoundingClientRect();

                // Clamping Horizontal
                if (gRect) {
                    if (pRect.right > gRect.right - 8) {
                        popover.style.left = 'auto';
                        popover.style.right = '12px';
                    } else if (pRect.left < gRect.left + 8) {
                        popover.style.left = '12px';
                        popover.style.right = 'auto';
                    }
                }

                // Clamping Vertical inteligente: nunca transborda a tela nem o rodape
                pRect = popover.getBoundingClientRect();
                const vHeight = window.innerHeight;
                if (pRect.bottom > vHeight - 16) {
                    const overflow = pRect.bottom - (vHeight - 16);
                    if (popover.classList.contains('popover-bottom-up')) {
                        const currentBottom = parseFloat(popover.style.bottom) || -10;
                        popover.style.bottom = `${currentBottom + overflow}px`;
                    } else {
                        const currentTop = parseFloat(popover.style.top) || -10;
                        popover.style.top = `${currentTop - overflow}px`;
                    }
                }

                pRect = popover.getBoundingClientRect();
                const topSafeZone = 72;
                if (pRect.top < topSafeZone) {
                    const underflow = topSafeZone - pRect.top;
                    if (popover.classList.contains('popover-bottom-up')) {
                        const currentBottom = parseFloat(popover.style.bottom) || -10;
                        popover.style.bottom = `${currentBottom - underflow}px`;
                    } else {
                        const currentTop = parseFloat(popover.style.top) || -10;
                        popover.style.top = `${currentTop + underflow}px`;
                    }
                }
            });
        }
    }
};

window.closeHwModal = function (closeBtn, event) {
    if (event) event.stopPropagation();
    const popover = closeBtn.closest('.hw-popover');
    if (popover) {
        popover.classList.remove('open', 'popover-left', 'popover-right', 'popover-inside', 'popover-bottom-up');
        popover.style.left = '';
        popover.style.right = '';
        popover.style.top = '';
        popover.style.bottom = '';
        const card = popover.closest('.hw-card');
        if (card) {
            card.classList.remove('has-popover-open');
            const infoBtn = card.querySelector('.hw-info-btn');
            if (infoBtn) infoBtn.classList.remove('active');
        }
        document.querySelectorAll('.workstation-section.has-active-popover').forEach(s => s.classList.remove('has-active-popover'));
    }
};

// Fechar popover com clique fora ou tecla Escape
document.addEventListener('click', (e) => {
    if (!e.target.closest('.hw-popover') && !e.target.closest('.hw-info-btn')) {
        document.querySelectorAll('.hw-popover.open').forEach(p => {
            p.classList.remove('open', 'popover-left', 'popover-right', 'popover-inside', 'popover-bottom-up');
            p.style.left = '';
            p.style.right = '';
            p.style.top = '';
            p.style.bottom = '';
        });
        document.querySelectorAll('.hw-info-btn.active').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.hw-card.has-popover-open').forEach(c => c.classList.remove('has-popover-open'));
        document.querySelectorAll('.workstation-section.has-active-popover').forEach(s => s.classList.remove('has-active-popover'));
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.hw-popover.open').forEach(p => {
            p.classList.remove('open', 'popover-left', 'popover-right', 'popover-inside', 'popover-bottom-up');
            p.style.left = '';
            p.style.right = '';
            p.style.top = '';
            p.style.bottom = '';
        });
        document.querySelectorAll('.hw-info-btn.active').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.hw-card.has-popover-open').forEach(c => c.classList.remove('has-popover-open'));
        document.querySelectorAll('.workstation-section.has-active-popover').forEach(s => s.classList.remove('has-active-popover'));
    }
});

// ==========================================================================
// SOBRE MIM: Folder Tab System & Dynamic Year Filter (Certificates)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    let currentCertYear = 'all';

    function filterCertificatesByYear() {
        const activePanel = document.querySelector('.folder-panel.active');
        if (!activePanel) return;

        const cards = activePanel.querySelectorAll('.cert-card');
        cards.forEach(card => {
            const cardYear = card.getAttribute('data-year');
            if (currentCertYear === 'all' || cardYear === currentCertYear) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Feedback se nenhum certificado estiver visível no ano filtrado
        const visibleCards = activePanel.querySelectorAll('.cert-card:not([style*="display: none"])');
        let emptyEl = activePanel.querySelector('.cert-empty-feedback');
        if (cards.length > 0 && visibleCards.length === 0) {
            if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'cert-empty-feedback';
                emptyEl.innerHTML = '<p>Nenhum certificado registrado neste ano para esta instituição.</p>';
                activePanel.appendChild(emptyEl);
            }
            emptyEl.style.display = 'block';
        } else if (emptyEl) {
            emptyEl.style.display = 'none';
        }
    }

    function syncYearFilterWithActiveTab() {
        const filterBar = document.getElementById('cert-year-filter');
        if (!filterBar) return;

        const activePanel = document.querySelector('.folder-panel.active');
        if (!activePanel) {
            filterBar.style.display = 'none';
            return;
        }

        const cards = activePanel.querySelectorAll('.cert-card');
        const availableYears = new Set();
        cards.forEach(c => {
            const y = c.getAttribute('data-year');
            if (y) availableYears.add(y);
        });

        // Se só tem 1 ano disponível (ou 0), nenhum botão deve ser visível (esconde a barra inteira)
        if (availableYears.size <= 1) {
            filterBar.style.display = 'none';
            currentCertYear = 'all';
            cards.forEach(c => c.style.display = '');
            const emptyEl = activePanel.querySelector('.cert-empty-feedback');
            if (emptyEl) emptyEl.style.display = 'none';
            return;
        }

        // Se tem múltiplos anos (ex: ONIA com 2025 e 2026), mostra a barra e apenas os anos presentes
        filterBar.style.display = 'flex';

        // Se o ano selecionado atualmente não existe nesta aba, reseta para 'all'
        if (currentCertYear !== 'all' && !availableYears.has(currentCertYear)) {
            currentCertYear = 'all';
        }

        // Filtra os botões visíveis
        filterBar.querySelectorAll('.year-chip').forEach(chip => {
            const y = chip.getAttribute('data-year');
            if (y === 'all') {
                chip.style.display = '';
                chip.classList.toggle('active', currentCertYear === 'all');
            } else if (availableYears.has(y)) {
                chip.style.display = '';
                chip.classList.toggle('active', currentCertYear === y);
            } else {
                chip.style.display = 'none';
                chip.classList.remove('active');
            }
        });

        filterCertificatesByYear();
    }

    // Navegação entre abas de certificados
    document.querySelectorAll('.folder-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const panelId = tab.getAttribute('data-panel');
            const system = tab.closest('.folder-system');
            if (!system) return;

            // Desativa abas e painéis
            system.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
            system.querySelectorAll('.folder-panel').forEach(p => p.classList.remove('active'));

            // Ativa aba e painel selecionados
            tab.classList.add('active');
            const panel = document.getElementById(panelId);
            if (panel) panel.classList.add('active');

            // Atualiza dinamicamente os filtros de ano para a aba ativa
            syncYearFilterWithActiveTab();
        });
    });

    // Clique nos chips de ano
    document.querySelectorAll('.year-chip[data-year]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.year-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCertYear = chip.getAttribute('data-year');
            filterCertificatesByYear();
        });
    });

    // Inicialização da aba ativa ao carregar a página
    syncYearFilterWithActiveTab();

    // ==========================================================================
    // PROJETOS: Category Filter
    // ==========================================================================
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.project-card[data-category]').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// ==========================================================================
// DIPLOMA & CERTIFICADOS: Dual-Sided (Frente & Verso) & Lightbox Controller
// ==========================================================================
let lbCurrentDoc = {
    frontSrc: '',
    backSrc: '',
    frontTitle: '',
    backTitle: '',
    frontDesc: '',
    backDesc: '',
    currentSide: 'front'
};

window.handleCertCardClick = function (e, el, frontSrc, backSrc, frontTitle, frontDesc, inst, year, backTitle, backDesc) {
    const isFlipped = el.querySelector('.cert-3d-card')?.classList.contains('flipped');
    window.openLightbox(frontSrc, frontTitle, frontDesc, inst, year, backSrc, backTitle, backDesc);
    if (isFlipped && backSrc) {
        window.switchLightboxPage('back');
    }
};

window.setDiplomaSide = function (side) {
    const card = document.getElementById('irs-flip-inner');
    const pillFront = document.getElementById('irs-pill-front');
    const pillBack = document.getElementById('irs-pill-back');

    if (!card) return;

    if (side === 'back') {
        card.classList.add('flipped');
        if (pillFront) pillFront.classList.remove('active');
        if (pillBack) pillBack.classList.add('active');
    } else {
        card.classList.remove('flipped');
        if (pillFront) pillFront.classList.add('active');
        if (pillBack) pillBack.classList.remove('active');
    }
};

window.toggleDiplomaFlip = function () {
    const card = document.getElementById('irs-flip-inner');
    if (!card) return;
    const isFlipped = card.classList.contains('flipped');
    window.setDiplomaSide(isFlipped ? 'front' : 'back');
};

window.openLightbox = function (src, title, desc, inst, year, versoSrc, versoTitle, versoDesc) {
    const lightbox = document.getElementById('cert-lightbox');
    if (!lightbox) return;

    const img = document.getElementById('lb-img');
    const titleEl = document.getElementById('lb-title');
    const descEl = document.getElementById('lb-desc');
    const instEl = document.getElementById('lb-inst');
    const yearEl = document.getElementById('lb-year');
    const downloadEl = document.getElementById('lb-download');
    const downloadLabel = document.getElementById('lb-download-label');
    const pageSwitcher = document.getElementById('lb-page-switcher');
    const pageIndicator = document.getElementById('lb-page-indicator');

    lbCurrentDoc = {
        frontSrc: src,
        backSrc: versoSrc || '',
        frontTitle: title || '',
        backTitle: versoTitle || (title ? title + ' (Verso)' : ''),
        frontDesc: desc || '',
        backDesc: versoDesc || desc || '',
        currentSide: 'front'
    };

    if (instEl) {
        instEl.textContent = inst || 'Certificação';
        instEl.style.display = inst ? 'inline-flex' : 'none';
    }
    if (yearEl) {
        yearEl.textContent = year || '';
        yearEl.style.display = year ? 'inline-flex' : 'none';
    }

    if (versoSrc) {
        // Documento com duas páginas (Frente & Verso)
        if (pageSwitcher) pageSwitcher.style.display = 'flex';
        if (pageIndicator) {
            pageIndicator.style.display = 'inline-flex';
            pageIndicator.textContent = 'Página 1 de 2: Frente';
        }
        if (downloadLabel) {
            downloadLabel.textContent = 'Ver Imagem Original';
        }
        window.switchLightboxPage('front');
    } else {
        // Documento simples com página única
        if (pageSwitcher) pageSwitcher.style.display = 'none';
        if (pageIndicator) pageIndicator.style.display = 'none';
        if (downloadLabel) downloadLabel.textContent = 'Ver Imagem Original';

        if (img) img.src = src;
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (downloadEl) downloadEl.href = src;
    }

    lightbox.classList.add('active', 'open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

window.switchLightboxPage = function (side) {
    if (!lbCurrentDoc.backSrc) return;
    lbCurrentDoc.currentSide = side;

    const img = document.getElementById('lb-img');
    const titleEl = document.getElementById('lb-title');
    const descEl = document.getElementById('lb-desc');
    const downloadEl = document.getElementById('lb-download');
    const downloadLabel = document.getElementById('lb-download-label');
    const pageIndicator = document.getElementById('lb-page-indicator');
    const btnFront = document.getElementById('lb-btn-front');
    const btnBack = document.getElementById('lb-btn-back');

    if (btnFront) btnFront.classList.toggle('active', side === 'front');
    if (btnBack) btnBack.classList.toggle('active', side === 'back');

    if (side === 'front') {
        if (img) {
            img.style.opacity = '0.3';
            setTimeout(() => {
                img.src = lbCurrentDoc.frontSrc;
                img.style.opacity = '1';
            }, 80);
        }
        if (titleEl) titleEl.textContent = lbCurrentDoc.frontTitle;
        if (descEl) descEl.textContent = lbCurrentDoc.frontDesc;
        if (downloadEl) downloadEl.href = lbCurrentDoc.frontSrc;
        if (downloadLabel) downloadLabel.textContent = 'Ver Imagem Original';
        if (pageIndicator) pageIndicator.textContent = 'Página 1 de 2: Frente';
    } else {
        if (img) {
            img.style.opacity = '0.3';
            setTimeout(() => {
                img.src = lbCurrentDoc.backSrc;
                img.style.opacity = '1';
            }, 80);
        }
        if (titleEl) titleEl.textContent = lbCurrentDoc.backTitle;
        if (descEl) descEl.textContent = lbCurrentDoc.backDesc;
        if (downloadEl) downloadEl.href = lbCurrentDoc.backSrc;
        if (downloadLabel) downloadLabel.textContent = 'Ver Imagem Original';
        if (pageIndicator) pageIndicator.textContent = 'Página 2 de 2: Verso (Grade • 532h)';
    }
};

window.toggleLightboxFlip = function () {
    if (!lbCurrentDoc.backSrc) return;
    const nextSide = lbCurrentDoc.currentSide === 'front' ? 'back' : 'front';
    window.switchLightboxPage(nextSide);
};

window.closeLightbox = function () {
    const lightbox = document.getElementById('cert-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active', 'open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

// Fechar Lightbox por clique no backdrop ou tecla Escape
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('cert-lightbox');
    if (lightbox && e.target.classList.contains('lightbox-backdrop')) {
        window.closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.closeLightbox();
    }
});

