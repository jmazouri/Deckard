import Vuex from 'vuex';

import ThemeState from '../models/state/ThemeState'

const store =
{
    state: new ThemeState(),
    mutations:
    {
        setTheme(state, newTheme)
        {
            state.theme = newTheme;

            if (state.themeRef != null && state.themeRef != undefined)
            {
                state.themeRef.unuse();
                state.themeRef = null;
            }
            
            state.themeRef = require('../../styles/themes/' + state.theme + '/theme.scss');
            state.themeRef.use();

            localStorage["theme"] = state.theme;
        }
    }
};

export default store