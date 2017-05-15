import * as _ from "lodash"
import { NumericCriteria } from './NumericCriteria'

class MtgColor
{
    W: boolean = false;
    U: boolean = false;
    B: boolean = false;
    R: boolean = false;
    G: boolean = false;
}

export class SearchQuery
{
    name: string = "";
    rules: string = "";

    types: string[] = [];
    subtypes: string[] = [];

    formats: string[];

    cmc: NumericCriteria = new NumericCriteria();
    power: NumericCriteria = new NumericCriteria();
    toughness: NumericCriteria = new NumericCriteria();

    colors: MtgColor = new MtgColor();
    get selectedColors(): string[]
    {
        return _.filter(_.keys(this.colors), key => this.colors[key]);
    }

    excludeUnselectedColors: boolean = false;
    onlyMulticolor: boolean = false;

    static revive(jsonObject: any): SearchQuery
    {
        let ret = new SearchQuery();

        ret.name = jsonObject.name;
        ret.rules = jsonObject.rules;
        ret.types = jsonObject.types;
        ret.subtypes = jsonObject.subtypes;
        ret.formats = jsonObject.formats;

        ret.colors = _.clone(jsonObject.colors);

        ret.cmc = new NumericCriteria();
        ret.cmc.comparison = jsonObject.cmc.comparison;
        ret.cmc.value = jsonObject.cmc.value;
        
        ret.power = new NumericCriteria();
        ret.power.comparison = jsonObject.power.comparison;
        ret.power.value = jsonObject.power.value;

        ret.toughness = new NumericCriteria();
        ret.toughness.comparison = jsonObject.toughness.comparison;
        ret.toughness.value = jsonObject.toughness.value;

        ret.excludeUnselectedColors = jsonObject.excludeUnselectedColors;
        ret.onlyMulticolor = jsonObject.onlyMulticolor;

        return ret;
    }
}