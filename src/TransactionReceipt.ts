import { TransactionReceipt as ProtoTransactionReceipt } from "./generated/TransactionReceipt_pb";
import { AccountId } from "./account/AccountId";
import { ConsensusTopicId } from "./consensus/ConsensusTopicId";
import { ContractId } from "./contract/ContractId";
import { FileId } from "./file/FileId";
import { ExchangeRateSet, exchangeRateSetToSdk } from "./ExchangeRate";
import { Status } from "./Status";

export class TransactionReceipt {
    public readonly status: Status;

    private readonly _accountId: AccountId | null;
    private readonly _fileId: FileId | null;
    private readonly _contractId: ContractId | null;
    private readonly _topicId: ConsensusTopicId | null;
    private readonly _exchangeRateSet: ExchangeRateSet | null;
    private readonly _topicSequenceNubmer: number;
    private readonly _topicRunningHash: Uint8Array;

    private constructor(
        status: Status,
        accountId: AccountId | null,
        fileId: FileId | null,
        contractId: ContractId | null,
        topicId: ConsensusTopicId | null,
        exchangeRateSet: ExchangeRateSet | null,
        topicSequenceNubmer: number,
        topicRunningHash: Uint8Array
    ) {
        this.status = status;
        this._accountId = accountId;
        this._fileId = fileId;
        this._contractId = contractId;
        this._topicId = topicId;
        this._exchangeRateSet = exchangeRateSet;
        this._topicSequenceNubmer = topicSequenceNubmer;
        this._topicRunningHash = topicRunningHash;
    }

    public getAccountId(): AccountId {
        // TODO: Assert that account ID is not null and throw an explicit error
        return this._accountId!;
    }

    public getFileId(): FileId {
        // TODO: Assert that file ID is not null and throw an explicit error
        return this._fileId!;
    }

    public getContractId(): ContractId {
        // TODO: Assert that file ID is not null and throw an explicit error
        return this._contractId!;
    }

    public getConsensusTopicId(): ConsensusTopicId {
        // TODO: Assert that topic ID is not null and throw an explicit error
        return this._topicId!;
    }

    /** @deprecated `TransactionReceipt.getTopicId()` is deprecrated. Use `TransactionReceipt.getConsensusTopicId()` instead. */
    public getTopicId(): ConsensusTopicId {
        console.warn("`TransactionReceipt.getTopicId()` is deprecrated. Use `TransactionReceipt.getConsensusTopicId()` instead.");
        return this.getConsensusTopicId();
    }

    public getConsensusTopicRunningHash(): Uint8Array {
        // TODO: Assert that topic ID is not null and throw an explicit error
        return this._topicRunningHash;
    }

    public getConsensusTopicSequenceNumber(): number {
        // TODO: Assert that topic ID is not null and throw an explicit error
        return this._topicSequenceNubmer;
    }

    // NOT A STABLE API
    public static _fromProto(receipt: ProtoTransactionReceipt): TransactionReceipt {
        return new TransactionReceipt(
            new Status(receipt.getStatus()),
            receipt.hasAccountid() ? AccountId._fromProto(receipt.getAccountid()!) : null,
            receipt.hasFileid() ? FileId._fromProto(receipt.getFileid()!) : null,
            receipt.hasContractid() ?
                ContractId._fromProto(receipt.getContractid()!) :
                null,
            receipt.hasTopicid() ?
                ConsensusTopicId._fromProto(receipt.getTopicid()!) :
                null,
            receipt.hasExchangerate() ?
                exchangeRateSetToSdk(receipt.getExchangerate()!) :
                null,
            receipt.getTopicsequencenumber(),
            receipt.getTopicrunninghash_asU8()
        );
    }
}
