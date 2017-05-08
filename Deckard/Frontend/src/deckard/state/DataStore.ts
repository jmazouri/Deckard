import Vuex from 'vuex';
import {Deck} from '../models/Deck'

import DeckModule from './DeckModule'
import ThemeModule from './ThemeModule'

(<any>DeckModule).namespaced = true;
(<any>ThemeModule).namespaced = true;

const store = new Vuex.Store(
{
    strict: true,
    modules: 
    {
        theme: ThemeModule,
        deck: DeckModule
    }
});

export default store