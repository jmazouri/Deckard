import {Set} from '../models/Set'
import {Card} from '../models/Card'
import {Deck} from '../models/Deck'

import * as _ from 'lodash';
import Dexie from 'dexie';

export class CardDatabase extends Dexie
{
    static dbName = "CardDatabase";
    static dbVersion = 1;

    sets: Dexie.Table<Set, string>;
    cards: Dexie.Table<Card, number>;
    decks: Dexie.Table<Deck, string>;

    constructor()
    {
        super(CardDatabase.dbName);

        this.version(CardDatabase.dbVersion).stores
        (
            {
                sets: '++code, name, releaseDate, magicCardsInfoCode',
                cards: 'id, *name, *multiverseid, types, set, text, flavor, power, toughness, colorIdentity, cmc, magicCardsInfoCode, mciNumber',
                decks: 'name, cards'
            }
        );

        this.sets.mapToClass(Set);
        this.cards.mapToClass(Card);
        this.decks.mapToClass(Deck);
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

    public async searchCards(query: string, includeDuplicates: boolean = false) : Promise<Card[]>
    {
        if (query.length < 3) { return []; }
        
        var found = await this.cards.filter(function(card)
        {
            var name = (card.names != undefined ? card.names.join(" ") : card.name);

            return name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                   (card.text != undefined ?  card.text.toLowerCase().indexOf(query.toLowerCase()) > -1 : false);

        }).toArray();

        found = _.filter(found, card => card.multiverseid);
        return (includeDuplicates ? found :  _.uniqBy(found, card => card.name));
    }

    public async findAllVersions(original: Card) : Promise<Card[]>
    {
        var found = await this.cards.filter(card => 
        {
            return card.name == original.name || card.multiverseid == original.multiverseid || 
                       (card.names == undefined ? false : card.names.indexOf(original.name) > -1);
        }).toArray();
        
        return found;
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

    public async getDecks() : Promise<Deck[]>
    {
        return await this.decks.toArray();
    }

    public async saveDeck(deck: Deck)
    {
        await this.decks.put(deck);
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
}