<template>
    <div id="app">
        <div class="sideBar" v-bind:class="{'hidden': !showSidebar}">
            <DeckEditor></DeckEditor>
        </div>

        <button class="toggleShow" v-on:click="showSidebar = !showSidebar" v-bind:class="{'shown': showSidebar}" title="Toggle Sidebar">
            <div>
                <template v-if="showSidebar">&lt;<br>&lt;<br>&lt;</template>
                <template v-else>&gt;<br>&gt;<br>&gt;</template>
            </div>
        </button>

        <div class="main" v-bind:class="{'withoutSidebar': !showSidebar}">
            <div class="headerStatus" v-show="backgroundStatus.currentMessage != undefined">
                {{backgroundStatus.currentMessage}}
                <template v-if="backgroundStatus.currentProgress && backgroundStatus.maxProgress">
                    [{{backgroundStatus.currentProgress}}/{{backgroundStatus.maxProgress}}]
                </template>
            </div>

            <div class="tabContainer">
                <span class="tab" v-for="tab in tabs" 
                      v-on:click="currentTab = tab.id"
                      v-bind:class="{'current': currentTab == tab.id}" v-bind:id="tab.id">{{tab.name}}</span>
            </div>

            <div v-show="!(backgroundStatus.currentMessage != undefined)">
                <CardBrowser :allSets="allSets" v-show="currentTab == 'browse'"></CardBrowser>
                <Settings v-show="currentTab == 'settings'"></Settings>
                <Search v-show="currentTab == 'search'"></Search>
            </div>

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
import Search from './components/Search.vue'

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
    components: {'CardGrid' : CardGrid, 'DeckEditor': DeckEditor,
                 'CardBrowser': CardBrowser, 'Settings': Settings,
                 'Search': Search}
})
export default class App extends Vue
{
    showSidebar = true;
    loadStatus = new BackgroundProcessStatus();
    importer = ImportWorker();

    backgroundStatus:BackgroundProcessStatus = new BackgroundProcessStatus();   
    
    allSets: Set[] = [];

    tabs =
    [
        {
            id: "browse",
            name: "Browse"
        },
        {
            id: "search",
            name: "Search"
        },
        {
            id: "settings",
            name: "⚙ Settings"
        }
    ];

    currentTab = "search";

    // lifecycle hook
    @Lifecycle mounted()
    {
        let thisVue = this;

        if (thisVue.$store.state.deck.allDecks.length == 0 && localStorage["currentDeck"] != undefined)
        {
            let deck = JSON.parse(localStorage["currentDeck"]);
            thisVue.$store.commit('deck/loadDeck', deck);
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
                let newStatus = new BackgroundProcessStatus();
                newStatus.currentMessage = "Loading Sets...";
                thisVue.backgroundStatus = newStatus;

                CardDatabase.instance.getAllSets()
                    .then(function(value)
                    {
                        thisVue.allSets = _.sortBy(value, function(set: Set)
                        {
                            return set.releaseDate;
                        });

                        thisVue.backgroundStatus = new BackgroundProcessStatus();
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
