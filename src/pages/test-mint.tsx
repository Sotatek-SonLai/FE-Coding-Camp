import React from "react";
import {web3} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import {
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
} from "@solana/spl-token"
import {getMainIdl, getProvider} from "../programs/utils";
import mainProgram from "../programs/MainProgram";
import {GOVERNOR_ADDRESS, SOL_TREASURY_ADDRESS} from "../constants";
import {PublicKey} from "@solana/web3.js";


const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const getMetadata = async (mint: any) => {
    const [metadataPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID
    );

    return metadataPubkey;
};


const getMasterEdition = async (mint: any) => {
    const [masterEditionPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
        TOKEN_METADATA_PROGRAM_ID
    );

    return masterEditionPubkey;
};

const getAssetBasket = async (
    programID: any,
    governor: any,
    asset_owner: any,
    mint: any
) => {
    const [assetBasketPubkey, _] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("basket"), mint.toBuffer(), asset_owner.toBuffer(), governor.toBuffer()],
        programID
    );

    return assetBasketPubkey;
};


const TestMintPage: React.FC = () => {
    const {publicKey, connected} = useWallet()
    const wallet = useAnchorWallet();


    const x = async () => {
        try {const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"), "confirmed");
            console.log('connection',connection)
            const provider = getProvider(wallet);
            if(provider && publicKey){
                const program = new mainProgram(provider)
                await program.getSerializedTx(publicKey)
            }
        } catch {

        }
    }

    //
    /*140 176 ,
    * ký ở dòng 172, 173 (kys) => send to backend serialized_tx
    * mint xong BE trả về 1 transaction. FE cầm và gọi lên contract
    *
    * */

    // const test = async () => {
    //     const provider = getProvider(wallet);
    //     if (publicKey && provider) {
    //
    //         const mintKey = web3.Keypair.generate();
    //         const governor = new anchor.web3.PublicKey(GOVERNOR_ADDRESS)
    //         const sol_treasury = new anchor.web3.PublicKey(SOL_TREASURY_ADDRESS)
    //         const program = new mainProgram(provider)
    //
    //
    //         const lamports = await program._provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);
    //
    //         const mint_tx = new anchor.web3.Transaction().add(
    //             anchor.web3.SystemProgram.createAccount({
    //                 fromPubkey: publicKey,
    //                 newAccountPubkey: mintKey.publicKey,
    //                 space: MINT_SIZE,
    //                 programId: TOKEN_PROGRAM_ID,
    //                 lamports,
    //             }),
    //             createInitializeMintInstruction(mintKey.publicKey, 0, publicKey, publicKey, TOKEN_PROGRAM_ID),
    //         );
    //         console.log('program', program)
    //
    //         const metadataAddress = await getMetadata(mintKey.publicKey);
    //         const masterEdition = await getMasterEdition(mintKey.publicKey);
    //
    //         const assetBasketAddress = await getAssetBasket(
    //             program._program.programId,
    //             governor,
    //             publicKey,
    //             mintKey.publicKey
    //         );
    //
    //
    //         // first data will be signed by big guardian
    //         const ix = await program._program.methods.issueAsset("https://basc.s3.amazonaws.com/meta/3506.json", "Bored Apes").accounts(
    //             {
    //                 bigGuardian: program._provider.publicKey,
    //                 governor: governor,
    //                 rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //                 systemProgram: anchor.web3.SystemProgram.programId,
    //                 treasury: sol_treasury,
    //                 masterEdition,
    //                 metadata: metadataAddress,
    //                 tokenProgram: TOKEN_PROGRAM_ID,
    //                 mint: mintKey.publicKey,
    //                 mintAuthority: publicKey,
    //                 updateAuthority: publicKey,
    //                 tokenAccount: publicKey,
    //                 owner: publicKey,
    //                 tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    //                 assetBasket: assetBasketAddress
    //             }
    //         ).instruction();
    //
    //         mint_tx.add(ix)
    //         console.log('mint_tx', mint_tx)
    //
    //         const serialized_tx = mint_tx.serialize({
    //             requireAllSignatures: false
    //         });
    //         console.log('serialized_tx', serialized_tx)
    //
    //         console.log("Tx: ", serialized_tx.toString("base64"));
    //     }
    // }

    return (
        <div>
            <button onClick={x}>test</button>
        </div>
    )
}

export default TestMintPage
