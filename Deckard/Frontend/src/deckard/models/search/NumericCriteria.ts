export type Comparison = "N/A" | ">" | "<" | "<=" | ">=" | "=" | "!=";

export class NumericCriteria
{
    value: number = 0;
    comparison: Comparison = "N/A";

    meetsCriteria(comparator: number): boolean
    {
        if (comparator == undefined && this.value == 0)
        {
            return true;
        }

        switch (this.comparison)
        {
            case "N/A":
                return true;
            case ">":
                return comparator > this.value;
            case "<":
                return comparator < this.value;
            case "<=":
                return comparator <= this.value;
            case ">=":
                return comparator >= this.value;
            case "=":
                return comparator == this.value;
            case "!=":
                return comparator != this.value;
        }

        return false;
    }
}