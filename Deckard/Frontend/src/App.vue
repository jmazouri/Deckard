<template>
    <div id="app">
        <div class="sideBar">
            <DeckEditor></DeckEditor>
        </div>

        <div class="main">
            <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
                {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
            </div>

            <div class="cardBrowser">
                <input type="text" v-model="searchQuery" placeholder="Search" />
                <button v-on:click="performSearch">
                    <img src="./assets/icons/ui/search.png">
                </button>

                <select v-model="currentSet">
                    <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
                </select>
            </div>

            <CardGrid v-show="setCards.length > 0" :cards="setCards" v-on:searchAll="searchAll"></CardGrid>

            <div class="spinner" v-show="setCards.length <= 0">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Watch} from 'av-ts'

import CardGrid from './components/CardGrid.vue'
import DeckEditor from './components/DeckEditor.vue'

import {Card} from './deckard/models/Card'
import {Set} from './deckard/models/Set'
import {Deck} from './deckard/models/Deck'

import {MessageKind} from './deckard/models/BaseWorkerMessage'
import {BackgroundProcessStatus} from './deckard/models/BackgroundProcessStatus'
import {DataImporterMessage} from './deckard/models/DataImporterMessage'
import {CardDatabase} from './deckard/storage/CardDatabase'

let ImportWorker:any = require("worker-loader!./deckard/workers/DataImporter");

let jsonAllCards = require("file-loader!./assets/AllSets.json");

require('./styles/themes/amonkhet/theme.scss');

@Component({
    components: {'CardGrid' : CardGrid, 'DeckEditor': DeckEditor}
})
export default class App extends Vue
{
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    backgroundStatus:BackgroundProcessStatus = new BackgroundProcessStatus();

    searchQuery: string = "";

    currentSet: Set = new Set();
    allSets: Set[] = [];

    setCards: Card[] = [];

    @Watch('currentSet')
    setHandler(newVal, oldVal)
    {
        let thisVue:App = this;

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
        let thisVue:App = this;
        
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
        let thisVue:App = this;

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
        let thisVue = this;

        if (thisVue.$store.state.allDecks.length == 0 && localStorage["currentDeck"] != undefined)
        {
            let deck = JSON.parse(localStorage["currentDeck"]);
            thisVue.$store.commit('loadDeck', deck);
        }

        thisVue.importer.postMessage(JSON.stringify(new DataImporterMessage("LoadCards", <string>jsonAllCards)));

        this.importer.addEventListener("message", function(event)
        {
            if (event.data.kind == "ProcessStatus")
            {
                thisVue.backgroundStatus = event.data;
                console.info(`${event.data.currentMessage}: [${event.data.currentProgress}/${event.data.maxProgress}]`);
            }

            if (event.data.kind == "LoadCards")
            {
                CardDatabase.instance.getAllSets()
                    .then(function(value)
                    {
                        thisVue.allSets = _.sortBy(value, function(set: Set)
                        {
                            return set.releaseDate;
                        });

                        thisVue.currentSet = _.last(thisVue.allSets);
                    });
                
                console.info(`[${event.data.kind}] ${event.data.data}`);
            }

            if (event.data.kind == "Error")
            {
                console.error(event.data);
            }            
        });
    }
}
</script>
