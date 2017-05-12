import * as _ from "lodash"

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

    colors: MtgColor = new MtgColor();

    get selectedColors(): string[]
    {
        return _.filter(_.keys(this.colors), key => this.colors[key]);
    }
}