import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export declare const getMsPDA: (create_key: PublicKey, programId: PublicKey) => [PublicKey, number];
export declare const getTxPDA: (msPDA: PublicKey, txIndexBN: BN, programId: PublicKey) => [PublicKey, number];
export declare const getIxPDA: (txPDA: PublicKey, iXIndexBN: BN, programId: PublicKey) => [PublicKey, number];
export declare const getAuthorityPDA: (msPDA: PublicKey, authorityIndexBN: BN, programId: PublicKey) => [PublicKey, number];
export declare const getIxAuthorityPDA: (txPDA: PublicKey, authorityIndexBN: BN, programId: PublicKey) => [PublicKey, number];
