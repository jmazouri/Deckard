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
        var split = card.mciNumber.split('/');

        var number = (split.length > 1 ? split[2] : split[0]);

        return 'http://magiccards.info/scans/en/' + card.magicCardsInfoCode + '/' + number + '.jpg';
    }
}