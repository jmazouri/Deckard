import {Set} from '../models/Set'
import {Card} from '../models/Card'

export class CardDatabase
{
    public static async getCardsInSet(set: string): Promise<Card[]>
    {
        return new Promise<Card[]>((resolve, reject) =>
        {
            var req: IDBOpenDBRequest = self.indexedDB.open("cards");
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
            var req: IDBOpenDBRequest = self.indexedDB.open("sets");
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
                        ret[cursor.primaryKey] = <Set>cursor.value;
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
            var req: IDBOpenDBRequest = self.indexedDB.open("cards");
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
        var req: IDBOpenDBRequest = self.indexedDB.open("sets");

        req.onupgradeneeded = this.setTableInit;

        req.onsuccess = function (e: any)
        {
            let theDb: IDBDatabase = e.target.result;

            sets.forEach(element =>
            {
                let trans: IDBTransaction = theDb.transaction("sets", "readwrite");
                let table: IDBObjectStore = trans.objectStore("sets");

                table.add(element);
            });

            theDb.close();
        }
    }

    public static saveCards(cards: Card[])
    {
        var req: IDBOpenDBRequest = self.indexedDB.open("cards");

        req.onupgradeneeded = this.cardTableInit;

        req.onsuccess = function (e: any)
        {
            let theDb: IDBDatabase = e.target.result;
            let trans: IDBTransaction = theDb.transaction("cards", "readwrite");
            let table: IDBObjectStore = trans.objectStore("cards");
            
            cards.forEach(element =>
            {
                table.add(element);
            });

            theDb.close();
        }
    }

    public static setTableInit(e: any)
    {
        let theDb:IDBDatabase = e.target.result;
        var parms: IDBObjectStoreParameters;

        let tblLocal: IDBObjectStore = theDb.createObjectStore("sets", { keyPath: "code" });
        //tblLocal.createIndex("setCode", "code");

        theDb.close();
    }

    public static cardTableInit(e: any)
    {
        let theDb:IDBDatabase = e.target.result;
        var parms: IDBObjectStoreParameters;

        let tblLocal: IDBObjectStore = theDb.createObjectStore("cards", { keyPath: "multiverseid" });
        tblLocal.createIndex("cardSet", "set");

        theDb.close();
    }
}