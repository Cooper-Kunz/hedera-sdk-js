import { TransactionBuilder } from "../TransactionBuilder";
import { Transaction } from "../generated/Transaction_pb";
import { TransactionResponse } from "../generated/TransactionResponse_pb";
import { grpc } from "@improbable-eng/grpc-web";

import { FileService } from "../generated/FileService_pb_service";
import { KeyList } from "../generated/BasicTypes_pb";
import { FileUpdateTransactionBody } from "../generated/FileUpdate_pb";
import { FileId, FileIdLike } from "../file/FileId";
import { dateToTimestamp, timestampToProto } from "../Timestamp";
import { PublicKey } from "../crypto/PublicKey";
import { utf8encode } from "../util";

export class FileUpdateTransaction extends TransactionBuilder {
    private readonly _body: FileUpdateTransactionBody;

    public constructor() {
        super();
        this._body = new FileUpdateTransactionBody();
        this._inner.setFileupdate(this._body);
    }

    public setExpirationTime(date: number | Date): this {
        this._body.setExpirationtime(timestampToProto(dateToTimestamp(date)));
        return this;
    }

    public addKey(key: PublicKey): this {
        const keylist: KeyList = this._body.getKeys() == null ?
            new KeyList() :
            this._body.getKeys()!;

        keylist.addKeys(key._toProtoKey());
        this._body.setKeys(keylist);
        return this;
    }

    public setContents(contents: Uint8Array | string): this {
        const bytes = contents instanceof Uint8Array ?
            contents as Uint8Array :
            utf8encode(contents as string);

        this._body.setContents(bytes);
        return this;
    }

    public setFileId(fileIdLike: FileIdLike): this {
        this._body.setFileid(new FileId(fileIdLike)._toProto());
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected _doValidate(errors: string[]): void {
        // No validation
    }

    protected get _method(): grpc.UnaryMethodDefinition<Transaction, TransactionResponse> {
        return FileService.updateFile;
    }
}
