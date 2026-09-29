// ==========================================
// LAYOUT INJECTION — Redesigned Navigation
// ==========================================

// Particles background (gerenciado via tsParticles)
const backgroundHTML = `
    <div id="tsparticles"></div>
`;

// Header with redesigned navigation
const headerHTML = `
    <nav class="floating-header">
        <div class="nav-links left-links">
            <a href="/contato">Contato</a>
            <a href="/sobre">Sobre Mim</a>
        </div>
        
        <div class="nav-logo">
            <a href="/">
                <img src="/assets/logo.svg" alt="Leonardo P. Soares Logo">
            </a>
        </div>
        
        <div class="nav-links right-links">
            <a href="/projetos">Projetos</a>
            <a href="/blog">Blog Pessoal</a>
        </div>

        <div class="header-controls">
            <button class="particles-toggle" id="particles-toggle" aria-label="Alternar partículas da Utena" title="Alternar partículas da Utena">
                <svg class="sparkle-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/>
                </svg>
            </button>
            <button class="theme-toggle" id="theme-toggle" aria-label="Alternar tema" title="Selo Chuunibyou (Alternar tema)">
                <svg class="eyepatch-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor"/>
                    <line x1="2" y1="4" x2="6" y2="7" stroke="currentColor" stroke-linecap="round"/>
                    <line x1="18" y1="17" x2="22" y2="20" stroke="currentColor" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="2.2" fill="var(--accent-gold)"/>
                </svg>
            </button>
        </div>
    </nav>
`;

// Development popup (Madoka Magica Soul Gem + Clean Glass)
const popupHTML = `
    <div id="dev-popup" class="dev-popup hidden">
        <div class="popup-content">
            <svg class="soul-gem-icon" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 2C8.5 2 6 5.5 6 9c0 4.5 4 8 6 13 2-5 6-8.5 6-13 0-3.5-2.5-7-6-7zm0 4a3 3 0 110 6 3 3 0 010-6z"/>
            </svg>
            <h2>Em Desenvolvimento</h2>
            <p>Olá! Este site ainda está em construção e não está finalizado. Algumas informações podem estar faltando ou sofrerão alterações.</p>
            <button id="close-popup" class="btn-primary" style="width: 100%; margin-top: 10px;">Entendi</button>
        </div>
    </div>
`;

// Footer
const footerHTML = `
    <footer class="social-footer">
        <a href="https://github.com/webglossdev" target="_blank" rel="noopener noreferrer" class="social-pill">
            <span class="icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </span> GitHub
        </a>
        <a href="https://linktr.ee/webglossdev" target="_blank" rel="noopener noreferrer" class="social-pill">
            <span class="icon">🔗</span> Linktree
        </a>
        <a href="/contato" class="social-pill">
            <span class="icon">💬</span> Contato
        </a>
    </footer>

    <div class="site-credits">
        <p>Hospedado na Vercel com deploy automático via GitHub.<br>
            © 2026 Leonardo P. Soares. O conteúdo deste site é protegido
            por direitos autorais de acordo com a <a href="https://www.planalto.gov.br/ccivil_03/leis/l9610.htm"
                target="_blank" rel="noopener">Lei 9.610/98</a>.<br>O código-fonte está disponível sob a
            licença <a href="https://github.com/monanadmin/MONAN-Model/blob/main/licenca-gpl-3.0.pt-br.md"
                target="_blank" rel="noopener">GNU GPLv3</a>.</p>
    </div>
`;

function injectLayout() {
    // Inject FontAwesome CDN dynamically
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // Inject background + header + popup at beginning of body
    if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', backgroundHTML + headerHTML + popupHTML);
    }

    // Inject footer at end of .content-wrapper
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Highlight current page in nav
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = (link.getAttribute('href') || '').replace(/\/+$/, '');
        if ((href === '' && currentPath === '') || (href && href !== '/' && currentPath.startsWith(href)) || (href === '/' && currentPath === '')) {
            link.classList.add('nav-active');
        }
    });
}

// Execute immediately
injectLayout();
