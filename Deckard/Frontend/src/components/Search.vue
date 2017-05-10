<template>
    <div class="search">
        <div class="options">
            <input type="text" v-model="searchQuery" v-bind:disabled="showAdvanced" class="mainSearch" @keyup.enter="performSearch" placeholder="Search for cards or rules text" />
            <button v-on:click="performSearch">
                <span v-html="searchIconPath"></span>
            </button>
            <button v-on:click="showAdvanced = !showAdvanced">
                V
            </button>

            <div class="advancedSearch" v-show="showAdvanced">
                <label>
                    <div>Name</div>
                    <input v-model="currentQuery.name" type="text"></input>
                </label>
                <label>
                    <div>Rules</div>
                    <input v-model="currentQuery.rules" type="text"></input>
                </label>

                <br />

                <label>Type</label>
                <vSelect multiple v-model="currentQuery.types" placeholder="Filter card types" :options="cardTypes"></vSelect>
                
                <label>Subtype</label>
                <vSelect multiple v-model="currentQuery.subtypes" placeholder="Filter card subtypes" :options="cardSubTypes"></vSelect>
            </div>
        </div>

        <CardGrid v-show="foundCards.length > 0" :cards="foundCards" v-on:searchAll=""></CardGrid>

        <div class="spinner" v-show="foundCards && foundCards.length <= 0 && searchQuery">
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
import {SearchQuery} from '../deckard/models/SearchQuery'

import {CardDatabase} from '../deckard/storage/CardDatabase'
import CardGrid from './CardGrid.vue'

import vSelect from 'vue-select'

@Component({
    components: {'CardGrid' : CardGrid, 'vSelect': vSelect }
})
export default class Search extends Vue
{
    showAdvanced: boolean = true;

    searchQuery: string = "";
    foundCards: Card[] = [];
    searchIconPath = require('svg-inline-loader!../assets/icons/ui/search.svg');

    cardTypes: string[] = [];
    cardSubTypes: string[] = [];

    currentQuery: SearchQuery = new SearchQuery();

    get deck()
    {
        return this.$store.state.deck.currentDeck;
    }

    performSearch()
    {
        let thisVue:Search = this;

        thisVue.foundCards = [];

        if (this.showAdvanced)
        {
            CardDatabase.instance.advancedSearchCards(this.currentQuery)
                .then(function(cards)
                {
                    thisVue.foundCards = cards;
                });
        }
        else
        {
            CardDatabase.instance.searchCards(this.searchQuery)
                .then(function(cards)
                {
                    thisVue.foundCards = cards;
                });
        }
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        let thisVue:Search = this;

        CardDatabase.instance.getAllSubtypes()
            .then(function(types)
            {
                thisVue.cardSubTypes = types;
            });

        CardDatabase.instance.getAllTypes()
            .then(function(types)
            {
                thisVue.cardTypes = types;
            });
    }

    @Lifecycle updated()
    {
        
    }
}
</script>
