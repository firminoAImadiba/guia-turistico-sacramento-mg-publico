/* ==========================================================================
   Guia Virtual de Sacramento - MG (versão PÚBLICO)
   Navegação por correntes de botões — sem digitação.
   Dados em assets/js/nos-data.js (NOS_DATA + TEMAS). 6 temas x 36 nós.
   ========================================================================== */
'use strict';

/* ---- 1. Referências de DOM ---------------------------------------------- */
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');
const typingPhase = document.getElementById('typingPhase');
const shortcutsContainer = document.getElementById('shortcutsContainer');
const shortcutButtons = document.querySelectorAll('[data-tema]');
const optionsContainer = document.getElementById('optionsContainer');

/* ---- 2. Estado ----------------------------------------------------------- */
let isBusy = false;
let currentTema = null;
let currentNum = null;
let visitCount = 0;

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 3. Atalhos: fade nas bordas ------------------------------------------ */
function updateShortcutsFade() {
    if (!shortcutsContainer) return;
    const maxScroll = shortcutsContainer.scrollWidth - shortcutsContainer.clientWidth;
    const x = shortcutsContainer.scrollLeft;
    shortcutsContainer.style.setProperty('--fade-l', x > 4 ? '1' : '0');
    shortcutsContainer.style.setProperty('--fade-r', x < maxScroll - 4 ? '1' : '0');
}

if (shortcutsContainer) {
    shortcutsContainer.addEventListener('scroll', updateShortcutsFade, { passive: true });
    window.addEventListener('resize', updateShortcutsFade);
    updateShortcutsFade();
}

/* ---- 4. Utilidades -------------------------------------------------------- */
function scrollToBottom() {
    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
}

function formatTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function wait(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
}

function getNode(tema, num) {
    const list = NOS_DATA[tema];
    if (!list) return null;
    const key = String(num).padStart(2, '0');
    for (let i = 0; i < list.length; i++) {
        if (list[i].num === key) return list[i];
    }
    return null;
}

function temaTitulo(id) {
    for (let i = 0; i < TEMAS.length; i++) {
        if (TEMAS[i].id === id) return TEMAS[i].titulo;
    }
    return id;
}

/* ---- 5. Indicador "IA trabalhando" ---------------------------------------- */
const AI_PHASES = [
    'Consultando acervo local...',
    'Organizando a resposta...',
    'Digitando...'
];

function showTyping() {
    typingIndicator.classList.remove('hidden');
    typingIndicator.classList.add('flex');
    scrollToBottom();
}

function hideTyping() {
    typingIndicator.classList.add('hidden');
    typingIndicator.classList.remove('flex');
}

async function aiThink(textLen) {
    // Delay proporcional ao tamanho, com variação — parece processamento real.
    showTyping();
    const base = Math.min(400 + textLen * 0.35, 1600);
    const step = base / AI_PHASES.length;
    for (let i = 0; i < AI_PHASES.length; i++) {
        typingPhase.textContent = AI_PHASES[i];
        scrollToBottom();
        await wait(reduceMotion ? 60 : step + Math.random() * 180);
    }
}

/* ---- 6. Mensagens ---------------------------------------------------------- */
function addUserMessage(text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-bubble flex items-start gap-3 flex-row-reverse';
    wrapper.dataset.sender = 'user';
    wrapper.innerHTML =
        '<div class="w-9 h-9 rounded-2xl glass flex items-center justify-center flex-shrink-0 shadow-lg">' +
            '<svg class="icon-lg" style="color: #8be381;"><use href="#i-user"/></svg>' +
        '</div>' +
        '<div class="bubble-user px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] min-w-0">' +
            '<p class="bubble-text text-white text-sm sm:text-base leading-relaxed" style="white-space: pre-wrap;">' + escapeHtml(text) + '</p>' +
            '<span class="text-xs block mt-1 text-left" style="color: rgba(139,227,129,0.6);">' + formatTime() + '</span>' +
        '</div>';
    messagesContainer.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
}

function createGuideShell() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-bubble flex items-start gap-3';
    wrapper.dataset.sender = 'guide';
    wrapper.innerHTML =
        '<div class="w-9 h-9 rounded-2xl glass flex items-center justify-center flex-shrink-0 shadow-lg">' +
            '<svg class="icon-lg" style="color: #8be381;"><use href="#i-leaf"/></svg>' +
        '</div>' +
        '<div class="bubble-guide px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] min-w-0">' +
            '<div class="guide-body space-y-2"></div>' +
            '<span class="text-xs block mt-2 text-right" style="color: rgba(139,227,129,0.6);">' + formatTime() + '</span>' +
        '</div>';
    messagesContainer.appendChild(wrapper);
    scrollToBottom();
    return wrapper.querySelector('.guide-body');
}

function splitParagraphs(text) {
    return text.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
}

async function streamGuideMessage(fullText, question) {
    const body = createGuideShell();
    body.classList.add('stream-caret');
    const paras = splitParagraphs(fullText);
    for (let i = 0; i < paras.length; i++) {
        const p = document.createElement('p');
        p.className = 'stream-para bubble-text text-white text-sm sm:text-base leading-relaxed';
        p.style.whiteSpace = 'pre-wrap';
        p.innerHTML = escapeHtml(paras[i]).replace(/\n/g, '<br>');
        body.appendChild(p);
        scrollToBottom();
        await wait(reduceMotion ? 30 : 200 + Math.random() * 220);
    }
    if (question) {
        const q = document.createElement('p');
        q.className = 'stream-para text-sm sm:text-base font-semibold leading-relaxed';
        q.style.color = '#8be381';
        q.textContent = question;
        body.appendChild(q);
        scrollToBottom();
        await wait(reduceMotion ? 30 : 250);
    }
    body.classList.remove('stream-caret');
}

/* ---- 7. Opções (dock inferior) --------------------------------------------- */
function setOptionsEnabled(enabled) {
    const btns = optionsContainer.querySelectorAll('button');
    btns.forEach(function (b) { b.disabled = !enabled; });
}

function clearOptions() {
    optionsContainer.innerHTML = '';
}

function addOptionButton(label, onClick, ghost) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn glass px-4 py-3 rounded-xl text-sm text-white flex items-center gap-2 shadow-md' + (ghost ? ' choice-menu-btn' : '');
    btn.innerHTML =
        '<svg class="icon" style="color: #8be381;"><use href="#' + (ghost ? 'i-menu' : 'i-leaf') + '"/></svg>' +
        '<span>' + escapeHtml(label) + '</span>';
    btn.addEventListener('click', onClick);
    optionsContainer.appendChild(btn);
    return btn;
}

function renderMenuOptions() {
    clearOptions();
    TEMAS.forEach(function (t) {
        addOptionButton(t.titulo + ' — ' + t.desc, function () {
            if (!isBusy) startTema(t.id);
        });
    });
}

function renderNodeOptions(node, tema) {
    clearOptions();
    if (node.optA && node.optA.target) {
        addOptionButton(node.optA.label, function () { chooseOption(tema, node, 'A'); });
    }
    if (node.optB && node.optB.target) {
        addOptionButton(node.optB.label, function () { chooseOption(tema, node, 'B'); });
    }
    addOptionButton('Voltar ao Menu Principal', function () { if (!isBusy) showMenu(false); }, true);
}

/* ---- 8. Fluxo: menu + nós --------------------------------------------------- */
async function showMenu(isFirst) {
    isBusy = true;
    setOptionsEnabled(false);
    currentTema = null;
    currentNum = null;

    if (isFirst) {
        await aiThink(220);
        hideTyping();
        await streamGuideMessage(
            'Bem-vindo a Sacramento! Eu sou o guia virtual da cidade.\n\nPor aqui você explora tudo tocando em opções — sem precisar digitar. São 6 temas com 36 pontos de conversa cada: Gruta, Desemboque, Basílica, Cachoeiras, Colégio Allan Kardec e Personalidades.',
            'Qual ponto turístico você quer conhecer primeiro?'
        );
    } else {
        await aiThink(160);
        hideTyping();
        await streamGuideMessage(
            'Voltamos ao Menu Principal.\n\nEscolha outro tema para continuar explorando Sacramento.',
            'Para onde vamos agora?'
        );
    }
    renderMenuOptions();
    setOptionsEnabled(true);
    isBusy = false;
    scrollToBottom();
}

function resolveTarget(tema, opt) {
    if (!opt || !opt.target) return { tema: null, num: null, menu: true };
    if (opt.target === 'MENU') return { tema: null, num: null, menu: true };
    if (opt.cross) return { tema: opt.cross, num: opt.target, menu: false };
    return { tema: tema, num: opt.target, menu: false };
}

async function startTema(tema) {
    if (isBusy) return;
    isBusy = true;
    setOptionsEnabled(false);
    addUserMessage('Quero explorar: ' + temaTitulo(tema));
    await showNodeInternal(tema, '01');
    isBusy = false;
}

async function chooseOption(tema, node, which) {
    if (isBusy) return;
    isBusy = true;
    setOptionsEnabled(false);
    const opt = which === 'A' ? node.optA : node.optB;
    addUserMessage(opt.label);
    const dest = resolveTarget(tema, opt);
    if (dest.menu) {
        await showMenuInner();
    } else {
        await showNodeInternal(dest.tema, dest.num);
    }
    isBusy = false;
}

async function showMenuInner() {
    await aiThink(160);
    hideTyping();
    await streamGuideMessage(
        'Voltamos ao Menu Principal.\n\nEscolha outro tema para continuar explorando Sacramento.',
        'Para onde vamos agora?'
    );
    currentTema = null;
    currentNum = null;
    renderMenuOptions();
    setOptionsEnabled(true);
}

async function showNodeInternal(tema, num) {
    const node = getNode(tema, num);
    if (!node) {
        await aiThink(120);
        hideTyping();
        await streamGuideMessage('Não encontrei esse ponto da conversa. Voltei ao menu para você escolher outro caminho.', 'Qual tema quer explorar?');
        renderMenuOptions();
        setOptionsEnabled(true);
        return;
    }
    currentTema = tema;
    currentNum = node.num;
    visitCount++;
    await aiThink(node.text.length);
    hideTyping();
    await streamGuideMessage(node.text, node.question);
    renderNodeOptions(node, tema);
    setOptionsEnabled(true);
    scrollToBottom();
}

/* ---- 9. Eventos ------------------------------------------------------------- */
shortcutButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        if (!isBusy) startTema(btn.dataset.tema);
    });
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scrollToBottom);
}

/* ---- 10. Inicialização ------------------------------------------------------- */
showMenu(true);
