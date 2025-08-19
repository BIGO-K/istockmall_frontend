import { defineAsyncComponent } from 'vue'
import { Component } from 'vue'

const delayMilliSecond = 300; 

const BLOCK_COMPONENTS = import.meta.glob('./pages/block/**/*.vue');

/**
 * 블록 컴포넌트 getter
 * @param name 블록명
 * @returns
 */
export function getBlockComponents(name: string): Component|undefined {
    const specialBlockPrefixList = ['best', 'coop', 'mult', 'new', 'raff', 'rank', 'reco', 'pers', 'show', 'live'];
    const blockFeatures = name.split('=')[0];
    const blockPrefix = new RegExp(specialBlockPrefixList.join("|")).test(blockFeatures) ? blockFeatures.split('_')[0] : blockFeatures;

    const path = `./pages/block/${blockPrefix}/${name}.vue`;
    if (!BLOCK_COMPONENTS[path]) {
        return;
    }
    
    return defineAsyncComponent({ 
        loader: () => BLOCK_COMPONENTS[path](), 
        delay: delayMilliSecond,
    });
}
