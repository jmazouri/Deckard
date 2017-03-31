<template>
    <div class="tinyCard" v-bind:class="cardBgColor">
        <div class="header">
            <img class="typeIcon" v-bind:src="typeToHtml(currentCard.types[0])" v-bind:title="currentCard.types + ' - ' + currentCard.subtypes"></img>
            <div class="name" v-bind:title="currentCard.name">{{currentCard.name}}</div>
            <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"
                             v-bind:title="'CMC: ' + currentCard.cmc"></div>
        </div>

        <div class="body">
            <div class="text" v-html="currentCardText"></div>
            <div class="flavor" v-if="showDescriptionText || currentCard.text == undefined">{{currentCard.flavor}}</div>
        </div>
        
        <div class="pt" v-if="currentCard.power != undefined">{{currentCard.power}}/{{currentCard.toughness}}</div>
    </div>
</template>

<style lang="scss">
$lighter-bg: rgba(255, 255, 255, 0.5);
$card-radius: 0.5em;

.tinyCard
{
    display: flex;
    flex-direction: column;

    justify-content: space-between;
    align-content: space-between;

    font-size: 0.8rem;

    width: 220px;

    background-color: lightgray;
    padding: 0em;
    border-radius: $card-radius;

    box-shadow: 0px 0px 4px -1px black;

    &.U
    {
        background-color: #aae0fa;
    }
    &.B
    {
        background-color: #cbc2bf;
    }
    &.R
    {
        background-color: #f9aa8f;
    }
    &.W
    {
        background-color: #fffbd5;
    }
    &.G
    {
        background-color: #9bd3ae;
    }

    .textIcon, .costIcon, .symbol
    {
        margin-right: 0.2em;
    }

    .textIcon, .costIcon
    {
        width: 1.15em;
        vertical-align: text-bottom;
    }

    .symbol, .costIcon
    {
        border-radius: 4em;
        box-shadow: 0px 0px 2px black;
    }

    .symbol
    {
        font-size: 0.85em;
        font-weight: bold;

        background-color: #d9d9d9;
        padding: 1px 4px;
    }

    .header
    {
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

        .typeIcon
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

        .text
        {
            flex-grow: 1;
            strong
            {
                font-size: 1.1em;
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

    .pt
    {
        display: flex;
        align-self: flex-end;
        flex-direction: row;

        padding: 0.2em 0.33em;

        border-top-left-radius: $card-radius;

        font-weight: bold;
        background-color: $lighter-bg;

        box-shadow: -1px -1px 3px -1px black;
    }
    

    margin-bottom: 1em;
}
</style>

<script>
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../deckard/models/Card'

@Component
export default class TinyCard extends Mixin(CardView)
{
    get cardBgColor()
    {
        if ((<any>this).currentCard.colorIdentity != undefined)
        {
            return (<any>this).currentCard.colorIdentity[0];
        }
        else
        {
            return "";
        }
        
    }
    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
