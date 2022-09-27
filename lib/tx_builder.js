"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBuilder = void 0;
const address_1 = require("./address");
const bn_js_1 = __importDefault(require("bn.js"));
const anchor = __importStar(require("@project-serum/anchor"));
class TransactionBuilder {
    constructor(methods, provider, multisig, authorityIndex, programId, instructions) {
        this.methods = methods;
        this.provider = provider;
        this.multisig = multisig;
        this.authorityIndex = authorityIndex;
        this.programId = programId;
        this.instructions = instructions !== null && instructions !== void 0 ? instructions : [];
    }
    static _buildAuthorizedInstruction(instruction, authority) {
        const { authorityIndex = null, authorityBump = null, authorityType = null, } = authority || {};
        return {
            instruction,
            authority: {
                authorityIndex,
                authorityBump,
                authorityType,
            },
        };
    }
    _buildAddInstruction(transactionPDA, instruction, instructionIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const [instructionPDA] = (0, address_1.getIxPDA)(transactionPDA, new bn_js_1.default(instructionIndex, 10), this.programId);
            const { authorityIndex, authorityBump, authorityType } = instruction.authority;
            return yield this.methods
                .addInstruction(instruction.instruction, authorityIndex, authorityBump, authorityType === "custom" ? { custom: {} } : { default: {} })
                .accounts({
                multisig: this.multisig.publicKey,
                transaction: transactionPDA,
                instruction: instructionPDA,
                creator: this.provider.wallet.publicKey,
            })
                .instruction();
        });
    }
    _cloneWithInstructions(instructions) {
        return new TransactionBuilder(this.methods, this.provider, this.multisig, this.authorityIndex, this.programId, instructions);
    }
    transactionPDA() {
        const [transactionPDA] = (0, address_1.getTxPDA)(this.multisig.publicKey, new bn_js_1.default(this.multisig.transactionIndex + 1), this.programId);
        return transactionPDA;
    }
    withInstruction(instruction, authority) {
        return this._cloneWithInstructions(this.instructions.concat(TransactionBuilder._buildAuthorizedInstruction(instruction, authority)));
    }
    /**
     * The 'authority' param can be provided as a single value or as an array of values.
     * When provided as a single value, the same authority information will be associated with all instructions.
     * When provided as an array of values, the authorities will be matched to instructions by index.
     */
    withInstructions(instructions, authority) {
        const authorizedInstructions = [];
        if (Array.isArray(authority)) {
            if (authority.length < instructions.length) {
                throw new Error("withInstructions: Provided authority array must cover entire instructions array");
            }
            for (let i = 0; i < instructions.length; i++) {
                authorizedInstructions.push(TransactionBuilder._buildAuthorizedInstruction(instructions[i], authority[i]));
            }
        }
        else {
            authorizedInstructions.push(...instructions.map((instruction) => TransactionBuilder._buildAuthorizedInstruction(instruction, authority)));
        }
        return this._cloneWithInstructions(this.instructions.concat(authorizedInstructions));
    }
    getInstructions() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionPDA = this.transactionPDA();
            const wrappedAddInstructions = yield Promise.all(this.instructions.map((rawInstruction, index) => this._buildAddInstruction(transactionPDA, rawInstruction, index + 1)));
            const createTxInstruction = yield this.methods
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
        });
    }
    executeInstructions() {
        return __awaiter(this, void 0, void 0, function* () {
            const [instructions, transactionPDA] = yield this.getInstructions();
            const { blockhash } = yield this.provider.connection.getLatestBlockhash();
            const lastValidBlockHeight = yield this.provider.connection.getBlockHeight();
            const transaction = new anchor.web3.Transaction({
                blockhash,
                lastValidBlockHeight,
                feePayer: this.provider.wallet.publicKey,
            });
            transaction.add(...instructions);
            yield this.provider.sendAndConfirm(transaction);
            return [instructions, transactionPDA];
        });
    }
}
exports.TransactionBuilder = TransactionBuilder;
