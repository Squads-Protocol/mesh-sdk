export declare type Mesh = {
    "version": "0.0.1";
    "name": "mesh";
    "instructions": [
        {
            "name": "create";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "creator";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "externalAuthority";
                    "type": "publicKey";
                },
                {
                    "name": "threshold";
                    "type": "u16";
                },
                {
                    "name": "createKey";
                    "type": "publicKey";
                },
                {
                    "name": "members";
                    "type": {
                        "vec": "publicKey";
                    };
                }
            ];
        },
        {
            "name": "addMember";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "newMember";
                    "type": "publicKey";
                }
            ];
        },
        {
            "name": "removeMember";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "oldMember";
                    "type": "publicKey";
                }
            ];
        },
        {
            "name": "removeMemberAndChangeThreshold";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "oldMember";
                    "type": "publicKey";
                },
                {
                    "name": "newThreshold";
                    "type": "u16";
                }
            ];
        },
        {
            "name": "addMemberAndChangeThreshold";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "newMember";
                    "type": "publicKey";
                },
                {
                    "name": "newThreshold";
                    "type": "u16";
                }
            ];
        },
        {
            "name": "changeThreshold";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "newThreshold";
                    "type": "u16";
                }
            ];
        },
        {
            "name": "addAuthority";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [];
        },
        {
            "name": "setExternalExecute";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "setting";
                    "type": "bool";
                }
            ];
        },
        {
            "name": "createTransaction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "creator";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "authorityIndex";
                    "type": "u32";
                }
            ];
        },
        {
            "name": "activateTransaction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "creator";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "addInstruction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "instruction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "creator";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "incomingInstruction";
                    "type": {
                        "defined": "IncomingInstruction";
                    };
                },
                {
                    "name": "authorityIndex";
                    "type": {
                        "option": "u32";
                    };
                },
                {
                    "name": "authorityBump";
                    "type": {
                        "option": "u8";
                    };
                },
                {
                    "name": "authorityType";
                    "type": {
                        "defined": "MsAuthorityType";
                    };
                }
            ];
        },
        {
            "name": "approveTransaction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "member";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "rejectTransaction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "member";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "cancelTransaction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "member";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "executeTransaction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "member";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "accountList";
                    "type": "bytes";
                }
            ];
        },
        {
            "name": "executeInstruction";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transaction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "instruction";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "member";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [];
        },
        {
            "name": "changeExternalAuthority";
            "accounts": [
                {
                    "name": "multisig";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "externalAuthority";
                    "isMut": true;
                    "isSigner": true;
                }
            ];
            "args": [
                {
                    "name": "newAuthority";
                    "type": "publicKey";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "ms";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "threshold";
                        "type": "u16";
                    },
                    {
                        "name": "authorityIndex";
                        "type": "u16";
                    },
                    {
                        "name": "transactionIndex";
                        "type": "u32";
                    },
                    {
                        "name": "msChangeIndex";
                        "type": "u32";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    },
                    {
                        "name": "createKey";
                        "type": "publicKey";
                    },
                    {
                        "name": "allowExternalExecute";
                        "type": "bool";
                    },
                    {
                        "name": "keys";
                        "type": {
                            "vec": "publicKey";
                        };
                    },
                    {
                        "name": "externalAuthority";
                        "type": "publicKey";
                    }
                ];
            };
        },
        {
            "name": "msTransaction";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "creator";
                        "type": "publicKey";
                    },
                    {
                        "name": "ms";
                        "type": "publicKey";
                    },
                    {
                        "name": "transactionIndex";
                        "type": "u32";
                    },
                    {
                        "name": "authorityIndex";
                        "type": "u32";
                    },
                    {
                        "name": "authorityBump";
                        "type": "u8";
                    },
                    {
                        "name": "status";
                        "type": {
                            "defined": "MsTransactionStatus";
                        };
                    },
                    {
                        "name": "instructionIndex";
                        "type": "u8";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    },
                    {
                        "name": "approved";
                        "type": {
                            "vec": "publicKey";
                        };
                    },
                    {
                        "name": "rejected";
                        "type": {
                            "vec": "publicKey";
                        };
                    },
                    {
                        "name": "cancelled";
                        "type": {
                            "vec": "publicKey";
                        };
                    },
                    {
                        "name": "executedIndex";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "msInstruction";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "programId";
                        "type": "publicKey";
                    },
                    {
                        "name": "keys";
                        "type": {
                            "vec": {
                                "defined": "MsAccountMeta";
                            };
                        };
                    },
                    {
                        "name": "data";
                        "type": "bytes";
                    },
                    {
                        "name": "instructionIndex";
                        "type": "u8";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    },
                    {
                        "name": "authorityType";
                        "type": {
                            "defined": "MsAuthorityType";
                        };
                    },
                    {
                        "name": "authorityIndex";
                        "type": {
                            "option": "u32";
                        };
                    },
                    {
                        "name": "authorityBump";
                        "type": {
                            "option": "u8";
                        };
                    },
                    {
                        "name": "executed";
                        "type": "bool";
                    }
                ];
            };
        }
    ];
    "types": [
        {
            "name": "MsAccountMeta";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "pubkey";
                        "type": "publicKey";
                    },
                    {
                        "name": "isSigner";
                        "type": "bool";
                    },
                    {
                        "name": "isWritable";
                        "type": "bool";
                    }
                ];
            };
        },
        {
            "name": "IncomingInstruction";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "programId";
                        "type": "publicKey";
                    },
                    {
                        "name": "keys";
                        "type": {
                            "vec": {
                                "defined": "MsAccountMeta";
                            };
                        };
                    },
                    {
                        "name": "data";
                        "type": "bytes";
                    }
                ];
            };
        },
        {
            "name": "MsTransactionStatus";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Draft";
                    },
                    {
                        "name": "Active";
                    },
                    {
                        "name": "ExecuteReady";
                    },
                    {
                        "name": "Executed";
                    },
                    {
                        "name": "Rejected";
                    },
                    {
                        "name": "Cancelled";
                    }
                ];
            };
        },
        {
            "name": "MsAuthorityType";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Default";
                    },
                    {
                        "name": "Custom";
                    }
                ];
            };
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "KeyNotInMultisig";
        },
        {
            "code": 6001;
            "name": "InvalidTransactionState";
        },
        {
            "code": 6002;
            "name": "InvalidNumberOfAccounts";
        },
        {
            "code": 6003;
            "name": "InvalidInstructionAccount";
        },
        {
            "code": 6004;
            "name": "InvalidAuthorityIndex";
        },
        {
            "code": 6005;
            "name": "InvalidAuthorityType";
        },
        {
            "code": 6006;
            "name": "TransactionAlreadyExecuted";
        },
        {
            "code": 6007;
            "name": "CannotRemoveSoloMember";
        },
        {
            "code": 6008;
            "name": "InvalidThreshold";
        },
        {
            "code": 6009;
            "name": "DeprecatedTransaction";
        },
        {
            "code": 6010;
            "name": "InstructionFailed";
        },
        {
            "code": 6011;
            "name": "MaxMembersReached";
        },
        {
            "code": 6012;
            "name": "EmptyMembers";
        },
        {
            "code": 6013;
            "name": "PartialExecution";
        },
        {
            "code": 6014;
            "name": "InvalidExternalAuthority";
        }
    ];
};
export declare const IDL: Mesh;
