import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Counter starts at 0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, types.uint(0));
    },
});

Clarinet.test({
    name: "Can increment counter",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'increment', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, types.ok(types.uint(1)));
        
        // Verify the counter value
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(1));
    },
});

Clarinet.test({
    name: "Can increment multiple times",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'increment', [], deployer.address),
            Tx.contractCall('counter', 'increment', [], deployer.address),
            Tx.contractCall('counter', 'increment', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 3);
        assertEquals(block.receipts[0].result, types.ok(types.uint(1)));
        assertEquals(block.receipts[1].result, types.ok(types.uint(2)));
        assertEquals(block.receipts[2].result, types.ok(types.uint(3)));
        
        // Verify final counter value
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(3));
    },
});

Clarinet.test({
    name: "Can decrement counter",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // First increment to have something to decrement
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'increment', [], deployer.address),
            Tx.contractCall('counter', 'increment', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[1].result, types.ok(types.uint(2)));
        
        // Now decrement
        block = chain.mineBlock([
            Tx.contractCall('counter', 'decrement', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(1)));
        
        // Verify counter value
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(1));
    },
});

Clarinet.test({
    name: "Cannot decrement below zero",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // Try to decrement when counter is 0
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'decrement', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, types.err(types.uint(100))); // ERR_UNDERFLOW
        
        // Verify counter is still 0
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(0));
    },
});

Clarinet.test({
    name: "Can add specific amounts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'add', [types.uint(5)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(5)));
        
        // Add more
        block = chain.mineBlock([
            Tx.contractCall('counter', 'add', [types.uint(10)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(15)));
        
        // Verify final value
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(15));
    },
});

Clarinet.test({
    name: "Can subtract specific amounts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // First add some value
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'add', [types.uint(20)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(20)));
        
        // Subtract some value
        block = chain.mineBlock([
            Tx.contractCall('counter', 'subtract', [types.uint(7)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(13)));
        
        // Verify final value
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(13));
    },
});

Clarinet.test({
    name: "Cannot subtract more than current value",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // Set counter to 5
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'add', [types.uint(5)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(5)));
        
        // Try to subtract more than available
        block = chain.mineBlock([
            Tx.contractCall('counter', 'subtract', [types.uint(10)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.err(types.uint(100))); // ERR_UNDERFLOW
        
        // Verify counter is unchanged
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(5));
    },
});

Clarinet.test({
    name: "Only owner can reset counter",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Set counter to some value
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'add', [types.uint(42)], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(42)));
        
        // Try to reset as non-owner (should fail)
        block = chain.mineBlock([
            Tx.contractCall('counter', 'reset', [], wallet1.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.err(types.uint(101))); // ERR_UNAUTHORIZED
        
        // Reset as owner (should succeed)
        block = chain.mineBlock([
            Tx.contractCall('counter', 'reset', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.ok(types.uint(0)));
        
        // Verify counter is reset
        block = chain.mineBlock([
            Tx.contractCall('counter', 'get-counter', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.uint(0));
    },
});

Clarinet.test({
    name: "Get owner returns correct address",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('counter', 'get-owner', [], deployer.address)
        ]);
        
        assertEquals(block.receipts[0].result, types.principal(deployer.address));
    },
});
