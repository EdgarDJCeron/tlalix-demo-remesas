<p align="center">
 
<img width="1920" height="1080" alt="Red and White Corporate Fintech Presentation" src="https://github.com/user-attachments/assets/67da773e-9458-4e32-9fc7-f431c3c2b2e8" />

<h1 align="center">
<div align="center">

 <B>TLALIX</B>

</div>

</h1>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Scroll](https://img.shields.io/badge/Scroll-Sepolia-8B5CF6)](https://scroll.io/)

**Envía dinero a México en segundos, no en días. Paga centavos, no decenas de dólares.**

[Demo en Vivo](https://tlalix.vercel.app/) • [Documentación](#-documentación) • [Contratos](#-contratos-desplegados) 

</div>

<img width="1350" height="608" alt="tlalix-page" src="https://github.com/user-attachments/assets/1e4bee54-b287-4e97-8e84-dd49d268e40d" />

---

## 🎯 ¿Qué es Tlalix?

Tlalix es una plataforma descentralizada que revoluciona el envío de remesas eliminando intermediarios bancarios tradicionales. Utiliza **stablecoins (USDC)** y **blockchain (Scroll)** para ofrecer transferencias instantáneas, transparentes y de bajo costo entre USA y México.

### 💡 Problema que Resuelve

| Método Tradicional | Tlalix |
|-------------------|--------|
| 💸 Comisiones 10-15% ($50-75) | ⚡ 1.5% ($7.50) |
| ⏱️ 3-5 días hábiles | 🚀 30 segundos |
| 🏢 Horario de oficina | 🌐 24/7/365 |
| 📋 Papeleo extenso | 📱 3 clicks |
| ❓ Sin trazabilidad | 🔍 100% transparente |

### 🌟 Características Principales

- ✅ **Transferencias Instantáneas**: Envía dinero en segundos usando USDC
- ✅ **Bajo Costo**: Solo 1.5% de comisión (vs 10-15% tradicional)
- ✅ **100% Transparente**: Todas las transacciones en blockchain
- ✅ **Sin Bancos**: No necesitas cuenta bancaria
- ✅ **Alias Únicos**: Sistema @usuario como redes sociales
- ✅ **Multi-Wallet**: MetaMask, Rabby, Coinbase, WalletConnect
- ✅ **Retiro en Efectivo**: Red de puntos físicos en México
- ✅ **QR Codes**: Comparte fácilmente con código QR
- ✅ **Bilingüe**: Español e Inglés

---

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+ y npm
- Wallet Web3 (MetaMask, Rabby, Coinbase)
- ETH en Scroll Sepolia para gas

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/EdgarDJCeron/tlalix-demo-remesas.git
cd tlalix-demo-remesas

# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### Configuración de Wallet

1. **Instalar una wallet**: [MetaMask](https://metamask.io) o [Rabby](https://rabby.io)

2. **Agregar Scroll Sepolia**:
   - Network: Scroll Sepolia
   - RPC: `https://sepolia-rpc.scroll.io`
   - Chain ID: `534351`
   - Currency: ETH
   - Explorer: `https://sepolia.scrollscan.com`

3. **Obtener ETH de prueba**: [Scroll Faucet](https://sepolia.scroll.io/faucet)

4. **Obtener USDC de prueba**: Usa el botón "Get 1000 USDC" en la app

### Primeros Pasos

1. 🔌 Conecta tu wallet
2. 👤 Registra tu alias (ej: `@edgar`)
3. 💰 Obtén USDC de prueba con el faucet
4. 📤 Envía una remesa a `@mama` o cualquier dirección
5. 🔗 Comparte el código o link con el destinatario
6. ✅ El destinatario reclama el dinero

---

## 📚 Documentación

### 🏗️ Arquitectura

```
┌─────────────┐
│   Frontend  │ (React + Vite + TypeScript)
│   Web3 UI   │
└──────┬──────┘
       │
       │ wagmi + viem + RainbowKit
       │
┌──────▼──────┐
│  Wallets    │ (MetaMask, Rabby, Coinbase)
│  (Usuarios) │
└──────┬──────┘
       │
       │ JSON-RPC
       │
┌──────▼──────────────┐
│   Scroll Sepolia    │
│   (L2 Blockchain)   │
└──────┬──────────────┘
       │
       │
┌──────▼──────────────┐
│  Smart Contracts    │
│  - Tlalix.sol       │
│  - MockUSDC.sol     │
└─────────────────────┘
```

### 📁 Estructura del Proyecto

```
tlalix-demo-remesas/
├── contracts/                    # Smart Contracts Solidity
│   ├── Tlalix.sol               # Contrato principal de remesas
│   ├── TlalixV2.sol             # Con Chainlink Oracle (próximamente)
│   └── MockUSDC.sol             # USDC de prueba
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Navbar.tsx           # Navegación principal
│   │   ├── Footer.tsx           # Pie de página
│   │   ├── WalletStatus.tsx     # Estado de conexión
│   │   ├── AliasDisplay.tsx     # Badge de alias
│   │   └── LeafletMap.tsx       # Mapa de puntos de retiro
│   │
│   ├── pages/                   # Páginas principales
│   │   ├── Home.tsx             # Landing page
│   │   ├── Enviar.tsx           # Enviar remesas
│   │   ├── Recibir.tsx          # Recibir remesas
│   │   ├── Historial.tsx        # Historial de transacciones
│   │   ├── Retiro.tsx           # Puntos de retiro
│   │   ├── Empresas.tsx         # Para empresas (coming soon)
│   │   ├── ComoFunciona.tsx     # Cómo funciona
│   │   └── Comercio.tsx         # Panel de comercios
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useTlalix.ts         # Interacción con contrato Tlalix
│   │   ├── useUSDC.ts           # Interacción con USDC
│   │   └── useENS.ts            # Resolución de nombres ENS
│   │
│   ├── config/                  # Configuración
│   │   ├── wagmi.ts             # Configuración de wagmi
│   │   └── contracts.ts         # Direcciones y ABIs
│   │
│   ├── contexts/                # React Contexts
│   │   ├── LanguageContext.tsx  # i18n ES/EN
│   │   └── ThemeContext.tsx     # Dark/Light theme
│   │
│   ├── lib/                     # Utilidades
│   │   ├── utils.ts             # Helpers generales
│   │   ├── format.ts            # Formateo de datos
│   │   └── i18n.ts              # Traducciones
│   │
│   └── mocks/                   # Datos de prueba
│       ├── cashout.ts           # Puntos de retiro
│       ├── history.ts           # Historial mock
│       └── rates.ts             # Tipos de cambio
│
├── public/                      # Assets estáticos
├── vercel.json                  # Config de deploy
└── package.json                 # Dependencias
```

### 🎨 Tech Stack

**Frontend:**
- ⚛️ React 18.3.1
- 📘 TypeScript 5.8.3
- ⚡ Vite 5.4.19
- 🎨 Tailwind CSS 3.4.17
- 🧩 shadcn/ui (Radix UI)
- 🗺️ Leaflet (Mapas interactivos)

**Web3:**
- 🔗 wagmi 2.19.2 (React hooks para Ethereum)
- 💎 viem 2.38.6 (Cliente Ethereum)
- 🌈 RainbowKit 2.2.9 (UI de wallets)
- 📊 TanStack Query 5.83.0

**Blockchain:**
- ⛓️ Scroll Sepolia (L2 Testnet)
- 📜 Solidity 0.8.20
- 🛡️ OpenZeppelin Contracts 5.0.0
- 🔮 Chainlink (próximamente)

---

## 📝 Contratos Desplegados

### Scroll Sepolia Testnet

| Contrato | Dirección | Descripción |
|----------|-----------|-------------|
| **Tlalix** | [`0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba`](https://sepolia.scrollscan.com/address/0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba) | Contrato principal de remesas |
| **MockUSDC** | [`0xa738389eae5876a054e418e9f0b4bf0de01dad75`](https://sepolia.scrollscan.com/address/0xa738389eae5876a054e418e9f0b4bf0de01dad75) | USDC de prueba (faucet incluido) |

### Funciones Principales del Contrato

```solidity
// Registrar alias (@usuario)
function registerAlias(string memory alias) external

// Crear remesa
function createRemittance(
    address recipient,
    uint256 amountUSD,
    uint256 amountMXN
) external returns (string memory code)

// Reclamar remesa
function claimRemittance(string memory code) external

// Obtener remesa por código
function getRemittanceByCode(string memory code) 
    external view returns (Remittance memory)

// Obtener historial
function getRemittancesByUser(address user, bool asSender)
    external view returns (uint256[] memory)
```

---

## 🎯 Funcionalidades

### 📤 Enviar Remesas

1. **Conectar Wallet**: Múltiples opciones (MetaMask, Rabby, Coinbase, WalletConnect)
2. **Ver Balance**: USDC en tiempo real con faucet integrado
3. **Buscar Destinatario**: Por alias `@mama`
4. **Ingresar Monto**: Cálculo automático USD → MXN (17.50 MXN/USD)
5. **Aprobar USDC**: Primera transacción 
6. **Enviar**: Segunda transacción crea la remesa
7. **Compartir**: Código único + QR + Link directo

**Características:**
- ✅ Validación de balance en tiempo real
- ✅ Generación automática de código único (6 caracteres)
- ✅ Display de comisión (1.5%)
- ✅ QR code para compartir
- ✅ Link directo: `tlalix.app/recibir?code=ABC123`
- ✅ Búsqueda inteligente (alias)

### 📥 Recibir Remesas

1. **Buscar por Código**: Ingresa el código de 6 caracteres
2. **Escanear QR**: Usa la cámara de tu teléfono
3. **Link Directo**: Clic en el link compartido
4. **Validar**: Verifica que sea para tu wallet
5. **Reclamar**: Una transacción para recibir los USDC

**Características:**
- ✅ Validación automática de destinatario
- ✅ Display de monto en USD y MXN
- ✅ Fecha y hora de creación
- ✅ Indicador visual de wallet correcta (✓/⚠️)
- ✅ Solo el destinatario puede reclamar
- ✅ Resolución automática de ENS names

### 📊 Historial

- ✅ Vista completa de transacciones (enviadas y recibidas)
- ✅ Estados: Pending, Claimed, Expired
- ✅ Detalles: Monto, fecha, código, direcciones
- ✅ Click para ver detalles completos
- ✅ Responsive (tabla en desktop, cards en mobile)
- ✅ Ordenado por fecha (más reciente primero)

### 🗺️ Puntos de Retiro

- ✅ Mapa interactivo con Leaflet
- ✅ 5 puntos demo (CDMX, Monterrey, Veracruz)
- ✅ Click en marcadores para ver información
- ✅ Dirección, horario y comisión
- ✅ Cards con información detallada

### 👤 Sistema de Identidad

**Alias Tlalix:**
- Registro on-chain único por wallet
- Formato: `@usuario` (3-20 caracteres)
- Gratis (solo gas fee)
- Búsqueda rápida: `@mama` en lugar de `0x1234...`

---


**Antes:**
- ⏱️ Mínimo 24 horas (si pagas express)
- 💸 $100+ en comisiones express
- 😰 Estrés y ansiedad

**Con Tlalix:**
- 🚀 30 segundos
- 💸 $15 de comisión
- 😌 Paz mental
- 💡 **Cuando cada segundo cuenta**

---

## 🔗 Links Útiles

- 🌐 [Demo en Vivo](https://tlalix.vercel.app/)
- 📘 [Documentación de Wagmi](https://wagmi.sh)
- 🌈 [RainbowKit Docs](https://rainbowkit.com)
- 📜 [Scroll Docs](https://docs.scroll.io)
- 🔗 [Chainlink Docs](https://docs.chain.link)
- 💧 [Scroll Sepolia Faucet](https://sepolia.scroll.io/faucet)
- 🔍 [Scroll Block Explorer](https://sepolia.scrollscan.com)

---


## 👊 Nuestro equipo

|    Nombre                                           |         Rol                             |   Correo Electronico
|-----------------------------------------------------|-----------------------------------------|-------------------------------------------
| Edgar Ceron                                         |  Developer                              | edgar200454@gmail.com
| Emmanuel Velásquez Gerón                            |  Developer                              | velasquezemmanuel87@gmail.com
| Sandra Erika Sanchez Fragozo                        | Diseñadora UX/UI                        |sandrafragozo24@gmail.com
| Jhoana Isabel Ruelas Hernández                      | Project manager                         | Jhoana.jirh@gmail.com
| Alejandro Xochicale Ayala                           | mMarketing y estrategia de crecimiento  | xochicale832@gmail.com
-----------

<p align="center">
  <b>“Sigo contigo, aunque no esté ahí.”</b><br>
---

<div align="center">

**Construido con ❤️ para la comunidad Web3**

🌎 → 🇲🇽

[⬆ Volver arriba](#-tlalix---plataforma-de-remesas-web3)

</div>
