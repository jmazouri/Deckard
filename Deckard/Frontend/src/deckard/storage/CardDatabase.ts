import {Set} from '../models/Set'
import {Card} from '../models/Card'

import * as _ from 'lodash';
import Dexie from 'dexie';

export class CardDatabase extends Dexie
{
    static dbName = "deckardCardData";
    static dbVersion = 1;

    sets: Dexie.Table<Set, string>;
    cards: Dexie.Table<Card, number>;

    constructor()
    {
        super("CardDatabase");

        this.version(1).stores
        (
            {
                sets: '++code, name, releaseDate, magicCardsInfoCode',
                cards: '++multiverseid, name, types, set, text, flavor, power, toughness, colorIdentity, cmc, magicCardsInfoCode, mciNumber'
            }
        );

        this.sets.mapToClass(Set);
        this.cards.mapToClass(Card);
    }

    private static _instance: CardDatabase;

    static get instance(): CardDatabase
    {
        if (CardDatabase._instance == null)
        {
            CardDatabase._instance = new CardDatabase();
        }

        return CardDatabase._instance;
    }

    public async cardsDbExists(): Promise<boolean>
    {
        return await this.cards.count() > 0;
    }

    public async searchCards(query: string) : Promise<Card[]>
    {
        if (query.length < 3) { return []; }
        
        var found = await this.cards.filter(function(card)
        {
            return card.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                   (card.text != undefined ?  card.text.toLowerCase().indexOf(query.toLowerCase()) > -1 : false);

        }).toArray();

        return _.uniqBy(found, card => card.name);
    }

    public async importCards(lines: string[]) : Promise<Card[]>
    {
        var ret: Card[] = [];
        var cards = this.cards;

        for (let line of lines)
        {
            var count = parseInt(line.split(/\s+/g, 1)[0]);
            var name = line.substring(line.indexOf(count.toString()) + 1).trim();

            var found: Card[] = await cards.where("name").equals(name).toArray();

            for (var i = 0; i < count; i++)
            {
                ret.push(found[0]);
            }
        }

        return ret;
    }

    public async getCardsInSet(set: string): Promise<Card[]>
    {
        return await this.cards.where("set").equals(set).toArray();
    }

    public async getAllSets(): Promise<Set[]>
    {
        return await this.sets.toArray();
    }

    public static async getCard(id: number): Promise<Card>
    {
        return new Promise<Card>((resolve, reject) =>
        {
            var req: IDBOpenDBRequest = self.indexedDB.open(CardDatabase.dbName, CardDatabase.dbVersion);
            req.onsuccess = function (e: any)
            {
                let theDb: IDBDatabase = e.target.result;
                let store: IDBObjectStore = theDb.transaction("cards").objectStore("cards");
                let request: IDBRequest = store.get(id);

                request.onsuccess = function(event)
                {
                    theDb.close();
                    resolve(<Card>request.result);
                }

                request.onerror = function(event)
                {
                    theDb.close();
                    reject(event.type);
                }
            }
        });
    }

    public saveSets(sets: Set[])
    {
        let allCards = _.flatMap(sets, function(set)
        {
            return _.map(set.cards, function(card)
            {
                return _.assign(card, {'set': set.code, "magicCardsInfoCode": set.magicCardsInfoCode});
            });
        });

        let allSets = _.map(sets, function(set)
        {
            return _.assign(set, {'cards': []});
        });

        this.sets.bulkAdd(allSets);
        this.cards.bulkAdd(allCards);
    }

    public static tableInit(e: any)
    {
        debugger;

        let theDb:IDBDatabase = e.target.result;
        var parms: IDBObjectStoreParameters;

        let setTable: IDBObjectStore = theDb.createObjectStore("sets", { keyPath: "code" });

        let cardTable: IDBObjectStore = theDb.createObjectStore("cards", { keyPath: "multiverseid" });
        cardTable.createIndex("cardSet", "set");
    }
}