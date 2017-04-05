<template>
    <div class="listEntry" v-bind:class="cardBgColor + ' ' + cardRarity">

        <div class="header">
            <div class="left">
                <img class="typeIcon" v-if="!showText" v-bind:src="typeToHtml(currentCard.types[0])" v-bind:title="currentCard.types + ' - ' + currentCard.subtypes"></img>

                <span class="name">{{currentCard.name}}</span>

                <span class="info" v-if="showText">
                    <span class="types" v-html="currentCard.types + (currentCard.subtypes != undefined ? ' - ' + currentCard.subtypes : '')"></span>
                </span>
            </div>
            <div class="right">
                <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"
                             v-bind:title="'CMC: ' + currentCard.cmc"></div>
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

@mixin list-bg-colors()
{
    border-left: $border-vars darken(lightgray, 25%);
    background: linear-gradient(90deg, lightgray 0%, white 100%);

    @for $i from 1 through length($mtg-color-names)
    {
        &.#{nth($mtg-color-names, $i)}
        {
            background: linear-gradient(90deg, lighten(nth($mtg-colors, $i), 6%) 0%, white 100%);
        }
    }

    @for $i from 1 through length($mtg-rarity-names)
    {
        &.#{nth($mtg-rarity-names, $i)}
        {
            border-left: $border-vars nth($mtg-rarity-colors, $i);
        }
    }
};

.smaller .listEntry
{
    font-size: 1em;
}

.listEntry
{
    position: relative;

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

        box-shadow: 0px 0px 8px transparentize(black, 0.5);

        z-index: 999;
    }

    .header
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;


        .left
        {
            flex-grow: 1;

            .name
            {
                font-weight: bold;
            }

            .info
            {
                font-size: 0.5em;
                align-items: center;

                color: $light-text;
            }
        }

        .right
        {
            .cmc
            {
                justify-content: flex-end;
                flex-wrap: nowrap;

                display: inline-block;
                position: relative;

                top: -0.1em;
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
