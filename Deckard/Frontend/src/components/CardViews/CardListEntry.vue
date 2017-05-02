<template>
    <div class="listEntry" v-bind:class="cardBgColor + ' ' + cardRarity">

        <div class="header">
            <div class="left">
                <span class="quantity" v-if="quantity > 1">{{quantity}}x</span>

                <span class="typeIcon" v-html="typeToHtml" v-bind:title="currentCard.type"></span>

                <span class="name" v-html="cardName"></span>

                <span class="info" v-if="showText">
                    <span class="types">{{currentCard.type}}</span>
                </span>
            </div>
            <div class="right">
                <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"
                             v-bind:title="currentCard.manaCost"></div>
            </div>
        </div>

        <div class="body" v-if="showText">
            <div class="text" v-html="currentCardText"></div>
            <div class="flavor" v-if="showDescriptionText && currentCard.flavor != undefined">{{currentCard.flavor}}</div>
        </div>

    </div>
</template>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../../deckard/models/Card'

@Component
export default class CardListEntry extends CardView
{
    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
