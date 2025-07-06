# Deployment Guide

This guide provides step-by-step instructions for deploying the Stacks Counter smart contract to different networks.

## Prerequisites Checklist

- [ ] Clarinet installed and working (`clarinet --version`)
- [ ] Node.js installed (for JavaScript interactions)
- [ ] STX tokens for deployment fees
- [ ] Wallet set up with mnemonic phrase
- [ ] Network configurations updated

## Pre-Deployment Steps

### 1. Verify Contract Syntax
```bash
clarinet check
```

### 2. Run All Tests
```bash
clarinet test
```

### 3. Test Locally
```bash
clarinet integrate
```

## Network Deployment

### Devnet (Local Development)

**Purpose**: Local testing and development

1. **Start local devnet**:
   ```bash
   clarinet integrate
   ```

2. **Deploy contract**:
   ```bash
   clarinet deploy --devnet
   ```

3. **Test interactions**:
   ```bash
   clarinet console
   ```

**Cost**: Free (local tokens)

### Testnet Deployment

**Purpose**: Testing with real network conditions

1. **Get testnet STX tokens**:
   - Visit [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)
   - Request tokens for your address

2. **Update configuration**:
   ```bash
   # Edit settings/Testnet.toml
   # Replace YOUR_TESTNET_MNEMONIC_HERE with your actual mnemonic
   ```

3. **Deploy to testnet**:
   ```bash
   clarinet deploy --testnet
   ```

4. **Verify deployment**:
   - Check [Testnet Explorer](https://explorer.stacks.co/?chain=testnet)
   - Note the contract address for future interactions

**Cost**: ~0.1 STX (testnet tokens)

### Mainnet Deployment

**Purpose**: Production deployment

⚠️ **WARNING**: This costs real STX tokens and is irreversible!

1. **Acquire STX tokens**:
   - Purchase from exchanges (Coinbase, Binance, etc.)
   - Ensure you have enough for deployment fees (~1-2 STX)

2. **Secure your mnemonic**:
   ```bash
   # Edit settings/Mainnet.toml
   # Replace YOUR_MAINNET_MNEMONIC_HERE with your actual mnemonic
   # NEVER commit this to version control!
   ```

3. **Final testing**:
   - Ensure all tests pass
   - Test on testnet first
   - Review contract code one final time

4. **Deploy to mainnet**:
   ```bash
   clarinet deploy --mainnet
   ```

5. **Verify deployment**:
   - Check [Mainnet Explorer](https://explorer.stacks.co/)
   - Save the contract address
   - Test basic functions

**Cost**: ~1-2 STX (real tokens)

## Post-Deployment

### 1. Document Contract Address
Save the deployed contract address in a secure location:
- Contract Address: `SP...` (replace with actual)
- Network: testnet/mainnet
- Deployment Date: 
- Transaction ID: 

### 2. Test Basic Functions
```bash
# Using clarinet console
(contract-call? 'SP1234567890.counter get-counter)
(contract-call? 'SP1234567890.counter increment)
```

### 3. Update Documentation
- Update README.md with contract address
- Update example scripts with correct address
- Share contract details with team/users

## Troubleshooting

### Common Issues

**"Insufficient funds"**
- Solution: Ensure wallet has enough STX for deployment fees

**"Contract already exists"**
- Solution: Contract names must be unique per address. Change contract name or use different deployer address

**"Invalid mnemonic"**
- Solution: Verify mnemonic phrase is correct and properly formatted

**"Network timeout"**
- Solution: Check network connectivity and try again

**"Transaction failed"**
- Solution: Check transaction details in explorer for specific error

### Getting Help

1. Check [Clarinet Documentation](https://docs.hiro.so/clarinet/)
2. Visit [Stacks Forum](https://forum.stacks.org/)
3. Join [Stacks Discord](https://discord.gg/stacks)
4. Review [Stacks Documentation](https://docs.stacks.co/)

## Security Best Practices

### Before Deployment
- [ ] Code reviewed by multiple developers
- [ ] All tests passing
- [ ] Security audit completed (for production contracts)
- [ ] Access controls verified
- [ ] Error handling tested

### During Deployment
- [ ] Use secure environment for private keys
- [ ] Double-check network selection
- [ ] Verify contract parameters
- [ ] Monitor deployment transaction

### After Deployment
- [ ] Verify contract functions work as expected
- [ ] Monitor for unusual activity
- [ ] Keep deployment details secure
- [ ] Plan for potential upgrades (if applicable)

## Cost Estimation

| Network | Deployment Cost | Transaction Cost |
|---------|----------------|------------------|
| Devnet  | Free           | Free             |
| Testnet | ~0.1 STX       | ~0.001 STX       |
| Mainnet | ~1-2 STX       | ~0.001-0.01 STX  |

*Costs may vary based on network congestion and contract complexity*

## Next Steps

After successful deployment:

1. **Integration**: Update frontend/backend to use deployed contract
2. **Monitoring**: Set up monitoring for contract interactions
3. **Documentation**: Create user guides and API documentation
4. **Community**: Share contract details with the community
5. **Maintenance**: Plan for ongoing maintenance and potential upgrades
