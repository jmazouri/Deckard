<template>
    <div class="cardGrid" v-bind:class="viewMode">
        <div class="sorting">
            <div>
                View:
                <select v-model="viewMode">
                    <option value="bigCards">Big Cards</option>
                    <option value="tinyCards">Tiny Cards</option>
                    <option value="list">List</option>
                    <option value="cardArt">Card Art</option>
                </select>
            </div>

            <div>
                Filter:
                <input type="text" v-model="textFilter"></input>
            </div>

            <div>
                Sort: 
                <select v-model="sorting">
                    <option>Name</option>
                    <option>CMC</option>
                    <option>Color</option>
                    <option>Type</option>
                    <option>Rarity</option>
                </select>
            </div>

            <br />

            <div>
                <div>
                    Show text
                    <input type="checkbox" v-model="showAllText"></input>
                </div>

                <div v-if="showAllText">
                    Show flavor/rules
                    <input type="checkbox" v-model="showAllFullText"></input>
                </div>
            </div>
        </div>

        <contextMenu ref="ctx" @ctx-open="onCtxOpen">
            <li class="ctx-item" @click="addToDeck()" v-if="!removeCard">Add To Deck</li>
            <li class="ctx-item" @click="removeFromDeck()" v-if="removeCard">Remove From Deck</li>

            <li class="separator"></li>
            <li class="ctx-item" @click="goToGatherer()">View on Gatherer</li>
            <li class="ctx-item" @click="goToTCG()">View on TCGPlayer</li>
        </contextMenu>

        <CardListEntry v-if="viewMode == 'list'" v-for="(card, index) in sortedCards" :key="index"
                       
                @click.native="showFullText(card.multiverseid)"
                @click.ctrl.native="addToDeck(card)"

                :showText="shouldShowText(card.multiverseid)"
                :showDescriptionText="showAllFullText" 
                :currentCard="card"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </CardListEntry>

        <TinyCard v-if="viewMode == 'tinyCards'" v-for="(card, index) in sortedCards" :key="index" 

                @click.native="showFullText(card.multiverseid)"
                @click.ctrl.native="addToDeck(card)"

                :showText="shouldShowText(card.multiverseid)"
                :showDescriptionText="showAllFullText" 
                :currentCard="card"

                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </TinyCard>

        <FullCard v-if="viewMode == 'bigCards'" v-for="(card, index) in sortedCards" :key="index"
                       
                :currentCard="card"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </FullCard>

        <CardArt v-if="viewMode == 'cardArt'" v-for="(card, index) in sortedCards" :key="index"
                       
                :currentCard="card"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </CardArt>

        <div class="noCards" v-if="sortedCards.length == 0">
            No cards found - maybe clear your filters?
        </div>
    </div>
</template>

<style lang="scss">
@import "../styles/loader.scss";

.cardGrid
{
    &.tinyCards, &.cardArt
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    &.cardArt
    {
        justify-content: space-around;
    }

    &.list
    {

    }

    .sorting
    {
        width: 100%;
        justify-content: flex-end;

        margin-bottom: 1em;

        div
        {
            display: inline-block;
        }
    }

    .noCards
    {
        margin: 1em;
        text-align: center;
        font-size: 3em;
    }
}

li.separator
{
    border-bottom: 1px solid black;
}
</style>

<script>
import * as _ from "lodash"

import {Vue, Component, Lifecycle, Prop, p, Watch} from 'av-ts'

import FullCard from './CardViews/FullCard.vue'
import TinyCard from './CardViews/TinyCard.vue'
import CardListEntry from './CardViews/CardListEntry.vue'
import CardArt from './CardViews/CardArt.vue'

import {Card} from '../deckard/models/Card'

@Component({
    components: {'TinyCard' : TinyCard, 'CardListEntry': CardListEntry,
                 'FullCard' : FullCard, 'CardArt': CardArt,
                 'contextMenu': require('vue-context-menu') }
})
export default class CardGrid extends Vue
{
    @Prop cards:any = p(
    {
        type: Array,
        required: true,
        default()
        {
            return new Array<Card>();
        }
    })

    @Prop removeCard: any = p(
    {
        type: Boolean,
        required: false,
        default()
        {
            return false;
        }
    })

    viewMode: string = "list";
    textFilter: string = "";
    sorting: string = "Name";
    showAllFullText: boolean = false;
    showAllText: boolean = true;

    showText: any = {};

    rightClickedCard: any = {};

    @Watch('cards')
    cardsHandler(newVal, oldVal)
    {
        this.showText = {};
    }

    onCtxOpen(vars)
    {
        this.rightClickedCard = vars;
    }

    shouldShowText(multiverseid)
    {
        if (this.showAllText)
        {
            return true;
        }

        if (this.showText[multiverseid] == undefined)
        {
            return false;
        }
        else
        {
            return this.showText[multiverseid];
        }
    }

    addToDeck(card)
    {
        this.$emit("addToDeck", (card == undefined ? this.rightClickedCard : card));
    }

    removeFromDeck()
    {
        this.$emit("removeFromDeck", this.rightClickedCard);
    }

    goToGatherer()
    {
        window.open("http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.rightClickedCard.multiverseid, "_blank");
    }

    goToTCG()
    {
        window.open("http://shop.tcgplayer.com/productcatalog/product/show?ProductName=" + encodeURI(this.rightClickedCard.name), "_blank");
    }

    showFullText(multiverseid)
    {
        var newVal = !(this.shouldShowText(multiverseid));

        this.$set(this.showText, multiverseid, newVal);
    }

    containsAny(lowercaseFilter, input)
    {
        if (lowercaseFilter.length == 0) { return true; }

        input = input.toLowerCase();

        return _.every(lowercaseFilter, function(word)
        {
            return input.indexOf(word) > -1;
        });
    }

    get sortedCards()
    {
        let sorting: string = this.sorting;
        let textFilter: string = this.textFilter;
        let containsAny = this.containsAny;

        let filteredCards = this.cards;

        if (textFilter.length > 0)
        {
            filteredCards = _.filter(filteredCards, function(element: Card)
            {
                var lowercaseFilter = textFilter.toLowerCase().split(" ");

                var textContains = (element.text != undefined ? containsAny(lowercaseFilter, element.text) : false);
                var nameContains = containsAny(lowercaseFilter, element.name);
                //var typeContains = containsAny(lowercaseFilter, element.type);

                /*
                if (element.rarity == "Basic Land")
                {
                    return false;
                }
                */

                return textContains || nameContains;// || typeContains;
            });
        }

        return _.sortBy(filteredCards, function(element: Card)
        {
            switch (sorting)
            {
                case "Name":
                    return element.name;
                case "CMC":
                    return (element.cmc == undefined ? -11 : element.cmc);
                case "Color":
                    return (element.colorIdentity == undefined ? "" : element.colorIdentity[0]);
                case "Type":
                    return element.type;
                case "Rarity":
                    return element.rarity;
                default:
                    return "";
            }
            
        });
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>