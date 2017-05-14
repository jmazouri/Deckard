<template>
    <div class="numericCriteria">
        <select v-model="comparison">
            <option value="N/A">N/A</option>
            <option>></option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option>>=</option>
            <option>=</option>
            <option>!=</option>
        </select>
        <input type="number" :disabled="comparison == 'N/A'" v-model="enteredNumber">
    </div>
</template>

<style lang="scss">
.numericCriteria
{
    select
    {
        width: 33%;
    }
    input
    {
        width: 59%;
    }
}
</style>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Trait, Watch, p} from 'av-ts'
import {Comparison, NumericCriteria} from '../deckard/models/search/NumericCriteria'

@Component
export default class NumericCriteriaInput extends Vue
{
    enteredNumber: number = 0;
    comparison: Comparison = "N/A";

    @Watch('enteredNumber')
    numberChange(newVal, oldVal)
    {
        this.$emit("input", this.generateCriteria());
    }

    @Watch('comparison')
    compareChange(newVal, oldVal)
    {
        this.$emit("input", this.generateCriteria());
    }

    generateCriteria(): NumericCriteria
    {
        let ret = new NumericCriteria();

        ret.value = this.enteredNumber;
        ret.comparison = this.comparison;

        return ret;
    }

    @Prop value:any = p(
    {
        type: NumericCriteria,
        required: true,
        default()
        {
            return new NumericCriteria();
        }
    })

    @Watch('value')
    valHandler(newVal, oldVal)
    {
        this.enteredNumber = this.value.value;
        this.comparison = this.value.comparison;
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
    }
}
</script>