<template>
    <div class="cardBrowser">
        <div class="options">
            <vSelect tabindex="1" v-model="currentSet" :options="allSets" label="name"></vSelect>
        </div>

        <CardGrid :cards="setCards" v-on:searchAll="searchAll"></CardGrid>

        <LoadingSpinner :loading="setCards.length <= 0"></LoadingSpinner>
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
import LoadingSpinner from './LoadingSpinner.vue'

import vSelect from 'vue-select'

@Component({
    components: {'CardGrid' : CardGrid, 'vSelect': vSelect, 'LoadingSpinner': LoadingSpinner }
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
        return this.$store.state.deck.currentDeck;
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
