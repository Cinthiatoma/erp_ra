# ERP RA

Sistema web simples que substitui a planilha `ERP_RA.xlsx`, com três módulos:

- **Tarefas**: cadastro, filtro por status e responsável (Jesse, Gabriela, Cinthia), prazo com cores (vermelho = atrasada ou vence hoje, amarelo = faltam até 3 dias).
- **Financeiro**: controle **mês a mês** de status da nota e status dos impostos, com cálculo automático de imposto e valor líquido.
- **Clientes**: cadastro de clientes, tipo de contrato (Mensal/Projeto) e dia de emissão da nota.

## Como usar

Não precisa instalar nada. Abra o `index.html` no navegador.

Para servir localmente:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Armazenamento

Os dados ficam no `localStorage` do navegador (chave `erp_ra`). Fora do ambiente do Claude não há banco compartilhado, então cada navegador tem seus próprios dados.

Para uso em equipe, o próximo passo é trocar as funções `carregar()` e `salvar()` em `app.js` por chamadas a uma API ou banco (Supabase, Firebase etc.).

## Estrutura

```
index.html   estrutura da página
style.css    visual (paleta clara)
app.js       dados, telas e regras
```

## Publicar no GitHub Pages

```bash
git init
git add .
git commit -m "ERP RA: versão inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/erp-ra.git
git push -u origin main
```

Depois, em **Settings > Pages**, escolha a branch `main` e a pasta `/ (root)`.
