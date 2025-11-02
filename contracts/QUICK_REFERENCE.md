# ⚡ Quick Reference - Tlalix

## 🎯 Deploy en 5 minutos

### 1️⃣ Remix IDE
```
https://remix.ethereum.org
```

### 2️⃣ Conectar MetaMask
- Network: Scroll Sepolia (534351)
- ETH: https://sepolia.scroll.io/faucet

### 3️⃣ Deploy MockUSDC
```solidity
// Archivo: MockUSDC.sol
Deploy → Sin parámetros
→ Dirección: 0x...
```

### 4️⃣ Deploy Tlalix
```solidity
// Archivo: Tlalix.sol  
Deploy → _usdcToken: [dirección MockUSDC]
→ Dirección: 0x...
```

### 5️⃣ Testing
```javascript
// En MockUSDC
faucet() // +1000 USDC
approve(tlalixAddress, 1000000000)

// En Tlalix
registerAlias("juan")
createRemittance(100000000, "mama", "ABC123")
```

---

## 📞 Funciones Principales

### 👤 Usuario

```javascript
// Registrarse
registerAlias("miNombre")

// Enviar remesa (100 USDC)
createRemittance(
  100000000,      // 100 USDC (6 decimals)
  "destinatario", // alias
  "ABC123"        // código único
)

// Cancelar
cancelRemittance("ABC123")

// Ver historial
getUserRemittances(myAddress)
```

### 🏪 Comercio

```javascript
// Registrarse
registerCashoutPoint(
  "OXXO Centro",  // nombre
  "CDMX",         // ubicación  
  50              // 0.5% comisión
)

// Cobrar remesa
claimRemittance("ABC123")

// Retirar ganancias
withdrawCashoutBalance()
```

### 👨‍💼 Admin

```javascript
// Tipo de cambio (17.50 MXN/USD)
updateExchangeRate(1750)

// Comisión (1.5%)
updatePlatformFee(150)

// Verificar
verifyUser(userAddress)
verifyCashoutPoint(commerceAddress)

// Retirar fees
withdrawPlatformFees(myAddress)
```

---

## 💡 Valores por Defecto

| Config | Valor | Notas |
|--------|-------|-------|
| Tipo cambio | 17.50 MXN/USD | Actualizar manualmente |
| Comisión plataforma | 1.5% | Máximo 5% |
| Expiración | 30 días | Después se puede cancelar |
| Decimales USDC | 6 | No 18! |

---

## 🧮 Conversiones

### USDC → Wei (6 decimales)
```javascript
100 USDC = 100000000 (100 * 10^6)
1 USDC = 1000000
0.01 USDC = 10000
```

### Comisiones (Basis Points)
```javascript
1.5% = 150 bp
0.5% = 50 bp
5% = 500 bp
10% = 1000 bp
```

---

## 🔍 Ver Datos (No cuesta gas)

```javascript
// Remesa
getRemittance("ABC123")

// Usuario
userProfiles(address)
getUserByAlias("juan")

// Comercio
cashoutPoints(address)
getAllCashoutPoints()

// Calcular
calculateReceiveAmount(100000000)

// Stats
getStats()
```

---

## ⚠️ Errores Comunes

| Error | Solución |
|-------|----------|
| Transfer failed | Llamar `approve()` primero en USDC |
| Code already exists | Usar código diferente |
| Not a valid cashout point | Registrarse con `registerCashoutPoint()` |
| Alias already taken | Elegir otro alias |
| Insufficient funds | Obtener ETH del faucet |

---

## 📋 Checklist Post-Deploy

- [ ] MockUSDC deployado ✅
- [ ] Tlalix deployado ✅
- [ ] Dirección guardada en `contracts.ts` ✅
- [ ] ABI copiado ✅
- [ ] Alias registrado (test) ✅
- [ ] Primera remesa creada (test) ✅
- [ ] Contrato verificado en Scrollscan ✅

---

## 🔗 Links Útiles

- **Remix:** https://remix.ethereum.org
- **Faucet:** https://sepolia.scroll.io/faucet
- **Explorer:** https://sepolia.scrollscan.com
- **Docs Scroll:** https://docs.scroll.io

---

**Siguiente paso:** Integrar con la UI React 🎨
