/* ==========================================================================
   Citypass Sacramento (versão PÚBLICO) — página da IA
   Aplica o idioma salvo pelo visitante (assets/js/i18n.js) no conteúdo da
   página do modelo. Sem dependências.
   ========================================================================== */
'use strict';

(function () {
    let lang = 'pt';
    try {
        const saved = localStorage.getItem('citypass_lang');
        if (saved && STR[saved]) lang = saved;
    } catch (e) { /* sem storage: segue em PT */ }

    const base = STR[lang] || STR.pt;
    const s = base.ia || STR.pt.ia;

    document.documentElement.lang = base.htmlLang;
    document.title = 'DeepSeek V4.1 Flash Free · Citypass Sacramento';

    document.querySelectorAll('[data-i]').forEach(function (el) {
        const key = el.getAttribute('data-i');
        if (s[key]) el.textContent = s[key];
    });
})();
