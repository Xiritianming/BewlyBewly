<script setup lang="ts">
import type { Ref } from 'vue'
import type { AppForYouVideoModel, ForYouVideoModel } from '../types'
import emitter from '~/utils/mitt'
import { accessKey, settings } from '~/logic'
import { LanguageType } from '~/enums/appEnums'
import { TVAppKey } from '~/utils/authProvider'

const videoList = reactive<ForYouVideoModel[]>([])
const appVideoList = reactive<AppForYouVideoModel[]>([])
const isLoading = ref<boolean>(true)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const refreshIdx = ref<number>(1)
const noMoreContent = ref<boolean>(false)

watch(() => settings.value.recommendationMode, (newValue) => {
  videoList.length = 0
  appVideoList.length = 0
  if (newValue === 'web') {
    getRecommendVideos()
  }
  else {
    for (let i = 0; i < 3; i++)
      getAppRecommendVideos()
  }
})

onMounted(async () => {
  // Delay by 0.2 seconds to obtain the `settings.value.recommendationMode` value
  // otherwise the `settings.value.recommendationMode` value will be undefined
  // i have no idea to fix that...
  setTimeout(async () => {
    if (settings.value.recommendationMode === 'web') {
      getRecommendVideos()
    }
    else {
      for (let i = 0; i < 3; i++)
        await getAppRecommendVideos()
    }
  }, 200)

  emitter.off('reachBottom')
  emitter.on('reachBottom', async () => {
    if (!isLoading.value) {
      if (settings.value.recommendationMode === 'web') {
        getRecommendVideos()
      }
      else {
        for (let i = 0; i < 3; i++)
          await getAppRecommendVideos()
      }
    }
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
})

async function getRecommendVideos() {
  if (noMoreContent.value)
    return

  isLoading.value = true
  try {
    const response = await browser.runtime.sendMessage({
      contentScriptQuery: 'getRecommendVideos',
      refreshIdx: refreshIdx.value++,
    })

    if (!response.data) {
      noMoreContent.value = true
      return
    }

    if (response.code === 0) {
      const resData = [] as ForYouVideoModel[]

      response.data.item.forEach((item: ForYouVideoModel) => {
        resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!videoList.length) {
        Object.assign(videoList, resData)
      }
      else {
        // else we concat the new data to the old data
        Object.assign(videoList, videoList.concat(resData))
      }
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
  }
}

async function getAppRecommendVideos() {
  isLoading.value = true
  try {
    const response = await browser.runtime.sendMessage({
      contentScriptQuery: 'getAppRecommendVideos',
      accessKey: accessKey.value,
      sLocale: settings.value.language !== LanguageType.Mandarin_CN ? 'zh-Hant_TW' : 'zh-Hans_CN',
      cLocale: settings.value.language !== LanguageType.Mandarin_CN ? 'zh-Hant_TW' : 'zh-Hans_CN',
      appkey: TVAppKey.appkey,
      idx: appVideoList.length > 0 ? appVideoList[appVideoList.length - 1].idx : 1,
    })

    if (response.code === 0) {
      const resData = [] as AppForYouVideoModel[]

      response.data.items.forEach((item: AppForYouVideoModel) => {
        // Remove banner & ad cards
        if (!item.card_type.includes('banner') && item.card_type !== 'cm_v1')
          resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!appVideoList.length) {
        Object.assign(appVideoList, resData)
      }
      else {
        // else we concat the new data to the old data
        Object.assign(appVideoList, appVideoList.concat(resData))
      }
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div>
    <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
      <Button type="primary" @click="jumpToLoginPage()">
        {{ $t('common.login') }}
      </Button>
    </Empty>
    <div
      v-else
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5"
    >
      <template v-if="settings.recommendationMode === 'web'">
        <VideoCard
          v-for="video in videoList"
          :id="video.id"
          :key="video.id"
          :duration="video.duration"
          :title="video.title"
          :cover="video.pic"
          :author="video.owner.name"
          :author-face="video.owner.face"
          :mid="video.owner.mid"
          :view="video.stat.view"
          :danmaku="video.stat.danmaku"
          :published-timestamp="video.pubdate"
          :bvid="video.bvid"
        />
      </template>
      <template v-else>
        <VideoCard
          v-for="video in appVideoList"
          :id="video.args.aid"
          :key="video.args.aid"
          :duration-str="video.cover_right_text"
          :title="video.title"
          :cover="video.cover"
          :author="'avatar' in video.mask ? video.mask.avatar.text : ''"
          :author-face="'avatar' in video.mask ? video.mask.avatar.cover : ''"
          :mid="video.mask.avatar.up_id"
          :capsule-text="video.desc.split('·')[1]"
          :bvid="video.bvid"
          :view-str="video.cover_left_text_1"
          :danmaku-str="video.cover_left_text_2"
        />
      </template>

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton v-for="item in 30" :key="item" />
      </template>
    </div>

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
