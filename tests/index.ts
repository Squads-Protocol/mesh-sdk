import { assert, expect } from "chai";
import { describe } from "mocha";
import Squads, { getAuthorityPDA, getMsPDA } from "../src/index";
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
  console.log("**** TESTING SQUADS SDK ****");
  this.beforeAll(async function(){
    squad = Squads.devnet(wallet);
  });

  describe("Basic Functionality", async function(){

    it("Constructs Squads object", function(){
      
      expect(squad.connection.rpcEndpoint).to.equal("https://api.devnet.solana.com");
      assert(squad.multisigProgramId.equals(DEFAULT_MULTISIG_PROGRAM_ID));
    });

    it("Create a Squad", async function(){
      await squad.connection.requestAirdrop(keypair.publicKey, web3.LAMPORTS_PER_SOL);

      const initialMembers = [
        web3.Keypair.generate().publicKey,
        web3.Keypair.generate().publicKey,
        web3.Keypair.generate().publicKey,
      ];

      const multisig = await squad.createMultisig(keypair.publicKey, 1, createKey, initialMembers);
      expect(multisig.keys.length).to.equal(initialMembers.length);
      expect(multisig.threshold).to.equal(1);
      expect(multisig.publicKey.toBase58()).to.equal(ms.toBase58());
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
