import * as _ from "lodash"

export default class Util
{
    static filterArrayField(input: string[], matchAgainst: string[]): boolean
    {
        if (input == undefined) { return false; }
        if (matchAgainst == undefined) { return true; }

        return (matchAgainst.length > 0 ? _.intersection(input, matchAgainst).length > 0 : true);
    }

    static filterTextField(input: any, matchAgainst: string): boolean
    {
        let exists = <boolean>input;
        if (!exists) { return false; }

        return (matchAgainst.length > 0 ? input.toLowerCase().indexOf(matchAgainst.toLowerCase()) > -1 : true);
    }
}