export class Card
{
    multiverseid: number;

    name: string;
    names: string[];

    type: string;
    types: string[];
    subtypes: string[];

    magicCardsInfoCode: string;
    mciNumber: string;
    set: string;

    text: string;
    flavor: string;
    rarity: string;

    power: number;
    toughness: number;

    colorIdentity: string[] = [];
    cmc: number;

    static artUrl(card: Card): string
    {
        return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
    }
}