import * as _ from "lodash"
import { Set } from '../Set'
import { Card } from '../Card'
import Util from '../../Util'
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

    formats: string[] = [];
    sets: Set[] = [];

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

    get setCodes(): string[]
    {
        return _.map(this.sets, querySet => querySet.code);
    }
    
    matchesCard(card: Card): boolean
    {
        let nameMatches = Util.filterTextField(card.name, this.name);
        let rulesMatch = Util.filterTextField(card.text, this.rules);

        let typesMatch = Util.filterArrayField(card.types, this.types);
        let subTypesMatch = Util.filterArrayField(card.subtypes, this.subtypes);

        let sortedIdentity: string[] = card.colorIdentity ? card.colorIdentity.sort() : [];

        let colorsMatch = this.onlyMulticolor && sortedIdentity.length <= 1
                            ? false 
                            : this.excludeUnselectedColors 
                                ? _.every(sortedIdentity, color => this.selectedColors.indexOf(color) > -1)
                                : Util.filterArrayField(sortedIdentity, this.selectedColors);

        let cmcValid = this.cmc && this.cmc.meetsCriteria(card.cmc);
        let powerValid = this.power && this.power.meetsCriteria(card.power);
        let toughnessValid = this.toughness && this.toughness.meetsCriteria(card.toughness);

        let setsMatch = (this.setCodes.length > 0 ? _.some(this.setCodes, setCode => card.set == setCode) : true);

        return nameMatches && rulesMatch && typesMatch &&
                subTypesMatch && colorsMatch && cmcValid &&
                powerValid && toughnessValid && setsMatch;
    }

    static revive(jsonObject: any): SearchQuery
    {
        let ret = new SearchQuery();

        ret.name = jsonObject.name;
        ret.rules = jsonObject.rules;
        ret.types = jsonObject.types;
        ret.subtypes = jsonObject.subtypes;
        ret.formats = jsonObject.formats;
        ret.sets = jsonObject.sets;

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