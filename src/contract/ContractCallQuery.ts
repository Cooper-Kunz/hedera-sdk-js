import { QueryBuilder } from "../QueryBuilder";
import { BaseClient } from "../BaseClient";
import { QueryHeader } from "../generated/QueryHeader_pb";
import { Query } from "../generated/Query_pb";
import { grpc } from "@improbable-eng/grpc-web";
import { Response } from "../generated/Response_pb";
import { SmartContractService } from "../generated/SmartContractService_pb_service";
import { ContractIdLike, contractIdToProto } from "../types/ContractId";
import { ContractFunctionResult, contractFunctionResultToSdk } from "../types/ContractFunctionResult";
import { ContractCallLocalQuery } from "../generated/ContractCallLocal_pb";

export class ContractCallQuery extends QueryBuilder<ContractFunctionResult> {
    private readonly builder: ContractCallLocalQuery;
    public constructor(client: BaseClient) {
        const header = new QueryHeader();
        super(client, header);
        this.builder = new ContractCallLocalQuery();
        this.builder.setHeader(header);
        this.inner.setContractcalllocal(this.builder);
    }

    public setContractId(contractIdLike: ContractIdLike): this {
        this.builder.setContractid(contractIdToProto(contractIdLike));
        return this;
    }

    protected doValidate(errors: string[]): void {
        if (!this.builder.hasContractid()) {
            errors.push(".setContractId() required");
        }
    }

    protected getMethod(): grpc.UnaryMethodDefinition<Query, Response> {
        return SmartContractService.contractCallLocalMethod;
    }

    protected mapResponse(response: Response): ContractFunctionResult {
        return contractFunctionResultToSdk(response.getContractcalllocal()!.getFunctionresult()!);
    }
}