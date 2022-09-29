import { assert, expect } from "chai";
import { describe } from "mocha";
import Squads, { getAuthorityPDA, getIxPDA, getMsPDA, getTxPDA } from "../src/index";
import { Wallet, web3, BN } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const DEFAULT_MULTISIG_PROGRAM_ID = new web3.PublicKey(
  "SMPLVC8MxZ5Bf5EfF7PaMiTCxoBAcmkbM2vkrvMK8ho"
);

describe("Squads SDK", async function(){
  const keypair: web3.Keypair = web3.Keypair.generate();
  const wallet: Wallet = new NodeWallet(keypair);
  const createKey = web3.Keypair.generate().publicKey;
  const [ms] = getMsPDA(createKey, DEFAULT_MULTISIG_PROGRAM_ID);
  let squad;
  console.log("**** TESTING SQUADS MESH SDK ****");
  this.beforeAll(async function(){
    squad = Squads.devnet(wallet);
    const signature = await squad.connection.requestAirdrop(keypair.publicKey, web3.LAMPORTS_PER_SOL, "confirmed");
    await squad.connection.confirmTransaction(signature, "confirmed");
    return Promise.resolve();
  });

  describe("Basic Functionality", async function(){
    const initialMembers = [
      web3.Keypair.generate().publicKey,
      web3.Keypair.generate().publicKey,
      web3.Keypair.generate().publicKey,
    ];

    it("Constructs Squads object", function(){
      expect(squad.connection.rpcEndpoint).to.equal("https://api.devnet.solana.com");
      assert(squad.multisigProgramId.equals(DEFAULT_MULTISIG_PROGRAM_ID));
    });

    it("Create a Squad", async function(){
      const multisig = await squad.createMultisig(keypair.publicKey, 1, createKey, initialMembers);
      expect(multisig.keys.length).to.equal(initialMembers.length);
      expect(multisig.threshold).to.equal(1);
      expect(multisig.publicKey.toBase58()).to.equal(ms.toBase58());
    });

    it("Add member, directly invoke", async function(){
      const newMember = web3.Keypair.generate().publicKey;
      await squad.addMember(ms, keypair.publicKey, newMember);
      const msState = await squad.getMultisig(ms);
      expect(msState.keys.length).to.equal(initialMembers.length + 1);
    });

    it("Set external authority to an auth pda", async function(){
      this.timeout(5000);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const [newExternalAuthority] = await getAuthorityPDA(ms, new BN(1), DEFAULT_MULTISIG_PROGRAM_ID);
      await squad.changeExternalAuthority(ms, keypair.publicKey, newExternalAuthority);
      const msState = await squad.getMultisig(ms);
      expect(msState.externalAuthority.toBase58()).to.equal(newExternalAuthority.toBase58());
    });

    it("Remove a member via a normal tx", async function(){
      this.timeout(15000);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      // airdrop to vault incase needed for realloc
      const [vault] = await getAuthorityPDA(ms, new BN(1), DEFAULT_MULTISIG_PROGRAM_ID);
      const signature = await squad.connection.requestAirdrop(vault, web3.LAMPORTS_PER_SOL, "confirmed");
      await squad.connection.confirmTransaction(signature, "confirmed");
      // get multisig current state
      const multisig = await squad.getMultisig(ms);
      // get next tx index
      const nextTxIndex = await squad.getNextTransactionIndex(ms);
      // get tx pda
      const [tx] = await getTxPDA(ms, new BN(nextTxIndex), DEFAULT_MULTISIG_PROGRAM_ID);
      // get the create Tx instruction
      const createIx = await squad.buildCreateTransaction(ms, 1, nextTxIndex);
      // get the remove member instruction
      const removeMemberIx = await squad.buildRemoveMember(ms, multisig.externalAuthority, initialMembers[0]);
      // get the add instruction instruction
      const addIx = await squad.buildAddInstruction(
        ms,
        tx,
        removeMemberIx,
        1,
        null,
        null,
        "default"
      );
      // get the activate instruction
      const activateIx = await squad.buildActivateTransaction(ms, tx);
      // get the approve instruction
      const approveIx = await squad.buildApproveTransaction(ms, tx);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const {blockhash, lastValidBlockHeight} = await squad.connection.getLatestBlockhash();
      const removeMemberTransaction = new web3.Transaction({blockhash, lastValidBlockHeight});
      removeMemberTransaction.add(createIx);
      removeMemberTransaction.add(addIx);
      removeMemberTransaction.add(activateIx);
      removeMemberTransaction.add(approveIx);
      
      expect(removeMemberTransaction.instructions.length).to.equal(4);
      // run the create
      const txSignature = await squad.provider.sendAndConfirm(
        removeMemberTransaction,
        this.connection
      );

      // get the new state
      const txState = await squad.getTransaction(tx);
      expect(txState.status).to.have.property("executeReady");

      // execute
      const executeTx = await squad.executeTransaction(tx, keypair.publicKey);
      const newMultisigState = await squad.getMultisig(ms);
      expect(newMultisigState.keys.length).to.equal(multisig.keys.length - 1);
    });
  });

  describe("Tx Builder", async function(){
    it("Withdraw from multisig authority", async function(){
      let [vaultAuthority] = getAuthorityPDA(ms, new BN(1), DEFAULT_MULTISIG_PROGRAM_ID);
      let txBuilder = await squad.getTransactionBuilder(ms, 1);

      expect(txBuilder.authorityIndex).to.equal(1);
      txBuilder = await txBuilder.withInstructions([
        web3.SystemProgram.transfer({
          fromPubkey: vaultAuthority,
          toPubkey: keypair.publicKey,
          lamports: web3.LAMPORTS_PER_SOL * 0.01
        })
      ]);
      const [wrappedInstructions, txPDA] = await txBuilder.getInstructions();
      const {blockhash, lastValidBlockHeight} = await squad.connection.getLatestBlockhash();
      const msTransaction = new web3.Transaction({blockhash, lastValidBlockHeight});
      msTransaction.feePayer = keypair.publicKey;
      msTransaction.add(...wrappedInstructions);
      msTransaction.add(
        await squad.buildActivateTransaction(
          ms,
          txBuilder.transactionPDA()
        )
      );
      expect(msTransaction.instructions.length).to.equal(3);
      const txSignature = await squad.provider.sendAndConfirm(
        msTransaction,
        this.connection
      );

      const txState = await squad.getTransaction(txPDA);
      expect(txState.status).to.haveOwnProperty("active");
    });
  });
});
