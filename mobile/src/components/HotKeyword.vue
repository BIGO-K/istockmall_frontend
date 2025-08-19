<template>
    <section
        v-if="hotKeywords.length > 0"
        ref="hotKeywordElement" 
        class="m_main-popular"
    >
        <div class="m_main-popular-inner" :class="isHotKeywordOpen ? 'S=switch-on' : ''">
            <div class="m_main-popular-head">
                <h3><b>인기검색어</b></h3>
                <p class="text_date">
                    {{ MMFilters.formatDate(hotKeywordsIndexedAt, 'YYYY.MM.DD HH:mm') }}기준
                </p>
                <button 
                    type="button" 
                    data-switch
                    :title="buttonTitle"
                    @click="toggleHotKeywordOpen"
                >
                    <i class="ico_more" />
                </button>
            </div>
            <ol>
                <li v-for="hotKeyword in hotKeywords" :key="hotKeyword.keyword">
                    <MMLink
                        :to="{ name: 'SearchResult', query: { keyword: hotKeyword.keyword }}"
                    >
                        <b>{{ hotKeyword.keyword }}</b>
                        <template v-if="hotKeyword.changeType === 'U'">
                            <i
                                class="ico_rank-up"
                                title="상승"
                            />
                            <b class="text_rank">{{ hotKeyword.changeRank }}</b>
                        </template>
                        <template v-else-if="hotKeyword.changeType === 'N'">
                            <i
                                class="ico_rank-new"
                                title="신규"
                            />
                        </template>
                        <template v-else-if="hotKeyword.changeType==='D'">
                            <i
                                class="ico_rank-down"
                                title="하락"
                            />
                            <b class="text_rank">{{ Math.abs(hotKeyword.changeRank) }}</b>
                        </template>
                        <template v-else>
                            <i
                                class="ico_rank-unchanged"
                                title="변동없음"
                            />
                        </template>
                    </MMLink>
                </li>
            </ol>
        </div>
    </section>
</template>

<script lang="ts">
import { HotKeyword } from '$/@type/front';
import { searchRepository } from '$/repository/searchRepository';
import { computed, defineComponent, onBeforeMount, ref, watch, onUnmounted } from 'vue';
import gsap from 'gsap';
import { useMoreButton } from '$/composables/blockComposable';

export default defineComponent({
    inheritAttrs: false,
    setup() {
        const hotKeywordsIndexedAt = ref<string>('');
        const hotKeywords = ref<HotKeyword[]>([]);
        
        // 인기검색어 영역
        const hotKeywordElement = ref<HTMLElement | null>(null)
        const hotKeywordItemElementList = computed<HTMLElement[]>(() => {
            return Array.from(hotKeywordElement.value?.querySelectorAll('ol > li') || [])
        })

        // 인기검색어 캐러셀 이벤트 
        const hotKeywordInterval = ref<NodeJS.Timeout>()
        const hotKeywordPlayIndex = ref<number>(0);

        // CONTEXT
        const { 
            isShowMore: isHotKeywordOpen, 
            buttonTitle, 
            toggle: toggleHotKeywordOpen 
        } = useMoreButton(
            'hotkeyword', 
            {
                defaultTitle: '펼쳐보기',
                moreTitle: '접어놓기'        
            }
        );

        onBeforeMount(async () => {
            try {
                const { indexedAt, hotKeywords: hotKeywordList } = await searchRepository.getHotKeywords();  
                hotKeywords.value = hotKeywordList
                hotKeywordsIndexedAt.value = indexedAt;
            } catch (e) {
                console.log(e)
            }
        })

        onUnmounted(() => {
            killHotKeywordAutoPlay();
        })
        
        watch(
            [isHotKeywordOpen, hotKeywords],
            ([nowOpen, nowKeywords], []) => { 
                if (nowKeywords.length <= 0) {
                    return;
                }

                if (!nowOpen) {
                    hotKeywordAutoPlay(); 
                } else {
                    killHotKeywordAutoPlay();
                }
            },
            { flush: "post" }
        )

        // 인기검색어 캐러셀 이벤트 play
        function hotKeywordAutoPlay() {
            if (!hotKeywordItemElementList.value || (hotKeywordItemElementList.value?.length || 0) <= 0) {
                return;
            }

            killHotKeywordAutoPlay();
            
            hotKeywordInterval.value = setInterval(function () {
                if (!hotKeywordItemElementList.value[hotKeywordPlayIndex.value]) {
                    return;
                }
                
                gsap.fromTo(hotKeywordItemElementList.value[hotKeywordPlayIndex.value], { y: '0%' }, { y: '-100%', duration: 0.3, ease: 'sine.inOut' })
                hotKeywordPlayIndex.value = hotKeywordPlayIndex.value === hotKeywordItemElementList.value.length - 1 ? 0 : hotKeywordPlayIndex.value + 1
                gsap.fromTo(hotKeywordItemElementList.value[hotKeywordPlayIndex.value], { y: '100%' }, { y: '0', duration: 0.3, ease: 'sine.inOut' })
            }, 4000)
        }

        // 인기검색어 캐러셀 이벤트 stop
        function killHotKeywordAutoPlay() {
            if (!hotKeywordItemElementList.value || (hotKeywordItemElementList.value?.length || 0) <= 0) {
                return;
            }

            if (hotKeywordInterval.value !== undefined) {
                gsap.killTweensOf(hotKeywordItemElementList)
                clearInterval(hotKeywordInterval.value)
                hotKeywordItemElementList.value.forEach(element => {
                    element.setAttribute('style', '')
                })

                // play 되는 타이밍 클릭하여 style 제거 안되는 경우 위해 한번 더 실행
                setTimeout(() => {
                    hotKeywordItemElementList.value.forEach(element => {
                        element.setAttribute('style', '')
                    })
                }, 500);
                hotKeywordPlayIndex.value = 0
            }
        }

        return {
            hotKeywordsIndexedAt,
            hotKeywords,
            hotKeywordElement,
            isHotKeywordOpen,
            buttonTitle,
            toggleHotKeywordOpen
        }
    }
})
</script>