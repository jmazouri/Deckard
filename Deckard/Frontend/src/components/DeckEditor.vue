<template>
    <div class="deckEditor">

        <contextMenu ref="deckOpts" @ctx-open="onCtxOpen">
            <li class="ctx-item" @click="showImportModal = true">Import from Text</li>
            
            <li class="separator"></li>
            <li class="ctx-item" @click="exportDeck()">Export to Text</li>
            <li class="ctx-item" @click="buyDeck()">Export to TCGPlayer</li>
        </contextMenu>
    
        <div class="options">
            <select class="deckSelector" v-model="selectedDeck">
                <option v-for="deck in $store.state.deck.allDecks" v-bind:value="deck">{{deck.name}}</option>
            </select>

            <br />

            <div class="buttonRow">
                <button v-on:click="showNewModal = true">New</button>
                <button v-on:click="deleteDeck()">Delete</button>
                <button @click="$refs.deckOpts.open($event)">Options</button>
            </div>
        </div>

        <CardGrid class="smaller" :isGrouped="true" :showAllText="false" v-on:addToDeck="addToDeck"
            :cards="currentCards" :removeCard="true" v-on:removeFromDeck="removeFromDeck"></CardGrid>

        <div class="importDeck modal" v-if="showImportModal">
            <button v-on:click="showImportModal = false">X</button>
            <div class="modalContent">
                <input type="text" v-model="newDeckName" placeholder="Deck Name"/>
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
        padding: 0.5em 0 0 0.5em;

        .buttonRow
        {
            display: flex;
            justify-content: space-around;

            margin-bottom: 0.5em;

            & > *
            {
                flex-grow: 1;
                &:not(:nth-child(1))
                {
                    margin-left: 1px;
                }
                &:last-child
                {
                    margin-left: 200px;
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
    width: 84%;
    height: 375px;

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
    components: {'CardGrid' : CardGrid, 'contextMenu': require('vue-context-menu')}
})
export default class DeckEditor extends Vue
{
    showImportModal: boolean = false;
    textImport: string = "";

    showNewModal: boolean = false;
    newDeckName: string = "";

    get selectedDeck() : Deck
    {
        return this.$store.state.deck.currentDeck;
    }

    set selectedDeck(deck: Deck)
    {
        this.$store.commit('deck/setCurrentDeck', deck);
    }

    get currentCards()
    {
        return (this.selectedDeck != undefined ? this.selectedDeck.cards : []);
    }

    deleteDeck()
    {
        this.$store.commit('deck/deleteCurrentDeck');
        this.$store.commit('deck/setCurrentDeck', this.$store.state.allDecks[0]);
    }

    onCtxOpen(vars)
    {
        
    }

    //Do some fun form POSTing to TCGPlayer
    buyDeck()
    {
        let baseUrl = "http://store.tcgplayer.com/massentry/";
        let cardList = this.getDeckAsString("||");

        //Create a form
        let form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
        form.action = baseUrl;
        form.style.display = "none";

        //Create the input for the form, and pass our
        //list of cards
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "c";
        input.value = cardList;
        form.appendChild(input);

        //Submit the form and delete it
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    exportDeck()
    {
        let baseUrl = "data:text/plain,";
        baseUrl = baseUrl + this.getDeckAsString("\r\n");

        let downloadLink = document.createElement("a");
        downloadLink.href = encodeURI(baseUrl);
        downloadLink.download = "myDeck.txt";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    getDeckAsString(separator: string): string
    {
        let ret: string = "";
        let cards: any = _.groupBy(this.selectedDeck.cards, function(card: Card) { return card.name });

        for (let cardGrp in cards)
        {
            ret += cards[cardGrp].length + " " + cardGrp + separator;
        }

        return ret;
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

                thisVue.$store.commit('deck/loadDeck', newDeck);
                thisVue.newDeckName = "New Deck";
                thisVue.showImportModal = false;
            });
    }

    createDeck()
    {
        let newDeck: Deck = new Deck();
        newDeck.name = this.newDeckName;
        newDeck.cards = [];

        this.$store.commit('deck/loadDeck', newDeck);

        this.showNewModal = false;
        this.newDeckName = "New Deck";
    }

    removeFromDeck(card)
    {
        this.$store.commit('deck/removeFromDeck', card);
    }

    addToDeck(card)
    {
        this.$store.commit('deck/addToDeck', card);
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
