<template>
    <div id="app">
        <div class="sideBar">
            <DeckEditor></DeckEditor>
        </div>

        <div class="main">
            <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
                {{backgroundStatus.currentMessage}} [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
            </div>

            <div class="tabContainer">
                <span class="tab" v-for="tab in tabs" 
                      v-on:click="currentTab = tab.id"
                      v-bind:class="{'current': currentTab == tab.id}">{{tab.name}}</span>
            </div>

            <CardBrowser :allSets="allSets" v-show="currentTab == 'browser'"></CardBrowser>
            <Settings v-show="currentTab == 'settings'"></Settings>

        </div>
    </div>
</template>

<script lang="ts">
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Watch} from 'av-ts'

import CardGrid from './components/CardGrid.vue'
import DeckEditor from './components/DeckEditor.vue'
import CardBrowser from './components/CardBrowser.vue'
import Settings from './components/Settings.vue'

import {Card} from './deckard/models/Card'
import {Set} from './deckard/models/Set'
import {Deck} from './deckard/models/Deck'

import {MessageKind} from './deckard/models/BaseWorkerMessage'
import {BackgroundProcessStatus} from './deckard/models/BackgroundProcessStatus'
import {DataImporterMessage} from './deckard/models/DataImporterMessage'
import {CardDatabase} from './deckard/storage/CardDatabase'

let ImportWorker:any = require("worker-loader!./deckard/workers/DataImporter");

let jsonAllCards = require("file-loader!./assets/AllSets.json");

require('./styles/themes/' + localStorage['theme'] + '/theme.scss');

@Component({
    components: {'CardGrid' : CardGrid, 'DeckEditor': DeckEditor,
                 'CardBrowser': CardBrowser, 'Settings': Settings}
})
export default class App extends Vue
{
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    backgroundStatus:BackgroundProcessStatus = new BackgroundProcessStatus();   
    
    allSets: Set[] = [];

    tabs =
    [
        {
            id: "browser",
            name: "Browser"
        },
        {
            id: "settings",
            name: "Settings"
        }
    ];

    currentTab = "browser";

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
