<template>
    <tr class="tableRow" v-bind:class="cardBgColor + ' ' + cardRarity">
        <td v-html="cardName"></td>
        <td>{{currentCard.type}}</td>
        <td>{{currentCard.manaCost.replace(/({|})/g, '')}}</td>
        <td>
            {{currentCard.power}}
        </td>
        <td>
            {{currentCard.toughness}}
        </td>
        <td>{{currentCard.colorIdentity.join('')}}</td>
    </tr>
</template>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../../deckard/models/Card'

@Component
export default class CardGridRow extends CardView
{
    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
