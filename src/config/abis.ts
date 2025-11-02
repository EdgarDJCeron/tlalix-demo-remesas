// ABIs de los contratos
// Copiar desde Remix: Solidity Compiler > Compilation Details > ABI

export const TLALIX_ABI = [
  { inputs: [{ internalType: "address", name: "_usdcToken", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "ExpectedPause", type: "error" },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "OwnableInvalidOwner", type: "error" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "OwnableUnauthorizedAccount", type: "error" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "owner", type: "address" }, { indexed: false, internalType: "string", name: "name", type: "string" }, { indexed: false, internalType: "uint256", name: "feePct", type: "uint256" }], name: "CashoutPointRegistered", type: "event" },
  { anonymous: false, inputs: [{ indexed: false, internalType: "uint256", name: "oldRate", type: "uint256" }, { indexed: false, internalType: "uint256", name: "newRate", type: "uint256" }], name: "ExchangeRateUpdated", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "to", type: "address" }, { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }], name: "FeesWithdrawn", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "previousOwner", type: "address" }, { indexed: true, internalType: "address", name: "newOwner", type: "address" }], name: "OwnershipTransferred", type: "event" },
  { anonymous: false, inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }], name: "Paused", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "string", name: "code", type: "string" }, { indexed: true, internalType: "address", name: "recipient", type: "address" }, { indexed: true, internalType: "address", name: "cashoutPoint", type: "address" }, { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }], name: "RemittanceClaimed", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "string", name: "code", type: "string" }, { indexed: true, internalType: "address", name: "sender", type: "address" }, { indexed: true, internalType: "address", name: "recipient", type: "address" }, { indexed: false, internalType: "uint256", name: "amountUSD", type: "uint256" }, { indexed: false, internalType: "uint256", name: "amountMXN", type: "uint256" }, { indexed: false, internalType: "string", name: "recipientAlias", type: "string" }], name: "RemittanceCreated", type: "event" },
  { anonymous: false, inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }], name: "Unpaused", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "wallet", type: "address" }, { indexed: false, internalType: "string", name: "username", type: "string" }], name: "UserRegistered", type: "event" },
  { inputs: [{ internalType: "string", name: "", type: "string" }], name: "aliasToAddress", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "allCashoutPoints", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "allRemittanceCodes", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_amountUSD", type: "uint256" }], name: "calculateReceiveAmount", outputs: [{ internalType: "uint256", name: "netUSD", type: "uint256" }, { internalType: "uint256", name: "amountMXN", type: "uint256" }, { internalType: "uint256", name: "fee", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "string", name: "_code", type: "string" }], name: "cancelRemittance", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "cashoutPoints", outputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "string", name: "name", type: "string" }, { internalType: "string", name: "location", type: "string" }, { internalType: "uint256", name: "feePct", type: "uint256" }, { internalType: "uint256", name: "totalProcessed", type: "uint256" }, { internalType: "uint256", name: "balance", type: "uint256" }, { internalType: "bool", name: "isActive", type: "bool" }, { internalType: "bool", name: "isVerified", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "string", name: "_code", type: "string" }], name: "claimRemittance", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_amountUSD", type: "uint256" }, { internalType: "string", name: "_recipientAlias", type: "string" }, { internalType: "string", name: "_code", type: "string" }], name: "createRemittance", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "exchangeRate", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "expirationTime", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getAllCashoutPoints", outputs: [{ internalType: "address[]", name: "", type: "address[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "string", name: "_code", type: "string" }], name: "getRemittance", outputs: [{ components: [{ internalType: "address", name: "sender", type: "address" }, { internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amountUSD", type: "uint256" }, { internalType: "uint256", name: "amountMXN", type: "uint256" }, { internalType: "uint256", name: "fee", type: "uint256" }, { internalType: "uint256", name: "timestamp", type: "uint256" }, { internalType: "string", name: "recipientAlias", type: "string" }, { internalType: "string", name: "code", type: "string" }, { internalType: "enum Tlalix.RemittanceStatus", name: "status", type: "uint8" }, { internalType: "bool", name: "isClaimed", type: "bool" }, { internalType: "address", name: "cashoutPoint", type: "address" }], internalType: "struct Tlalix.Remittance", name: "", type: "tuple" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getStats", outputs: [{ internalType: "uint256", name: "_totalRemittances", type: "uint256" }, { internalType: "uint256", name: "_totalVolume", type: "uint256" }, { internalType: "uint256", name: "_platformBalance", type: "uint256" }, { internalType: "uint256", name: "_exchangeRate", type: "uint256" }, { internalType: "uint256", name: "_platformFeePct", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "string", name: "_alias", type: "string" }], name: "getUserByAlias", outputs: [{ components: [{ internalType: "string", name: "username", type: "string" }, { internalType: "address", name: "wallet", type: "address" }, { internalType: "uint256", name: "totalSent", type: "uint256" }, { internalType: "uint256", name: "totalReceived", type: "uint256" }, { internalType: "uint256", name: "remittanceCount", type: "uint256" }, { internalType: "bool", name: "isRegistered", type: "bool" }, { internalType: "bool", name: "isVerified", type: "bool" }], internalType: "struct Tlalix.UserProfile", name: "", type: "tuple" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "_user", type: "address" }], name: "getUserRemittances", outputs: [{ internalType: "string[]", name: "", type: "string[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "string", name: "_code", type: "string" }], name: "isCodeAvailable", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "paused", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "platformBalance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "platformFeePct", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "string", name: "_alias", type: "string" }], name: "registerAlias", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "string", name: "_name", type: "string" }, { internalType: "string", name: "_location", type: "string" }, { internalType: "uint256", name: "_feePct", type: "uint256" }], name: "registerCashoutPoint", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "string", name: "", type: "string" }], name: "remittances", outputs: [{ internalType: "address", name: "sender", type: "address" }, { internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amountUSD", type: "uint256" }, { internalType: "uint256", name: "amountMXN", type: "uint256" }, { internalType: "uint256", name: "fee", type: "uint256" }, { internalType: "uint256", name: "timestamp", type: "uint256" }, { internalType: "string", name: "recipientAlias", type: "string" }, { internalType: "string", name: "code", type: "string" }, { internalType: "enum Tlalix.RemittanceStatus", name: "status", type: "uint8" }, { internalType: "bool", name: "isClaimed", type: "bool" }, { internalType: "address", name: "cashoutPoint", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "togglePause", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "totalRemittances", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalVolume", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_newRate", type: "uint256" }], name: "updateExchangeRate", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_newFeePct", type: "uint256" }], name: "updatePlatformFee", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "usdcToken", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "userProfiles", outputs: [{ internalType: "string", name: "username", type: "string" }, { internalType: "address", name: "wallet", type: "address" }, { internalType: "uint256", name: "totalSent", type: "uint256" }, { internalType: "uint256", name: "totalReceived", type: "uint256" }, { internalType: "uint256", name: "remittanceCount", type: "uint256" }, { internalType: "bool", name: "isRegistered", type: "bool" }, { internalType: "bool", name: "isVerified", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }, { internalType: "uint256", name: "", type: "uint256" }], name: "userRemittances", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "_cashout", type: "address" }], name: "verifyCashoutPoint", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "_user", type: "address" }], name: "verifyUser", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "withdrawCashoutBalance", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "_to", type: "address" }], name: "withdrawPlatformFees", outputs: [], stateMutability: "nonpayable", type: "function" }
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
