<template>
    <div class="cardGrid">
        <TinyCard v-for="card in cards" :showDescriptionText="false" :currentCard="card"></TinyCard>
    </div>
</template>

<style lang="scss">
.cardGrid
{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    padding: 0.5em;
}
</style>

<script>
import {Vue, Component, Lifecycle, Prop, p} from 'av-ts'
import TinyCard from './TinyCard.vue'
import {Card} from '../deckard/models/Card'

@Component({
    components: {'TinyCard' : TinyCard}
})
export default class CardGrid extends Vue
{
    @Prop cards:any = p(
    {
        type: Array,
        required: true,
        default()
        {
            return new Array<Card>();
        }
    })

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>