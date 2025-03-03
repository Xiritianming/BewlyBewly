<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Ref, UnwrapNestedRefs } from 'vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { isNewArticle, isNewVideo, setLastestOffsetID } from '../notify'
import { MomentType } from '../types'
import type { MomentItem } from '../types'
import { getUserID, smoothScrollToTop } from '~/utils/main'
import { calcTimeSince } from '~/utils/dataFormatter'

const { t } = useI18n()

const moments = reactive<Array<MomentItem>>([]) as UnwrapNestedRefs<
  Array<MomentItem>
>
const momentTabs = reactive([
  {
    id: 0,
    name: t('topbar.moments_dropdown.tabs.videos'),
    isSelected: true,
  },
  {
    id: 1,
    name: t('topbar.moments_dropdown.tabs.live'),
    isSelected: false,
  },
  {
    id: 2,
    name: t('topbar.moments_dropdown.tabs.articles'),
    isSelected: false,
  },
])
const selectedTab = ref<number>(0)
const isLoading = ref<boolean>(false)
// when noMoreContent is true, the user can't scroll down to load more content
const noMoreContent = ref<boolean>(false)
const livePage = ref<number>(1)
const momentsWrap = ref<HTMLElement>() as Ref<HTMLElement>

watch(selectedTab, (newVal: number, oldVal: number) => {
  if (newVal === oldVal)
    return

  if (momentsWrap.value)
    smoothScrollToTop(momentsWrap.value, 300)

  if (newVal === 0) {
    getTopbarNewMoments([MomentType.Video, MomentType.Bangumi])
  }
  else if (newVal === 1) {
    livePage.value = 1
    getTopbarLiveMoments(livePage.value)
  }
  else if (newVal === 2) {
    getTopbarNewMoments([MomentType.Article])
  }
})

onMounted(() => {
  getTopbarNewMoments([MomentType.Video, MomentType.Bangumi])

  if (momentsWrap.value) {
    momentsWrap.value.addEventListener('scroll', () => {
      if (
        momentsWrap.value.clientHeight + momentsWrap.value.scrollTop
          >= momentsWrap.value.scrollHeight - 20
        && moments.length > 0
        && !isLoading.value
      ) {
        if (selectedTab.value === 0 && !noMoreContent.value)
          getTopbarHistoryMoments([MomentType.Video, MomentType.Bangumi])
        else if (selectedTab.value === 1 && !noMoreContent.value)
          getTopbarLiveMoments(livePage.value)
        else if (selectedTab.value === 2 && !noMoreContent.value)
          getTopbarHistoryMoments([MomentType.Article])
      }
    })
  }
})

function onClickTab(tabId: number) {
  // Prevent changing tab when loading, cuz it will cause a bug
  if (isLoading.value || tabId === selectedTab.value)
    return

  selectedTab.value = tabId
  moments.length = 0
  momentTabs.forEach((tab) => {
    tab.isSelected = tab.id === tabId
  })
}

function getTopbarNewMoments(typeList: number[]) {
  moments.length = 0
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getTopbarNewMoments',
      uid: getUserID(),
      typeList,
    })
    .then((res) => {
      if (res.code === 0) {
        if (Array.isArray(res.data.cards) && res.data.cards.length > 0) {
          res.data.cards.forEach((item: any) => {
            pushItemIntoMoments(item)
          })
        }

        if (moments.length !== 0 && res.data.cards.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        // set this lastest offset id, which will clear the new moment's marker point
        // after you watch these moments.
        if (selectedTab.value === 0)
          setLastestOffsetID(MomentType.Video, moments[0].id)
        else if (selectedTab.value === 2)
          setLastestOffsetID(MomentType.Article, moments[0].id)

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function getTopbarHistoryMoments(typeList: number[]) {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getTopbarHistoryMoments',
      uid: getUserID(),
      typeList,
      offsetDynamicID: moments[moments.length - 1].dynamic_id_str,
    })
    .then((res) => {
      if (res.code === 0) {
        if (res.data.has_more === 0) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.cards.forEach((item: any) => {
          pushItemIntoMoments(item)
        })
        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function getTopbarLiveMoments(page: number) {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getTopbarLiveMoments',
      page,
      pageSize: 10,
    })
    .then((res) => {
      if (res.code === 0) {
        // if the length of this list is less then the pageSize, it means that it have no more contents
        if (moments.length !== 0 && res.data.list.length < 10) {
          isLoading.value = false
          noMoreContent.value = true
          console.log('no more content')

          return
        }

        // if the length of this list is equal to the pageSize, this means that it may have the next page.
        if (res.data.list.length === 10)
          livePage.value++
        res.data.list.forEach((item: any) => {
          moments.push({
            id: item.roomid,
            uid: item.uid,
            name: item.uname,
            face: item.face,
            url: item.link,
            title: item.title,
            cover: item.pic,
          } as MomentItem)
        })
        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function pushItemIntoMoments(item: any) {
  const card = JSON.parse(item.card)

  if (item.desc.type === MomentType.Video) {
    // if this is a video moment
    moments.push({
      type: item.desc.type,
      id: item.desc.dynamic_id,
      uid: item.desc.uid,
      name: item.desc.user_profile.info.uname,
      face: item.desc.user_profile.info.face,
      aid: card.aid,
      bvid: item.desc.bvid,
      url: card.short_link_v2,
      ctime: card.ctime,
      title: card.title,
      cover: card.pic,
      dynamic_id_str: item.desc.dynamic_id_str,
      isNew: isNewVideo(item.desc.dynamic_id),
    } as MomentItem)
  }
  else if (item.desc.type === MomentType.Bangumi) {
    // bangumi moment
    moments.push({
      type: item.desc.type,
      id: item.desc.dynamic_id,
      name: card.apiSeasonInfo.title,
      face: card.apiSeasonInfo.cover,
      episode_id: card.episode_id,
      url: card.url,
      title: card.new_desc,
      cover: card.cover,
      dynamic_id_str: item.desc.dynamic_id_str,
      isNew: isNewVideo(item.desc.dynamic_id),
    } as MomentItem)
  }
  else if (item.desc.type === MomentType.Article) {
    // article moment
    moments.push({
      type: item.desc.type,
      id: item.desc.dynamic_id,
      uid: item.desc.uid,
      name: item.desc.user_profile.info.uname,
      face: item.desc.user_profile.info.face,
      url: `https://www.bilibili.com/read/cv${card.id}`,
      ctime: card.publish_time,
      title: card.title,
      cover: card.image_urls[0],
      dynamic_id_str: item.desc.dynamic_id_str,
      isNew: isNewArticle(item.desc.dynamic_id),
    } as MomentItem)
  }
}
</script>

<template>
  <div
    bg="$bew-elevated-solid-1"
    w="380px"
    rounded="$bew-radius"
    pos="relative"
    shadow="$bew-shadow-2"
  >
    <!-- top bar -->
    <header
      flex="~"
      justify="between"
      items-center
      p="y-4 x-6"
      pos="fixed top-0 left-0"
      w="full"
      bg="$bew-elevated-1"
      z="1"
      border="!rounded-t-$bew-radius"
      backdrop-glass
    >
      <div flex="~">
        <div
          v-for="tab in momentTabs"
          :key="tab.id"
          m="r-4"
          transition="all duration-300"
          class="tab"
          :class="tab.isSelected ? 'tab-selected' : ''"
          cursor="pointer"
          @click="onClickTab(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
      <a href="https://t.bilibili.com/" target="_blank" flex="~" items="center">
        <span text="sm">{{ $t('common.view_all') }}</span>
      </a>
    </header>

    <!-- moments wrapper -->
    <main overflow-hidden rounded="$bew-radius">
      <div ref="momentsWrap" h="430px" overflow="y-scroll" p="x-4">
        <!-- loading -->
        <loading
          v-if="isLoading && moments.length === 0"
          h="full"
          flex="~"
          items="center"
        />

        <!-- empty -->
        <empty
          v-if="!isLoading && moments.length === 0"
          pos="absolute top-0 left-0"
          bg="$bew-content-1"
          z="0"
          w="full"
          h="full"
          flex="~"
          items="center"
          border="rounded-$bew-radius"
        />

        <!-- moments -->
        <transition-group name="list">
          <a
            v-for="(moment, index) in moments"
            :key="index"
            :href="moment.url"
            target="_blank"
            flex="~"
            justify="between"
            m="b-4"
            first:m="t-16"
            p="2"
            rounded="$bew-radius"
            hover:bg="$bew-fill-2"
            transition="all duration-300"
            cursor="pointer"
            pos="relative"
          >
            <!-- new moment dot -->
            <div
              v-if="moment.isNew"
              rounded="full"
              w="8px"
              h="8px"
              m="-2"
              bg="$bew-theme-color"
              pos="absolute -top-12px -left-12px"
              style="box-shadow: 0 0 4px var(--bew-theme-color)"
            />

            <a
              :href="
                moment.type === MomentType.Video
                  ? `https://space.bilibili.com/${moment.uid}`
                  : moment.url
              "
              target="_blank"
            >
              <img
                :src="`${moment.face}@50w_50h_1c`"
                rounded="1/2"
                w="40px"
                h="40px"
                m="r-4"
              >
            </a>

            <div flex="~" justify="between" w="full">
              <div>
                <span>{{ `${moment.name} ${t('topbar.moments_dropdown.uploaded')}` }}</span>
                <div overflow-hidden text-ellipsis break-anywhere>
                  {{ moment.title }}
                </div>
                <div
                  v-if="moment.type !== MomentType.Bangumi"
                  text="$bew-text-2 sm"
                  m="y-2"
                >
                  <!-- Videos and articles -->
                  <div v-if="selectedTab === 0 || selectedTab === 2">
                    {{
                      moment.ctime
                        ? calcTimeSince(new Date(moment.ctime * 1000))
                        : moment.ctime
                    }}
                  </div>

                  <!-- Live -->
                  <div
                    v-else-if="selectedTab === 1"
                    text="$bew-theme-color"
                    font="bold"
                    flex="~"
                    items="center"
                  >
                    <fluent:live-24-filled m="r-2" />
                    {{ $t('topbar.moments_dropdown.live_status') }}
                  </div>
                </div>
              </div>
              <img
                :src="`${moment.cover}@128w_72h_1c`"
                w="82px"
                h="46px"
                m="l-4"
                rounded="$bew-radius-half"
              >
            </div>
          </a>
        </transition-group>

        <!-- loading -->
        <Transition name="fade">
          <loading v-if="isLoading && moments.length !== 0" m="-t-4" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  --at-apply: relative text-$bew-text-2;

  &::after {
    --at-apply: absolute bottom-0 left-0 w-full h-12px bg-$bew-theme-color opacity-0 transform scale-x-0 -z-1 transition-all duration-300;
    content: '';
  }
}

.tab-selected {
  --at-apply: font-bold text-$bew-text-1;

  &::after {
    --at-apply: scale-x-80 opacity-40;
  }
}
</style>
