export interface HomeTab {
  label: string
  value: HomeSubPage
}

export enum HomeSubPage {
  ForYou = 'ForYou',
  Following = 'Following',
  Trending = 'Trending',
  Ranking = 'Ranking',
}

export interface ForYouVideoModel {
  id: number
  bvid: string
  cid: number
  goto: string
  uri: string
  pic: string
  pic_4_3: string
  title: string
  duration: number
  pubdate: number
  owner: {
    mid: number
    name: string
    face: string
  }
  stat: {
    view: number
    like: number
    danmaku: number
    vt: number
  }
  // av_feature: null
  is_followed: number
  rcmd_reason: {
    reason_type: number
  }
  show_info: number
  pos: number
  // room_info: null
  // ogv_info: null
  // business_info: null
  is_stock: number
  enable_vt: number
  vt_display: string
}

export interface AppForYouVideoModel {
  card_type: string
  card_goto: string
  goto: string
  param: string
  bvid: string
  cover: string
  title: string
  uri: string
  three_point: {
    dislike_reasons: {
      id: number
      name: string
      toast: string
    }[]

    feedbacks: {
      id: number
      name: string
      toast: string
    }[]

    watch_later: number
  }
  args: {
    up_id: number
    up_name: string
    rid: number
    rname: string
    aid: number
  }
  player_args: {
    aid: number
    cid: number
    type: string
    duration: number
  }
  idx: number
  mask: {
    avatar: {
      cover: string
      text: string
      uri: string
      event: string
      event_v2: string
      up_id: number
    }
    button: {
      text: string
      param: string
      event: string
      type: number
      event_v2: string
    }
  }
  three_point_v2: {
    title: string
    icon?: string
    subtitle: string
    reasons: {
      id: number
      name: string
      toast: string
    }[]

    type: string
  }[]

  track_id: string
  report_flow_data: string
  avatar: {
    cover: string
    uri: string
    event: string
    event_v2: string
    up_id: number
  }
  cover_left_text_1: string
  cover_left_text_2: string
  desc: string
  can_play: number
  cover_right_text: string
  cover_left_icon_1: number
  cover_left_icon_2: number
}

export interface MomentModel {
  basic: {
    comment_id_str: string
    comment_type: number
    like_icon: {
      action_url: string
      end_url: string
      id: number
      start_url: string
    }
    rid_str: string
  }
  id_str: string
  modules: {
    module_author: {
      avatar: {
        container_size: {
          height: number
          width: number
        }
        fallback_layers: {
          is_critical_group: boolean
          layers: {
            general_spec: {
              pos_spec: {
                axis_x: number
                axis_y: number
                coordinate_pos: number
              }
              render_spec: {
                opacity: number
              }
              size_spec: {
                height: number
                width: number
              }
            }
            layer_config: {
              is_critical: true
              tags: {
                AVATAR_LAYER: object
                GENERAL_CFG: {
                  config_type: number
                  general_config: {
                    web_css_style: {
                      borderRadius: string
                    }
                  }
                }
              }
            }
            resource: {
              res_image: {
                image_src: {
                  placeholder: number
                  remote: {
                    bfs_style: string
                    url: string
                  }
                  src_type: number
                }
              }
              res_type: number
            }
            visible: boolean
          }[]
        }
        mid: string
      }
      face: string
      face_nft: boolean
      following: boolean
      jump_url: string
      label: string
      mid: number
      name: string
      official_verify: {
        desc: string
        type: number
      }
      pendant: {
        expire: number
        image: string
        image_enhance: string
        image_enhance_frame: string
        name: string
        pid: number
      }
      pub_action: string
      pub_location_text: string
      pub_time: string
      pub_ts: number
      type: string
    }
    module_dynamic: {
      additional?: string
      desc?: string
      major: {
        archive: {
          aid: string
          badge: {
            bg_color: string
            color: string
            icon_url?: string
            text: string
          }
          bvid: string
          cover: string
          desc: string
          disable_preview: number
          duration_text: string
          jump_url: string
          stat: {
            danmaku: string
            play: string
          }
          title: string
          type: number
        }
        type: string
      }
      topic?: any
    }
    module_more: {
      three_point_items: {
        label: string
        type: string
      }[]
    }
    module_stat: {
      comment: {
        count: number
        forbidden: boolean
      }
      forward: {
        count: number
        forbidden: boolean
      }
      like: {
        count: number
        forbidden: boolean
        status: boolean
      }
    }
  }
  type: string
  visible: boolean
}

export interface PopularVideoModel {
  aid: number
  videos: number
  tid: number
  tname: string
  copyright: number
  pic: string
  title: string
  pubdate: number
  ctime: number
  desc: string
  state: number
  duration: number
  mission_id: number
  owner: {
    mid: number
    name: string
    face: string
  }
  stat: {
    aid: number
    view: number
    danmaku: number
    reply: number
    favorite: number
    coin: number
    share: number
    now_rank: number
    his_rank: number
    like: number
    dislike: number
    vt: number
    vv: number
  }
  dynamic: string
  cid: number
  dimension: {
    width: number
    height: number
    rotate: number
  }
  short_link_v2: string
  up_from_v2: number
  first_frame: string
  bvid: string
  season_type: number
  is_ogv: boolean
  enable_vt: number
  rcmd_reason: {
    content: string
    corner_mark: number
  }
}

export interface RankingType {
  id: number
  name: string
  rid?: number
  seasonType?: number
  type?: string
}

export interface RankingVideoModel {
  aid: number
  videos: number
  tid: number
  tname: string
  copyright: number
  pic: string
  title: string
  pubdate: number
  ctime: number
  desc: string
  state: number
  duration: number
  rights: {
    bp: number
    elec: number
    download: number
    movie: number
    pay: number
    hd5: number
    no_reprint: number
    autoplay: number
    ugc_pay: number
    is_cooperation: number
    ugc_pay_preview: number
    no_background: number
    arc_pay: number
    pay_free_watch: number
  }
  owner: {
    mid: number
    name: string
    face: string
  }
  stat: {
    aid: number
    view: number
    danmaku: number
    reply: number
    favorite: number
    coin: number
    share: number
    now_rank: number
    his_rank: number
    like: number
    dislike: number
    vt: number
    vv: number
  }
  dynamic: string
  cid: number
  dimension: {
    width: number
    height: number
    rotate: number
  }
  short_link_v2: string
  first_frame: string
  bvid: string
  score: number
  enable_vt: number
}

export interface PgcModel {
  badge: string
  badge_info: {
    bg_color: string
    bg_color_night: string
    text: string
  }
  badge_type: number
  copyright: string
  cover: string
  enable_vt: boolean
  icon_font: {
    name: string
    text: string
  }
  new_ep: {
    cover: string
    index_show: string
  }
  rank: number
  rating: string
  season_id: number
  ss_horizontal_cover: string
  stat: {
    danmaku: number
    follow: number
    series_follow: number
    view: number
  }
  title: string
  url: string
}
