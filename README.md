# 🔐 Password Generator

A modern, secure web application for generating cryptographically strong passwords with both **random** and **deterministic** generation modes.

[Use for Free Here](https://tranquilsoftware.github.io/password-generator/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)

## ✨ Features

- 🎲 **Random Generation** - Cryptographically secure random secrets using Web Crypto API
- 🔄 **Deterministic Generation** - Reproducible secrets using HMAC-SHA256
- 💪 **Real-time Strength Meter** - Visual feedback on password security
- 📋 **One-click Copy** - Instant clipboard integration
- 👁️ **Show/Hide Toggle** - Protect sensitive data on screen
- 📦 **Bulk Generation** - Export multiple secrets to CSV
- 🎨 **Modern Dark UI** - Beautiful gradient design with Tailwind CSS v4
- ♿ **Accessible** - Full keyboard navigation and ARIA labels
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/password-generator.git
cd password-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Dependencies

```bash
# Core dependencies
npm install react react-dom lucide-react

# Dev dependencies
npm install -D @types/react @types/react-dom typescript vite @vitejs/plugin-react

# Tailwind CSS v4
npm install -D tailwindcss@next @tailwindcss/vite@next

# Testing (optional)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 🎯 Usage

### Random Mode (Default)

1. Adjust character length (16-128 chars)
2. Select character types (uppercase, lowercase, numbers, symbols)
3. Secret generates automatically
4. Click copy button to use

### Deterministic Mode

1. Toggle to "Deterministic" mode
2. Enter a **Master Input** (seed/passphrase)
3. Enter a **Custom Salt**
4. Secret generates deterministically
5. Same inputs = same output every time

> ⚠️ **Security Warning**: Deterministic mode is only as secure as your master input and salt. Keep them secret!

### Bulk Generation

1. Enter desired count (1-1000)
2. Click "Generate Multiple"
3. Downloads CSV with all secrets

## 🏗️ Project Structure

```
password-generator/
├── src/
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── tailwind.config.js         # Tailwind config
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- ✅ Deterministic generation (same inputs → same outputs)
- ✅ Character set mapping
- ✅ Copy button functionality
- ✅ Show/hide toggle
- ✅ Strength meter calculations
- ✅ Accessibility features

## 🔒 Security Features

### Random Generation
- Uses `crypto.getRandomValues()` (CSPRNG)
- No predictable patterns
- High entropy output

### Deterministic Generation
- HMAC-SHA256 with 10,000 iterations
- Canonical JSON input serialization
- Deterministic byte-to-alphabet mapping
- Same inputs produce identical outputs

### Best Practices
- ✅ Secrets never logged to console in production
- ✅ No localStorage/sessionStorage usage
- ✅ All state kept in memory during session
- ✅ HTTPS recommended for deployment
- ✅ Environment variable storage recommended

## ⚙️ Configuration

### Character Sets

- **Uppercase**: A-Z (excluding I, O if ambiguous disabled)
- **Lowercase**: a-z (excluding i, l, o if ambiguous disabled)
- **Numbers**: 0-9 (excluding 0, 1 if ambiguous disabled)
- **Symbols**: !@#$%^&*-_=+

### Environment Variables

No environment variables required for client-only deployment!

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
```

## 🤝 Contributing

Contributions are welcome!

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**Made with ❤️ by [Tranquil Software](https://tranquilsoftware.com.au)**
