# Auditoria e planejamento do MVP

Data: 21/10/2026. Escopo: auditoria e planejamento, sem implementar funcionalidades.

## Diagnóstico técnico

- `App.tsx`: contém somente um `main` vazio. Não existem componentes, páginas, rotas ou lógica de bingo.
- `main.tsx`: inicialização convencional com createRoot, StrictMode e importação do CSS global; preservar.
- Tailwind v4 integrado por `@tailwindcss/vite` em vite.config.ts e `@import "tailwindcss"` em globals.css. Há três tokens em @theme: bege-lt (#fdfcf7), bege (#fbf5de), bege-dk (#f5e6ac). Preservar até validar identidade. Não é necessário introduzir configuração v3/PostCSS.
- Instalados: React/React DOM 19.3.1, Vite 8.3.4, TypeScript 6.0.3, Tailwind/plugin 4.3.3, React Router 7.18.4, Lucide React 1.60.0, html-to-image 1.11.13, canvas-confetti 1.9.4 e motion 14.4.0. `npm ls --depth=0` terminou com sucesso.
- React Router já está disponível; não instalar outro roteador. Motion pode permanecer sem uso; não remover pacotes por preferência.
- ESLint inclui TypeScript, React Hooks e React Refresh. Scripts existentes: dev, lint, build e preview. Não há testes automatizados.
- TypeScript verifica código não utilizado, mas não habilita strict. Proposta: habilitar no início da implementação, enquanto a base é pequena. Não há @types/canvas-confetti declarado; verificar tipagem antes da celebração opcional.
- index.html ainda tem lang=en, título técnico e favicon do template. Ajustar para pt-BR e metadados/ícone da campanha na etapa visual.
- Não há configuração de deploy. `git status` informa que o diretório não é repositório Git; confirmar origem/versionamento antes de publicação.
- Nenhum AGENTS.md encontrado no projeto ou caminhos ancestrais verificados.

## Assets e protótipos

- hero.png foi inspecionado: camadas geométricas roxas do template, sem identidade da campanha.
- react.svg, vite.svg e favicon.svg são assets do template. icons.svg contém ícones de serviços/documentação. Não estão sendo usados por App; preferir Lucide nos controles novos.
- src/assets/images está vazio. Não foram encontrados arquivos locais de fontes, marcas ou ilustrações oficiais.
- [Figma analisado](https://www.figma.com/design/u2Z0Y0haVceLl3EkjAw33v/UFT-Parte-de-mim?node-id=2015-546): visão geral do nó 2015:546 via screenshot. Há estudos 4×4 em fundos claro e azul, variações de proporção, marcas da campanha/Progedep, padrões gráficos, fotografia e exemplos visuais de célula selecionada/não selecionada. Há também referências menores de outra cartela; não confundir com especificação final.
- Reutilizar do Figma: marcas, padrão de fundo, símbolo e linguagem visual das células. Exportar assets separadamente na implementação, mantendo texto/interação em HTML. A fotografia não é necessária ao MVP.
- A captura geral não confirma fontes, valores exatos de cores, medidas ou comportamento. Inspecionar os frames escolhidos em detalhe antes de implementar. Nenhuma variante é considerada aprovada.

## Organização mínima proposta

Preservar App.tsx, main.tsx, globals.css e as configurações. Criar somente quando usados:

```text
src/features/bingo/
  BingoPage.tsx
  BingoBoard.tsx
  activities.ts
  useBingoProgress.ts
  exportBingo.ts
```

Tipos podem ficar junto aos dados/hook. Extrair célula ou composição de exportação somente se a complexidade justificar. Não criar pastas vazias para experiências futuras, estado global ou biblioteca genérica de UI.

## Sequência de trabalho por prioridade

1. **Validar referência e regras.** Escolher variante clara/azul, confirmar 16 atividades e ausência/presença de casa livre, obter fontes e assets. Proposta de conclusão: todas as atividades marcadas; progresso = marcadas/total. Linhas/colunas não seriam conquistas separadas. Alternativa: celebrar linhas, explicitamente diferenciadas da conclusão total. A decisão permanece pendente.
2. **Página navegável.** Usar React Router existente em `/bingo`. Propor redirecionamento temporário de `/` para `/bingo` e tratamento de URL desconhecida. Implementar dados com IDs estáveis, interface responsiva baseada no frame escolhido, idioma/metadados e foco visível. Validar textos, 320 px, desktop e zoom antes de avançar.
3. **Interação e persistência.** Botões com aria-pressed e indicação por ícone/texto além da cor; progresso textual acessível. localStorage com chave versionada, leitura inicial segura, validação de IDs, JSON inválido e falha de armazenamento tratados. Reset com confirmação e cancelamento; confirmação nativa é suficiente inicialmente. Testar marcação/desmarcação, recarga e ambos os caminhos de reset. Não há sincronização entre dispositivos.
4. **PNG e compartilhamento.** Usar html-to-image para composição com fundo explícito, marca, título, tabuleiro e progresso, sem controles. Aguardar fontes/imagens; exibir geração/erro. Proposta: largura final de 1080 px e altura conforme conteúdo, validando legibilidade e ausência de cortes. Se necessário, composição própria para exportação usando os mesmos dados. Download sempre disponível; Web Share por detecção de suporte, sem tratar cancelamento como falha. Confete opcional somente na transição para conclusão, respeitando movimento reduzido e sem repetir ao recarregar.
5. **Verificar e publicar.** Lint/build, testes focados em regra de conclusão e persistência, verificação em navegador de mobile, teclado, leitor de tela, contraste, console e PNG. Definir hospedagem, fallback SPA e base URL. Publicar em destino autorizado e validar acesso direto/recarga de `/bingo` na URL pública. Atualizar README com configuração efetiva e limitações.

Sem rankings, comparação entre colegas ou pressão por desempenho. Conferir alvos de toque, foco não encoberto e mensagens de status sem excesso. WCAG 2.2 AA ainda não avaliada: não há interface funcional.

## Verificações desta etapa

- `npm run lint`: aprovado, exit code 0.
- `npm run build`: aprovado, exit code 0; inclui tsc -b e Vite (16 módulos transformados).
- `npm ls --depth=0`: aprovado.
- Inspeção visual de hero.png e captura geral do Figma concluídas.
- Funcionalidades, console em navegador, acessibilidade, exportação e URL pública não validados: ainda não implementados/publicados.

## Pendências

Escolher frame/variante principal; confirmar atividades, regra de conclusão e encaminhamento de `/`; inspecionar tipografia/tokens e exportar assets do Figma; definir hospedagem e origem Git. Nenhuma dependência nova proposta nesta auditoria. Alterações desta etapa limitadas à documentação; código e configurações preservados.

## Atualização — primeira implementação funcional (21/10/2026)

As pendências de produto foram resolvidas: duas variantes, 16 atividades, conclusão apenas com todas marcadas e PNG Stories exato 1080×1920. Conteúdo aprovado com a adaptação “Movimentar-me como posso”. A raiz redireciona para `/bingo`, sem Home nova.

Implementada a estrutura modular de bingo, com componentes adicionais apenas para marca, composição de exportação e perfis de formato. TypeScript strict habilitado nos dois projetos. HTML pt-BR e metadados ajustados; favicon do template removido até existir arquivo aprovado. Nenhuma dependência adicionada. canvas-confetti recebe declaração local mínima dos parâmetros usados e carregamento dinâmico.

Assets locais novos foram encontrados em `public/images/`; marcas horizontais clara/azul reutilizadas sem mover/alterar os arquivos. Fontes oficiais ainda ausentes: tokens preparados, sem @font-face fictício. Texturas, símbolos e marca Progedep sinalizados com placeholders. A proibição de download/recriação de assets do Figma foi respeitada. Frames 2015:610, 2030:122 e 2015:697 foram consultados apenas para referência visual, cores e texto.

Verificação automatizada em Chrome headless: seleção, Space, persistência após recarga, tema, reinício com respostas simuladas de confirmação, conclusão, layout 320/375/768/1440, armazenamento inválido/bloqueado e PNG nas duas variantes. Os PNGs têm 1080×1920, e o conteúdo termina antes de y=1670 (margem inferior de 250 px). Download real pelo botão confirmado no disco. Capturas e PNGs inspecionados visualmente. Nenhuma exceção JS/console.error no fluxo testado. Consultar README para reproduzir e para limitações não testadas manualmente.

Ainda pendentes: entrega das fontes/assets, validação visual final da equipe, dispositivos físicos/leitor de tela/compartilhamento nativo e definição do destino de publicação. Não há URL pública confirmada. Os registros acima desta atualização descrevem o estado anterior à implementação.

## Atualização — refatoração visual e brasão (21/10/2026)

A apresentação passou a usar utilitários Tailwind nos componentes, preservando estado, dados e exportação. A paleta existente foi mantida; aliases surface/ink/title/focus centralizam os temas por data-theme. globals.css concentra tokens, utilitários h1–h4 (font-heading, 700 e tamanhos fluidos), foco, progress nativo e movimento reduzido. Removidos estilos inline e regras CSS de layout do bingo. As variantes screen/stories compartilham o tabuleiro.

O arquivo oficial foi localizado em public/images/simbolo-brasao.svg, não em src/assets/images. SVG 275×299 reutilizado sem alterações; alt vazio nas células por ser decorativo junto ao texto. Fonte e demais assets pendentes continuam registrados no README.

TypeScript strict, build e lint aprovados. Regressão em Chrome headless aprovada: interações, persistência, temas, reset, conclusão, teclado, larguras 320/375/768/1440, PNG e download. Adicionadas verificações de carregamento/proporção do brasão, conteúdo dentro das células exportadas, dimensões/margens físicas da composição e hierarquia/peso/responsividade h1–h4. Capturas claras/azuis e PNGs inspecionados; composição final termina em y=1635.25, dentro da margem inferior de segurança. Não houve teste manual com leitor de tela ou dispositivo físico nesta etapa.
