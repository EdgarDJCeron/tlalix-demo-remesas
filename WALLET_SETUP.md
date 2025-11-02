# 🔐 Configuración de Web3 Wallet

## 📋 Pasos para configurar WalletConnect

### 1. Obtener Project ID de WalletConnect

1. Ve a [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia el **Project ID**

### 2. Actualizar configuración

Edita el archivo `src/config/wagmi.ts` y reemplaza:

```typescript
projectId: 'YOUR_WALLETCONNECT_PROJECT_ID'
```

Por tu Project ID real:

```typescript
projectId: 'abc123def456...'
```

### 3. Wallets soportadas

La aplicación soporta automáticamente:
- 🦊 **MetaMask**
- 🌈 **Rainbow**
- 💰 **Coinbase Wallet**
- 🔷 **WalletConnect** (cualquier wallet compatible)
- Y más...

### 4. Redes configuradas

- **Scroll Sepolia** (testnet) - Para desarrollo
- **Scroll Mainnet** - Para producción

### 5. Obtener ETH de prueba

Para probar en Scroll Sepolia:
1. Ve al [Scroll Sepolia Faucet](https://sepolia.scroll.io/faucet)
2. Conecta tu wallet
3. Solicita ETH de prueba

### 6. Añadir USDC de prueba

Para obtener USDC de prueba en Scroll Sepolia:
- Usa el contrato de USDC de prueba (se proporcionará después)
- O usa el [Aave Faucet](https://app.aave.com/faucet/)

## 🚀 Uso

Una vez configurado:

1. Click en "Conectar Wallet" en el navbar
2. Selecciona tu wallet favorita
3. Aprueba la conexión
4. ¡Listo! Tu dirección aparecerá en el navbar

## 🔧 Troubleshooting

### Error: "Project ID not found"
- Verifica que hayas actualizado `src/config/wagmi.ts`
- Asegúrate de que el Project ID sea válido

### No aparece mi wallet
- Asegúrate de tener la extensión instalada
- Intenta refrescar la página
- Usa WalletConnect para conectar desde mobile

### Error de red
- Verifica que tu wallet esté en Scroll Sepolia
- Añade la red manualmente si es necesario:
  - RPC: https://sepolia-rpc.scroll.io
  - Chain ID: 534351
  - Symbol: ETH
