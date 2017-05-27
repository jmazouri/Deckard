import * as _ from 'lodash';

import Vuex from 'vuex';
import {Deck} from '../models/Deck'

import DeckState from '../models/state/DeckState'

const store =
{
    state: new DeckState(),
    mutations:
    {
        addToDeck(state, card)
        {
            if (!card) { return; }

            state.currentDeck.cards.push(card);

            if (!_.some(state.allDecks, thatDeck => thatDeck == state.currentDeck))
            {
                state.allDecks.push(state.currentDeck);
            }

            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        removeFromDeck(state, card)
        {
            if (card == undefined) { return; }

            let cardIndex = state.currentDeck.cards.indexOf(card);
            
            if (cardIndex < 0) { return; }

            state.currentDeck.cards.splice(cardIndex, 1);
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        removeAllFromDeck(state, card)
        {
            if (card == undefined) { return; }

            var filtered = state.currentDeck.cards.filter(c => c.multiverseid != card.multiverseid);
            state.currentDeck.cards = filtered;

            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        loadDeck(state, deck)
        {
            if (deck == undefined) { return; }

            state.allDecks.push(deck);
            state.currentDeck = state.allDecks[state.allDecks.length - 1];
        },
        deleteCurrentDeck(state)
        {
            var deckIndex = state.allDecks.indexOf(state.currentDeck);
            state.allDecks.splice(deckIndex, 1);
        },
        clearDeck(state)
        {
            state.currentDeck.cards = [];
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        setCurrentDeck(state, deck)
        {
            if (deck == undefined) { return; }

            state.currentDeck = deck;
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        }
    }
};

export default store