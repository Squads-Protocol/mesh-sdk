import {
  MultisigAccount,
  SquadsMethodsNamespace,
} from "./types";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { getAuthorityPDA, getIxPDA, getTxPDA } from "./address";
import BN from "bn.js";
import { AnchorProvider } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";

export class TransactionBuilder {
  multisig: MultisigAccount;
  authorityIndex: number;
  private readonly methods: SquadsMethodsNamespace;
  private readonly provider: AnchorProvider;
  readonly programId: PublicKey;
  private instructions: TransactionInstruction[];
  constructor(
    methods: SquadsMethodsNamespace,
    provider: AnchorProvider,
    multisig: MultisigAccount,
    authorityIndex: number,
    programId: PublicKey,
    instructions?: TransactionInstruction[]
  ) {
    this.methods = methods;
    this.provider = provider;
    this.multisig = multisig;
    this.authorityIndex = authorityIndex;
    this.programId = programId;
    this.instructions = instructions ?? [];
  }

  private async _buildAddInstruction(
    transactionPDA: PublicKey,
    instruction: TransactionInstruction,
    instructionIndex: number,
    authorityIndex: number,
    authorityBump: number,
    authorityType: string,
  ): Promise<TransactionInstruction> {
    const [instructionPDA] = getIxPDA(
      transactionPDA,
      new BN(instructionIndex, 10),
      this.programId
    );
    return await this.methods
      .addInstruction(
        instruction,
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
    instructions: TransactionInstruction[]
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
  withInstruction(instruction: TransactionInstruction): TransactionBuilder {
    return this._cloneWithInstructions(this.instructions.concat(instruction));
  }
  withInstructions(instructions: TransactionInstruction[]): TransactionBuilder {
    const newInstructions = [];
    for (let i = 0; i < instructions.length; i++) {
      newInstructions.push(instructions[i]);
    }
    return this._cloneWithInstructions(
      this.instructions.concat(newInstructions)
    );
  }


  async getInstructions(): Promise<[TransactionInstruction[], PublicKey]> {
    const transactionPDA = this.transactionPDA();
    // const wrappedAddInstructions = await Promise.all(
    //   this.instructions.map((rawInstruction, index) =>
    //     this._buildAddInstruction(transactionPDA, rawInstruction, index + 1)
    //   )
    // );

    const wrappedAddInstructions = this.instructions;
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
