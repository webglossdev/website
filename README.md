# 🌌 webglossdev.tech — Portfólio Pessoal & Universo Interativo

[![Live Site](https://img.shields.io/badge/Website-webglossdev.tech-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://webglossdev.tech/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)

Website pessoal e portfólio de engenharia de **Leonardo P. Soares**. Concebido como um espaço autoral e imersivo na web, unindo design moderno com estética *Apple Liquid Glass*, interfaces reativas e identidades visuais temáticas inspiradas em animes icônicos.

---

## ✨ Destaques & Funcionalidades

### 🎨 Design System & Estética Liquid Glass
- **Vidro Fosco Dinâmico (*Liquid Glass*)**: Efeitos de refração, desfoque de fundo (`backdrop-filter`) e bordas translúcidas polidas.
- **Microinterações & Partículas Dinâmicas**: Motor de partículas ambientais customizado via `tsParticles`, reagindo à paleta e ao tema de cada página.
- **Zero FOUC (Flash of Unstyled Content)**: Hidratação de tema síncrona no `<head>` via `localStorage`, prevenindo qualquer lampejo visual durante a navegação.
- **Tipografia Fluida**: Combinação moderna de **Inter** para leitura, **JetBrains Mono** para elementos técnicos e **Cinzel** para títulos clássicos.

### 🗾 Mundos Temáticos Integrados
Cada seção do site possui sua própria personalidade visual, paleta de cores e conjunto exclusivo de ícones SVG otimizados:
- **Início (`/`)** — *Chuunibyou demo Koi ga Shitai!* (Takanashi Rikka & Runas Mágicas)
- **Sobre Mim (`/sobre`)** — *Mahou Shoujo Madoka Magica* (Gemas de Alma & Contratos)
- **Projetos (`/projetos`)** — *Gosick* (Victorique de Blois, Relicários & Dossiês)
- **Blog Técnico (`/blog`)** — *Made in Abyss* (Mergulho nas Camadas do Abismo com telemetria de profundidade)
- **Contato (`/contato`)** — *K-On!* (Clube de Música Leve & Laços)
- **Profissional / Contrate-me (`/contrate-me`)** — *Re:Zero kara Hajimeru Isekai Seikatsu* (Beatrice, Rem, Ram, Subaru & Meili)

### 🚀 Engenharia de Front-End & Arquitetura
- **Baralho de Fundo Sem Repetição (*Fisher-Yates Deck*)**:
  - Mecanismo aleatório persistente em `localStorage` (`bg_deck_${pageKey}`).
  - Garante que nenhuma imagem de fundo se repita até que todas as opções da pasta daquela página tenham sido exibidas.
  - Fallback gracioso com transição imediata para wallpapers canônicos caso um arquivo seja indisponível.
- **Navegação Mobile com *Dynamic Island***:
  - Cabeçalho flutuante responsivo inspirado na *Dynamic Island*.
  - Expansão suave em gaveta de navegação em grid com desfoque de fundo, seleção rápida de rotas e alternadores de tema e partículas.
- **Telemetria de Profundidade no Blog**:
  - Indicador vertical estilizado como a bússola do Abismo (*Made in Abyss*).
  - Cálculo dinâmico do ponto de origem (mostrando a camada anterior em mergulhos profundos) e sincronização com o fim da página (100%).
- **Visualizador de Diplomas & Certificados Interativo**:
  - Modal Lightbox com renderização de diploma em alta fidelidade.
  - Suporte a frente e verso interativo com efeito de *card flip 3D*.
  - Botão único de download do documento oficial.
- **Sprite SVG Unificado**:
  - Ícones vetoriais embutidos diretamente no layout para carregamento imediato sem requisições HTTP adicionais e suporte offline completo.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Estrutura** | HTML5 Semântico | Acessibilidade, meta tags Open Graph e SEO otimizado |
| **Estilos** | CSS3 Moderno | Vanilla CSS puro com Custom Properties (Variáveis CSS), Grid e Flexbox |
| **Lógica** | JavaScript (ES6+) | Vanilla JS modular, manipulador de DOM nativo e gestão de estado local |
| **Efeitos** | tsParticles | Emissor de partículas ambientais contextuais |
| **Segurança & CDN** | Cloudflare | DNS gerenciado, proteção DDoS, SSL/TLS e túneis de borda |

---

## 📂 Estrutura de Diretórios

```text
website-main/
├── index.html               # Página inicial (Chuunibyou)
├── contrate-me.html         # Página de contratação e serviços (Re:Zero)
├── layout.js                # Injeção de navegação, Dynamic Island, sprites e rotator
├── script.js                # Lógica de partículas, tema, filtros e lightbox
├── style.css                # Design system completo e tokens CSS
├── scripts_helper.ps1       # Automação para indexação do manifest.json de backgrounds
│
├── sobre/                   # Sobre Mim, timeline, setup, stack e certificados (Madoka)
├── projetos/                # Portfólio de projetos, carrosséis e diagnósticos (Gosick)
├── blog/                    # Blog pessoal e artigos técnicos com gauge de profundidade (Abyss)
├── contato/                 # Redes sociais, e-mail e formulário (K-On!)
├── posts/                   # Artigos em Markdown e índice de publicações
│
└── assets/
    ├── backgrounds/         # Coleção de wallpapers indexados por página e dispositivo
    │   └── manifest.json    # Catálogo gerado automaticamente de backgrounds
    ├── icons-anime.svg      # Biblioteca de ícones vetoriais temáticos
    └── ...                  # Imagens, certificados e documentos (IRS.pdf, logos, etc.)
```

---

## 💻 Executando Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/webglossdev/website.git
   cd website
   ```

2. Para atualizar dinamicamente o catálogo de planos de fundo após adicionar novas imagens na pasta `assets/backgrounds/`:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts_helper.ps1
   ```

3. Inicie um servidor web local na raiz do projeto (ex.: com Python ou Node.js):
   ```bash
   # Com Python
   python -m http.server 8080

   # Ou com npx serve
   npx serve .
   ```

4. Acesse no seu navegador: `http://localhost:8080`.

---

## 🗺️ Processo de Criação do Front-End

Fluxograma conceitual do planejamento e desenvolvimento:

<div align="center">
  <img width="100%" alt="Processo de Front-End" src="https://github.com/user-attachments/assets/0415c92c-aa81-4209-826b-5f965704668e" />
</div>

---

## 📬 Contato & Conexão

- **Website Oficial:** [webglossdev.tech](https://webglossdev.tech/)
- **GitHub:** [@webglossdev](https://github.com/webglossdev)
- **E-mail:** [contato@webglossdev.tech](mailto:contato@webglossdev.tech)

---

<div align="center">
  <sub>Desenvolvido com carinho por Leonardo P. Soares. Inspirado na magia dos animes e na paixão por tecnologia.</sub>
</div>
