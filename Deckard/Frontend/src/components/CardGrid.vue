<template>
    <div class="cardGrid" v-bind:class="viewMode">
        <div class="sorting">
            <div class="controls">
                <label>
                    <div>
                        View
                    </div>
                    <select v-model="viewMode">
                        <option value="cards">Cards</option>
                        <option value="list">List</option>
                        <option value="cardArt">Art</option>
                    </select>
                </label>

                <label>
                    <div>
                        Sort
                    </div>
                    <select v-model="sorting">
                        <optgroup label="Info">
                            <option>Name</option>
                            <option>Type</option>
                            <option>Rarity</option>
                        </optgroup>
                        <optgroup label="Data">
                            <option>CMC</option>
                            <option>Color</option>
                            <option>Power</option>
                            <option>Toughness</option>
                        </optgroup>
                    </select>
                </label>

                <input type="text" v-model="textFilter" placeholder="Filter..."></input>

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
            <li class="ctx-item" @click="addToDeck()">Add to Deck</li>
            <li class="ctx-item" @click="addToDeck();addToDeck();addToDeck();addToDeck()">Add to Deck (4x)</li>

            <li class="separator"></li>
            <li class="ctx-item" @click="removeFromDeck()">Remove from Deck</li>
            <li class="ctx-item" @click="removeAllFromDeck()">Remove from Deck (all)</li>

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

        <TinyCard class="card" v-if="viewMode == 'cards'" v-for="(card, index) in sortedCards" :key="index" 

                @click.native="showFullText(card.multiverseid)"
                @click.ctrl.native="addToDeck(card)"

                :showText="shouldShowText(card.multiverseid)"
                :showDescriptionText="showAllFullText" 
                :card="card"
                :quantity="getCardQuantity(card.multiverseid)"

                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </TinyCard>

        <CardArt class="card" v-if="viewMode == 'cardArt'" v-for="(card, index) in sortedCards" :key="index"
                       
                :card="card"
                
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </CardArt>
    </div>
</template>

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
                 'CardArt': CardArt,
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
        this.$store.commit('deck/addToDeck', (card == undefined ? this.rightClickedCard : card));
    }

    removeFromDeck()
    {
        this.$store.commit('deck/removeFromDeck', this.rightClickedCard);
    }

    removeAllFromDeck()
    {
        this.$store.commit('deck/removeAllFromDeck', this.rightClickedCard);
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
                var typeContains = containsAny(lowercaseFilter, element.type);

                return textContains || nameContains || typeContains;
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
                case "Power":
                    return element.power;
                case "Toughness":
                    return element.toughness;
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