# Migração para IBM Carbon Design System

## Resumo das Mudanças

Este documento descreve as alterações realizadas para transformar a aplicação para usar o **IBM Carbon Design System**, incluindo as fontes IBM Plex e a paleta de cores oficial da IBM.

## Pacotes Instalados

```bash
npm install @carbon/react @carbon/styles @ibm/plex
```

### Dependências Adicionadas
- **@carbon/react**: Componentes React do Carbon Design System
- **@carbon/styles**: Estilos CSS do Carbon
- **@ibm/plex**: Família de fontes IBM Plex (Sans, Mono, Serif)

## Arquivos Modificados

### 1. Configuração de Estilos

#### `client/src/index.css`
- ✅ Importação dos estilos do Carbon Design System
- ✅ Importação das fontes IBM Plex
- ✅ Definição de variáveis CSS com paleta de cores IBM
- ✅ Configuração da fonte padrão como IBM Plex Sans

#### `client/tailwind.config.js`
- ✅ Adição da paleta completa de cores IBM (Blue, Gray, Cool Gray)
- ✅ Configuração das fontes IBM Plex (Sans, Mono, Serif)
- ✅ Manutenção de compatibilidade com classes Tailwind existentes

### 2. Componentes Atualizados

#### Componentes de Layout

**`client/src/components/layout/Header.jsx`**
- ✅ Substituído por componentes Carbon: `Header`, `HeaderName`, `HeaderNavigation`, `HeaderMenuItem`
- ✅ Aplicação de cores IBM (fundo cinza escuro, texto branco)
- ✅ Uso da fonte IBM Plex Sans

**`client/src/components/layout/Footer.jsx`**
- ✅ Aplicação de cores IBM (fundo cinza escuro, texto cinza claro)
- ✅ Uso da fonte IBM Plex Sans
- ✅ Hover com cor IBM Blue

**`client/src/components/layout/Layout.jsx`**
- ✅ Fundo alterado para `bg-ibm-gray-10` (cinza claro IBM)

#### Páginas Principais

**`client/src/pages/HomePage.jsx`**
- ✅ Substituição de componentes customizados por Carbon:
  - `Button` → `@carbon/react Button`
  - `Card` → `@carbon/react Tile`
  - `TextInput` → `@carbon/react TextInput`
  - `InlineNotification` → `@carbon/react InlineNotification`
  - `Loading` → `@carbon/react Loading`
- ✅ Aplicação de cores IBM em todos os elementos
- ✅ Uso consistente da fonte IBM Plex Sans

#### Componentes de Funcionalidade

**`client/src/components/upload/FileUpload.jsx`**
- ✅ Uso de `Button` e `InlineNotification` do Carbon
- ✅ Área de upload com cores IBM (azul para hover/drag)
- ✅ Feedback visual com cores IBM

**`client/src/components/summary/SummaryModeSelector.jsx`**
- ✅ Uso de `Tile` do Carbon para cards de seleção
- ✅ Estados visuais com cores IBM (selecionado = azul, hover = azul claro)
- ✅ Fonte IBM Plex Sans

**`client/src/components/summary/SummaryDisplay.jsx`**
- ✅ Uso de `Button` e `Tile` do Carbon
- ✅ Estatísticas com cores IBM
- ✅ Tipografia IBM Plex Sans

## Paleta de Cores IBM Aplicada

### Cores Principais
- **IBM Blue**: `#0f62fe` - Cor primária para ações e destaques
- **IBM Gray 10**: `#f4f4f4` - Fundo claro
- **IBM Gray 100**: `#161616` - Texto escuro e header
- **IBM White**: `#ffffff` - Fundo de cards

### Aplicação por Contexto
- **Headers/Navegação**: Fundo Gray 100, texto White
- **Backgrounds**: Gray 10 para página, White para cards
- **Botões Primários**: IBM Blue
- **Texto**: Gray 100 para títulos, Gray 70 para corpo
- **Links/Hover**: IBM Blue

## Fontes IBM Plex

### Família de Fontes Aplicada
- **IBM Plex Sans**: Fonte principal para UI e texto
- **IBM Plex Mono**: Fonte para código (quando necessário)
- **IBM Plex Serif**: Disponível para uso futuro

### Aplicação
Todos os textos importantes receberam o estilo inline:
```jsx
style={{ fontFamily: 'IBM Plex Sans' }}
```

## Componentes Carbon Utilizados

### Componentes de UI
- ✅ `Button` - Botões com variantes (primary, secondary, tertiary, ghost)
- ✅ `Tile` - Cards e containers
- ✅ `TextInput` - Campos de entrada de texto
- ✅ `InlineNotification` - Notificações inline
- ✅ `Loading` - Indicadores de carregamento

### Componentes de Navegação
- ✅ `Header` - Cabeçalho principal
- ✅ `HeaderName` - Logo/nome da aplicação
- ✅ `HeaderNavigation` - Container de navegação
- ✅ `HeaderMenuItem` - Itens de menu

## Benefícios da Migração

### Design Consistente
- ✅ Visual alinhado com padrões IBM
- ✅ Experiência profissional e corporativa
- ✅ Identidade visual forte

### Acessibilidade
- ✅ Componentes Carbon seguem WCAG 2.1
- ✅ Contraste adequado de cores
- ✅ Suporte a leitores de tela

### Manutenibilidade
- ✅ Componentes bem documentados
- ✅ Atualizações regulares da IBM
- ✅ Comunidade ativa

### Performance
- ✅ Componentes otimizados
- ✅ Tree-shaking automático
- ✅ CSS modular

## Próximos Passos Recomendados

### Componentes Pendentes
- [ ] Atualizar `HistoryPage.jsx` com componentes Carbon
- [ ] Atualizar `ProfilePage.jsx` com componentes Carbon
- [ ] Atualizar `LoginPage.jsx` (se existir) com componentes Carbon

### Melhorias Futuras
- [ ] Implementar tema escuro usando Carbon themes
- [ ] Adicionar mais componentes Carbon (DataTable, Modal, etc.)
- [ ] Implementar Carbon Grid System para layouts responsivos
- [ ] Adicionar animações Carbon

## Comandos para Testar

```bash
# No diretório client
cd client
npm run dev

# No diretório server (em outro terminal)
cd server
npm start
```

## Recursos Adicionais

- [Carbon Design System](https://carbondesignsystem.com/)
- [Carbon React Components](https://react.carbondesignsystem.com/)
- [IBM Plex Fonts](https://www.ibm.com/plex/)
- [IBM Design Language](https://www.ibm.com/design/language/)

## Notas Importantes

1. **Compatibilidade**: Mantivemos Tailwind CSS para utilitários, mas priorizamos componentes Carbon
2. **Fontes**: IBM Plex é carregada via CDN através do pacote `@ibm/plex`
3. **Cores**: Definidas tanto em CSS variables quanto em Tailwind config para máxima flexibilidade
4. **Componentes Customizados**: Alguns componentes customizados (Button, Card) ainda existem mas não são mais usados nas páginas principais

---

**Migração realizada em**: 2026-04-06  
**Status**: ✅ Concluída para componentes principais  
**Próxima revisão**: Atualizar páginas restantes (History, Profile, Login)