import {BaseInterface} from "./interfaces";
import {getMainIdl} from "./utils";
import {web3, BN, AnchorProvider} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {GOVERNOR_ADDRESS, SOL_TREASURY_ADDRESS} from "../constants";
import {createAssociatedTokenAccountInstruction, createInitializeMintInstruction, getAssociatedTokenAddress, MINT_SIZE, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export default class mainProgram extends BaseInterface {
    _governor = new anchor.web3.PublicKey(GOVERNOR_ADDRESS)
    _sol_treasury = new anchor.web3.PublicKey(SOL_TREASURY_ADDRESS)

    constructor(provider: AnchorProvider) {
        super(provider, getMainIdl());
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
        mint: any,
        basket_id: any
    ) {
        const [assetBasketPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("basket"), mint.toBuffer(), asset_owner.toBuffer(), governor.toBuffer(), basket_id.toArrayLike(Buffer)],
            programID
        );

        return assetBasketPubkey;
    }

    async getAssetLocker(programId: any, governor: any, basket_id: any) {
        const [assetLockerPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("locker"), governor.toBuffer(), basket_id.toArrayLike(Buffer)],
            programId
        );

        return assetLockerPubkey;
    }

    async getTokenTreasury(programID: any) {
        const [treasuryPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("spl_token_treasury")],
            programID
        );

        return treasuryPubkey;
    };

    async fractionalToken(assetBasketAddress: any, nftTokenAccount: any, mintKeyDB: any) {

        const {publicKey} = this._provider

        const mintKey = new anchor.web3.PublicKey(mintKeyDB)

        const fractionalTokenMint = anchor.web3.Keypair.generate();
        const fractionalTokenAccount = await getAssociatedTokenAddress(fractionalTokenMint.publicKey, publicKey);

        const assetBasketAccount = await this._program.account.assetBasket.fetch(assetBasketAddress);
        const assetLocker = await this.getAssetLocker(this._program.programId, this._governor, assetBasketAccount.basketId);
        const treasuryPDA = await this.getTokenTreasury(this._program.programId);
        const treasuryNFTTokenAccount = await getAssociatedTokenAddress(mintKey, treasuryPDA, true);

        const lamports = await this._program.provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

        const fractional_nft_tx = new anchor.web3.Transaction()
            .add(
                anchor.web3.SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: fractionalTokenMint.publicKey,
                    space: MINT_SIZE,
                    programId: TOKEN_PROGRAM_ID,
                    lamports,
                }),
                createInitializeMintInstruction(fractionalTokenMint.publicKey, 8, publicKey, publicKey, TOKEN_PROGRAM_ID),
                createAssociatedTokenAccountInstruction(publicKey, fractionalTokenAccount, publicKey, fractionalTokenMint.publicKey),
                createAssociatedTokenAccountInstruction(publicKey, treasuryNFTTokenAccount, treasuryPDA, mintKey),
            );

        const fractionalize_nft_ix = await this._program.methods.fractionalizeAsset(
            new anchor.BN(10000 * (10 ** 8))
        ).accounts({
            assetBasket: assetBasketAddress,
            bigGuardian: this._program.provider.publicKey,
            governor: this._governor,
            mint: fractionalTokenMint.publicKey,
            owner: publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenAccount: fractionalTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            mintNft: mintKey,
            treasuryNftTokenAccount: treasuryNFTTokenAccount,
            ownerNftTokenAccount: nftTokenAccount,
            fractionalizeTokenLocker: assetLocker
        }).instruction();

        fractional_nft_tx.add(fractionalize_nft_ix);

        // co che confirm transaction tren solana voi ethereum
        const recentBlockhash = await this._program.provider.connection.getLatestBlockhash("confirmed");

        console.log("=========== Getting recent blockhash ===========");
        console.log("Recent blockhash: ", recentBlockhash);

        fractional_nft_tx.recentBlockhash = recentBlockhash.blockhash;
        fractional_nft_tx.feePayer = publicKey;

        fractional_nft_tx.partialSign(fractionalTokenMint);

        const serialized_tx = fractional_nft_tx.serialize({
            requireAllSignatures: false
        });

        const txToBase64 = serialized_tx.toString("base64")
        console.log("Tx: ", txToBase64);
        return [txToBase64, null]

    }

    async getSerializedTx(
        assetUrl: string = "https://basc.s3.amazonaws.com/meta/3506.json",
        bigGuardian: string = '8CmfvdfpbJ1atkm8ruqBG5JurgxKqAseYduDWdEiMNpX'
    ) {
        const {publicKey} = this._provider
        try {
            const mintKey = web3.Keypair.generate();
            const lamports = await this._provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);
            const nftTokenAccount = anchor.web3.Keypair.generate();

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
            const governorAccount = await this._program.provider.connection.getAccountInfo(this._governor);
            console.log('governorAccount', governorAccount)
            const governorDetails = governorAccount && this._program.coder.accounts.decode("PlatformGovernor", governorAccount.data);

            const assetBasketAddress = await this.getAssetBasket(
                this._program.programId,
                this._governor,
                publicKey,
                mintKey.publicKey,
                governorDetails.totalAssetsMinted.add(new anchor.BN(1))
            );


            // first data will be signed by big guardian
            const ix = await this._program.methods.issueAsset(assetUrl, "Bored Apes").accounts(
                {
                    bigGuardian,
                    governor: this._governor,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    treasury: this._sol_treasury,
                    masterEdition,
                    metadata: metadataAddress,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    mint: mintKey.publicKey,
                    mintAuthority: publicKey,
                    updateAuthority: publicKey,
                    tokenAccount: nftTokenAccount.publicKey,
                    owner: publicKey,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    assetBasket: assetBasketAddress
                }
            ).instruction();

            mint_tx.add(ix)

            const recentBlockhash = await this._provider.connection.getLatestBlockhash("confirmed");
            console.log('recentBlockhash', recentBlockhash)

            mint_tx.recentBlockhash = recentBlockhash.blockhash;
            mint_tx.feePayer = publicKey;


            mint_tx.partialSign(mintKey);
            mint_tx.partialSign(nftTokenAccount);

            const serialized_tx = mint_tx.serialize({
                requireAllSignatures: false
            });
            console.log('serialized_tx', serialized_tx)

            const txToBase64 = serialized_tx.toString("base64")
            console.log("Tx: ", txToBase64);
            return [txToBase64, null]

        } catch (err) {
            console.log({err})
            return [null, err]
        }
    }

}
