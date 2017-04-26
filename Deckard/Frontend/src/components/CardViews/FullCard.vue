<template>
    <div class="fullArt">
        <div class="header">
            <div class="cardTitle">{{cardName}}</div>
            <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"></div>
        </div>

        <div class="types">
            <span class="cardType">{{currentCard.type}}</span>
        </div>

        <div class="cardBody">
            <span class="text" v-html="currentCardText"></span>
            <span class="flavor">{{currentCard.flavor}}</span>
        </div>

        <div class="pt">
            <template v-if="currentCard.power != undefined">
                <span class="power">{{currentCard.power}}</span>/<span class="toughness">{{currentCard.toughness}}</span>
            </template>

            <template v-if="currentCard.loyalty != undefined">
                <span class="loyalty">{{currentCard.loyalty}}</span>
            </template>
        </div>
    </div>
</template>

<style lang="scss">

@import url('https://fonts.googleapis.com/css?family=Kreon');

@font-face
{
    font-family: "Beleren Bold";
    src: url('../../assets/beleren.ttf');
}

.fullArt
{
    background-image: url(http://i.imgur.com/4CMXVNi.jpg);
    background-size: 100%;
    
    width: 400px;
    height: 560px;

    font-family: "Kreon";

    & > *
    {
        position: relative;
    }

    .header
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        top: 34px;
        left: 38px;
        width: 81.5%;

        .cardTitle
        {
            font-family: "Beleren Bold";

            justify-content: flex-start;
            align-items: flex-start;

            font-weight: bold;
            font-size: 20px;

            white-space: nowrap;
        }

        .cmc
        {
            justify-content: flex-end;
            align-items: flex-end;

            font-weight: bold;
            font-size: 18px;
        }
    }

    .symbol
    {
        position: relative;

        top: -1px;
        margin-right: 2px;

        display: inline-block;
        font-size: 13px;

        width: 16px;
        text-align: center;

        font-weight: bold;

        background-color: rgb(195, 187, 183);
        border-radius: 64px;

        box-shadow: 0px 1px 1px black;
    }

    .costIcon
    {
        position: relative;
        top: 3px;

        width: 16px;
        border-radius: 64px;
        box-shadow: 0px 1px 1px black;
    }

    .types
    {
        font-family: "Beleren Bold";

        top: 295px;
        left: 35px;

        font-weight: bold;

        .cardType
        {
            margin-left: 0.28em;
        }
    }

    @mixin extra-text
    {
        font-style: italic;
        color: lighten(black, 35%);
    }

    .cardBody
    {
        display: inline-block;

        top: 313px;
        left: 38px;

        display: flex;
        flex-direction: column;

        max-width: 320px;
        height: 140px;
        width: 98%;

        .text
        {
            justify-content: flex-start;
            align-items: flex-start;

            flex-grow: 1;

            white-space: pre-line;

            .rulesText
            {
                @include extra-text();
            }

            .textIcon
            {
                display: inline;
                width: 16px;

                vertical-align: text-bottom;

                padding: 0 2px 0 2px;
            }

            .symbol
            {
                font-style: normal;
            }
        }

        .flavor
        {
            @include extra-text();

            font-weight: normal;

            justify-content: flex-end;
            align-items: flex-end;
        }
    }

    .pt
    {
        top: 330px;
        left: -28px;

        text-align: right;

        font-weight: bold;
        font-size: 1.2em;
    }
}
</style>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'
import CardView from './CardView.vue'
import {Card} from '../../deckard/models/Card'

@Component({
    name: "FullCard"
})
export default class FullCard extends CardView
{
    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
