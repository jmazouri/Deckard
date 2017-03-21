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
    public static async loadSetsFromJson(jsonUrl: string): Promise<Set[]>
    {
        var jsonData = await this.loadFromUrl(jsonUrl);

        let allSets = JSON.parse(jsonData);
        let loadedSets:Set[] = new Array<Set>();

        allSets.forEach(element =>
        {
            loadedSets.push(<Set>element);
        });

        this.sendStatusMessage(`Finished loading sets from JSON.`, loadedSets.length, loadedSets.length);

        return loadedSets;
    }

    private static sendStatusMessage(message: string, current: number, max: number)
    {
        let msg: BackgroundProcessStatus = new BackgroundProcessStatus();
        msg.currentMessage = message;
        msg.currentProgress = current;
        msg.maxProgress = max;
        
        <any>postMessage(msg);
    }
    
    public static async loadCardsFromJson(jsonUrl: string) : Promise<Card[]>
    {
        var jsonData = await this.loadFromUrl(jsonUrl);

        let setsAndCards = JSON.parse(jsonData);
        let loadedCards:Card[] = new Array<Card>();

        let setIndex:number = 1;

        for (var set in setsAndCards)
        {
            if (setsAndCards.hasOwnProperty(set))
            {
                //this.sendStatusMessage(`Loading set ${set}`, setIndex, Object.keys(setsAndCards).length);

                setsAndCards[set].cards.forEach(card =>
                {
                    let newCard:Card = <Card>card;

                    if (newCard.multiverseid != undefined)
                    {
                        newCard.set = set;
                        loadedCards.push(<Card>card);
                    } 
                });

                setIndex++;
            }
        }

        this.sendStatusMessage(`Finished loading cards from JSON.`, loadedCards.length, loadedCards.length);

        return loadedCards;
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

    if (message.kind == "LoadSets")
    {
        let existingSets: Set[] = await CardDatabase.getAllSets();
        
        if (existingSets.length == 0)
        {
            let loadedSets:Set[] = await DataImporter.loadSetsFromJson(message.data);
            CardDatabase.saveSets(loadedSets);

            <any>postMessage(new DataImporterMessage("LoadSets", loadedSets.length + " sets saved to database."));
        }
        else
        {
            <any>postMessage(new DataImporterMessage("LoadSets", existingSets.length + " sets skipped, already in database."));
        }
    }
    else if (message.kind == "LoadCards")
    {
        let existingCards: Card[] = await CardDatabase.getCardsInSet("LEA");

        try
        {
            if (existingCards.length == 0)
            {
                let loadedCards:Card[] = await DataImporter.loadCardsFromJson(message.data);
                CardDatabase.saveCards(loadedCards);

                <any>postMessage(new DataImporterMessage("LoadCards", loadedCards.length + " cards saved to database."));
            }
            else
            {
                <any>postMessage(new DataImporterMessage("LoadCards", existingCards.length + " cards skipped, already in database."));
            }
        }
        catch (err)
        {
            debugger;
        }
    }
    else
    {
        <any>postMessage(new DataImporterMessage("Error", "Nothing was loaded."));
    }
    
};
