import UseCase from "./UseCase";

export type CheckStatusInput = any;

export type CheckStatusOutput = {
    status: string
};

export default class CheckStatus implements UseCase {

    execute(): CheckStatusOutput {
        const output: CheckStatusOutput = { status: 'online' };
        return output;
    }

}