/* ==========================================================================
   Citypass Sacramento (versão PÚBLICO)
   Fluxo em 3 telas: Boas-vindas -> Menu de temas -> Leitura.
   O texto da resposta é o protagonista; no fim, 2 botões de decisão.
   "Menu" volta à tela de temas. Interface em PT/EN/ES/FR (i18n.js);
   conteúdo dos 216 nós traduzido sob demanda, com cache local.
   ========================================================================== */
'use strict';

/* ---- 1. Referências de DOM ---------------------------------------------- */
const welcomeScreen = document.getElementById('welcomeScreen');
const startBtn = document.getElementById('startBtn');
const welcomeSub = document.getElementById('welcomeSub');
const welcomeDesc = document.getElementById('welcomeDesc');
const temasLabel = document.getElementById('temasLabel');
const menuScreen = document.getElementById('menuScreen');
const themeList = document.getElementById('themeList');
const readerScreen = document.getElementById('readerScreen');
const backBtn = document.getElementById('backBtn');
const backLabel = document.getElementById('backLabel');
const readerMain = document.getElementById('readerMain');
const thinkingRow = document.getElementById('thinkingRow');
const thinkingPhase = document.getElementById('thinkingPhase');
const answerCard = document.getElementById('answerCard');
const answerBody = document.getElementById('answerBody');
const optionsBar = document.getElementById('optionsBar');
const badgeTexts = document.querySelectorAll('.badge-text');
const langButtons = document.querySelectorAll('[data-lang]');
const metaDesc = document.querySelector('meta[name="description"]');

/* ---- 2. Estado ----------------------------------------------------------- */
let isBusy = false;
let started = false;
let current = null; // { tema, num }
let session = 0;    // invalida gerações pendentes ao cancelar (ex.: Menu)
let lang = 'pt';
try {
    const saved = localStorage.getItem('citypass_lang');
    if (saved && STR[saved]) lang = saved;
} catch (e) { /* sem storage: segue em PT */ }

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function T() { return STR[lang] || STR.pt; }

/* ---- 3. Utilidades -------------------------------------------------------- */
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

function temaInfo(id) {
    const t = T().temas[id];
    if (t) return { nome: t[0], sub: t[1] };
    for (let i = 0; i < TEMAS.length; i++) {
        if (TEMAS[i].id === id) return { nome: TEMAS[i].titulo, sub: TEMAS[i].desc };
    }
    return { nome: id, sub: '' };
}

/* ---- 4. Idioma -------------------------------------------------------------- */
function applyLang() {
    const s = T();
    document.documentElement.lang = s.htmlLang;
    document.title = s.title;
    if (metaDesc) metaDesc.setAttribute('content', s.metaDesc);
    if (welcomeSub) welcomeSub.textContent = s.headerSub;
    if (welcomeDesc) welcomeDesc.textContent = s.welcomeDesc;
    if (temasLabel) temasLabel.textContent = s.temasLabel;
    if (backLabel) backLabel.textContent = s.back;
    if (startBtn && !started) startBtn.textContent = s.start;
    badgeTexts.forEach(function (el) { el.textContent = s.badge; });
    langButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    buildThemeList();
    try {
        localStorage.setItem('citypass_lang', lang);
    } catch (e) { /* sem storage */ }
}

function setLang(next) {
    if (!STR[next] || next === lang) return;
    lang = next;
    applyLang();
}

/* ---- 5. Telas ----------------------------------------------------------------- */
function showScreen(el) {
    [welcomeScreen, menuScreen, readerScreen].forEach(function (s) {
        if (!s) return;
        s.classList.toggle('hidden', s !== el);
    });
    window.scrollTo(0, 0);
}

function showMenu() {
    session++;        // cancela qualquer geração em andamento
    isBusy = false;   // novo fluxo virá com sessão própria
    current = null;
    showScreen(menuScreen);
}

function buildThemeList() {
    if (!themeList) return;
    themeList.innerHTML = '';
    TEMAS.forEach(function (t) {
        const info = temaInfo(t.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-btn glass';
        btn.innerHTML =
            '<span class="t-text"><span class="t-name"></span><span class="t-sub"></span></span>' +
            '<svg class="chev"><use href="#i-chev-right"/></svg>';
        btn.querySelector('.t-name').textContent = info.nome;
        btn.querySelector('.t-sub').textContent = info.sub;
        btn.addEventListener('click', function () { startTema(t.id); });
        themeList.appendChild(btn);
    });
}

/* ---- 6. Tradução sob demanda (com cache) ----------------------------------------
   Interface traduzida manualmente em i18n.js. Conteúdo dos nós:
   MyMemory -> Google (fallback) -> texto original.
   Cache persistente: o que já foi visto não é traduzido de novo. */
const mtMemCache = {};
let mtStore = {};
try {
    mtStore = JSON.parse(localStorage.getItem('citypass_mt') || '{}');
} catch (e) { mtStore = {}; }

function mtSave() {
    try {
        const keys = Object.keys(mtStore);
        if (keys.length > 800) {
            const keep = {};
            keys.slice(-800).forEach(function (k) { keep[k] = mtStore[k]; });
            mtStore = keep;
        }
        localStorage.setItem('citypass_mt', JSON.stringify(mtStore));
    } catch (e) { /* quota: mantém só memória */ }
}

function djb2(text) {
    let h = 5381;
    for (let i = 0; i < text.length; i++) {
        h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    }
    return h.toString(36);
}

function mtGet(key) {
    if (mtMemCache[key]) return mtMemCache[key];
    if (mtStore[key]) {
        mtMemCache[key] = mtStore[key];
        return mtStore[key];
    }
    return null;
}

function mtPut(key, value) {
    mtMemCache[key] = value;
    mtStore[key] = value;
    mtSave();
}

async function fetchTimeout(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, ms);
    try {
        const res = await fetch(url, { signal: ctrl.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

async function mtViaMyMemory(text, target) {
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) +
        '&langpair=pt|' + encodeURIComponent(target);
    const res = await fetchTimeout(url, 12000);
    if (!res.ok) throw new Error('http ' + res.status);
    const data = await res.json();
    if (!data || !data.responseData || typeof data.responseData.translatedText !== 'string') {
        throw new Error('resposta inválida');
    }
    if (data.responseStatus !== 200 && data.responseStatus !== '200') throw new Error('status ' + data.responseStatus);
    return data.responseData.translatedText;
}

async function mtViaGoogle(text, target) {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=' +
        encodeURIComponent(target) + '&dt=t&q=' + encodeURIComponent(text);
    const res = await fetchTimeout(url, 12000);
    if (!res.ok) throw new Error('http ' + res.status);
    const data = await res.json();
    let out = '';
    const sentences = data[0] || [];
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i][0]) out += sentences[i][0];
    }
    if (!out) throw new Error('vazio');
    return out;
}

async function translateChunk(text, target) {
    const key = target + ':' + djb2(text);
    const hit = mtGet(key);
    if (hit) return hit;
    let out = null;
    try {
        out = await mtViaMyMemory(text, target);
    } catch (e1) {
        try {
            out = await mtViaGoogle(text, target);
        } catch (e2) {
            out = text;
        }
    }
    mtPut(key, out);
    return out;
}

function splitChunks(text, maxLen) {
    // Agrupa parágrafos em pedaços curtos (limite do provedor gratuito).
    const paras = text.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    const chunks = [];
    let cur = '';
    paras.forEach(function (p) {
        if ((cur + '\n\n' + p).trim().length > maxLen && cur) {
            chunks.push(cur.trim());
            cur = p;
        } else {
            cur = (cur ? cur + '\n\n' : '') + p;
        }
    });
    if (cur.trim()) chunks.push(cur.trim());
    return chunks.length ? chunks : [text];
}

async function translateText(text, target) {
    if (!text) return '';
    const chunks = splitChunks(text, 450);
    const parts = await Promise.all(chunks.map(function (c) {
        return translateChunk(c, target);
    }));
    return parts.join('\n\n');
}

async function localizeNode(node) {
    if (lang === 'pt' || !node) {
        return {
            text: node.text,
            optA: node.optA ? node.optA.label : '',
            optB: node.optB ? node.optB.label : ''
        };
    }
    const results = await Promise.all([
        translateText(node.text, lang),
        translateText(node.optA ? node.optA.label : '', lang),
        translateText(node.optB ? node.optB.label : '', lang)
    ]);
    return { text: results[0], optA: results[1], optB: results[2] };
}

/* ---- 7. Indicador de geração --------------------------------------------------
   ~7s no total: 75% "Pensando..." + 25% "Escrevendo resposta...".
   Retorna false quando a geração foi cancelada (sessão mudou). */
async function aiThink(id) {
    thinkingRow.classList.remove('hidden');
    answerCard.classList.add('hidden');
    readerMain.scrollTop = 0;
    const phases = T().think;
    const total = reduceMotion ? 700 : 7000;
    const parts = [0.75, 0.25, 0];
    for (let i = 0; i < phases.length; i++) {
        if (id !== session) return false;
        thinkingPhase.textContent = phases[i];
        await wait(total * (parts[i] || 0));
    }
    return id === session;
}

function hideThinking() {
    thinkingRow.classList.add('hidden');
}

/* ---- 8. Resposta (texto em destaque, letra por letra) --------------------------- */
function splitParagraphs(text) {
    return text.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
}

/* Acompanha o texto que está sendo digitado; desliga se a pessoa rolar pra cima. */
let autoFollow = true;
let activeStream = null;

if (readerMain) {
    readerMain.addEventListener('scroll', function () {
        autoFollow = readerMain.scrollHeight - readerMain.scrollTop - readerMain.clientHeight < 48;
    }, { passive: true });

    readerMain.addEventListener('click', function () {
        if (activeStream) activeStream.skip();
    });
}

/* Digita a resposta caractere por caractere, em ritmo por tempo (não por
   quadro, então funciona igual em tela de 60/120Hz). A duração cresce com o
   tamanho do texto: ~5s nos curtos, ~10s nos longos. Toque na tela revela tudo. */
function streamAnswer(fullText, id) {
    return new Promise(function (resolve) {
        answerBody.innerHTML = '';
        answerBody.classList.add('stream-caret');
        answerCard.classList.remove('hidden');
        autoFollow = true;

        const paras = splitParagraphs(fullText);
        // Ritmo: 4,2s + 5ms por caractere, limitado entre 5,6s e 11s.
        const targetMs = Math.min(11000, Math.max(5600, 4200 + fullText.length * 5));
        const cps = reduceMotion ? 1e9 : fullText.length / (targetMs / 1000);
        let acc = 0;
        let last = 0;

        let pi = 0;       // parágrafo atual
        let ci = 0;       // letra atual dentro do parágrafo
        let pEl = null;   // <p> em digitação
        let finished = false;
        let rafId = 0;

        function newPara() {
            pEl = document.createElement('p');
            pEl.className = 'typing'; // blur leve enquanto digita
            answerBody.appendChild(pEl);
        }

        function closePara() {
            if (pEl) pEl.classList.remove('typing');
            pEl = null;
        }

        function settle(ok) {
            if (finished) return;
            finished = true;
            if (rafId) cancelAnimationFrame(rafId);
            answerBody.classList.remove('stream-caret');
            for (let k = 0; k < answerBody.children.length; k++) {
                answerBody.children[k].classList.remove('typing');
            }
            activeStream = null;
            if (ok && autoFollow) readerMain.scrollTop = readerMain.scrollHeight;
            resolve(ok);
        }

        function revealRest() {
            while (pi < paras.length) {
                if (!pEl) newPara();
                const t = paras[pi];
                if (ci >= t.length) { closePara(); pi++; ci = 0; continue; }
                pEl.textContent = t;
                ci = t.length;
            }
            settle(true);
        }

        activeStream = { skip: revealRest };

        function frame(now) {
            if (id !== session) { settle(false); return; }
            if (pi >= paras.length) { settle(true); return; }
            if (!last) last = now;
            const dt = Math.min(now - last, 64); // aba lenta: não despeja o texto de uma vez
            last = now;
            acc += cps * (dt / 1000);
            let budget = Math.floor(acc);
            acc -= budget;
            while (budget > 0 && pi < paras.length) {
                if (!pEl) newPara();
                const t = paras[pi];
                if (ci >= t.length) { closePara(); pi++; ci = 0; continue; }
                const take = Math.min(budget, t.length - ci);
                ci += take;
                budget -= take;
                pEl.textContent = t.slice(0, ci);
            }
            if (autoFollow) {
                // descida suave: persegue o fim do texto com inércia por quadro
                const dy = readerMain.scrollHeight - readerMain.scrollTop;
                readerMain.scrollTop = dy > 2
                    ? readerMain.scrollTop + dy * 0.16
                    : readerMain.scrollHeight;
            }
            rafId = requestAnimationFrame(frame);
        }

        if (!paras.length) { settle(true); return; }
        rafId = requestAnimationFrame(frame);
    });
}

/* ---- 9. Opções (2 decisões, texto principal) ------------------------------------- */
function disableOptions() {
    const btns = optionsBar.querySelectorAll('button');
    btns.forEach(function (b) { b.disabled = true; });
}

function addOptionButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.innerHTML =
        '<span class="opt-text"></span>' +
        '<svg class="chev"><use href="#i-chev-right"/></svg>';
    btn.querySelector('.opt-text').textContent = label;
    btn.addEventListener('click', onClick);
    optionsBar.appendChild(btn);
    return btn;
}

function renderNodeOptions(node, labels) {
    optionsBar.innerHTML = '';
    const list = [];
    if (node.optA && labels.optA) list.push({ label: labels.optA, which: 'A' });
    if (node.optB && labels.optB) list.push({ label: labels.optB, which: 'B' });
    if (!list.length) {
        addOptionButton(T().backToMenu, function () { showMenu(); });
    } else {
        list.forEach(function (item) {
            addOptionButton(item.label, function () {
                chooseOption(current.tema, node, item.which);
            });
        });
    }
}

/* ---- 10. Fluxo -------------------------------------------------------------------- */
function resolveTarget(tema, opt) {
    if (!opt || !opt.target) return { menu: true };
    if (opt.target === 'MENU' || opt.target === 'FIM') return { menu: true };
    if (opt.cross) return { tema: opt.cross, num: opt.target };
    return { tema: tema, num: opt.target };
}

function resetReader() {
    hideThinking();
    activeStream = null; // digitação antiga se cancela sozinha (sessão nova)
    answerBody.classList.remove('stream-caret');
    answerCard.classList.add('hidden');
    optionsBar.innerHTML = '';
    readerMain.scrollTop = 0;
    autoFollow = true;
}

async function showNodeInternal(tema, num, id) {
    const node = getNode(tema, num) || getNode(tema, '01');
    current = { tema: tema, num: node.num };
    const localizedPromise = localizeNode(node);
    const okThink = await aiThink(id);
    if (!okThink) { hideThinking(); return; }
    const localized = await localizedPromise;
    if (id !== session) { hideThinking(); return; }
    hideThinking();
    const okStream = await streamAnswer(localized.text, id);
    if (!okStream) return;
    renderNodeOptions(node, localized);
}

async function startTema(tema) {
    if (isBusy || !started) return;
    isBusy = true;
    const id = ++session;
    showScreen(readerScreen);
    resetReader();
    await showNodeInternal(tema, '01', id);
    if (id === session) isBusy = false;
}

async function chooseOption(tema, node, which) {
    if (isBusy || !started) return;
    isBusy = true;
    disableOptions();
    const opt = which === 'A' ? node.optA : node.optB;
    const dest = resolveTarget(tema, opt);
    if (dest.menu) {
        showMenu();
    } else {
        const id = ++session;
        await showNodeInternal(dest.tema, dest.num, id);
        if (id === session) isBusy = false;
    }
}

/* ---- 11. Eventos ---------------------------------------------------------------------- */
langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
    });
});

if (startBtn) {
    startBtn.addEventListener('click', function () {
        if (started || isBusy) return;
        started = true;
        welcomeScreen.classList.add('leaving');
        setTimeout(function () {
            showScreen(menuScreen);
            welcomeScreen.classList.remove('leaving');
        }, 260);
    });
}

if (backBtn) {
    backBtn.addEventListener('click', function () {
        showMenu(); // cancela geração em curso e abre o menu na hora
    });
}

/* ---- 12. Inicialização ------------------------------------------------------------------ */
applyLang();
showScreen(welcomeScreen);
