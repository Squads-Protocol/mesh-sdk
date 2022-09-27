"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIxAuthorityPDA = exports.getAuthorityPDA = exports.getIxPDA = exports.getTxPDA = exports.getMsPDA = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const getMsPDA = (create_key, programId) => web3_js_1.PublicKey.findProgramAddressSync([
    anchor_1.utils.bytes.utf8.encode("squad"),
    create_key.toBuffer(),
    anchor_1.utils.bytes.utf8.encode("multisig"),
], programId);
exports.getMsPDA = getMsPDA;
const getTxPDA = (msPDA, txIndexBN, programId) => web3_js_1.PublicKey.findProgramAddressSync([
    anchor_1.utils.bytes.utf8.encode("squad"),
    msPDA.toBuffer(),
    txIndexBN.toArrayLike(Buffer, "le", 4),
    anchor_1.utils.bytes.utf8.encode("transaction"),
], programId);
exports.getTxPDA = getTxPDA;
const getIxPDA = (txPDA, iXIndexBN, programId) => web3_js_1.PublicKey.findProgramAddressSync([
    anchor_1.utils.bytes.utf8.encode("squad"),
    txPDA.toBuffer(),
    iXIndexBN.toArrayLike(Buffer, "le", 1),
    anchor_1.utils.bytes.utf8.encode("instruction"),
], programId);
exports.getIxPDA = getIxPDA;
const getAuthorityPDA = (msPDA, authorityIndexBN, programId) => web3_js_1.PublicKey.findProgramAddressSync([
    anchor_1.utils.bytes.utf8.encode("squad"),
    msPDA.toBuffer(),
    authorityIndexBN.toArrayLike(Buffer, "le", 4),
    anchor_1.utils.bytes.utf8.encode("authority"),
], programId);
exports.getAuthorityPDA = getAuthorityPDA;
const getIxAuthorityPDA = (txPDA, authorityIndexBN, programId) => web3_js_1.PublicKey.findProgramAddressSync([
    anchor_1.utils.bytes.utf8.encode("squad"),
    txPDA.toBuffer(),
    authorityIndexBN.toArrayLike(Buffer, "le", 4),
    anchor_1.utils.bytes.utf8.encode("ix_authority"),
], programId);
exports.getIxAuthorityPDA = getIxAuthorityPDA;
