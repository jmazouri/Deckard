<template>
    <div class="settingsPage">
        <h1>Settings</h1>

        <label>
            Theme
            <select v-model="selectedTheme">
                <option v-for="theme in allThemes" v-bind:value="theme.id">{{theme.name}}</option>
            </select>
        </label>

        <br />
        <button v-on:click="apply()">Apply</button>
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
import {Vue, Component, Lifecycle, Prop, Mixin, Watch, p} from 'av-ts'

@Component
export default class Settings extends Vue
{
    selectedTheme: string = "";
    allThemes =
    [
        {id: "darkgreen", name: "Dark Green"},
        {id: "darkred", name: "Dark Red"},
        {id: "plain", name: "Plain"},
        {id: "amonkhet", name: "Amonkhet"}
    ];

    @Watch('selectedTheme')
    themeWatch(newTheme, oldTheme)
    {
        localStorage["theme"] = this.selectedTheme;
    }

    apply()
    {
        location.reload();
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
        this.selectedTheme = localStorage["theme"];
    }
}
</script>
