import {
  MultisigAccount,
  SquadsMethodsNamespace,
} from "./types";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { getIxPDA, getTxPDA } from "./address";
import BN from "bn.js";
import { AnchorProvider } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";

export interface InstructionAuthority {
  authorityIndex: number | null;
  authorityBump: number | null;
  authorityType: string | null;
}

export interface AuthorizedInstruction {
  instruction: TransactionInstruction,
  authority: InstructionAuthority
}

export class TransactionBuilder {
  multisig: MultisigAccount;
  authorityIndex: number;
  private readonly methods: SquadsMethodsNamespace;
  private readonly provider: AnchorProvider;
  readonly programId: PublicKey;
  private instructions: AuthorizedInstruction[];
  constructor(
    methods: SquadsMethodsNamespace,
    provider: AnchorProvider,
    multisig: MultisigAccount,
    authorityIndex: number,
    programId: PublicKey,
    instructions?: AuthorizedInstruction[]
  ) {
    this.methods = methods;
    this.provider = provider;
    this.multisig = multisig;
    this.authorityIndex = authorityIndex;
    this.programId = programId;
    this.instructions = instructions ?? [];
  }

  private static _buildAuthorizedInstruction(instruction: TransactionInstruction, authority?: InstructionAuthority): AuthorizedInstruction {
    const {
      authorityIndex = null,
      authorityBump = null,
      authorityType = null
    } = authority || {};
    return {
      instruction,
      authority: {
        authorityIndex,
        authorityBump,
        authorityType
      }
    }
  }
  private async _buildAddInstruction(
    transactionPDA: PublicKey,
    instruction: AuthorizedInstruction,
    instructionIndex: number
  ): Promise<TransactionInstruction> {
    const [instructionPDA] = getIxPDA(
      transactionPDA,
      new BN(instructionIndex, 10),
      this.programId
    );
    const {
      authorityIndex,
      authorityBump,
      authorityType
    } = instruction.authority;
    return await this.methods
      .addInstruction(
        instruction.instruction,
        authorityIndex,
        authorityBump,
        (authorityType === "custom") ? {custom:{}} : {default:{}}
      )
      .accounts({
        multisig: this.multisig.publicKey,
        transaction: transactionPDA,
        instruction: instructionPDA,
        creator: this.provider.wallet.publicKey,
      })
      .instruction();
  }

  private _cloneWithInstructions(
    instructions: AuthorizedInstruction[]
  ): TransactionBuilder {
    return new TransactionBuilder(
      this.methods,
      this.provider,
      this.multisig,
      this.authorityIndex,
      this.programId,
      instructions
    );
  }
  transactionPDA() {
    const [transactionPDA] = getTxPDA(
      this.multisig.publicKey,
      new BN(this.multisig.transactionIndex + 1),
      this.programId
    );
    return transactionPDA;
  }
  withInstruction(instruction: TransactionInstruction, authority?: InstructionAuthority): TransactionBuilder {
    return this._cloneWithInstructions(this.instructions.concat(TransactionBuilder._buildAuthorizedInstruction(instruction, authority)));
  }

  /**
   * The 'authority' param can be provided as a single value or as an array of values.
   * When provided as a single value, the same authority information will be associated with all instructions.
   * When provided as an array of values, the authorities will be matched to instructions by index.
   */
  withInstructions(instructions: TransactionInstruction[], authority?: InstructionAuthority | InstructionAuthority[]): TransactionBuilder {
    const authorizedInstructions = [];
    if (Array.isArray(authority)) {
      if (authority.length < instructions.length) {
        throw new Error("withInstructions: Provided authority array must cover entire instructions array")
      }
      for (let i = 0; i < instructions.length; i++) {
        authorizedInstructions.push(TransactionBuilder._buildAuthorizedInstruction(instructions[i], authority[i]));
      }
    } else {
      authorizedInstructions.push(...instructions.map((instruction) => TransactionBuilder._buildAuthorizedInstruction(instruction, authority)))
    }
    return this._cloneWithInstructions(
      this.instructions.concat(authorizedInstructions)
    );
  }


  async getInstructions(): Promise<[TransactionInstruction[], PublicKey]> {
    const transactionPDA = this.transactionPDA();
    const wrappedAddInstructions = await Promise.all(
      this.instructions.map((rawInstruction, index) =>
        this._buildAddInstruction(transactionPDA, rawInstruction, index + 1)
      )
    );
    const createTxInstruction = await this.methods
      .createTransaction(this.authorityIndex)
      .accounts({
        multisig: this.multisig.publicKey,
        transaction: transactionPDA,
        creator: this.provider.wallet.publicKey,
      })
      .instruction();
    const instructions = [createTxInstruction, ...wrappedAddInstructions];
    this.instructions = [];
    return [instructions, transactionPDA];
  }

  async executeInstructions(): Promise<[TransactionInstruction[], PublicKey]> {
    const [instructions, transactionPDA] = await this.getInstructions();
    const { blockhash } = await this.provider.connection.getLatestBlockhash();
    const lastValidBlockHeight =
      await this.provider.connection.getBlockHeight();
    const transaction = new anchor.web3.Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: this.provider.wallet.publicKey,
    });
    transaction.add(...instructions);
    await this.provider.sendAndConfirm(transaction);
    return [instructions, transactionPDA];
  }
}
