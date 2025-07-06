/**
 * Example script showing how to interact with the counter contract
 * using Stacks.js
 * 
 * Prerequisites:
 * npm install @stacks/transactions @stacks/network
 */

const {
  makeContractCall,
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  callReadOnlyFunction,
  cvToJSON,
} = require('@stacks/transactions');

const { StacksTestnet, StacksMainnet } = require('@stacks/network');

// Configuration
const NETWORK = new StacksTestnet(); // Change to StacksMainnet() for mainnet
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with your deployed contract address
const CONTRACT_NAME = 'counter';

// Example private key (DO NOT use in production!)
const PRIVATE_KEY = 'your-private-key-here';

/**
 * Read the current counter value
 */
async function getCounter() {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-counter',
      functionArgs: [],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    console.log('Current counter value:', cvToJSON(result).value);
    return cvToJSON(result).value;
  } catch (error) {
    console.error('Error reading counter:', error);
  }
}

/**
 * Increment the counter
 */
async function incrementCounter() {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'increment',
      functionArgs: [],
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
    
    console.log('Increment transaction broadcast:', broadcastResponse.txid);
    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error incrementing counter:', error);
  }
}

/**
 * Add a specific amount to the counter
 */
async function addToCounter(amount) {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'add',
      functionArgs: [uintCV(amount)],
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
    
    console.log(`Add ${amount} transaction broadcast:`, broadcastResponse.txid);
    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error adding to counter:', error);
  }
}

/**
 * Decrement the counter
 */
async function decrementCounter() {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'decrement',
      functionArgs: [],
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
    
    console.log('Decrement transaction broadcast:', broadcastResponse.txid);
    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error decrementing counter:', error);
  }
}

/**
 * Reset the counter (owner only)
 */
async function resetCounter() {
  try {
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'reset',
      functionArgs: [],
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
    
    console.log('Reset transaction broadcast:', broadcastResponse.txid);
    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error resetting counter:', error);
  }
}

/**
 * Example usage
 */
async function main() {
  console.log('=== Counter Contract Interaction Example ===\n');
  
  // Read current value
  console.log('1. Reading current counter value...');
  await getCounter();
  
  // Increment
  console.log('\n2. Incrementing counter...');
  await incrementCounter();
  
  // Wait a bit for transaction to be processed
  console.log('Waiting for transaction to be processed...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Read value again
  console.log('\n3. Reading counter value after increment...');
  await getCounter();
  
  // Add 5
  console.log('\n4. Adding 5 to counter...');
  await addToCounter(5);
  
  // Wait and read again
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log('\n5. Reading counter value after adding 5...');
  await getCounter();
  
  console.log('\n=== Example completed ===');
  console.log('Note: Replace CONTRACT_ADDRESS and PRIVATE_KEY with your actual values');
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  getCounter,
  incrementCounter,
  addToCounter,
  decrementCounter,
  resetCounter,
};
