<template>
    <div id="app">
        <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
            {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
        </div>

        <div class="mainContent">
            <FullCard :currentCard="currentCard" v-if="currentCard.mciNumber == undefined"></FullCard>
            <img v-else v-bind:src="'http://magiccards.info/scans/en/' + currentSet.magicCardsInfoCode + '/' + currentCard.mciNumber + '.jpg'"></img>
        </div>

        <div class="sideBar">
            Set: 
            <select v-model="currentSet">
                <option v-for="set in allSets" v-bind:value="set">{{set.name}}</option>
            </select>
            <ul>
                <li v-for="card in setCards">
                    <a href="#" v-on:click="currentCard = card">{{card.name}}</a>
                </li>
            </ul>
        </div>
    
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
    float: left;
    width: 45%;
}

.sideBar
{
    float: left;
    width: 40%;
}
</style>

<script>
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Watch} from 'av-ts'

import FullCard from './components/FullCard.vue'

import {Card} from './deckard/models/Card'
import {Set} from './deckard/models/Set'

import {MessageKind} from './deckard/models/BaseWorkerMessage'
import {BackgroundProcessStatus} from './deckard/models/BackgroundProcessStatus'
import {DataImporterMessage} from './deckard/models/DataImporterMessage'
import {CardDatabase} from './deckard/storage/CardDatabase'

let ImportWorker:any = require("worker-loader!./deckard/workers/DataImporter");

let jsonAllCards = require("file-loader!./assets/AllSets.json");

@Component({
    components: {'FullCard': FullCard}
})
export default class App extends Vue
{
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    backgroundStatus:BackgroundProcessStatus = new BackgroundProcessStatus();

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

    // lifecycle hook
    @Lifecycle mounted()
    {
        let thisVue = this;

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
