import {BaseWorkerMessage, MessageKind} from './BaseWorkerMessage';

export class DataImporterMessage extends BaseWorkerMessage
{
    data:string;

    public constructor(theKind:MessageKind, theData:string)
    {
        super();

        this.kind = theKind;
        this.data = theData;
    }
}