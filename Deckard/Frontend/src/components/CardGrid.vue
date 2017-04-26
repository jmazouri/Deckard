<template>
    <div class="cardGrid" v-bind:class="viewMode">
        <div class="sorting">
            <div class="controls">
                <label>
                    <div>
                        View
                    </div>
                    <select v-model="viewMode">
                        <option value="bigCards">Big Cards</option>
                        <option value="tinyCards">Tiny Cards</option>
                        <option value="list">List</option>
                        <option value="cardArt">Card Art</option>
                    </select>
                </label>

                <label>
                    <div>
                        Sort
                    </div>
                    <select v-model="sorting">
                        <option>Name</option>
                        <option>CMC</option>
                        <option>Color</option>
                        <option>Type</option>
                        <option>Rarity</option>
                    </select>
                </label>

                <label>
                    <input type="text" v-model="textFilter" placeholder="Filter..."></input>
                </label>

                <div class="opts">
                    <label>
                        <input type="checkbox" v-model="shouldGroup"></input>
                        Group by Name
                    </label>

                    <label>
                        <input type="checkbox" v-model="showAllText"></input>
                        Show text
                    </label>
                    
                    <label v-if="showAllText">
                        <input type="checkbox" v-model="showAllFullText"></input>
                        Show flavor/rules
                    </label>
                </div>

                <div class="cardCount">
                    {{cards.length}} cards <small v-if="hiddenCardCount > 0">{{hiddenCardCount}} hidden</small>
                </div>
            </div>
        </div>

        <contextMenu ref="ctx" @ctx-open="onCtxOpen">
            <li class="ctx-item" @click="addToDeck()">Add To Deck</li>
            <li class="ctx-item" @click="removeFromDeck()" v-if="removeCard">Remove From Deck</li>

            <li class="separator"></li>
            <li class="ctx-item" @click="searchAll()">Find All Versions</li>

            <li class="separator"></li>
            <li class="ctx-item" @click="goToGatherer()">View on Gatherer</li>
            <li class="ctx-item" @click="goToTCG()">View on TCGPlayer</li>
        </contextMenu>

        <CardListEntry class="card" v-if="viewMode == 'list'" v-for="(card, index) in sortedCards" :key="index"
                       
                @click.native="showFullText(card.multiverseid)"
                @click.ctrl.native="addToDeck(card)"

                :showText="shouldShowText(card.multiverseid)"
                :showDescriptionText="showAllFullText" 
                :card="card"
                :quantity="getCardQuantity(card.multiverseid)"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </CardListEntry>

        <TinyCard class="card" v-if="viewMode == 'tinyCards'" v-for="(card, index) in sortedCards" :key="index" 

                @click.native="showFullText(card.multiverseid)"
                @click.ctrl.native="addToDeck(card)"

                :showText="shouldShowText(card.multiverseid)"
                :showDescriptionText="showAllFullText" 
                :card="card"
                :quantity="getCardQuantity(card.multiverseid)"

                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </TinyCard>

        <FullCard class="card" v-if="viewMode == 'bigCards'" v-for="(card, index) in sortedCards" :key="index"
                       
                :card="card"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </FullCard>

        <CardArt class="card" v-if="viewMode == 'cardArt'" v-for="(card, index) in sortedCards" :key="index"
                       
                :card="card"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </CardArt>
    </div>
</template>

<style lang="scss">
@import "../styles/variables.scss";
@import "../styles/loader.scss";

.cardGrid
{
    background-color: transparent;

    &.tinyCards, &.cardArt
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .card
    {
        color: black;
    }

    .sorting
    {
        display: flex;
        flex-direction: row;

        width: 100%;

        padding: 0 0.5em;

        .controls
        {
            width: 100%;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            label
            {
                display: inline-block;
                margin-right: 0.5em;

                > div
                {
                    display: inline-block;
                    min-width: 2.5em;
                }

                input[type=checkbox]
                {
                    @include clear-appearance();

                    background: transparent;

                    position: relative;

                    top: 2px;

                    width: 16px;
                    height: 16px;

                    &:checked:after
                    {
                        content: '✔';
                        position: relative;

                        top: -5px;
                        left: -1px;
                    }

                    &:focus
                    {
                        outline: none;
                    }
                }
            }

            .opts
            {
                flex-basis: 100%;
            }

            .cardCount
            {
                flex-grow: 1;
                align-self: flex-end;

                font-size: 1.5em;
                font-weight: bold;
                text-align: right;

                margin-right: 0.5em;

                small
                {
                    font-size: 0.5em;
                }
            }
        }

    }
}

li.separator
{
    border-bottom: 1px solid black;
}
</style>

<script lang="ts">
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

    @Prop showAllText: any = p(
    {
        type: Boolean,
        required: false,
        default()
        {
            return true;
        }
    })

    groupedOverride: any = undefined;
    @Prop isGrouped: any = p(
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

    showText: any = {};
    cardQty: any = {};

    rightClickedCard: any = {};

    get shouldGroup()
    {
        return this.groupedOverride != undefined ? this.groupedOverride : this.isGrouped;
    }

    set shouldGroup(newValue)
    {
        this.groupedOverride = newValue;
    }

    get hiddenCardCount()
    {
        return this.cards.length - this.sortedCards.length;
    }

    @Watch('shouldGroup')
    groupHandler(newVal, oldVal)
    {
        this.calcCardQty();
    }

    calcCardQty()
    {
        if (this.shouldGroup) 
        {
            this.cardQty = _.groupBy(this.cards, function(card: Card)
            {
                return card.multiverseid;
            });
        }
        else
        {
            this.cardQty = {};
        }
    }

    @Watch('cards')
    cardsHandler(newVal, oldVal)
    {
        this.showText = {};
        this.calcCardQty();
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

    getCardQuantity(multiverseid)
    {
        if (this.cardQty[multiverseid] == undefined)
        {
            return 1;
        }
        else
        {
            return this.cardQty[multiverseid].length;
        }
    }

    addToDeck(card)
    {
        this.$store.commit('addToDeck', (card == undefined ? this.rightClickedCard : card));
    }

    removeFromDeck()
    {
        this.$store.commit('removeFromDeck', this.rightClickedCard);
    }

    goToGatherer()
    {
        window.open("http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.rightClickedCard.multiverseid, "_blank");
    }

    goToTCG()
    {
        window.open("http://shop.tcgplayer.com/productcatalog/product/show?ProductName=" + encodeURI(this.rightClickedCard.name), "_blank");
    }

    searchAll()
    {
        this.$emit("searchAll", this.rightClickedCard);
    }

    showFullText(multiverseid)
    {
        if (this.showAllText) { return; }
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

        var rarityOrder = ["Basic Land", "Common", "Uncommon", "Rare", "Special", "Mythic Rare"];

        filteredCards = _.sortBy(filteredCards, function(element: Card)
        {
            switch (sorting)
            {
                case "Name":
                    return element.name;
                case "CMC":
                    return (element.cmc == undefined ? -11 : element.cmc);
                case "Color":
                    return (element.colorIdentity == undefined ? "" : element.colorIdentity);
                case "Type":
                    return element.type;
                case "Rarity":
                    return rarityOrder.indexOf(element.rarity);
                default:
                    return "";
            }
            
        });

        if (this.shouldGroup)
        {
            filteredCards = _.sortedUniqBy(filteredCards, function(card: Card)
            {
                return card.multiverseid;
            });
        }

        return filteredCards;
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>