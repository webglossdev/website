// ==========================================
// LAYOUT INJECTION — Redesigned Navigation, Synchronous Sprite & Normalized Layers
// ==========================================

// Sprite SVG embutido de ícones temáticos de anime para carregamento síncrono e suporte offline / file:///
const animeIconsSpriteSVG = `
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;" id="anime-icons-sprite-defs">
  <!-- CHUUNIBYOU DEMO KOI GA SHITAI! -->
  <symbol id="icon-eyepatch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="5" y="6" width="14" height="12" rx="3" fill="currentColor" fill-opacity="0.12" />
    <line x1="2" y1="4" x2="6" y2="7" />
    <line x1="18" y1="17" x2="22" y2="20" />
    <path d="M12 9v6M9 12h6" stroke-width="1.6" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </symbol>
  <symbol id="icon-rune-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="7" stroke-dasharray="2 1.5" />
    <polygon points="12,5 18,15.5 6,15.5" stroke-width="1.2" />
    <polygon points="12,19 18,8.5 6,8.5" stroke-width="1.2" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
  </symbol>
  <symbol id="icon-dekomori-balls" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3c0 4 3 6 3 9" />
    <path d="M16 3c0 4-3 6-3 9" />
    <circle cx="7" cy="16" r="4.5" fill="currentColor" fill-opacity="0.2" />
    <circle cx="17" cy="16" r="4.5" fill="currentColor" fill-opacity="0.2" />
    <path d="M5 14.5a3 3 0 0 1 4 0M15 14.5a3 3 0 0 1 4 0" />
    <circle cx="7" cy="16" r="1.2" fill="currentColor" />
    <circle cx="17" cy="16" r="1.2" fill="currentColor" />
  </symbol>
  <symbol id="icon-kumin-pillow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 7c3-2 13-2 16 0s2 10 0 10-13 2-16 0S2 9 4 7z" fill="currentColor" fill-opacity="0.15" />
    <path d="M8 12c2-1 6-1 8 0" stroke-width="1.4" stroke-dasharray="1 1.5" />
    <circle cx="4" cy="7" r="0.8" fill="currentColor" />
    <circle cx="20" cy="7" r="0.8" fill="currentColor" />
    <circle cx="20" cy="17" r="0.8" fill="currentColor" />
    <circle cx="4" cy="17" r="0.8" fill="currentColor" />
  </symbol>

  <!-- GOSICK -->
  <symbol id="icon-pipe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 4h-4v4c0 3 2 5 5 5h1V4z" fill="currentColor" fill-opacity="0.18" />
    <path d="M19 13c-4.5 0-8 3-11 3H4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h4c2.5 0 5-2 8-2" />
    <path d="M16 2c1 0.8 1 1.5 0 2.2M18 1c1 0.8 1 1.5 0 2.2" stroke-width="1.2" />
  </symbol>
  <symbol id="icon-locket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="4" r="1.5" />
    <path d="M12 5.5v2" />
    <ellipse cx="12" cy="14.5" rx="6.5" ry="7.5" fill="currentColor" fill-opacity="0.15" />
    <ellipse cx="12" cy="14.5" rx="4" ry="5" stroke-dasharray="2 1.5" />
    <polygon points="12,12 13.5,14.5 12,17 10.5,14.5" fill="currentColor" />
  </symbol>
  <symbol id="icon-vintage-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v16H6.5a2.5 2.5 0 0 0-2.5 2.5z" fill="currentColor" fill-opacity="0.15" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <line x1="8" y1="6" x2="16" y2="6" stroke-width="1.4" />
    <line x1="8" y1="9" x2="14" y2="9" stroke-width="1.4" />
    <line x1="8" y1="12" x2="12" y2="12" stroke-width="1.4" />
    <path d="M14 2v6l2-1.5L18 8V2" fill="currentColor" fill-opacity="0.4" />
  </symbol>
  <symbol id="icon-dress-bow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    <path d="M10 9C5 6 3 11 9.8 11z" fill="currentColor" fill-opacity="0.2" />
    <path d="M14 9C19 6 21 11 14.2 11z" fill="currentColor" fill-opacity="0.2" />
    <path d="M10.5 11.5L7 20l3-1 2 2 2-2 3 1-3.5-8.5" />
  </symbol>

  <!-- MADE IN ABYSS -->
  <symbol id="icon-white-whistle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6c-3 1-5 4-5 8 0 4 2.5 7 5 7s5-3 5-7c0-4-2-7-5-8z" fill="currentColor" fill-opacity="0.18" />
    <ellipse cx="12" cy="14" rx="2" ry="3" />
    <line x1="12" y1="10" x2="12" y2="11" />
  </symbol>
  <symbol id="icon-reg-helmet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12a7 7 0 0 1 14 0v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5z" fill="currentColor" fill-opacity="0.15" />
    <rect x="7" y="11" width="10" height="4" rx="1.5" />
    <circle cx="10" cy="13" r="1" fill="currentColor" />
    <circle cx="14" cy="13" r="1" fill="currentColor" />
    <path d="M4 10l-2-3M20 10l2-3" />
  </symbol>
  <symbol id="icon-nanachi-hex" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12,3 19,7 19,15 12,19 5,15 5,7" fill="currentColor" fill-opacity="0.2" />
    <polygon points="12,6 16,8.5 16,13.5 12,16 8,13.5 8,8.5" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    <path d="M12 19v3M9 22h6" />
  </symbol>
  <symbol id="icon-prushka-hat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="15" rx="9" ry="3" fill="currentColor" fill-opacity="0.12" />
    <path d="M5 14c0-5 3-9 7-9s7 4 7 9" />
    <circle cx="12" cy="5" r="1.2" fill="currentColor" />
    <path d="M15 6l4-3" stroke-width="1.3" />
  </symbol>

  <!-- PUELLA MAGI MADOKA MAGICA -->
  <symbol id="icon-soulgem-madoka" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C8.5 2 6 5.5 6 9c0 4.5 4 8 6 13 2-5 6-8.5 6-13 0-3.5-2.5-7-6-7z" fill="currentColor" fill-opacity="0.2" />
    <circle cx="12" cy="9" r="3.2" fill="currentColor" />
    <circle cx="12" cy="3.5" r="1" fill="currentColor" />
  </symbol>
  <symbol id="icon-soulgem-homura" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2l5 7-5 13-5-13z" fill="currentColor" fill-opacity="0.2" />
    <polygon points="12,5 15,9 12,17 9,9" fill="currentColor" />
    <path d="M7 9h10" stroke-width="1.2" />
  </symbol>
  <symbol id="icon-soulgem-mami" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="12" cy="19" r="2.2" />
    <circle cx="5" cy="12" r="2.2" />
    <circle cx="19" cy="12" r="2.2" />
  </symbol>
  <symbol id="icon-soulgem-sayaka" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="13" r="5" fill="currentColor" fill-opacity="0.2" />
    <path d="M12 3v12a2.5 2.5 0 1 1-2-2.45M12 6c3 0 4 2 4 4" />
  </symbol>
  <symbol id="icon-soulgem-kyoko" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c1.5 3 5 5 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z" fill="currentColor" fill-opacity="0.2" />
    <path d="M12 9c1 1.5 2 2.5 2 4a2 2 0 0 1-4 0c0-1.5 1-2.5 2-4z" fill="currentColor" />
  </symbol>
  <symbol id="icon-madoka-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="21" x2="20" y2="4" stroke-width="1.8" />
    <polygon points="21,3 15,4 20,9" fill="currentColor" />
    <path d="M11 13c-2 0-3-2-2-4s2-2 4-2M15 9c0 2-2 3-4 2" />
  </symbol>
  <symbol id="icon-kyubey-halo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-20 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(20 12 12)" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </symbol>
  <symbol id="icon-musical-note" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="17" r="3" fill="currentColor" />
    <path d="M11 17V5l8-2v11" />
    <circle cx="16" cy="14" r="3" fill="currentColor" />
  </symbol>
  <symbol id="icon-magic-musket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <line x1="2" y1="20" x2="21" y2="5" stroke-width="2" />
    <path d="M2 20l2 2 3-1-1-3z" fill="currentColor" />
    <line x1="16" y1="6" x2="19" y2="9" />
    <line x1="10" y1="12" x2="8" y2="15" />
  </symbol>
  <symbol id="icon-ribbon-bow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="10" r="1.8" fill="currentColor" />
    <path d="M10.5 9.5C6 7 4 12 10.5 11z" fill="currentColor" fill-opacity="0.3" />
    <path d="M13.5 9.5C18 7 20 12 13.5 11z" fill="currentColor" fill-opacity="0.3" />
    <path d="M10.5 11.5L6 20M13.5 11.5L18 20" />
  </symbol>
  <symbol id="icon-pocky-sticks" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="5" y="10" width="8" height="12" rx="1" fill="currentColor" fill-opacity="0.18" />
    <line x1="7" y1="10" x2="7" y2="2" stroke-width="2" stroke-linecap="round" />
    <line x1="10" y1="10" x2="11" y2="3" stroke-width="2" stroke-linecap="round" />
    <line x1="15" y1="8" x2="19" y2="2" stroke-width="2" stroke-linecap="round" />
  </symbol>

  <!-- MAHOAKO (MAHOU SHOUJO NI AKOGARETE) -->
  <symbol id="icon-enormeeta-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2l2.8 6.5L21 11l-5.5 3.5L16 21l-4-4-4 4 0.5-6.5L3 11l6.2-2.5z" fill="currentColor" fill-opacity="0.2" />
    <polygon points="12,5 14,9 18,11 14,13 15,18 12,15 9,18 10,13 6,11 10,9" fill="currentColor" />
  </symbol>
  <symbol id="icon-utena-horns" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 19c-2-6 0-12 4-15 0 5-1 10-4 15z" fill="currentColor" fill-opacity="0.25" />
    <path d="M19 19c2-6 0-12-4-15 0 5 1 10 4 15z" fill="currentColor" fill-opacity="0.25" />
    <path d="M8 18c2 2 6 2 8 0" stroke-width="1.5" />
  </symbol>

  <!-- RE:ZERO KARA HAJIMERU ISEKAI SEIKATSU -->
  <symbol id="icon-rezero-butterfly" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 7v10" stroke-width="1.8" />
    <path d="M12 8c-3-5-9-4-9 2 0 4 5 6 9 2z" fill="currentColor" fill-opacity="0.22" />
    <path d="M12 8c3-5 9-4 9 2 0 4-5 6-9 2z" fill="currentColor" fill-opacity="0.22" />
    <path d="M12 12c-2.5 1-6 4-5 7 1.5 3 6-1 5-7z" fill="currentColor" fill-opacity="0.16" />
    <path d="M12 12c2.5 1 6 4 5 7-1.5 3-6-1-5-7z" fill="currentColor" fill-opacity="0.16" />
    <circle cx="10" cy="5" r="0.8" fill="currentColor" />
    <circle cx="14" cy="5" r="0.8" fill="currentColor" />
  </symbol>
  <symbol id="icon-rezero-maid-bow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="12" rx="2.5" ry="2" fill="currentColor" />
    <path d="M9.5 12C5 8 3 14 9.5 14.5z" fill="currentColor" fill-opacity="0.22" />
    <path d="M14.5 12C19 8 21 14 14.5 14.5z" fill="currentColor" fill-opacity="0.22" />
    <path d="M10 13.5L7 21l3-1.5 2 2" />
    <path d="M14 13.5L17 21l-3-1.5-2 2" />
  </symbol>
  <symbol id="icon-rezero-tome" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v16H6.5a2.5 2.5 0 0 0-2.5 2.5z" fill="currentColor" fill-opacity="0.16" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <circle cx="13" cy="9.5" r="3" fill="currentColor" fill-opacity="0.2" />
    <path d="M13 7.5v4M11 9.5h4" stroke-width="1.4" />
  </symbol>
  <symbol id="icon-rezero-witch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C6.5 2 4 6 4 11c0 6 5 11 8 11s8-5 8-11c0-5-2.5-9-8-9z" fill="currentColor" fill-opacity="0.18" />
    <path d="M12 6c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="currentColor" />
    <path d="M8 12c-1.5 2-2 4 0 6M16 12c1.5 2 2 4 0 6" stroke-width="1.2" />
  </symbol>
  <symbol id="icon-rezero-mabeast" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="8" fill="currentColor" fill-opacity="0.15" />
    <path d="M9 10l3-5 3 5" stroke-width="1.8" />
    <circle cx="9" cy="13" r="1.5" fill="currentColor" />
    <circle cx="15" cy="13" r="1.5" fill="currentColor" />
    <path d="M10 17c1 1 3 1 4 0" stroke-width="1.5" />
  </symbol>

  <!-- K-ON! -->
  <symbol id="icon-guitar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 13c2 2 4 1 5-1s0-4-2-5l-4-4 1-1-2-2-1 1-7 7c1 2 0 4-2 5s-3 3-1 5 3 0 5-2c1-1 3-1 5-1z" fill="currentColor" fill-opacity="0.18" />
    <circle cx="16" cy="9" r="1.5" fill="currentColor" />
    <line x1="5" y1="19" x2="13" y2="11" stroke-width="1.2" />
  </symbol>
  <symbol id="icon-tea-cup" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 8h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" fill="currentColor" fill-opacity="0.15" />
    <path d="M16 9h2a2.5 2.5 0 0 1 0 5h-2" />
    <line x1="2" y1="20" x2="18" y2="20" stroke-width="1.8" />
    <path d="M7 3c0.8 1 0.8 2 0 3M11 2c0.8 1 0.8 2 0 3" stroke-width="1.2" />
  </symbol>
  <symbol id="icon-cake-slice" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="4,18 20,18 20,11 4,14" fill="currentColor" fill-opacity="0.18" />
    <polygon points="4,14 20,11 15,6 3,11" />
    <circle cx="10" cy="6" r="2" fill="currentColor" />
    <line x1="4" y1="16" x2="20" y2="14.5" stroke-dasharray="2 1.5" />
  </symbol>

  <!-- HONORS & BADGES -->
  <symbol id="icon-star-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="9" r="6" fill="currentColor" fill-opacity="0.18" />
    <polygon points="12,5 13.5,7.8 16.5,8.2 14.2,10.3 14.8,13.3 12,11.8 9.2,13.3 9.8,10.3 7.5,8.2 10.5,7.8" fill="currentColor" />
    <path d="M8.5 14.5L7 22l5-2.5 5 2.5-1.5-7.5" />
  </symbol>
</svg>
`;

// Camadas normalizadas de fundo, refração e partículas (gerenciado via tsParticles)
const backgroundHTML = `
    <div class="theme-bg" id="theme-bg" aria-hidden="true">
        <video id="theme-bg-video" class="theme-bg-video" autoplay loop muted playsinline style="display: none;"></video>
    </div>
    <div class="theme-tint" id="theme-tint" aria-hidden="true"></div>
    <div id="tsparticles" aria-hidden="true"></div>
    <div id="anime-icons-sprite" style="display: none;" aria-hidden="true">
        ${animeIconsSpriteSVG}
    </div>
    <svg class="liquid-glass-svg-defs" style="position: absolute; width: 0; height: 0; pointer-events: none; overflow: hidden;" aria-hidden="true">
        <defs>
            <filter id="liquid-refract" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
    </svg>
`;

// Header with redesigned navigation + Cosmic Dynamic Island for mobile
const headerHTML = `
    <nav class="floating-header" id="floating-header">
        <!-- Barra de Navegação Desktop -->
        <div class="nav-links left-links desktop-only">
            <a href="/contato">Contato</a>
            <a href="/sobre">Sobre Mim</a>
        </div>
        
        <div class="nav-logo desktop-only">
            <a href="/" aria-label="Página Inicial">
                <img src="/assets/logo.svg" alt="Leonardo P. Soares Logo">
            </a>
        </div>
        
        <div class="nav-links right-links desktop-only">
            <a href="/projetos">Projetos</a>
            <a href="/blog">Blog Pessoal</a>
        </div>

        <div class="header-controls desktop-only">
            <button class="particles-toggle" id="particles-toggle" aria-label="Alternar partículas mágicas" title="Alternar partículas mágicas">
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

        <!-- Dynamic Island Mobile: Cápsula Flutuante Retraída -->
        <div class="mobile-island-bar mobile-only">
            <a href="/" class="island-brand-btn" aria-label="Página Inicial">
                <img src="/assets/logo.svg" alt="Logo" class="island-logo">
                <span class="island-brand-info">
                    <span class="island-brand-name">Leonardo</span>
                    <span class="island-current-crumb" id="island-current-crumb">Navegar</span>
                </span>
            </a>
            <div class="island-bar-actions">
                <button type="button" class="theme-toggle island-quick-btn" aria-label="Alternar tema" title="Alternar tema">
                    <svg class="eyepatch-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                        <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor"/>
                        <line x1="2" y1="4" x2="6" y2="7" stroke="currentColor" stroke-linecap="round"/>
                        <line x1="18" y1="17" x2="22" y2="20" stroke="currentColor" stroke-linecap="round"/>
                        <circle cx="12" cy="12" r="2.2" fill="var(--accent-gold)"/>
                    </svg>
                </button>
                <button type="button" class="island-trigger-btn" id="island-trigger-btn" aria-label="Abrir menu de navegação" aria-expanded="false">
                    <span class="island-pill-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span class="island-trigger-label">Menu</span>
                    <svg class="island-chevron-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Dynamic Island Mobile: Gaveta Expansível com Animação Fluida -->
        <div class="mobile-island-drawer mobile-only" id="mobile-island-drawer">
            <div class="island-drawer-header">
                <div class="island-header-left">
                    <span class="island-rune-tag">DESTINOS</span>
                    <h4 class="island-drawer-title">Menu Principal</h4>
                </div>
                <button type="button" class="island-close-btn" id="island-close-btn" aria-label="Fechar navegação">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div class="island-nav-grid">
                <a href="/" class="island-nav-card" data-nav="home">
                    <div class="island-card-icon-box">
                        <svg class="anime-icon"><use href="#icon-eyepatch"></use></svg>
                    </div>
                    <div class="island-card-details">
                        <span class="island-card-title">Início</span>
                        <span class="island-card-sub">Visão geral</span>
                    </div>
                </a>
                <a href="/sobre" class="island-nav-card" data-nav="sobre">
                    <div class="island-card-icon-box" style="color: var(--accent-rose);">
                        <svg class="anime-icon"><use href="#icon-soulgem-madoka"></use></svg>
                    </div>
                    <div class="island-card-details">
                        <span class="island-card-title">Sobre Mim</span>
                        <span class="island-card-sub">Setup & conquistas</span>
                    </div>
                </a>
                <a href="/projetos" class="island-nav-card" data-nav="projetos">
                    <div class="island-card-icon-box" style="color: var(--accent-emerald, #10b981);">
                        <svg class="anime-icon"><use href="#icon-locket"></use></svg>
                    </div>
                    <div class="island-card-details">
                        <span class="island-card-title">Projetos</span>
                        <span class="island-card-sub">Portfólio & código</span>
                    </div>
                </a>
                <a href="/blog" class="island-nav-card" data-nav="blog">
                    <div class="island-card-icon-box" style="color: var(--accent-amber, #f59e0b);">
                        <svg class="anime-icon"><use href="#icon-nanachi-hex"></use></svg>
                    </div>
                    <div class="island-card-details">
                        <span class="island-card-title">Blog</span>
                        <span class="island-card-sub">Artigos & relicário</span>
                    </div>
                </a>
                <a href="/contato" class="island-nav-card island-nav-card-full" data-nav="contato">
                    <div class="island-card-icon-box" style="color: var(--accent-gold, #f59e0b);">
                        <svg class="anime-icon"><use href="#icon-ribbon-bow"></use></svg>
                    </div>
                    <div class="island-card-details">
                        <span class="island-card-title">Contato</span>
                        <span class="island-card-sub">WhatsApp, GitHub & mensagem</span>
                    </div>
                </a>
            </div>

            <div class="island-footer-shelf">
                <span class="island-shelf-tag">SISTEMA</span>
                <div class="island-shelf-buttons">
                    <button type="button" class="theme-toggle island-shelf-pill" aria-label="Alternar tema">
                        <svg class="eyepatch-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                            <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor"/>
                            <line x1="2" y1="4" x2="6" y2="7" stroke="currentColor" stroke-linecap="round"/>
                            <line x1="18" y1="17" x2="22" y2="20" stroke="currentColor" stroke-linecap="round"/>
                            <circle cx="12" cy="12" r="2.2" fill="var(--accent-gold)"/>
                        </svg>
                        <span>Alternar Tema</span>
                    </button>
                    <button type="button" class="particles-toggle island-shelf-pill" aria-label="Alternar partículas">
                        <svg class="sparkle-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/>
                        </svg>
                        <span>Partículas</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
    <div class="island-backdrop" id="island-backdrop" aria-hidden="true"></div>
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
const themeCredits = {
    chuunibyou: 'Chuunibyou Demo Koi ga Shitai!',
    gosick: 'Gosick',
    abyss: 'Made in Abyss',
    madoka: 'Puella Magi Madoka Magica',
    mahoako: 'Mahou Shoujo ni Akogarete (MahoAko)',
    rezero: 'Re:Zero kara Hajimeru Isekai Seikatsu',
    kon: 'K-ON!'
};

function getThemeCredit() {
    const theme = document.body?.getAttribute('data-theme') || '';
    return themeCredits[theme] || '';
}

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

    <div class="theme-inspiration-footer" id="theme-inspiration-footer"></div>
`;

function injectLayout() {
    // Inject FontAwesome CDN dynamically
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // Inject background (com sprite SVG embutido) + header + popup at beginning of body
    if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', backgroundHTML + headerHTML + popupHTML);
    }

    // Inject footer at end of .content-wrapper
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Populate theme inspiration credit
    const credit = getThemeCredit();
    const inspirationEl = document.getElementById('theme-inspiration-footer');
    if (inspirationEl && credit) {
        inspirationEl.textContent = `Design desta página inspirado no anime "${credit}".`;
    }

    // Highlight current page in nav (Desktop and Mobile Dynamic Island)
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.nav-links a, .island-nav-card').forEach(link => {
        const href = (link.getAttribute('href') || '').replace(/\/+$/, '');
        if ((href === '' && currentPath === '') || (href && href !== '/' && currentPath.startsWith(href)) || (href === '/' && currentPath === '')) {
            link.classList.add('nav-active');
        }
    });

    // Dynamic Island interactions for mobile
    initDynamicIsland(currentPath);

    // Rotate and apply non-repeating background image
    initPageBackground();
}

function initDynamicIsland(currentPath) {
    const island = document.getElementById('floating-header');
    const trigger = document.getElementById('island-trigger-btn');
    const closeBtn = document.getElementById('island-close-btn');
    const backdrop = document.getElementById('island-backdrop');
    const currentCrumb = document.getElementById('island-current-crumb');
    const brandCrumb = document.querySelector('.island-brand-info');

    if (currentCrumb) {
        if (currentPath.startsWith('/sobre')) currentCrumb.textContent = 'Sobre Mim';
        else if (currentPath.startsWith('/projetos')) currentCrumb.textContent = 'Projetos';
        else if (currentPath.startsWith('/blog')) currentCrumb.textContent = 'Blog';
        else if (currentPath.startsWith('/contato')) currentCrumb.textContent = 'Contato';
        else if (currentPath.startsWith('/contrate-me')) currentCrumb.textContent = 'Profissional';
        else currentCrumb.textContent = 'Início';
    }

    function openIsland() {
        if (!island) return;
        island.classList.remove('header-hidden');
        island.classList.add('island-open');
        island.style.height = 'auto';
        if (backdrop) backdrop.classList.add('active');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function closeIsland() {
        if (!island) return;
        island.classList.remove('island-open');
        island.style.height = '';
        if (backdrop) backdrop.classList.remove('active');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    function toggleIsland(e) {
        if (e) {
            e.stopPropagation();
        }
        if (!island) return;
        if (island.classList.contains('island-open')) {
            closeIsland();
        } else {
            openIsland();
        }
    }

    if (trigger) {
        trigger.addEventListener('click', toggleIsland);
    }

    if (brandCrumb) {
        brandCrumb.addEventListener('click', (e) => {
            if (island && !island.classList.contains('island-open')) {
                e.preventDefault();
                e.stopPropagation();
                openIsland();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeIsland();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeIsland);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && island && island.classList.contains('island-open')) {
            closeIsland();
        }
    });

    document.querySelectorAll('.island-nav-card').forEach(link => {
        link.addEventListener('click', closeIsland);
    });
}

// ==========================================
// BACKGROUND ROTATOR — Carregador Dinâmico para Qualquer Imagem, GIF ou Vídeo
// Lê dinamicamente os arquivos das pastas específicas de cada página (sem listas fixas)
// ==========================================

const CANONICAL_FALLBACKS = {
    landing: '/assets/bg-chuunibyou.jpg',
    sobre: '/assets/bg-madoka.jpg',
    projetos: '/assets/bg-gosick.jpg',
    contato: '/assets/bg-kon.jpg',
    blog: '/assets/bg-abyss.jpg',
    'contrate-me': '/assets/bg-contrate.jpg'
};

function isVideoFile(fileName) {
    if (!fileName) return false;
    return /\.(mp4|webm|ogv|m4v|mov)(\?.*)?$/i.test(fileName);
}

function isGifFile(fileName) {
    if (!fileName) return false;
    return /\.gif(\?.*)?$/i.test(fileName);
}

function formatBgUrl(pageKey, folder, fileName) {
    return `/assets/backgrounds/${pageKey}/${folder}/${encodeURIComponent(fileName)}`;
}

function getPageBgKey() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('/sobre')) return 'sobre';
    if (path.includes('/projetos')) return 'projetos';
    if (path.includes('/contato')) return 'contato';
    if (path.includes('/blog') || path.includes('/posts/')) return 'blog';
    if (path.includes('contrate-me') || path.includes('/contrate-me')) return 'contrate-me';
    const theme = document.body?.getAttribute('data-theme');
    if (theme === 'madoka') return 'sobre';
    if (theme === 'gosick') return 'projetos';
    if (theme === 'kon') return 'contato';
    if (theme === 'abyss') return 'blog';
    if (theme === 'rezero' || theme === 'mahoako') return 'contrate-me';
    return 'landing';
}

function getActualDeviceFolder(pageManifest, isMobile) {
    if (!pageManifest) return 'desktop';
    if (isMobile && Array.isArray(pageManifest.mobile) && pageManifest.mobile.length > 0) {
        return 'mobile';
    }
    return 'desktop';
}

function getAvailableFiles(pageManifest, isMobile) {
    if (!pageManifest) return [];
    if (isMobile && Array.isArray(pageManifest.mobile) && pageManifest.mobile.length > 0) {
        return pageManifest.mobile;
    }
    if (Array.isArray(pageManifest.desktop) && pageManifest.desktop.length > 0) {
        return pageManifest.desktop;
    }
    return [];
}

/**
 * Embaralhamento sem repetição (Fisher-Yates Deck)
 * Retira exatamente um arquivo por visita.
 * NUNCA repete nenhum arquivo antes que TODOS os outros da pasta tenham sido exibidos.
 * Só recarrega o baralho quando todos tiverem aparecido.
 */
function getNextShuffledBackground(allFiles, pageKey) {
    if (!Array.isArray(allFiles) || allFiles.length === 0) return null;
    if (allFiles.length === 1) return allFiles[0];

    const deckKey = `bg_deck_${pageKey}`;
    const lastKey = `bg_last_${pageKey}`;

    let deck = [];
    try {
        const raw = localStorage.getItem(deckKey);
        if (raw) deck = JSON.parse(raw);
    } catch (e) {
        deck = [];
    }

    // Garante que o baralho só contenha arquivos que ainda existem na pasta
    if (Array.isArray(deck)) {
        deck = deck.filter(f => allFiles.includes(f));
    } else {
        deck = [];
    }

    // Se o baralho foi esgotado (todos já foram exibidos), cria novo ciclo completo aleatório
    if (deck.length === 0) {
        deck = [...allFiles];
        // Fisher-Yates Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Evita que o primeiro item do novo ciclo repita o último do ciclo anterior
        const lastShown = localStorage.getItem(lastKey);
        if (lastShown && deck.length > 1 && deck[deck.length - 1] === lastShown) {
            const swapIdx = Math.floor(Math.random() * (deck.length - 1));
            [deck[deck.length - 1], deck[swapIdx]] = [deck[swapIdx], deck[deck.length - 1]];
        }
    }

    // Pega o próximo arquivo do baralho
    const chosenFile = deck.pop();

    try {
        localStorage.setItem(deckKey, JSON.stringify(deck));
        localStorage.setItem(lastKey, chosenFile);
    } catch (e) {}

    return chosenFile;
}

function handleBackgroundError(pageKey, folder, badFile, fileList) {
    const deckKey = `bg_deck_${pageKey}`;
    try {
        let deck = JSON.parse(localStorage.getItem(deckKey) || '[]');
        deck = deck.filter(f => f !== badFile);
        localStorage.setItem(deckKey, JSON.stringify(deck));
    } catch (e) {}

    const remainingFiles = (fileList || []).filter(f => f !== badFile);
    if (remainingFiles.length > 0) {
        const nextFile = getNextShuffledBackground(remainingFiles, pageKey);
        if (nextFile) {
            applyBackgroundToDOM({
                url: formatBgUrl(pageKey, folder, nextFile),
                pageKey,
                folder,
                chosenFile: nextFile,
                fileList: remainingFiles
            });
            return;
        }
    }
    applyCanonicalFallback(pageKey);
}

function applyCanonicalFallback(pageKey) {
    const fallbackUrl = CANONICAL_FALLBACKS[pageKey] || CANONICAL_FALLBACKS['landing'];
    const themeBg = document.getElementById('theme-bg');
    const videoEl = document.getElementById('theme-bg-video');
    window._bgLoading = false;
    window._isCanonical = true;

    if (videoEl) {
        videoEl.pause();
        videoEl.style.display = 'none';
        videoEl.src = '';
    }
    if (themeBg && fallbackUrl) {
        const cssUrl = `url("${fallbackUrl}")`;
        themeBg.style.setProperty('background-image', cssUrl, 'important');
        if (document.body) {
            document.body.style.setProperty('--theme-bg-image', cssUrl, 'important');
            document.body.style.setProperty('--theme-bg-image-v', cssUrl, 'important');
        }
        document.documentElement.style.setProperty('--theme-bg-image', cssUrl, 'important');
        document.documentElement.style.setProperty('--theme-bg-image-v', cssUrl, 'important');
    }
}

function applyBackgroundToDOM(bgData) {
    if (!bgData || !bgData.url) {
        applyCanonicalFallback(getPageBgKey());
        return;
    }

    const { url, pageKey, folder, chosenFile, fileList } = bgData;
    const themeBg = document.getElementById('theme-bg');
    if (!themeBg) return;

    window._bgLoading = true;
    window._currentBgFile = chosenFile;
    let videoEl = document.getElementById('theme-bg-video');

    if (isVideoFile(url)) {
        if (!videoEl) {
            videoEl = document.createElement('video');
            videoEl.id = 'theme-bg-video';
            videoEl.className = 'theme-bg-video';
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.muted = true;
            videoEl.playsInline = true;
            themeBg.appendChild(videoEl);
        }

        videoEl.onerror = () => {
            console.warn('[Background] Vídeo inacessível ou removido:', url);
            window._bgLoading = false;
            handleBackgroundError(pageKey, folder, chosenFile, fileList);
        };

        videoEl.onloadeddata = () => {
            window._bgLoading = false;
            window._bgLoaded = true;
            window._isCanonical = false;
            videoEl.style.display = 'block';
            themeBg.style.setProperty('background-image', 'none', 'important');
            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        };

        videoEl.src = url;
        videoEl.load();
    } else {
        if (videoEl) {
            videoEl.pause();
            videoEl.style.display = 'none';
            videoEl.src = '';
        }

        const preloader = new Image();
        preloader.onload = () => {
            window._bgLoading = false;
            window._bgLoaded = true;
            window._isCanonical = false;
            const cssUrl = `url("${url}")`;
            themeBg.style.setProperty('background-image', cssUrl, 'important');
            if (document.body) {
                document.body.style.setProperty('--theme-bg-image', cssUrl, 'important');
                document.body.style.setProperty('--theme-bg-image-v', cssUrl, 'important');
            }
            document.documentElement.style.setProperty('--theme-bg-image', cssUrl, 'important');
            document.documentElement.style.setProperty('--theme-bg-image-v', cssUrl, 'important');
        };

        preloader.onerror = () => {
            console.warn('[Background] Imagem inacessível ou removida pelo usuário:', url);
            window._bgLoading = false;
            handleBackgroundError(pageKey, folder, chosenFile, fileList);
        };

        preloader.src = url;
    }
}

let _bgInitializedForPage = false;

function initPageBackground() {
    if (_bgInitializedForPage) return;

    const pageKey = getPageBgKey();
    const isMobile = window.innerWidth <= 768;

    // 1. Tenta carregar do cache síncrono do manifesto no localStorage para evitar FOUC
    let cachedManifest = null;
    try {
        const raw = localStorage.getItem('bg_manifest_data');
        if (raw) cachedManifest = JSON.parse(raw);
    } catch (e) {}

    if (cachedManifest && cachedManifest[pageKey]) {
        const files = getAvailableFiles(cachedManifest[pageKey], isMobile);
        const folder = getActualDeviceFolder(cachedManifest[pageKey], isMobile);
        if (files.length > 0) {
            const chosen = getNextShuffledBackground(files, pageKey);
            if (chosen) {
                _bgInitializedForPage = true;
                applyBackgroundToDOM({
                    url: formatBgUrl(pageKey, folder, chosen),
                    pageKey,
                    folder,
                    chosenFile: chosen,
                    fileList: files
                });
            }
        }
    }

    if (!_bgInitializedForPage) {
        applyCanonicalFallback(pageKey);
    }

    // 2. Busca o manifesto atualizado com cache-busting (?t=timestamp)
    if (typeof fetch === 'function') {
        fetch('/assets/backgrounds/manifest.json?t=' + Date.now())
            .then(res => res.ok ? res.json() : null)
            .then(remoteManifest => {
                if (remoteManifest && typeof remoteManifest === 'object') {
                    try {
                        localStorage.setItem('bg_manifest_data', JSON.stringify(remoteManifest));
                    } catch (e) {}

                    const pageManifest = remoteManifest[pageKey];
                    const files = getAvailableFiles(pageManifest, isMobile);
                    const folder = getActualDeviceFolder(pageManifest, isMobile);

                    if (files.length > 0) {
                        // Se não inicializou síncrono ou o arquivo exibido foi excluído da pasta
                        if (!_bgInitializedForPage || window._isCanonical || (window._currentBgFile && !files.includes(window._currentBgFile))) {
                            const chosen = getNextShuffledBackground(files, pageKey);
                            if (chosen) {
                                _bgInitializedForPage = true;
                                applyBackgroundToDOM({
                                    url: formatBgUrl(pageKey, folder, chosen),
                                    pageKey,
                                    folder,
                                    chosenFile: chosen,
                                    fileList: files
                                });
                            }
                        }
                    } else if (!_bgInitializedForPage) {
                        applyCanonicalFallback(pageKey);
                    }
                }
            })
            .catch(() => {});
    }
}

// Execute immediately
injectLayout();

