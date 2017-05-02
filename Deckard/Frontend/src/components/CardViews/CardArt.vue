<template>
    <div class="cardImg">
        <img v-if="currentCard.mciNumber != undefined" 
            v-bind:src="currentCardArt">
        </img>
        <div class="noArt" v-else>   
            {{currentCard.name}}
            <small>No Art</small>
        </div>
    </div>
</template>

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
