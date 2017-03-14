<template>
  <div id="app">
    <input type="number" v-model="currentCardId">
    <div class="fullArt">
        <span class="cardTitle">{{currentCard.name}}</span>
        <span class="cmc">{{currentCard.cmc}}</span>
    </div>
  </div>
</template>

<style lang="scss">
#app
{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

.fullArt
{
    background-image: url(http://i.imgur.com/4CMXVNi.jpg);
    width: 400px;
    height: 560px;

    & > *
    {
        position: relative;
    }

    .cardTitle
    {
        font-weight: bold;
        font-size: 18px;
        
        top: 37px;
        left: 38px;
    }

    .cmc
    {
        background-color: rgb(195, 187, 183);
        font-weight: bold;
        padding: 2px 6px 2px 6px;
        border-radius: 32px;

        left: 212px;
        top: 36px;
    }
}
</style>

<script>
import {Vue, Component, Lifecycle, Watch} from 'av-ts'

import {Card} from './deckard/models/Card'
import {BackgroundProcessStatus} from './deckard/models/BackgroundProcessStatus'
import {MessageKind, DataImporterMessage} from './deckard/models/DataImporterMessage'
import {CardDatabase} from './deckard/storage/CardDatabase'

let ImportWorker:any = require("worker-loader!./deckard/workers/DataImporter");

let jsonSetList = require("file-loader!./assets/SetList.json");
let jsonAllCards = require("file-loader!./assets/AllSets.json");

@Component
export default class App extends Vue
{
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    currentCardId = 0;
    currentCard:Card = new Card();

    @Watch('currentCardId')
    handler(newVal, oldVal)
    {
        let thisVue:App = this;

        CardDatabase.getCard(parseInt(newVal))
            .then(function(value)
            {
                thisVue.currentCard = value;
            })
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        this.importer.postMessage(JSON.stringify(new DataImporterMessage("LoadSets", <string>jsonSetList)));

        let thisImporter = this.importer;
        this.importer.addEventListener("message", function(event)
        {
            if (event.data.kind == "LoadSets")
            {
                thisImporter.postMessage(JSON.stringify(new DataImporterMessage("LoadCards", <string>jsonAllCards)));
            }

            console.log(event);
        });

        this.currentCardId = 5;
    }
}
</script>
