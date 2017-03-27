<template>
    <div class="tinyCard" v-bind:class="cardBgColor" >
        <div class="header">
            <img class="typeIcon" v-bind:src="typeToHtml(currentCard.types[0])" v-bind:title="currentCard.types[0]"></img>
            <div class="name" v-bind:title="currentCard.name">{{currentCard.name}}</div>
            <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"
                             v-bind:title="'CMC: ' + currentCard.cmc"></div>
        </div>
        <div class="text" v-html="currentCardText">
        </div>
    </div>
</template>

<style lang="scss">
.tinyCard
{
    font-size: 0.8rem;

    width: 220px;
    overflow: hidden;

    background-color: lightgray;
    padding: 0em;
    border-radius: 0.5em;

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

        background-color: rgb(195, 187, 183);
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

        margin-bottom: 0.25em;
        padding: 0.2em 0em 0.2em 0.33em;

        background-color: rgba(255, 255, 255, 0.5);
        
        border-top-left-radius: 0.5em;
        border-top-right-radius: 0.5em;

        .typeIcon
        {
            max-height: 14px;
            width: 14px;

            justify-content: flex-start;

            margin-right: 0.5em;
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

    .text
    {
        padding: 0.25em;
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
