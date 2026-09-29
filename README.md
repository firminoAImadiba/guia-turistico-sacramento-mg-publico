# Guia Turístico Virtual de Sacramento – MG (Versão Público)

> **Versão de demonstração para o público** que assiste à apresentação do TCC.
> Repositório público derivado do projeto privado dos alunos (onde fica a versão dos apresentadores).

---

## 1. O que é este repositório

Este é o repo **público** do TCC do curso de Inteligência Artificial do **Instituto Madiba** (Sacramento – MG), desenvolvido por **Arthur Firmino** e **Maria Clara**.

Ele existe para que o **público que assiste à apresentação** possa abrir o site no próprio celular e interagir com uma versão controlada do guia — **sem campo de digitação**, apenas tocando em opções.

A **versão dos apresentadores** (com digitação livre + 50 perguntas e respostas automáticas) fica no repositório privado: `guia-turistico-sacramento-mg`.

---

## 2. Como vai ser (plano — ainda NÃO implementado)

### 2.1. Versão público (este repo)

- **Sem campo de digitação**: a barra de entrada será removida/desabilitada.
- **Navegação por "correntes" de botões**: o guia faz uma pergunta e o visitante escolhe tocando.
- Exemplo de fluxo:
  1. Guia: *"Qual ponto turístico você quer conhecer?"* → opções: Gruta dos Palhares, Desemboque, Cachoeiras e Trilhas, Onde Comer e Hospedar…
  2. Visitante toca em uma opção → o guia responde e oferece **sub-perguntas** (ex.: *"Quer saber como chegar, a história ou dicas de visita?"*).
  3. E assim por diante, com **no mínimo 32 nós de conversa** (perguntas, opções e respostas finais somados).
- Todas as respostas serão **automáticas e pré-cadastradas** (sem IA externa, sem custo — decisão low budget).
- Interface e textos **100% em PT-BR**, foco total em mobile.

### 2.2. Versão apresentadores (repo privado)

- **Com digitação livre** + atalhos rápidos.
- **50 pares de pergunta/resposta automáticos** (conteúdo a ser cadastrado — as perguntas e respostas serão enviadas em seguida).
- Se o texto digitado não bater com nenhuma das 50, o guia mostra uma resposta padrão de ajuda.
- Uso exclusivo de quem apresenta o TCC.

---

## 3. Estado atual (código ainda INTACTO)

⚠️ **Nada foi alterado no código.** Este repo contém, por enquanto, uma **cópia fiel** do protótipo com chatbot mock (eco: responde `Você disse: ...`).

```text
guia-turistico-sacramento-mg-publico/
├── index.html            # Markup + sprite SVG de ícones
├── assets/
│   ├── css/styles.css    # Estilos (paleta floresta)
│   └── js/
│       ├── tailwind-config.js
│       └── app.js        # Lógica atual: mock/eco (será substituída pelas correntes)
└── README.md             # Este arquivo
```

### Como abrir
1. Duplo clique em `index.html` (precisa de internet — Tailwind via CDN).
2. Não renomear nem mover a pasta `assets`.

---

## 4. Próximos passos (ordem planejada)

1. Receber as perguntas e respostas (versão apresentadores, repo privado).
2. Implementar as **correntes guiadas** neste repo público (mín. 32 nós, sem digitação).
3. Testar no celular do público antes da apresentação.
4. Publicar (ex.: GitHub Pages) para acesso por link/QR code no dia.

---

## 5. Autores e licença

- **Arthur Firmino** e **Maria Clara** — estudantes, curso de IA, Instituto Madiba (Sacramento – MG).
- Projeto acadêmico (TCC). Todos os direitos reservados aos autores.
