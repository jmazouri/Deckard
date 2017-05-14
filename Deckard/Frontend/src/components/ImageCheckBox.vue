<template>
    <div class="imageCheckbox" v-on:click="checked = !checked">
        <img v-bind:src="iconPath" v-show="checked">
    </div>
</template>

<style lang="scss">
.imageCheckbox
{
    display: inline-block;

    width: 1.33em;
    height: 1.33em;

    vertical-align: middle;

    cursor: pointer;
}
</style>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, Trait, Watch, p} from 'av-ts'

@Component
export default class ImageCheckBox extends Vue
{
    checked:boolean = false;

    @Prop checkedIcon:any = p(
    {
        type: String,
        required: true,
        default()
        {
            return "CHAOS";
        }
    })

    @Watch('checked')
    checkHandler(newVal, oldVal)
    {
        this.$emit("checkChanged", this.checked);
    }

    get iconPath()
    {
        return require("../assets/icons/symbols/" + this.checkedIcon + ".svg");
    }

    @Prop value:any = p(
    {
        type: Boolean,
        required: true,
        default()
        {
            return false;
        }
    })

    @Watch('value')
    valHandler(newVal, oldVal)
    {
        this.checked = this.value;
    }

    // lifecycle hook
    @Lifecycle mounted()
    {
    }
}
</script>