# 🚀 Guía Rápida: Conexión de Wallet

## ✅ ¿Qué se implementó?

### 1. **Botón de Wallet en Navbar**
- ✅ Reemplazó el botón "Probar Demo"
- ✅ Muestra "Conectar Wallet" cuando no hay conexión
- ✅ Muestra dirección abreviada cuando está conectado
- ✅ Dropdown con opciones al hacer click

### 2. **Integración Web3**
- ✅ **wagmi** - Hooks para React
- ✅ **viem** - Cliente Ethereum
- ✅ **RainbowKit** - UI para seleccionar wallets

### 3. **Redes Configuradas**
- 🟣 **Scroll Sepolia** (Testnet)
- 🟣 **Scroll Mainnet**

### 4. **Wallets Soportadas**
- 🦊 MetaMask
- 🌈 Rainbow
- 💰 Coinbase Wallet
- 🔷 WalletConnect (mobile)
- Trust Wallet, Ledger, Trezor, etc.

---

## 🔧 Configuración Requerida

### Paso 1: Obtener WalletConnect Project ID

1. Ve a: https://cloud.walletconnect.com
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia el **Project ID**

### Paso 2: Configurar Variable de Entorno

Edita el archivo `.env` en la raíz del proyecto:

```bash
VITE_WALLETCONNECT_PROJECT_ID=tu_project_id_aquí
```

---

## 🎮 Cómo Usar

### Conectar Wallet

1. Click en **"Conectar Wallet"** en el navbar
2. Selecciona tu wallet (ej: MetaMask)
3. Aprueba la conexión
4. ¡Listo! Verás tu dirección en formato: `0x1234...5678`

### Funciones del Dropdown

- **Ver dirección completa** - Click en el menú desplegable
- **Desconectar** - Opción en el menú

### En la Página de Envío

- ✅ Verás un **card verde** si estás conectado
  - Muestra tu dirección
  - Muestra la red actual
  - Muestra tu balance
  
- ⚠️ Verás un **card amarillo** si NO estás conectado
  - Te recuerda conectar tu wallet

---

## 🌐 Obtener ETH de Prueba

### Scroll Sepolia Faucet

1. Ve a: https://sepolia.scroll.io/faucet
2. Conecta tu wallet
3. Solicita ETH de prueba
4. Espera ~1 minuto

### Agregar Red Manualmente (si es necesario)

Si tu wallet no reconoce Scroll Sepolia:

```
Network Name: Scroll Sepolia
RPC URL: https://sepolia-rpc.scroll.io
Chain ID: 534351
Currency Symbol: ETH
Block Explorer: https://sepolia.scrollscan.com
```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
- ✅ `src/config/wagmi.ts` - Configuración Web3
- ✅ `src/components/WalletButton.tsx` - Botón de wallet
- ✅ `src/components/WalletStatus.tsx` - Estado de conexión
- ✅ `WALLET_SETUP.md` - Documentación detallada
- ✅ `.env.example` - Template de variables

### Archivos Modificados
- ✅ `src/App.tsx` - Providers de Web3
- ✅ `src/components/Navbar.tsx` - Integración del botón
- ✅ `src/pages/Enviar.tsx` - Indicador de estado

---

## 🔍 Testing

### 1. Sin Wallet Conectada
```bash
npm run dev
```
- Verás "Conectar Wallet" en navbar
- En `/enviar` verás alerta amarilla

### 2. Con MetaMask Instalado
- Click en "Conectar Wallet"
- Selecciona MetaMask
- Aprueba conexión
- Verás tu dirección en navbar
- En `/enviar` verás card verde con info

### 3. Cambiar de Red
- En MetaMask, cambia a Scroll Sepolia
- La app detectará automáticamente el cambio

---

## 🐛 Troubleshooting

### "Project ID not configured"
**Solución:** Configura el `.env` con tu WalletConnect Project ID

### No aparece MetaMask
**Solución:** 
- Instala la extensión de MetaMask
- Refresca la página
- Usa otro navegador

### "Wrong Network"
**Solución:**
- Cambia a Scroll Sepolia en tu wallet
- O agrega la red manualmente

### Error al compilar
**Solución:**
```bash
npm install --legacy-peer-deps
npm run dev
```

---

## 🎯 Próximos Pasos

### Fase 2: Smart Contracts
- [ ] Crear contrato de remesas
- [ ] Deploy en Scroll Sepolia
- [ ] Integrar con UI

### Fase 3: Transacciones Reales
- [ ] Enviar USDC real
- [ ] Verificar transacciones
- [ ] Mostrar hash en blockchain

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `WALLET_SETUP.md` para más detalles
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de tener ETH de prueba

---

¡Ahora tienes conexión de wallet funcional! 🎉
