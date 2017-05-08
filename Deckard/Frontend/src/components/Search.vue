<template>
    <div class="search">
        <div class="options">
            <input type="text" v-model="searchQuery" autofocus="focusBox" @keyup.enter="performSearch" placeholder="Search" />
            <button v-on:click="performSearch">
                <span v-html="searchIconPath"></span>
            </button>
        </div>

        <CardGrid v-show="foundCards.length > 0" :cards="foundCards" v-on:searchAll=""></CardGrid>

        <div class="spinner" v-show="foundCards && foundCards.length <= 0">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
    </div>
</template>

<script lang="ts">
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Prop, Mixin, Watch, p} from 'av-ts'

import {Card} from '../deckard/models/Card'
import {Set} from '../deckard/models/Set'
import {Deck} from '../deckard/models/Deck'

import {CardDatabase} from '../deckard/storage/CardDatabase'
import CardGrid from './CardGrid.vue'

@Component({
    components: {'CardGrid' : CardGrid}
})
export default class Search extends Vue
{
    focusBox: boolean = true;
    searchQuery: string = "";
    foundCards: Card[] = [];
    searchIconPath = require('svg-inline-loader!../assets/icons/ui/search.svg');

    get deck()
    {
        return this.$store.state.deck.currentDeck;
    }

    performSearch()
    {
        let thisVue:Search = this;

        thisVue.foundCards = [];

        CardDatabase.instance.searchCards(this.searchQuery)
            .then(function(cards)
            {
                thisVue.foundCards = cards;
            });
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }

    @Lifecycle updated()
    {
        this.focusBox = true;
    }
}
</script>
