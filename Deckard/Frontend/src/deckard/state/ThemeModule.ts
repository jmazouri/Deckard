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

            if (state.themeRef)
            {
                var prevTheme = state.themeRef;
                state.themeRef = null;
            }

            state.themeRef = require('../../styles/themes/' + state.theme + '/theme.scss');
            state.themeRef.use();
            
            if (prevTheme)
            {
                prevTheme.unuse();
            }
            
            
            localStorage["theme"] = state.theme;
        }
    }
};

export default store