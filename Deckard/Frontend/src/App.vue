<template>
    <div id="app">
        <div class="sideBar">
            <DeckEditor v-on:removeFromDeck="removeFromDeck"></DeckEditor>
        </div>

        <div class="main">
            <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
                {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
            </div>

            <div class="cardBrowser">
                Search:
                <input type="text" v-model="searchQuery" />
                <button v-on:click="performSearch">Search</button>
                <br />

                Set: 
                <select v-model="currentSet">
                    <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
                </select>
            </div>

            <CardGrid v-show="setCards.length > 0" :cards="setCards" v-on:addToDeck="addToDeck"></CardGrid>

            <div class="spinner" v-show="setCards.length <= 0">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>



        <!--
        <template v-if="false">
            <div class="sideBar">
                Set: 
                <select v-model="currentSet">
                    <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
                </select>
                <ul>
                    <li v-for="card in setCards">
                        <a href="#" v-on:mouseover="currentCard = card">{{card.name}}</a>
                        <button v-on:click="deck.push(card)">+</button>
                    </li>
                </ul>
            </div>

            <div class="mainContent">
                <FullCard :currentCard="currentCard" v-if="currentCard.mciNumber == undefined"></FullCard>
                <img v-else v-bind:src="'http://magiccards.info/scans/en/' + currentSet.magicCardsInfoCode + '/' + currentCard.mciNumber + '.jpg'"></img>

                <div>
                    <ul>
                        <li v-for="card in deck">
                            <a href="#" v-on:mouseover="currentCard = card">{{card.name}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
        -->
    </div>
</template>

<style lang="scss">
@import "./styles/variables.scss";
@import "./styles/reset.scss";

html, body
{
    margin: 0;
    padding: 0;
}

*
{
    &::-webkit-scrollbar
    {
        width: 10px;
    }

    &::-webkit-resizer
    {
        background: red;
        border: 1px dotted black;
    }

    &::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.25);

        &:hover
        {
            background: rgba(0, 0, 0, 0.33);
        }
    }
}

#app
{
    max-width: calc(100% - 8px);

    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.headerStatus
{
    box-sizing: border-box;

    color: black;

    width: 100%;
    text-align: center;
    padding: 8px;

    background-color: goldenrod;    
}

.sideBar
{
    position: sticky;
    top: 0;

    height: 100vh;

    resize: horizontal;

    width: 33vw;
    min-width: 25vw;

    /*
    position: fixed;
    top: 0;
    left: 0;
    */

    overflow-y: scroll;
    overflow-x: hidden;

    box-shadow: 2px 0px 4px -1px lighten(black, 33%);

    h2
    {
        text-align: center;

        font-weight: bold;
        font-size: 1.5em;

        margin-bottom: 0.66em;
        padding: 0.25em 0.5em;
        
        box-shadow: 0px 14px 16px -10px black;
    }
}

.main
{
    padding: 0.5em;

    width: 67vw;
    min-width: 50vw;

    .cardBrowser
    {
        margin-bottom: 1em;
    }
}

.cardGrid
{
    
}
</style>

<script>
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

    addToDeck(card)
    {
        this.$store.commit('addToDeck', card);
    }

    removeFromDeck(card)
    {
        this.$store.commit('removeFromDeck', card);
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

        if (localStorage["currentDeck"] != undefined)
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
                        thisVue.allSets = value;
                        thisVue.currentSet = _.first(thisVue.allSets);
                    });
                
                console.info(`[${event.data.kind}] ${event.data.data}`);
            }

            if (event.data.kind == "Error")
            {
                console.error(event.data);
            }

            /*
            CardDatabase.getAllSets()
                .then(function(value)
                {
                    thisVue.currentCardId = 417618;
                });
            */
            
        });
    }
}
</script>
