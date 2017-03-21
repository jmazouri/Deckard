import {Card} from './Card'

export class Set
{
    name: string;
    code: string;
    releaseDate: string;

    magicCardsInfoCode: string;

    get mciCode(): string
    {
        if (this.magicCardsInfoCode != undefined && this.magicCardsInfoCode != null)
        {
            return this.magicCardsInfoCode;
        }
        else
        {
            return this.code;
        }
    }

    cards: Card[];
}