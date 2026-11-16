# SOC-AI — Intelligent Code Security (React + Vite)

A modern, responsive React web application converted from the standalone `code.html` security platform. Built with **React 18**, **Vite**, **Tailwind CSS**, and modern web APIs.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at: [http://localhost:5173/](http://localhost:5173/)

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 📁 Architecture & Components

```
react/
├── index.html                 # Vite HTML entry with Inter & JetBrains Mono fonts
├── vite.config.js             # Vite configuration with React plugin
├── tailwind.config.js         # Cyberpunk/security dark theme config
├── postcss.config.js          # PostCSS with Tailwind & Autoprefixer
├── package.json               # Dependencies and scripts
├── src/
│   ├── main.jsx               # React DOM root entry
│   ├── App.jsx                # Main application state & layout coordinator
│   ├── index.css              # Cyber matrix glowing styles & animations
│   ├── utils/
│   │   └── securityScanner.js # ML backend client + AST/heuristic static analyzer
│   └── components/
│       ├── CanvasBackground.jsx   # Interactive orbital canvas animation & particle physics
│       ├── Navbar.jsx             # Glowing logo mark, navigation links, and auth badge
│       ├── Hero.jsx               # Hero frame, animated typography, and system status
│       ├── Scanner.jsx            # Local File Upload (FileReader) & GitHub REST API import
│       ├── Vulnerabilities.jsx    # Severity filters (All, High, Med, Low) & threat cards
│       ├── AiFixModal.jsx         # AI remediation modal with explanation & code patch copy
│       ├── Capabilities.jsx       # 3 capability cards with hover glow and dblclick expand
│       ├── About.jsx              # Platform overview and architecture narrative
│       ├── Footer.jsx             # Cyber intelligence copyright footer
│       ├── AuthModal.jsx          # Sign In / Create Account with local session persistence
│       └── EventHandlingOverlay.jsx # Top scroll bar, viewport indicator, keyboard hint, context menu
```

---

## ⚡ Features & Capabilities

1. **Interactive Cyber Canvas Animation**
   - 1,000 interactive particles with depth-based alpha and orbital wobble.
   - Concentric orbital rings rotating on synchronized counter-axes.
   - Dynamic central radial core responding to mouse coordinates.

2. **Dual-Mode Project Input**
   - **Local File Upload**: HTML5 Drag & Drop and `FileReader` API supporting ZIP, Python, JS, Java, C++, HTML, JSON, etc.
   - **GitHub REST API Import**: Real-time repo parsing, commit tree traversal, and metadata analysis via `api.github.com`.

3. **Intelligent Threat Detection Engine**
   - Automatically connects to local Python ML model backend (`http://localhost:8000/api/analyze`) if available.
   - Built-in heuristic static security analyzer identifying:
     - SQL Injection via string concatenation
     - Cross-Site Scripting (XSS) / innerHTML vulnerabilities
     - Hardcoded API credentials / private keys
     - Command Injection via child_process/system exec
     - Path Traversal in file access
     - Deprecated cryptography (MD5/SHA1)
     - Permissive CORS policies

4. **AI Remediation Modal**
   - In-depth vulnerability explanation.
   - Ready-to-merge secure code patch.
   - One-click clipboard copy with visual confirmation.

5. **Complete 12-Event Handling Suite**
   - `load`: Welcome security status toast on initialization.
   - `input`: Real-time character counter and URL syntax validation.
   - `mouseover` / `mouseout`: Cyber glowing borders on capability cards.
   - `focus` / `blur`: Security focus highlights on auth fields.
   - `keydown`: Live keyboard shortcut detection pill.
   - `scroll`: Linear gradient progress bar along the top viewport.
   - `resize`: Floating viewport dimension tracker (`WIDTH × HEIGHT px`).
   - `dblclick`: Smoothly expands and collapses card technical specs.
   - `contextmenu`: Custom right-click security operations menu.
   - `change`: Real-time scan mode dropdown selector updates.

