import { assert, expect } from "chai";
import { describe } from "mocha";
import Squads from "../src/index";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Wallet, web3 } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const DEFAULT_MULTISIG_PROGRAM_ID = new PublicKey(
  "SMPLVC8MxZ5Bf5EfF7PaMiTCxoBAcmkbM2vkrvMK8ho"
);


describe("Squads SDK", () => {
  const keypair: Keypair = web3.Keypair.generate();
  const wallet: Wallet = new NodeWallet(keypair);
  console.log("**** TESTING SQUADS SDK ****");
  describe.skip("Basic Functionality", () => {
    it("Constructs Squads object", () => {
      const squad = Squads.localnet(wallet);
      expect(squad.connection.rpcEndpoint).to.equal("http://localhost:8899");
      assert(squad.multisigProgramId.equals(DEFAULT_MULTISIG_PROGRAM_ID));
    });
  });

  describe("Tx Builder", () => {
    const squad = Squads.localnet(wallet);

  });
});
