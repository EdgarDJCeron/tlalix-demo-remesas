# 🎉 Contratos Deployados - Tlalix

## ✅ Información de Deploy

### Red: Scroll Sepolia Testnet
- **Chain ID:** 534351
- **RPC:** https://sepolia-rpc.scroll.io
- **Explorer:** https://sepolia.scrollscan.com

---

## 📍 Direcciones de Contratos

### MockUSDC (Token de Prueba)
```
0xa738389eae5876a054e418e9f0b4bf0de01dad75
```
**Ver en Explorer:**
https://sepolia.scrollscan.com/address/0xa738389eae5876a054e418e9f0b4bf0de01dad75

### Tlalix (Contrato Principal)
```
0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba
```
**Ver en Explorer:**
https://sepolia.scrollscan.com/address/0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba

---

## 🧪 Pruebas Rápidas en Remix

### 1. Obtener USDC de Prueba
```javascript
// En MockUSDC contract
faucet()
// Recibirás 1,000 USDC gratis
```

### 2. Aprobar que Tlalix use tus USDC
```javascript
// En MockUSDC contract
approve(
  "0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba",  // Tlalix address
  "1000000000"  // 1,000 USDC (6 decimales)
)
```

### 3. Registrar tu Alias
```javascript
// En Tlalix contract
registerAlias("tunombre")
```

### 4. Crear una Remesa
```javascript
// En Tlalix contract
createRemittance(
  "100000000",      // 100 USDC (6 decimales)
  "destinatario",   // Alias del destinatario
  "ABC123"          // Código único de 6 caracteres
)
```

### 5. Ver la Remesa
```javascript
// En Tlalix contract
getRemittance("ABC123")
```

---

## 🔧 Siguiente Paso: Integrar con la UI

Los contratos ya están configurados en:
- `src/config/contracts.ts` ✅
- `src/config/abis.ts` ✅ (ABIs básicos incluidos)

### Para completar la integración:

1. **Copiar ABI completo desde Remix:**
   - Ve a "Solidity Compiler" tab en Remix
   - Click en "Compilation Details" del contrato Tlalix
   - Copia el ABI completo
   - Reemplaza en `src/config/abis.ts`

2. **Crear hooks de React para usar los contratos:**
   - Hook para registrar alias
   - Hook para crear remesas
   - Hook para consultar remesas
   - Hook para aprobar USDC

3. **Actualizar la UI de envío:**
   - Conectar el formulario con el contrato
   - Mostrar transacciones reales
   - Ver confirmaciones en blockchain

---

## 📊 Estadísticas del Contrato

```javascript
// Ver estadísticas generales
getStats()
// Retorna: totalRemittances, totalVolume, platformBalance, exchangeRate, platformFeePct
```

---

## 🔐 Funciones de Admin (Owner)

Solo el deployer puede llamar estas funciones:

```javascript
// Actualizar tipo de cambio (17.50 MXN/USD)
updateExchangeRate(1750)

// Actualizar comisión (1.5%)
updatePlatformFee(150)

// Verificar usuario
verifyUser("0x...")

// Verificar comercio
verifyCashoutPoint("0x...")

// Retirar comisiones
withdrawPlatformFees("0x...")

// Pausar contrato
togglePause()
```

---

## 💡 Tips

- **USDC tiene 6 decimales**, no 18 como ETH
  - 1 USDC = 1000000 (1 millón)
  - 100 USDC = 100000000 (100 millones)

- **Códigos de remesa:** Deben ser únicos y de 6 caracteres

- **Comisiones en basis points:**
  - 150 bp = 1.5%
  - 50 bp = 0.5%
  - 1000 bp = 10%

---

## 🎯 Próximos Pasos

- [ ] Copiar ABI completo a `src/config/abis.ts`
- [ ] Crear hooks de React para los contratos
- [ ] Integrar con la UI de /enviar
- [ ] Probar flujo completo end-to-end
- [ ] Verificar contratos en Scrollscan (opcional)

---

¡Los contratos están vivos y listos para usar! 🚀
