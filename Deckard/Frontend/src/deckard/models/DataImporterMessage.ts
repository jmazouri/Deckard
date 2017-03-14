export type MessageKind = "LoadSets" | "LoadCards" | "Error";

export class DataImporterMessage
{
    kind:MessageKind;
    data:string;

    public constructor(theKind:MessageKind, theData:string)
    {
        this.kind = theKind;
        this.data = theData;
    }
}