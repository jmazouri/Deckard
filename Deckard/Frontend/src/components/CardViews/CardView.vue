<template>

</template>

<style lang="scss">

</style>

<script>
import * as _ from "lodash"

import {Vue, Component, Lifecycle, Prop, Trait, p} from 'av-ts'
import {Card} from '../../deckard/models/Card'

@Trait
export default class CardView extends Vue
{
    @Prop quantity:any = p(
    {
        type: Number,
        required: false,
        default()
        {
            return 1;
        }
    })

    @Prop currentCard:any = p(
    {
        type: Object,
        required: true,
        default()
        {
            return new Card();
        }
    })

    @Prop showDescriptionText:any = p(
    {
        type: Boolean,
        required: false,
        default()
        {
            return true;
        }
    })

    @Prop showText:any = p(
    {
        type: Boolean,
        required: false,
        default()
        {
            return true;
        }
    })

    get cardBgColor()
    {
        let colorId = (<any>this).currentCard.colorIdentity;

        if (colorId != undefined)
        {
            if (colorId.length <= 2)
            {
                return colorId.join("");
            }
            else
            {
                return colorId[0];
            }
        }
        else
        {
            return "";
        }
        
    }

    get cardName()
    {
        var multipleNames = (<any>this).currentCard.names;

        if (multipleNames == undefined)
        {
            return (<any>this).currentCard.name;
        }
        else
        {
            var mainName = (<any>this).currentCard.name;

            var otherName = _.filter(multipleNames, function(name)
            {
                return name != mainName;
            });
            
            return mainName + " <small>// " + otherName + "</small>";
        }
    }

    get cardRarity()
    {
        return (<any>this).currentCard.rarity.substring(0, 2);
    }

    get typeToHtml()
    {
        var validTypes = ["Creature", "Enchantment", "Instant", "Land", "Planeswalker", "Sorcery", "Artifact"];
        var matches = _.intersection(this.currentCard.types, validTypes);

        if (matches.length > 0)
        {
            try
            {
                let potentialImage = require("../../assets/icons/types/" + matches[0].toLowerCase() + ".svg");
                return potentialImage;
            }
            catch (err)
            {
                return require("../../assets/icons/types/mixed.svg");
            }
        }
    }

    manaToHtml(manaCost: string)
    {
        var cardHtml = manaCost;

        if (cardHtml == null || cardHtml == undefined) { return ""; }

        //Replace {W/U} tokens with {WU} to match icon file names
        cardHtml = cardHtml.replace(/{(.)\/(.)}/g, '{$1$2}');

        //Replace numeric tokens with formatted text
        cardHtml = cardHtml.replace(/{(\d|\X)}/g, function(match)
        {
            return `<span class="symbol">${match.substr(1, match.length - 2)}</span>`;
        });

        //Replace symbol tokens with images
        cardHtml = cardHtml.replace(/{(\D*?)}/g, function(match, group)
        {
            let potentialImage = require("../../assets/icons/symbols/" + group + ".svg");
            return `<img class='costIcon' src="${potentialImage}">`;
        });

        return cardHtml;
    }

    get currentCardText()
    {
        var thisVue = this;

        if (this.currentCard == null || this.currentCard.text == undefined)
        {
            return "";
        }

        var cardHtml = this.currentCard.text;

        var replacementRegex:any[] =
        [
            { 
                regex: /\(.+\)/g, 
                format: function(match) { return (thisVue.showDescriptionText ? `<span class='rulesText'>${match}</span>` : '') } 
            },
            //Matches (separated by |):
            //  - +x or -x strings, for pumps & planeswalker abilities
            //  - Single-word abilities, followed by newlines (Flying, Double strike)
            //  - Single-word abilities, followed by non-flavor description text (Revolt - when [asdf])
            { 
                regex: /(\+|−|\-)\s.|^\S.*\s{0,2}\n|\S.*(?= —)/gm, 
                format: function(match) { return (match.length <= 17 ? `<strong>${match}</strong>` : match) } 
            }
        ];

        for (let pattern of replacementRegex)
        {
            cardHtml = cardHtml.replace(pattern.regex, pattern.format);
        }

        cardHtml = this.manaToHtml(cardHtml);

        return cardHtml;
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
