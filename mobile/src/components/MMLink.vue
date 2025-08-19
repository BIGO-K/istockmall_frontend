<template>
    <!-- 경로 없음 -->
    <a
        v-if="isEmptyLink" 
        v-bind="{ ...props, ...attrs }"
    >
        <slot />
    </a>

    <!-- 외부경로 -->
    <a
        v-else-if="isExternalLink"
        :href="getOutIntentPath(to)"
        target="_blank" 
        v-bind="{ ...props, ...attrs }"
    >
        <slot />
    </a>

    <!-- 내부 전체경로 -->
    <router-link
        v-else-if="isInternalFullLink" 
        v-bind="{ ...props, ...attrs }"
        :to="uncapInternalLink"
        custom
    >
        <a
            v-if="!button"
            v-bind="$attrs"
            :href="uncapInternalLink"
            @click="linkClicked($event)"
        >
            <slot />
        </a>
        <button
            v-else
            v-bind="$attrs"
            @click="linkClicked($event)"
        >
            <slot />
        </button>
    </router-link>

    <!-- 내부 기타 -->
    <router-link
        v-else
        v-slot="{ href }"
        v-bind="{ ...props, ...attrs }"
        custom
    >
        <a
            v-if="!button"
            v-bind="$attrs"
            :href="href"
            @click="linkClicked($event)"
        >
            <slot />
        </a>
        <button
            v-else
            type="button"
            v-bind="$attrs"
            @click="linkClicked($event)"
        >
            <slot />
        </button>
    </router-link>
</template>

<script lang="ts">
import { computed, toRefs } from 'vue';
import { RouterLink, useLink, } from 'vue-router';
import { env } from '$/functions'
import { getOutIntentPath } from '$/filters';
import { goodsZoomLoader } from '$/functions'
import { usePageContext, useMaintenanceState } from '$/composables/pageHandler/contextComposable';

export default {
    props: {
        ...RouterLink.props,
        button: {
            type: Boolean,
            default: false,
        }
    },
    setup(props, { attrs }) {
        const { 
            setPageContext,
            route: currentRoute,
        } = usePageContext();
        
        const { to } = toRefs(props);
        const { navigate, route } = useLink(props);

        const isEmptyLink = computed(() => {
            return !to.value;
        });
        const isInternalFullLink = computed(() => {
            return typeof to.value === 'string' && to.value.startsWith(env('MM_APP_URL'));
        });
        
        const uncapInternalLink = computed(() => {
            if (!isInternalFullLink.value) {
                return '/';
            }

            return to.value.replace(env('MM_APP_URL'), '');
        });

        const isExternalLink = computed(() => {
            return (
                typeof to.value === 'string' &&
                to.value.startsWith('http') &&
                !isInternalFullLink.value
            );
        });

        async function linkClicked(e: MouseEvent) {
            currentRoute.meta.isForward = true;
            history.state.forward = null;
            setPageContext(route.value.path, 0);
            document.documentElement.classList.remove('S=noscroll') 
            if (route.value.meta?.needGoodsZoomImage && !useMaintenanceState().isUnderMaintenance.value) {
                goodsZoomLoader(e);
            }            
            await navigate(e)
        }

        return {
            props,
            attrs,
            to,
            isEmptyLink,
            isInternalFullLink,
            uncapInternalLink,
            isExternalLink,
            linkClicked,
            getOutIntentPath,
        };
    },
};
</script>