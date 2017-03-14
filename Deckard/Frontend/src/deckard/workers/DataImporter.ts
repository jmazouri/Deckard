import {Set} from '../models/Set'
import {Card} from '../models/Card'

import BackgroundProcessStatus from '../models/BackgroundProcessStatus'
import {MessageKind, DataImporterMessage} from '../models/DataImporterMessage'
import {CardDatabase} from '../storage/CardDatabase'

let theWorker = this;

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

        return loadedSets;
    }
    
    public static async loadCardsFromJson(jsonUrl: string) : Promise<Card[]>
    {
        var jsonData = await this.loadFromUrl(jsonUrl);

        let setsAndCards = JSON.parse(jsonData);
        let loadedCards:Card[] = new Array<Card>();

        for (var set in setsAndCards)
        {
            if (setsAndCards.hasOwnProperty(set))
            {
                setsAndCards[set].cards.forEach(card =>
                {
                    let newCard:Card = <Card>card;

                    if (newCard.multiverseid != undefined)
                    {
                        loadedCards.push(<Card>card);
                    } 
                });
            }

            //TODO: REMOVE
            break; 
        }

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
        let loadedSets:Set[] = await DataImporter.loadSetsFromJson(message.data);
        <any>postMessage(new DataImporterMessage("LoadSets", loadedSets.length + " sets loaded."));

        CardDatabase.saveSets(loadedSets);
    }
    else if (message.kind == "LoadCards")
    {
        let loadedCards:Card[] = await DataImporter.loadCardsFromJson(message.data);
        <any>postMessage(new DataImporterMessage("LoadCards", loadedCards.length + " cards loaded."));

        CardDatabase.saveCards(loadedCards);
    }
    else
    {
        <any>postMessage(new DataImporterMessage("Error", "Nothing was loaded."));
    }
    
};
