/* Guia Técnico — shell compartilhado dos infográficos interativos.
   Gera header, navegação por módulos, rodapé, modal de ajuda e toasts a partir
   dos data-attributes do <body> e das <section class="slide-section">.
   Ver CLAUDE.md na raiz do repositório para o contrato completo. */

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff', 100: '#e0e7ff', 400: '#818cf8',
          500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 900: '#1e1b4b',
        },
        surface: { 800: '#1e293b', 850: '#172033', 900: '#0f172a', 950: '#090d16' }
      }
    }
  }
};

/* Mapa do guia — fonte única da sidebar. Caminhos relativos à raiz de public/. */
const GUIA_RAIZ = (() => {
  const src = (document.currentScript && document.currentScript.src) || '';
  return src.replace(/assets\/guia\.js.*$/, '');
})();

const GUIA_MAPA = [
  { n: '1', nome: 'Information Retrieval (RAG)', icone: 'fa-magnifying-glass', path: 'ir/index.html', filhos: [
    { n: '1.1', nome: 'Modelos Esparsos', icone: 'fa-table-cells', path: 'ir/esparsos/index.html', filhos: [
      { n: '1.1.1', nome: 'TF-IDF', path: 'ir/esparsos/tf-idf/index.html' },
      { n: '1.1.2', nome: 'BM25', path: 'ir/esparsos/bm25/index.html' },
      { n: '1.1.3', nome: 'Sparse Encoder (SPLADE)', path: 'ir/esparsos/sparse-encoder/index.html' },
    ]},
    { n: '1.2', nome: 'Modelos Densos', icone: 'fa-vector-square', path: 'ir/densos/index.html', filhos: [
      { n: '1.2.1', nome: 'Embeddings em IR', path: 'ir/densos/embeddings/index.html' },
      { n: '1.2.2', nome: 'Word2Vec', path: 'ir/densos/word2vec/index.html' },
      { n: '1.2.3', nome: 'Origem & Além da Linguagem', path: 'ir/densos/fundamentos/index.html' },
      { n: '1.2.4', nome: 'Arquitetura Transformer', path: 'ir/densos/transformer/index.html' },
      { n: '1.2.5', nome: 'Cross-Encoder', path: 'ir/densos/cross-encoder/index.html' },
      { n: '1.2.6', nome: 'Multi-Vector (ColBERT)', path: 'ir/densos/multi-vector/index.html' },
    ]},
    { n: '1.3', nome: 'Busca Híbrida e RRF', icone: 'fa-code-merge', path: 'ir/rrf/index.html' },
    { n: '1.4', nome: 'Do Retrieval ao Agente Confiável', icone: 'fa-shield-halved', path: 'ir/agente/index.html', filhos: [
      { n: '1.4.1', nome: 'Por que o modelo alucina', path: 'ir/agente/alucinacao/index.html' },
      { n: '1.4.2', nome: 'Grounding e citação', path: 'ir/agente/grounding/index.html' },
      { n: '1.4.3', nome: 'O laço do agente', path: 'ir/agente/laco/index.html' },
      { n: '1.4.4', nome: 'Medir se está funcionando', path: 'ir/agente/avaliacao/index.html' },
      { n: '1.4.5', nome: 'Os outros ganhos', path: 'ir/agente/ganhos/index.html' },
    ]},
  ]},
  { n: '2', nome: 'Redes Neurais', icone: 'fa-brain', path: 'redes-neurais/index.html', filhos: [
    { n: '2.1', nome: 'Transformers', icone: 'fa-diagram-project', path: 'redes-neurais/transformers/index.html', filhos: [
      { n: '2.1.1', nome: 'Positional Encoding', path: 'redes-neurais/transformers/positional-encoding/index.html' },
      { n: '2.1.2', nome: 'Bloco Transformer', path: 'redes-neurais/transformers/bloco/index.html', filhos: [
        { n: '2.1.2.1', nome: 'Multi-head Attention', path: 'redes-neurais/transformers/bloco/multi-head-attention/index.html' },
        { n: '2.1.2.2', nome: 'Add & Norm', path: 'redes-neurais/transformers/bloco/add-norm/index.html' },
        { n: '2.1.2.3', nome: 'Positionwise FFN', path: 'redes-neurais/transformers/bloco/ffn/index.html' },
      ]},
      { n: '2.1.3', nome: 'Encoder', path: 'redes-neurais/transformers/encoder/index.html', filhos: [
        { n: '2.1.3.1', nome: 'Cross-attention', path: 'redes-neurais/transformers/encoder/cross-attention/index.html' },
      ]},
      { n: '2.1.4', nome: 'Decoder', path: 'redes-neurais/transformers/decoder/index.html', filhos: [
        { n: '2.1.4.1', nome: 'Masked Multi-head Attention', path: 'redes-neurais/transformers/decoder/masked-attention/index.html' },
      ]},
      { n: '2.1.5', nome: 'Camada de Saída (FC)', path: 'redes-neurais/transformers/fc/index.html' },
    ]},
  ]},
];

/* Glossário do guia — fonte única, aberta pela tecla G em qualquer página.
   t = termo · d = definição · p = página que ensina (relativa à raiz de public/)
   n = número do tópico · alt = sinônimos e siglas, só para a busca encontrar. */
const GLOSSARIO = [
  {"t": "$(q,d)$", "d": "O par consulta-documento, unidade de trabalho do cross-encoder: cada par vira uma sequência só e custa uma passagem inteira pelo Transformer.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "par consulta documento query document pair"},
  {"t": "$10000$", "d": "A base do positional encoding senoidal, escolhida empiricamente por Vaswani et al. (2017). Ela define a razão entre a frequência mais rápida e a mais lenta do vetor.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "base 10000 base do positional encoding"},
  {"t": "$2 \\cdot L \\cdot n \\cdot d_{model} \\cdot b \\cdot B$", "d": "Os bytes do KV-cache: o $2$ é por guardar $K$ e $V$, $L$ camadas, $n$ posições, $b$ bytes por elemento (2 em fp16) e $B$ sequências no lote. É por isso que contexto longo e lote grande competem pela mesma VRAM.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "2Lnd memoria do kv cache kv cache memory bytes vram"},
  {"t": "$\\alpha_{ij}$", "d": "O peso de atenção depois de somada a máscara: $e^{s_{ij}+M_{ij}}/\\sum_k e^{s_{ik}+M_{ik}}$. Como $e^{-\\infty} = 0$, o futuro some do numerador e do denominador e a linha continua somando $1$.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "alpha ij peso mascarado masked weight softmax do prefixo"},
  {"t": "$\\alpha_{tj}$", "d": "O peso que a posição gerada $t$ deposita no token de origem $j$. Cada linha soma 1, e a matriz inteira lê-se como um alinhamento entre as duas sequências — que emerge do treino, sem supervisão.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "alpha tj peso de alinhamento alignment weight matriz de alinhamento"},
  {"t": "$\\beta$", "d": "Deslocamento aprendido da LayerNorm, um valor por dimensão ($\\beta \\in \\mathbb{R}^{d}$), inicializado em 0. Devolve a média que a normalização acabou de zerar, se o modelo precisar dela. A RMSNorm dispensa esse parâmetro.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "beta deslocamento shift bias layernorm"},
  {"t": "$\\cos(\\theta)$", "d": "Similaridade do cosseno entre consulta e documento. Vale 1 na mesma direção, 0 para assuntos ortogonais e -1 em direções opostas (raro em texto, que ocupa um cone estreito).", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "cosseno cosine similarity similaridade"},
  {"t": "$\\ell_{\\text{FLOPS}}$", "d": "Penalidade que coloca o custo do índice dentro da função objetivo: soma, sobre o vocabulário, do quadrado da ativação média de cada termo no lote. Termo que acende em quase todo documento custa desproporcionalmente mais.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "flops regularizacao esparsidade regularization postings"},
  {"t": "$\\epsilon$", "d": "Constante minúscula, tipicamente $10^{-5}$, somada dentro da raiz para impedir divisão por zero quando o vetor é constante e amortecer a derivada quando $\\sigma$ é muito pequeno.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "epsilon eps constante de estabilidade numerica"},
  {"t": "$\\gamma$", "d": "Controle de amplitude do simulador (padrão 8,0). Existe só porque o modelo didático tem 4 dimensões e não 64: ele simula, numa escala legível, a magnitude que os scores teriam num modelo real.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "gamma amplitude escala do simulador"},
  {"t": "$\\hat{p}$", "d": "A taxa observada na amostra (fidelidade, recall, o que estiver sendo medido). É a estimativa cuja incerteza a margem de erro quantifica.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "p chapeu taxa observada proporcao estimada"},
  {"t": "$\\hat{x}_i$", "d": "A $i$-ésima casa do vetor já normalizado, $(x_i - \\mu)/\\sqrt{\\sigma^2 + \\epsilon}$, antes de receber $\\gamma$ e $\\beta$.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "x chapeu normalizado x hat normalized"},
  {"t": "$\\lambda$", "d": "O slider de esparsidade do simulador: aplica o soft-threshold $w_j' = \\max(0,\\; w_j - \\lambda(\\alpha + \\beta\\,\\mathrm{df}_j))$, com $\\alpha = 0{,}6$ e $\\beta = 6$. Termos frequentes morrem primeiro; termos raros e fortes resistem.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "lambda soft threshold poda limiar sparsity slider"},
  {"t": "$\\lambda_q$ e $\\lambda_d$", "d": "Pesos da regularização FLOPS na consulta e no documento. O SPLADE usa $\\lambda_q > \\lambda_d$: a consulta pode ser mais rasa, porque o custo da busca cresce com o número de termos dela vezes o tamanho das listas de postings.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "lambda q lambda d assimetria consulta documento regularizacao"},
  {"t": "$\\langle\\text{eos}\\rangle$", "d": "O token de fim de sequência — escrito também como um marcador de fim, o nome varia. Recebe um logit e disputa o softmax como qualquer outro token; quando é amostrado, o laço de geração para.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "eos end of sequence fim de sequencia token de parada"},
  {"t": "$\\lVert v \\rVert_2$", "d": "Norma euclidiana do vetor. Com todos os vetores normalizados ($\\lVert v \\rVert_2 = 1$), o cosseno se reduz ao produto escalar $\\sum_i q_i d_i$.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "norma l2 norm normalizacao vetor unitario"},
  {"t": "$\\mathbf{0}$ e $\\mathbf{1}$", "d": "Os dois segment embeddings somados a cada posição: $\\mathbf{0}$ em tudo até o primeiro [SEP] (a consulta) e $\\mathbf{1}$ no resto (o documento). É assim que a atenção distingue \"olhar para o outro lado\" de \"olhar para o próprio lado\".", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "segment embedding vetor 0 vetor 1 token type"},
  {"t": "$\\mathcal{L}$", "d": "A perda do treino por teacher forcing, $-\\sum_{t=1}^{T} \\log p_\\theta(y_t \\mid y_{\\lt t}, x)$, somada sobre todas as posições de uma única passada.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "L caligrafico perda loss entropia cruzada cross entropy"},
  {"t": "$\\mathcal{L}_{\\text{InfoNCE}}$", "d": "A perda contrastiva: menos o log da razão entre a exponencial da similaridade com o positivo e a soma dela com as dos negativos, tudo dividido por $\\tau$. É o padrão moderno para calibrar espaços de busca vetorial.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "infonce perda contrastiva contrastive loss"},
  {"t": "$\\mathcal{L}_{\\text{NEG}}$", "d": "A perda do negative sampling: $\\log \\sigma$ do par real somado à esperança de $\\log \\sigma$ dos negativos com sinal trocado. Atualiza só o par positivo e a amostra de ruído.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "L NEG perda negative sampling loss sgns"},
  {"t": "$\\mathcal{O}(d \\log N)$", "d": "Custo aproximado de uma busca no grafo HNSW: cerca de $ef \\cdot \\log_2 N$ comparações em vez de $N$, abrindo mão de recall garantido.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "O(d log N) hnsw custo logaritmico complexidade ann"},
  {"t": "$\\mathcal{O}(n^2)$", "d": "Custo da atenção: cada token compara com todos os outros, então dobrar a frase quadruplica a conta. É por isso que o Transformer pede GPU onde o Word2Vec era consulta em tabela.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "O(n^2) custo quadratico complexidade quadratic attention cost"},
  {"t": "$\\mathcal{O}(Nd)$", "d": "Custo da varredura exata: comparar a consulta com todos os $N$ vetores do índice, cada um de $d$ dimensões. É o que a busca por vizinhos aproximados existe para evitar.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "O(Nd) custo varredura exata brute force complexidade"},
  {"t": "$\\mathcal{P}$", "d": "O conjunto de posições de preenchimento de um exemplo do lote. A máscara de padding põe $-\\infty$ em colunas inteiras, $M_{ij} = -\\infty$ se $j \\in \\mathcal{P}$, e depende do exemplo, não do índice.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "P caligrafico conjunto de padding PAD preenchimento padding set"},
  {"t": "$\\mathrm{df}(t)$", "d": "Em quantos documentos da coleção o termo aparece ao menos uma vez — nunca quantas vezes. É a única parte da fórmula que enxerga a coleção inteira.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "df document frequency frequencia documental"},
  {"t": "$\\mathrm{head}_h$", "d": "A saída de uma das $H$ atenções paralelas, $\\mathrm{Attention}(XW^Q_h, XW^K_h, XW^V_h)$. As $H$ cabeças são concatenadas e misturadas por $W^O$.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "head cabeca de atencao attention head multihead"},
  {"t": "$\\mathrm{idf}(t)$", "d": "Peso de raridade do termo, na forma clássica $\\ln(N/\\mathrm{df}(t))$. Quanto menor o $\\mathrm{df}$, maior o $\\mathrm{idf}$; um termo presente em todos os documentos zera sua contribuição.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "idf inverse document frequency raridade"},
  {"t": "$\\mathrm{LN}(\\cdot)$", "d": "Abreviação de LayerNorm nas fórmulas de ordem: pós-norma é $x_{\\ell+1} = \\mathrm{LN}(x_\\ell + F_\\ell(x_\\ell))$ e pré-norma é $x_{\\ell+1} = x_\\ell + F_\\ell(\\mathrm{LN}(x_\\ell))$.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "LN layernorm normalizacao pre-norma pos-norma"},
  {"t": "$\\mathrm{ReLU}$", "d": "Zera tudo que é negativo antes do $\\log$ — é ela que cria a esparsidade do vetor. O $\\log$ que vem depois comprime os picos para nenhum termo dominar sozinho.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "relu ativacao rectified linear unit esparsidade"},
  {"t": "$\\mathrm{RMS}(x)$", "d": "A raiz da média dos quadrados, $\\sqrt{\\epsilon + \\frac{1}{d}\\sum_j x_j^2}$, que substitui média e desvio na RMSNorm. Sem centragem, a norma custa $d$ parâmetros em vez de $2d$ e uma passada de redução a menos.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "RMS root mean square rmsnorm raiz da media dos quadrados"},
  {"t": "$\\mathrm{score}(D,Q)$", "d": "Soma de $w_{\\mathrm{tf}} \\cdot \\mathrm{idf}$ sobre os termos da consulta; é o número que ordena os documentos.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "score pontuacao ranking relevancia"},
  {"t": "$\\mathrm{sim}(q, d)$", "d": "A similaridade entre consulta e documento dentro da InfoNCE — na prática, o cosseno entre os dois vetores.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "sim similaridade similarity cosseno"},
  {"t": "$\\mathrm{Sublayer}(x)$", "d": "O sublayer genérico dentro do invólucro $\\mathrm{LayerNorm}(x + \\mathrm{Sublayer}(x))$ — pode ser atenção, cross-attention ou FFN. Seja qual for, ele devolve um tensor com as mesmas $d_{model}$ casas da entrada.", "p": "redes-neurais/transformers/bloco/index.html", "n": "2.1.2", "alt": "sublayer sub-camada invólucro wrapper F(x)"},
  {"t": "$\\mathrm{tf}(t, D)$", "d": "Quantas vezes o termo $t$ aparece no documento $D$. É uma contagem: olha um documento por vez e ignora o resto da coleção.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "tf term frequency frequencia do termo contagem"},
  {"t": "$\\max(0,z)$", "d": "A ReLU, não-linearidade da FFN no paper de 2017. Barata e esparsa — toda pré-ativação negativa vira zero exato —, ao preço de derivada nula à esquerda: unidade que morre não volta.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "relu max 0 z rectified linear unit ativacao"},
  {"t": "$\\max_j$", "d": "O operador que dá nome ao MaxSim: de cada linha da grade de cossenos, guarda só o melhor par. Mesmo um token sem par forte contribui com o melhor que encontrou.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "max j maximo por linha maxsim operador"},
  {"t": "$\\max_u z_u$", "d": "O maior logit, subtraído de todos antes de exponenciar. Como $\\mathrm{softmax}(z + c) = \\mathrm{softmax}(z)$, o resultado é idêntico — a subtração existe só para o maior expoente virar $0$ e a exponencial não estourar.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "max z maior logit estabilidade numerica overflow subtrair o maximo"},
  {"t": "$\\mu$", "d": "Média das $d$ features de um único token, $\\mu = \\frac{1}{d}\\sum_i x_i$. A LayerNorm nunca soma sobre o lote nem sobre a sequência — só sobre as casas daquele vetor.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "mu media mean layernorm estatistica"},
  {"t": "$\\odot$", "d": "Produto de Hadamard, elemento a elemento. No SwiGLU é ele que deixa uma projeção controlar a outra; na LayerNorm é como $\\gamma$ multiplica o vetor normalizado.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "hadamard produto elemento a elemento elementwise product odot"},
  {"t": "$\\omega_i$", "d": "Frequência angular do par $i$: $\\omega_i = 1/\\text{base}^{2i/d}$. Vale $1$ em $i=0$ (gira rápido) e cai geometricamente até cerca de $1/\\text{base}$ no último par (gira devagar).", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "omega frequencia frequency angular comprimento de onda"},
  {"t": "$\\pi_{ij}$", "d": "Proximidade posicional entre as posições $i$ e $j$, $\\pi_{ij} = e^{-|i-j|/2}$: aproximação didática do efeito do embedding posicional, que decai conforme os tokens se afastam.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "pi ij proximidade posicional decaimento positional proximity"},
  {"t": "$\\sigma$", "d": "A sigmoid, $\\sigma(x) = 1/(1+e^{-x})$. Espreme o logit para o intervalo $(0,1)$ e permite ler o score como probabilidade de relevância.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "sigma sigmoid sigmoide funcao logistica"},
  {"t": "$\\sigma(z)$", "d": "A sigmoide $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, que transforma o score de um par em probabilidade. O treino empurra $\\sigma$ para 1 no par real e para 0 nos ruídos.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "sigma sigmoide sigmoid logistica"},
  {"t": "$\\sigma^2$", "d": "Variância das $d$ features do mesmo token, $\\frac{1}{d}\\sum_i (x_i - \\mu)^2$. Sua raiz é o que divide o vetor centrado na LayerNorm.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "sigma2 variancia variance desvio padrao"},
  {"t": "$\\sqrt{d_k}$", "d": "O divisor aplicado aos scores antes do softmax. Produtos escalares em $d_k$ dimensões crescem com $\\sqrt{d_k}$; sem essa divisão, com $d_k = 64$ o softmax satura em 0/1 e a atenção vira tudo-ou-nada.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "raiz de dk scaling scaled dot product escala"},
  {"t": "$\\tau$", "d": "Temperatura da perda contrastiva, tipicamente entre 0,05 e 0,07. Funciona como termostato: temperaturas baixas amplificam a penalidade sobre negativos de similaridade alta e forçam o modelo a separar nuances finas.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "tau temperatura temperature infonce clip"},
  {"t": "$\\text{cob}(\\tau)$", "d": "Cobertura: fração das afirmações que passam do limiar, $|\\{c: s(c)\\ge\\tau\\}|/|C|$. Quanto da resposta sobrevive à verificação.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "cobertura coverage cob tau"},
  {"t": "$\\text{DCG@}k$", "d": "Ganho acumulado com desconto, $\\sum_{i=1}^{k} rel_i/\\log_2(i+1)$: cada acerto vale menos conforme desce na lista.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "DCG discounted cumulative gain ganho descontado"},
  {"t": "$\\text{fidelidade}(C, R)$", "d": "Fração das afirmações da resposta que algum trecho recuperado sustenta. Mede suporte no contexto, não verdade no mundo.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "fidelidade faithfulness groundedness"},
  {"t": "$\\text{IDCG@}k$", "d": "O DCG do ranking ideal, com todos os relevantes no topo. Serve de divisor para que o nDCG fique entre 0 e 1 e possa comparar consultas com números diferentes de relevantes.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "IDCG ideal dcg ranking ideal"},
  {"t": "$\\text{norma}(D)$", "d": "O fator de comprimento $1 - b + b\\,|D|/avgdl$, que multiplica $k_1$ no denominador. Vale 1 quando $|D| = avgdl$, infla o denominador de documentos longos e o reduz nos curtos.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "norma norm fator de comprimento length norm"},
  {"t": "$\\text{prec}(\\tau)$", "d": "Precisão da citação: entre as afirmações que passaram do limiar, a fração realmente sustentada por algum trecho. Quanto do que sobrou é confiável.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "precisao da citacao citation precision prec tau"},
  {"t": "$\\text{rank}_q$", "d": "Posição do primeiro trecho relevante na lista da consulta $q$ — o que o MRR inverte. Na bancada é calculado dentro do top-$k$, e vale zero se nenhum relevante entrou (o que se escreve $\\text{MRR@}k$).", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "rank q posicao do primeiro relevante first relevant rank"},
  {"t": "$\\text{rank}_r(d)$", "d": "Posição do documento $d$ na lista $r$, com $1$ = melhor. Se $d$ não entrou no top-k daquele motor, ele simplesmente não recebe parcela dessa lista.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "rank posicao na lista rank r d"},
  {"t": "$\\text{RRF}(d)$", "d": "O score de fusão do documento $d$: a soma, sobre as listas em que ele apareceu, de $1/(k + \\text{rank})$. Nunca pergunta quanto um motor gostou dele, só em que lugar o colocou.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "RRF reciprocal rank fusion score de fusao"},
  {"t": "$\\theta$", "d": "O ângulo entre o vetor da consulta e o do documento. Relevância vira ângulo: quanto menor o $\\theta$, maior o alinhamento semântico.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "theta angulo angle"},
  {"t": "$\\tilde{s}$", "d": "Score depois da normalização min-max, $\\tilde{s} = \\frac{s - s_{\\min}}{s_{\\max} - s_{\\min}}$, que leva cada lista para $[0,1]$. Depende dos extremos daquela consulta, e por isso é frágil.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "s til normalizacao min-max minmax normalizado"},
  {"t": "$\\times n$", "d": "O número de cópias do bloco empilhadas, cada uma com pesos próprios (12 no BERT-base). Só é possível escrever isso no diagrama porque entrada e saída do bloco têm a mesma forma. Outras páginas chamam a mesma contagem de $N$ ou $L$.", "p": "redes-neurais/transformers/bloco/index.html", "n": "2.1.2", "alt": "n camadas numero de blocos layers depth profundidade"},
  {"t": "$\\varepsilon$", "d": "Margem de erro a 95%, $\\varepsilon \\approx 1{,}96\\sqrt{\\hat{p}(1-\\hat{p})/n}$. O intervalo de Wald fica ruim com $n$ pequeno ou taxa perto de 0 ou 1; nesses casos use Wilson ou Clopper-Pearson.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "epsilon margem de erro intervalo de confianca wald"},
  {"t": "$B \\times L \\times d$", "d": "A forma do tensor de um lote: $B$ sequências, comprimento $L$ do lote (o maior do lote, completado com [PAD]) e $d$ casas por token. Só as $n$ primeiras posições de cada frase são texto de verdade.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "B L d forma do lote batch shape tamanho do lote padding"},
  {"t": "$b$", "d": "Controla o peso do comprimento através de $1 - b + b\\,|D|/avgdl$. Com $b = 1$ a penalização é na proporção exata do excesso; com $b = 0$ a normalização é desligada. Típico: 0,75.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "b normalizacao por comprimento length normalization"},
  {"t": "$b_1, b_2$", "d": "Os dois vieses da FFN, com $d_{ff}$ e $d_{model}$ casas. Vários modelos modernos simplesmente os removem.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "b1 b2 vieses bias biases ffn"},
  {"t": "$c$", "d": "Raio da janela de contexto: quantas palavras de cada lado do alvo entram como contexto. Um alvo gera $2c$ tarefas de predição no Skip-Gram.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "c raio janela window size contexto"},
  {"t": "$D$", "d": "Um documento da coleção — a unidade que recebe score e é ordenada no ranking.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "D documento document"},
  {"t": "$d^{+}$ e $d^{-}_{j}$", "d": "O documento positivo (o par certo da âncora) e os negativos $j$ do lote. O gradiente puxa o positivo para perto da consulta e empurra os negativos para longe.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "d positivo d negativo positive negative hard negative ancora"},
  {"t": "$d_k$", "d": "Dimensão dos vetores $Q$ e $K$ de cada cabeça — 64 por cabeça no BERT-base, com entrada de 768. É a dimensão em que o produto escalar da atenção é calculado.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "dk dimensao da cabeca head dimension key dimension"},
  {"t": "$d_v$", "d": "Dimensão do valor em cada cabeça. No paper original $d_v = d_k$, e é ela que determina a largura de cada fatia concatenada antes de $W^O$.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "dv d v dimensao do valor value dimension"},
  {"t": "$d_{ff}$", "d": "Largura interna da FFN, entre as duas camadas densas (2048 no paper, 3072 no BERT-base). A convenção $d_{ff} = 4\\,d_{model}$ pegou por replicação, não por teorema.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "d ff dff largura interna hidden size ffn dimension expansao"},
  {"t": "$d_{ff}^{gate}$", "d": "A largura ajustada da FFN com porta: igualando $3\\,d\\,d_{ff}^{gate} = 2\\,d\\,d_{ff}$ chega-se a $d_{ff}^{gate} = \\tfrac{2}{3} d_{ff}$. É por isso que modelos com SwiGLU exibem razões como $2{,}7\\times$ em vez de $4\\times$.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "d ff gate swiglu dois tercos 2/3 largura ajustada"},
  {"t": "$d_{model}$", "d": "Largura do modelo: número de casas do vetor de cada token, constante em toda a pilha (768 no BERT-base, 512 no paper de 2017). A soma residual exige que entrada e saída de cada sublayer tenham essa mesma forma. Abreviado como $d$ em várias fórmulas.", "p": "redes-neurais/transformers/bloco/index.html", "n": "2.1.2", "alt": "d model dimensao do modelo model dimension width largura hidden size"},
  {"t": "$d_{pos}$", "d": "Número de casas que seriam reservadas só para posição na opção de concatenar em vez de somar (64 no simulador). Cada casa extra atravessa todas as projeções de todas as camadas.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "d pos concatenar concat dimensao posicional"},
  {"t": "$E$", "d": "A matriz de embeddings dos tokens da entrada. Somada ao positional encoding forma a entrada da pilha, $H^{(0)} = E + PE \\in \\mathbb{R}^{n \\times d}$.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "E embeddings tabela de embeddings embedding matrix"},
  {"t": "$E_{d_j}$", "d": "O vetor do $j$-ésimo token do documento, normalizado ($\\lVert E_{d_j} \\rVert = 1$) — por isso o produto escalar $E_{q_i}^{\\top} E_{d_j}$ é exatamente o cosseno, em $[-1, 1]$.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "E dj vetor do token do documento document token embedding"},
  {"t": "$E_{q_i}$", "d": "O vetor do $i$-ésimo token da consulta, normalizado. Na interação tardia cada token da pergunta mantém o próprio vetor em vez de colapsar num só.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "E qi vetor do token da consulta query token embedding"},
  {"t": "$ef$", "d": "Parâmetro de exploração do HNSW: quantos candidatos o grafo visita por busca. Subir o $ef$ recupera recall pagando latência — o índice é aproximado e o vizinho verdadeiro pode não aparecer.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "ef efSearch hnsw exploracao recall ann"},
  {"t": "$F_\\ell$", "d": "A função do sublayer da camada $\\ell$ — atenção ou FFN. Com residual ela aprende só a correção a somar, e \"não fazer nada\" vira o estado trivial $F_\\ell \\approx 0$.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "F l sublayer funcao da camada residual branch ramo"},
  {"t": "$g$", "d": "Ganho por camada no modelo de brinquedo do comparador de profundidade: um número que resume o quanto cada bloco encolhe ou amplia o sinal. Sem residual a magnitude vira $g^{L}$; com residual, $(1+g)^{L}$.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "g ganho por camada gain fator escalar"},
  {"t": "$h$", "d": "A camada oculta, sem não-linearidade: no CBOW é a média dos vetores de contexto, $h = \\frac{1}{2c}\\sum_j v_{w_{t+j}}$; no Skip-Gram é o próprio vetor do alvo, $h = v_{w_t}$.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "h camada oculta hidden layer projecao media"},
  {"t": "$H^{(\\ell)}$", "d": "A matriz $n \\times d$ que sai do bloco $\\ell$ do encoder: $H^{(\\ell)} = \\mathrm{Bloco}_\\ell(H^{(\\ell-1)})$. A forma nunca muda ao longo da pilha — é essa invariância que permite empilhar.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "H l estado da camada hidden states saida do bloco"},
  {"t": "$H^{(N)}$", "d": "A saída da última camada do encoder: os vetores contextuais, um por token de entrada. Vira o $K$ e o $V$ da cross-attention, ou o produto final de um bi-encoder, cross-encoder ou classificador.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "H N saida do encoder vetores contextuais contextual embeddings output"},
  {"t": "$H^{dec}$", "d": "O estado do decoder que entra na cross-attention, já passado pela atenção mascarada. Dele sai o $Q$: a pergunta de quem está prestes a escrever a próxima palavra.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "H dec estado do decoder decoder state query side"},
  {"t": "$H^{enc}$", "d": "A saída da pilha do encoder vista pelo decoder: calculada uma única vez para a frase de origem e reusada em todos os passos da geração. Dela saem o $K$ e o $V$ da cross-attention.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "H enc saida do encoder encoder output origem source"},
  {"t": "$h_{[\\text{CLS}]}$", "d": "O vetor da posição [CLS] depois das 12 camadas: o resumo do par consulta-documento. Não é indexável — se a consulta mudar, ele é recalculado do zero.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "h CLS vetor do CLS cls vector pooled output"},
  {"t": "$i$", "d": "Índice do par de dimensões do vetor posicional, $i = 0 \\dots d/2-1$. Cada $i$ ocupa duas casas: $2i$ recebe o seno e $2i+1$ o cosseno.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "i indice do par de dimensoes pair index 2i"},
  {"t": "$J_\\ell$", "d": "O jacobiano do sublayer da camada $\\ell$. Sem residual, o gradiente é um produto puro desses jacobianos; com residual, cada fator vira $I + J_\\ell$.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "J jacobiano jacobian derivada"},
  {"t": "$k$", "d": "Número de palavras de ruído sorteadas por par positivo no negative sampling, tipicamente entre 5 e 20. Troca o custo $\\mathcal{O}(|V|)$ da softmax por $\\mathcal{O}(k)$.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "k negativos negative samples sgns ruido"},
  {"t": "$k_1$", "d": "Controla a saturação da frequência no BM25: maior $k_1$ faz a repetição seguir ajudando por mais tempo, e o teto da curva é sempre $k_1 + 1$. Com $k_1 = 0$ o termo vira binário. Típico: 1,2 a 2,0.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "k1 saturacao saturation frequencia teto"},
  {"t": "$K_{1:t}$", "d": "As chaves de todo o prefixo até $t$. As linhas anteriores são bit a bit as mesmas do passo anterior — a causalidade garante isso —, e é exatamente o que o KV-cache guarda para não recalcular.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "K 1 t chaves do prefixo kv cache cache de chaves"},
  {"t": "$L$", "d": "Número de camadas empilhadas (24 no exemplo do comparador, 12 no BERT-base). É o expoente do produto de jacobianos e, na pré-norma, o que faz o peso da entrada cair só como $1/\\sqrt{1+L}$.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "L camadas profundidade layers depth numero de blocos"},
  {"t": "$M$", "d": "A máscara somada aos scores antes do softmax, $\\mathrm{softmax}(QK^\\top/\\sqrt{d_k} + M)V$. No encoder ela é toda zero (bidirecional); no decoder ela zera o futuro. Quando padding e causalidade coexistem, $M = M_{\\text{pad}} + M_{\\text{causal}}$.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "M mascara mask matriz de mascara attention mask"},
  {"t": "$M_k$", "d": "A matriz de rotação que leva $PE_{pos}$ em $PE_{pos+k}$. Contém apenas $k$, nunca $pos$ — é a mesma em qualquer ponto da sequência, e é isso que abre caminho para a leitura relativa.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "Mk matriz de rotacao rotation matrix deslocamento linear"},
  {"t": "$m_{ij}$", "d": "O termo da máscara de padding somado ao score antes do softmax: $0$ se a coluna $j$ é um token válido, $-\\infty$ se é preenchimento. Na prática usa-se um número muito negativo finito, como $-10^{9}$.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "m ij mascara de padding padding mask PAD menos infinito"},
  {"t": "$N$", "d": "Número total de documentos da coleção (no simulador da página, 5). É o universo contra o qual a raridade de um termo é medida.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "N numero de documentos colecao collection size"},
  {"t": "$n(n+1)/2$", "d": "O total de posições processadas se cada prefixo fosse alimentado separadamente, em $n$ passadas. Com a máscara, bastam $n$ posições em uma passada — $(n+1)/2$ vezes menos trabalho.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "n n+1 sobre 2 soma dos prefixos triangular custo do treino"},
  {"t": "$n^{\\star}$", "d": "O comprimento de sequência em que o custo da atenção iguala o da FFN: $n^{\\star} = d_{ff} - 2\\,d_{model}$. Acima disso o termo $2n^2d$ domina. Vale para o forward denso.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "n estrela n star cruzamento crossover ponto de equilibrio custo"},
  {"t": "$n_t$", "d": "Em quantos documentos da coleção o termo $t$ aparece pelo menos uma vez — o document frequency, escrito assim dentro do IDF do BM25.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "nt document frequency numero de documentos com o termo"},
  {"t": "$n_{dec}$", "d": "Número de posições já geradas pelo decoder — as linhas da matriz de alinhamento. Nada obriga $n_{dec} = n_{enc}$, e é por isso que a matriz da cross-attention é retangular.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "n dec tokens gerados target length comprimento da saida"},
  {"t": "$n_{enc}$", "d": "Número de tokens da sequência de origem — as colunas da matriz de alinhamento e as linhas de $K$ e $V$ na cross-attention.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "n enc tokens de origem source length comprimento da entrada"},
  {"t": "$n_{max}$", "d": "Comprimento máximo de contexto de um positional encoding aprendido: a tabela treinada tem forma $n_{max} \\times d$ e nada existe além dessa posição. O PE senoidal não tem esse teto.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "n max contexto maximo max context length tabela de posicao"},
  {"t": "$O(n^2 d)$", "d": "O custo em tempo do núcleo de atenção: cerca de $2n^2 d$ multiplicações-acumulações por camada, independentemente de $H$. A memória é $O(n^2)$ por cabeça e por camada — pior que o tempo, e a razão de existir do FlashAttention.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "O n2 d custo quadratico complexidade complexity MACs"},
  {"t": "$o_t$", "d": "O vetor de saída da posição $t$, $o_t = \\sum_j \\alpha_{tj} v_j$. Com a máscara, é uma média convexa só de valores do prefixo; zerar pesos depois do softmax encolheria esse vetor por um fator arbitrário.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "o t vetor de saida output vector saida da atencao"},
  {"t": "$p$", "d": "Preço por milhão de tokens de entrada, do provedor do modelo. É o único termo da fórmula de custo que não depende da sua arquitetura.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "p preco por milhao de tokens price per million"},
  {"t": "$P(\\text{entailment})$", "d": "Probabilidade devolvida por um classificador de NLI para o par (trecho, afirmação). Rápido, barato e local, mas sofre com trechos longos, raciocínio numérico e afirmações que dependem de duas frases distantes.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "P entailment nli classificador inferencia textual"},
  {"t": "$P(w_O \\mid w_I)$", "d": "A softmax completa sobre o vocabulário: probabilidade da palavra de saída $w_O$ dada a de entrada $w_I$. Custa $\\mathcal{O}(|V|)$ por atualização — com $|V| = 1.000.000$, o treino colapsa para poucos tokens por segundo.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "P w O w I softmax completa full softmax probabilidade wI wO"},
  {"t": "$p(y \\mid x)$", "d": "A probabilidade da sequência de saída dada a entrada, fatorada exatamente pela regra da cadeia em $\\prod_{t=1}^{T} p(y_t \\mid y_{\\lt t}, x)$. O decoder aprende um único modelo dessa condicional e o aplica $T$ vezes.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "p y dado x probabilidade da sequencia regra da cadeia chain rule autoregressivo"},
  {"t": "$p_\\theta$", "d": "O modelo aprendido da condicional, com $\\theta$ os pesos da rede. É um só, aplicado repetidamente a cada posição.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "p theta modelo parametrizado parametros theta"},
  {"t": "$P_n(w)$", "d": "Distribuição de ruído usada para sortear os negativos: $P_n(w) \\propto f(w)^{3/4}$. O expoente 0,75 infla a chance de palavras raras serem sorteadas sem descartar as frequentes.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "Pn distribuicao de ruido noise distribution unigram 3/4 0.75"},
  {"t": "$p_v$", "d": "A probabilidade da palavra $v$ depois do softmax, $e^{z_v}/\\sum_{u \\in V} e^{z_u}$. O denominador percorre o vocabulário inteiro, e é esse acoplamento global que custa $O(|V|)$ por posição.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "p v probabilidade da palavra softmax distribuicao"},
  {"t": "$P_{attn}$", "d": "Parâmetros da atenção multi-head por bloco: $\\approx 4\\,d_{model}^{2}$, das quatro matrizes $W_Q$, $W_K$, $W_V$ e $W_O$ (com vieses, $4d_{model}^2 + 4d_{model}$).", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "P attn parametros da atencao attention parameters 4d2"},
  {"t": "$P_{ffn}$", "d": "Parâmetros da FFN por bloco: $\\approx 2\\,d_{model}\\,d_{ff}$, que com a razão $4\\times$ vira $8\\,d_{model}^{2}$ — o dobro da atenção, cerca de dois terços do bloco.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "P ffn parametros da ffn feedforward parameters 8d2"},
  {"t": "$PE_{(pos,\\,2i)}$", "d": "O embedding posicional senoidal original, $\\sin(pos/10000^{2i/d})$ nas dimensões pares e $\\cos$ nas ímpares. No BERT-base a posição é aprendida em vez de senoidal, com $d = 768$.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "PE positional encoding senoidal sinusoidal embedding posicional"},
  {"t": "$PE_{pos}$", "d": "O vetor posicional completo da posição $pos$, com $d$ casas de senos e cossenos. Entra na soma $x_{pos} = E(\\text{token}) + PE_{pos}$ que alimenta o primeiro bloco.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "PE positional encoding vetor posicional"},
  {"t": "$pos$", "d": "Índice do token na sequência ($0, 1, 2, \\dots$). É exatamente o que o positional encoding precisa codificar em um vetor.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "pos posicao position indice do token"},
  {"t": "$Q$", "d": "O conjunto de termos da consulta. Só os termos de $Q$ contribuem para o score: documento sem nenhum deles fica fora do ranking.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "Q consulta query conjunto de termos"},
  {"t": "$q_t$", "d": "A consulta da última posição na geração — a única que interessa naquele passo, já que as anteriores já tiveram seu token escolhido.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "q t query nova ultima posicao last query"},
  {"t": "$QK^\\top$", "d": "A matriz $n \\times n$ de scores brutos: a linha $i$ traz o quanto o token $i$ pontua cada token da frase, antes da escala e do softmax.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "QK transposto matriz de scores score matrix produto QK"},
  {"t": "$R$", "d": "O conjunto de listas fundidas, uma por retriever (BM25, bi-encoder, SPLADE...). É sobre ele que o somatório do RRF corre.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "R conjunto de listas retrievers rankings"},
  {"t": "$rel_i$", "d": "A relevância do item na posição $i$. Na página é binária, $rel_i \\in \\{0,1\\}$, o que faz um trecho essencial e um tangencial valerem igual.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "rel i relevancia binaria graded relevance"},
  {"t": "$s(c)$", "d": "Score do verificador para a afirmação $c$, em $[0,1]$: o quanto ele acredita que o trecho citado a sustenta. Só sobrevive na resposta final quem tem $s(c) \\ge \\tau$.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "s de c score do verificador verifier score"},
  {"t": "$s(q,d)$", "d": "O produto escalar esparso $\\sum_j w_j^{q} w_j^{d}$ entre os vetores de consulta e documento. Roda no mesmo índice invertido do BM25 — só troca a contagem TF-IDF pelo peso aprendido.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "s q d produto escalar esparso dot product score splade"},
  {"t": "$s_{\\cos}$", "d": "O score do bi-encoder, o cosseno em $[-1, 1]$. Convive mal com o BM25 numa soma direta, o que motiva normalizar ou, melhor, fundir por posição.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "s cos cosseno score denso"},
  {"t": "$s_{\\text{BM25}}$", "d": "O score bruto do BM25, em $[0, \\infty)$ e sem teto. Somá-lo direto ao cosseno não funciona: as duas escalas não são comparáveis.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "s bm25 score lexico escala aberta"},
  {"t": "$s_{ij}$", "d": "O score bruto do token $i$ olhando para o token $j$, no simulador da página: $s_{ij} = \\gamma\\,(q_i \\cdot k_j + \\lambda\\,\\pi_{ij}) / \\sqrt{d_k}$, antes de virar peso pelo softmax.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "sij score bruto attention score logit de atencao"},
  {"t": "$S_{q,d}$", "d": "O score MaxSim do par: a soma, sobre cada token da consulta, do melhor cosseno que ele encontra no documento. Cresce com $|q|$, então não é comparável entre consultas diferentes.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "S q d score maxsim late interaction score"},
  {"t": "$t \\models c$", "d": "\"O trecho $t$ sustenta a afirmação $c$\", emprestado da relação de entailment: lendo só $t$, uma pessoa razoável concluiria $c$.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "t models c entailment sustenta implica"},
  {"t": "$t$", "d": "Um termo (palavra) da consulta, depois da tokenização. É sobre os $t$ da consulta que a soma do score percorre.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "t termo palavra term token"},
  {"t": "$t_d$", "d": "Tokens por documento recuperado. Multiplica a quantidade de documentos que entram no prompt, então é o que dita o peso de cada trecho na conta.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "t d tokens por documento tamanho do chunk"},
  {"t": "$T_k$", "d": "Os $k$ trechos que a busca efetivamente devolveu no corte. Todas as métricas @k comparam $T_k$ com o conjunto $R$ de relevantes.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "T k top-k recuperados retrieved set"},
  {"t": "$t_q$", "d": "Tokens da pergunta do usuário. Parcela fixa do prompt, a mesma nos dois cenários.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "t q tokens da pergunta query tokens"},
  {"t": "$T_{\\text{base inteira}}$", "d": "Tempo de pontuar toda a base com o cross-encoder, $N \\cdot t_{\\text{par}}$. Na calculadora da página é a conta que explode com milhões de documentos.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "T base inteira custo ingenuo brute force naive"},
  {"t": "$T_{\\text{funil}}$", "d": "Tempo do funil de dois estágios, $T_{1^\\circ} + k \\cdot t_{\\text{par}}$, em que $T_{1^\\circ}$ é a latência do primeiro estágio. Não depende de $N$: por isso a linha fica quase plana.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "T funil funnel two-stage dois estagios T primeiro"},
  {"t": "$t_{\\text{par}}$", "d": "Custo de tempo de uma passagem do cross-encoder por par $(q,d)$. É o fator que multiplica tanto o funil quanto o cenário ingênuo de rodar na base inteira.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "t par custo por par latencia por par per-pair cost"},
  {"t": "$T_{\\text{RAG}}$", "d": "Tokens de entrada por consulta com recuperação: $\\min(k,\\,N) \\cdot t_d + t_q + t_{\\text{sys}}$. Trava no top-$k$ e para de depender de $N$.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "T RAG tokens com recuperacao custo do rag"},
  {"t": "$t_{\\text{sys}}$", "d": "Tokens do prompt de sistema. Parcela fixa que se paga em toda consulta, independentemente de quantos documentos entraram.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "t sys prompt de sistema system prompt"},
  {"t": "$T_{\\text{tudo}}$", "d": "Tokens de entrada por consulta quando se joga a base inteira no prompt: $N \\cdot t_d + t_q + t_{\\text{sys}}$. Cresce sem limite com o tamanho da base.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "T tudo contexto inteiro long context tokens de entrada"},
  {"t": "$V$", "d": "A projeção de valor: o conteúdo que o token entrega a quem prestar atenção nele. A saída de cada posição é a média dos $V$ ponderada pelos pesos de atenção.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "V value valor projecao de valor"},
  {"t": "$v_w$ e $v'_w$", "d": "Os dois vetores que cada palavra tem durante o treino: $v_w$ quando ela é entrada e $v'_w$ quando é saída. O score de um par é o produto escalar ${v'}^\\top v$.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "v v linha vetor de entrada vetor de saida input output vector"},
  {"t": "$w$", "d": "A camada linear final do cross-encoder, um vetor de pesos aprendido. Multiplica $h_{[\\text{CLS}]}$ e devolve um único escalar de relevância.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "w camada linear final vetor de pesos classification head"},
  {"t": "$W$ e $W'$", "d": "As duas matrizes de pesos da rede rasa de duas camadas: a de entrada e a de saída. São elas os próprios embeddings finais — terminado o treino, guarda-se a tabela e joga-se fora o resto.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "W W linha matrizes de pesos weight matrices embedding matrix"},
  {"t": "$W^K$", "d": "Matriz de projeção da chave, $\\mathbb{R}^{d_{model} \\times d_k}$ por cabeça: $k_j = x_j W^K$. Compartilhada por todas as posições da sequência.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "WK W K projecao de chave key projection Wk"},
  {"t": "$W^O$", "d": "Matriz de saída da multi-head attention, $\\mathbb{R}^{H d_v \\times d_{model}}$: mistura as $H$ cabeças concatenadas e devolve a dimensão do modelo. Sem ela as cabeças ficariam em fatias estanques do vetor. Custa $d_{model}^2$ parâmetros.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "WO W O projecao de saida output projection Wo concat"},
  {"t": "$W^Q$", "d": "Matriz de projeção da consulta, $\\mathbb{R}^{d_{model} \\times d_k}$ por cabeça. É a mesma para toda posição e todo comprimento de frase: $q_i = x_i W^Q$.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "WQ W Q projecao de consulta query projection Wq"},
  {"t": "$W^V$", "d": "Matriz de projeção do valor, $\\mathbb{R}^{d_{model} \\times d_v}$ por cabeça: $v_j = x_j W^V$. Separada de $W^K$ para que indexar e entregar possam viver em subespaços diferentes.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "WV W V projecao de valor value projection Wv"},
  {"t": "$W_1$", "d": "A projeção de expansão da FFN, $d_{model} \\times d_{ff}$. Lida por linhas de saída, cada uma das $d_{ff}$ unidades internas calcula $\\mathrm{ReLU}(\\langle x, w_j \\rangle + b_j)$ — um detector que acende quando $x$ aponta na direção de $w_j$.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "W1 W 1 projecao de expansao first linear expansion"},
  {"t": "$W_2$", "d": "A projeção de volta da FFN, $d_{ff} \\times d_{model}$. Cada unidade interna acesa despeja a sua coluna de $W_2$ na saída, escalada pela intensidade; a volta a $d_{model}$ existe porque o resultado será somado ao residual.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "W2 W 2 projecao de volta second linear contraction"},
  {"t": "$W_g$", "d": "A projeção que produz o gate no SwiGLU: $\\mathrm{FFN}(x) = [\\mathrm{SiLU}(xW_g) \\odot (xV)]W_2$. É a terceira matriz que a variante com porta acrescenta à FFN clássica.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "Wg W g gate porta swiglu glu gated linear unit"},
  {"t": "$w_j$", "d": "Peso final do termo $j$ no vetor esparso: o máximo, sobre todos os tokens do texto, de $\\log(1 + \\mathrm{ReLU}(z_{ij}))$. Basta um token propor o termo com força para ele acender.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "wj peso do termo max pooling ativacao"},
  {"t": "$W_O$", "d": "A matriz de saída do multi-head: depois que as cabeças são concatenadas de volta aos 768, $W_O$ mistura o que cada uma achou em um único vetor por posição.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "WO matriz de saida output projection multi-head output"},
  {"t": "$W_Q, W_K, W_V$", "d": "As três matrizes de projeção linear que transformam o mesmo vetor de entrada em $Q$, $K$ e $V$. No BERT-base são $768 \\times 64$ por cabeça, e cada cabeça tem as suas.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "WQ WK WV matrizes de projecao query key value weight matrices"},
  {"t": "$w_r$", "d": "Peso por motor no RRF ponderado, $\\sum_r w_r/(k+\\text{rank}_r(d))$. Corrige o RRF puro quando um retriever é sabidamente melhor no domínio — ao custo de voltar a ter pesos para calibrar.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "w r peso por motor rrf ponderado weighted rrf"},
  {"t": "$w_t$", "d": "A palavra-alvo central, na posição $t$ da sequência. No CBOW é o que se quer prever; no Skip-Gram é a entrada.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "wt palavra alvo central target word"},
  {"t": "$w_v$", "d": "A $v$-ésima coluna de $W_{out}$ — o vetor da palavra $v$, com $d_{model}$ casas, do mesmo tamanho de $h$. O logit dela é $z_v = h \\cdot w_v + b_v$.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "w v coluna da palavra word vector coluna de Wout"},
  {"t": "$w_{\\mathrm{tf}}(t, D)$", "d": "O peso da frequência depois da variante escolhida: contagem crua $\\mathrm{tf}$, logarítmica $1 + \\ln \\mathrm{tf}$ ou binária (1 se aparece, senão 0).", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "w tf peso da frequencia sublinear log tf weighting"},
  {"t": "$w_{ij}$", "d": "O peso de atenção já normalizado, $w_{ij} = e^{s_{ij}} / \\sum_j e^{s_{ij}}$: quanto da saída do token $i$ vem do valor do token $j$. Cada linha soma 1.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "wij peso de atencao attention weight softmax normalizado"},
  {"t": "$W_{out} = E^{\\top}$", "d": "O weight tying: amarrar a matriz de saída à tabela de embeddings de entrada, uma como transposta da outra. Poupa $d_{model}|V|$ pesos e dá sinal de treino a cada palavra pelos dois caminhos. É escolha de projeto, não exigência da arquitetura.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "weight tying pesos amarrados tied embeddings E transposto"},
  {"t": "$W_{out}$", "d": "A matriz da camada de saída, de forma $(d_{model}, |V|)$: uma coluna por item do vocabulário. É uma tabela de embeddings de saída, e a projeção é uma busca por semelhança contra cada palavra.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "W out matriz de saida output matrix lm head cabeca de saida"},
  {"t": "$w_{t \\pm j}$", "d": "As palavras de contexto ao redor do alvo, dentro do raio $c$ e com $j \\neq 0$.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "w t mais menos j palavras de contexto context words"},
  {"t": "$X$", "d": "A matriz de entrada da atenção, $X \\in \\mathbb{R}^{n \\times d}$: uma linha por token, $d$ casas por linha.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "X matriz de entrada input matrix sequencia"},
  {"t": "$x_\\ell$", "d": "O estado do fluxo residual na entrada da camada $\\ell$. Com residual, $x_{\\ell+1} = x_\\ell + F_\\ell(x_\\ell)$; é o vetor que atravessa a pilha e que cada bloco corrige.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "x l estado residual residual stream camada layer"},
  {"t": "$X_{1:t}$", "d": "O prefixo da sequência até a posição $t$. A identidade que sustenta o treino paralelo é $[\\mathrm{MaskedAttn}(X_{1:n})]_t = [\\mathrm{Attn}(X_{1:t})]_t$: a linha $t$ da passada mascarada é idêntica a rodar o modelo só sobre o prefixo.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "X 1 t prefixo prefix sequencia parcial"},
  {"t": "$y_{\\lt t}$", "d": "O prefixo já produzido antes da posição $t$. Toda a arquitetura do decoder existe para honrar essa condicional: a posição $t$ não pode ver $y_t$ nem nada à frente.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "y menor que t prefixo prefix contexto anterior"},
  {"t": "$z$", "d": "O score padronizado, $z = (s - \\mu)/\\sigma$. Depende da distribuição de scores de cada consulta, então consultas com poucos candidatos relevantes distorcem a fusão.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "z z-score padronizacao media desvio"},
  {"t": "$z\\,\\Phi(z)$", "d": "A GELU, com $\\Phi$ a acumulada da normal (Hendrycks e Gimpel, 2016). Suave em todo lugar, ligeiramente negativa perto de zero, com gradiente que não desaparece de vez. Virou padrão em BERT e GPT-2.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "GELU gaussian error linear unit phi acumulada da normal"},
  {"t": "$z\\,\\sigma(z)$", "d": "A SiLU (ou Swish), quase indistinguível da GELU no gráfico. É a peça usada dentro do SwiGLU.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "SiLU swish sigmoide ativacao z sigma z"},
  {"t": "$z_v$", "d": "O logit da palavra $v$: $z_v = h \\cdot w_v + b_v$, um produto escalar entre o estado contextual e o vetor daquela palavra. Vence quem aponta mais na direção de $h$.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "z v logit da palavra word logit produto escalar"},
  {"t": "$z_{ij}$", "d": "O logit que a cabeça MLM devolve para o token $i$ e a entrada $j$ do vocabulário: quão plausível é a palavra $j$ naquela posição.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "z logit mlm head cabeca mlm projecao"},
  {"t": "$|D|$", "d": "Comprimento do documento $D$: quantidade de termos (tokens) que ele contém. É comparado com o $avgdl$ para decidir se o documento é longo ou curto para a coleção.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "tamanho do documento document length numero de tokens"},
  {"t": "$|q|$", "d": "Número de tokens da consulta, o número de parcelas da soma MaxSim. É por ele que o score cresce com consultas mais longas e deixa de servir como limiar absoluto.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "modulo de q numero de tokens da consulta query length"},
  {"t": "$|V|$", "d": "Tamanho do vocabulário sobre o qual o vetor esparso é escrito — no SPLADE, as 30.522 entradas do vocabulário WordPiece do BERT.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "V tamanho do vocabulario vocabulary size wordpiece"},
  {"t": "Abstenção", "d": "O agente dizer que não encontrou aquilo na base em vez de preencher a lacuna. É resposta correta e não falha: preserva a informação de que a base não cobre o assunto.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "abstention nao sei recusa"},
  {"t": "Afirmação", "d": "A unidade de verificação do grounding: um fato isolado, verificável sozinho. \"8 horas de jejum, água liberada\" são duas afirmações, porque a base pode sustentar uma e não a outra.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "claim decomposicao claim decomposition afirmacoes"},
  {"t": "ALiBi", "d": "Alternativa que dispensa vetor posicional: soma aos scores de atenção, antes do softmax, um viés negativo proporcional à distância entre as posições. Quanto mais longe o token, mais penalizado.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "attention with linear biases vies relativo"},
  {"t": "Alucinação", "d": "Resposta plausível e fluente que não se sustenta em nenhuma evidência. Quase sempre é falha de recuperação chegando ao gerador: sem o trecho certo no contexto, o comportamento padrão do modelo é preencher a lacuna.", "p": "ir/agente/alucinacao/index.html", "n": "1.4.1", "alt": "hallucination invencao alucinacoes"},
  {"t": "Alucinação extrínseca", "d": "O erro vai além do contexto em vez de contradizê-lo: nada no material sustenta a afirmação e nada a nega. É a forma mais difícil de detectar, porque a parte falsa vem colada em uma parte verdadeira.", "p": "ir/agente/alucinacao/index.html", "n": "1.4.1", "alt": "extrinsic hallucination nao sustentada"},
  {"t": "Alucinação intrínseca", "d": "O erro contradiz o material que o agente recebeu: o contexto dizia 60 dias e a resposta diz 90. É detectável sem sair do prompt, bastando comparar afirmação e fonte.", "p": "ir/agente/alucinacao/index.html", "n": "1.4.1", "alt": "intrinsic hallucination contradiz contexto"},
  {"t": "Anisotropia", "d": "Em transformers crus, os vetores de saída ocupam um cone estreito do hiperespaço e duas frases sem vínculo nenhum registram cosseno enganosamente alto. O SBERT corrige com mean pooling, redes siamesas e treino contrastivo.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "anisotropy isotropia cone sbert"},
  {"t": "Aprendizado contrastivo", "d": "Treino com uma âncora, um positivo e vários negativos, em que o gradiente puxa o par certo e empurra os errados (perda InfoNCE, com temperatura $\\tau$ em torno de 0,05). É o padrão moderno para calibrar espaços de busca vetorial.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "contrastive learning infonce temperatura hard negative"},
  {"t": "Atenção mascarada", "d": "Self-attention com a máscara causal somada aos scores: cada posição só atende ao prefixo até ela. Sem isso, prever o próximo token viraria copiá-lo da própria entrada, com perda de treino perto de zero e geração incoerente.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "masked multi-head attention masked self-attention atencao causal"},
  {"t": "Atribuição por afirmação", "d": "Amarrar cada frase da resposta ao trecho específico que a sustenta, em vez de listar os documentos consultados num rodapé. Citação agregada mede consulta, citação por afirmação mede suporte.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "attribution claim-level attribution citacao por afirmacao AIS"},
  {"t": "Autocrítica", "d": "Antes de redigir, o agente responde uma pergunta sobre si mesmo: o que recuperei cobre tudo que a pergunta exige? A cobertura é medida sobre requisitos declarados, não sobre a impressão de que há bastante texto no contexto.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "self-critique self-reflection avaliacao de suficiencia"},
  {"t": "Autoregressivo", "d": "Regime em que a probabilidade da sequência é fatorada em condicionais sobre o prefixo, e cada token é amostrado sabendo apenas do que já foi produzido. A dependência é serial por construção: nenhuma GPU paraleliza a inferência.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "autoregressive autorregressivo regra da cadeia"},
  {"t": "avgdl", "d": "Comprimento médio dos documentos da coleção, a régua contra a qual o BM25 compara o tamanho de cada documento. Em corpora de RAG cortados em chunks quase uniformes, todo documento fica perto dela.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "average document length comprimento medio"},
  {"t": "BatchNorm", "d": "Normalização que estima média e variância por feature ao longo do batch. Não é usada em linguagem: a saída de uma frase passa a depender das outras do lote e as funções diferem entre treino e inferência.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "batch normalization normalizacao por lote"},
  {"t": "Bi-encoder", "d": "Arquitetura que codifica consulta e documento separadamente, um vetor para cada, e só compara no fim por cosseno. Os vetores dos documentos são pré-computados na indexação; na consulta só o texto da pergunta vira vetor.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "bi-encoder biencoder dual encoder retriever"},
  {"t": "Bloco Transformer", "d": "A unidade que se repete N vezes com pesos próprios em cada cópia: dois sublayers no encoder (multi-head attention e FFN positionwise) e três no decoder, com a cross-attention no meio. Entender um bloco é entender a arquitetura inteira.", "p": "redes-neurais/transformers/bloco/index.html", "n": "2.1.2", "alt": "transformer block camada layer blocos"},
  {"t": "BM25", "d": "Ranking léxico probabilístico (Robertson e Walker, 1994) que mantém a intuição do TF-IDF e acrescenta dois freios: $k_1$ satura a frequência do termo e $b$ normaliza pelo comprimento do documento. É o padrão de mercado da busca por palavras.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "okapi bm25 lucene elasticsearch"},
  {"t": "Busca híbrida", "d": "Rodar dois ou mais motores de primeiro estágio em paralelo, por exemplo BM25 e um bi-encoder, e fundir os rankings num só. É a configuração padrão de RAG em produção, não uma otimização exótica.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "hybrid search busca hibrida lexico denso"},
  {"t": "Busca por vizinhos aproximados", "d": "Em vez de comparar a consulta com todos os vetores do índice, custo $\\mathcal{O}(Nd)$, percorre uma estrutura que encontra vizinhos próximos muito mais rápido, abrindo mão de recall garantido. É o que torna viável buscar em milhões de trechos.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "ANN approximate nearest neighbor kNN vizinhos mais proximos"},
  {"t": "Cabeça de atenção", "d": "Uma das H atenções paralelas do sublayer, com suas próprias projeções de consulta, chave e valor. Em modelos treinados algumas têm comportamento legível, mas muitas são redundantes, e podar parte delas costuma custar pouco.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "attention head cabecas de atencao"},
  {"t": "Camada de Saída (FC)", "d": "A projeção linear final $z = h\\,W_{out} + b$, de $d_{model}$ para o tamanho do vocabulário, aplicada posição a posição e sem nenhuma não-linearidade. Cada coluna de $W_{out}$ é o vetor de uma palavra, e cada logit é um produto escalar contra o estado contextual.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "linear softmax cabeca de saida output layer lm head fully connected"},
  {"t": "CBOW", "d": "Arquitetura do Word2Vec que prevê a palavra central a partir da média das palavras de contexto. Treina muito mais rápido que o Skip-Gram, mas a média dilui termos raros.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "continuous bag of words cbow"},
  {"t": "Chunk", "d": "Trecho em que o documento é fatiado antes de virar vetor, tipicamente de 200 a 500 tokens em RAG. O chunk inteiro colapsa em um único ponto, então trechos longos demais diluem o sinal e perdem os assuntos secundários.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "chunking trecho fatiamento passage chunks"},
  {"t": "Cobertura do contexto", "d": "Razão entre os fatos exigidos pela pergunta que o contexto fornece e os fatos exigidos no total. Ela não distingue apoio de contradição: um trecho com o valor errado também cobre o fato.", "p": "ir/agente/alucinacao/index.html", "n": "1.4.1", "alt": "coverage cobertura de fatos"},
  {"t": "Conexão residual", "d": "A soma $x + \\mathrm{Sublayer}(x)$: o sublayer escreve uma correção sobre a entrada em vez de substituí-la. Na derivada isso vira $I + \\partial F/\\partial x$, um caminho identidade pelo qual o gradiente atravessa a pilha sem ser multiplicado por nada.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "residual connection skip connection atalho resnet add"},
  {"t": "Conjunto de avaliação", "d": "O conjunto de itens sobre o qual as métricas rodam, com quatro campos: pergunta real tirada do log, resposta de referência, trechos anotados como relevantes e casos cuja resposta correta é a abstenção. Sem o terceiro campo não há separação de culpa; sem o quarto, quem inventa pontua igual a quem admite o vazio.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "eval set golden set gabarito conjunto de teste anotacao"},
  {"t": "Constante k do RRF", "d": "Valor somado ao rank antes da divisão; controla o quão íngreme é a curva de valor por posição. Com $k$ perto de 0 a fusão vira votação por primeiro lugar, com $k$ muito grande vira média de posições, e o padrão universal é $k = 60$.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "rank_constant rank constant k=60 suavizacao"},
  {"t": "Contexto contraditório", "d": "Duas fontes indexadas que casam com a mesma query e dizem coisas diferentes, como a circular de 2019 com 12 horas de jejum e o manual de 2026 com 8. Sem metadado de vigência e regra de precedência, quem decide é a posição no prompt.", "p": "ir/agente/alucinacao/index.html", "n": "1.4.1", "alt": "precedencia vigencia conflito de fontes"},
  {"t": "Critério de parada", "d": "A regra que encerra o laço do agente: limiar de relevância, limite de voltas e teto de custo. Limiar alto e poucas voltas produzem um agente que só diz não sei; limiar baixo e muitas voltas produzem respostas com contexto fraco e conta cara.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "stopping criterion limite de voltas budget desistencia"},
  {"t": "Cross-attention", "d": "O sublayer do meio do bloco do decoder: Q vem do decoder, K e V vêm da saída do encoder. É a única ponte entre as duas pilhas, e a matriz de pesos é retangular, $n_{dec} \\times n_{enc}$.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "atencao cruzada encoder-decoder attention cross attention"},
  {"t": "Cross-Encoder", "d": "Re-ranker que lê consulta e documento na mesma sequência, [CLS] q [SEP] d [SEP], deixando cada token de um lado atender aos do outro, e devolve um único escalar de relevância (Nogueira e Cho, 2019). Nada fica pré-computado: cada par custa uma passagem inteira pelo Transformer.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "cross-encoder crossencoder cross encoder reranker"},
  {"t": "Cutoff de treino", "d": "A data em que o treino terminou e o conhecimento dos pesos congelou. Uma norma revista depois disso não existe para o modelo, e a versão revogada continua existindo, com o erro saindo silencioso.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "knowledge cutoff data de corte training cutoff"},
  {"t": "d_ff", "d": "Largura interna da FFN, entre as duas camadas densas. A convenção $d_{ff} \\approx 4\\,d_{model}$ pegou por replicação, não por teorema, e cai para cerca de dois terços disso em variantes com porta.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "hidden size ffn dimension d ff expansao"},
  {"t": "d_k", "d": "Dimensão de cada cabeça de atenção, em geral $d_{model}/H$. É ela que aparece na divisão dos scores por $\\sqrt{d_k}$; dobrar o número de cabeças corta $d_k$ pela metade sem mudar a contagem de parâmetros.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "head dimension dk dv"},
  {"t": "d_model", "d": "Largura do modelo: número de casas do vetor de cada token. É constante em toda a pilha, porque a soma residual exige que entrada e saída de cada sublayer tenham exatamente a mesma forma.", "p": "redes-neurais/transformers/bloco/index.html", "n": "2.1.2", "alt": "dimensao do modelo d model width largura"},
  {"t": "Decoder", "d": "A pilha do lado da saída, com três sublayers por bloco: atenção mascarada, cross-attention e FFN. Gera a sequência um token por vez, realimentando a própria saída até o token de fim ou o limite de comprimento.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "decodificador decoder stack geracao"},
  {"t": "Decoder-only", "d": "Arquitetura de uma pilha só, sem cross-attention: prompt e resposta são a mesma sequência e a atenção mascarada resolve tudo. Venceu pela simplicidade do objetivo de pré-treino sobre texto cru, ao preço de codificar o prompt causalmente.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "somente decoder decoder only GPT"},
  {"t": "Decomposição da pergunta", "d": "Quebrar uma pergunta em várias buscas independentes, cada uma com seu top-k. \"Comparar o preparo da ultrassonografia e do hemograma\" vira duas sub-perguntas que não dependem uma da outra.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "query decomposition sub-perguntas subqueries"},
  {"t": "Divisão por raiz de d_k", "d": "Correção de escala dos scores antes do softmax: como a variância do produto escalar vale $d_k$, dividir pelo desvio $\\sqrt{d_k}$ impede que o softmax sature num arg max e que o gradiente morra na inicialização. É correção de inicialização, não hiperparâmetro.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "scaling factor escala sqrt dk saturacao do softmax"},
  {"t": "Efeito gargalo", "d": "A camada oculta estreita, 300 dimensões para um vocabulário de 50 000, não permite decorar item por item, então a rede é obrigada a sintetizar direções latentes compartilhadas. Os pesos dessa camada são os embeddings.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "bottleneck gargalo compressao camada oculta"},
  {"t": "Embedding", "d": "Transformar uma entidade discreta, como palavra, trecho de texto, imagem ou item de catálogo, em coordenadas contínuas de um espaço em que proximidade significa semelhança de significado. Cada dimensão é um tema latente aprendido, não uma palavra.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "embeddings vetor semantico representacao distribuida"},
  {"t": "Encoder", "d": "A pilha do lado da entrada: N blocos idênticos em forma, com máscara zero, que recebem n posições e devolvem n vetores contextuais. O comprimento da sequência nunca muda dentro da pilha, porque não há pooling nem resumo ali.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "codificador encoder stack bidirecional"},
  {"t": "Encoder-only", "d": "Arquitetura que fica só com a pilha do encoder e joga o decoder fora: devolve representações e não gera texto. É o caso do BERT, treinado com masked language modeling, e a base de bi-encoders e cross-encoders.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "somente encoder encoder only BERT"},
  {"t": "Entailment", "d": "Relação de \"o trecho $t$ sustenta a afirmação $c$\": lendo só $t$, uma pessoa razoável concluiria $c$. Um classificador de NLI devolve a probabilidade dessa relação por par, barato e local, mas sofre com trechos longos e raciocínio numérico.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "NLI natural language inference inferencia textual implicacao"},
  {"t": "Equivariância a permutação", "d": "Propriedade da atenção sem informação de posição: permutar as linhas da entrada permuta a saída e nada mais, $\\mathrm{Attn}(PX) = P\\,\\mathrm{Attn}(X)$. Por isso, sem positional encoding, a frase é apenas um saco de vetores.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "permutation equivariance invariancia a ordem"},
  {"t": "Expansão de query", "d": "Acrescentar termos irmãos à consulta em vez de substituir, como \"férias\" mais \"banco de horas\" mais \"abono\". Aumenta recall e degrada precisão, o que torna um cross-encoder para limpar o topo quase obrigatório depois.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "query expansion expansao de consulta"},
  {"t": "Expansão de termos", "d": "O modelo acende no vetor termos relacionados que não estão literalmente no texto, fechando o buraco do vocabulário descasado sem sair do mundo esparso. Cada termo aceso abre mais uma lista de postings, então expandir demais encarece a busca.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "term expansion expansao no splade termos latentes"},
  {"t": "Exposure bias", "d": "A discrepância entre treino e uso: o modelo só viu prefixos perfeitos no teacher forcing, mas na geração se alimenta dos próprios erros. É uma das razões de um erro no começo da geração contaminar tudo o que vem depois.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "vies de exposicao exposure bias"},
  {"t": "Fidelidade", "d": "Fração das afirmações da resposta que algum trecho recuperado sustenta. Mede lealdade à fonte, não verdade no mundo: uma base errada produz fidelidade 100% com conteúdo errado.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "faithfulness fidelidade a fonte"},
  {"t": "Fine-tuning", "d": "Treinar o modelo para ajustar forma: formato de saída, tom e vocabulário de um domínio fechado. É ruim para guardar fatos que mudam, porque cada mudança exige repetir o ciclo inteiro; a divisão prática é forma nos pesos, fato no índice.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "ajuste fino finetuning treino"},
  {"t": "FlashAttention", "d": "Núcleo de atenção que processa a conta em blocos que cabem na SRAM e nunca materializa a matriz completa de pesos. O resultado numérico é o mesmo; o que muda é não precisar guardar $n^2$ números por cabeça e por camada.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "flash attention kernel atencao eficiente memoria"},
  {"t": "Fusão de rankings", "d": "Combinar as listas ordenadas de vários motores numa lista única. O RRF funde por posição; CombSUM, CombMNZ e a soma normalizada fundem por score e exigem escalas comparáveis; learning-to-rank funde com um modelo treinado em pares rotulados.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "rank fusion CombSUM CombMNZ learning-to-rank LTR"},
  {"t": "GELU", "d": "Ativação $z\\,\\Phi(z)$, com $\\Phi$ a acumulada da normal: suave em todo lugar, ligeiramente negativa perto de zero e com gradiente que não desaparece de vez. Virou padrão em BERT e GPT-2.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "gaussian error linear unit gelu silu swish"},
  {"t": "Governança por documento", "d": "Fazer da permissão um filtro da busca em vez de uma instrução no prompt: o documento restrito não é recuperado, então não há o que vazar. Exige filtrar dentro da busca e não depois do top-k, e consultar a fonte de acesso no momento da consulta.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "permissao access control ACL autorizacao por documento LGPD"},
  {"t": "Grounding", "d": "A exigência de que toda afirmação da resposta saia de um trecho recuperado e de que dê para apontar qual. Não deixa o modelo mais certo: deixa o erro localizável.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "grounded ancoragem evidencia"},
  {"t": "Hipótese distribucional", "d": "\"You shall know a word by the company it keeps\" (Firth, 1957): palavras que aparecem cercadas dos mesmos vizinhos compartilham significado, mesmo que nunca ocorram na mesma frase. É a premissa de todo embedding.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "distributional hypothesis firth semantica distribucional"},
  {"t": "HNSW", "d": "Grafo navegável em camadas usado pelos bancos vetoriais (pgvector, Qdrant, Milvus, OpenSearch). A busca salta pelo grafo em cerca de $\\mathcal{O}(d\\log N)$, e o parâmetro $ef$ troca latência por recall.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "hierarchical navigable small world indice vetorial ef"},
  {"t": "IDF", "d": "Frequência inversa de documentos: peso de raridade do termo na coleção inteira, tipicamente $\\ln(N/\\mathrm{df})$. Quanto em menos documentos o termo aparece, mais ele discrimina quando aparece.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "inverse document frequency raridade idf df"},
  {"t": "Information Retrieval", "d": "Dado um acervo de documentos e uma pergunta, encontrar rapidamente os mais relevantes sem varrer tudo a cada busca. Tem sempre três peças: indexação, ranking e recuperação dos top-K.", "p": "ir/index.html", "n": "1", "alt": "IR RI recuperacao de informacao busca"},
  {"t": "Interação tardia", "d": "Cada lado é codificado separadamente e a grade de comparação token a token é reconstruída depois, fora do modelo, com produtos escalares baratos. É o que permite pré-computar o documento sem perder o detalhe que o vetor único borra.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "late interaction interacao tardia"},
  {"t": "Janela de contexto", "d": "O limite de tokens que cabe num prompt, pago em dinheiro e em latência a cada pergunta. Mesmo com janelas de um milhão de tokens, colar a base inteira esbarra em custo, latência e atenção, e por isso a recuperação recorta o top-k.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "context window tokens contexto longo"},
  {"t": "Janela deslizante", "d": "Recorte de raio fixo $c$ que percorre a sequência de palavras e transforma texto puro em pares supervisionados de alvo e contexto. É o que torna o Word2Vec auto-supervisionado, sem rotulação manual.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "sliding window janela de contexto raio c"},
  {"t": "KV-cache", "d": "Guardar K e V de cada posição, em cada camada, para não recalculá-los a cada token gerado, já que a causalidade garante que nada do que vem depois os altera. Troca computação por memória: o cache ocupa cerca de $2Lnd$ números por sequência.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "cache de chaves e valores kv cache MQA GQA"},
  {"t": "LayerNorm", "d": "Normaliza cada vetor de token pelas próprias $d_{model}$ casas, média zero e variância um, e depois reescala e desloca com $\\gamma$ e $\\beta$ aprendidos. Como nunca olha para o lote, funciona com lote de tamanho 1, comprimentos variáveis e inferência token a token.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "LN layer normalization normalizacao por camada"},
  {"t": "Laço do agente", "d": "Tratar a recuperação como um laço em vez de uma etapa: o agente pode decidir que o que recuperou não basta e buscar de novo com outra query. A saída é a avaliação de suficiência, nunca o fim de uma lista de etapas.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "agent loop agentic RAG laco agentico"},
  {"t": "Limiar de fidelidade", "d": "O corte $\\tau$ a partir do qual uma afirmação sobrevive na resposta, ou o mínimo de fidelidade para o agente entregar algo. Subir o limiar aumenta a precisão da citação e derruba a cobertura, e o valor sai do custo assimétrico do erro no domínio.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "threshold tau limiar de abstencao"},
  {"t": "LLM-as-judge", "d": "Usar um segundo LLM para julgar se um trecho sustenta uma afirmação, respondendo sustentada, parcialmente ou não sustentada. Lida melhor com paráfrase e agregação que um modelo de NLI, mas custa uma chamada por afirmação e herda vieses como concordar com texto fluente.", "p": "ir/agente/grounding/index.html", "n": "1.4.2", "alt": "juiz automatico llm como juiz llm judge verificador"},
  {"t": "Logit", "d": "O número real que a camada de saída produz para cada item do vocabulário, antes do softmax. O nível dos logits não significa nada: somar uma constante a todos não muda a distribuição, só as diferenças importam.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "logits pontuacao score"},
  {"t": "Machine unlearning", "d": "Pesquisa sobre remover um dado já absorvido nos pesos de um modelo, sem garantia forte no caso geral. Com o fato num índice a saída é banal, apagar o documento e os vetores derivados; com o fato nos pesos, a saída prática continua sendo retreinar sem aquele dado.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "unlearning desaprender direito de eliminacao esquecimento"},
  {"t": "Masked Language Modeling", "d": "Tarefa de pré-treino em que cerca de 15% dos tokens são ocultados com [MASK] e o Transformer combina o contexto da esquerda e da direita para deduzir o que falta. A cabeça de projeção treinada nessa tarefa é a que o SPLADE reaproveita.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "MLM masked language model bert mascara"},
  {"t": "Matriz de alinhamento", "d": "A matriz de pesos da cross-attention lida como correspondência entre duas sequências: uma linha por token gerado, uma coluna por token de origem. O alinhamento emerge porque ajuda a prever o próximo token, não porque alguém o supervisionou.", "p": "redes-neurais/transformers/encoder/cross-attention/index.html", "n": "2.1.3.1", "alt": "alignment matrix bahdanau alinhamento"},
  {"t": "MaxSim", "d": "Score do ColBERT: cada token da consulta é comparado a todos os tokens do documento e fica só com o seu melhor cosseno, e o score é a soma desses máximos. O máximo evita punir documentos longos, mas faz o valor crescer com o tamanho da consulta.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "maxsim max sim maximo por linha"},
  {"t": "Motor de primeiro estágio", "d": "Os recuperadores baratos que geram candidatos em milissegundos, como BM25, SPLADE, bi-encoder e multi-vector, antes de qualquer modelo caro entrar. A regra prática do pipeline é top-50 por lista, fusão por RRF e cross-encoder só nos top-20.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "first-stage retrieval candidate generation geracao de candidatos"},
  {"t": "MRR", "d": "Média do inverso da posição do primeiro trecho relevante em cada consulta. Só olha o primeiro acerto, o que serve quando uma única passagem basta para responder, e vale zero se nenhum relevante entrou no corte.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "Mean Reciprocal Rank MRR@k posto reciproco medio"},
  {"t": "Multi-head Attention", "d": "Várias atenções em paralelo, cada uma projetando a entrada num subespaço próprio de dimensão $d_k = d_{model}/H$; as saídas são concatenadas e misturadas por $W^O$. Custa o mesmo que uma cabeça grande e rende H distribuições de atenção em vez de uma.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "MHA atencao multi-cabeca multi head"},
  {"t": "Multi-hop", "d": "Pergunta cuja resposta precisa ser montada a partir de dois documentos que não se citam, e em que a segunda query só pode ser formulada depois de ler o primeiro. Aumentar $k$ não resolve, porque é dependência de dados e o salto precisa ser sequencial.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "multi hop multihop salto encadeado"},
  {"t": "Multi-Vector (ColBERT)", "d": "Guarda um vetor por token do documento no índice, projetado para 128 dimensões e normalizado, e adia a comparação para a hora da consulta (Khattab e Zaharia, 2020). É o meio-termo entre o bi-encoder e o cross-encoder: índice reaproveitável com comparação fina.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "colbert multi-vector multivector late interaction"},
  {"t": "Máscara causal", "d": "Matriz triangular somada aos scores antes do softmax, com zeros no passado e menos infinito no futuro. Impede que a posição t enxergue o que vem depois dela e é o que torna legítimo treinar todas as posições em uma única passada.", "p": "redes-neurais/transformers/decoder/masked-attention/index.html", "n": "2.1.4.1", "alt": "causal mask mascara triangular look-ahead mask"},
  {"t": "Máscara de padding", "d": "Máscara que apaga da atenção as posições de preenchimento acrescentadas para o lote virar um tensor retangular, somando um valor muito negativo aos scores antes do softmax. Esquecê-la é bug silencioso: o mesmo texto vira vetores diferentes conforme o lote.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "padding mask PAD preenchimento"},
  {"t": "nDCG@k", "d": "Métrica de ranking que desconta cada acerto conforme ele desce na lista, com $\\text{DCG@}k = \\sum_i rel_i/\\log_2(i+1)$, normalizada pelo ranking ideal para ficar entre 0 e 1 (Järvelin e Kekäläinen, 2002). Com relevância binária perde granularidade: trecho essencial e tangencial valem igual.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "nDCG DCG IDCG ganho cumulativo descontado"},
  {"t": "Negative sampling", "d": "Substitui a softmax sobre o vocabulário inteiro por uma regressão logística binária: compara o par real contra apenas $k$ palavras de ruído sorteadas, tipicamente 5 a 20. O sorteio usa $P_n(w)\\propto f(w)^{3/4}$, que favorece palavras raras sem descartar as frequentes.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "SGNS amostragem negativa ruido noise"},
  {"t": "Normalização min-max", "d": "Levar cada lista de scores ao intervalo $[0,1]$ com $\\tilde{s} = (s - s_{\\min})/(s_{\\max} - s_{\\min})$ antes de somar. Funciona no papel, mas depende do melhor e do pior score daquela consulta: o menos ruim de cinco documentos ruins vira 1,0.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "min-max normalization relativeScoreFusion z-score normalizacao"},
  {"t": "Normalização por comprimento de documento", "d": "Comparar o tamanho do documento com o comprimento médio da coleção e inflar o denominador de quem está acima da média, porque texto longo contém qualquer termo com mais facilidade. O parâmetro $b$ dosa a penalidade: 0 desliga, 1 pune na proporção exata, 0,75 é o padrão.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "b length normalization norma avgdl"},
  {"t": "One-hot encoding", "d": "Representa cada termo por um vetor do tamanho do vocabulário com um único 1 e todo o resto zero. Dois termos quaisquer ficam ortogonais, então \"cachorro\" é tão distante de \"cão\" quanto de \"submarino\".", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "one hot vetor ortogonal codificacao"},
  {"t": "OOV", "d": "Palavra fora do vocabulário visto no treino. Busca léxica lida bem porque só casa strings; embeddings degradam, e o FastText ataca o problema quebrando a palavra em n-gramas de caracteres.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "out of vocabulary fora do vocabulario fasttext"},
  {"t": "Perdido no meio", "d": "Efeito descrito por Liu et al. (2023): modelos recuperam bem uma informação colocada no início ou no fim do contexto e pior quando ela está no meio, com a curva em U se acentuando conforme o contexto cresce. O tamanho do efeito varia por modelo; a direção se mantém.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "lost in the middle Liu 2023 curva em U"},
  {"t": "PLAID", "d": "Compressão que aproxima cada vetor de token por um centroide de um codebook aprendido mais um resíduo quantizado em 1 ou 2 bits por dimensão. Os centroides ainda servem de filtro, podando candidatos antes do MaxSim completo.", "p": "ir/densos/multi-vector/index.html", "n": "1.2.6", "alt": "PLAID colbertv2 quantizacao residuos centroide"},
  {"t": "Polissemia", "d": "Uma mesma palavra com sentidos diferentes conforme o contexto, como \"banco\" de sangue, financeiro ou de praça. Modelos estáticos dão um vetor só para todas as acepções; modelos contextuais dão um vetor por ocorrência.", "p": "ir/densos/fundamentos/index.html", "n": "1.2.3", "alt": "polysemy ambiguidade sentido contextual"},
  {"t": "Positional Encoding", "d": "Vetor de posição somado ao embedding do token, construído com senos e cossenos de frequências em progressão geométrica. Sem ele a atenção não distingue \"jejum de 8 horas\" de \"8 horas de jejum\".", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "PE codificacao posicional embedding posicional positional embedding senoidal"},
  {"t": "Positionwise FFN", "d": "Rede feed-forward de duas camadas densas aplicada a cada posição isoladamente, com expansão para $d_{ff}$ no meio e volta a $d_{model}$. Não mistura posições e concentra cerca de dois terços dos parâmetros do bloco.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "FFN feed-forward position-wise MLP rede feed forward"},
  {"t": "precision@k", "d": "Que fração dos $k$ trechos entregues era mesmo relevante. Não manda no acerto como o recall, mas manda no custo por token e na chance de o modelo costurar duas fontes numa afirmação falsa.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "precision at k precisao"},
  {"t": "Precisão de contexto", "d": "Fração dos trechos entregues ao gerador que era mesmo útil. Pega o contexto inflado, que custa token e aumenta a chance de confusão à toa; a versão do RAGAS ainda pondera pela posição.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "context precision precisao do contexto"},
  {"t": "Produto escalar", "d": "Soma dos produtos coordenada a coordenada de dois vetores. Quando ambos estão normalizados para norma 1, ele é exatamente a similaridade de cosseno, e por isso bancos vetoriais guardam vetores normalizados.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "dot product produto interno inner product"},
  {"t": "Pré-norma", "d": "A ordem padrão nos modelos atuais: $x_{l+1} = x_l + F(\\mathrm{LN}(x_l))$. O caminho residual nunca é normalizado, o que torna o treino de pilhas profundas menos sensível a hiperparâmetros, ao custo de exigir uma LayerNorm final.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "pre-norm pre-ln pre norma"},
  {"t": "Pós-norma", "d": "A ordem do paper de 2017: $x_{l+1} = \\mathrm{LN}(x_l + F(x_l))$. A normalização toca o resultado da soma, então não existe caminho da entrada à saída sem passar por uma LayerNorm, e o treino depende de warmup bem ajustado.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "post-norm post-ln pos norma"},
  {"t": "Q, K e V", "d": "Consulta, chave e valor: três projeções lineares do mesmo vetor de entrada. A consulta diz o que o token procura, a chave anuncia como ele se deixa encontrar e o valor é o conteúdo entregue a quem o escolher.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "query key value Q K V consulta chave valor WQ WK WV"},
  {"t": "RAG", "d": "Retrieval-Augmented Generation: dar ao LLM acesso a uma base de conhecimento externa antes de ele responder. Primeiro a recuperação escolhe os trechos, depois o modelo gera a resposta usando só o que ela entregou.", "p": "ir/index.html", "n": "1", "alt": "retrieval augmented generation geracao aumentada por recuperacao"},
  {"t": "RAGAS", "d": "Arcabouço que popularizou as quatro métricas de geração: fidelidade, precisão de contexto, recall de contexto e relevância da resposta (Es et al., 2023). A ideia de decompor a resposta em afirmações e checar cada uma contra a fonte é anterior e independente da ferramenta.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "RAGAS Es 2023 metricas de geracao"},
  {"t": "Re-ranking", "d": "Segundo estágio do funil: um modelo caro e preciso reordena a lista curta de candidatos que o primeiro estágio já recuperou. Ele só reordena, então documento que não veio entre os candidatos está perdido.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "reranking re-ranker reordenacao segundo estagio"},
  {"t": "Recall de contexto", "d": "Fração da resposta de referência que o contexto entregue conseguia sustentar. Pega a lacuna e separa as duas contas: quando ele cai, a culpa é da recuperação, não do gerador.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "context recall recall do contexto"},
  {"t": "recall@k", "d": "Dos trechos anotados como relevantes, a fração que entrou nos $k$ primeiros resultados: $|R \\cap T_k|/|R|$. É a métrica que mais importa num RAG, porque o que não é recuperado não pode ser gerado.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "recall at k revocacao cobertura de recuperacao"},
  {"t": "Reciprocal Rank Fusion", "d": "Método de fusão que ignora os scores e usa só a posição: cada documento recebe $\\sum_r 1/(k+\\text{rank}_r(d))$, somando uma parcela por lista em que aparece. Proposto por Cormack, Clarke e Büttcher (SIGIR 2009), dispensa treino e é invariante à escala de cada motor.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "RRF rank fusion fusao reciproca Cormack"},
  {"t": "Reescrita de query", "d": "Trocar o vocabulário do usuário pelo do corpus antes de buscar, como \"açúcar no sangue\" virar \"glicemia\". Reescrita agressiva pode jogar fora a sigla ou o código que identificava o documento, então vale rodar original e reescrita e fundir com RRF.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "query rewriting reformulacao rewrite"},
  {"t": "Regularização FLOPS", "d": "Penalidade que coloca o custo do produto escalar esparso dentro da própria função de perda, elevando ao quadrado a ativação média de cada termo no lote. Termos que acendem em quase todo documento custam desproporcionalmente mais, o que mantém as listas de postings curtas.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "FLOPS loss regularizacao esparsidade lambda"},
  {"t": "Relevância da resposta", "d": "Quanto do que foi dito responde de fato a pergunta feita. Pega a evasiva fiel, o resumo correto do documento que não responde nada: alta fidelidade não implica utilidade.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "answer relevance relevancia da resposta RAGAS"},
  {"t": "ReLU", "d": "$\\max(0,z)$, a não-linearidade da FFN no paper de 2017. Barata e esparsa, toda pré-ativação negativa vira zero exato; o preço é a derivada nula à esquerda, e unidade que morre não volta.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "rectified linear unit relu"},
  {"t": "Residual stream", "d": "O vetor que atravessa a pilha de blocos e ao qual cada sublayer soma o seu incremento. É um canal por onde cada bloco lê, escreve uma correção e devolve.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "canal residual fluxo residual residual stream"},
  {"t": "Resolução de referência", "d": "Reescrever a pergunta usando o histórico da conversa até ela ficar autossuficiente, porque \"e no caso dele?\" não é buscável. O índice não conhece o turno anterior.", "p": "ir/agente/laco/index.html", "n": "1.4.3", "alt": "coreference resolution correferencia pronomes historico"},
  {"t": "RMSNorm", "d": "LayerNorm sem a centragem: divide o vetor pela raiz da média dos quadrados e aplica só o ganho $\\gamma$. Metade dos parâmetros e uma passada de redução a menos, com diferença de qualidade pequena na literatura.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "root mean square normalization rms norm"},
  {"t": "RoPE", "d": "Esquema rotacional de posição: em vez de somar um vetor na entrada, gira os pares de coordenadas de Q e K por um ângulo proporcional à posição, dentro de cada camada. O produto entre consulta e chave passa a depender da diferença de posições.", "p": "redes-neurais/transformers/positional-encoding/index.html", "n": "2.1.1", "alt": "rotary position embedding rotatorio rotativo"},
  {"t": "RRF ponderado", "d": "Variante do RRF que dá peso diferente a cada lista, $\\sum_r w_r/(k+\\text{rank}_r(d))$, quando um motor é sabidamente melhor no domínio. Resolve o igualitarismo do RRF puro ao custo de trazer de volta pesos para calibrar.", "p": "ir/rrf/index.html", "n": "1.3", "alt": "weighted RRF pesos por lista"},
  {"t": "Saco de palavras", "d": "Representação que registra quais termos aparecem e com que peso, mas não a ordem: \"exame sem jejum\" e \"jejum sem exame\" produzem vetores idênticos. Por isso negação e contexto ficam invisíveis para modelos léxicos.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "bag of words bow ordem negacao"},
  {"t": "Saturação de frequência", "d": "Troca do TF cru por uma curva que cresce rápido e depois encosta num teto de $k_1+1$: a primeira ocorrência do termo vale muito, a décima quase nada. Controlada pelo parâmetro $k_1$, típico entre 1,2 e 2,0.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "k1 saturation saturacao teto rendimentos decrescentes"},
  {"t": "Scaled dot-product attention", "d": "A fórmula da atenção: $\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})V$. Scores por produto escalar entre consultas e chaves, divididos pela escala, normalizados por softmax linha a linha e usados como pesos numa soma dos valores.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "atencao por produto escalar escalado scaled dot product attention"},
  {"t": "Self-attention", "d": "Atenção em que Q, K e V saem todos da mesma sequência: cada token consulta todos os outros e absorve uma soma ponderada do que eles entregam, $\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})\\,V$. É o único ponto do bloco em que posições trocam informação entre si, e custa $\\mathcal{O}(n^2)$ no comprimento do texto.", "p": "redes-neurais/transformers/bloco/multi-head-attention/index.html", "n": "2.1.2.1", "alt": "atencao attention auto-atencao self attention atencao propria"},
  {"t": "Separação de culpa", "d": "Responder primeiro a uma pergunta binária diante de uma resposta errada: o trecho certo chegou ao contexto? Se não chegou é recuperação e nenhuma instrução de sistema conserta; se chegou e o modelo passou por cima é geração, e o caminho é grounding e citação obrigatória.", "p": "ir/agente/avaliacao/index.html", "n": "1.4.4", "alt": "matriz de culpa blame attribution diagnostico recuperacao vs geracao"},
  {"t": "Similaridade de cosseno", "d": "Mede a relevância pelo ângulo entre dois vetores: $\\cos(\\theta)=\\frac{q\\cdot d}{\\lVert q\\rVert\\,\\lVert d\\rVert}$. Vale 1 para mesma direção e 0 para vetores ortogonais, e ignora a magnitude, que varia com o comprimento do texto.", "p": "ir/densos/embeddings/index.html", "n": "1.2.1", "alt": "cosine similarity cosseno angulo theta"},
  {"t": "Skip-Gram", "d": "Arquitetura do Word2Vec que faz o inverso do CBOW: a partir da palavra central, prevê cada palavra do contexto. Um alvo gera $2c$ tarefas de treino, o que rende embeddings de melhor qualidade semântica, principalmente para palavras raras.", "p": "ir/densos/word2vec/index.html", "n": "1.2.2", "alt": "skipgram skip gram sgns"},
  {"t": "Softmax", "d": "Transforma uma lista de scores em pesos positivos que somam 1: score alto vira peso perto de 1, score baixo perto de 0. Na atenção, é o que converte os scores de $QK^\\top$ numa distribuição sobre os tokens.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "softmax normalizacao exponencial pesos"},
  {"t": "Sparse Encoder (SPLADE)", "d": "Modelo que reaproveita a cabeça MLM de um Transformer para aprender o peso de cada termo do vocabulário, inclusive de termos ausentes do texto (Formal et al., 2021). O vetor continua esparso e com dimensões nomeadas, então roda no mesmo índice invertido do BM25.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "SPLADE sparse encoder neural sparse elser bge-m3"},
  {"t": "Stopword", "d": "Palavra muito frequente e pouco discriminativa, como \"de\", \"da\" e \"o\", normalmente removida antes da indexação por não separar documento nenhum. Nos simuladores do guia ela é mantida de propósito, para o efeito ficar visível.", "p": "ir/esparsos/bm25/index.html", "n": "1.1.2", "alt": "stopwords palavra vazia termo comum"},
  {"t": "Sublayer", "d": "Cada sub-camada dentro de um bloco, seja atenção, cross-attention ou FFN, sempre embrulhada no mesmo invólucro de conexão residual mais normalização. É o invólucro, não o conteúdo, que torna a pilha profunda treinável.", "p": "redes-neurais/transformers/bloco/index.html", "n": "2.1.2", "alt": "sub-camada sublayer sublayers"},
  {"t": "SwiGLU", "d": "Variante com porta da FFN: duas projeções da mesma entrada, uma passando por SiLU e controlando a outra por produto elemento a elemento. Usa três matrizes em vez de duas, e por isso $d_{ff}$ costuma cair a dois terços para manter a contagem de parâmetros.", "p": "redes-neurais/transformers/bloco/ffn/index.html", "n": "2.1.2.3", "alt": "gated linear unit GLU gate porta shazeer"},
  {"t": "Teacher forcing", "d": "Regime de treino em que o decoder recebe sempre o alvo correto deslocado de uma posição, nunca o que ele mesmo teria produzido. Com a máscara causal, uma única passada calcula todas as condicionais da sequência de uma vez.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "forcamento do professor shifted right deslocado a direita"},
  {"t": "Temperatura", "d": "Divisor aplicado aos logits antes do softmax na amostragem do próximo token. Valores baixos concentram a distribuição na palavra vencedora; valores altos a achatam.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "temperature tau amostragem sampling"},
  {"t": "TF", "d": "Frequência do termo: quantas vezes o termo aparece dentro de um documento. É um sinal local, que olha um documento por vez e ignora o resto da coleção.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "term frequency frequencia do termo tf"},
  {"t": "TF-IDF", "d": "Peso de um termo num documento obtido multiplicando frequência local (TF) por raridade na coleção (IDF); o score de um documento é a soma desses pesos sobre os termos da consulta. Formalizado por Karen Spärck Jones em 1972.", "p": "ir/esparsos/tf-idf/index.html", "n": "1.1.1", "alt": "tfidf tf-idf sparck jones"},
  {"t": "Token de fim de sequência", "d": "Símbolo especial do vocabulário que o modelo aprende a emitir quando a resposta está completa. Ele disputa o softmax como qualquer outro token e encerra o laço de geração, em oposição ao corte por limite de comprimento.", "p": "redes-neurais/transformers/decoder/index.html", "n": "2.1.4", "alt": "eos end of sequence fim de sequencia parada"},
  {"t": "top-$k$", "d": "Os $k$ melhores resultados que o motor de primeiro estágio devolve — os únicos que chegam ao re-ranker. A latência é linear em $k$, e o ganho de precisão satura bem antes do topo do slider.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "top-k topk k candidatos corte do primeiro estagio"},
  {"t": "Top-k", "d": "Os $k$ melhores resultados que o primeiro estágio devolve e que seguem para o estágio seguinte. Na prática, 20 a 100 candidatos por consulta chegam ao re-ranker.", "p": "ir/densos/cross-encoder/index.html", "n": "1.2.5", "alt": "top-k topk candidatos corte"},
  {"t": "Transformer", "d": "Arquitetura de Vaswani et al. (2017) que converte uma frase em um vetor contextual por token, empilhando blocos de atenção multi-head e feed-forward. Sem recorrência nem convolução: a única troca de informação entre posições é a atenção.", "p": "ir/densos/transformer/index.html", "n": "1.2.4", "alt": "transformer bert attention is all you need"},
  {"t": "Trilha de auditoria", "d": "O registro de query, versão do índice, identificadores dos trechos recuperados e quem perguntou. É o que permite reconstituir em que base o agente respondeu naquele dia, já que guardar só o par pergunta e resposta não sustenta a reconstituição.", "p": "ir/agente/ganhos/index.html", "n": "1.4.5", "alt": "audit trail auditoria conformidade rastro"},
  {"t": "Vetor denso", "d": "Representação de poucas centenas de dimensões, como 384, 768 ou 1024, todas preenchidas. Nenhuma dimensão isolada significa uma palavra: o significado está na direção do vetor como um todo.", "p": "ir/densos/index.html", "n": "1.2", "alt": "dense vector modelo denso busca semantica"},
  {"t": "Vetor esparso", "d": "Representação do tamanho do vocabulário em que cada dimensão é uma palavra e quase todas valem zero. Um documento de 200 palavras num vocabulário de 50 000 termos fica com mais de 99% de zeros.", "p": "ir/esparsos/index.html", "n": "1.1", "alt": "sparse vector esparsidade modelo esparso lexico"},
  {"t": "Vetores contextuais", "d": "A saída da última camada do encoder: um vetor por token. Ele deixou de ser o vetor da palavra e passou a ser o vetor desta palavra nesta frase.", "p": "redes-neurais/transformers/encoder/index.html", "n": "2.1.3", "alt": "contextual embeddings representacao contextual"},
  {"t": "Vocabulário", "d": "O conjunto de itens que a camada de saída pontua, um por coluna de $W_{out}$. Com tokenizadores de subwords um item pode ser uma palavra, um fragmento, um espaço ou um byte, o que mantém o tamanho na casa das dezenas de milhares.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "vocabulary subword subwords tamanho do vocabulario V"},
  {"t": "Vocabulário descasado", "d": "Situação em que consulta e documento falam do mesmo assunto com palavras diferentes, como \"açúcar no sangue\" contra \"glicemia\". Para o modelo léxico clássico são dimensões ortogonais, e o score dá zero por mais que se ajuste $k_1$ ou $b$.", "p": "ir/esparsos/sparse-encoder/index.html", "n": "1.1.3", "alt": "vocabulary mismatch abismo lexico sinonimo"},
  {"t": "Warmup", "d": "Aquecimento da taxa de aprendizado no começo do treino: entrar devagar para que a pós-norma não divirja nos primeiros passos. Com pré-norma ele deixa de ser obrigatório.", "p": "redes-neurais/transformers/bloco/add-norm/index.html", "n": "2.1.2.2", "alt": "aquecimento learning rate warmup schedule"},
  {"t": "Weight tying", "d": "Amarrar a matriz de saída à tabela de embeddings de entrada, usando uma como transposta da outra. Poupa $d_{model}|V|$ pesos e dá a cada palavra sinal de treino pelos dois caminhos, mas é escolha de projeto, não exigência da arquitetura.", "p": "redes-neurais/transformers/fc/index.html", "n": "2.1.5", "alt": "pesos amarrados tied embeddings weight sharing"},
  {"t": "Índice invertido", "d": "Estrutura que guarda, para cada termo, a lista de documentos que o contêm. A consulta visita só as listas dos termos buscados e cruza, em vez de varrer a coleção inteira.", "p": "ir/esparsos/index.html", "n": "1.1", "alt": "inverted index posting list postings"},
];

const Guia = {
  current: 0,
  mode: 'slides',
  sections: [],
  quizScore: 0,
  quizTotal: 0,
  answered: new Set(),
  _slideHooks: {},
  _readyFns: [],

  /* Registra função executada após o shell montar (init de simuladores da página). */
  ready(fn) { this._readyFns.push(fn); },

  /* Registra função executada toda vez que o módulo `index` fica visível
     (use para redesenhar canvas, que precisa de largura > 0). */
  onSlide(index, fn) { (this._slideHooks[index] ||= []).push(fn); },

  /* Páginas de metodologia têm .slide-section; páginas de índice não.
     O shell monta o que faz sentido para cada uma. */
  ehGuia: false,

  init() {
    this.sections = Array.from(document.querySelectorAll('.slide-section'));
    this.ehGuia = this.sections.length > 0;
    this.quizTotal = document.querySelectorAll('.quiz-card').length;
    this.sections.forEach((s, i) => { s.id = s.id || `slide-${i}`; });

    this._buildChrome();
    this._buildSidebar();
    this._buildModulos();
    this._buildCola();
    this._bindKeys();
    if (this.ehGuia) this.goTo(0);
    this.renderMath(document.body);
    this._readyFns.forEach(fn => fn());
  },

  renderMath(el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  },

  _buildChrome() {
    const b = document.body;
    const title = b.dataset.title || document.title;
    const badge = b.dataset.badge || 'Infográfico Interativo';
    const subtitle = b.dataset.subtitle || '';
    const icon = b.dataset.icon || 'fa-diagram-project';
    const up = b.dataset.up || '../index.html';

    b.insertAdjacentHTML('afterbegin', `
      <div id="toast-container" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"></div>
      <header class="sticky top-0 z-40 bg-surface-900/90 backdrop-blur-md border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <button onclick="Guia.toggleSidebar()" title="Sumário do guia (tecla S)" class="w-9 h-9 rounded-lg bg-surface-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 flex items-center justify-center shrink-0 transition">
              <i class="fa-solid fa-bars"></i>
            </button>
            <a href="${up}" title="Voltar ao índice" class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 shrink-0 hover:scale-105 transition">
              <i class="fa-solid ${icon}"></i>
            </a>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="font-bold text-lg tracking-tight text-white whitespace-nowrap">${title}</h1>
                <span class="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 font-medium font-mono hidden sm:inline whitespace-nowrap">${badge}</span>
              </div>
              <p class="text-xs text-slate-400 hidden sm:block truncate">${subtitle}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            ${this.ehGuia ? `<button onclick="Guia.toggleModulos()" title="Módulos desta página (tecla D)" class="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-surface-800 text-xs text-slate-300 hover:text-white flex items-center gap-2 transition">
              <i class="fa-solid fa-list-ol text-cyan-400"></i>
              <span class="hidden sm:inline">Módulo <span id="modulo-atual-num" class="font-mono text-white">1</span>/${this.sections.length}</span>
            </button>` : ''}
            ${this.ehGuia ? `<button id="view-mode-btn" onclick="Guia.toggleMode()" class="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-surface-800 text-xs text-slate-300 hover:text-white flex items-center gap-2 transition" title="Alternar entre modo Apresentação e Infográfico contínuo">
              <i class="fa-solid fa-layer-group text-brand-400"></i>
              <span class="hidden sm:inline" id="view-mode-label">Modo Apresentação</span>
            </button>` : ''}
            <button id="cola-btn" onclick="Guia.toggleCola()" class="w-8 h-8 rounded-lg bg-surface-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition" title="Cola de termos (tecla G)">
              <i class="fa-solid fa-book"></i>
            </button>
            <button onclick="Guia.toggleHelp()" class="w-8 h-8 rounded-lg bg-surface-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs transition" title="Guia rápido (tecla A)">
              <i class="fa-solid fa-circle-question"></i>
            </button>
          </div>
        </div>
        <div class="w-full bg-slate-800 h-1">
          <div id="progress-bar" class="h-1 bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-300" style="width:${this.ehGuia ? 0 : 100}%"></div>
        </div>
      </header>`);

    if (this.ehGuia) document.querySelector('main').insertAdjacentHTML('beforeend', `
      <footer id="slide-footer" class="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-slate-800/80">
        <button id="prev-slide-btn" onclick="Guia.prev()" class="px-4 py-2 rounded-xl bg-surface-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-30 disabled:pointer-events-none">
          <i class="fa-solid fa-chevron-left"></i> <span class="hidden sm:inline">Módulo Anterior</span>
        </button>
        <div class="text-xs text-slate-500 font-mono text-center">
          Módulo <span id="current-slide-num" class="text-white font-bold">1</span> de ${this.sections.length}
        </div>
        <button id="next-slide-btn" onclick="Guia.next()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-brand-600/30"></button>
      </footer>`);

    b.insertAdjacentHTML('beforeend', `
      <div id="help-modal" class="fixed inset-0 z-[70] hidden items-center justify-center p-4">
        <div data-fundo class="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 opacity-0" onclick="Guia.toggleHelp()"></div>
        <div data-painel data-saida="opacity-0 scale-95" class="relative bg-surface-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 transition-all duration-200 ease-out opacity-0 scale-95">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-circle-question text-brand-400"></i> Como Navegar
            </h3>
            <button onclick="Guia.toggleHelp()" class="text-slate-400 hover:text-white text-sm"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>• <strong>Sumário do guia:</strong> o botão <i class="fa-solid fa-bars text-[10px]"></i> à esquerda abre o índice de todas as páginas.</p>
            <p>• <strong>Cola de termos:</strong> o botão <i class="fa-solid fa-book text-[10px]"></i> fixa um painel na lateral com o significado dos termos técnicos da página. Ele fica ligado enquanto você lê, não escurece nada, e continua ligado ao trocar de página.</p>
            ${this.ehGuia ? `
            <p>• <strong>Módulos desta página:</strong> o botão <i class="fa-solid fa-list-ol text-[10px]"></i> à direita abre a lista e pula direto para qualquer módulo.</p>
            <p>• <strong>Modos de exibição:</strong> o botão no topo alterna entre <em>Modo Apresentação</em> (um módulo por vez) e <em>Modo Infográfico</em> (rolagem contínua).</p>
            <p>• <strong>Simulações:</strong> os blocos interativos são ao vivo — mexa nos controles, os números recalculam na hora.</p>` : `
            <p>• <strong>Páginas de metodologia:</strong> cada uma é um infográfico interativo com módulos navegáveis e simuladores ao vivo.</p>`}
            <div class="pt-1">
              <p class="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Atalhos de teclado</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                ${this.ehGuia ? `
                <div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-6 text-center">Z</kbd> <span class="text-slate-400">Módulo anterior</span></div>
                <div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-6 text-center">C</kbd> <span class="text-slate-400">Próximo módulo</span></div>` : ''}
                <div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-6 text-center">S</kbd> <span class="text-slate-400">Sumário do guia</span></div>
                ${this.ehGuia ? `<div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-6 text-center">D</kbd> <span class="text-slate-400">Módulos da página</span></div>` : ''}
                <div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-6 text-center">G</kbd> <span class="text-slate-400">Cola de termos</span></div>
                <div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-6 text-center">A</kbd> <span class="text-slate-400">Esta ajuda</span></div>
                <div class="flex items-center gap-2"><kbd class="px-1.5 py-0.5 rounded bg-surface-950 border border-slate-700 font-mono text-[10px] w-10 text-center">Esc</kbd> <span class="text-slate-400">Fecha tudo</span></div>
              </div>
            </div>
          </div>
          <button onclick="Guia.toggleHelp()" class="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition">Entendido!</button>
        </div>
      </div>`);
  },

  /* Sumário lateral: navega entre todas as páginas do guia sem voltar ao índice.
     Sob a página atual, lista também os módulos dela. */
  _buildSidebar() {
    const aqui = decodeURI(location.pathname).replace(/\/$/, '/index.html');
    const atual = p => aqui.endsWith('/' + p);

    const item = (no, nivel) => {
      const eu = atual(no.path);
      const pad = ['', 'ml-3', 'ml-6'][nivel] || 'ml-6';
      const base = nivel === 0
        ? 'text-sm font-bold text-white'
        : nivel === 1 ? 'text-[13px] font-semibold text-slate-200' : 'text-xs text-slate-400';
      return `
        <li class="${pad}">
          <a href="${GUIA_RAIZ}${no.path}" class="group flex items-start gap-2 px-2 py-1.5 rounded-lg transition ${
            eu ? 'bg-brand-600/20 border border-brand-500/40' : 'hover:bg-surface-800 border border-transparent'}">
            <span class="font-mono text-[10px] mt-0.5 shrink-0 ${eu ? 'text-brand-300' : 'text-slate-500'}">${no.n}</span>
            <span class="${base} ${eu ? '!text-brand-200' : 'group-hover:text-white'} leading-snug">${no.nome}</span>
          </a>
          ${no.filhos ? `<ul class="mt-1 space-y-0.5">${no.filhos.map(f => item(f, nivel + 1)).join('')}</ul>` : ''}
        </li>`;
    };

    document.body.insertAdjacentHTML('beforeend', `
      <div id="guia-sidebar" class="fixed inset-0 z-[60] hidden">
        <div data-fundo class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0" onclick="Guia.toggleSidebar()"></div>
        <aside data-painel data-saida="-translate-x-full" class="absolute left-0 top-0 h-full w-[min(90vw,330px)] bg-surface-900 border-r border-slate-800 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out -translate-x-full">
          <div class="sticky top-0 bg-surface-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-2">
            <a href="${GUIA_RAIZ}index.html" class="flex items-center gap-2 min-w-0 group">
              <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white text-xs shrink-0">
                <i class="fa-solid fa-compass"></i>
              </span>
              <span class="font-bold text-sm text-white group-hover:text-brand-300 transition">Guia Técnico</span>
            </a>
            <button onclick="Guia.toggleSidebar()" class="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-surface-800 flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <nav class="p-3">
            <ul class="space-y-2">${GUIA_MAPA.map(c => item(c, 0)).join('')}</ul>
          </nav>
          <p class="px-4 pb-5 pt-2 text-[10px] text-slate-600 font-mono">Tecla <kbd class="px-1 py-0.5 rounded bg-surface-950 border border-slate-700">S</kbd> abre e fecha este sumário.</p>
        </aside>
      </div>`);
  },

  /* Abre e fecha um painel com transição. O painel guarda a classe de saída em
     data-saida (translate para as sidebars, opacidade+escala para o modal); o
     fundo esmaece junto. Ao fechar, o `hidden` só volta quando a transição acaba,
     senão o elemento some antes de animar. */
  _painel(id, abrir) {
    const el = document.getElementById(id);
    if (!el) return;
    const fundo = el.querySelector('[data-fundo]');
    const painel = el.querySelector('[data-painel]');
    const saida = painel.dataset.saida.split(' ');
    clearTimeout(this._painelTimers[id]);

    if (abrir) {
      el.classList.remove('hidden');
      el.classList.add('flex');
      // Entra no frame seguinte para que a transição tenha um estado inicial pintado.
      // O setTimeout é rede de segurança: em aba de fundo o rAF não dispara e o
      // painel ficaria fora da tela com o overlay já visível.
      const entrar = () => {
        fundo.classList.remove('opacity-0');
        painel.classList.remove(...saida);
      };
      requestAnimationFrame(entrar);
      this._painelTimers[id] = setTimeout(entrar, 50);
    } else {
      fundo.classList.add('opacity-0');
      painel.classList.add(...saida);
      this._painelTimers[id] = setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }, 320);
    }
  },

  _painelTimers: {},

  _aberto(id) {
    const el = document.getElementById(id);
    return !!el && !el.classList.contains('hidden');
  },

  toggleSidebar() {
    this._painel('guia-sidebar', !this._aberto('guia-sidebar'));
  },

  /* Sidebar da direita: os módulos desta página. Espelha a da esquerda,
     que cuida da navegação entre páginas. */
  _buildModulos() {
    if (!this.ehGuia) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="guia-modulos" class="fixed inset-0 z-[60] hidden">
        <div data-fundo class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0" onclick="Guia.toggleModulos()"></div>
        <aside data-painel data-saida="translate-x-full" class="absolute right-0 top-0 h-full w-[min(90vw,320px)] bg-surface-900 border-l border-slate-800 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out translate-x-full">
          <div class="sticky top-0 bg-surface-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs shrink-0">
                <i class="fa-solid fa-list-ol"></i>
              </span>
              <div class="min-w-0">
                <p class="font-bold text-sm text-white leading-tight">Módulos</p>
                <p class="text-[10px] text-slate-500 font-mono truncate">${document.body.dataset.title || ''}</p>
              </div>
            </div>
            <button onclick="Guia.toggleModulos()" class="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-surface-800 flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <nav class="p-3">
            <ul class="space-y-1">
              ${this.sections.map((sec, i) => `
                <li><button onclick="Guia.goTo(${i}); Guia.toggleModulos()"
                      class="md-item w-full text-left px-3 py-2.5 rounded-xl border transition flex items-start gap-2.5">
                  <span class="md-ico w-7 h-7 rounded-lg flex items-center justify-center text-[11px] shrink-0"><i class="fa-solid ${sec.dataset.icon || 'fa-circle'}"></i></span>
                  <span class="min-w-0">
                    <span class="md-num block font-mono text-[10px]">Módulo ${String(i + 1).padStart(2, '0')}</span>
                    <span class="md-nome block text-xs font-semibold leading-snug">${sec.dataset.nav || ''}</span>
                  </span>
                </button></li>`).join('')}
            </ul>
          </nav>
          <p class="px-4 pb-5 pt-1 text-[10px] text-slate-600 font-mono leading-relaxed">
            Tecla <kbd class="px-1 py-0.5 rounded bg-surface-950 border border-slate-700">D</kbd> abre e fecha os módulos.<br>
            <kbd class="px-1 py-0.5 rounded bg-surface-950 border border-slate-700">Z</kbd> <kbd class="px-1 py-0.5 rounded bg-surface-950 border border-slate-700">C</kbd> navegam sem abrir nada.
          </p>
        </aside>
      </div>`);
  },

  /* Cola de termos: painel fixo na lateral direita que fica LIGADO enquanto o
     leitor acompanha a página. Sem fundo escurecido e sem bloquear o conteúdo —
     em tela larga o corpo da página encolhe para caber ao lado dele.
     O estado liga/desliga sobrevive à navegação (localStorage). */
  _colaAberta: false,

  _buildCola() {
    document.body.insertAdjacentHTML('beforeend', `
      <aside id="guia-cola" aria-label="Cola de termos"
             class="fixed right-0 bottom-0 w-[86vw] sm:w-[320px] z-30 bg-surface-900 border-l border-slate-800 shadow-2xl flex flex-col translate-x-full transition-transform duration-300 ease-out">
        <div class="p-3 border-b border-slate-800 shrink-0">
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-book text-cyan-400"></i> Cola de termos
            </h3>
            <button onclick="Guia.toggleCola()" title="Fechar (tecla G)"
                    class="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-surface-800 flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]"></i>
            <input id="cola-busca" type="search" autocomplete="off" placeholder="Buscar em todo o guia…"
                   oninput="Guia.filtrarCola()"
                   class="w-full bg-surface-950 border border-slate-800 focus:border-brand-500/60 rounded-lg pl-7 pr-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition">
          </div>
        </div>
        <div id="cola-lista" class="overflow-y-auto p-3 space-y-2 flex-1"></div>
        <p class="px-3 py-2 border-t border-slate-800 text-[10px] font-mono text-slate-600 shrink-0">
          <kbd class="px-1 py-0.5 rounded bg-surface-950 border border-slate-700">G</kbd> liga e desliga a cola
        </p>
      </aside>`);

    this._colaAberta = localStorage.getItem('guia-cola') === '1';
    this.filtrarCola();
    if (this._colaAberta) {
      const el = document.getElementById('guia-cola');
      el.classList.add('!transition-none');
      this._aplicarCola();
      requestAnimationFrame(() => el.classList.remove('!transition-none'));
    }
    window.addEventListener('resize', () => this._aplicarCola());
  },

  _aplicarCola() {
    const el = document.getElementById('guia-cola');
    if (!el) return;
    el.classList.toggle('translate-x-full', !this._colaAberta);
    // Em tela larga o conteúdo desloca para não ficar embaixo do painel;
    // abaixo disso ele sobrepõe, mas sem fundo escuro: a página continua usável.
    const largo = window.innerWidth >= 1280;
    document.body.style.paddingRight = (this._colaAberta && largo) ? '320px' : '';
    // Em tela larga o conteúdo já saiu de baixo do painel, então ele sobe até o
    // topo e ocupa também a faixa ao lado do cabeçalho — senão sobra um vão morto
    // naquele canto. Em tela estreita o painel sobrepõe, e precisa deixar o
    // cabeçalho à mostra para o botão de fechar continuar alcançável.
    el.style.top = largo ? '0' : '65px';
    const botao = document.getElementById('cola-btn');
    if (botao) {
      botao.className = 'w-8 h-8 rounded-lg border flex items-center justify-center text-xs transition ' +
        (this._colaAberta
          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
          : 'bg-surface-800 border-slate-700 text-slate-300 hover:text-white');
    }
  },

  toggleCola() {
    this._colaAberta = !this._colaAberta;
    localStorage.setItem('guia-cola', this._colaAberta ? '1' : '0');
    this._aplicarCola();
    if (this._colaAberta) setTimeout(() => document.getElementById('cola-busca').focus(), 320);
  },

  _normalizar(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  filtrarCola() {
    const campo = document.getElementById('cola-busca');
    const q = this._normalizar((campo ? campo.value : '').trim());
    const aqui = decodeURI(location.pathname).replace(/\/$/, '/index.html');
    const daPagina = e => !!e.p && aqui.endsWith('/' + e.p);

    const cartao = (e, meu) => `
      <div class="rounded-lg border p-2.5 ${meu ? 'bg-brand-600/10 border-brand-500/30' : 'bg-surface-950 border-slate-800'}">
        <h4 class="text-xs font-bold ${meu ? 'text-brand-200' : 'text-slate-200'} mb-1">${e.t}</h4>
        <p class="text-[11px] text-slate-400 leading-relaxed">${e.d}</p>
        ${e.p && !meu ? `<a href="${GUIA_RAIZ}${e.p}" class="inline-flex items-center gap-1 mt-1.5 text-[10px] text-brand-400 hover:text-brand-300 transition">
          <i class="fa-solid fa-arrow-right text-[8px]"></i> ${e.n || 'ver a página'}</a>` : ''}
      </div>`;

    const lista = document.getElementById('cola-lista');
    const titulo = t => `<p class="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-1">${t}</p>`;

    if (q) {
      const achados = GLOSSARIO.filter(e =>
        this._normalizar(e.t + ' ' + e.d + ' ' + (e.alt || '')).includes(q));
      lista.innerHTML = achados.length
        ? titulo(`${achados.length} resultado${achados.length > 1 ? 's' : ''}`) +
          achados.map(e => cartao(e, daPagina(e))).join('')
        : '<p class="text-[11px] text-slate-500 text-center py-6">Nada encontrado.</p>';
    } else {
      const meus = GLOSSARIO.filter(daPagina);
      lista.innerHTML = meus.length
        ? titulo('Termos desta página') + meus.map(e => cartao(e, true)).join('')
        : `<p class="text-[11px] text-slate-500 leading-relaxed py-4">
             Esta página não tem termos próprios no glossário. Use a busca acima para procurar em todo o guia
             — são ${GLOSSARIO.length} termos.</p>`;
    }
    this.renderMath(lista);
  },

  toggleModulos() {
    if (!this.ehGuia) return;
    const abrir = !this._aberto('guia-modulos');
    if (abrir) this._marcarModuloAtual();
    this._painel('guia-modulos', abrir);
  },

  _marcarModuloAtual() {
    const num = document.getElementById('modulo-atual-num');
    if (num) num.textContent = this.current + 1;
    document.querySelectorAll('#guia-modulos .md-item').forEach((b, i) => {
      const ativo = i === this.current;
      b.className = 'md-item w-full text-left px-3 py-2.5 rounded-xl border transition flex items-start gap-2.5 '
        + (ativo ? 'bg-brand-600/20 border-brand-500/40' : 'border-transparent hover:bg-surface-800 hover:border-slate-800');
      b.querySelector('.md-ico').className = 'md-ico w-7 h-7 rounded-lg flex items-center justify-center text-[11px] shrink-0 '
        + (ativo ? 'bg-brand-500/20 text-brand-300' : 'bg-surface-950 text-slate-500');
      b.querySelector('.md-num').className = 'md-num block font-mono text-[10px] ' + (ativo ? 'text-brand-300' : 'text-slate-600');
      b.querySelector('.md-nome').className = 'md-nome block text-xs font-semibold leading-snug ' + (ativo ? 'text-white' : 'text-slate-300');
    });
  },

  goTo(index) {
    if (index < 0 || index >= this.sections.length) return;
    this.current = index;
    if (this.mode === 'slides') {
      this.sections.forEach((el, i) => el.classList.toggle('hidden', i !== index));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this._updateIndicators();
    this._marcarModuloAtual();
    setTimeout(() => (this._slideHooks[index] || []).forEach(fn => fn()), 50);
  },

  next() { this.goTo(this.current + 1); },
  prev() { this.goTo(this.current - 1); },

  _updateIndicators() {
    const total = this.sections.length;
    document.getElementById('progress-bar').style.width = `${((this.current + 1) / total) * 100}%`;
    document.getElementById('current-slide-num').textContent = this.current + 1;

    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    prevBtn.disabled = this.current === 0;
    nextBtn.disabled = false;
    nextBtn.innerHTML = this.current === total - 1
      ? 'Concluído <i class="fa-solid fa-check"></i>'
      : '<span class="hidden sm:inline">Próximo Módulo</span><span class="sm:hidden">Próximo</span> <i class="fa-solid fa-chevron-right"></i>';
    if (this.current === total - 1) nextBtn.disabled = true;
  },

  toggleMode() {
    const label = document.getElementById('view-mode-label');
    const footer = document.getElementById('slide-footer');
    if (this.mode === 'slides') {
      this.mode = 'scroll';
      label.textContent = 'Modo Infográfico';
      footer.classList.add('hidden');
      this.sections.forEach(el => el.classList.remove('hidden'));
      Object.values(this._slideHooks).flat().forEach(fn => setTimeout(fn, 60));
      this.toast('Modo Infográfico contínuo: role a página livremente.', 'fa-scroll');
    } else {
      this.mode = 'slides';
      label.textContent = 'Modo Apresentação';
      footer.classList.remove('hidden');
      this.goTo(this.current);
      this.toast('Modo Apresentação: um módulo por etapa.', 'fa-chalkboard');
    }
  },

  toggleHelp() {
    this._painel('help-modal', !this._aberto('help-modal'));
  },

  /* Z retrocede · C avança · A ajuda · S sumário (esquerda) · D módulos (direita).
     As setas continuam funcionando como alias de Z/C. */
  _bindKeys() {
    window.addEventListener('keydown', e => {
      const digitando = ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName);
      if (e.key === 'Escape' && digitando) { e.target.blur(); return; }
      if (digitando) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();

      if (k === 'escape') {
        ['help-modal', 'guia-sidebar', 'guia-modulos'].forEach(id => {
          if (this._aberto(id)) this._painel(id, false);
        });
      } else if (k === 'a') this.toggleHelp();
      else if (k === 'g') this.toggleCola();
      else if (k === 's') this.toggleSidebar();
      else if (k === 'd') this.toggleModulos();
      else if (this.ehGuia && (k === 'c' || e.key === 'ArrowRight' || e.key === 'PageDown')) this.next();
      else if (this.ehGuia && (k === 'z' || e.key === 'ArrowLeft' || e.key === 'PageUp')) this.prev();
      else return;

      e.preventDefault();
    });
  },

  toast(msg, icon = 'fa-circle-info') {
    const el = document.createElement('div');
    el.className = 'bg-surface-850 border border-brand-500/40 text-slate-100 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0';
    el.innerHTML = `<i class="fa-solid ${icon} text-brand-400"></i><span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(el);
    requestAnimationFrame(() => el.classList.remove('translate-y-2', 'opacity-0'));
    setTimeout(() => {
      el.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  /* Quiz: cada pergunta é uma .quiz-card com botões .quiz-opt e um .q-feedback.
     onclick="Guia.answer(this, true|false, 'explicação opcional')" */
  answer(btn, isCorrect, explanation) {
    const card = btn.closest('.quiz-card');
    if (this.answered.has(card)) return;
    this.answered.add(card);

    card.querySelectorAll('.quiz-opt').forEach(b => b.classList.add('pointer-events-none', 'opacity-60'));
    const feedback = card.querySelector('.q-feedback');
    btn.classList.remove('bg-surface-900', 'border-slate-800', 'opacity-60');

    if (isCorrect) {
      this.quizScore++;
      btn.classList.add('bg-emerald-950/80', 'border-emerald-500', 'text-emerald-200');
      feedback.className = 'q-feedback text-[11px] p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-start gap-2';
      feedback.innerHTML = `<i class="fa-solid fa-circle-check mt-0.5"></i><span>Correto! ${explanation || ''}</span>`;
      this.toast('Resposta correta!', 'fa-circle-check');
    } else {
      btn.classList.add('bg-rose-950/80', 'border-rose-500', 'text-rose-200');
      card.querySelector('.quiz-opt[data-correct]')?.classList.add('border-emerald-500/60');
      feedback.className = 'q-feedback text-[11px] p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2';
      feedback.innerHTML = `<i class="fa-solid fa-circle-xmark mt-0.5"></i><span>Incorreto. ${explanation || 'Releia os módulos anteriores para reforçar este ponto.'}</span>`;
      this.toast('Resposta incorreta.', 'fa-circle-xmark');
    }
    feedback.classList.remove('hidden');
    const badge = document.getElementById('quiz-score-badge');
    if (badge) badge.textContent = `Pontuação: ${this.quizScore} / ${this.quizTotal}`;
    this.renderMath(feedback);
  }
};

window.addEventListener('DOMContentLoaded', () => Guia.init());
