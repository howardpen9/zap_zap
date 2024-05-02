import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SwapConfig = {
    // proxy_address: Address;
    // symbol_id: bigint;
    // factory: Address;
    // wallet_code: Cell;
};

export function SwapConfigToCell(config: SwapConfig): Cell {
    return beginCell()
            // .storeCoins(0)                      // 28 bits
            // .storeAddress(config.proxy_address) // 267 bits
            // .storeUint(config.symbol_id, 256)   // 256 bits
            // .storeAddress(config.factory)       // 267 bits 
            // .storeRef(config.wallet_code) // 1024 bits
            // .storeRef(
            //     beginCell()
            //         .storeUint(0, 256) // 256 bits
            //         .storeUint(1, 1) // True
            //         .storeCoins(0) // 28 bits
            //         .storeCoins(0) // 28 bits
            //     .endCell()
            // )
            // .storeRef(beginCell().endCell()) 
        .endCell(); 
}

export class Swap implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Swap(address);
    }

    static createFromConfig(config: SwapConfig, code: Cell, workchain = 0) {
        const data = SwapConfigToCell(config);
        const init = { code, data };
        return new Swap(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async send(
        provider: ContractProvider,
        via: Sender,
        args: { value: bigint; bounce?: boolean | null | undefined },
        message: string | "Owner Claim" | "Mint" | null
    ) { 
        let body: Cell | null = null;
        if (typeof message === "string") {
          body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "Owner Claim") {
          body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "Mint") {
          body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        // if (body === null) {
        //   throw new Error("Invalid message type");
        // }
        await provider.internal(via, { ...args, body: body });
      }


}
