# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [Não lançado] - 2026-09-20 (cola de termos)

### Adicionado
- **Cola de termos** em todas as páginas, ligada pela tecla `G` ou pelo botão 📖 do cabeçalho. É um painel **fixo** na lateral direita, não um modal: não escurece nada, não bloqueia o conteúdo e fica ligado enquanto o leitor acompanha a página. Em telas de 1280px ou mais o corpo encolhe 320px para caber ao lado e o painel sobe até o topo; abaixo disso ele sobrepõe, mas a página segue clicável. O estado liga/desliga vai para o `localStorage` e sobrevive à navegação.
- **309 termos** em `GLOSSARIO` (`public/assets/guia.js`), misturando conceitos e notação matemática — numa página de fórmula o leitor precisa dos dois. Cada símbolo é registrado só na página que o **ensina**, não nas que apenas o usam. Por padrão o painel lista apenas os termos da página aberta; a busca no topo cobre o guia inteiro e ignora acentos.
- Atalho `G` documentado no modal de ajuda e no `CLAUDE.md`, junto da regra de que tópico novo implica somar os termos dele ao `GLOSSARIO`.

## [Não lançado] - 2026-09-20 (capítulo 2)

### Adicionado
- **Capítulo 2 — Redes Neurais** (`public/redes-neurais/`): as arquiteturas por dentro, peça por peça. Seção 2.1 completa, com 12 páginas.
  - **2.1 Transformers** — a arquitetura encoder-decoder do paper original redesenhada em SVG no tema do guia, com cada bloco clicável: hover mostra o resumo no painel lateral e o clique abre a página do tópico. Acessível por teclado (Tab + Enter). Traz o exemplo de tradução do paper (`O livro está sobre a mesa` → `The book is on the table`) com a tabela dos 7 passos da geração autoregressiva ligada ao diagrama, deixando explícito que *Targets* é a saída deslocada à direita, não a tradução pronta.
  - **2.1.1 Positional Encoding** — por que a self-attention é invariante a permutação, a construção senoidal, a propriedade de deslocamento e as alternativas aprendidas/relativas. Mapa de calor do PE em canvas e comparador de similaridade entre posições.
  - **2.1.2 Bloco Transformer** — a unidade que se repete, o esqueleto `LayerNorm(x + Sublayer(x))`, pré-norma × pós-norma e o custo de empilhar. Montador de bloco com contagem de parâmetros ao vivo.
  - **2.1.2.1 Multi-head Attention** — Q/K/V, scaled dot-product e por que dividir por `√d_k`; multi-head e o custo `O(n² d)`. Conta passo a passo com toggle da escala para ver o softmax saturar.
  - **2.1.2.2 Add & Norm** — conexão residual, LayerNorm por token (e por que não BatchNorm), pré × pós-norma, RMSNorm. Laboratório de normalização e comparador de propagação com e sem residual.
  - **2.1.2.3 Positionwise FFN** — a rede por posição, a expansão `4 × d_model`, onde estão os parâmetros e a família de ativações. Calculadora de parâmetros e do ponto em que a atenção passa a dominar o custo.
  - **2.1.3 Encoder** — atenção bidirecional, máscara de padding e os usos encoder-only, com ponte para o capítulo 1. Visualizador de propagação camada a camada.
  - **2.1.3.1 Cross-attention** — Q do decoder, K e V do encoder; a matriz de alinhamento `n_dec × n_enc`. Matriz interativa com a geração avançando token a token.
  - **2.1.4 Decoder** — geração autoregressiva, os três sublayers, teacher forcing × laço de inferência, KV-cache e decoder-only. Laço de geração com custo por passo e temperatura.
  - **2.1.4.1 Masked Multi-head Attention** — o vazamento sem máscara, o `-∞` antes do softmax, treino paralelo e KV-cache. Laboratório da máscara com medidor de vazamento.
  - **2.1.5 Camada de Saída (FC)** — a projeção `z = h·W_out + b`, cada coluna como o vetor de uma palavra (ponte com a matriz de saída do Word2Vec), weight tying, invariância do softmax a constante aditiva e o custo da cabeça. Simulador da projeção à distribuição com vocabulário visível e liga-desliga da subtração do máximo, e calculadora de parâmetros/MACs da cabeça.
- Capítulo 2 registrado em `GUIA_MAPA`, no índice raiz, no `README.md` e no `CLAUDE.md`.

## [Não lançado] - 2026-09-20 (seção 1.4)

### Adicionado
- **Seção 1.4 — Do Retrieval ao Agente Confiável** (`public/ir/agente/`): como os métodos das seções 1.1 a 1.3 sustentam um agente e reduzem alucinação.
  - Introdução da seção com demo "a mesma pergunta, com e sem recuperação" (inclui o caso sem cobertura na base, em que a resposta correta é se abster) e a tabela ligando cada método das seções anteriores ao modo de falha que ele evita.
  - **1.4.1 Por que o modelo alucina** — previsão de próximo token, alucinação intrínseca × extrínseca, os quatro estados do contexto e o que o retrieval não corrige.
  - **1.4.2 Grounding e citação** — atribuição por afirmação, citar ou se abster, verificação pós-geração.
  - **1.4.3 O laço do agente** — reescrita de query, decomposição, multi-hop, autocrítica e critério de parada.
  - **1.4.4 Medir se está funcionando** — recall@k, precision@k, MRR e nDCG do lado da recuperação; fidelidade, precisão e recall de contexto do lado da geração.
  - **1.4.5 Os outros ganhos** — conhecimento atualizável sem retreinar, custo e janela de contexto, permissão por documento, auditoria e dado privado que nunca vira peso de modelo.
- Seção 1.4 registrada em `GUIA_MAPA`, no índice raiz, no índice do capítulo 1, nas páginas de 1.1/1.2/1.3, no `README.md` e no `CLAUDE.md`.

## [Não lançado] - 2026-09-20 (padrão e reorganização)

### Adicionado
- **Padrão de infográfico interativo** (`CLAUDE.md`): contrato único para toda página de metodologia — Tailwind + KaTeX + FontAwesome, módulos em slides com modo apresentação/infográfico, simulador ao vivo obrigatório e quiz de fixação.
- **Shell compartilhado** (`public/assets/guia.js` + `guia.css`): monta header, abas de navegação, barra de progresso, rodapé, modal de ajuda, toasts, atalhos de teclado, renderização KaTeX e o motor de quiz a partir dos `data-*` do `<body>` e das `<section class="slide-section">`. As páginas escrevem só o conteúdo.
- **Word2Vec** (`public/ir/densos/word2vec/`): janela deslizante animada, CBOW × Skip-Gram, negative sampling amostrado ao vivo, espaço vetorial 2D em canvas com aritmética de analogias e quiz.
- **Sumário lateral** em todas as páginas (botão ☰ no header ou tecla `S`): árvore completa do guia, página atual destacada e os módulos dela aninhados — dá para pular de qualquer página para qualquer outra sem voltar ao índice. Gerado a partir de `GUIA_MAPA` em `assets/guia.js`; a raiz do site é descoberta em runtime pelo `src` do próprio script, então funciona em qualquer profundidade de pasta.

### Alterado
- **Reorganização do Capítulo 1** em seções por família de modelo:
  - `1.1 Modelos Esparsos` (`public/ir/esparsos/`): TF-IDF, BM25, Sparse Encoder (SPLADE).
  - `1.2 Modelos Densos` (`public/ir/densos/`): Embeddings em IR, Word2Vec, Origem & Além da Linguagem, Transformer, Cross-Encoder, Multi-Vector.
  - `1.3 Busca Híbrida e RRF` (`public/ir/rrf/`) fecha o capítulo.
  - Novas páginas de introdução em `esparsos/index.html` e `densos/index.html` explicando a família antes dos métodos.
- **Todas as 9 páginas de metodologia migradas** para o padrão de infográfico interativo, preservando o conteúdo didático e os simuladores existentes.
- **Páginas de índice migradas para a mesma identidade visual** das metodologias (Tailwind, tema escuro, ícones FontAwesome): `public/index.html`, `ir/index.html`, `ir/esparsos/index.html`, `ir/densos/index.html`. Todas usam o shell `guia.js`, que detecta a ausência de `.slide-section` e monta o header sem abas de módulo, sem rodapé e sem o botão de modo.
- Índices renumerados para `1.` / `1.1` / `1.1.1`.
- `ir/index.html`: demo léxica × semântica portada para Tailwind; corrigido escape duplo de HTML na marcação dos termos.

### Corrigido
- **Word2Vec**: o hit-test do canvas do espaço vetorial usava pixels de dispositivo enquanto o desenho usava pixels CSS — em telas com `devicePixelRatio ≥ 2` o hover errava o alvo por um fator `dpr`. Passa a calcular tudo em pixels CSS e a escolher o ponto mais próximo dentro do raio, não o primeiro da lista.

### Removido
- `public/ir/embeddings/fundamentos.html` (stub de redirecionamento obsoleto após a reorganização).
- `public/assets/indice.css` (o desenho antigo dos índices deixou de existir).

> **Atenção:** as URLs das páginas mudaram (`ir/bm25/` → `ir/esparsos/bm25/`, etc.). Links antigos compartilhados fora do repositório deixam de funcionar.

## [2026-09-18]

### Adicionado
- **Capítulo 1 (Information Retrieval) - Transformer, Cross-Encoder, Sparse Encoder e Multi-Vector**:
  - Quatro novas páginas interativas autocontidas (`public/ir/transformer/`, `cross-encoder/`, `sparse-encoder/`, `multi-vector/`), no mesmo padrão de TF-IDF/BM25/Embeddings: stepper de 6 etapas com tablist ARIA, autoplay iniciando pausado, glossário, tabela comparativa, "Como usar" em Python e pager.
  - **Transformer**: tokens + posição, projeções Q/K/V, atenção interativa (clique num token e veja os feixes de peso), soma ponderada contextual, multi-head/FFN/camadas e o mapa das três saídas ([CLS]/pooling → 1 vetor, cabeça MLM → vetor esparso, todos os tokens → multi-vector).
  - **Cross-Encoder**: limite do bi-encoder (erro plantado em "hemograma sem jejum"), concatenação `[CLS] q [SEP] d [SEP]`, grade de atenção cruzada, logit único, re-ranking animado e funil de dois estágios.
  - **Sparse Encoder (SPLADE)**: cabeça MLM sobre o vocabulário, painel de vocabulário (30 522 ids) com termos ativos e expansão, slider de top-k/esparsificação com contadores de dims e bytes, documentos esparsos e score por índice invertido comparado ao BM25.
  - **Multi-Vector (ColBERT)**: um vetor por token, grade token × token clicável, MaxSim animado, ranking D1–D5 e timeline "quando os dois lados se encontram"; inclui a tabela dos cinco motores (BM25 · Bi · Cross · Sparse · Multi).
  - **Busca Híbrida e RRF** (`public/ir/rrf/`): rankings de 4 motores lado a lado, por que scores não são comparáveis, troca de score por posição, soma das contribuições 1/(k+rank) com empates didáticos, toggles de listas e slider de k, e o funil completo do capítulo.
  - "Como usar" do Multi-Vector usa o `MultiVectorEncoder` nativo do sentence-transformers ≥ 6.0 (`encode_query`, `encode_document`, `similarity`), com pylate e bge-m3 como alternativas.
  - Widget "recibo de custo" (indexação vs consulta, slider de N documentos de 10 a 10⁷ com latência e tamanho de índice ilustrativos) replicado byte a byte nas páginas 6, 7 e 8.
  - Navegação atualizada em `public/index.html`, `public/ir/index.html`, pager de `fundamentos/`, glossário e tabela de `embeddings/index.html`, e `README.md`.
- **Capítulo 1 (Information Retrieval) - Embeddings**:
  - Nova página interativa autocontida em `public/ir/embeddings/index.html` seguindo rigorosamente a identidade visual e padrão didático estabelecidos em TF-IDF e BM25.
  - Simulador interativo com 6 etapas de visualização (O abismo léxico, Esparso vs Denso, Espaço Vetorial 2D com ângulos e projeções, Decomposição do produto escalar e cosseno, Indexação com Bi-Encoder/HNSW e Ranking final).
  - Suporte a seleção de consultas em tempo real demonstrando como a busca densa supera a falha de vocabulário da busca léxica.
  - Glossário conceitual, tabela comparativa BM25 vs Embeddings, explicação de Busca Híbrida (RRF) e exemplo prático em Python com `sentence-transformers`.
  - Atualização dos índices e trilhas de navegação em `public/ir/index.html`, `public/ir/bm25/index.html`, `public/index.html` e `README.md`.
- **Capítulo 1 (Information Retrieval) - Embeddings: Origem, Treinamento e Além da Linguagem**:
  - Nova página aprofundada em `public/ir/embeddings/fundamentos/index.html` (com redirecionamento em `fundamentos.html`).
  - Explicação ilustrativa de como os embeddings foram concebidos historicamente (crise do One-Hot, hipótese distribucional de Firth e surgimento do Word2Vec).
  - Mecânica de treinamento com tarefas-pretexto (Skip-Gram, MLM, Contrastive Loss) e teoria do efeito gargalo (Information Bottleneck).
  - Aritmética vetorial de significado (analogias geométricas lineares) e as 4 razões fundamentais de utilidade computacional.
  - Exploração de embeddings além do texto: Visão Computacional e alinhamento multimodal com CLIP, sistemas de recomendação com Item2Vec / Two-Tower, grafos com Node2Vec e bioinformática com ESM-2 / AlphaFold e descoberta de fármacos.
  - Implementação de 3 simuladores animados e interativos na seção 2.A (Skip-Gram com janela deslizante, Masked LM com atenção bidirecional no BERT e Aprendizado Contrastivo InfoNCE com forças vetoriais de atração/repulsão).
  - Implementação do quadro interativo de Álgebra Semântica na seção 2.B (Playground de analogias vetoriais com 8 presets, seletores dinâmicos de vocabulário, ranking top-4 de candidatos e diagrama geométrico 2D em paralelogramo).
  - Implementação do Simulador das 4 Superforças dos Embeddings na seção 3 (Compressão de 97% de RAM, Diferenciabilidade de gradiente, Produto escalar SIMD a nanosegundos e Grafos de navegação em camadas HNSW).
  - Implementação do Inspetor Multimodal Interativo na seção 4 com explicação conceitual detalhada do que o embedding absorve e descarta em cada modalidade (imagens, áudio/voz, séries temporais/ECG, grafos/fraude e bioinformática/moléculas).
  - Código prático em Python de similaridade multimodal texto-imagem e atualização cruzada de links de navegação.
- **Auditoria de Embeddings (Rodada 1) - Refinamentos Matemáticos, Acessibilidade e UI/UX**:
  - **Normalização Analítica Estrita**: Vetores em `public/ir/embeddings/index.html` agora são rigorosamente normalizados para $\|v\|_2 = 1.0000$, alinhando o produto escalar dimensão a dimensão $\sum q_i \cdot d_i$ diretamente com o score de cosseno exibido.
  - **Alinhamento Angular 2D Fiel**: Gráfico polar em `index.html` (Estágio 2) projeta vetores usando seu ângulo analítico real $\theta = \arccos(\text{cosSim}(q, d))$, eliminando disparidades entre rótulos numéricos e ângulos visuais.
  - **Projeção 2D Dinâmica no Playground de Álgebra**: O gráfico de paralelogramo em `fundamentos/index.html` agora calcula dinamicamente uma base ortonormal spanned por $(C - B)$ e $(A - B)$, refletindo a verdadeira geometria no hiperespaço.
  - **Fundamentação Matemática Avançada**: Inserção da fórmula explícita da perda InfoNCE, explicação da temperatura $\tau$, técnicas de mineração de *Hard Negatives* com BM25, e nota sobre *Negative Sampling* (SGNS) no Word2Vec.
  - **Embeddings Estáticos vs Contextuais e SBERT**: Nova subseção detalhando o problema da anisotropia no BERT e como o Sentence-BERT restaura a isotropia na hiperesfera unitária com *mean pooling* e perda siamesa.
  - **Responsividade e Layout Mobile**: Stepper transformado em grid fluida (`.step-grid`), barra lateral fluida no mobile (`max-width: 100%`) e alinhamento responsivo para operadores da equação vetorial.
  - **Acessibilidade e WCAG 2.1**: Elevação do contraste de cores secundárias (`#8a909b` e `#5b616c` substituídos por `#9ea8b6` e `#8a92a0`), adição de `role="tab"`, `role="tablist"`, `aria-selected`, `aria-pressed`, `aria-label` e metadados descritivos em SVGs.
  - **Gerenciamento de Ciclo de Vida de Timers**: Prevenção de execução excessiva respeitando `prefers-reduced-motion`, Page Visibility API (pausa quando aba em segundo plano) e `IntersectionObserver` (pausa quando fora do viewport).

- **Revisão didática e UX/UI de Embeddings (3 rodadas)**:
  - Demos em caixas largas (breakout de até 1184px), mapa da página com âncoras, links de breadcrumb/pager corrigidos e foco de teclado preservado entre etapas.
  - Matemática pesada movida para `<details>`, avisos de dimensões ilustrativas, "O que observar" em cada demo e animações iniciando pausadas.
  - Demos 5 (Superforças) e 6 (Inspetor Multimodal) refeitos como ilustrações interativas, incluindo busca HNSW animada passo a passo.
