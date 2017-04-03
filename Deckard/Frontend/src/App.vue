<template>
    <div id="app">
        <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
            {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
        </div>

        <div class="sideBar">
            <div class="fixed">
                <CardGrid :cards="deck"></CardGrid>
            </div>
        </div>

        <div class="main">
            Set: 
            <select v-model="currentSet">
                <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
            </select>
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
html, body
{
    margin: 0;
    padding: 0;
}

#app
{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;

    display: flex;
    flex-direction: row;
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

.fixed
{
    position: fixed;
    top: 0;
    left: 0;

    width: 27%;
    height: 100%;
    overflow-y: scroll;

    &::-webkit-scrollbar
    {
        width: 8px;
        background: transparent;

        &:hover
        {
            background: rgba(0, 0, 0, 0.25);
        }
    }

    &::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.33);
    }
}

.sideBar
{
    flex-basis: 27%;
    resize: horizontal;
}

.main
{
    flex-basis: 73%;
}

.cardGrid
{
    
}
</style>

<script>
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Watch} from 'av-ts'

import CardGrid from './components/CardGrid.vue'

import {Card} from './deckard/models/Card'
import {Set} from './deckard/models/Set'

import {MessageKind} from './deckard/models/BaseWorkerMessage'
import {BackgroundProcessStatus} from './deckard/models/BackgroundProcessStatus'
import {DataImporterMessage} from './deckard/models/DataImporterMessage'
import {CardDatabase} from './deckard/storage/CardDatabase'

let ImportWorker:any = require("worker-loader!./deckard/workers/DataImporter");

let jsonAllCards = require("file-loader!./assets/AllSets.json");

@Component({
    components: {'CardGrid' : CardGrid}
})
export default class App extends Vue
{
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    backgroundStatus:BackgroundProcessStatus = new BackgroundProcessStatus();

    deck: Card[] = [];

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

    @Watch('deck')
    deckHandler(newVal, oldVal)
    {
        localStorage["currentDeck"] = JSON.stringify(newVal);
    }

    addToDeck(card)
    {
        this.deck.push(card);
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        let thisVue = this;

        thisVue.deck = (localStorage["currentDeck"] == undefined ? [] : JSON.parse(localStorage["currentDeck"]));

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
