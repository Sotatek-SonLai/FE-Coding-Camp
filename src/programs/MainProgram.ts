import {BaseInterface} from "./interfaces";
import {getMainIdl} from "./utils";
import {web3, BN, AnchorProvider} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {GOVERNOR_ADDRESS, SOL_TREASURY_ADDRESS} from "../constants";
import {createInitializeMintInstruction, MINT_SIZE, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export default class mainProgram extends BaseInterface {
    _counter: web3.Keypair;

    constructor(provider: AnchorProvider) {
        super(provider, getMainIdl());
        this._counter = web3.Keypair.generate();
    }

    async getMetadata(mint: any) {
        const [metadataPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            TOKEN_METADATA_PROGRAM_ID
        );

        return metadataPubkey;
    };


    async getMasterEdition(mint: any) {
        const [masterEditionPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
            TOKEN_METADATA_PROGRAM_ID
        );

        return masterEditionPubkey;
    };

    async getAssetBasket(
        programID: any,
        governor: any,
        asset_owner: any,
        mint: any
    ) {
        const [assetBasketPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("basket"), mint.toBuffer(), asset_owner.toBuffer(), governor.toBuffer()],
            programID
        );

        return assetBasketPubkey;
    };

    async getSerializedTx(publicKey: PublicKey, assetUrl: string = "https://basc.s3.amazonaws.com/meta/3506.json") {
        try {
            const mintKey = web3.Keypair.generate();
            const governor = new anchor.web3.PublicKey(GOVERNOR_ADDRESS)
            const sol_treasury = new anchor.web3.PublicKey(SOL_TREASURY_ADDRESS)
            const lamports = await this._provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

            const mint_tx = new anchor.web3.Transaction().add(
                anchor.web3.SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKey.publicKey,
                    space: MINT_SIZE,
                    programId: TOKEN_PROGRAM_ID,
                    lamports,
                }),
                createInitializeMintInstruction(mintKey.publicKey, 0, publicKey, publicKey, TOKEN_PROGRAM_ID),
            );

            const metadataAddress = await this.getMetadata(mintKey.publicKey);
            const masterEdition = await this.getMasterEdition(mintKey.publicKey);

            const assetBasketAddress = await this.getAssetBasket(
                this._program.programId,
                governor,
                publicKey,
                mintKey.publicKey
            );


            // first data will be signed by big guardian
            const ix = await this._program.methods.issueAsset(assetUrl, "Bored Apes").accounts(
                {
                    bigGuardian: this._provider.publicKey,
                    governor: governor,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    treasury: sol_treasury,
                    masterEdition,
                    metadata: metadataAddress,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    mint: mintKey.publicKey,
                    mintAuthority: publicKey,
                    updateAuthority: publicKey,
                    tokenAccount: publicKey,
                    owner: publicKey,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    assetBasket: assetBasketAddress
                }
            ).instruction();

            mint_tx.add(ix)
            console.log('mint_tx', mint_tx)

            const serialized_tx = mint_tx.serialize({
                requireAllSignatures: false
            });
            console.log('serialized_tx', serialized_tx)

            console.log("Tx: ", serialized_tx.toString("base64"));

        } catch (err) {
            return [null, err]
        }
    }

}
