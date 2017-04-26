<template>
    <div class="cardImg">
        <img v-if="currentCard.mciNumber != undefined" 
            v-bind:src="currentCardArt">
        </img>
        <div class="noArt" v-else>   
            {{currentCard.name}}
            No Art
        </div>
    </div>
</template>

<style lang="scss">

.cardImg, .cardImg img, .noArt
{
    width: 100%;
    max-width: 300px;
}

.noArt
{
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;

    background-color: lighten(darkred, 50%);
}

</style>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../../deckard/models/Card'

@Component
export default class CardArt extends CardView
{
    get currentCardArt()
    {
        return Card.artUrl((<any>this).currentCard);
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
