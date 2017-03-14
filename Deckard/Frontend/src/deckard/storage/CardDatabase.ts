import {Set} from '../models/Set'
import {Card} from '../models/Card'

export class CardDatabase
{
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
                }

                request.onerror = function(event)
                {
                    reject(event.type);
                }
            }

            req.onerror = function (e: any)
            {
                debugger;
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

            cards.forEach(element =>
            {
                let trans: IDBTransaction = theDb.transaction("cards", "readwrite");
                let table: IDBObjectStore = trans.objectStore("cards");

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
    }

    public static cardTableInit(e: any)
    {
        let theDb:IDBDatabase = e.target.result;
        var parms: IDBObjectStoreParameters;

        let tblLocal: IDBObjectStore = theDb.createObjectStore("cards", { keyPath: "multiverseid" });
        //tblLocal.createIndex("cardName", "name");
    }
}