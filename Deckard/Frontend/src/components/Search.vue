<template>
    <div class="search">
        <div class="options">
            <input type="text" v-if="!showAdvanced" v-model="searchQuery" class="mainSearch" @keyup.enter="performSearch" placeholder="Search for cards or rules text" />
            <input type="text" v-else disabled class="mainSearch" v-bind:value="queryDetails" />

            <button v-on:click="performSearch">
                <span v-html="searchIconPath"></span>
            </button>
            <button v-on:click="showAdvanced = !showAdvanced">
                <span v-html="moreIconPath"></span>
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
                    <div class="half">
                        <label>Set</label>
                        <vSelect multiple v-model="currentQuery.sets" placeholder="Only include sets" :options="allSets" label="name"></vSelect>
                    </div>
                    
                    <div class="half">
                        
                    </div>
                </div>

                <div class="full">
                    <!--
                    <label>Format</label>
                    <vSelect multiple placeholder="Only if legal in formats" :options="allFormats" v-model="currentQuery.formats"></vSelect>
                    -->
                    <div class="half">
                        <div class="third">
                            <label>CMC</label>
                            <NumericCriteriaInput v-model="currentQuery.cmc"></NumericCriteriaInput>
                        </div>
                        <div class="third">
                            <label>Power</label>
                            <NumericCriteriaInput v-model="currentQuery.power"></NumericCriteriaInput>
                        </div>
                        <div class="third">
                            <label>Toughness</label>
                            <NumericCriteriaInput v-model="currentQuery.toughness"></NumericCriteriaInput>
                        </div>
                    </div>

                    <div class="half colors">
                        <div class="half">
                            <label>Colors</label>
                            <br />
                            <ImageCheckBox class="W" :checkedIcon="'W'" v-model="currentQuery.colors['W']" v-on:checkChanged="currentQuery.colors['W'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="U" :checkedIcon="'U'" v-model="currentQuery.colors['U']" v-on:checkChanged="currentQuery.colors['U'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="B" :checkedIcon="'B'" v-model="currentQuery.colors['B']" v-on:checkChanged="currentQuery.colors['B'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="R" :checkedIcon="'R'" v-model="currentQuery.colors['R']" v-on:checkChanged="currentQuery.colors['R'] = $event"></ImageCheckBox>
                            <ImageCheckBox class="G" :checkedIcon="'G'" v-model="currentQuery.colors['G']" v-on:checkChanged="currentQuery.colors['G'] = $event"></ImageCheckBox>
                        </div>
                        <div class="half">
                            <label>
                                <input type="checkbox" v-model="currentQuery.excludeUnselectedColors"></input>
                                Exclude Unselected
                            </label>
                            <label>
                                <input type="checkbox" v-model="currentQuery.onlyMulticolor"></input>
                                Only Multicolor
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CardGrid :cards="foundCards"></CardGrid>

        <LoadingSpinner :loading="currentlySearching"></LoadingSpinner>

        <div class="emptyText" v-if="noCardsFound">
            No Cards Found
            <small>Maybe re-check your criteria?</small>
        </div>
    </div>
</template>

<script lang="ts">
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Prop, Mixin, Watch, p} from 'av-ts'

import {Card} from '../deckard/models/Card'
import {Set} from '../deckard/models/Set'
import {Deck} from '../deckard/models/Deck'
import {SearchQuery} from '../deckard/models/search/SearchQuery'

import {CardDatabase} from '../deckard/storage/CardDatabase'

import CardGrid from './CardGrid.vue'
import ImageCheckBox from './ImageCheckBox.vue'
import NumericCriteriaInput from './NumericCriteriaInput.vue'
import LoadingSpinner from './LoadingSpinner.vue'

import vSelect from 'vue-select'

@Component({
    components: {'CardGrid' : CardGrid, 'vSelect': vSelect, 'LoadingSpinner': LoadingSpinner,
                 'ImageCheckBox': ImageCheckBox, 'NumericCriteriaInput': NumericCriteriaInput }
})
export default class Search extends Vue
{
    currentlySearching: boolean = false;

    showAdvanced: boolean = true;

    searchQuery: string = "";
    foundCards: Card[] = [];
    searchIconPath = require('!svg-inline-loader!../assets/icons/ui/search.svg');
    moreIconPath = require('!svg-inline-loader!../assets/icons/ui/more.svg');


    cardTypes: string[] = [];
    cardSubTypes: string[] = [];
    allFormats: string[] = ["Standard", "Modern", "Commander", "Legacy"];
    allSets: Set[] = [];

    currentQuery: SearchQuery = new SearchQuery();
    hasLoaded: boolean = false;
    noCardsFound: boolean = false;

    get deck()
    {
        return this.$store.state.deck.currentDeck;
    }

    get queryDetails()
    {
        let ret: string[] = [];
        let s: SearchQuery = this.currentQuery;

        if (s.name) { ret.push(`Name: ${s.name}`); }
        if (s.rules) { ret.push(`Rules: ${s.rules}`); }
        
        if (s.types.length > 0) { ret.push(s.types.join(', ')); }
        if (s.subtypes.length > 0) { ret.push(s.subtypes.join(', ')); }

        let setNames = _.map(s.sets, function(set) { return set.name; });
        if (s.sets.length > 0) { ret.push(setNames.join(', ')); }

        if (s.cmc.comparison != "N/A") { ret.push(`CMC ${s.cmc.comparison} ${s.cmc.value}`); }
        if (s.power.comparison != "N/A") { ret.push(`Power ${s.power.comparison} ${s.power.value}`); }
        if (s.toughness.comparison != "N/A") { ret.push(`Toughness ${s.toughness.comparison} ${s.toughness.value}`); }

        if (s.selectedColors.length > 0) { ret.push(s.selectedColors.join(', ')); }

        if (s.excludeUnselectedColors) { ret.push('Exclude Unselected Colors'); }
        if (s.onlyMulticolor) { ret.push('Only multicolor'); }

        return ret.join(', ');
    }

    performSearch()
    {
        let thisVue:Search = this;

        thisVue.currentlySearching = true;
        thisVue.noCardsFound = false;
        thisVue.foundCards = [];

        if (this.showAdvanced)
        {
            CardDatabase.instance.advancedSearchCards(this.currentQuery)
                .then(function(cards)
                {
                    thisVue.foundCards = cards;
                    thisVue.currentlySearching = false;

                    if (cards.length == 0)
                    {
                        thisVue.noCardsFound = true;
                    }
                });
        }
        else
        {
            CardDatabase.instance.searchCards(this.searchQuery)
                .then(function(cards)
                {
                    thisVue.foundCards = cards;
                    thisVue.currentlySearching = false;

                    if (cards.length == 0)
                    {
                        thisVue.noCardsFound = true;
                    }
                });
        }
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        if (localStorage["search"] != undefined)
        {
            var load = SearchQuery.revive(JSON.parse(localStorage["search"]));

            this.currentQuery = load;
        }

        this.hasLoaded = true;

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

        CardDatabase.instance.getAllSets()
            .then(function(sets: Set[])
            {
                thisVue.allSets = sets;
            });
    }

    @Lifecycle updated()
    {
        if (this.hasLoaded)
        {
            localStorage["search"] = JSON.stringify(this.currentQuery);
        }
    }
}
</script>
