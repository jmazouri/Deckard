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

            if (!state.currentDeck)
            {
                state.currentDeck = new Deck();
                state.allDecks.push(state.currentDeck);
            }

            state.currentDeck.cards.push(card);
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        removeFromDeck(state, card)
        {
            if (card == undefined) { return; }

            state.currentDeck.cards.splice(state.currentDeck.cards.indexOf(card), 1);
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