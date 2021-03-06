import { TransactionBuilder } from "../TransactionBuilder";
import { Transaction } from "../generated/Transaction_pb";
import { TransactionResponse } from "../generated/TransactionResponse_pb";
import { grpc } from "@improbable-eng/grpc-web";

import { FileService } from "../generated/FileService_pb_service";
import { FileAppendTransactionBody } from "../generated/FileAppend_pb";
import { FileId, FileIdLike } from "../file/FileId";
import { utf8encode } from "../util";

export class FileAppendTransaction extends TransactionBuilder {
    private readonly _body: FileAppendTransactionBody;

    public constructor() {
        super();
        this._body = new FileAppendTransactionBody();
        this._inner.setFileappend(this._body);
    }

    public setFileId(fileId: FileIdLike): this {
        this._body.setFileid(new FileId(fileId)._toProto());
        return this;
    }

    public setContents(contents: Uint8Array | string): this {
        const bytes = contents instanceof Uint8Array ?
            contents as Uint8Array :
            utf8encode(contents as string);

        this._body.setContents(bytes);
        return this;
    }

    protected _doValidate(errors: string[]): void {
        const file = this._body.getFileid();
        const contents = this._body.getContents();

        if (file == null || contents == null) {
            errors.push("FileAppendTransaction must have a file id and contents set");
        }
    }

    protected get _method(): grpc.UnaryMethodDefinition<Transaction, TransactionResponse> {
        return FileService.appendContent;
    }
}
