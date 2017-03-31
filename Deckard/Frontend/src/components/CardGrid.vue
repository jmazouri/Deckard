<template>
    <div class="cardGrid">
        <div class="sorting">
            Sort: 
            <select v-model="sorting">
                <option>Name</option>
                <option>CMC</option>
                <option>Color</option>
            </select>
            Show full text
            <input type="checkbox" v-model="showAllFullText"></input>
        </div>
        <contextMenu ref="ctx" @ctx-open="onCtxOpen">
            <li class="ctx-item" @click="showFullText()">
                <span v-if="shouldShowText(rightClickedCard.multiverseid)">✔</span>
                Show Full Text
            </li>
            <li class="separator"></li>
            <li class="ctx-item" @click="goToGatherer()">View on Gatherer</li>
            <li class="ctx-item" @click="goToTCG()">View on TCGPlayer</li>
        </contextMenu>

        <TinyCard v-for="card in sortedCards" :showDescriptionText="shouldShowText(card.multiverseid)" :currentCard="card"
                @contextmenu.prevent.native="$refs.ctx.open($event, card)">
        </TinyCard>
    </div>
</template>

<style lang="scss">
.cardGrid
{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    padding: 0.5em;

    .sorting
    {
        width: 100%;
        justify-content: flex-end;

        select
        {
            width: 25%;
        }
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
import TinyCard from './TinyCard.vue'
import {Card} from '../deckard/models/Card'

@Component({
    components: {'TinyCard' : TinyCard, 'contextMenu': require('vue-context-menu') }
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

    sorting: string = "Name";
    showAllFullText: boolean = false;

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
        if (this.showAllFullText)
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

    goToGatherer()
    {
        window.open("http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=" + this.rightClickedCard.multiverseid, "_blank");
    }

    goToTCG()
    {
        window.open("http://shop.tcgplayer.com/productcatalog/product/show?ProductName=" + encodeURI(this.rightClickedCard.name), "_blank");
    }

    showFullText()
    {
        var newVal = !(this.shouldShowText(this.rightClickedCard.multiverseid));

        this.$set(this.showText, this.rightClickedCard.multiverseid, newVal);
    }

    get sortedCards()
    {
        let sorting: string = this.sorting;

        return _.sortBy(this.cards, function(element: Card)
        {
            switch (sorting)
            {
                case "Name":
                    return element.name;
                case "CMC":
                    return (element.cmc == undefined ? -11 : element.cmc);
                case "Color":
                    return (element.colorIdentity == undefined ? "" : element.colorIdentity[0]);
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