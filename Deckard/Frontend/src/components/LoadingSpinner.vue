<template>
    <div class="spinner" v-show="loading">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Lifecycle, Prop, p} from 'av-ts'

@Component
export default class LoadingSpinner extends Vue
{
    @Prop loading:any = p(
    {
        type: Boolean,
        required: true,
        default()
        {
            return false;
        }
    })

    // lifecycle hook
    @Lifecycle mounted()
    {
        
    }
}
</script>
