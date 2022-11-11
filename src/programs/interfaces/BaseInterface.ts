import { Program, Provider, web3, BN, AnchorProvider } from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey, Keypair } from '@solana/web3.js';

export default class BaseInterface {
	_provider: AnchorProvider;
	_programAddress: string;
	_idl: any;
	_program: Program;

	constructor(
		provider: AnchorProvider,
		idl: any
	) {
		this._provider = provider;
		this._programAddress = idl.metadata.address;
		this._idl = idl;
		this._program = new Program(idl, idl.metadata.address, provider);
	}
}
