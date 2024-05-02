import { beginCell, toNano } from '@ton/core';
import { Swap } from '../wrappers/Swap';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const minter = provider.open(
        await Swap.createFromConfig(
            provider.sender().address!!, 
        await compile('Jetton'))
    );

    // let init_data = beginCell()
    //     .storeCoins(1000000n) // Total Supply
    //     .storeAddress(provider.sender().address!!)
    //     .storeRef(beginCell().endCell())
    //     .storeRef(await compile('JettonWallet'))
    //     .endCell();

    await minter.sendDeploy(
        provider.sender(),
        toNano('1.5')
    );

    await provider.waitForDeploy(minter.address);
    // console.log('ID', await minter.getGetIndex());
    console.log('Contract: ', minter.address);
}
