export type ResultOk = boolean;
export type ResultErrors = string[];

export interface BaseResult {
	"ensure": () => void;
	"ok": ResultOk;
}

export interface OkResult extends BaseResult {
	"ok": true;
}

export interface FailResult extends BaseResult {
	"errors": ResultErrors;
	"ok": false;
}

export type Result = OkResult | FailResult;
