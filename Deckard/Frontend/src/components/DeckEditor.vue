<template>
    <div class="deckEditor">
    
        <div class="options">
            <select class="deckSelector">
                <option v-for="deck in $store.state.allDecks">{{deck.name}}</option>
            </select>

            <br />

            <button v-on:click="showImportModal = true">Import Deck</button>
            <button v-on:click="exportDeck()">Export Deck</button>
        </div>

        <CardGrid class="smaller" :isGrouped="true" :showAllText="false" 
            :cards="currentCards" :removeCard="true" v-on:removeFromDeck="removeFromDeck"></CardGrid>

        <div class="importDeckModal" v-if="showImportModal">
            <button v-on:click="showImportModal = false">X</button>
            <div class="modalContent">
                <textarea v-model="textImport" placeholder="Paste your deck here..."></textarea>
                <button v-on:click="importDeck()">Import</button>
            </div>
        </div>

    </div>
</template>

<style lang="scss">
@import "../styles/variables.scss";

.deckEditor
{
    .deckSelector
    {
        width: 100%;
        font-size: 1.25em;
    }

    .options
    {
        padding: 0.5em;
    }
}

.importDeckModal
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
</style>

<script>
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

    exportDeck()
    {
        var baseUrl = "data:text/plain,";

        var cards: any = _.groupBy(this.$store.state.currentDeck.cards, function(card: Card) { return card.name });

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
        let thisVue:App = this;

        CardDatabase.instance.importCards(this.textImport.split('\n'))
            .then(function(cards)
            {
                let newDeck: Deck = new Deck();
                newDeck.name = "Imported Deck";
                newDeck.cards = cards;

                thisVue.$store.commit('loadDeck', newDeck);
            });
    }

    removeFromDeck(card)
    {
        this.$emit('removeFromDeck', card);
    }

    get currentCards()
    {
        var deck = this.$store.state.currentDeck;

        return (deck != undefined ? deck.cards : []);
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
