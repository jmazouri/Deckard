import Vuex from 'vuex';
import {Deck} from '../models/Deck'

const store = new Vuex.Store(
{
    state:
    {
        allDecks: [],
        currentDeck: null
    },
    mutations:
    {
        addToDeck(state, card)
        {
            state.currentDeck.cards.push(card);
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        removeFromDeck(state, card)
        {
            state.currentDeck.cards.splice(state.currentDeck.cards.indexOf(card), 1);
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        },
        loadDeck(state, deck)
        {
            state.allDecks.push(deck);
            state.currentDeck = state.allDecks[state.allDecks.length - 1];
        },
        clearDeck(state)
        {
            state.currentDeck = new Deck();
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        }
    }
});

export default store