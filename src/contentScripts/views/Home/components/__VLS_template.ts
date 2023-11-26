import { settings } from '~/logic';
import { __VLS_internalComponent, __VLS_componentsOption, __VLS_name, needToLoginFirst, jumpToLoginPage, containerRef, videoList, appVideoList, isLoading } from './ForYou.vue';

function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {} &
__VLS_WithComponent<'Empty', typeof __VLS_localComponents, "Empty", "Empty", "Empty"> &
__VLS_WithComponent<'Button', typeof __VLS_localComponents, "Button", "Button", "Button"> &
__VLS_WithComponent<'VideoCard', typeof __VLS_localComponents, "VideoCard", "VideoCard", "VideoCard"> &
__VLS_WithComponent<'VideoCardSkeleton', typeof __VLS_localComponents, "VideoCardSkeleton", "VideoCardSkeleton", "VideoCardSkeleton"> &
__VLS_WithComponent<'Transition', typeof __VLS_localComponents, "Transition", "Transition", "Transition"> &
__VLS_WithComponent<'Loading', typeof __VLS_localComponents, "Loading", "Loading", "Loading">;
__VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div; __VLS_intrinsicElements.div;
__VLS_components.Empty; __VLS_components.Empty;
// @ts-ignore
[Empty, Empty,];
__VLS_components.Button; __VLS_components.Button;
// @ts-ignore
[Button, Button,];
__VLS_components.VideoCard; __VLS_components.VideoCard;
// @ts-ignore
[VideoCard, VideoCard,];
__VLS_components.VideoCardSkeleton;
// @ts-ignore
[VideoCardSkeleton,];
__VLS_components.Transition; __VLS_components.Transition;
// @ts-ignore
[Transition, Transition,];
__VLS_components.Loading;
// @ts-ignore
[Loading,];
{
const __VLS_0 = __VLS_intrinsicElements["div"];
const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
const __VLS_2 = __VLS_1({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_0, typeof __VLS_2> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
let __VLS_4!: __VLS_NormalizeEmits<typeof __VLS_3.emit>;
if (__VLS_ctx.needToLoginFirst) {
{
let __VLS_5!: 'Empty' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Empty : (typeof __VLS_resolvedLocalAndGlobalComponents)['Empty'];
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{}, mt6: (true), description: ((__VLS_ctx.$t('common.please_log_in_first'))), }));
({} as { Empty: typeof __VLS_5; }).Empty;
({} as { Empty: typeof __VLS_5; }).Empty;
const __VLS_7 = __VLS_6({ ...{}, mt6: (true), description: ((__VLS_ctx.$t('common.please_log_in_first'))), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_5, typeof __VLS_7> & Record<string, unknown>) => void)({ ...{}, mt6: (true), description: ((__VLS_ctx.$t('common.please_log_in_first'))), });
const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7)!;
let __VLS_9!: __VLS_NormalizeEmits<typeof __VLS_8.emit>;
{
let __VLS_10!: 'Button' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Button : (typeof __VLS_resolvedLocalAndGlobalComponents)['Button'];
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ ...{ onClick: {} as any, }, type: ("primary"), }));
({} as { Button: typeof __VLS_10; }).Button;
({} as { Button: typeof __VLS_10; }).Button;
const __VLS_12 = __VLS_11({ ...{ onClick: {} as any, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_10, typeof __VLS_12> & Record<string, unknown>) => void)({ ...{ onClick: {} as any, }, type: ("primary"), });
const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12)!;
let __VLS_14!: __VLS_NormalizeEmits<typeof __VLS_13.emit>;
let __VLS_15 = { 'click': __VLS_pickEvent(__VLS_14['click'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_11, typeof __VLS_12>).onClick) };
__VLS_15 = {
click: $event => {
if (!((__VLS_ctx.needToLoginFirst))) return;
__VLS_ctx.jumpToLoginPage();
// @ts-ignore
[needToLoginFirst, $t, $t, $t, jumpToLoginPage,];
}
};
(__VLS_ctx.$t('common.login'));
(__VLS_13.slots!).default;
}
(__VLS_8.slots!).default;
}
// @ts-ignore
[$t,];
}
else {
{
const __VLS_16 = __VLS_intrinsicElements["div"];
const __VLS_17 = __VLS_elementAsFunctionalComponent(__VLS_16);
const __VLS_18 = __VLS_17({ ...{}, ref: ("containerRef"), m: ("b-0 t-0"), relative: (true), wFull: (true), hFull: (true), grid: ("~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5"), }, ...__VLS_functionalComponentArgsRest(__VLS_17));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_16, typeof __VLS_18> & Record<string, unknown>) => void)({ ...{}, ref: ("containerRef"), m: ("b-0 t-0"), relative: (true), wFull: (true), hFull: (true), grid: ("~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5"), });
const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18)!;
let __VLS_20!: __VLS_NormalizeEmits<typeof __VLS_19.emit>;
// @ts-ignore
(__VLS_ctx.containerRef);
if (__VLS_ctx.settings.recommendationMode === 'web') {
for (const [video] of __VLS_getVForSourceType((__VLS_ctx.videoList)!)) {
{
let __VLS_21!: 'VideoCard' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.VideoCard : (typeof __VLS_resolvedLocalAndGlobalComponents)['VideoCard'];
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({ ...{}, id: ((video.id)), key: ((video.id)), duration: ((video.duration)), title: ((video.title)), cover: ((video.pic)), author: ((video.owner.name)), authorFace: ((video.owner.face)), mid: ((video.owner.mid)), view: ((video.stat.view)), danmaku: ((video.stat.danmaku)), publishedTimestamp: ((video.pubdate)), bvid: ((video.bvid)), }));
({} as { VideoCard: typeof __VLS_21; }).VideoCard;
const __VLS_23 = __VLS_22({ ...{}, id: ((video.id)), key: ((video.id)), duration: ((video.duration)), title: ((video.title)), cover: ((video.pic)), author: ((video.owner.name)), authorFace: ((video.owner.face)), mid: ((video.owner.mid)), view: ((video.stat.view)), danmaku: ((video.stat.danmaku)), publishedTimestamp: ((video.pubdate)), bvid: ((video.bvid)), }, ...__VLS_functionalComponentArgsRest(__VLS_22));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_21, typeof __VLS_23> & Record<string, unknown>) => void)({ ...{}, id: ((video.id)), key: ((video.id)), duration: ((video.duration)), title: ((video.title)), cover: ((video.pic)), author: ((video.owner.name)), authorFace: ((video.owner.face)), mid: ((video.owner.mid)), view: ((video.stat.view)), danmaku: ((video.stat.danmaku)), publishedTimestamp: ((video.pubdate)), bvid: ((video.bvid)), });
const __VLS_24 = __VLS_pickFunctionalComponentCtx(__VLS_21, __VLS_23)!;
let __VLS_25!: __VLS_NormalizeEmits<typeof __VLS_24.emit>;
}
// @ts-ignore
[containerRef, settings, videoList,];
}
}
else {
for (const [video] of __VLS_getVForSourceType((__VLS_ctx.appVideoList)!)) {
{
let __VLS_26!: 'VideoCard' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.VideoCard : (typeof __VLS_resolvedLocalAndGlobalComponents)['VideoCard'];
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{}, id: ((video.args.aid)), key: ((video.args.aid)), durationStr: ((video.cover_right_text)), title: ((video.title)), cover: ((video.cover)), author: ((video.args.up_name)), "<!--": (true), authorFace: (('avatar' in video.mask ? video.mask.avatar.cover : '')), "--": (true), }));
({} as { VideoCard: typeof __VLS_26; }).VideoCard;
const __VLS_28 = __VLS_27({ ...{}, id: ((video.args.aid)), key: ((video.args.aid)), durationStr: ((video.cover_right_text)), title: ((video.title)), cover: ((video.cover)), author: ((video.args.up_name)), "<!--": (true), authorFace: (('avatar' in video.mask ? video.mask.avatar.cover : '')), "--": (true), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_26, typeof __VLS_28> & Record<string, unknown>) => void)({ ...{}, id: ((video.args.aid)), key: ((video.args.aid)), durationStr: ((video.cover_right_text)), title: ((video.title)), cover: ((video.cover)), author: ((video.args.up_name)), "<!--": (true), authorFace: (('avatar' in video.mask ? video.mask.avatar.cover : '')), "--": (true), });
const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28)!;
let __VLS_30!: __VLS_NormalizeEmits<typeof __VLS_29.emit>;
(__VLS_29.slots!).default;
}
// @ts-ignore
[appVideoList,];
}
}
if (__VLS_ctx.isLoading) {
for (const [item] of __VLS_getVForSourceType((30)!)) {
{
let __VLS_31!: 'VideoCardSkeleton' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.VideoCardSkeleton : (typeof __VLS_resolvedLocalAndGlobalComponents)['VideoCardSkeleton'];
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({ ...{}, key: ((item)), }));
({} as { VideoCardSkeleton: typeof __VLS_31; }).VideoCardSkeleton;
const __VLS_33 = __VLS_32({ ...{}, key: ((item)), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_31, typeof __VLS_33> & Record<string, unknown>) => void)({ ...{}, key: ((item)), });
const __VLS_34 = __VLS_pickFunctionalComponentCtx(__VLS_31, __VLS_33)!;
let __VLS_35!: __VLS_NormalizeEmits<typeof __VLS_34.emit>;
}
// @ts-ignore
[isLoading,];
}
}
(__VLS_19.slots!).default;
}
}
{
let __VLS_36!: 'Transition' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Transition : (typeof __VLS_resolvedLocalAndGlobalComponents)['Transition'];
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ ...{}, name: ("fade"), }));
({} as { Transition: typeof __VLS_36; }).Transition;
({} as { Transition: typeof __VLS_36; }).Transition;
const __VLS_38 = __VLS_37({ ...{}, name: ("fade"), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_36, typeof __VLS_38> & Record<string, unknown>) => void)({ ...{}, name: ("fade"), });
const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38)!;
let __VLS_40!: __VLS_NormalizeEmits<typeof __VLS_39.emit>;
if (__VLS_ctx.isLoading) {
{
let __VLS_41!: 'Loading' extends keyof typeof __VLS_ctx ? typeof __VLS_ctx.Loading : (typeof __VLS_resolvedLocalAndGlobalComponents)['Loading'];
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({ ...{}, }));
({} as { Loading: typeof __VLS_41; }).Loading;
const __VLS_43 = __VLS_42({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_42));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_41, typeof __VLS_43> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_44 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43)!;
let __VLS_45!: __VLS_NormalizeEmits<typeof __VLS_44.emit>;
}
// @ts-ignore
[isLoading,];
}
(__VLS_39.slots!).default;
}
(__VLS_3.slots!).default;
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!: {};
return __VLS_slots;
}
