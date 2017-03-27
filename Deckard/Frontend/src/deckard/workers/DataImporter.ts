import {Set} from '../models/Set'
import {Card} from '../models/Card'

import {MessageKind} from '../models/BaseWorkerMessage'
import {BackgroundProcessStatus} from '../models/BackgroundProcessStatus'
import {DataImporterMessage} from '../models/DataImporterMessage'
import {CardDatabase} from '../storage/CardDatabase'

let theWorker = this;

//let legalSets:string[] = ["BFZ", "OGW", "SOI", "EMN", "KLD", "AER"];

class DataImporter
{
    private static sendStatusMessage(message: string, current: number, max: number)
    {
        let msg: BackgroundProcessStatus = new BackgroundProcessStatus();
        msg.currentMessage = message;
        msg.currentProgress = current;
        msg.maxProgress = max;
        
        <any>postMessage(msg);
    }
    
    public static async loadCardsFromJson(jsonUrl: string) : Promise<Set[]>
    {
        var jsonData = await this.loadFromUrl(jsonUrl);

        let setsAndCards = JSON.parse(jsonData);
        let loadedSets:Set[] = new Array<Set>();

        let setIndex:number = 1;

        for (var set in setsAndCards)
        {
            if (setsAndCards.hasOwnProperty(set))
            {
                loadedSets.push(<Set>setsAndCards[set]);
                setIndex++;
            }
        }

        this.sendStatusMessage(`Finished loading sets & cards from JSON.`, loadedSets.length, loadedSets.length);

        return loadedSets;
    }

    private static async loadFromUrl(jsonUrl: string): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            let xhr:XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState < 4)
                {
                    return;
                }
                
                if (xhr.status !== 200)
                {
                    reject(xhr.statusText);
                }

                // all is well	
                if (xhr.readyState === 4)
                {
                    resolve(xhr.responseText);
                }
            }

            xhr.open('GET', jsonUrl, false);
            xhr.send('');
        });
    }
}

onmessage = async args =>
{
    let message:DataImporterMessage = JSON.parse(args.data);

    if (message.kind == "LoadCards")
    {
        if (!(await CardDatabase.cardsDbExists()))
        {
            let loadedCards:Set[] = await DataImporter.loadCardsFromJson(message.data);
            CardDatabase.saveSets(loadedCards);

            <any>postMessage(new DataImporterMessage("LoadCards", loadedCards.length + " cards saved to database."));
        }
        else
        {
            <any>postMessage(new DataImporterMessage("LoadCards", "Saving skipped, database already exists."));
        }
    }
    else
    {
        <any>postMessage(new DataImporterMessage("Error", "Nothing was loaded."));
    }
    
};
