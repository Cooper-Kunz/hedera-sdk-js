import { TransactionBuilder } from "../TransactionBuilder";
import { Transaction } from "../generated/Transaction_pb";
import { TransactionResponse } from "../generated/TransactionResponse_pb";
import { grpc } from "@improbable-eng/grpc-web";
import { CryptoUpdateTransactionBody } from "../generated/CryptoUpdate_pb";
import { newDuration } from "../util";
import { CryptoService } from "../generated/CryptoService_pb_service";
import { Hbar, Tinybar } from "../Hbar";
import UnaryMethodDefinition = grpc.UnaryMethodDefinition;
import { PublicKey } from "../crypto/PublicKey";
import { AccountId, AccountIdLike } from "./AccountId";
import { dateToTimestamp, timestampToProto } from "../Timestamp";
import { BoolValue } from "google-protobuf/google/protobuf/wrappers_pb";

export class AccountUpdateTransaction extends TransactionBuilder {
    private _body: CryptoUpdateTransactionBody;

    public constructor() {
        super();
        const body = new CryptoUpdateTransactionBody();
        this._body = body;
        this._inner.setCryptoupdateaccount(body);
    }

    public setAccountId(id: AccountIdLike): this {
        this._body.setAccountidtoupdate(new AccountId(id)._toProto());
        return this;
    }

    public setKey(publicKey: PublicKey): this {
        this._body.setKey(publicKey._toProtoKey());
        return this;
    }

    public setExpirationTime(date: number | Date): this {
        this._body.setExpirationtime(timestampToProto(dateToTimestamp(date)));
        return this;
    }

    public setAutoRenewPeriod(seconds: number): this {
        this._body.setAutorenewperiod(newDuration(seconds));
        return this;
    }

    public setProxyAccountId(id: AccountId): this {
        this._body.setProxyaccountid(id._toProto());
        return this;
    }

    public setPorxyAccount(id: AccountId): this {
        console.warn("deprecated: `.setPorxyAccount` was renamed to `.setProxyAccountId`");
        return this.setProxyAccountId(id);
    }

    public setReceiverSignatureRequired(required: boolean): this {
        const value = new BoolValue();
        value.setValue(required);
        this._body.setReceiversigrequiredwrapper(value);
        return this;
    }

    public setReceiveRecordThreshold(threshold: Tinybar | Hbar): this {
        const hbar = typeof threshold === "number" ? Hbar.fromTinybar(threshold) : threshold as Hbar;
        hbar._check({ allowNegative: false });

        this._body.setReceiverecordthresholdwrapper(hbar._toProtoValue());
        return this;
    }

    public setSendRecordThreshold(threshold: Tinybar | Hbar): this {
        const hbar = typeof threshold === "number" ? Hbar.fromTinybar(threshold) : threshold as Hbar;
        hbar._check({ allowNegative: false });

        this._body.setSendrecordthresholdwrapper(hbar._toProtoValue());
        return this;
    }

    protected get _method(): UnaryMethodDefinition<Transaction, TransactionResponse> {
        return CryptoService.updateAccount;
    }

    protected _doValidate(errors: string[]): void {
        if (!this._body.hasAccountidtoupdate()) {
            errors.push("AccountUpdateTransaction requires .setAccountId()");
        }
    }
}
