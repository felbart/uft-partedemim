# UFT Parte de Mim

Hotsite da campanha institucional da UFT, prevista para novembro de 2026.
**Cuidar de mim é cuidar de nós.**

## MVP do Bingo do Autocuidado

A rota `/bingo` oferece cartela 4×4, variantes clara e azul, seleção/desmarcação, progresso local, reinício com confirmação e PNG para Stories. A raiz `/` redireciona para `/bingo`. A conclusão acontece somente com as 16 atividades marcadas. Não há backend, autenticação, ranking ou sincronização entre dispositivos.

Os textos do Figma foram validados em 21/10/2026, com “Caminhar” substituído por “Movimentar-me como posso”. O progresso e o tema usam a chave versionada `uft-parte-de-mim:bingo:v1` no localStorage. Falhas de leitura/escrita são informadas sem impedir a interação.

## Instalação e desenvolvimento

Ambiente verificado: Node.js 22.17.0 e npm 11.8.0.

```sh
npm ci
npm run dev
```

Acesse a URL do Vite seguida de `/bingo`. Preserve o package-lock.json.

```sh
npm run lint
npm run build
npm run preview
```

O build executa TypeScript (`tsc -b`) com strict e gera `dist/`. O preview serve o build local, sem publicá-lo.

## Organização

- `src/features/bingo/activities.ts`: conteúdo validado e IDs estáveis.
- `progress.ts` / `useBingoProgress.ts`: validação, seleção, tema e persistência.
- `BingoPage.tsx` / `BingoBoard.tsx`: página, controles e tabuleiro acessível.
- `CampaignBrand.tsx`: marcas locais por tema.
- `BingoExport.tsx` / `exportFormats.ts` / `exportBingo.ts`: composição própria e geração do PNG.
- `src/globals.css`: tokens Tailwind v4, temas, responsividade e composição Stories.

## Identidade visual e fontes pendentes

Somente arquivos locais são usados. Nenhum asset ou fonte foi baixado ou recriado do Figma. As marcas já fornecidas estão em `public/images/` e foram preservadas nesse local; novos arquivos do designer podem ser entregues em `src/assets/images/` e importados nos componentes.

Os tokens `--font-heading` (Idiqlat) e `--font-sans` (Rawline) usam arquivos locais de `src/assets/fonts/` via @font-face e `font-display: swap`. Pesos carregados: Idiqlat Regular 400; Rawline 400, 600 e 700. Os demais arquivos fornecidos permanecem disponíveis para uso futuro, sem carga antecipada. Não há Idiqlat Bold fornecida: títulos em 700 usam síntese do navegador. Fallbacks preservados; nenhuma fonte externa é requisitada.

O brasão das células usa o SVG original `public/images/simbolo-brasao.svg` (275 × 299), sem alterações de cor ou proporção, com alt vazio por ser decorativo junto às atividades. O arquivo foi encontrado em public/images; src/assets/images continua vazio. A assinatura Progedep também está integrada nas variantes azul e bege. Pendente: textura. Placeholders identificados aparecem na interface e na imagem exportada. A marca horizontal local tem composição diferente da marca em uma linha do Figma; foi preservada sem recorte/recriação. A fidelidade final depende da entrega do designer.

O verde selecionado mantém #239BA7; o texto escuro foi ajustado para #052536 por contraste. Ícone de confirmação e aria-pressed também identificam a seleção. Não se declara conformidade WCAG integral sem auditoria assistiva.

## Exportação

Stories: **1080 × 1920 px**, pixelRatio 1, composição própria fora da área visível e fora da árvore acessível. Compartilha os mesmos dados/tema da cartela, sem capturar os controles do navegador. Contém marca local, mote, 16 atividades e progresso. Reserva 250 px no topo e na base e 64 px nas laterais; essas margens são uma precaução de composição, não garantia para todas as interfaces de redes sociais.

O gerador aguarda fontes/imagens, informa erros e trava alterações durante a captura. O botão Compartilhar usa Web Share quando há suporte a arquivos; caso contrário, baixa o PNG. Download permanece sempre disponível. Compartilhamento nativo depende do navegador e de HTTPS/localhost.

Para acrescentar feed 1080 × 1350, registrar um perfil em `exportFormats.ts`, criar suas regras de composição em CSS, passar o formato ao componente/gerador e validar margens/legibilidade. O feed ainda não está habilitado.

## Testes executados

Há uma verificação automatizada sem dependências adicionais em `scripts/verify-bingo.mjs`, usando CDP em um navegador de teste. Requer Vite em `http://127.0.0.1:5173` e Chrome/Chromium headless com depuração local na porta 9223 e perfil separado (não usar seu perfil pessoal).

```powershell
# Terminal 1
node node_modules/vite/bin/vite.js --host 127.0.0.1
# Terminal 2 (ajustar caminho do Chrome se necessário)
& 'C:/Program Files/Google/Chrome/Application/chrome.exe' --headless=new --disable-gpu --no-first-run --remote-debugging-port=9223 --user-data-dir="$PWD/node_modules/.tmp/bingo-chrome-test" about:blank
# Terminal 3
node scripts/verify-bingo.mjs
```

A verificação usa um perfil de teste e limpa seu localStorage. Testa seleção/desmarcação, Space, recarga, tema, cancelamento/confirmação de reset (respostas simuladas), conclusão completa, larguras 320/375/768/1440, dados corrompidos e escrita bloqueada. Gera PNGs claros/azuis, verifica 1080×1920 e margens, e confirma download real pelo botão. Capturas e PNGs ficam em `node_modules/.tmp/bingo-qa/`.

Executado com sucesso em Chrome headless. As capturas desktop/mobile e os PNGs também foram inspecionados visualmente. Não foram realizados testes manuais com leitor de tela, dispositivo móvel físico, Safari/iOS ou o diálogo nativo de compartilhamento. A animação de confete está implementada, mas sua aparência não foi validada manualmente; o teste usa movimento reduzido.

## Publicação estática

Netlify: comando `npm run build`, diretório publicado `dist`. O arquivo `public/_redirects` já fornece fallback SPA. Em servidor institucional, configurar regra equivalente para `/bingo` e rotas da aplicação. Para subdiretório, ajustar `base` do Vite (BrowserRouter já usa BASE_URL) e o fallback do servidor.

Não há URL pública nesta etapa: destino/domínio ainda precisam ser definidos. Antes de divulgação, integrar assets/fontes finais, repetir verificações e validar HTTPS, acesso direto/recarga em `/bingo` e exportação no destino.

Histórico do diagnóstico: [auditoria e planejamento](docs/auditoria-mvp.md).


## Refatoração visual e utilitários de títulos

A apresentação usa utilitários Tailwind diretamente nos componentes. `globals.css` contém tokens, aliases semânticos, utilitários de título e estilos globais (foco, progress nativo e movimento reduzido), sem @apply nem seletores de layout do bingo.

A paleta existente mantém `azul`, `azul-dk`, `bege`, `bege-lt`, `bege-dk`, `verde`, `amarelo` e `selected-ink`. `bg-surface`, `text-ink`, `text-title` e `outline-focus` usam aliases dependentes de `data-theme`; não são cópias da paleta. O confete também lê as cores dos tokens. As variantes screen/stories do tabuleiro centralizam apenas as diferenças de escala, sem duplicar conteúdo ou cores.

Utilitários de título disponíveis: `h1`, `h2`, `h3`, `h4`, todos com `font-heading`, peso 700 e tamanho fluido por clamp:

| Classe | Tamanho mínimo → máximo |
| --- | --- |
| h1 | 2rem → 3rem |
| h2 | 1.75rem → 2.5rem |
| h3 | 1.5rem → 2rem |
| h4 | 1.25rem → 1.5rem |

Exemplo: `<h2 className="h2 text-title">Título da seção</h2>`. A classe controla aparência; mantenha a tag HTML adequada à hierarquia semântica. Stories usa escala fixa com `text-story-heading`, independentemente da largura do navegador. O peso bold pode ser sintetizado pelo navegador enquanto não houver arquivos oficiais; nenhuma fonte alternativa foi baixada.

Na regressão após a refatoração, o script também verifica proporção/carregamento do brasão, ausência de corte nas células exportadas e a hierarquia/peso/responsividade dos quatro utilitários de título. Foram inspecionadas capturas mobile/desktop e PNGs claros/azuis. As limitações de testes assistivos/dispositivos físicos continuam aplicáveis.
