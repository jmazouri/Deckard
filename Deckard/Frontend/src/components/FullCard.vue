<template>
    <div class="fullArt">
        <div class="header">
            <div class="cardTitle">{{currentCard.name}}</div>
            <div class="cmc" v-if="currentCard.cmc != undefined" v-html="manaToHtml(currentCard.manaCost)"></div>
        </div>

        <div class="types">
            <span class="cardType" v-for="t in currentCard.types">{{t}}</span>
        </div>

        <div class="cardBody">
            <span class="text" v-html="currentCardText"></span>
            <span class="flavor">{{currentCard.flavor}}</span>
        </div>

        <div class="pt">
            <template v-if="currentCard.power != undefined">
                <span class="power">{{currentCard.power}}</span>/<span class="toughness">{{currentCard.toughness}}</span>
            </template>

            <template v-if="currentCard.loyalty != undefined">
                <span class="loyalty">{{currentCard.loyalty}}</span>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
@font-face
{
    font-family: "Beleren Bold";
    src: url('../assets/beleren.ttf');
}

@font-face
{
    font-family: "MPlantin";
    src: url('../assets/mplantin.ttf');
}

.fullArt
{
    background-image: url(http://i.imgur.com/4CMXVNi.jpg);
    width: 400px;
    height: 560px;

    font-family: "Beleren Bold";

    & > *
    {
        position: relative;
    }

    .header
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        top: 34px;
        left: 38px;
        width: 81.5%;

        .cardTitle
        {
            justify-content: flex-start;
            align-items: flex-start;

            font-weight: bold;
            font-size: 20px;

            white-space: nowrap;
        }

        .cmc
        {
            justify-content: flex-end;
            align-items: flex-end;

            font-weight: bold;
            font-size: 18px;
        }
    }

    .symbol
    {
        position: relative;

        top: -1px;
        margin-right: 2px;

        display: inline-block;
        font-size: 13px;

        width: 16px;
        text-align: center;

        font-weight: bold;

        background-color: rgb(195, 187, 183);
        border-radius: 64px;

        box-shadow: 0px 1px 1px black;
    }

    .costIcon
    {
        position: relative;
        top: 3px;

        width: 16px;
        border-radius: 64px;
        box-shadow: 0px 1px 1px black;
    }

    .types
    {
        top: 295px;
        left: 35px;

        font-weight: bold;

        .cardType
        {
            margin-left: 0.28em;
        }
    }

    @mixin extra-text
    {
        font-family: "MPlantin";
        font-style: italic;
        color: lighten(black, 35%);
    }

    .cardBody
    {
        display: inline-block;

        top: 313px;
        left: 38px;

        display: flex;
        flex-direction: column;

        max-width: 320px;
        height: 140px;
        width: 98%;

        .text
        {
            justify-content: flex-start;
            align-items: flex-start;

            flex-grow: 1;

            white-space: pre-line;

            .rulesText
            {
                @include extra-text();
            }

            .textIcon
            {
                display: inline;
                width: 16px;

                vertical-align: text-bottom;

                padding: 0 2px 0 2px;
            }

            .symbol
            {
                font-style: normal;
            }
        }

        .flavor
        {
            @include extra-text();

            font-weight: normal;

            justify-content: flex-end;
            align-items: flex-end;
        }
    }

    .pt
    {
        top: 330px;
        left: -28px;

        text-align: right;

        font-weight: bold;
        font-size: 1.2em;
    }
}
</style>

<script>
import {Vue, Component, Lifecycle, Prop, p} from 'av-ts'
import {Card} from '../deckard/models/Card'

@Component({
    name: "FullCard"
})
export default class FullCard extends Vue
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

    manaToHtml(manaCost: string)
    {
        var colors = 
        {
            "{W}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/8/8e/W.svg",
            "{U}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/9/9f/U.svg",
            "{B}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/2/2f/B.svg",
            "{R}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/8/87/R.svg",
            "{G}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/8/88/G.svg",

            "{W/U}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/3/39/WU.svg",
            "{W/B}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/a/a6/WB.svg",
            "{U/B}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/1/13/UB.svg",
            "{U/R}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/0/09/UR.svg",
            "{B/R}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/b/bf/BR.svg",
            "{B/G}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/6/62/BG.svg",
            "{R/G}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/2/24/RG.svg",
            "{R/W}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/6/6b/RW.svg",
            "{G/W}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/2/2e/GW.svg",
            "{G/U}": "https://hydra-media.cursecdn.com/mtg.gamepedia.com/6/6f/GU.svg"
        }

        var cardHtml = manaCost;

        for (var color in colors)
        {
            if (colors.hasOwnProperty(color))
            {
                cardHtml = cardHtml.replace(new RegExp(color, 'g'), function(match)
                {
                    return `<img class='costIcon' src="${colors[color]}">`;
                });

                cardHtml = cardHtml.replace(/{(\d|\X)}/g, function(match)
                {
                    return `<span class="symbol">${match.substr(1, match.length - 2)}</span>`;
                });
            }
        }

        return cardHtml;
    }

    get currentCardText()
    {
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
                format: function(match) { return ` <span class='rulesText'>${match}</span>` } 
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
