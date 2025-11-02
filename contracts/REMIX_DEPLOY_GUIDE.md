# 🚀 Guía: Deploy de Tlalix en Remix IDE

## 📋 Paso 1: Preparar Remix

1. Ve a **https://remix.ethereum.org**
2. En la carpeta `contracts/`, crea un archivo: `Tlalix.sol`
3. Copia y pega el contenido completo del archivo `Tlalix.sol`

---

## 🔧 Paso 2: Compilar el Contrato

### En Remix:

1. **Solidity Compiler** (ícono izquierdo)
2. Configuración:
   - Compiler: `0.8.20` o superior
   - EVM Version: `paris` o `default`
   - ✅ Enable optimization (200 runs)
3. Click en **"Compile Tlalix.sol"**
4. ✅ Verifica que no haya errores (warnings son OK)

---

## 🌐 Paso 3: Preparar la Red (Scroll Sepolia)

### Agregar Scroll Sepolia a MetaMask:

```
Network Name: Scroll Sepolia
RPC URL: https://sepolia-rpc.scroll.io
Chain ID: 534351
Currency Symbol: ETH
Block Explorer: https://sepolia.scrollscan.com
```

### Obtener ETH de Prueba:

1. Ve a: **https://sepolia.scroll.io/faucet**
2. Conecta tu wallet
3. Solicita ETH de prueba
4. Espera ~1 minuto

---

## 💰 Paso 4: Obtener Dirección de USDC (Testnet)

### Opciones de USDC en Scroll Sepolia:

**Opción A: Mock USDC (Más fácil)**
Primero deployaremos un token USDC de prueba.

**Opción B: USDC Real de Testnet**
Dirección oficial (si existe): `0x...` (verificar en Scroll docs)

### Deploy de Mock USDC:

Crea un nuevo archivo `MockUSDC.sol` en Remix:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1 millón USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

1. Compila `MockUSDC.sol`
2. Deploy en Scroll Sepolia
3. **Guarda la dirección del contrato** 📝

---

## 🚀 Paso 5: Deploy de Tlalix

### En Remix (pestaña Deploy):

1. **Environment**: "Injected Provider - MetaMask"
2. **Account**: Verifica tu dirección
3. **Network**: Confirma que sea Scroll Sepolia
4. **Contract**: Selecciona `Tlalix`
5. **Constructor Parameter**:
   ```
   _USDCTOKEN: [dirección del MockUSDC que deployaste]
   ```
6. Click **"Deploy"**
7. Confirma la transacción en MetaMask
8. ⏳ Espera confirmación (~10 segundos)

### ✅ Verificar Deploy:

En Remix, verás el contrato desplegado en "Deployed Contracts"

**Guarda esta información:**
```
Tlalix Address: 0x...
MockUSDC Address: 0x...
Deployer (Owner): 0x...
Network: Scroll Sepolia (534351)
Block: #...
```

---

## 🧪 Paso 6: Probar el Contrato

### Test 1: Registrar Alias

En Remix, expande el contrato desplegado:

```javascript
registerAlias("juan")
```

Click **Transact** → Confirma en MetaMask

### Test 2: Aprobar USDC

Necesitas aprobar que Tlalix use tus USDC:

1. Ve al contrato **MockUSDC** desplegado
2. Llama a `approve`:
   ```
   spender: [dirección de Tlalix]
   amount: 1000000000  // 1,000 USDC (6 decimales)
   ```

### Test 3: Crear Remesa

```javascript
createRemittance(
  _amountUSD: 100000000,        // 100 USDC (con 6 decimales)
  _recipientAlias: "mama",      // Alias del destinatario
  _code: "ABC123"               // Código único
)
```

### Test 4: Consultar Remesa

Usa las funciones de **view** (no cuestan gas):

```javascript
getRemittance("ABC123")
```

Verás toda la info de la remesa.

---

## 📊 Paso 7: Funciones Importantes

### Para Usuarios:

| Función | Descripción | Gas ⛽ |
|---------|-------------|-------|
| `registerAlias(string)` | Registrar alias | ~50k |
| `createRemittance(...)` | Enviar remesa | ~150k |
| `cancelRemittance(string)` | Cancelar envío | ~80k |
| `getUserRemittances(address)` | Ver historial | Free |
| `calculateReceiveAmount(uint)` | Calcular monto | Free |

### Para Comercios:

| Función | Descripción | Gas ⛽ |
|---------|-------------|-------|
| `registerCashoutPoint(...)` | Registrarse | ~100k |
| `claimRemittance(string)` | Cobrar remesa | ~120k |
| `withdrawCashoutBalance()` | Retirar ganancias | ~80k |

### Para Admin (Owner):

| Función | Descripción |
|---------|-------------|
| `updateExchangeRate(uint)` | Cambiar USD/MXN |
| `updatePlatformFee(uint)` | Cambiar comisión |
| `verifyUser(address)` | Verificar usuario |
| `verifyCashoutPoint(address)` | Verificar comercio |
| `withdrawPlatformFees(address)` | Retirar fees |
| `togglePause()` | Pausar/activar |

---

## 🔍 Paso 8: Verificar en Scrollscan

1. Ve a: **https://sepolia.scrollscan.com**
2. Busca la dirección de tu contrato
3. Podrás ver:
   - Transacciones
   - Balance
   - Código del contrato
   - Eventos emitidos

### Verificar Código (Opcional):

En Scrollscan:
1. "Contract" tab → "Verify & Publish"
2. Compiler: `0.8.20`
3. Optimization: Yes (200 runs)
4. Copia todo el código aplanado
5. Submit

---

## 💡 Paso 9: Integrar con la App

### Actualizar `src/config/contracts.ts`:

```typescript
export const contracts = {
  tlalix: {
    address: '0x...' as const,  // Tu dirección deployada
    abi: [...],  // Copiar de Remix
  },
  mockUSDC: {
    address: '0x...' as const,
    abi: [...],
  },
} as const;

export const SCROLL_SEPOLIA_CHAIN_ID = 534351;
```

### Copiar ABI desde Remix:

1. En Remix, sección "Solidity Compiler"
2. Abajo de "Compile", click en **"ABI"**
3. Copia el JSON completo
4. Pégalo en tu archivo de configuración

---

## 🎯 Valores Iniciales del Contrato

Al deployar, el contrato tiene:

```javascript
exchangeRate = 1750          // 17.50 MXN/USD
platformFeePct = 150         // 1.5%
expirationTime = 30 days     // 30 días
```

Puedes cambiarlos llamando a las funciones de admin.

---

## 🐛 Troubleshooting

### "Insufficient funds"
**Solución:** Necesitas más ETH de prueba del faucet

### "Transfer amount exceeds allowance"
**Solución:** Debes llamar `approve()` en USDC primero

### "Code already exists"
**Solución:** Usa un código diferente (deben ser únicos)

### "Not a valid cashout point"
**Solución:** El comercio debe registrarse primero con `registerCashoutPoint()`

---

## ✅ Checklist Final

- [ ] Scroll Sepolia agregado a MetaMask
- [ ] ETH de prueba obtenido
- [ ] MockUSDC compilado y deployado
- [ ] Tlalix compilado y deployado
- [ ] Alias registrado exitosamente
- [ ] USDC aprobado para Tlalix
- [ ] Primera remesa creada
- [ ] Dirección del contrato guardada
- [ ] ABI copiado para la app

---

## 📞 Direcciones Importantes

**Scroll Sepolia:**
- RPC: https://sepolia-rpc.scroll.io
- Faucet: https://sepolia.scroll.io/faucet
- Explorer: https://sepolia.scrollscan.com
- Chain ID: 534351

**Scroll Mainnet (Producción):**
- RPC: https://rpc.scroll.io
- Explorer: https://scrollscan.com
- Chain ID: 534352
- USDC Real: 0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4

---

¡Listo! Ahora tienes tu contrato deployado en Scroll Sepolia 🎉

**Siguiente paso:** Integrar con la UI de React
