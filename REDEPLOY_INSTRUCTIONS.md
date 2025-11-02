# Instrucciones para Redesplegar Tlalix

## ⚠️ Problema Identificado

El contrato actual requiere que quien reclame sea un "cashout point" registrado. Necesitamos agregar la función `claimRemittanceByRecipient()` que permite al destinatario reclamar directamente.

## ✅ Cambios Realizados

1. **contracts/Tlalix.sol**: Agregada función `claimRemittanceByRecipient()`
2. **src/hooks/useTlalix.ts**: Actualizado para usar la nueva función
3. Contrato corregido también con el cálculo MXN correcto (`/10000` en lugar de `/100`)

## 🚀 Pasos para Redesplegar

### 1. Compilar el Contrato
```bash
# En Remix IDE (https://remix.ethereum.org/)
1. Pegar el contenido de contracts/Tlalix.sol
2. Compiler > Compile Tlalix.sol
3. Verificar que no haya errores
```

### 2. Deploy en Scroll Sepolia

```
1. Deploy & Run Transactions
2. Environment: "Injected Provider - MetaMask"
3. Network: Scroll Sepolia Testnet
4. Constructor Parameters:
   - _usdcToken: 0xa738389eae5876a054e418e9f0b4bf0de01dad75
5. Click "Deploy"
6. Confirmar en MetaMask
7. Copiar la nueva contract address
```

### 3. Actualizar Frontend

**Archivo: src/config/contracts.ts**
```typescript
export const CONTRACTS = {
  scrollSepolia: {
    tlalix: '0xNUEVA_ADDRESS_AQUI', // ← Actualizar con la nueva address
    mockUSDC: '0xa738389eae5876a054e418e9f0b4bf0de01dad75',
  }
}
```

**Archivo: src/config/abis.ts**
```typescript
// Copiar el nuevo ABI desde Remix:
// Compiler > Compilation Details > ABI > Copy
// Reemplazar todo el array TLALIX_ABI
```

### 4. Verificar Funciones Nuevas

El nuevo contrato debe tener:
- ✅ `claimRemittanceByRecipient(string _code)` - Nueva función
- ✅ `calculateReceiveAmount()` con división correcta `/10000`
- ✅ `createRemittance()` con división correcta `/10000`

## 🧪 Testing

Después del deploy:
```
1. Registrar alias desde la UI
2. Enviar remesa de $100 USD
3. Verificar que muestre $1,723.75 MXN
4. Reclamar con el destinatario
5. Verificar que funcione en MetaMask
```

## 📋 Checklist

- [ ] Contrato compilado sin errores
- [ ] Desplegado en Scroll Sepolia
- [ ] Address actualizada en contracts.ts
- [ ] ABI actualizado en abis.ts
- [ ] Función `claimRemittanceByRecipient` existe
- [ ] Tested: Enviar remesa
- [ ] Tested: Reclamar remesa
- [ ] Verified: Montos MXN correctos

## ⚡ Alternativa Rápida (Para Demo)

Si necesitas demostrar AHORA sin redesplegar:

1. Registrar wallet como cashout point en el contrato actual
2. Usar función `registerCashoutPoint(name, location, feePct)`
3. Claim funcionará con la función actual

Pero esto no es ideal porque cualquier usuario necesitaría registrarse como comercio primero.
