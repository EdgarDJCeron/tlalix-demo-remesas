// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importaciones directas de OpenZeppelin compatible con Remix
import "@openzeppelin/contracts@5.0.0/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";
import "@openzeppelin/contracts@5.0.0/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts@5.0.0/utils/Pausable.sol";

/**
 * @title Tlalix
 * @dev Contrato completo para sistema de remesas con stablecoins
 * @notice Maneja remesas, identidades, comercios y comisiones en un solo contrato
 */
contract Tlalix is Ownable, ReentrancyGuard, Pausable {
    
    // ============================================
    // ESTRUCTURAS DE DATOS
    // ============================================
    
    struct Remittance {
        address sender;           // Quien envía
        address recipient;        // Quien recibe
        uint256 amountUSD;       // Monto en USDC
        uint256 amountMXN;       // Equivalente en MXN
        uint256 fee;             // Comisión cobrada
        uint256 timestamp;       // Cuándo se envió
        string recipientAlias;   // Alias del destinatario
        string code;             // Código de retiro (ABC123)
        RemittanceStatus status; // Estado
        bool isClaimed;          // Si fue reclamada
        address cashoutPoint;    // Comercio donde se retiró
    }
    
    struct UserProfile {
        string username;         // nombre-usuario.tlalix
        address wallet;          // Dirección de wallet
        uint256 totalSent;       // Total enviado
        uint256 totalReceived;   // Total recibido
        uint256 remittanceCount; // Número de remesas
        bool isRegistered;       // Si está registrado
        bool isVerified;         // Si está verificado (KYC)
    }
    
    struct CashoutPoint {
        address owner;           // Dueño del comercio
        string name;             // Nombre del comercio
        string location;         // Ubicación
        uint256 feePct;          // Comisión % (en basis points: 50 = 0.5%)
        uint256 totalProcessed;  // Total procesado
        uint256 balance;         // Balance disponible
        bool isActive;           // Si está activo
        bool isVerified;         // Si está verificado
    }
    
    enum RemittanceStatus {
        Pending,      // Creada, esperando
        Locked,       // Fondos bloqueados
        ReadyForPickup, // Lista para retirar
        Claimed,      // Reclamada
        Expired,      // Expirada
        Cancelled     // Cancelada
    }
    
    // ============================================
    // VARIABLES DE ESTADO
    // ============================================
    
    // Token USDC
    IERC20 public usdcToken;
    
    // Tasa de cambio USD/MXN (con 2 decimales: 1750 = 17.50)
    uint256 public exchangeRate = 1750;
    
    // Comisión de la plataforma (basis points: 150 = 1.5%)
    uint256 public platformFeePct = 150;
    
    // Tiempo de expiración (30 días)
    uint256 public expirationTime = 30 days;
    
    // Mapeos principales
    mapping(string => Remittance) public remittances;        // code => Remittance
    mapping(address => UserProfile) public userProfiles;     // wallet => Profile
    mapping(string => address) public aliasToAddress;        // alias => wallet
    mapping(address => CashoutPoint) public cashoutPoints;   // wallet => CashoutPoint
    mapping(address => string[]) public userRemittances;     // wallet => codes[]
    
    // Contadores y listas
    string[] public allRemittanceCodes;
    address[] public allCashoutPoints;
    uint256 public totalRemittances;
    uint256 public totalVolume;
    uint256 public platformBalance;
    
    // ============================================
    // EVENTOS
    // ============================================
    
    event RemittanceCreated(
        string indexed code,
        address indexed sender,
        address indexed recipient,
        uint256 amountUSD,
        uint256 amountMXN,
        string recipientAlias
    );
    
    event RemittanceClaimed(
        string indexed code,
        address indexed recipient,
        address indexed cashoutPoint,
        uint256 amount
    );
    
    event UserRegistered(
        address indexed wallet,
        string username
    );
    
    event CashoutPointRegistered(
        address indexed owner,
        string name,
        uint256 feePct
    );
    
    event ExchangeRateUpdated(
        uint256 oldRate,
        uint256 newRate
    );
    
    event FeesWithdrawn(
        address indexed to,
        uint256 amount
    );
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }
    
    // ============================================
    // FUNCIONES PRINCIPALES - REMESAS
    // ============================================
    
    /**
     * @dev Crear una nueva remesa
     * @param _amountUSD Monto en USDC (con 6 decimales)
     * @param _recipientAlias Alias del destinatario
     * @param _code Código único de retiro
     */
    function createRemittance(
        uint256 _amountUSD,
        string memory _recipientAlias,
        string memory _code
    ) external nonReentrant whenNotPaused {
        require(_amountUSD > 0, "Amount must be greater than 0");
        require(bytes(_code).length == 6, "Code must be 6 characters");
        require(remittances[_code].timestamp == 0, "Code already exists");
        
        // Calcular comisión y monto neto
        uint256 fee = (_amountUSD * platformFeePct) / 10000;
        uint256 netAmount = _amountUSD - fee;
        
        // Calcular equivalente en MXN
        uint256 amountMXN = (netAmount * exchangeRate) / 100;
        
        // Obtener destinatario
        address recipient = aliasToAddress[_recipientAlias];
        if (recipient == address(0)) {
            recipient = msg.sender; // Si no existe, temporal
        }
        
        // Transferir USDC del sender al contrato
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amountUSD),
            "Transfer failed"
        );
        
        // Crear remesa
        remittances[_code] = Remittance({
            sender: msg.sender,
            recipient: recipient,
            amountUSD: netAmount,
            amountMXN: amountMXN,
            fee: fee,
            timestamp: block.timestamp,
            recipientAlias: _recipientAlias,
            code: _code,
            status: RemittanceStatus.ReadyForPickup,
            isClaimed: false,
            cashoutPoint: address(0)
        });
        
        // Actualizar contadores
        allRemittanceCodes.push(_code);
        userRemittances[msg.sender].push(_code);
        totalRemittances++;
        totalVolume += _amountUSD;
        platformBalance += fee;
        
        // Actualizar perfil del sender
        if (!userProfiles[msg.sender].isRegistered) {
            userProfiles[msg.sender].wallet = msg.sender;
            userProfiles[msg.sender].isRegistered = true;
        }
        userProfiles[msg.sender].totalSent += _amountUSD;
        userProfiles[msg.sender].remittanceCount++;
        
        emit RemittanceCreated(
            _code,
            msg.sender,
            recipient,
            netAmount,
            amountMXN,
            _recipientAlias
        );
    }
    
    /**
     * @dev Reclamar una remesa (por el comercio)
     * @param _code Código de la remesa
     */
    function claimRemittance(string memory _code) external nonReentrant {
        Remittance storage remittance = remittances[_code];
        
        require(remittance.timestamp != 0, "Remittance does not exist");
        require(!remittance.isClaimed, "Already claimed");
        require(
            remittance.status == RemittanceStatus.ReadyForPickup,
            "Not ready for pickup"
        );
        require(
            block.timestamp <= remittance.timestamp + expirationTime,
            "Remittance expired"
        );
        require(cashoutPoints[msg.sender].isActive, "Not a valid cashout point");
        
        CashoutPoint storage cashout = cashoutPoints[msg.sender];
        
        // Calcular comisión del comercio
        uint256 cashoutFee = (remittance.amountUSD * cashout.feePct) / 10000;
        uint256 finalAmount = remittance.amountUSD - cashoutFee;
        
        // Actualizar estado
        remittance.isClaimed = true;
        remittance.status = RemittanceStatus.Claimed;
        remittance.cashoutPoint = msg.sender;
        
        // Actualizar comercio
        cashout.totalProcessed += finalAmount;
        cashout.balance += cashoutFee;
        
        // Transferir USDC al comercio
        require(
            usdcToken.transfer(msg.sender, finalAmount),
            "Transfer failed"
        );
        
        emit RemittanceClaimed(_code, remittance.recipient, msg.sender, finalAmount);
    }
    
    /**
     * @dev Cancelar remesa (solo sender, si no ha sido reclamada)
     * @param _code Código de la remesa
     */
    function cancelRemittance(string memory _code) external nonReentrant {
        Remittance storage remittance = remittances[_code];
        
        require(remittance.sender == msg.sender, "Not the sender");
        require(!remittance.isClaimed, "Already claimed");
        require(
            remittance.status == RemittanceStatus.ReadyForPickup ||
            remittance.status == RemittanceStatus.Pending,
            "Cannot cancel"
        );
        
        // Cambiar estado
        remittance.status = RemittanceStatus.Cancelled;
        
        // Devolver fondos (menos la comisión ya cobrada)
        require(
            usdcToken.transfer(msg.sender, remittance.amountUSD),
            "Transfer failed"
        );
    }
    
    // ============================================
    // FUNCIONES - GESTIÓN DE USUARIOS
    // ============================================
    
    /**
     * @dev Registrar alias de usuario
     * @param _alias Alias deseado (sin .tlalix)
     */
    function registerAlias(string memory _alias) external {
        require(!userProfiles[msg.sender].isRegistered, "Already registered");
        require(aliasToAddress[_alias] == address(0), "Alias already taken");
        require(bytes(_alias).length >= 3, "Alias too short");
        
        userProfiles[msg.sender] = UserProfile({
            username: _alias,
            wallet: msg.sender,
            totalSent: 0,
            totalReceived: 0,
            remittanceCount: 0,
            isRegistered: true,
            isVerified: false
        });
        
        aliasToAddress[_alias] = msg.sender;
        
        emit UserRegistered(msg.sender, _alias);
    }
    
    /**
     * @dev Obtener perfil de usuario por alias
     */
    function getUserByAlias(string memory _alias) external view returns (UserProfile memory) {
        address wallet = aliasToAddress[_alias];
        require(wallet != address(0), "Alias not found");
        return userProfiles[wallet];
    }
    
    /**
     * @dev Verificar usuario (solo owner)
     */
    function verifyUser(address _user) external onlyOwner {
        require(userProfiles[_user].isRegistered, "User not registered");
        userProfiles[_user].isVerified = true;
    }
    
    // ============================================
    // FUNCIONES - GESTIÓN DE COMERCIOS
    // ============================================
    
    /**
     * @dev Registrar punto de retiro (comercio)
     * @param _name Nombre del comercio
     * @param _location Ubicación
     * @param _feePct Comisión en basis points (50 = 0.5%)
     */
    function registerCashoutPoint(
        string memory _name,
        string memory _location,
        uint256 _feePct
    ) external {
        require(!cashoutPoints[msg.sender].isActive, "Already registered");
        require(_feePct <= 1000, "Fee too high (max 10%)");
        require(bytes(_name).length > 0, "Name required");
        
        cashoutPoints[msg.sender] = CashoutPoint({
            owner: msg.sender,
            name: _name,
            location: _location,
            feePct: _feePct,
            totalProcessed: 0,
            balance: 0,
            isActive: true,
            isVerified: false
        });
        
        allCashoutPoints.push(msg.sender);
        
        emit CashoutPointRegistered(msg.sender, _name, _feePct);
    }
    
    /**
     * @dev Verificar comercio (solo owner)
     */
    function verifyCashoutPoint(address _cashout) external onlyOwner {
        require(cashoutPoints[_cashout].isActive, "Not registered");
        cashoutPoints[_cashout].isVerified = true;
    }
    
    /**
     * @dev Comercio retira sus ganancias
     */
    function withdrawCashoutBalance() external nonReentrant {
        CashoutPoint storage cashout = cashoutPoints[msg.sender];
        require(cashout.isActive, "Not a cashout point");
        require(cashout.balance > 0, "No balance");
        
        uint256 amount = cashout.balance;
        cashout.balance = 0;
        
        require(usdcToken.transfer(msg.sender, amount), "Transfer failed");
    }
    
    // ============================================
    // FUNCIONES - ADMINISTRACIÓN
    // ============================================
    
    /**
     * @dev Actualizar tasa de cambio USD/MXN
     * @param _newRate Nueva tasa (con 2 decimales: 1750 = 17.50)
     */
    function updateExchangeRate(uint256 _newRate) external onlyOwner {
        require(_newRate > 0, "Invalid rate");
        uint256 oldRate = exchangeRate;
        exchangeRate = _newRate;
        emit ExchangeRateUpdated(oldRate, _newRate);
    }
    
    /**
     * @dev Actualizar comisión de plataforma
     * @param _newFeePct Nueva comisión en basis points
     */
    function updatePlatformFee(uint256 _newFeePct) external onlyOwner {
        require(_newFeePct <= 500, "Fee too high (max 5%)");
        platformFeePct = _newFeePct;
    }
    
    /**
     * @dev Retirar comisiones acumuladas de la plataforma
     */
    function withdrawPlatformFees(address _to) external onlyOwner nonReentrant {
        require(platformBalance > 0, "No balance");
        uint256 amount = platformBalance;
        platformBalance = 0;
        
        require(usdcToken.transfer(_to, amount), "Transfer failed");
        emit FeesWithdrawn(_to, amount);
    }
    
    /**
     * @dev Pausar/despausar contrato
     */
    function togglePause() external onlyOwner {
        if (paused()) {
            _unpause();
        } else {
            _pause();
        }
    }
    
    // ============================================
    // FUNCIONES DE CONSULTA
    // ============================================
    
    /**
     * @dev Obtener remesa por código
     */
    function getRemittance(string memory _code) external view returns (Remittance memory) {
        return remittances[_code];
    }
    
    /**
     * @dev Obtener historial de remesas de un usuario
     */
    function getUserRemittances(address _user) external view returns (string[] memory) {
        return userRemittances[_user];
    }
    
    /**
     * @dev Obtener todos los comercios
     */
    function getAllCashoutPoints() external view returns (address[] memory) {
        return allCashoutPoints;
    }
    
    /**
     * @dev Calcular total a recibir después de comisiones
     */
    function calculateReceiveAmount(uint256 _amountUSD) external view returns (
        uint256 netUSD,
        uint256 amountMXN,
        uint256 fee
    ) {
        fee = (_amountUSD * platformFeePct) / 10000;
        netUSD = _amountUSD - fee;
        amountMXN = (netUSD * exchangeRate) / 100;
    }
    
    /**
     * @dev Verificar si código está disponible
     */
    function isCodeAvailable(string memory _code) external view returns (bool) {
        return remittances[_code].timestamp == 0;
    }
    
    /**
     * @dev Estadísticas generales
     */
    function getStats() external view returns (
        uint256 _totalRemittances,
        uint256 _totalVolume,
        uint256 _platformBalance,
        uint256 _exchangeRate,
        uint256 _platformFeePct
    ) {
        return (
            totalRemittances,
            totalVolume,
            platformBalance,
            exchangeRate,
            platformFeePct
        );
    }
}
