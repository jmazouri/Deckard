<template>

</template>

<style lang="scss">
.symbol
{
    color: black;
    text-shadow: none;
}
</style>

<script lang="ts">
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

    @Prop card:any = p(
    {
        type: Object,
        required: true,
        default()
        {
            return new Card();
        }
    })

    get currentCard(): Card
    {
        return <Card>this.card;
    }

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
        let colorId = this.currentCard.colorIdentity;

        if (colorId != undefined)
        {
            if (colorId.length <= 2)
            {
                return colorId.slice(0, 2).join(""); //dual-color
            }

            return "Gld"; //multicolor (gold)
        }

        return ""; //artifact/devoid/whatever
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
                let potentialImage = require("!svg-inline-loader?removeSVGTagAttrs=true!../../assets/icons/types/" + matches[0].toLowerCase() + ".svg");
                return potentialImage;
            }
            catch (err)
            {
                return require("!svg-inline-loader?removeSVGTagAttrs=true!../../assets/icons/types/mixed.svg");
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
        cardHtml = cardHtml.replace(/{(\d*|\X)}/g, function(match)
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
        let keywords = ["Deathtouch", "Defender", "Double Strike", "Enchant", "Equip", "Flashback", "Flying",
                        "Haste", "Hexproof", "Indestructible", "Intimidate", "Lifelink", "Protection", "Flanking",
                        "Reach", "Shroud", "Trample", "Vigilance", "Banding", "Rampage", "Cumulative Upkeep", 
                        "Phasing", "Buyback", "Shadow", "Cycling", "Echo", "Horsemanship", "Fading", "Kicker",
                        "Flash", "Madness", "Fear", "Megamorph", "Morph", "Amplify", "Provoke", "Storm", "Affinity", "Entwine",
                        "Modular", "Sunburst", "Bushido", "Soulshift", "Splice", "Offering", "Ninjutsu", "Epic",
                        "Convoke", "Dredge", "Transmute", "Bloodthirst", "Haunt", "Replicate", "Forecast", "Graft",
                        "Recover", "Ripple", "Split Second", "Suspend", "Vanishing", "Absorb", "Swap", "Delve", "Fortify",
                        "Frenzy", "Gravestorm", "Poisonous", "Transfigure", "Champion an", "Champion a", "Changeling", "Evoke", "Hideaway",
                        "Prowl", "Reinforce", "Conspire", "Persist", "Wither", "Retrace", "Devour", "Exalted", "Unearth",
                        "Cascade", "Annihilator", "Level Up", "Rebound", "Armor", "Infect", "Battle Cry", "Weapon", "Undying", "Miracle",
                        "Soulbond", "Overload", "Scavenge", "Unleash", "Cipher", "Evolve", "Extort", "Fuse", "Bestow",
                        "Tribute", "Dethrone", "Agenda", "Outlast", "Prowess", "Dash", "Exploit", "Menace", "Renown",
                        "Awaken", "Devoid", "Ingest", "Myriad", "Surge", "Skulk", "Emerge", "Escalate", "Melee", "Crew",
                        "Fabricate", "Partner", "Undaunted", "Improvise", "First strike", "Islandwalk", "Mountainwalk",
                        "Swampwalk", "Plainswalk", "Forestwalk", "Exert", "Landwalk"];

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
            //  - Single-word abilities, followed by non-flavor description text (Revolt - when [asdf])
            { 
                regex: /(\+|−|\-)\s.|\S.*(?= —)/gm, 
                format: function(match) { return (match.length <= 17 ? `<strong>${match}</strong>` : match) } 
            }
        ];

        for (let pattern of replacementRegex)
        {
            cardHtml = cardHtml.replace(pattern.regex, pattern.format);
        }

        cardHtml = this.manaToHtml(cardHtml);

        for (let word of keywords)
        {
            cardHtml = cardHtml.replace(new RegExp(`${word}(\\s|,|\\z)`, 'gmi'), function(match, group)
            {
                return `<strong>${match}</strong> `;
            });
        }

        return cardHtml;
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
