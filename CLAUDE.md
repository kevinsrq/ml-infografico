# Guia Técnico — padrão das páginas

Site estático didático publicado via GitHub Pages. Sem build: o workflow `.github/workflows/pages.yml` publica `public/` como está.

## Estrutura

```
public/
  index.html                    índice dos capítulos
  assets/guia.css               estilos que o Tailwind não cobre
  assets/guia.js                shell compartilhado (header, sumário lateral, navegação, quiz, toast)
                                + GUIA_MAPA: a árvore do guia que alimenta o sumário
  ir/                           Capítulo 1 — Information Retrieval (RAG)
    index.html                  introdução do capítulo
    esparsos/index.html         1.1 Modelos Esparsos (introdução da seção)
    esparsos/<metodo>/index.html
    densos/index.html           1.2 Modelos Densos (introdução da seção)
    densos/<metodo>/index.html
    rrf/index.html              1.3 Busca Híbrida e RRF (fusão esparso + denso)
    agente/index.html           1.4 Do Retrieval ao Agente Confiável (introdução)
    agente/<topico>/index.html  1.4.1 alucinacao · 1.4.2 grounding · 1.4.3 laco
                                1.4.4 avaliacao · 1.4.5 ganhos
  redes-neurais/                Capítulo 2 — Redes Neurais
    index.html                  introdução do capítulo
    transformers/index.html     2.1 Transformers — diagrama clicável da arquitetura
    transformers/<topico>/index.html
```

**Página-mapa.** `redes-neurais/transformers/index.html` é um caso especial de página de índice: um
SVG da arquitetura em que cada bloco é clicável. As peças vêm de um array `PECAS` no script da
página; `href: null` + `pendente: true` marca tópico ainda não escrito — a peça vira botão que avisa
por toast em vez de navegar, e ganha um ponto âmbar. Quando a página existir, basta preencher o
`href` e tirar o `pendente`. Nunca aponte `href` para arquivo inexistente: o verificador de links
falha e o leitor cai num 404.

Uma seção pode ter só a página de introdução (`rrf/`) ou introdução + tópicos (`esparsos/`,
`densos/`, `agente/`). A profundidade do caminho dos assets muda junto: `ir/rrf/` usa
`../../assets`, `ir/agente/<topico>/` usa `../../../assets`.

Numeração exibida: capítulo `1.`, seção `1.1`/`1.2`, método `1.1.1`, `1.2.3`, … Toda página de método
vive em uma pasta própria com `index.html` (URL limpa, sem `.html`).

## Dois tipos de página

Todas usam o mesmo shell (`guia.js`) e a mesma identidade visual. A diferença é uma só:

| Tipo | Arquivos | O que muda |
|---|---|---|
| **Índice** (raiz, capítulo, seção) | `index.html` | **Não** tem `.slide-section`. O shell detecta isso e monta o header sem abas de módulo, sem rodapé e sem o botão de modo. Só lista e contextualiza. Referência: `public/index.html`. |
| **Metodologia** | `<metodo>/index.html` | **Infográfico interativo** — módulos em `.slide-section`, simulador ao vivo e quiz. O padrão descrito abaixo. Referência: `public/ir/densos/word2vec/index.html`. |

## Padrão do infográfico interativo

Referência canônica: `public/ir/densos/word2vec/index.html`.

### Esqueleto

```html
<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome do Método: Infográfico Interativo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../assets/guia.css">   <!-- profundidade relativa à página -->
  <script src="../../../assets/guia.js"></script>            <!-- sem defer: define tailwind.config -->
</head>
<body class="bg-surface-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-brand-500 selection:text-white antialiased"
      data-title="BM25"
      data-badge="Infográfico Interativo"
      data-subtitle="Ranking probabilístico com saturação de TF (Robertson & Walker, 1994)"
      data-icon="fa-scale-balanced"
      data-up="../index.html">
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
    <section class="slide-section" data-nav="Intuição" data-icon="fa-lightbulb"> … </section>
    <section class="slide-section" data-nav="Fórmula"  data-icon="fa-square-root-variable"> … </section>
    <!-- … último módulo: síntese + quiz -->
  </main>
  <script> /* simuladores da página */ </script>
</body>
</html>
```

`guia.js` monta sozinho: header com logo/título/badge/subtítulo, abas de navegação (uma por
`.slide-section`, a partir de `data-nav` e `data-icon`), barra de progresso, rodapé anterior/próximo,
modal de ajuda, container de toasts, atalhos de teclado (← → Esc) e renderização KaTeX.
**Não escreva esse chrome à mão** — só as `<section>`s.

`data-up` aponta para o índice da seção (`../index.html` a partir de `densos/<metodo>/`).

### API de `guia.js`

| Chamada | Uso |
|---|---|
| `Guia.ready(fn)` | inicializa simuladores da página, depois do shell montado |
| `Guia.onSlide(i, fn)` | roda `fn` toda vez que o módulo `i` aparece — **obrigatório para canvas** (precisa de largura > 0) |

**Canvas e HiDPI — a armadilha que só aparece em tela retina.** Dimensione o buffer em pixels de
dispositivo (`canvas.width = rect.width * dpr`) e desenhe em pixels CSS (`ctx.scale(dpr, dpr)`).
A partir daí, *todo* cálculo de coordenada — desenho **e** hit-test do mouse — usa
`canvas.width / dpr`, nunca `canvas.width`. `getBoundingClientRect()` devolve pixels CSS: misturar
os dois faz o hover errar o alvo por um fator `dpr` (invisível em `dpr = 1`, quebrado em `dpr = 2`).
Em hit-test de pontos, escolha o mais próximo dentro do raio, não o primeiro da lista.
| `Guia.goTo(i)` / `next()` / `prev()` | navegação programática |
| `Guia.toast(msg, 'fa-icon')` | feedback não bloqueante; nunca use `alert()` |
| `Guia.answer(btn, bool, 'explicação')` | resposta de quiz |
| `Guia.renderMath(el)` | re-renderiza KaTeX em conteúdo inserido dinamicamente |
| `Guia.toggleSidebar()` | abre/fecha o sumário do guia, à esquerda (tecla `S`) |
| `Guia.toggleModulos()` | abre/fecha os módulos da página, à direita (tecla `D`) |
| `Guia.toggleGlossario()` | abre/fecha o glossário (tecla `G`) |

### As duas sidebars

O header não lista módulos: navegação vive em dois painéis ocultáveis, um de cada lado.

| | Botão | Tecla | Conteúdo |
|---|---|---|---|
| **Esquerda** | ☰ | `S` | **Sumário do guia** — todas as páginas, hierarquizadas, com a atual destacada. Pular de qualquer página para qualquer outra sem voltar ao índice. |
| **Direita** | ≔ | `D` | **Módulos desta página** — só em páginas de metodologia. O módulo atual fica destacado e o contador aparece no próprio botão (`Módulo 3/5`). |

Ambas deslizam para dentro a partir da própria borda (300 ms) com o fundo esmaecendo junto; o modal
de ajuda entra por opacidade e escala (200 ms). Quem faz isso é `Guia._painel(id, abrir)`: o painel
declara a classe de saída em `data-saida`, o fundo é marcado com `data-fundo`, e o `hidden` só volta
quando a transição termina. `prefers-reduced-motion` zera as durações via `guia.css`.

### Cola de termos

Painel **fixo** na lateral direita, ligado e desligado pela tecla `G` (ou pelo botão 📖 do header).
Não é modal: não escurece nada, não bloqueia o conteúdo e **fica ligado enquanto o leitor acompanha
a página**. Em telas de 1280px ou mais o corpo da página encolhe 320px para caber ao lado; abaixo
disso o painel sobrepõe, mas a página segue clicável. O estado liga/desliga vai para o
`localStorage` (`guia-cola`), então sobrevive à navegação entre páginas.

Por padrão o painel lista **só os termos daquela página** — é cola, não dicionário. A busca no topo
procura em todo o guia, ignorando acento, e casa termo, definição e `alt`.

Os dados vêm de `GLOSSARIO`, no topo de `assets/guia.js`. Cada entrada tem:

| campo | conteúdo |
|---|---|
| `t` | o termo, ou o símbolo em KaTeX inline (`"$k_1$"`, `"$d_{model}$"`) |
| `d` | definição de 1 a 2 frases |
| `p` | caminho da página que ensina, relativo à raiz de `public/` |
| `n` | número do tópico (`"1.1.2"`) — tem que bater com `GUIA_MAPA` |
| `alt` | siglas, forma em inglês e sinônimos, só para a busca |

A lista mistura **conceitos** e **notação**: numa página de fórmula o leitor precisa dos dois.
Escrever um tópico novo implica **somar os termos e os símbolos dele ao `GLOSSARIO`** — não existe
glossário por página.

`t` e `d` são inseridos com `innerHTML`: nada de HTML e **nunca o caractere `<` cru**. KaTeX inline
com `$…$` é permitido e renderizado.

### Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Z` / `←` | Módulo anterior |
| `C` / `→` | Próximo módulo |
| `S` | Sumário do guia (esquerda) |
| `D` | Módulos da página (direita) |
| `G` | Glossário |
| `A` | Modal de ajuda |
| `Esc` | Fecha os painéis abertos (funciona também com o foco na busca do glossário) |

Teclas ficam inertes dentro de `input`, `select` e `textarea`, e quando há Ctrl/Cmd/Alt pressionado.

Ele é gerado a partir de `GUIA_MAPA`, no topo de `assets/guia.js`. Os caminhos são relativos à raiz
de `public/`, e a raiz é descoberta em runtime a partir do `src` do próprio `guia.js` — por isso os
links funcionam em qualquer profundidade sem configuração por página.

**Toda página nova precisa entrar em `GUIA_MAPA`**, senão não aparece no sumário.

### Módulos (slides)

4 a 6 por página, nesta progressão: **intuição → mecanismo → matemática → aplicação/limites → síntese + quiz**.
Cada `<section>` abre com:

```html
<div class="mb-8">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono mb-3">
    <i class="fa-solid fa-sparkles"></i> Módulo 01 • Fundamentos Conceituais
  </div>
  <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
    Título <span class="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">com destaque</span>
  </h2>
  <p class="text-slate-400 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">Uma frase de contexto.</p>
</div>
```

O último módulo termina com quiz de 3 perguntas:

```html
<span id="quiz-score-badge" class="px-3 py-1 rounded-lg bg-surface-950 border border-slate-700 text-xs font-mono text-purple-300">Pontuação: 0 / 3</span>
…
<div class="quiz-card p-4 rounded-xl bg-surface-950 border border-slate-800 text-xs space-y-3">
  <div class="font-semibold text-slate-200 flex items-center gap-2">
    <span class="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-mono text-[10px]">1</span>
    Pergunta?
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <button onclick="Guia.answer(this, false)" class="quiz-opt p-2.5 rounded-lg bg-surface-900 border border-slate-800 hover:border-slate-700 text-left text-slate-300 transition">A) …</button>
    <button data-correct onclick="Guia.answer(this, true, 'Porque …')" class="quiz-opt p-2.5 rounded-lg bg-surface-900 border border-slate-800 hover:border-slate-700 text-left text-slate-300 transition">B) …</button>
  </div>
  <div class="q-feedback hidden text-[11px] p-2 rounded"></div>
</div>
```

### Interatividade — a regra que define o padrão

**Cada página tem pelo menos um simulador ao vivo**: slider, seletor, canvas, tabela que recalcula.
O leitor mexe e os números mudam na hora. Texto explicando um algoritmo sem poder rodá-lo não atende
o padrão. Nada de dados falsos estáticos vendidos como cálculo: se a página mostra um score, ele é
computado em JS a partir dos inputs visíveis.

### Visual

- Fundo `bg-surface-950`; cards `bg-surface-900` + `border border-slate-800` + `rounded-2xl` (`rounded-xl` nos internos).
- Cor de acento por natureza do conteúdo: `brand` (indigo) = conceito central; `cyan` = fluxo/dados;
  `emerald` = acerto/ganho; `rose` = limitação/erro; `amber` = atenção/custo; `purple` = síntese/avaliação.
- Ícones FontAwesome sólidos (`fa-solid`) em todo título de módulo, card e botão.
- Fórmulas em KaTeX com `$…$` / `$$…$$` direto no HTML — nunca imagem, nunca `<code>` fingindo de fórmula.
- Tipografia: `font-sans` (Inter) no corpo, `font-mono` (JetBrains Mono) em números, fórmulas, rótulos e código.
- Grids responsivos: `grid-cols-1 lg:grid-cols-2`; a página não pode rolar na horizontal em 400px.
- Toda tabela larga dentro de `<div class="overflow-x-auto">`.

### Conteúdo

- Português do Brasil, com acentuação correta. Termos técnicos em inglês permanecem no original
  (*embedding*, *cross-encoder*, *re-ranking*).
- Cite a origem (autor + ano) do método no `data-subtitle` e no módulo de fundamentos.
- Sempre fechar com limitações do método e para onde ele aponta — cada página conecta com a anterior e a próxima.

## Ao adicionar conteúdo

1. Crie `public/<capitulo>/<secao>/<metodo>/index.html` seguindo o padrão acima.
2. Some na lista da introdução da seção (`<secao>/index.html`) e na do capítulo (`<capitulo>/index.html`).
3. Registre a página em `GUIA_MAPA`, no topo de `public/assets/guia.js` — sem isso ela não aparece no sumário lateral.
4. Some na tabela do `README.md`.
5. Registre no `CHANGELOG.md`.
6. Abra a página no navegador e clique em cada simulador antes de commitar — CDN quebrado ou canvas de
   largura zero só aparecem em runtime.
