<template>
    <div class="deckEditor">
    
        <div class="options">
            <select class="deckSelector" v-model="selectedDeck">
                <option v-for="deck in $store.state.allDecks" v-bind:value="deck">{{deck.name}}</option>
            </select>

            <br />

            <div class="buttonRow">
                <button v-on:click="showNewModal = true">New</button>
                <button v-on:click="deleteDeck()">Delete</button>
                <button v-on:click="showImportModal = true">Import</button>
                <button v-on:click="exportDeck()">Export</button>
            </div>
        </div>

        <CardGrid class="smaller" :isGrouped="true" :showAllText="false" v-on:addToDeck="addToDeck"
            :cards="currentCards" :removeCard="true" v-on:removeFromDeck="removeFromDeck"></CardGrid>

        <div class="importDeck modal" v-if="showImportModal">
            <button v-on:click="showImportModal = false">X</button>
            <div class="modalContent">
                <input type="text" v-model="newDeckName"/>
                <textarea v-model="textImport" placeholder="Paste your deck here..."></textarea>
                <button v-on:click="importDeck()">Import</button>
            </div>
        </div>

        <div class="newDeck modal" v-if="showNewModal">
            <button v-on:click="showNewModal = false">X</button>
            <div class="modalContent">
                <input type="text" v-model="newDeckName"/>
                <button v-on:click="createDeck()">Create</button>
            </div>
        </div>

    </div>
</template>

<style lang="scss">
@import "../styles/variables.scss";

.deckEditor
{
    background: transparent;

    .deckSelector
    {
        width: 100%;
        font-size: 1.25em;
    }

    .options
    {
        padding: 0.5em;

        .buttonRow
        {
            display: flex;
            justify-content: space-around;

            & > *
            {
                flex-grow: 1;
                &:not(:nth-child(1))
                {
                    margin-left: 1px;
                }
            }
        }
    }
}

.importDeck
{
    textarea
    {
        width: 100%;
        height: 280px;
    }

    button
    {
        float: right;
    }
}

.modal
{
    box-sizing: border-box;
    position: absolute;

    background-color: transparentize($mtg-common, 0.1);

    left: 7%;
    top: 6%;
    width: 80%;
    height: 350px;

    .modalContent
    {
        padding: 1em;
    }
}
</style>

<script lang="ts">
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Prop, Mixin, p} from 'av-ts'

import {Card} from '../deckard/models/Card'
import {Deck} from '../deckard/models/Deck'

import {CardDatabase} from '../deckard/storage/CardDatabase'
import CardGrid from './CardGrid.vue'

@Component({
    components: {'CardGrid' : CardGrid}
})
export default class DeckEditor extends Vue
{
    showImportModal: boolean = false;
    textImport: string = "";

    showNewModal: boolean = false;
    newDeckName: string = "New Deck";

    get selectedDeck() : Deck
    {
        return this.$store.state.currentDeck;
    }

    set selectedDeck(deck: Deck)
    {
        this.$store.commit('setCurrentDeck', deck);
    }

    get currentCards()
    {
        return (this.selectedDeck != undefined ? this.selectedDeck.cards : []);
    }

    deleteDeck()
    {
        this.$store.commit('deleteCurrentDeck');
        this.$store.commit('setCurrentDeck', this.$store.state.allDecks[0]);
    }

    exportDeck()
    {
        var baseUrl = "data:text/plain,";

        var cards: any = _.groupBy(this.selectedDeck.cards, function(card: Card) { return card.name });

        for (let cardGrp in cards)
        {
            baseUrl += cards[cardGrp].length + " ";
            baseUrl += cardGrp + "\r\n";
        }

        var downloadLink = document.createElement("a");
        downloadLink.href = encodeURI(baseUrl);
        downloadLink.download = "myDeck.txt";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    importDeck()
    {
        let thisVue:DeckEditor = this;

        CardDatabase.instance.importCards(this.textImport.split('\n'))
            .then(function(cards)
            {
                let newDeck: Deck = new Deck();
                newDeck.name = thisVue.newDeckName;
                newDeck.cards = cards;

                thisVue.$store.commit('loadDeck', newDeck);
                thisVue.newDeckName = "New Deck";
                thisVue.showImportModal = false;
            });
    }

    createDeck()
    {
        let newDeck: Deck = new Deck();
        newDeck.name = this.newDeckName;
        newDeck.cards = [];

        this.$store.commit('loadDeck', newDeck);

        this.showNewModal = false;
        this.newDeckName = "New Deck";
    }

    removeFromDeck(card)
    {
        this.$store.commit('removeFromDeck', card);
    }

    addToDeck(card)
    {
        this.$store.commit('addToDeck', card);
    }



    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
