import {Set} from '../models/Set'
import {Card} from '../models/Card'

import * as _ from 'lodash';

export class CardDatabase
{
    public static async cardsDbExists(): Promise<boolean>
    {
        return new Promise<boolean>((resolve, reject) =>
        {
            var req: IDBOpenDBRequest = self.indexedDB.open("deckardCardData");

            req.onsuccess = function (e: any)
            {
                let theDb: IDBDatabase = e.target.result;
                
                try
                {
                    let index: IDBObjectStore = theDb.transaction("cards").objectStore("cards");
                    resolve(true);
                }
                catch (err)
                {
                    resolve(false);
                }
            };
        });
    }
    public static async getCardsInSet(set: string): Promise<Card[]>
    {
        return new Promise<Card[]>((resolve, reject) =>
        {
            var req: IDBOpenDBRequest = self.indexedDB.open("deckardCardData");
            req.onsuccess = function (e: any)
            {
                let theDb: IDBDatabase = e.target.result;
                let index: IDBIndex = theDb.transaction("cards").objectStore("cards").index("cardSet");
                let request: IDBRequest = index.openCursor(IDBKeyRange.only(set));
                let ret: Card[] = [];

                request.onsuccess = function(event:any)
                {
                    var cursor = event.target.result;

                    if (cursor)
                    {
                        ret.push(<Card>cursor.value);
                        cursor.continue();
                    }
                    else
                    {
                        resolve(ret);
                        theDb.close();
                    }
                }

                request.onerror = function(event)
                {
                    reject(event.type);
                    theDb.close();
                }
            }
        });
    }

    public static async getAllSets(): Promise<Set[]>
    {
        return new Promise<Set[]>((resolve, reject) =>
        {
            var req: IDBOpenDBRequest = self.indexedDB.open("deckardCardData");
            req.onsuccess = function (e: any)
            {
                let theDb: IDBDatabase = e.target.result;
                let store: IDBObjectStore = theDb.transaction("sets").objectStore("sets");
                let request: IDBRequest = store.openCursor();
                let ret: any = {};

                request.onsuccess = function(event:any)
                {
                    var cursor = event.target.result;

                    if (cursor)
                    {
                        let newSet:Set = new Set();

                        newSet.code = cursor.value.code;
                        newSet.magicCardsInfoCode = cursor.value.magicCardsInfoCode;
                        newSet.name = cursor.value.name;
                        newSet.releaseDate = cursor.value.releaseDate;

                        ret[cursor.primaryKey] = newSet;

                        cursor.continue();
                    }
                    else
                    {
                        resolve(ret);
                        theDb.close();
                    }
                }

                request.onerror = function(event)
                {
                    reject(event.type);
                    theDb.close();
                }
            }
        });
    }

    public static async getCard(id: number): Promise<Card>
    {
        return new Promise<Card>((resolve, reject) =>
        {
            var req: IDBOpenDBRequest = self.indexedDB.open("deckardCardData");
            req.onsuccess = function (e: any)
            {
                let theDb: IDBDatabase = e.target.result;
                let store: IDBObjectStore = theDb.transaction("cards").objectStore("cards");
                let request: IDBRequest = store.get(id);

                request.onsuccess = function(event)
                {
                    resolve(<Card>request.result);
                    theDb.close();
                }

                request.onerror = function(event)
                {
                    reject(event.type);
                    theDb.close();
                }
            }
        });
    }

    public static saveSets(sets: Set[])
    {
        var req: IDBOpenDBRequest = self.indexedDB.open("deckardCardData");

        req.onupgradeneeded = this.tableInit;

        req.onsuccess = function (e: any)
        {
            let theDb: IDBDatabase = e.target.result;
            let setTrans: IDBTransaction = theDb.transaction("sets", "readwrite");
            let setTable: IDBObjectStore = setTrans.objectStore("sets");

            sets.forEach(element =>
            {
                let cleanSet:Set = _.clone(element);
                cleanSet.cards = [];

                setTable.put(cleanSet);
            });

            setTrans.oncomplete = function (e:any)
            {
                let cardTrans: IDBTransaction = theDb.transaction("cards", "readwrite");
                let cardTable: IDBObjectStore = cardTrans.objectStore("cards");
                
                sets.forEach(element =>
                {
                    element.cards.forEach(card =>
                    {
                        if (card.multiverseid == undefined) { return; }
                        card.set = element.code;
                        cardTable.put(card);
                    });
                });

                cardTrans.oncomplete = function (e:any) { theDb.close(); }
            }
        }

        req.onerror = function (e:any) { debugger; }
    }

    public static tableInit(e: any)
    {
        let theDb:IDBDatabase = e.target.result;
        var parms: IDBObjectStoreParameters;

        let setTable: IDBObjectStore = theDb.createObjectStore("sets", { keyPath: "code" });

        let cardTable: IDBObjectStore = theDb.createObjectStore("cards", { keyPath: "multiverseid" });
        cardTable.createIndex("cardSet", "set");
    }
}