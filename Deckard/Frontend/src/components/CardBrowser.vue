<template>
    <div class="cardBrowser">
        <input type="text" v-model="searchQuery" placeholder="Search" />
        <button v-on:click="performSearch">
            <span v-html="searchIconPath"></span>
        </button>

        <select v-model="currentSet">
            <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
        </select>

        <CardGrid v-show="setCards.length > 0" :cards="setCards" v-on:searchAll="searchAll"></CardGrid>

        <div class="spinner" v-show="setCards.length <= 0">
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
export default class CardBrowser extends Vue
{
    @Prop allSets:any = p(
    {
        type: Array,
        required: true,
        default()
        {
            return new Array<Set>();
        }
    })

    currentSet: Set = new Set();

    @Watch('allSets')
    allSetHandler(newSet, oldSet)
    {
        this.currentSet = <Set>_.last(this.allSets);
    }

    searchQuery: string = "";

    setCards: Card[] = [];

    searchIconPath = require('svg-inline-loader!../assets/icons/ui/search.svg');

    @Watch('currentSet')
    setHandler(newVal, oldVal)
    {
        let thisVue:CardBrowser = this;

        if (thisVue.currentSet == undefined)
        {
            return;
        }

        thisVue.setCards = [];

        CardDatabase.instance.getCardsInSet(thisVue.currentSet.code)
            .then(function(cards)
            {
                thisVue.setCards = cards;
            });
    }

    searchAll(card)
    {
        let thisVue:CardBrowser = this;
        
        this.setCards = [];

        CardDatabase.instance.findAllVersions(card)
            .then(function(cards)
            {
                thisVue.setCards = cards;
            });
    }
    
    get deck()
    {
        return this.$store.state.currentDeck;
    }

    performSearch()
    {
        let thisVue:CardBrowser = this;

        thisVue.setCards = [];

        CardDatabase.instance.searchCards(this.searchQuery)
            .then(function(cards)
            {
                thisVue.setCards = cards;
            });
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        this.currentSet = <Set>_.last(this.allSets);
    }
}
</script>
