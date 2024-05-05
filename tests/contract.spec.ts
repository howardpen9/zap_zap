import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
} from '@ton/sandbox';
import { Cell, beginCell, toNano } from '@ton/core';
import { compile } from '@ton/blueprint';
import '@ton/test-utils';

import { Swap } from '../wrappers/Swap';

describe('Sample', () => {
    let swapCode: Cell;
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;

    let contract: SandboxContract<Swap>;

    beforeAll(async () => {
        swapCode = await compile('Swap');
        // jettonWalletCode = await compile('JettonWallet');

        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        admin = await blockchain.treasury('admin');

        contract = blockchain.openContract(await Swap.createFromConfig({}, await compile('Swap')));
        const deployResult = await contract.sendDeploy(
            deployer.getSender(), 
            toNano('1.3')
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: contract.address,
            deploy: true,
            success: true,
        });
        printTransactionFees(deployResult.transactions);
        prettyLogTransactions(deployResult.transactions);

    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sample are ready to use
        console.log("contract deployed: ", contract.address);

        const sendResult = await contract.send(
            deployer.getSender(), 
            { value: toNano('1.5')},
            null
        ); 
        printTransactionFees(sendResult.transactions);
        prettyLogTransactions(sendResult.transactions);
    });


    // it('should deploy with init data', async () => {
    //     const sendResult = await contract.send(
    //         deployer.getSender(), 
    //         {
    //             value: toNano('0.5'),
    //         },
    //         "1234"
    //     ); 
    //     printTransactionFees(sendResult.transactions);
    //     prettyLogTransactions(sendResult.transactions);
    // });
});
