<template>
    <div id="app">
        <div class="headerStatus">
            {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
        </div>

        <div class="mainContent">
            <input type="number" v-model="currentCardId">
            <FullCard :currentCard="currentCard"></FullCard>
        </div>

        <div class="sideBar">
            <ul>
                <li v-for="card in setCards">
                    <a href="#" v-on:click="currentCardId = card.multiverseid">{{card.name}}</a>
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



.sideBar
{
    float: left;
    width: 50%;
}

.mainContent
{
    float: left;
    width: 50%;
}
</style>

<script>
import {Vue, Component, Lifecycle, Watch} from 'av-ts'

import FullCard from './components/FullCard.vue'

import {Card} from './deckard/models/Card'
import {Set} from './deckard/models/Set'

import {MessageKind} from './deckard/models/BaseWorkerMessage'
import {BackgroundProcessStatus} from './deckard/models/BackgroundProcessStatus'
import {DataImporterMessage} from './deckard/models/DataImporterMessage'
import {CardDatabase} from './deckard/storage/CardDatabase'

let ImportWorker:any = require("worker-loader!./deckard/workers/DataImporter");

let jsonSetList = require("file-loader!./assets/SetList.json");
let jsonAllCards = require("file-loader!./assets/AllSets.json");

@Component({
    components: {'FullCard': FullCard}
})
export default class App extends Vue
{
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    backgroundStatus:BackgroundProcessStatus = new BackgroundProcessStatus();

    currentCardId = 0;
    currentCard:Card = new Card();

    setCards: Card[] = [];

    get currentCardText()
    {
        var symbolIcons = 
        {
            "{E}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/7/7c/E.svg",
            "{T}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/b/be/T.svg"
        }

        const ruleRegex = /\(.+\)/g;
        const manaCountRegex = /{\d}/g;

        let cardHtml:string = this.currentCard.text;

        if (cardHtml == undefined) { return ""; }

        cardHtml = cardHtml.replace(ruleRegex, function(match)
        {
            return `<span class='rulesText'>${match}</span>`;
        });

        cardHtml = cardHtml.replace(manaCountRegex, function (match)
        {
            return `<span class="symbol">${match.substr(1, match.length - 2)}</span>`;
        });

        for (var symbol in symbolIcons)
        {
            if (symbolIcons.hasOwnProperty(symbol))
            {
                cardHtml = cardHtml.replace(new RegExp(symbol, 'g'), function(match)
                {
                    return `<img class='textIcon' src="${symbolIcons[symbol]}">`;
                });
            }
        }

        return cardHtml;
    }

    @Watch('currentCardId')
    handler(newVal, oldVal)
    {
        let thisVue:App = this;

        CardDatabase.getCard(parseInt(newVal))
            .then(function(value)
            {
                if (value != undefined)
                {
                    thisVue.currentCard = value;
                }
            })
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        this.importer.postMessage(JSON.stringify(new DataImporterMessage("LoadSets", <string>jsonSetList)));

        let thisVue = this;
        this.importer.addEventListener("message", function(event)
        {
            if (event.data.kind == "ProcessStatus")
            {
                thisVue.backgroundStatus = event.data;
                console.info(`${event.data.currentMessage}: [${event.data.currentProgress}/${event.data.maxProgress}]`);
            }

            if (event.data.kind == "LoadSets")
            {
                thisVue.importer.postMessage(JSON.stringify(new DataImporterMessage("LoadCards", <string>jsonAllCards)));
                console.info(`${event.data.kind}: ${event.data.data}`);
            }

            if (event.data.kind == "LoadCards")
            {
                CardDatabase.getAllSets()
                    .then(function(value)
                    {
                        for (var set in value)
                        {
                            if (value.hasOwnProperty(set))
                            {
                                CardDatabase.getCardsInSet(set)
                                    .then(function(cards)
                                    {
                                        thisVue.setCards = thisVue.setCards.concat(cards);
                                    });    
                            }
                        }
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
