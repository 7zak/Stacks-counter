# Stacks Counter Smart Contract

A simple yet comprehensive counter smart contract built with Clarity for the Stacks blockchain. This project demonstrates fundamental smart contract concepts including state management, access controls, error handling, and comprehensive testing.

## Features

- **Counter Operations**: Increment, decrement, add, and subtract operations
- **Safety Checks**: Prevents underflow (going below zero)
- **Access Control**: Owner-only reset functionality
- **Event Logging**: All operations emit events for transparency
- **Comprehensive Testing**: Full test suite with edge case coverage
- **Multi-Network Support**: Configurations for devnet, testnet, and mainnet

## Project Structure

```
stacks-counter/
├── Clarinet.toml           # Main project configuration
├── contracts/
│   └── counter.clar        # Counter smart contract
├── tests/
│   └── counter_test.ts     # Comprehensive test suite
├── settings/
│   ├── Devnet.toml        # Development network config
│   ├── Testnet.toml       # Testnet configuration
│   └── Mainnet.toml       # Mainnet configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Clarinet**: The Stacks smart contract development tool
   ```bash
   # Install via Homebrew (macOS)
   brew install clarinet

   # Or download from GitHub releases
   # https://github.com/hirosystems/clarinet/releases
   ```

2. **Node.js** (for running tests): Version 14 or higher
   ```bash
   # Check your version
   node --version
   ```

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd stacks-counter
```

### 2. Check Contract Syntax

```bash
clarinet check
```

### 3. Run Tests

```bash
clarinet test
```

### 4. Start Local Development Environment

```bash
clarinet integrate
```

## Smart Contract Functions

### Read-Only Functions

#### `get-counter`
Returns the current counter value.
- **Returns**: `uint` - Current counter value
- **Example**: `(contract-call? .counter get-counter)`

#### `get-owner`
Returns the contract owner's principal address.
- **Returns**: `principal` - Owner's address
- **Example**: `(contract-call? .counter get-owner)`

### Public Functions

#### `increment`
Increases the counter by 1.
- **Returns**: `(response uint uint)` - Success with new value or error
- **Example**: `(contract-call? .counter increment)`

#### `decrement`
Decreases the counter by 1. Fails if counter would go below 0.
- **Returns**: `(response uint uint)` - Success with new value or error code 100
- **Example**: `(contract-call? .counter decrement)`

#### `add (amount uint)`
Adds a specific amount to the counter.
- **Parameters**: `amount` - Amount to add
- **Returns**: `(response uint uint)` - Success with new value or error
- **Example**: `(contract-call? .counter add u5)`

#### `subtract (amount uint)`
Subtracts a specific amount from the counter. Fails if result would be negative.
- **Parameters**: `amount` - Amount to subtract
- **Returns**: `(response uint uint)` - Success with new value or error code 100
- **Example**: `(contract-call? .counter subtract u3)`

#### `reset`
Resets the counter to 0. Only callable by the contract owner.
- **Returns**: `(response uint uint)` - Success with 0 or error code 101
- **Example**: `(contract-call? .counter reset)`

### Error Codes

- `u100` - `ERR_UNDERFLOW`: Operation would result in negative value
- `u101` - `ERR_UNAUTHORIZED`: Caller is not authorized for this operation

## Testing

The project includes comprehensive tests covering:

- Basic functionality (increment, decrement, read)
- Edge cases (underflow protection)
- Access control (owner-only functions)
- Multiple operations and state consistency
- Error handling

### Run All Tests
```bash
clarinet test
```

### Run Specific Test
```bash
clarinet test --filter "Counter starts at 0"
```

### Test Coverage
- ✅ Counter initialization
- ✅ Increment operations
- ✅ Decrement operations with underflow protection
- ✅ Add/subtract with custom amounts
- ✅ Owner-only reset functionality
- ✅ Error handling and edge cases

## Deployment

### Local Development (Devnet)

1. **Start the local devnet**:
   ```bash
   clarinet integrate
   ```

2. **Deploy to local devnet**:
   ```bash
   clarinet deploy --devnet
   ```

3. **Interact with the contract** using the Clarinet console:
   ```bash
   clarinet console
   ```

### Testnet Deployment

1. **Update testnet configuration**:
   Edit `settings/Testnet.toml` and replace `YOUR_TESTNET_MNEMONIC_HERE` with your actual testnet mnemonic.

2. **Deploy to testnet**:
   ```bash
   clarinet deploy --testnet
   ```

3. **Verify deployment**:
   Check the transaction on the [Stacks Testnet Explorer](https://explorer.stacks.co/?chain=testnet)

### Mainnet Deployment

⚠️ **Warning**: Mainnet deployment costs real STX tokens and is irreversible.

1. **Update mainnet configuration**:
   Edit `settings/Mainnet.toml` and replace `YOUR_MAINNET_MNEMONIC_HERE` with your actual mainnet mnemonic.

   **Security Note**: Never commit real mainnet mnemonics to version control!

2. **Deploy to mainnet**:
   ```bash
   clarinet deploy --mainnet
   ```

3. **Verify deployment**:
   Check the transaction on the [Stacks Mainnet Explorer](https://explorer.stacks.co/)

## Usage Examples

### Using Clarinet Console

```clarity
;; Get current counter value
(contract-call? .counter get-counter)

;; Increment the counter
(contract-call? .counter increment)

;; Add 5 to the counter
(contract-call? .counter add u5)

;; Try to decrement (might fail if counter is 0)
(contract-call? .counter decrement)

;; Reset counter (only works if you're the owner)
(contract-call? .counter reset)
```

### Using Stacks.js (JavaScript/TypeScript)

```javascript
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();

// Increment counter
const incrementTx = await makeContractCall({
  contractAddress: 'YOUR_CONTRACT_ADDRESS',
  contractName: 'counter',
  functionName: 'increment',
  functionArgs: [],
  senderKey: 'YOUR_PRIVATE_KEY',
  network,
  anchorMode: AnchorMode.Any,
  postConditionMode: PostConditionMode.Allow,
});

const broadcastResponse = await broadcastTransaction(incrementTx, network);
```

## Development Workflow

### 1. Make Changes
Edit the contract in `contracts/counter.clar`

### 2. Check Syntax
```bash
clarinet check
```

### 3. Run Tests
```bash
clarinet test
```

### 4. Test Locally
```bash
clarinet integrate
```

### 5. Deploy
```bash
clarinet deploy --testnet  # or --mainnet
```

## Common Issues and Solutions

### Issue: "Contract not found"
**Solution**: Ensure you've deployed the contract to the network you're trying to interact with.

### Issue: "Unauthorized" error on reset
**Solution**: Only the contract deployer can call the reset function.

### Issue: "Underflow" error
**Solution**: You're trying to subtract more than the current counter value or decrement when counter is 0.

### Issue: Tests failing
**Solution**:
1. Check that Clarinet is properly installed
2. Ensure all dependencies are up to date
3. Verify contract syntax with `clarinet check`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `clarinet test`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## Security Considerations

- The contract prevents underflow by checking values before subtraction
- Only the contract owner can reset the counter
- All operations emit events for transparency and debugging
- No external dependencies minimize attack surface

## License

This project is open source and available under the [MIT License](LICENSE).

## Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet/)
- [Stacks Explorer](https://explorer.stacks.co/)
- [Stacks Community](https://forum.stacks.org/)

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the [Stacks Documentation](https://docs.stacks.co/)
3. Ask questions on the [Stacks Forum](https://forum.stacks.org/)
4. Join the [Stacks Discord](https://discord.gg/stacks)
