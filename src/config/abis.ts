// ABIs de los contratos
// Copiar desde Remix: Solidity Compiler > Compilation Details > ABI

export const TLALIX_ABI = [
  // TODO: Copiar el ABI completo de Tlalix desde Remix
  // Por ahora, funciones básicas para empezar:
  {
    "inputs": [{"internalType": "address", "name": "_usdcToken", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_amountUSD", "type": "uint256"},
      {"internalType": "string", "name": "_recipientAlias", "type": "string"},
      {"internalType": "string", "name": "_code", "type": "string"}
    ],
    "name": "createRemittance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_alias", "type": "string"}],
    "name": "registerAlias",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_code", "type": "string"}],
    "name": "getRemittance",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "sender", "type": "address"},
          {"internalType": "address", "name": "recipient", "type": "address"},
          {"internalType": "uint256", "name": "amountUSD", "type": "uint256"},
          {"internalType": "uint256", "name": "amountMXN", "type": "uint256"},
          {"internalType": "uint256", "name": "fee", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "string", "name": "recipientAlias", "type": "string"},
          {"internalType": "string", "name": "code", "type": "string"},
          {"internalType": "enum Tlalix.RemittanceStatus", "name": "status", "type": "uint8"},
          {"internalType": "bool", "name": "isClaimed", "type": "bool"},
          {"internalType": "address", "name": "cashoutPoint", "type": "address"}
        ],
        "internalType": "struct Tlalix.Remittance",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchangeRate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const MOCK_USDC_ABI = [
  {
    "inputs": [],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "pure",
    "type": "function"
  }
] as const;
