/* ==========================================================================
   Citypass Sacramento (versão PÚBLICO)
   Textos da interface em 4 idiomas. O conteúdo dos 216 nós continua em PT-BR
   nos dados e é traduzido sob demanda em assets/js/app.js.
   ========================================================================== */
'use strict';

const STR = {
    pt: {
        htmlLang: 'pt-BR',
        title: 'Citypass Sacramento',
        metaDesc: 'Citypass Sacramento: explore os pontos turísticos da cidade com o assistente.',
        headerSub: 'Seu assistente local em Sacramento - MG',
        badge: 'IA online',
        temasLabel: 'Escolha um tema para explorar',
        back: 'Menu',
        backToMenu: 'Voltar ao menu',
        think: ['Pensando...', 'Escrevendo resposta...'],
        welcomeDesc: 'Explore a Gruta dos Palhares, o Desemboque, a Basílica, as Cachoeiras, o Colégio Allan Kardec e as Personalidades de Sacramento.',
        start: 'Começar',
        temas: {
            gruta: ['Gruta dos Palhares', 'Caverna de arenito, piscinas e parque'],
            desemboque: ['Desemboque', 'Berço do Triângulo Mineiro'],
            basilica: ['Basílica', 'Fé, torres e relógio alemão'],
            cachoeiras: ['Cachoeiras', 'Ecoturismo e banhos'],
            colegio: ['Colégio Allan Kardec', 'Eurípedes e educação'],
            personalidades: ['Personalidades', 'Carolina, Eurípedes e Lima Duarte']
        },
        ia: {
            back: 'Voltar',
            sub: 'Modelo de linguagem de alto desempenho, feito para conversas naturais.',
            desc: 'Modelo moderno de linguagem, otimizado para respostas rápidas, raciocínio claro e diálogos em vários idiomas.',
            f1t: 'Respostas rápidas',
            f1d: 'Poucos segundos entre a pergunta e a resposta.',
            f2t: 'Conversa natural',
            f2d: 'Linguagem clara e tom próximo de um guia humano.',
            f3t: 'Multilíngue',
            f3d: 'Português, inglês, espanhol e francês.',
            f4t: 'Acesso gratuito',
            f4d: 'Disponível sem custo em plataformas parceiras.',
            cta: 'Página oficial do DeepSeek',
            note: 'Citypass Sacramento · Sacramento – MG'
        }
    },
    en: {
        htmlLang: 'en',
        title: 'Citypass Sacramento',
        metaDesc: 'Citypass Sacramento: explore the city sights with the assistant.',
        headerSub: 'Your local assistant in Sacramento - MG',
        badge: 'AI online',
        temasLabel: 'Choose a theme to explore',
        back: 'Menu',
        backToMenu: 'Back to menu',
        think: ['Thinking...', 'Writing answer...'],
        welcomeDesc: 'Explore the Palhares Grotto, Desemboque, the Basilica, the Waterfalls, the Allan Kardec School and the Local Figures of Sacramento.',
        start: 'Start',
        temas: {
            gruta: ['Palhares Grotto', 'Sandstone cave, pools and park'],
            desemboque: ['Desemboque', 'Birthplace of the Triângulo Mineiro'],
            basilica: ['Basilica', 'Faith, towers and German clock'],
            cachoeiras: ['Waterfalls', 'Ecotourism and swimming'],
            colegio: ['Allan Kardec School', 'Eurípedes and education'],
            personalidades: ['Local Figures', 'Carolina, Eurípedes and Lima Duarte']
        },
        ia: {
            back: 'Back',
            sub: 'A high-performance language model built for natural conversations.',
            desc: 'A modern language model, tuned for fast answers, clear reasoning and dialogue in several languages.',
            f1t: 'Fast answers',
            f1d: 'Seconds between the question and the answer.',
            f2t: 'Natural conversation',
            f2d: 'Clear language with the tone of a human guide.',
            f3t: 'Multilingual',
            f3d: 'Portuguese, English, Spanish and French.',
            f4t: 'Free access',
            f4d: 'Available at no cost on partner platforms.',
            cta: 'Official DeepSeek page',
            note: 'Citypass Sacramento · Sacramento – MG'
        }
    },
    es: {
        htmlLang: 'es',
        title: 'Citypass Sacramento',
        metaDesc: 'Citypass Sacramento: explora los puntos turísticos de la ciudad con el asistente.',
        headerSub: 'Tu asistente local en Sacramento - MG',
        badge: 'IA en línea',
        temasLabel: 'Elige un tema para explorar',
        back: 'Menú',
        backToMenu: 'Volver al menú',
        think: ['Pensando...', 'Escribiendo respuesta...'],
        welcomeDesc: 'Explora la Gruta de Palhares, Desemboque, la Basílica, las Cascadas, el Colegio Allan Kardec y las Personalidades de Sacramento.',
        start: 'Comenzar',
        temas: {
            gruta: ['Gruta de Palhares', 'Caverna de arenisca, piscinas y parque'],
            desemboque: ['Desemboque', 'Cuna del Triângulo Mineiro'],
            basilica: ['Basílica', 'Fe, torres y reloj alemán'],
            cachoeiras: ['Cascadas', 'Ecoturismo y baño'],
            colegio: ['Colegio Allan Kardec', 'Eurípedes y educación'],
            personalidades: ['Personalidades', 'Carolina, Eurípedes y Lima Duarte']
        },
        ia: {
            back: 'Volver',
            sub: 'Un modelo de lenguaje de alto rendimiento, hecho para conversaciones naturales.',
            desc: 'Modelo de lenguaje moderno, optimizado para respuestas rápidas, razonamiento claro y diálogos en varios idiomas.',
            f1t: 'Respuestas rápidas',
            f1d: 'Pocos segundos entre la pregunta y la respuesta.',
            f2t: 'Conversación natural',
            f2d: 'Lenguaje claro y tono cercano al de un guía humano.',
            f3t: 'Multilingüe',
            f3d: 'Portugués, inglés, español y francés.',
            f4t: 'Acceso gratuito',
            f4d: 'Disponible sin costo en plataformas asociadas.',
            cta: 'Página oficial de DeepSeek',
            note: 'Citypass Sacramento · Sacramento – MG'
        }
    },
    fr: {
        htmlLang: 'fr',
        title: 'Citypass Sacramento',
        metaDesc: "Citypass Sacramento : explorez les sites de la ville avec l'assistant.",
        headerSub: 'Votre assistant local à Sacramento - MG',
        badge: 'IA en ligne',
        temasLabel: 'Choisissez un thème à explorer',
        back: 'Menu',
        backToMenu: 'Retour au menu',
        think: ['Réflexion...', 'Rédaction de la réponse...'],
        welcomeDesc: "Explorez la Grotte de Palhares, Desemboque, la Basilique, les Cascades, l'École Allan Kardec et les Personnalités de Sacramento.",
        start: 'Commencer',
        temas: {
            gruta: ['Grotte de Palhares', 'Grotte de grès, piscines et parc'],
            desemboque: ['Desemboque', 'Berceau du Triângulo Mineiro'],
            basilica: ['Basilique', 'Foi, tours et horloge allemande'],
            cachoeiras: ['Cascades', 'Écotourisme et baignade'],
            colegio: ['Collège Allan Kardec', 'Eurípedes et éducation'],
            personalidades: ['Personnalités', 'Carolina, Eurípedes et Lima Duarte']
        },
        ia: {
            back: 'Retour',
            sub: 'Un modèle de langage performant, conçu pour des conversations naturelles.',
            desc: 'Modèle de langage moderne, optimisé pour des réponses rapides, un raisonnement clair et des échanges en plusieurs langues.',
            f1t: 'Réponses rapides',
            f1d: 'Quelques secondes entre la question et la réponse.',
            f2t: 'Conversation naturelle',
            f2d: 'Un langage clair, proche du ton d’un guide humain.',
            f3t: 'Multilingue',
            f3d: 'Portugais, anglais, espagnol et français.',
            f4t: 'Accès gratuit',
            f4d: 'Disponible sans frais sur des plateformes partenaires.',
            cta: 'Page officielle de DeepSeek',
            note: 'Citypass Sacramento · Sacramento – MG'
        }
    }
};
