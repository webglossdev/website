// ═══════════════════════════════════════════════════════════════════
// Admin — Diagnóstico Técnico (webglossdev)
// ───────────────────────────────────────────────────────────────────
// Authentication: SHA-256 hash comparison (Web Crypto API).
//
// To change the admin password:
//   1. Compute SHA-256 of your new password. Example in Node.js:
//        const crypto = require('crypto');
//        console.log(crypto.createHash('sha256').update('YourPassword').digest('hex'));
//      Or use any online SHA-256 tool.
//   2. Replace the value of ADMIN_PASSWORD_HASH below with your new hash.
//
// Default password: "CalOlimpico@Admin"
// ═══════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─── Auth Config ─────────────────────────────────────────────
    const ADMIN_PASSWORD_HASH = '315b0921c11ccc2c5066cb1459de9fe0b221ea29bf08682653a74a16e95c894a';

    const SESSION_KEY         = 'ajuda_admin_auth';
    const ATTEMPTS_KEY        = 'ajuda_admin_attempts';
    const LOCKOUT_KEY         = 'ajuda_admin_lockout';
    const MAX_ATTEMPTS        = 5;
    const LOCKOUT_DURATION_MS = 60_000;

    // ─── State ───────────────────────────────────────────────────
    let quizData = { config: {}, fluxo: {}, resultados: {} };
    let activeTab = 'config';
    let expandedFluxo = new Set();
    let expandedResultados = new Set();
    let newNodeCounter = 0;
    let pendingDeleteAction = null;

    // ─── DOM ─────────────────────────────────────────────────────
    const loginScreen    = document.getElementById('login-screen');
    const adminScreen    = document.getElementById('admin-screen');
    const loginForm      = document.getElementById('login-form');
    const passwordInput  = document.getElementById('password-input');
    const loginError     = document.getElementById('login-error');
    const loginErrorText = document.getElementById('login-error-text');
    const loginLockout   = document.getElementById('login-lockout');
    const lockoutCountdown = document.getElementById('lockout-countdown');
    const loginBtn       = document.getElementById('login-btn');
    const loginBtnText   = document.getElementById('login-btn-text');
    const loginSpinner   = document.getElementById('login-spinner');
    const logoutBtn      = document.getElementById('logout-btn');
    const exportBtn      = document.getElementById('export-btn');

    const tabBtns        = document.querySelectorAll('.tab-btn');
    const panelConfig    = document.getElementById('panel-config');
    const panelFluxo     = document.getElementById('panel-fluxo');
    const panelResultados = document.getElementById('panel-resultados');

    const cfgVersion     = document.getElementById('cfg-version');
    const cfgCurrency    = document.getElementById('cfg-currency');
    const cfgTaxa        = document.getElementById('cfg-taxa');
    const cfgWhatsapp    = document.getElementById('cfg-whatsapp');
    const cfgSave        = document.getElementById('cfg-save');

    const fluxoSearch    = document.getElementById('fluxo-search');
    const fluxoList      = document.getElementById('fluxo-list');
    const fluxoCount     = document.getElementById('fluxo-count');
    const fluxoEmpty     = document.getElementById('fluxo-empty');
    const addFluxoBtn    = document.getElementById('add-fluxo-btn');

    const resultSearch   = document.getElementById('result-search');
    const resultList     = document.getElementById('result-list');
    const resultCount    = document.getElementById('result-count');
    const resultEmpty    = document.getElementById('result-empty');
    const addResultBtn   = document.getElementById('add-result-btn');

    const confirmDialog  = document.getElementById('confirm-dialog');
    const confirmTitle   = document.getElementById('confirm-title');
    const confirmText    = document.getElementById('confirm-text');
    const confirmCancel  = document.getElementById('confirm-cancel');
    const confirmDelete  = document.getElementById('confirm-delete');

    const datalist       = document.getElementById('all-node-ids');

    // ═══════════════════════════════════════════════════════════
    // Crypto
    // ═══════════════════════════════════════════════════════════
    async function sha256(text) {
        const buf = new TextEncoder().encode(text);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ═══════════════════════════════════════════════════════════
    // Auth
    // ═══════════════════════════════════════════════════════════
    function isAuthenticated() {
        return sessionStorage.getItem(SESSION_KEY) === ADMIN_PASSWORD_HASH;
    }

    function setAuth(value) {
        if (value) {
            sessionStorage.setItem(SESSION_KEY, ADMIN_PASSWORD_HASH);
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }

    function isLockedOut() {
        return Date.now() < parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10);
    }

    function lockoutRemainingSeconds() {
        const until = parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10);
        return Math.max(0, Math.ceil((until - Date.now()) / 1000));
    }

    function recordFailedAttempt() {
        const attempts = parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
        if (attempts >= MAX_ATTEMPTS) {
            sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_DURATION_MS));
            sessionStorage.setItem(ATTEMPTS_KEY, '0');
            startLockoutCountdown();
        } else {
            sessionStorage.setItem(ATTEMPTS_KEY, String(attempts));
            const remaining = MAX_ATTEMPTS - attempts;
            showLoginError(`Senha incorreta. ${remaining} tentativa${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}.`);
        }
    }

    function clearRateLimitState() {
        sessionStorage.removeItem(ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_KEY);
    }

    let lockoutTimer = null;

    function startLockoutCountdown() {
        loginError.classList.add('hidden');
        loginLockout.classList.remove('hidden');
        passwordInput.disabled = true;
        loginBtn.disabled = true;

        function tick() {
            const secs = lockoutRemainingSeconds();
            lockoutCountdown.textContent = secs;
            if (secs <= 0) {
                loginLockout.classList.add('hidden');
                passwordInput.disabled = false;
                loginBtn.disabled = false;
                passwordInput.focus();
                lockoutTimer = null;
            } else {
                lockoutTimer = setTimeout(tick, 1000);
            }
        }
        tick();
    }

    function guardAdmin() {
        if (!isAuthenticated()) {
            handleLogout();
            return false;
        }
        return true;
    }

    function showLoginError(msg) {
        loginErrorText.textContent = msg;
        loginError.classList.remove('hidden');
    }

    function showLoginScreen() {
        loginScreen.classList.remove('hidden');
        adminScreen.classList.add('hidden');
        confirmDialog.classList.add('hidden');
        passwordInput.value = '';
        loginError.classList.add('hidden');
        loginLockout.classList.add('hidden');
        if (isLockedOut()) startLockoutCountdown();
    }

    function showAdminScreen() {
        loginScreen.classList.add('hidden');
        adminScreen.classList.remove('hidden');
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (isLockedOut()) return;

        const pwd = passwordInput.value.trim();
        if (!pwd) return;

        loginBtnText.textContent = 'Verificando...';
        loginSpinner.classList.remove('hidden');
        loginError.classList.add('hidden');

        try {
            const hash = await sha256(pwd);
            if (hash === ADMIN_PASSWORD_HASH) {
                clearRateLimitState();
                setAuth(true);
                showAdminScreen();
                await loadData();
            } else {
                passwordInput.value = '';
                passwordInput.focus();
                recordFailedAttempt();
            }
        } catch (err) {
            console.error('Auth error:', err);
            showLoginError('Erro ao verificar a senha.');
        } finally {
            loginBtnText.textContent = 'Entrar';
            loginSpinner.classList.add('hidden');
        }
    }

    function handleLogout() {
        setAuth(false);
        quizData = { config: {}, fluxo: {}, resultados: {} };
        expandedFluxo.clear();
        expandedResultados.clear();
        if (lockoutTimer) { clearTimeout(lockoutTimer); lockoutTimer = null; }
        showLoginScreen();
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !adminScreen.classList.contains('hidden')) {
            if (!isAuthenticated()) handleLogout();
        }
    });

    // ═══════════════════════════════════════════════════════════
    // Data Loading
    // ═══════════════════════════════════════════════════════════
    async function loadData() {
        try {
            const base = new URL('./', window.location.href).href;
            const res = await fetch(base + 'quiz.json?_=' + Date.now());
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            quizData.config = data.config || {};
            quizData.fluxo = data.fluxo || {};
            quizData.resultados = data.resultados || {};
        } catch (err) {
            quizData = { config: {}, fluxo: {}, resultados: {} };
            showToast('Erro ao carregar quiz.json: ' + err.message, 'error');
        }
        renderAll();
    }

    // ═══════════════════════════════════════════════════════════
    // Tabs
    // ═══════════════════════════════════════════════════════════
    function switchTab(tabName) {
        activeTab = tabName;
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        panelConfig.classList.toggle('hidden', tabName !== 'config');
        panelFluxo.classList.toggle('hidden', tabName !== 'fluxo');
        panelResultados.classList.toggle('hidden', tabName !== 'resultados');
    }

    // ═══════════════════════════════════════════════════════════
    // Render All
    // ═══════════════════════════════════════════════════════════
    function renderAll() {
        renderConfig();
        renderFluxo();
        renderResultados();
        updateDatalist();
    }

    // ═══════════════════════════════════════════════════════════
    // Node ID helpers
    // ═══════════════════════════════════════════════════════════
    function getAllNodeIds() {
        return [...Object.keys(quizData.fluxo || {}), ...Object.keys(quizData.resultados || {})];
    }

    function nodeExists(id) {
        return !!(quizData.fluxo[id] || quizData.resultados[id]);
    }

    function updateDatalist() {
        const ids = getAllNodeIds();
        datalist.innerHTML = ids.map(id => `<option value="${escAttr(id)}">`).join('');
    }

    function getReferencingNodes(targetId) {
        const refs = [];
        for (const [key, node] of Object.entries(quizData.fluxo || {})) {
            if (node.opcoes) {
                for (const opt of node.opcoes) {
                    if (opt.next === targetId) {
                        refs.push(key);
                        break;
                    }
                }
            }
        }
        return refs;
    }

    // ═══════════════════════════════════════════════════════════
    // Config
    // ═══════════════════════════════════════════════════════════
    function renderConfig() {
        cfgVersion.value  = quizData.config.version || '';
        cfgCurrency.value = quizData.config.currency || '';
        cfgTaxa.value     = quizData.config.taxa_base_diagnostico ?? '';
        cfgWhatsapp.value = quizData.config.whatsapp_number || '';
    }

    function saveConfig() {
        if (!guardAdmin()) return;
        quizData.config.version = cfgVersion.value.trim();
        quizData.config.currency = cfgCurrency.value.trim();
        const taxa = parseFloat(cfgTaxa.value);
        quizData.config.taxa_base_diagnostico = isNaN(taxa) ? 0 : taxa;
        quizData.config.whatsapp_number = cfgWhatsapp.value.trim();
        showToast('Configurações salvas.', 'success');
    }

    // ═══════════════════════════════════════════════════════════
    // Fluxo
    // ═══════════════════════════════════════════════════════════
    function renderFluxo() {
        const query = (fluxoSearch.value || '').toLowerCase().trim();
        const entries = Object.entries(quizData.fluxo || {});

        const filtered = entries.filter(([id, node]) => {
            if (!query) return true;
            return id.toLowerCase().includes(query) ||
                   (node.pergunta || '').toLowerCase().includes(query);
        });

        fluxoCount.textContent = `${filtered.length} de ${entries.length} nó${entries.length !== 1 ? 's' : ''}`;

        if (filtered.length === 0) {
            fluxoList.innerHTML = '';
            fluxoEmpty.classList.remove('hidden');
            return;
        }
        fluxoEmpty.classList.add('hidden');

        fluxoList.innerHTML = filtered.map(([id, node]) => {
            const isExpanded = expandedFluxo.has(id);
            return buildFluxoCardHTML(id, node, isExpanded);
        }).join('');

        bindFluxoEvents();
    }

    function buildFluxoCardHTML(id, node, isExpanded) {
        const opCount = (node.opcoes || []).length;
        const isStart = id === 'inicio';

        // Check for orphan references
        const orphanCount = (node.opcoes || []).filter(o => o.next && !nodeExists(o.next)).length;

        const cardClass = `node-card${isExpanded ? ' expanded' : ''}`;

        // Collapsed view
        const summaryText = node.pergunta
            ? `"${escHtml(truncate(node.pergunta, 60))}"`
            : '<em style="color:var(--faint)">Sem pergunta</em>';

        let metaHtml = `${opCount} opç${opCount !== 1 ? 'ões' : 'ão'}`;
        if (orphanCount > 0) {
            metaHtml += ` · <span class="orphan-warn">⚠ ${orphanCount} ref. inválida${orphanCount !== 1 ? 's' : ''}</span>`;
        }

        // Expanded body
        let bodyHtml = '';
        if (isExpanded) {
            const optionsHtml = (node.opcoes || []).length > 0
                ? (node.opcoes || []).map((opt, i) => {
                    const nextOrphan = opt.next && !nodeExists(opt.next) ? ' orphan-ref' : '';
                    return `
                    <div class="option-row">
                        <span class="opt-num">${i + 1}</span>
                        <input class="admin-input opt-label-input" value="${escAttr(opt.label || '')}" placeholder="Texto da opção">
                        <span class="opt-arrow">→</span>
                        <input class="admin-input input-mono opt-next-input${nextOrphan}" value="${escAttr(opt.next || '')}" placeholder="ID destino" list="all-node-ids">
                        <button class="btn-icon" data-action="remove-option" data-node-id="${escAttr(id)}" data-opt-idx="${i}" title="Remover opção">✕</button>
                    </div>`;
                }).join('')
                : '<div class="options-empty">Nenhuma opção. Clique em "+ Opção" para começar.</div>';

            bodyHtml = `
            <div class="node-divider"></div>
            <div class="field-group">
                <label class="field-label">ID do Nó</label>
                <input class="admin-input input-mono node-id-input" value="${escAttr(id)}" placeholder="ex: hardware_tipo">
            </div>
            <div class="field-group">
                <label class="field-label">Pergunta</label>
                <input class="admin-input node-pergunta" value="${escAttr(node.pergunta || '')}" placeholder="Qual o seu tipo de problema?">
            </div>
            <div class="field-group">
                <div class="options-header">
                    <label class="field-label" style="margin-bottom:0">Opções</label>
                    <button class="btn btn-ghost btn-sm" data-action="add-option" data-node-id="${escAttr(id)}">+ Opção</button>
                </div>
                <div class="options-list">${optionsHtml}</div>
            </div>
            <div class="node-actions">
                <button class="btn btn-success btn-sm" data-action="save" data-node-id="${escAttr(id)}">✓ Salvar</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-node-id="${escAttr(id)}">Excluir</button>
                <button class="btn btn-ghost btn-sm" data-action="close" data-node-id="${escAttr(id)}">Fechar</button>
            </div>`;
        }

        return `
        <div class="${cardClass}" data-node-id="${escAttr(id)}">
            <div class="node-header" data-action="toggle" data-node-id="${escAttr(id)}">
                <div class="node-info">
                    <div>
                        <span class="node-id-badge">${escHtml(id)}</span>
                        ${isStart ? '<span class="node-start-badge">⚡ Início</span>' : ''}
                    </div>
                    <div class="node-summary">${summaryText}</div>
                    <div class="node-meta">${metaHtml}</div>
                </div>
                <span class="node-toggle">▼</span>
            </div>
            <div class="node-body">${bodyHtml}</div>
        </div>`;
    }

    function bindFluxoEvents() {
        fluxoList.onclick = handleFluxoClick;
    }

    function handleFluxoClick(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        if (!guardAdmin()) return;

        const action = target.dataset.action;
        const nodeId = target.dataset.nodeId;

        switch (action) {
            case 'toggle':
            case 'close':
                if (expandedFluxo.has(nodeId)) expandedFluxo.delete(nodeId);
                else expandedFluxo.add(nodeId);
                renderFluxo();
                break;
            case 'save':
                saveFluxoNode(nodeId);
                break;
            case 'delete':
                promptDeleteFluxo(nodeId);
                break;
            case 'add-option':
                addFluxoOption(nodeId);
                break;
            case 'remove-option':
                removeFluxoOption(nodeId, parseInt(target.dataset.optIdx, 10));
                break;
        }
    }

    function collectFluxoFromDOM(nodeId) {
        const card = fluxoList.querySelector(`.node-card[data-node-id="${CSS.escape(nodeId)}"]`);
        if (!card) return null;

        const newId = card.querySelector('.node-id-input').value.trim();
        const pergunta = card.querySelector('.node-pergunta').value.trim();
        const options = Array.from(card.querySelectorAll('.option-row')).map(row => ({
            label: row.querySelector('.opt-label-input').value.trim(),
            next: row.querySelector('.opt-next-input').value.trim()
        }));

        return { newId, pergunta, options };
    }

    function saveFluxoNode(oldId) {
        const data = collectFluxoFromDOM(oldId);
        if (!data) return;

        const { newId, pergunta, options } = data;

        if (!newId) { showToast('ID do nó é obrigatório.', 'error'); return; }
        if (!/^[a-zA-Z0-9_]+$/.test(newId)) {
            showToast('ID deve conter apenas letras, números e underscores.', 'error');
            return;
        }
        if (!pergunta) { showToast('A pergunta é obrigatória.', 'error'); return; }

        // Check duplicate ID (only if changed)
        if (newId !== oldId && (quizData.fluxo[newId] || quizData.resultados[newId])) {
            showToast(`ID "${newId}" já existe.`, 'error');
            return;
        }

        const nodeData = {
            pergunta,
            opcoes: options.filter(o => o.label || o.next)
        };

        // If ID changed, update references
        if (newId !== oldId) {
            delete quizData.fluxo[oldId];
            for (const key in quizData.fluxo) {
                if (quizData.fluxo[key].opcoes) {
                    quizData.fluxo[key].opcoes.forEach(opt => {
                        if (opt.next === oldId) opt.next = newId;
                    });
                }
            }
            expandedFluxo.delete(oldId);
            expandedFluxo.add(newId);
        }

        quizData.fluxo[newId] = nodeData;
        updateDatalist();
        renderFluxo();
        showToast(`Nó "${newId}" salvo com sucesso.`, 'success');
    }

    function addFluxoNode() {
        if (!guardAdmin()) return;
        newNodeCounter++;
        const id = `novo_no_${newNodeCounter}`;
        quizData.fluxo[id] = { pergunta: '', opcoes: [] };
        expandedFluxo.add(id);
        updateDatalist();
        renderFluxo();

        requestAnimationFrame(() => {
            const card = fluxoList.querySelector(`.node-card[data-node-id="${id}"]`);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        showToast('Novo nó adicionado. Edite e salve.', 'info');
    }

    function addFluxoOption(nodeId) {
        // Collect current state from DOM first
        const data = collectFluxoFromDOM(nodeId);
        if (data) {
            quizData.fluxo[nodeId] = {
                pergunta: data.pergunta,
                opcoes: data.options.concat([{ label: '', next: '' }])
            };
        } else {
            // Fallback: add to data directly
            if (!quizData.fluxo[nodeId].opcoes) quizData.fluxo[nodeId].opcoes = [];
            quizData.fluxo[nodeId].opcoes.push({ label: '', next: '' });
        }
        renderFluxo();
    }

    function removeFluxoOption(nodeId, optIdx) {
        // Collect current state from DOM first
        const data = collectFluxoFromDOM(nodeId);
        if (data) {
            data.options.splice(optIdx, 1);
            quizData.fluxo[nodeId] = {
                pergunta: data.pergunta,
                opcoes: data.options
            };
        } else {
            if (quizData.fluxo[nodeId].opcoes) {
                quizData.fluxo[nodeId].opcoes.splice(optIdx, 1);
            }
        }
        renderFluxo();
    }

    function promptDeleteFluxo(id) {
        const refs = getReferencingNodes(id);
        let msg = `Tem certeza que deseja remover o nó "${id}"?`;
        if (refs.length > 0) {
            msg += ` Ele é referenciado por: ${refs.join(', ')}.`;
        }
        openConfirmDialog('Remover Nó de Fluxo', msg, () => {
            delete quizData.fluxo[id];
            expandedFluxo.delete(id);
            updateDatalist();
            renderFluxo();
            showToast(`Nó "${id}" removido.`, 'info');
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Resultados
    // ═══════════════════════════════════════════════════════════
    function renderResultados() {
        const query = (resultSearch.value || '').toLowerCase().trim();
        const entries = Object.entries(quizData.resultados || {});

        const filtered = entries.filter(([id, node]) => {
            if (!query) return true;
            return id.toLowerCase().includes(query) ||
                   (node.titulo || '').toLowerCase().includes(query) ||
                   (node.descricao || '').toLowerCase().includes(query);
        });

        resultCount.textContent = `${filtered.length} de ${entries.length} resultado${entries.length !== 1 ? 's' : ''}`;

        if (filtered.length === 0) {
            resultList.innerHTML = '';
            resultEmpty.classList.remove('hidden');
            return;
        }
        resultEmpty.classList.add('hidden');

        resultList.innerHTML = filtered.map(([id, node]) => {
            const isExpanded = expandedResultados.has(id);
            return buildResultadoCardHTML(id, node, isExpanded);
        }).join('');

        bindResultadoEvents();
    }

    function buildResultadoCardHTML(id, node, isExpanded) {
        const cardClass = `node-card${isExpanded ? ' expanded' : ''}`;

        const summaryText = node.titulo
            ? escHtml(truncate(node.titulo, 50))
            : '<em style="color:var(--faint)">Sem título</em>';

        let metaHtml = '';
        if (node.investimento_estimado) metaHtml += escHtml(node.investimento_estimado);
        if (node.prazo_medio) metaHtml += (metaHtml ? ' · ' : '') + escHtml(node.prazo_medio);
        if (!metaHtml) metaHtml = 'Sem detalhes';

        let bodyHtml = '';
        if (isExpanded) {
            bodyHtml = `
            <div class="node-divider"></div>
            <div class="field-group">
                <label class="field-label">ID do Resultado</label>
                <input class="admin-input input-mono node-id-input" value="${escAttr(id)}" placeholder="ex: resumo_hardware_mudo">
            </div>
            <div class="field-group">
                <label class="field-label">Título</label>
                <input class="admin-input node-titulo" value="${escAttr(node.titulo || '')}" placeholder="Título do resultado">
            </div>
            <div class="field-group">
                <label class="field-label">Descrição</label>
                <textarea class="admin-textarea node-descricao" placeholder="Descrição detalhada do serviço...">${escHtml(node.descricao || '')}</textarea>
            </div>
            <div class="field-row">
                <div class="field-group">
                    <label class="field-label">Investimento Estimado</label>
                    <input class="admin-input node-investimento" value="${escAttr(node.investimento_estimado || '')}" placeholder="R$ 150 - R$ 450">
                </div>
                <div class="field-group">
                    <label class="field-label">Prazo Médio</label>
                    <input class="admin-input node-prazo" value="${escAttr(node.prazo_medio || '')}" placeholder="3 a 7 dias úteis">
                </div>
            </div>
            <div class="field-group">
                <label class="field-label">Mensagem WhatsApp</label>
                <textarea class="admin-textarea node-whatsapp-msg" placeholder="Mensagem pré-preenchida para o WhatsApp...">${escHtml(node.whatsapp_msg || '')}</textarea>
            </div>
            <div class="node-actions">
                <button class="btn btn-success btn-sm" data-action="save" data-node-id="${escAttr(id)}">✓ Salvar</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-node-id="${escAttr(id)}">Excluir</button>
                <button class="btn btn-ghost btn-sm" data-action="close" data-node-id="${escAttr(id)}">Fechar</button>
            </div>`;
        }

        return `
        <div class="${cardClass}" data-node-id="${escAttr(id)}">
            <div class="node-header" data-action="toggle" data-node-id="${escAttr(id)}">
                <div class="node-info">
                    <span class="node-id-badge">${escHtml(id)}</span>
                    <div class="node-summary">${summaryText}</div>
                    <div class="node-meta">${metaHtml}</div>
                </div>
                <span class="node-toggle">▼</span>
            </div>
            <div class="node-body">${bodyHtml}</div>
        </div>`;
    }

    function bindResultadoEvents() {
        resultList.onclick = handleResultadoClick;
    }

    function handleResultadoClick(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        if (!guardAdmin()) return;

        const action = target.dataset.action;
        const nodeId = target.dataset.nodeId;

        switch (action) {
            case 'toggle':
            case 'close':
                if (expandedResultados.has(nodeId)) expandedResultados.delete(nodeId);
                else expandedResultados.add(nodeId);
                renderResultados();
                break;
            case 'save':
                saveResultadoNode(nodeId);
                break;
            case 'delete':
                promptDeleteResultado(nodeId);
                break;
        }
    }

    function collectResultadoFromDOM(nodeId) {
        const card = resultList.querySelector(`.node-card[data-node-id="${CSS.escape(nodeId)}"]`);
        if (!card) return null;

        return {
            newId: card.querySelector('.node-id-input').value.trim(),
            titulo: card.querySelector('.node-titulo').value.trim(),
            descricao: card.querySelector('.node-descricao').value.trim(),
            investimento_estimado: card.querySelector('.node-investimento').value.trim(),
            prazo_medio: card.querySelector('.node-prazo').value.trim(),
            whatsapp_msg: card.querySelector('.node-whatsapp-msg').value.trim()
        };
    }

    function saveResultadoNode(oldId) {
        const data = collectResultadoFromDOM(oldId);
        if (!data) return;

        const { newId, titulo, descricao, investimento_estimado, prazo_medio, whatsapp_msg } = data;

        if (!newId) { showToast('ID do resultado é obrigatório.', 'error'); return; }
        if (!/^[a-zA-Z0-9_]+$/.test(newId)) {
            showToast('ID deve conter apenas letras, números e underscores.', 'error');
            return;
        }
        if (!titulo) { showToast('O título é obrigatório.', 'error'); return; }

        if (newId !== oldId && (quizData.fluxo[newId] || quizData.resultados[newId])) {
            showToast(`ID "${newId}" já existe.`, 'error');
            return;
        }

        const nodeData = { titulo, descricao, investimento_estimado, prazo_medio, whatsapp_msg };

        if (newId !== oldId) {
            delete quizData.resultados[oldId];
            // Update references in fluxo
            for (const key in quizData.fluxo) {
                if (quizData.fluxo[key].opcoes) {
                    quizData.fluxo[key].opcoes.forEach(opt => {
                        if (opt.next === oldId) opt.next = newId;
                    });
                }
            }
            expandedResultados.delete(oldId);
            expandedResultados.add(newId);
        }

        quizData.resultados[newId] = nodeData;
        updateDatalist();
        renderResultados();
        showToast(`Resultado "${newId}" salvo com sucesso.`, 'success');
    }

    function addResultadoNode() {
        if (!guardAdmin()) return;
        newNodeCounter++;
        const id = `novo_resultado_${newNodeCounter}`;
        quizData.resultados[id] = {
            titulo: '',
            descricao: '',
            investimento_estimado: '',
            prazo_medio: '',
            whatsapp_msg: ''
        };
        expandedResultados.add(id);
        updateDatalist();
        renderResultados();

        requestAnimationFrame(() => {
            const card = resultList.querySelector(`.node-card[data-node-id="${id}"]`);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        showToast('Novo resultado adicionado. Edite e salve.', 'info');
    }

    function promptDeleteResultado(id) {
        const refs = getReferencingNodes(id);
        let msg = `Tem certeza que deseja remover o resultado "${id}"?`;
        if (refs.length > 0) {
            msg += ` Ele é referenciado por: ${refs.join(', ')}.`;
        }
        openConfirmDialog('Remover Resultado', msg, () => {
            delete quizData.resultados[id];
            expandedResultados.delete(id);
            updateDatalist();
            renderResultados();
            showToast(`Resultado "${id}" removido.`, 'info');
        });
    }

    // ═══════════════════════════════════════════════════════════
    // Confirm Dialog
    // ═══════════════════════════════════════════════════════════
    function openConfirmDialog(title, text, onConfirm) {
        confirmTitle.textContent = title;
        confirmText.textContent = text;
        pendingDeleteAction = onConfirm;
        confirmDialog.classList.remove('hidden');
    }

    function closeConfirmDialog() {
        confirmDialog.classList.add('hidden');
        pendingDeleteAction = null;
    }

    function executeDelete() {
        if (pendingDeleteAction) {
            pendingDeleteAction();
        }
        closeConfirmDialog();
    }

    // ═══════════════════════════════════════════════════════════
    // Export JSON
    // ═══════════════════════════════════════════════════════════
    function exportJSON() {
        if (!guardAdmin()) return;
        const json = JSON.stringify(quizData, null, 4);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quiz.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('quiz.json exportado. Substitua o arquivo no repositório.', 'success');
    }

    // ═══════════════════════════════════════════════════════════
    // Toast
    // ═══════════════════════════════════════════════════════════
    let toastTimer = null;
    const toast    = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    function showToast(msg, type) {
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        toastIcon.textContent = icons[type] || 'ℹ️';
        toastMsg.textContent = msg;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
    }

    // ═══════════════════════════════════════════════════════════
    // Utility
    // ═══════════════════════════════════════════════════════════
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escAttr(str) {
        return String(str).replace(/"/g, '&quot;').replace(/&/g, '&amp;');
    }

    function truncate(str, len) {
        if (!str) return '';
        return str.length > len ? str.slice(0, len) + '…' : str;
    }

    // ═══════════════════════════════════════════════════════════
    // Event Bindings
    // ═══════════════════════════════════════════════════════════
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    exportBtn.addEventListener('click', exportJSON);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    cfgSave.addEventListener('click', saveConfig);
    addFluxoBtn.addEventListener('click', addFluxoNode);
    addResultBtn.addEventListener('click', addResultadoNode);

    fluxoSearch.addEventListener('input', () => renderFluxo());
    resultSearch.addEventListener('input', () => renderResultados());

    confirmCancel.addEventListener('click', closeConfirmDialog);
    confirmDelete.addEventListener('click', executeDelete);
    document.querySelector('.dialog-backdrop')?.addEventListener('click', closeConfirmDialog);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (!confirmDialog.classList.contains('hidden')) closeConfirmDialog();
        }
    });

    // ═══════════════════════════════════════════════════════════
    // Init
    // ═══════════════════════════════════════════════════════════
    if (isAuthenticated()) {
        showAdminScreen();
        loadData();
    } else {
        showLoginScreen();
    }

})();
