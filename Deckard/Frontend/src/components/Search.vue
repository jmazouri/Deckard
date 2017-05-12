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

                <div class="full">
                    <div class="half">
                        <label>Name</label>
                        <input class="wide" v-model="currentQuery.name" type="text"></input>
                    </div>

                    <div class="half">
                        <label>Rules</label>
                        <input class="wide" v-model="currentQuery.rules" type="text"></input>
                    </div>
                </div>

                <div class="full">
                    <div class="half">
                        <label>Type</label>
                        <vSelect multiple v-model="currentQuery.types" placeholder="Only include types" :options="cardTypes"></vSelect>
                    </div>
                    
                    <div class="half">
                        <label>Subtype</label>
                        <vSelect multiple v-model="currentQuery.subtypes" placeholder="Only include subtypes" :options="cardSubTypes"></vSelect>
                    </div>
                </div>

                <div class="full">
                    <label>Format</label>
                    <vSelect multiple placeholder="Only if legal in formats" :options="allFormats"></vSelect>

                    <div class="half">
                        <div class="third">
                            <label>CMC</label>
                            <input type="number"></input>
                        </div>
                        <div class="third">
                            <label>Power</label>
                            <input type="number"></input>
                        </div>
                        <div class="third">
                            <label>Toughness</label>
                            <input type="number"></input>
                        </div>
                    </div>

                    <div class="half">
                        <div class="half">
                            <label>
                                <input type="checkbox"></input>
                                Exclude Unselected
                            </label>
                        </div>

                        <div class="half">
                            <label>Colors</label>
                            <br />
                            <ImageCheckBox class="W" :checkedIcon="'W'" v-on:checkChanged="currentQuery.colors['W'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="U" :checkedIcon="'U'" v-on:checkChanged="currentQuery.colors['U'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="B" :checkedIcon="'B'" v-on:checkChanged="currentQuery.colors['B'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="R" :checkedIcon="'R'" v-on:checkChanged="currentQuery.colors['R'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="G" :checkedIcon="'G'" v-on:checkChanged="currentQuery.colors['G'] = $event"></ImageCheckBox>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <CardGrid v-show="foundCards.length > 0" :cards="foundCards" v-on:searchAll=""></CardGrid>

        <div class="spinner" v-show="currentlySearching">
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
import ImageCheckBox from './ImageCheckBox.vue'

import vSelect from 'vue-select'

@Component({
    components: {'CardGrid' : CardGrid, 'vSelect': vSelect, 'ImageCheckBox': ImageCheckBox }
})
export default class Search extends Vue
{
    currentlySearching: boolean = false;

    showAdvanced: boolean = true;

    searchQuery: string = "";
    foundCards: Card[] = [];
    searchIconPath = require('!svg-inline-loader!../assets/icons/ui/search.svg');

    cardTypes: string[] = [];
    cardSubTypes: string[] = [];
    allFormats: string[] = ["Standard", "Modern", "Commander", "Legacy"];

    currentQuery: SearchQuery = new SearchQuery();

    debugThing(stuff)
    {
        alert(stuff);
    }

    get deck()
    {
        return this.$store.state.deck.currentDeck;
    }

    performSearch()
    {
        let thisVue:Search = this;

        thisVue.currentlySearching = true;
        thisVue.foundCards = [];

        if (this.showAdvanced)
        {
            CardDatabase.instance.advancedSearchCards(this.currentQuery)
                .then(function(cards)
                {
                    thisVue.foundCards = cards;
                    thisVue.currentlySearching = false;
                });
        }
        else
        {
            CardDatabase.instance.searchCards(this.searchQuery)
                .then(function(cards)
                {
                    thisVue.foundCards = cards;
                    thisVue.currentlySearching = false;
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
