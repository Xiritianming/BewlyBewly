<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { HistoryType } from './types'
import type { HistoryItem } from './types'
import { getCSRF, openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'
import { calcCurrentTime } from '~/utils/dataFormatter'
import emitter from '~/utils/mitt'

const { t } = useI18n()

const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>()
const historyList = reactive<Array<HistoryItem>>([])
const currentPageNum = ref<number>(1)
const keyword = ref<string>()
const historyStatus = ref<boolean>()

watch(
  () => keyword.value,
  (newValue, oldValue) => {
    if (newValue === oldValue)
      return
    emitter.on('reachBottom', () => {
      if (isLoading.value)
        return

      if (!noMoreContent.value) {
        if (keyword.value)
          searchHistoryList()
        else getHistoryList()
      }
    })
  },
)

onMounted(() => {
  getHistoryList()
  getHistoryPauseStatus()

  emitter.off('reachBottom')
  emitter.on('reachBottom', () => {
    if (isLoading.value)
      return

    if (!noMoreContent.value) {
      if (keyword.value)
        searchHistoryList()
      else getHistoryList()
    }
  })

  emitter.off('pageRefresh')
  emitter.on('pageRefresh', async () => {
    historyList.length = 0
    getHistoryList()
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
  emitter.off('pageRefresh')
})

/**
 * Get history list
 */
function getHistoryList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getHistoryList',
      type: 'all',
      viewAt:
        historyList.length > 0
          ? historyList[historyList.length - 1].view_at
          : 0,
    })
    .then((res) => {
      if (res.code === 0) {
        if (Array.isArray(res.data.list) && res.data.list.length > 0)
          historyList.push(...res.data.list)

        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function searchHistoryList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'searchHistoryList',
      pn: currentPageNum.value++,
      keyword: keyword.value,
    })
    .then((res) => {
      if (res.code === 0) {
        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.list.forEach((item: HistoryItem) => {
          historyList.push(item)
        })

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function handleSearch() {
  historyList.length = 0
  currentPageNum.value = 1
  if (keyword.value)
    searchHistoryList()
  else getHistoryList()
}

function deleteHistoryItem(index: number, historyItem: HistoryItem) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'deleteHistoryItem',
      kid: `${historyItem.history.business}_${historyItem.history.oid}`,
      csrf: getCSRF(),
    })
    .then((res) => {
      if (res.code === 0)
        historyList.splice(index, 1)
    })
}

/**
 * Return the URL of the history item
 * @param item history item
 * @return {string} url
 */
function getHistoryUrl(item: HistoryItem) {
  // anime
  if (item.history.business === 'pgc')
    return removeHttpFromUrl(item.uri)
  // video
  else if (item.history.business === 'archive')
    return removeHttpFromUrl(item.history.bvid)
  else if (item.history.business === 'live')
    return `//live.bilibili.com/${item.history.oid}`
  else if (item.history.business === 'article')
    return `//www.bilibili.com/read/cv${item.history.oid}`

  return ''
}

function getHistoryItemCover(item: HistoryItem) {
  if (item.history.business === 'article')
    return removeHttpFromUrl(item.covers[0])

  return removeHttpFromUrl(item.cover)
}

function getHistoryPauseStatus() {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getHistoryPauseStatus',
    })
    .then((res) => {
      if (res.code === 0)
        historyStatus.value = res.data
    })
}

function setHistoryPauseStatus(isPause: boolean) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'setHistoryPauseStatus',
      csrf: getCSRF(),
      switch: isPause,
    })
    .then((res) => {
      if (res.code === 0)
        getHistoryPauseStatus()
    })
}

function clearAllHistory() {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'clearAllHistory',
      csrf: getCSRF(),
    })
    .then((res) => {
      if (res.code === 0)
        historyList.length = 0
    })
}

function handleClearAllWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm(
    t('history.clear_all_watch_history_confirm'),
  )
  if (result)
    clearAllHistory()
}

function handlePauseWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm(
    t('history.pause_watch_history_confirm'),
  )
  if (result)
    setHistoryPauseStatus(true)
}

function handleTurnOnWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm(
    t('history.turn_on_watch_history_confirm'),
  )
  if (result)
    setHistoryPauseStatus(false)
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div v-if="getCSRF()" flex="~ col md:row lg:row" gap-4>
    <main w="full md:60% lg:70% xl:75%" order="2 md:1 lg:1" mb-6>
      <h3 text="3xl $bew-text-1" font-bold mb-6>
        {{ $t('history.title') }}
      </h3>
      <!-- historyList -->
      <transition-group name="list">
        <a
          v-for="(historyItem, index) in historyList"
          :key="historyItem.kid"
          block
          class="group"
          flex
          cursor-pointer
          @click="openLinkToNewTab(`${getHistoryUrl(historyItem)}`)"
        >
          <!-- time slot -->
          <div
            mr-8
            px-4
            b-l="~ 2px dashed $bew-fill-2"
            group-hover:b-l="$bew-theme-color-40"
            items-center
            justify-center
            shrink-0
            relative
            duration-300
            display="none xl:flex"
          >
            <!-- Dot -->
            <i
              pos="absolute left--1px"
              w-2
              h-2
              rounded-6
              bg="$bew-fill-3"
              group-hover:bg="$bew-theme-color"
              transform="~ translate-x--1/2"
              duration-300
            />
            <div
              text="sm $bew-text-3"
              group-hover:text="$bew-theme-color"
              bg="$bew-fill-1"
              group-hover:bg="$bew-theme-color-20"
              p="x-3 y-1"
              rounded-8
              duration-300
            >
              {{
                useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                  .value
              }}
            </div>
          </div>

          <section
            rounded="$bew-radius"
            flex="~ gap-6 col md:col lg:row"
            item-start
            relative
            group-hover:bg="$bew-fill-2"
            duration-300
            w-full
            p-2
            m-1
          >
            <!-- Cover -->
            <div
              pos="relative"
              bg="$bew-fill-5"
              w="full md:full lg:250px"
              flex="shrink-0"
              rounded="$bew-radius"
              overflow-hidden
              aspect-video
            >
              <img
                w="full"
                aspect-video
                :src="`${getHistoryItemCover(historyItem)}@480w_270h_1c`"
                :alt="historyItem.title"
                object-cover
              >

              <span
                v-if="historyItem.history.business !== HistoryType.Archive"
                pos="absolute right-0 top-0"
                bg="$bew-theme-color"
                text="xs white"
                p="x-2 y-1"
                m-1
                rounded="$bew-radius-half"
              >
                <template
                  v-if="historyItem.history.business === HistoryType.Live"
                >
                  Livestreaming
                </template>
                <template
                  v-else-if="
                    historyItem.history.business === HistoryType.Article
                  "
                >
                  Article
                </template>
                <template
                  v-else-if="historyItem.history.business === HistoryType.PGC"
                >
                  Anime
                </template>
              </span>

              <div
                v-if="
                  historyItem.history.business === HistoryType.Archive
                    || historyItem.history.business === HistoryType.PGC
                "
                pos="absolute bottom-0 right-0"
                bg="black opacity-60"
                m="2"
                p="x-2 y-1"
                text="white xs"
                rounded-8
              >
                <!--  When progress = -1 means that the user watched the full video -->
                {{
                  `${
                    historyItem.progress === -1
                      ? calcCurrentTime(historyItem.duration)
                      : calcCurrentTime(historyItem.progress)
                  } /
                      ${calcCurrentTime(historyItem.duration)}`
                }}
              </div>
              <div w-full pos="absolute bottom-0" bg="white opacity-60">
                <Progress
                  v-if="
                    historyItem.history.business === HistoryType.Archive
                      || historyItem.history.business === HistoryType.PGC
                  "
                  :percentage="
                    (historyItem.progress / historyItem.duration) * 100
                  "
                />
              </div>
            </div>

            <!-- Description -->
            <div flex justify-between w-full>
              <div flex="~ col">
                <a :href="`${getHistoryUrl(historyItem)}`" target="_blank" @click.stop="">
                  <h3
                    class="keep-two-lines"
                    overflow="hidden"
                    text="lg overflow-ellipsis"
                  >
                    {{
                      historyItem.show_title
                        ? historyItem.show_title
                        : historyItem.title
                    }}
                  </h3>
                </a>
                <a
                  un-text="$bew-text-2 sm"
                  m="t-4 b-2"
                  flex="~"
                  items-center
                  cursor-pointer
                  w-fit
                  rounded="$bew-radius"
                  hover:color="$bew-theme-color"
                  hover:bg="$bew-theme-color-10"
                  duration-300
                  pr-2
                  :href="
                    historyItem.author_mid
                      ? `https://space.bilibili.com/${historyItem.author_mid}`
                      : historyItem.uri
                  "
                  target="_blank"
                  @click.stop=""
                >
                  <img
                    :src="
                      removeHttpFromUrl(`${historyItem.author_face
                        ? historyItem.author_face
                        : historyItem.cover}@40w_40h_1c`)
                    "
                    w-30px
                    aspect-square
                    object-cover
                    alt=""
                    rounded="1/2"
                    mr-2
                  >
                  {{
                    historyItem.author_name
                      ? historyItem.author_name
                      : historyItem.title
                  }}
                  <span
                    v-if="historyItem.live_status === 1"
                    text="$bew-theme-color"
                    flex
                    items-center
                    gap-1
                    m="l-2"
                  ><tabler:live-photo />
                    Live
                  </span>
                </a>
                <p display="block xl:none" text="$bew-text-3 sm" mt-auto mb-2>
                  {{
                    useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                      .value
                  }}
                </p>
              </div>

              <button
                text="2xl $bew-text-3"
                hover:color="$bew-theme-color"
                opacity-0 group-hover:opacity-100
                p-2
                duration-300
                @click.stop="deleteHistoryItem(index, historyItem)"
              >
                <tabler:trash />
              </button>
            </div>
          </section>
        </a>
      </transition-group>
      <!-- loading -->
      <Transition name="fade">
        <loading
          v-if="isLoading && historyList.length !== 0 && !noMoreContent"
          m="-t-4"
        />
      </Transition>
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" order="1 md:2 lg:2">
      <div pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full>
        <input
          v-model.lazy.trim="keyword"
          type="text"
          :placeholder="t('history.search_watch_history')"
          p="x-14px"
          lh-35px h-35px
          rounded="$bew-radius"
          bg="$bew-content-solid-1"
          shadow="$bew-shadow-1"
          outline-none
          w-full
          @keyup.enter="handleSearch"
        >
        <Button
          block
          style="
            --b-button-shadow: var(--bew-shadow-1);
          "
          @click="handleClearAllWatchHistory"
        >
          <template #left>
            <tabler:trash />
          </template>
          {{ $t('history.clear_all_watch_history') }}
        </Button>
        <Button
          v-if="!historyStatus"
          block
          style="
            --b-button-shadow: var(--bew-shadow-1);
          "
          @click="handlePauseWatchHistory"
        >
          <template #left>
            <ph:pause-circle-bold />
          </template>
          {{ $t('history.pause_watch_history') }}
        </Button>
        <Button
          v-else
          block
          style="
            --b-button-shadow: var(--bew-shadow-1);
          "
          @click="handleTurnOnWatchHistory"
        >
          <template #left>
            <ph:play-circle-bold />
          </template>
          {{ $t('history.turn_on_watch_history') }}
        </Button>
      </div>
    </aside>
  </div>
  <Empty v-else mt-6 :description="t('common.please_log_in_first')">
    <Button type="primary" @click="jumpToLoginPage()">
      {{ $t('common.login') }}
    </Button>
  </Empty>
</template>

<style lang="scss" scoped>
</style>
