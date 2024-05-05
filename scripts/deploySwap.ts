import { beginCell, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { Swap } from '../wrappers/Swap';

export async function run(provider: NetworkProvider) {
    const minter = provider.open(
        await Swap.createFromConfig(
            provider.sender().address!!, 
        await compile('Swap'))
    );

    await minter.sendDeploy(
        provider.sender(),
        toNano('1.5')
    );

    await provider.waitForDeploy(minter.address);
    // console.log('ID', await minter.getGetIndex());
    console.log('Contract: ', minter.address);
}
