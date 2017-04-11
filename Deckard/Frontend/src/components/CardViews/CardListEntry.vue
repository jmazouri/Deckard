<template>
    <div class="listEntry" v-bind:class="cardBgColor + ' ' + cardRarity">

        <div class="header">
            <div class="left">
                <span class="quantity" v-if="quantity > 1">{{quantity}}x</span>

                <img class="typeIcon" v-bind:src="typeToHtml(currentCard.types[0])" v-bind:title="currentCard.types + ' - ' + currentCard.subtypes"></img>

                <span class="name" v-html="cardName"></span>

                <span class="info" v-if="showText">
                    <span class="types" v-html="currentCard.types + (currentCard.subtypes != undefined ? ' - ' + currentCard.subtypes : '')"></span>
                </span>
            </div>
            <div class="right">
                <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"
                             v-bind:title="currentCard.manaCost"></div>
            </div>
        </div>

        <div class="body" v-if="showText">
            <div class="text" v-html="currentCardText"></div>
            <div class="flavor" v-if="showDescriptionText">{{currentCard.flavor}}</div>
        </div>

    </div>
</template>

<style lang="scss">
@import "../../styles/variables.scss";
@import url('https://fonts.googleapis.com/css?family=Hind:400,700|Noto+Serif');

$border-vars: 0.3rem solid;
$light-text: lighten(black, 33%);

.smaller .listEntry
{
    font-size: 1em;

    .body, .header .left .info
    {
        font-size: 0.75em;
    }
}

.listEntry
{
    font-family: "Noto Serif";
    font-size: 1.75em;

    padding: 0.25em;

    @include list-bg-colors();

    transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor: pointer;

    box-shadow: 0px 0px 0px transparent;

    &:hover
    {
        border-left-width: 0.4rem;

        box-shadow: 0px 0px 6px -1px transparentize(black, 0.25);

        position:relative;
        z-index: 1;
    }

    .header
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;


        .left
        {
            flex-grow: 1;

            .typeIcon
            {
                position: relative;
                top: -0.1em;
            }

            .quantity
            {
                font-family: "Consolas", monospace;
            }

            .name
            {
                font-weight: bold;
                
                small
                {
                    font-size: 0.65em;
                    color: $light-text;
                }
            }

            .info
            {
                display: inline-block;
                
                font-size: 0.5em;
                align-items: center;

                color: $light-text;
            }
        }

        .right
        {
            display: flex;
            flex-direction: row;

            justify-content: flex-end;
            
            .cmc
            {
                display: flex;
                flex-grow: 1;

                align-items: stretch;

                .symbol
                {
                    padding: 0.24em 0.3em 0.34em 0.3em;
                    text-align: center;
                }
            }
        }
    }

    .typeIcon, .costIcon, .symbol
    {
        max-height: 0.85em;
        width: 0.85em;

        vertical-align: middle;
    }

    .costIcon, .symbol
    {
        border-radius: 32em;
        box-shadow: 0px 0px 2px black;

        margin-right: 0.1em;
    }

    .symbol
    {
        font-family: "Noto Serif";
        font-size: 0.6em;
        font-weight: bold;

        background-color: $mtg-artifact;
        padding: 0em 0.45em 0.05em 0.45em;

        border-radius: 8em;
    }

    .body
    {
        font-family: "Hind";
        margin-top: 0.25em;
        font-size: 0.6em;

        strong
        {
            font-size: 1.1em;
            font-weight: bold;
        }

        .flavor
        {
            color: $light-text;
            margin-top: 0.5em;

            font-size: 0.85em;
            font-style: italic;
        }
    }
}
</style>

<script>
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../../deckard/models/Card'

@Component
export default class CardListEntry extends Mixin(CardView)
{
    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
