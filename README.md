# Simulador — Estilo Serasa (Pro) — Vercel Ready

Este repositório é **estático**. Basta subir os arquivos e a Vercel detecta como **Static** (sem build).

## Como usar
1. Publique tudo no GitHub (raiz do repo).
2. Na Vercel, clique em **New Project** → **Import Git Repository** e selecione o repo.
3. A Vercel detectará `Static` automaticamente. Se quiser garantir, defina **Build Command** vazio e **Output Directory** como `/`.
4. Pronto. A página estará online.

- `index.html`: app React via CDN (sem Node/Build).
- `vercel.json`: força reescrita para `index.html` (útil caso queira rotas no futuro).
- `favicon.svg`: ícone simples.

## Personalizações
- Ajuste as cores em `index.html` dentro do `<style>` (variáveis `--brand-*`). 
- Troque o badge “S” pelo seu logotipo (substitua `favicon.svg` e/ou edite a marca no header).

