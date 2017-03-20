export type MessageKind = "LoadSets" | "LoadCards" | "ProcessStatus" | "Error";

export class BaseWorkerMessage
{
    kind: string;
    constructor() { }
}