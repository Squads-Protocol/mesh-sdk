# Squads Mesh Program SDK
This package provides classes and utilities to make it easier to interact with the Squads Mesh Program.

## Contents
- [Squads Mesh Program SDK](#squads-mesh-program-sdk)
  - [Contents](#contents)
  - [Get started](#get-started)
  - [Important Classes](#important-classes)
    - [Squads](#squads)
      - [Getters](#getters)
      - [Immediate Instructions](#immediate-instructions)
      - [Built Instructions](#built-instructions)

## Get started

```typescript
import Squads from "@sqds/mesh";

// By default, the canonical Program IDs for Squads Mesh Program will be used
// The 'wallet' passed in will be the signer/feePayer on all transactions through the Squads object.
const squads = Squads.localnet(wallet); // or Squads.devnet(...); Squads.mainnet(...)

const multisigAccount = await squads.createMultisig(externalAuthority, threshold, createKey, members);
```

Generally you will want to import the default `Squads` class from `@sqds/mesh` and pass in a `Wallet` instance. This would come from your preferred client-side wallet adapter or would likely be a `NodeWallet` if running server-side.

This class gives you access to essentially all instructions on the main Squads Mesh program.

For more information about the instructions and program capabilities, see the `https://github.com/squads-protocol/squads-mpl` README.

## Important Classes
### Squads
This class has an extensive interface covering instructions from both the main Squads-MPL program and the ProgramManager program. It is configured with a wallet, connection-related parameters, and program IDs. All operations that originate from the instance will use these parameters to send RPC requests, submit Transactions and pay fees.

#### Getters
Some of the methods on `Squads` are simple 'getters' which take an address (of something like a Multisig or an MsTransaction) and return the deserialized account data.
```typescript
const multisigAccount = await squads.getMultisig(...);
const multisigAccounts = await squads.getMultisigs([...]);
const msTransaction = await squads.getTransaction(...);
// etc.
```

#### Immediate Instructions
Other methods immediately execute an instruction against one of the configured program IDs and often return relevant account data.
```typescript
const multisigAccount = await squads.createMultisig(...);
const msInstruction = await squads.addInstruction(...);
const msTransaction = await squads.executeTransaction(...);
// etc.
```

#### Built Instructions
For most 'immediate' instructions, there is an alternate form which does not execute the instruction, but instead returns it so that the caller can handle wrapping it in a Transaction and sending it to the cluster. These can be identified by the prefix `build` in front of the immediate counterpart.
```typescript
const createMultisigInstruction = await squads.buildCreateMultisig(...);
const addInstructionInstruction = await squads.buildAddInstruction(...);
const executeTransactionInstruction = await squads.buildExecuteTransaction(...);

const tx = new Transaction(...);
tx.add(createMultisigInstruction, addInstructionInstruction, executeTransactionInstruction);
await squads.wallet.signTransaction(tx);
await sendAndConfirmTransaction(...);
// etc.
```
