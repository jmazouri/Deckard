import Vuex from 'vuex';
import {Deck} from '../models/Deck'

const store = new Vuex.Store(
{
    strict: true,
    state:
    {
        allDecks: [],
        currentDeck: null
    },
    mutations:
    {
        addToDeck(state, card)
        {
            if (state.currentDeck == null)
            {
                store.commit('clearDeck');
            }

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
            state.currentDeck = deck;
            localStorage["currentDeck"] = JSON.stringify(state.currentDeck);
        }
    }
});

export default store