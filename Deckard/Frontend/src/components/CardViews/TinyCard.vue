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

        <div class="body" v-if="showText && currentCardText.length > 0">
            <div class="text" v-html="currentCardText"></div>
            <div class="flavor" v-if="showDescriptionText">{{currentCard.flavor}}</div>
        </div>
        
        <div class="footer">
            <div class="rarity" v-bind:class="cardRarity">{{currentCard.rarity[0]}}</div>
            <div class="pt" v-if="currentCard.power != undefined">{{currentCard.power}}/{{currentCard.toughness}}</div>
        </div>
    </div>
</template>

<style lang="scss">
@import "../../styles/variables.scss";
@import url('https://fonts.googleapis.com/css?family=Hind:400,700');

$lighter-bg: rgba(255, 255, 255, 0.5);
$card-radius: 0.5em;

.tinyCard
{
    display: flex;
    flex-direction: column;

    justify-content: space-around;
    align-content: space-around;

    font-size: 0.8rem;

    min-width: 210px;
    width: 95%;
    max-width: 300px;

    min-height: 38px;

    margin-bottom: 0.5em;

    padding: 0em;
    border-radius: $card-radius;

    border: 1px solid darkgray;

    @include card-bg-colors();

    .textIcon, .costIcon, .symbol
    {
        margin-right: 0.2em;
    }

    .textIcon, .costIcon
    {
        width: 1.15em;
        vertical-align: middle;
    }

    .symbol, .costIcon
    {
        border-radius: 4em;
        border: 1px solid gray;
    }

    .symbol
    {
        font-size: 0.85em;
        font-weight: bold;

        background-color: #d9d9d9;
        padding: 2px 4px 2px 4px;
    }

    .header
    {
        color: black;
        
        display: flex;
        flex-direction: row;

        justify-content: flex-start;
        
        flex-wrap: nowrap;
        align-items: center;

        font-weight: bold;

        padding: 0.2em 0em 0.2em 0.33em;

        background-color: $lighter-bg;
        
        border-top-left-radius: $card-radius;
        border-top-right-radius: $card-radius;

        box-shadow: 0px 1px 3px -1px black;

        .typeIcon svg
        {
            max-height: 14px;
            width: 14px;

            justify-content: flex-start;

            margin-right: 0.33em;
        }

        .name
        {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            justify-content: flex-start;
        }

        .cmc
        {           
            display: flex;
            flex-direction: row;

            flex-grow: 2;
            justify-content: flex-end;
            flex-wrap: nowrap;

            &>*
            {
                max-height: 14px;
            }
        }
    }

    .body
    {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        padding: 0.33em;
        line-height: 1.2;

        font-family: "Hind", sans-serif;

        white-space: pre-line;

        .symbol
        {    
            display: inline-block;
            padding-top: 0;
        }

        .text
        {
            flex-grow: 1;

            strong
            {
                font-size: 1.1em;
                font-weight: bold;
            }
        }

        .flavor
        {

            justify-content: flex-end;

            font-size: 0.9em;
            font-style: italic;
            color: rgba(0, 0, 0, 0.66);
        }
    }

    .footer
    {
        color: black;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        &>*
        {
            align-self: center;
            padding: 0.2em 0.33em;
            font-weight: bold;
            background-color: $lighter-bg;
        }

        .rarity
        {
            color: white;
            text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.66);

            border-top-right-radius: $card-radius;
            border-bottom-left-radius: $card-radius;

            border-top: 1px solid gray;
            border-right: 1px solid gray;

            &.Co
            {
                background-color: rgb(70, 63, 63);
            }

            &.Un
            {
                background-color: rgb(158, 158, 158);
            }

            &.Ra
            {
                background-color: rgb(221, 188, 106);
            }

            &.My
            {
                background-color: rgb(242, 129, 0);
            }

            &.Sp
            {
                background-color: $mtg-special;
            }
        }

        .pt
        {
            border-top-left-radius: $card-radius;
            border-bottom-right-radius: $card-radius;

            border-top: 1px solid gray;
            border-left: 1px solid gray;
        }
    }
}
</style>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
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
