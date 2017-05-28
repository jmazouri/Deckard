<template>
    <div class="tinyCard" v-bind:class="cardBgColor">
        <div class="header">
            <span class="typeIcon" v-html="typeToHtml" v-bind:title="currentCard.type"></span>
            <div class="name" v-bind:title="cardName">
                <span class="quantity" v-if="quantity > 1">{{quantity}}x</span>
                <span v-html="cardName"></span>
            </div>
            <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"
                             v-bind:title="'CMC: ' + currentCard.cmc"></div>
        </div>

        <div class="body" v-if="showText">
            <div class="text" v-html="currentCardText"></div>
            <div class="flavor" v-if="showDescriptionText">{{currentCard.flavor}}</div>
        </div>
        
        <div class="footer">
            <div class="rarity" v-bind:title="'Rarity: ' + currentCard.rarity" v-bind:class="cardRarity">{{currentCard.rarity[0]}}</div>
            <div class="pt" v-if="currentCard.power != undefined">{{currentCard.power}}/{{currentCard.toughness}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Lifecycle} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../../deckard/models/Card'

@Component
export default class TinyCard extends CardView
{
    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
