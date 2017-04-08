<template>
    <div class="deckEditor">
    
        <select class="deckSelector">
            <option>Created Deck 1</option>
        </select>

        <br />

        <button v-on:click="showImportModal = true">Import Deck</button>
        <button v-on:click="exportDeck()">Export Deck</button>

        <CardGrid class="smaller" :showAllText="false" :cards="deck" :removeCard="true" v-on:removeFromDeck="removeFromDeck"></CardGrid>

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
}

.importDeckModal
{
    box-sizing: border-box;
    position: absolute;

    background-color: transparentize($mtg-common, 0.1);

    left: 15%;
    top: 14%;
    width: 75%;
    height: 350px;

    .modalContent
    {
        padding: 2em;
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

import CardGrid from './CardGrid.vue'

@Component({
    components: {'CardGrid' : CardGrid}
})
export default class DeckEditor extends Vue
{
    showImportModal: boolean = false;
    textImport: string = "";

    @Prop deck:Card[] = p(
    {
        type: Array,
        required: true,
        default()
        {
            return new Array<Card>();
        }
    })

    exportDeck()
    {
        var baseUrl = "data:text/plain,";

        var cards: any = _.groupBy(this.deck, function(card) { return card.name });

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
        this.deck = [];

        CardDatabase.instance.importCards(this.textImport.split('\n'))
            .then(function(cards)
            {
                thisVue.deck = cards;
            });
    }

    removeFromDeck(card)
    {
        this.$emit('removeFromDeck', card);
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
