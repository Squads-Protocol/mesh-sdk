import { MultisigAccount, SquadsMethodsNamespace } from "./types";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";
export interface InstructionAuthority {
    authorityIndex: number | null;
    authorityBump: number | null;
    authorityType: string | null;
}
export interface AuthorizedInstruction {
    instruction: TransactionInstruction;
    authority: InstructionAuthority;
}
export declare class TransactionBuilder {
    multisig: MultisigAccount;
    authorityIndex: number;
    private readonly methods;
    private readonly provider;
    readonly programId: PublicKey;
    private instructions;
    constructor(methods: SquadsMethodsNamespace, provider: AnchorProvider, multisig: MultisigAccount, authorityIndex: number, programId: PublicKey, instructions?: AuthorizedInstruction[]);
    private static _buildAuthorizedInstruction;
    private _buildAddInstruction;
    private _cloneWithInstructions;
    transactionPDA(): PublicKey;
    withInstruction(instruction: TransactionInstruction, authority?: InstructionAuthority): TransactionBuilder;
    /**
     * The 'authority' param can be provided as a single value or as an array of values.
     * When provided as a single value, the same authority information will be associated with all instructions.
     * When provided as an array of values, the authorities will be matched to instructions by index.
     */
    withInstructions(instructions: TransactionInstruction[], authority?: InstructionAuthority | InstructionAuthority[]): TransactionBuilder;
    getInstructions(): Promise<[TransactionInstruction[], PublicKey]>;
    executeInstructions(): Promise<[TransactionInstruction[], PublicKey]>;
}
