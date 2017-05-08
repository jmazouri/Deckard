import {Deck} from '../Deck'

export default class DeckState
{
    allDecks: Deck[] = [];
    currentDeck: Deck = new Deck();
}