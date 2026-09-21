# Guia Técnico

Material de consulta rápida para cientistas de dados: explica, de forma didática e visual, os métodos e algoritmos usados na esteira de dados/ML — servindo de referência tanto para quem implementa quanto para quem precisa entender uma decisão técnica sem mergulhar no paper original.

Publicado via GitHub Pages.

Cada metodologia é um **infográfico interativo**: módulos navegáveis (modo apresentação ou rolagem contínua), fórmulas em KaTeX, pelo menos um simulador ao vivo e um quiz de fixação. O contrato completo desse padrão está em [`CLAUDE.md`](CLAUDE.md) — leia antes de criar ou editar uma página.

## Conteúdo

### [1. Information Retrieval (RAG)](public/ir/index.html)

O que é recuperação de informação e por que ela decide se um RAG funciona ou alucina. Inclui demo comparando busca léxica × semântica.

**[1.1 Modelos Esparsos](public/ir/esparsos/index.html)** — casam palavra com palavra sobre um índice invertido.

1. [TF-IDF](public/ir/esparsos/tf-idf/index.html) — frequência do termo × raridade na coleção.
2. [BM25](public/ir/esparsos/bm25/index.html) — saturação de frequência e normalização por tamanho de documento.
3. [Sparse Encoder (SPLADE)](public/ir/esparsos/sparse-encoder/index.html) — pesos aprendidos e expansão de termos no índice invertido.

**[1.2 Modelos Densos](public/ir/densos/index.html)** — casam significado com significado em espaço vetorial.

1. [Embeddings em IR](public/ir/densos/embeddings/index.html) — vetores densos e similaridade de cosseno.
2. [Word2Vec](public/ir/densos/word2vec/index.html) — janela deslizante, CBOW × Skip-Gram, negative sampling, aritmética vetorial.
3. [Embeddings: Origem & Além da Linguagem](public/ir/densos/fundamentos/index.html) — hipótese distribucional, efeito gargalo, CLIP, recomendação, bioinformática.
4. [Arquitetura Transformer](public/ir/densos/transformer/index.html) — Q/K/V, atenção, multi-head e as três saídas da busca neural.
5. [Cross-Encoder](public/ir/densos/cross-encoder/index.html) — o re-ranker: um score por par, só sobre os top-k.
6. [Multi-Vector (ColBERT)](public/ir/densos/multi-vector/index.html) — um vetor por token e interação tardia (MaxSim).

**[1.3 Busca Híbrida e RRF](public/ir/rrf/index.html)** — fusão de rankings por posição, a constante k e o pipeline de recuperação completo.

**[1.4 Do Retrieval ao Agente Confiável](public/ir/agente/index.html)** — com o trecho certo em mãos, o que muda na ponta.

1. [Por que o modelo alucina](public/ir/agente/alucinacao/index.html) — previsão de próximo token, alucinação intrínseca × extrínseca e os quatro estados do contexto.
2. [Grounding e citação](public/ir/agente/grounding/index.html) — atribuição por afirmação, citar ou se abster, verificação pós-geração.
3. [O laço do agente](public/ir/agente/laco/index.html) — reescrita de query, multi-hop, autocrítica e critério de parada.
4. [Medir se está funcionando](public/ir/agente/avaliacao/index.html) — recall@k, MRR, nDCG, fidelidade e precisão de contexto.
5. [Os outros ganhos](public/ir/agente/ganhos/index.html) — atualidade sem retreino, custo e janela de contexto, governança, auditoria.

### [2. Redes Neurais](public/redes-neurais/index.html)

O capítulo 1 usa os modelos; este abre a caixa: quais peças existem, o que cada uma calcula e por que estão nessa ordem.

**[2.1 Transformers](public/redes-neurais/transformers/index.html)** — a arquitetura encoder-decoder como um diagrama clicável; cada bloco abre a página que o explica.

1. [Positional Encoding](public/redes-neurais/transformers/positional-encoding/index.html) — por que a atenção é cega à ordem e como a posição entra no vetor.
2. [Bloco Transformer](public/redes-neurais/transformers/bloco/index.html) — a unidade que se repete: sublayer, residual e normalização; pré-norma × pós-norma.
   1. [Multi-head Attention](public/redes-neurais/transformers/bloco/multi-head-attention/index.html) — Q/K/V, o `√d_k` e por que várias cabeças.
   2. [Add & Norm](public/redes-neurais/transformers/bloco/add-norm/index.html) — conexão residual, LayerNorm e RMSNorm.
   3. [Positionwise FFN](public/redes-neurais/transformers/bloco/ffn/index.html) — onde moram os parâmetros e o cruzamento de custo com a atenção.
3. [Encoder](public/redes-neurais/transformers/encoder/index.html) — atenção bidirecional, máscara de padding e o que a saída alimenta.
   1. [Cross-attention](public/redes-neurais/transformers/encoder/cross-attention/index.html) — Q do decoder, K e V do encoder: a única ponte entre os dois lados.
4. [Decoder](public/redes-neurais/transformers/decoder/index.html) — geração autoregressiva, teacher forcing, KV-cache e decoder-only.
   1. [Masked Multi-head Attention](public/redes-neurais/transformers/decoder/masked-attention/index.html) — a máscara triangular antes do softmax.
5. [Camada de Saída (FC)](public/redes-neurais/transformers/fc/index.html) — a projeção para o vocabulário, weight tying, softmax e o custo da cabeça.

## Estrutura

```
public/
  index.html                índice dos capítulos
  assets/guia.css|guia.js   shell compartilhado dos infográficos
  ir/index.html             capítulo 1 — Information Retrieval
  ir/<secao>/index.html     introdução da seção (esparsos, densos)
  ir/<secao>/<metodo>/index.html
  ir/agente/index.html      seção 1.4 — Do Retrieval ao Agente Confiável
  ir/agente/<topico>/index.html
```

## Como adicionar conteúdo

Siga [`CLAUDE.md`](CLAUDE.md) — ele define o esqueleto HTML, a API de `guia.js`, a progressão dos módulos, a paleta e a regra da interatividade. Resumo:

- **Nova metodologia**: `public/<capitulo>/<secao>/<metodo>/index.html` no padrão de infográfico. Some na lista da seção, do capítulo, neste README e no `CHANGELOG.md`.
- **Nova seção ou capítulo**: pasta com `index.html` de introdução no mesmo shell (`guia.css` + `guia.js`), **sem** `.slide-section` — o shell monta o header sem abas de módulo. Registre em `GUIA_MAPA` para aparecer no sumário lateral.

## Deploy

O workflow `.github/workflows/pages.yml` publica o conteúdo de `public/` como está — não há build. Basta commitar na `main`. Na primeira vez, ative em *Settings → Pages → Source → GitHub Actions*.
