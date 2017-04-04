<template>
    <div class="listEntry" v-bind:class="cardBgColor">
        <img class="typeIcon" v-bind:src="typeToHtml(currentCard.types[0])" v-bind:title="currentCard.types + ' - ' + currentCard.subtypes"></img>
        {{currentCard.name}}
    </div>
</template>

<style lang="scss">
@import "../../styles/variables.scss";
@import url('https://fonts.googleapis.com/css?family=Hind:400,700|Noto+Serif');

$border-vars: 0.3rem solid;

@mixin list-bg-colors()
{
    border-left: $border-vars darken(lightgray, 25%);
    background: linear-gradient(90deg, lightgray 0%, white 100%);

    @for $i from 1 through length($mtg-color-names)
    {
        &.#{nth($mtg-color-names, $i)}
        {
            border-left: $border-vars darken(desaturate(nth($mtg-colors, $i), 20%), 25%);
            background: linear-gradient(90deg, nth($mtg-colors, $i) 0%, white 100%);
        }
    }
};

.smaller .listEntry
{
    font-size: 1em;
}

.listEntry
{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-family: "Noto Serif";
    font-size: 2em;

    padding: 0.25em;

    @include list-bg-colors();

    transition: border-left-width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor: pointer;

    &.B
    {
        color: lighten($mtg-black, 20%);
    }

    &:hover
    {
        border-left-width: 0.7rem;
        z-index: 999;
    }

    .typeIcon
    {
        max-height: 0.9em;
        width: 0.9em;
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
