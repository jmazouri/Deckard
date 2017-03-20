import {BaseWorkerMessage, MessageKind} from './BaseWorkerMessage';

export class BackgroundProcessStatus extends BaseWorkerMessage
{
    currentMessage: string;

    currentProgress: number;
    maxProgress: number;

    constructor()
    {
        super();
        this.kind = "ProcessStatus";
    }
}