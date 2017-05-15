<template>
    <div class="settingsPage">
        <label>
            Theme
            <select v-model="currentTheme">
                <option v-for="theme in allThemes" v-bind:value="theme.id">{{theme.name}}</option>
            </select>
        </label>
    </div>
</template>

<style lang="scss">

.settingsPage
{
    padding: 1em;

    h1
    {
        margin: 0.5em 0;
        font-size: 2.5em;
        font-weight: bold;
    }
}

</style>

<script lang="ts">
import * as _ from "lodash"
import {Vue, Component, Lifecycle, Prop, Mixin, Watch, p} from 'av-ts'

let capitalizeFirstLetter = function(input: string)
{
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

@Component
export default class Settings extends Vue
{
    themeContext = (<any>require).context('../styles/themes/', true, /^.*theme\.scss$/).keys();

    allThemes: any[] = [];

    get currentTheme()
    {
        return this.$store.state.theme.theme;
    }

    set currentTheme(value)
    {
        this.$store.commit('theme/setTheme', value);
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        for (let theme of this.themeContext)
        {
            var themeId = theme;
            themeId = themeId.substr(0, themeId.lastIndexOf('/'));
            themeId = themeId.substr(themeId.lastIndexOf('/') + 1);

            let newName = 
                themeId.replace(/(\w.*)([A-Z].*)/g, function(g0,g1,g2)
                {
                    return capitalizeFirstLetter(g1) + " " + capitalizeFirstLetter(g2);
                });

            this.allThemes.push
            (
                {
                    id: themeId,
                    name: (newName == themeId ? capitalizeFirstLetter(newName) : newName)
                }
            );
        }

        this.allThemes = _.sortBy(this.allThemes);
    }
}
</script>
