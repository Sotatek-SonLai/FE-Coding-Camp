import { BaseInterface } from "./interfaces";
import { getCounterIdl } from "./utils";
import { web3, BN, AnchorProvider } from "@project-serum/anchor";

export default class CounterProgram extends BaseInterface {
    _counter: web3.Keypair;
    constructor(provider: AnchorProvider) {
        super(provider, getCounterIdl());
        this._counter = web3.Keypair.generate();
    }

    async lorem() {
        try {

        } catch (err) {
            return [null, err]
        }
    }

}
