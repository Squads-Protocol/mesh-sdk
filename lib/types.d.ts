import { Mesh } from "./mesh-types/mesh";
import { Idl, IdlTypes, MethodsNamespace } from "@project-serum/anchor";
import { IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";
import { AllInstructions, TypeDef } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { PublicKey } from "@solana/web3.js";
import { MethodsBuilder } from "@project-serum/anchor/dist/cjs/program/namespace/methods";
declare type TypeDefDictionary<T extends IdlTypeDef[], Defined> = {
    [K in T[number]["name"]]: TypeDef<T[number] & {
        name: K;
    }, Defined> & {
        publicKey: PublicKey;
    };
};
declare type AccountDefDictionary<T extends Idl> = TypeDefDictionary<NonNullable<T["accounts"]>, IdlTypes<T>>;
export declare type MultisigAccount = AccountDefDictionary<Mesh>["ms"];
export declare type TransactionAccount = AccountDefDictionary<Mesh>["msTransaction"];
export declare type InstructionAccount = AccountDefDictionary<Mesh>["msInstruction"];
export declare type SquadsMethods = MethodsBuilder<Mesh, AllInstructions<Mesh>>;
export declare type SquadsMethodsNamespace = MethodsNamespace<Mesh, AllInstructions<Mesh>>;
export {};
