// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Token ERC20 de prueba que simula USDC para testnet
 * @notice Solo para desarrollo - NO usar en producción
 */
contract MockUSDC is ERC20, Ownable {
    
    constructor() ERC20("Mock USD Coin", "USDC") Ownable(msg.sender) {
        // Mint inicial: 1 millón de USDC al deployer
        _mint(msg.sender, 1_000_000 * 10**6);
    }
    
    /**
     * @dev USDC usa 6 decimales (no 18 como ETH)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    /**
     * @dev Mint tokens gratis (solo para testing)
     * Cualquiera puede mintear en testnet
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    /**
     * @dev Faucet: obtener 1000 USDC gratis
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 10_000 * 10**6, "Ya tienes suficientes USDC");
        _mint(msg.sender, 1_000 * 10**6); // 1000 USDC
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
