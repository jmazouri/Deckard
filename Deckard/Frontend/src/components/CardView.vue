<template>

</template>

<style lang="scss">

</style>

<script>
import {Vue, Component, Lifecycle, Prop, Trait, p} from 'av-ts'
import {Card} from '../deckard/models/Card'



@Trait
export default class CardView extends Vue
{
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

    typeToHtml(type: string)
    {
        try
        {
            let potentialImage = require("../assets/icons/types/" + type.toLowerCase() + ".svg");
            return potentialImage;
        }
        catch (err)
        {
            return '';
        }
    }

    manaToHtml(manaCost: string)
    {
       

        var cardHtml = manaCost;

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
            let potentialImage = require("../assets/icons/symbols/" + group + ".svg");
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

        var symbolIcons = 
        {
            "{E}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/7/7c/E.svg",
            "{T}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/b/be/T.svg",
            "{C}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/1/1a/C.svg"
        }

        var replacementRegex:any[] =
        [
            { 
                regex: /\(.+\)/g, 
                format: function(match) { return (thisVue.showDescriptionText ? ` <span class='rulesText'>${match}</span>` : '') } 
            },
            { 
                regex: /\+.\/\+./g, 
                format: function(match) { return `<strong>${match}</strong>` } 
            }
        ];

        for (let pattern of replacementRegex)
        {
            cardHtml = cardHtml.replace(pattern.regex, pattern.format);
        }

        for (var symbol in symbolIcons)
        {
            if (symbolIcons.hasOwnProperty(symbol))
            {
                cardHtml = cardHtml.replace(new RegExp(symbol, 'g'), function(match)
                {
                    return `<img class='textIcon' src="${symbolIcons[symbol]}">`;
                });
            }
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
