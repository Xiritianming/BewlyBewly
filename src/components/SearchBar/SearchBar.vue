<script setup lang="ts">
import type { HistoryItem, SuggestionItem } from './searchHistoryProvider'
import {
  addSearchHistory,
  getSearchHistory,
  removeSearchHistory,
} from './searchHistoryProvider'

defineProps<{
  darkenOnFocus?: boolean
  blurredOnFocus?: boolean
  focusedCharacter?: string
}>()

const isFocus = ref<boolean>(false)
const keyword = ref<string>('')
const suggestions = reactive<SuggestionItem[]>([])
const selectedIndex = ref<number>(-1)
const searchHistory = reactive<HistoryItem[]>([])
const historyItemRef = ref<HTMLElement[]>([])
const suggestionItemRef = ref<HTMLElement[]>([])

onMounted(() => {
  Object.assign(searchHistory, getSearchHistory())
})

function handleInput() {
  selectedIndex.value = -1
  if (keyword.value.length > 0) {
    browser.runtime
      .sendMessage({
        contentScriptQuery: 'getSearchSuggestion',
        term: keyword.value,
      })
      .then((res) => {
        Object.assign(suggestions, res)
      })
  }
  else {
    suggestions.length = 0
  }
}

function navigateToSearchResultPage(keyword: string) {
  if (keyword) {
    window.open(`//search.bilibili.com/all?keyword=${keyword}`, '_blank')
    const searchItem = {
      value: keyword,
      timestamp: Number(new Date()),
    }
    addSearchHistory(searchItem)
    Object.assign(searchHistory, getSearchHistory())
  }
}

function handleDelete(value: string) {
  removeSearchHistory(value)
  searchHistory.length = 0
  Object.assign(searchHistory, getSearchHistory())
}

function handleKeyUp() {
  if (selectedIndex.value <= 0) {
    selectedIndex.value = 0
    return
  }

  selectedIndex.value--

  if (isFocus.value && suggestions.length !== 0)
    keyword.value = suggestions[selectedIndex.value].value
  else if (isFocus.value && searchHistory.length !== 0)
    keyword.value = searchHistory[selectedIndex.value].value

  suggestionItemRef.value.forEach((item, index) => {
    if (index === selectedIndex.value)
      item.classList.add('active')
    else item.classList.remove('active')
  })

  historyItemRef.value.forEach((item, index) => {
    if (index === selectedIndex.value)
      item.classList.add('active')
    else item.classList.remove('active')
  })
}

function handleKeyDown() {
  let isShowSuggestion = false
  if (isFocus.value && suggestions.length !== 0)
    isShowSuggestion = true
  else if (isFocus.value && !keyword.value && searchHistory.length !== 0)
    isShowSuggestion = false

  if (
    isShowSuggestion
        && selectedIndex.value >= suggestions.length - 1
  ) {
    selectedIndex.value = suggestions.length - 1
    return
  }
  if (
    !isShowSuggestion
        && selectedIndex.value >= searchHistory.length - 1
  ) {
    selectedIndex.value = searchHistory.length - 1
    return
  }

  selectedIndex.value++
  keyword.value = isShowSuggestion
    ? suggestions[selectedIndex.value].value
    : searchHistory[selectedIndex.value].value

  suggestionItemRef.value.forEach((item, index) => {
    if (index === selectedIndex.value)
      item.classList.add('active')
    else item.classList.remove('active')
  })

  historyItemRef.value.forEach((item, index) => {
    if (index === selectedIndex.value)
      item.classList.add('active')
    else item.classList.remove('active')
  })
}
</script>

<template>
  <div id="search-wrap" w="full" max-w="550px" m="x-8" pos="relative">
    <div
      v-if="!darkenOnFocus && isFocus"
      pos="fixed top-0 left-0"
      w="full"
      h="full"
      content="~"
      @click="isFocus = false"
    />
    <Transition name="mask">
      <div
        v-if="darkenOnFocus && isFocus" pos="fixed top-0 left-0" w-full h-full bg="black opacity-60"
        @click="isFocus = false"
      />
    </Transition>

    <div
      v-if="blurredOnFocus"
      pos="fixed top-0 left-0" w-full h-full duration-500 pointer-events-none ease-out
      :style="{ backdropFilter: isFocus ? 'blur(15px)' : 'blur(0)' }"
    />

    <div class="search-bar group" :class="isFocus ? 'focus' : ''" flex="~" items-center pos="relative">
      <Transition name="focus-character">
        <img v-show="focusedCharacter && isFocus" :src="focusedCharacter" width="100" object-contain pos="absolute right-0 bottom-40px">
      </Transition>

      <input
        v-model.trim="keyword"
        rounded="60px focus:$bew-radius"
        p="l-6 r-16 y-3"
        h-50px
        text="$bew-text-1"
        un-border="3 solid transparent focus:$bew-theme-color"
        ring="1 $bew-border-color"
        transition="all duration-300"
        type="text"
        @focus="isFocus = true"
        @input="handleInput()"
        @keyup.enter="navigateToSearchResultPage(keyword)"
        @keyup.up.stop="handleKeyUp"
        @keyup.down.stop="handleKeyDown"
        @keydown.stop="() => {}"
      >
      <button
        p-2
        rounded-full
        text="lg leading-0 $bew-text-1 group-focus-within:$bew-theme-color"
        transition="all duration-300"
        border-none
        outline-none
        pos="absolute right-2"
        bg="hover:$bew-fill-2"
        filter="group-focus-within:~"
        style="--un-drop-shadow: drop-shadow(0 0 6px var(--bew-theme-color)) "
        @click="navigateToSearchResultPage(keyword)"
      >
        <tabler:search block align-middle />
      </button>
    </div>

    <Transition name="result-list">
      <div
        v-if="
          isFocus
            && searchHistory.length !== 0
            && suggestions.length === 0
        "
        id="search-history"
      >
        <div
          v-for="item in searchHistory"
          :key="item.timestamp"
          ref="historyItemRef"
          class="history-item"
          flex
          justify-between
          items-center
          @click="navigateToSearchResultPage(item.value)"
        >
          {{ item.value }}
          <button
            class="delete"
            rounded-full
            duration-300
            pointer-events-auto
            cursor-pointer
            text="base $bew-text-2"
            leading-0 p-0
            @click.stop="handleDelete(item.value)"
          >
            <ic-baseline-clear />
          </button>
        </div>
      </div>
    </Transition>

    <Transition>
      <div
        v-if="isFocus && suggestions.length !== 0"
        id="search-suggestion"
      >
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          ref="suggestionItemRef"
          class="suggestion-item"
          @click="navigateToSearchResultPage(item.value)"
        >
          {{ item.value }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.result-list-enter-active,
.result-list-leave-active {
  --at-apply: transition-all duration-300 ease-in-out;
}

.result-list-enter-from,
.result-list-leave-to {
  --at-apply: transform translate-y-4 opacity-0 scale-95;
}

.focus-character-enter-active,
.focus-character-leave-active {
  --at-apply: transition-all duration-300 ease-in-out;
}

.focus-character-enter-from,
.focus-character-leave-to {
  --at-apply: transform translate-y-6 opacity-0;
}

.mask-enter-active,
.mask-leave-active {
  --at-apply: transition-all duration-300 ease-in-out;
}

.mask-enter-from,
.mask-leave-to {
  --at-apply: opacity-0;
}

.mask-enter-to,
.mask-leave-from {
  --at-apply: opacity-100;
}

#search-wrap {
  --b-search-bar-color: var(--bew-content-1);
  --b-search-bar-color-hover: var(--bew-content-1-hover);
  --b-search-bar-color-focus: var(--b-search-bar-color);

  @mixin card-content {
    --at-apply: text-base outline-none w-full
      bg-$b-search-bar-color shadow-$bew-shadow-2;
    backdrop-filter: var(--bew-filter-glass);
  }

  .search-bar {
    input {
      @include card-content;
      --at-apply: shadow-$bew-shadow-2;

      &:hover {
        --at-apply: bg-$b-search-bar-color-hover;
      }

      &:focus {
        --at-apply: bg-$b-search-bar-color-focus;
        box-shadow: 0 6px 16px var(--bew-theme-color-40), inset 0 0 6px var(--bew-theme-color-30)
      }
    }

    &.focus input {
      --at-apply: border-$bew-theme-color rounded-$bew-radius;
      box-shadow: 0 6px 16px var(--bew-theme-color-40), inset 0 0 6px var(--bew-theme-color-30)
    }
  }

  @mixin search-content {
    @include card-content;
    --at-apply: p-2 mt-2 absolute rounded-$bew-radius
      hover:block;
  }

  @mixin search-content-item {
    --at-apply: px-4 py-2 w-full rounded-$bew-radius duration-300 cursor-pointer
      not-first:mt-1
      hover:bg-$bew-fill-2;

  }

  #search-history,
  #search-suggestion {
    @include search-content;
    --at-apply: bg-$bew-elevated-1;

    .history-item,
    .suggestion-item {
      @include search-content-item;

      &.active {
        --at-apply: bg-$bew-fill-2;
      }
    }
  }

}
</style>
