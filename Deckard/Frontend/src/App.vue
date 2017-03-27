<template>
    <div id="app">
        <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
            {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
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

        Set: 
        <select v-model="currentSet">
            <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
        </select>

        <CardGrid :cards="setCards"></CardGrid>
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

.headerStatus.animating
{
    animation-name: slidein;
    animation-duration: 0.33s;
    animation-fill-mode: backwards;
}


.mainContent
{
    position: fixed;

    left: 40%;
    width: 45%;
}

.sideBar
{
    float: left;
    width: 40%;
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

    currentCard:Card = new Card();
    setCards: Card[] = [];

    @Watch('currentSet')
    setHandler(newVal, oldVal)
    {
        let thisVue:App = this;

        if (thisVue.currentSet == undefined)
        {
            return;
        }

        CardDatabase.getCardsInSet(thisVue.currentSet.code)
            .then(function(cards)
            {
                thisVue.setCards = cards;
                thisVue.currentCard = thisVue.setCards[0];
            });
    }

    @Watch('deck')
    deckHandler(newVal, oldVal)
    {
        localStorage["currentDeck"] = JSON.stringify(newVal);
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
                CardDatabase.getAllSets()
                    .then(function(value)
                    {
                        thisVue.allSets = value;
                        thisVue.currentSet = thisVue.allSets["AER"];
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
