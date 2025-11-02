# 📄 Smart Contracts de Tlalix

## 📁 Archivos

### `Tlalix.sol` - Contrato Principal
**Funcionalidades:**
- ✅ Envío de remesas con USDC
- ✅ Sistema de aliases (como ENS)
- ✅ Red de comercios para retiro en efectivo
- ✅ Cálculo automático de tipo de cambio
- ✅ Gestión de comisiones (1.5% plataforma + variable comercios)
- ✅ Códigos únicos de 6 caracteres
- ✅ Expiración de 30 días
- ✅ Cancelación antes de retirar
- ✅ Sistema de verificación KYC

### `MockUSDC.sol` - Token de Prueba
**Características:**
- Token ERC20 que simula USDC
- 6 decimales (como el USDC real)
- Función `faucet()` para obtener tokens gratis
- Solo para testnet

---

## 🚀 Deploy Rápido

### 1. Abre Remix IDE
https://remix.ethereum.org

### 2. Deploy MockUSDC
- Copia `MockUSDC.sol`
- Compila con Solidity 0.8.20
- Deploy en Scroll Sepolia
- Guarda la dirección 📝

### 3. Deploy Tlalix
- Copia `Tlalix.sol`
- Compila con Solidity 0.8.20
- Deploy con parámetro: dirección de MockUSDC
- Guarda la dirección 📝

### 4. Prueba
```javascript
// En MockUSDC
faucet() // Obtener 1000 USDC gratis

// Aprobar que Tlalix use tus USDC
approve(tlalixAddress, 1000000000)

// En Tlalix
registerAlias("juan")
createRemittance(100000000, "mama", "ABC123")
getRemittance("ABC123")
```

---

## 📖 Documentación Completa

Ver **`REMIX_DEPLOY_GUIDE.md`** para guía paso a paso detallada.

---

## 🔧 Estructura del Contrato

```
Tlalix
├── Remesas (Remittance)
│   ├── Crear remesa
│   ├── Reclamar remesa
│   ├── Cancelar remesa
│   └── Consultar remesa
│
├── Usuarios (UserProfile)
│   ├── Registrar alias
│   ├── Ver perfil
│   └── Verificar usuario (KYC)
│
├── Comercios (CashoutPoint)
│   ├── Registrarse como comercio
│   ├── Procesar retiros
│   ├── Retirar ganancias
│   └── Verificar comercio
│
└── Administración
    ├── Actualizar tipo de cambio
    ├── Actualizar comisiones
    ├── Retirar fees de plataforma
    └── Pausar/despausar
```

---

## 💰 Economía del Sistema

### Comisiones
- **Plataforma:** 1.5% (configurable, máx 5%)
- **Comercios:** 0.5% - 10% (cada comercio decide)

### Ejemplo de Transacción

```
Usuario envía: 100 USDC
- Comisión plataforma (1.5%): -1.50 USDC
- Monto neto: 98.50 USDC
- Tipo de cambio: 17.50 MXN/USD
= Destinatario recibe: 1,723.75 MXN

Al retirar en comercio (0.5% comisión):
- Comercio cobra: 0.49 USDC
- Usuario recibe: 98.01 USDC en efectivo
```

---

## 🔐 Seguridad

### Implementado
- ✅ ReentrancyGuard (evita ataques de reentrada)
- ✅ Pausable (pausa de emergencia)
- ✅ Ownable (control de admin)
- ✅ Checks-Effects-Interactions pattern
- ✅ Límites en comisiones
- ✅ Validaciones en todos los inputs

### Antes de Mainnet
- [ ] Auditoría profesional
- [ ] Testing extensivo
- [ ] Bug bounty program
- [ ] Multisig para admin
- [ ] Integración con Chainlink para USD/MXN real

---

## 📊 Eventos

Todos los eventos importantes quedan registrados:
- `RemittanceCreated` - Nueva remesa
- `RemittanceClaimed` - Remesa cobrada
- `UserRegistered` - Nuevo usuario
- `CashoutPointRegistered` - Nuevo comercio
- `ExchangeRateUpdated` - Cambio de tipo de cambio
- `FeesWithdrawn` - Retiro de comisiones

---

## 🌐 Direcciones de Red

### Scroll Sepolia (Testnet)
- RPC: https://sepolia-rpc.scroll.io
- Chain ID: 534351
- Explorer: https://sepolia.scrollscan.com
- Faucet: https://sepolia.scroll.io/faucet

### Scroll Mainnet
- RPC: https://rpc.scroll.io
- Chain ID: 534352
- Explorer: https://scrollscan.com
- USDC: 0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4

---

## ⚠️ Notas Importantes

1. **MockUSDC es solo para testing** - En producción usar USDC real
2. **Tipo de cambio es manual** - Integrar Chainlink Oracle en v2
3. **Códigos de 6 caracteres** - Debe ser único por remesa
4. **Expiración 30 días** - Después el sender puede recuperar fondos
5. **Aliases son permanentes** - No se pueden cambiar una vez registrados

---

## 🎯 Próximas Mejoras

- [ ] Integrar Chainlink Price Feed para USD/MXN automático
- [ ] Sistema de dispute/arbitraje
- [ ] Soporte multi-moneda (EUR, otros)
- [ ] NFT como recibo de remesa
- [ ] Programa de recompensas/cashback
- [ ] API para consultas offchain

---

Listo para deploy! 🚀
