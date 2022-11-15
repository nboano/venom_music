/*
        ytmusic.js                                                                         
        API non ufficiale per interfacciare JS con Youtube Music.

        By 𝓚𝓲𝓷𝓭𝓮𝓻𝓑𝓸𝓪𝓷𝓸
        2022
 */
class YTMusic {
    static BASE_URL = "https://music.youtube.com";
    static #ytcfg = {};
    static #ytutils = {
        buildEndpointContext: (typeName, browseId) => {
            return {
                'browseEndpointContextSupportedConfigs': {
                    'browseEndpointContextMusicConfig': {
                        'pageType': `MUSIC_PAGE_TYPE_${_.upperCase(typeName)}`
                    }
                },
                'browseId': browseId
            }
        },
        hms2ms: (v) => {
            try {
                let p = v.split(':'),
                    s = 0,
                    f = 1
                while (p.length > 0) {
                    s += f * parseInt(p.pop(), 10)
                    f *= 60
                }
                return s * 1e3
            } catch (e) {
                return 0
            }
        },
        createApiContext: (ytcfg) => {
            return {
                context: {
                    capabilities: {},
                    client: {
                        clientName: ytcfg.INNERTUBE_CLIENT_NAME,
                        clientVersion: ytcfg.INNERTUBE_CLIENT_VERSION,
                        experimentIds: [],
                        experimentsToken: "",
                        gl: ytcfg.GL,
                        hl: ytcfg.HL,
                        locationInfo: {
                            locationPermissionAuthorizationStatus: "LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED",
                        },
                        musicAppInfo: {
                            musicActivityMasterSwitch: "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
                            musicLocationMasterSwitch: "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE",
                            pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
                        },
                        utcOffsetMinutes: -new Date().getTimezoneOffset(),
                    },
                    request: {
                        internalExperimentFlags: [{
                            key: "force_music_enable_outertube_tastebuilder_browse",
                            value: "true",
                        },
                        {
                            key: "force_music_enable_outertube_playlist_detail_browse",
                            value: "true",
                        },
                        {
                            key: "force_music_enable_outertube_search_suggestions",
                            value: "true",
                        },
                        ],
                        sessionIndex: {},
                    },
                    user: {
                        enableSafetyMode: false,
                    },
                }
            }
        },
        fv: function (input, query, justOne = false) {
            const iterate = (x, y) => {
                var r = []
                x.hasOwnProperty(y) && r.push(x[y]);
                if (justOne && x.hasOwnProperty(y)) {
                    return r.shift()
                }

                if (x instanceof Array) {
                    for (let i = 0; i < x.length; i++) {
                        r = r.concat(iterate(x[i], y))
                    }
                } else if (x instanceof Object) {
                    const c = Object.keys(x)
                    if (c.length > 0) {
                        for (let i = 0; i < c.length; i++) {
                            r = r.concat(iterate(x[c[i]], y))
                        }
                    }
                }
                return r.length == 1 ? r.shift() : r
            }

            let d = query.split(':'),
                v = input
            for (let i = 0; i < d.length; i++) {
                v = iterate(v, d[i])
            }
            return v
        },
        getCategoryURI: (categoryName) => {
            var b64Key = ''
            switch (_.upperCase(categoryName)) {
                case 'SONG':
                    b64Key = 'RAAGAAgACgA'
                    break
                case 'VIDEO':
                    b64Key = 'BABGAAgACgA'
                    break
                case 'ALBUM':
                    b64Key = 'BAAGAEgACgA'
                    break
                case 'ARTIST':
                    b64Key = 'BAAGAAgASgA'
                    break
                case 'PLAYLIST':
                    b64Key = 'BAAGAAgACgB'
                    break
            }

            if (b64Key.length > 0) {
                return `Eg-KAQwIA${b64Key}MABqChAEEAMQCRAFEAo%3D`
            } else {
                return null
            }
        }
    }
    static #ytparsers = {
        parseSearchResult: (context) => {
            const result = {
                content: []
            }

            var sectionList = YTMusic.#ytutils.fv(
                context, 'musicResponsiveListItemRenderer'
            )
            if (!Array.isArray(sectionList)) {
                sectionList = [sectionList]
            }
            sectionList.forEach(sectionContext => {
                const flexColumn = _.concat(YTMusic.#ytutils.fv(
                    sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
                ))
                const type = _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)
                switch (type) {
                    case 'Song':
                        result.content.push(Object.freeze({
                            type: _.lowerCase(_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                            videoId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                            playlistId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                            name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                            artist: (function () {
                                var a = [],
                                    c = (_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs'), 2))
                                if (Array.isArray(c)) {
                                    c = _.filter(c, function (o) {
                                        return o.navigationEndpoint
                                    })
                                    for (var i = 0; i < c.length; i++) {
                                        a.push({
                                            name: YTMusic.#ytutils.fv(c[i], 'text'),
                                            browseId: YTMusic.#ytutils.fv(c[i], 'browseEndpoint:browseId')
                                        })
                                    }
                                } else {
                                    a.push({
                                        name: YTMusic.#ytutils.fv(c, 'text'),
                                        browseId: YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId')
                                    })
                                }
                                return 1 < a.length ? a : 0 < a.length ? a[0] : a
                            })(),
                            album: (function () {
                                var c = (_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs'), 4))
                                if (!Array.isArray(c) && c instanceof Object) return {
                                    name: YTMusic.#ytutils.fv(c, 'text'),
                                    browseId: YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId')
                                }
                                return {}
                            })(),
                            duration: YTMusic.#ytutils.hms2ms(_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 6)),
                            thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                            params: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:params')
                        }))
                        break
                    case 'Video':
                        result.content.push(Object.freeze({
                            type: _.lowerCase(_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                            videoId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                            playlistId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                            name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                            author: _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 2),
                            views: _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 4),
                            duration: YTMusic.#ytutils.hms2ms(_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 6)),
                            thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                            params: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:params'),
                        }))
                        break
                    case 'Artist':
                        result.content.push(Object.freeze({
                            type: _.lowerCase(_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                            browseId: YTMusic.#ytutils.fv(_.at(sectionContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                            name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                            thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                        }))
                        break
                    case 'EP':
                    case 'Single':
                    case 'Album':
                        result.content.push(Object.freeze({
                            type: _.lowerCase(_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 0)),
                            browseId: YTMusic.#ytutils.fv(
                                _.at(
                                    sectionContext, 'navigationEndpoint'
                                ),
                                'browseEndpoint:browseId'
                            ),
                            playlistId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                            name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                            artist: (_.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 2)),
                            year: _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 4),
                            thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                        }))
                        break
                    case 'Playlist':
                        result.content.push(Object.freeze({
                            type: _.lowerCase(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text')),
                            browseId: YTMusic.#ytutils.fv(
                                _.at(
                                    sectionContext, 'navigationEndpoint'
                                ),
                                'browseEndpoint:browseId'
                            ),
                            title: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                            author: _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 3),
                            count: _.toNumber(
                                _.nth(
                                    _.words(
                                        _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 5)
                                    ),
                                    0
                                )
                            ),
                            thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                        }))
                        break
                    default:
                        break
                }
            })
            return result
        },
        parseSongSearchResult: (context) => {
            const result = {
                content: [],
                continuation: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData', true
                )
            }

            var sectionList = YTMusic.#ytutils.fv(
                context, 'musicResponsiveListItemRenderer', true
            )

            if (!Array.isArray(sectionList)) {
                sectionList = [sectionList]
            }
            sectionList.forEach(sectionContext => {
                const flexColumn = YTMusic.#ytutils.fv(
                    sectionContext, 'musicResponsiveListItemFlexColumnRenderer', true
                )
                result.content.push({
                    type: 'song',
                    //videoId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:videoId', true),
                    videoId: flexColumn[0].text.runs[0].navigationEndpoint.watchEndpoint.videoId,
                    //playlistId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    playlistId: flexColumn[0].text.runs[0].navigationEndpoint.watchEndpoint.playlistId,
                    name: YTMusic.#ytutils.fv(flexColumn[0], 'runs:text', true),
                    artist: (function () {
                        var na = [],
                            c = (YTMusic.#ytutils.fv(flexColumn[1], 'runs'))
                        for (var i = 0; i < c.length; i++) {
                            if (c[i].text == " • ")
                                break;
                            na[i] = c[i].text;
                        }
                        na = na.filter((e, i) => {
                            return i % 2 == 0;
                        })
                        return na;
                        //if (Array.isArray(c)) {
                        //    c = _.filter(c, function (o) {
                        //        return o.navigationEndpoint
                        //    })
                        //    for (var i = 0; i < c.length; i++) {
                        //        let browseId = YTMusic.#ytutils.fv(c[i], 'browseEndpoint:browseId', true)
                        //        if (browseId.startsWith('UC')) {
                        //            a.push({
                        //                name: YTMusic.#ytutils.fv(c[i], 'text', true),
                        //                browseId
                        //            })
                        //        }
                        //    }
                        //} else {
                        //    let browseId = YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId', true)
                        //    if (browseId.startsWith('UC')) {
                        //        a.push({
                        //            name: YTMusic.#ytutils.fv(c, 'text', true),
                        //            browseId
                        //        })
                        //    }
                        //}
                        //return 1 < a.length ? a : 0 < a.length ? a[0] : a
                    })(),
                    album: (function () {
                        var c = _.first(YTMusic.#ytutils.fv(flexColumn[1], 'runs', true))
                        if (!Array.isArray(c) && c instanceof Object) return {
                            name: YTMusic.#ytutils.fv(c, 'text'),
                            browseId: YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId', true)
                        }
                        return {}
                    })(),
                    duration: YTMusic.#ytutils.hms2ms(_.last(YTMusic.#ytutils.fv(flexColumn[1], 'runs:text', true))),
                    thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails', true),
                    params: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:params')
                })

            })
            return result
        },
        parseVideoSearchResult: (context) => {
            const result = {
                content: [],
                contination: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData'
                )
            }

            var sectionList = YTMusic.#ytutils.fv(
                context, 'musicResponsiveListItemRenderer'
            )
            if (!Array.isArray(sectionList)) {
                sectionList = [sectionList]
            }
            sectionList.forEach(sectionContext => {
                const flexColumn = _.concat(YTMusic.#ytutils.fv(
                    sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
                ))
                result.content.push(Object.freeze({
                    type: 'video',
                    videoId: flexColumn[0].text.runs[0].navigationEndpoint.watchEndpoint.videoId,
                    //videoId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    author: _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 0),
                    views: _.nth(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'), 2),
                    duration: YTMusic.#ytutils.hms2ms(_.last(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'))),
                    thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: YTMusic.#ytutils.fv(sectionContext, 'playNavigationEndpoint:params')
                }))
            })
            return result
        },
        parseAlbumSearchResult: (context) => {
            const result = {
                content: [],
                contination: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData'
                )
            }

            var sectionList = YTMusic.#ytutils.fv(
                context, 'musicResponsiveListItemRenderer'
            )
            if (!Array.isArray(sectionList)) {
                sectionList = [sectionList]
            }
            sectionList.forEach(sectionContext => {
                const flexColumn = _.concat(YTMusic.#ytutils.fv(
                    sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
                ))
                result.content.push(Object.freeze({
                    type: _.lowerCase(_.first(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'))),
                    browseId: YTMusic.#ytutils.fv(
                        _.at(
                            sectionContext, 'navigationEndpoint'
                        ),
                        'browseEndpoint:browseId'
                    ),
                    playlistId: YTMusic.#ytutils.fv(sectionContext, 'toggledServiceEndpoint:playlistId', true),
                    name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    artist: _.join(_.filter(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text').slice(1, -1), v => ' • ' != v && true), ''),
                    year: _.last(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text')),
                    thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                }))
            })
            return result
        },
        parseArtistSearchResult: (context) => {
            const result = {
                content: [],
                contination: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData'
                )
            }

            var sectionList = YTMusic.#ytutils.fv(
                context, 'sectionListRenderer:musicResponsiveListItemRenderer'
            )
            if (!Array.isArray(sectionList)) {
                sectionList = [sectionList]
            }
            sectionList.forEach(sectionContext => {
                const flexColumn = _.concat(YTMusic.#ytutils.fv(
                    sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
                ))
                result.content.push(Object.freeze({
                    type: _.lowerCase(_.first(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'))),
                    browseId: YTMusic.#ytutils.fv(_.at(sectionContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                    name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }))
            })
            return result
        },
        parsePlaylistSearchResult: (context) => {
            const result = {
                content: [],
                contination: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData'
                )
            }

            var sectionList = YTMusic.#ytutils.fv(
                context, 'musicResponsiveListItemRenderer'
            )
            if (!Array.isArray(sectionList)) {
                sectionList = [sectionList]
            }
            sectionList.forEach(sectionContext => {
                const flexColumn = _.concat(YTMusic.#ytutils.fv(
                    sectionContext, 'musicResponsiveListItemFlexColumnRenderer'
                ))
                result.content.push(Object.freeze({
                    type: 'playlist',
                    browseId: YTMusic.#ytutils.fv(
                        _.at(
                            sectionContext, 'navigationEndpoint'
                        ),
                        'browseEndpoint:browseId'
                    ),
                    title: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    author: _.first(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text')),
                    trackCount: _.toNumber(
                        _.nth(
                            _.words(
                                _.last(YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs:text'))
                            ),
                            0
                        )
                    ),
                    thumbnails: YTMusic.#ytutils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }))
            })
            return result
        },
        parseNextPanel: (context) => {
            const result = {
                title: '',
                playlistId: '',
                content: [],
                currentIndex: 0,
                contination: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData'
                )
            }

            const panelContext = YTMusic.#ytutils.fv(context, "playlistPanelRenderer")
            result.title = panelContext.title
            result.playlistId = panelContext.playlistId
            result.currentIndex = panelContext.currentIndex

            YTMusic.#ytutils.fv(panelContext, 'playlistPanelVideoRenderer').forEach(itemContext => {
                result.content.push({
                    index: _.nth(_.at(itemContext, 'navigationEndpoint.watchEndpoint.index'), 0),
                    selected: _.nth(_.at(itemContext, 'selected'), 0),
                    videoId: _.nth(_.at(itemContext, 'videoId'), 0),
                    playlistId: _.nth(_.at(itemContext, 'navigationEndpoint.watchEndpoint.playlistId'), 0),
                    params: _.nth(_.at(itemContext, 'navigationEndpoint.watchEndpoint.params'), 0)
                })
            })
            return result

        },
        parseAlbumPage: context => {
            const result = {
                title: context.header.musicDetailHeaderRenderer.title.runs[0].text,
                description: context.header.musicDetailHeaderRenderer.description.runs[0].text,
                year: Number(context.header.musicDetailHeaderRenderer.subtitle.runs[4].text),
                duration: Number(context.header.musicDetailHeaderRenderer.secondSubtitle.runs[2].text.split(" ")[0]) * 60,
                artist: context.header.musicDetailHeaderRenderer.subtitle.runs[2].text,
                tracks: [],
                thumbnail: context.header.musicDetailHeaderRenderer.thumbnail.croppedSquareThumbnailRenderer.thumbnail.thumbnails[0].url,
            }
            for (var e of context.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicShelfRenderer.contents) {
                result.tracks.push({
                    type: "song",
                    name: e.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
                    videoId: e.musicResponsiveListItemRenderer.playlistItemData.videoId,
                    thumbnails: [{ url: context.header.musicDetailHeaderRenderer.thumbnail.croppedSquareThumbnailRenderer.thumbnail.thumbnails[0].url }],
                    artist: [context.header.musicDetailHeaderRenderer.subtitle.runs[2].text],
                })
            }
            return result;
        },
        parsePlaylistPage: context => {
            const result = {
                title: '',
                owner: '',
                trackCount: 0,
                dateYear: '',
                content: [],
                thumbnails: [],
                continuation: YTMusic.#ytutils.fv(
                    context, 'nextContinuationData', true
                )
            }

            if (!_.has(context, 'continuationContents')) {
                const pageHeader = YTMusic.#ytutils.fv(
                    context, 'musicDetailHeaderRenderer'
                )
                result.title = YTMusic.#ytutils.fv(_.at(pageHeader, 'title'), 'runs:text')
                result.owner = _.nth(YTMusic.#ytutils.fv(_.at(pageHeader, 'subtitle'), 'runs:text'), 2)
                result.trackCount = parseInt(_.words(_.nth(YTMusic.#ytutils.fv(_.at(pageHeader, 'secondSubtitle'), 'runs:text'), 0)))
                result.dateYear = _.nth(YTMusic.#ytutils.fv(_.at(pageHeader, 'subtitle'), 'runs:text'), 4)
                result.thumbnails = YTMusic.#ytutils.fv(pageHeader, 'croppedSquareThumbnailRenderer:thumbnails')
            }

            const itemContext = YTMusic.#ytutils.fv(
                context, 'musicResponsiveListItemRenderer'
            )
            if (Array.isArray(itemContext)) {
                for (let i = 0; i < itemContext.length; i++) {
                    const flexColumn = YTMusic.#ytutils.fv(
                        itemContext[i], 'musicResponsiveListItemFlexColumnRenderer', true
                    )
                    result.content.push({
                        //videoId: YTMusic.#ytutils.fv(itemContext[i], 'playNavigationEndpoint:videoId'),
                        videoId: flexColumn[0].text.runs[0].navigationEndpoint.watchEndpoint.videoId,
                        name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                        author: (function () {
                            var a = [],
                                c = (YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs'))
                            if (Array.isArray(c)) {
                                c = _.filter(c, function (o) {
                                    return o.navigationEndpoint
                                })
                                for (var i = 0; i < c.length; i++) {
                                    a.push({
                                        name: YTMusic.#ytutils.fv(c[i], 'text'),
                                        browseId: YTMusic.#ytutils.fv(c[i], 'browseEndpoint:browseId')
                                    })
                                }
                            } else {
                                a.push({
                                    name: YTMusic.#ytutils.fv(c, 'text'),
                                    browseId: YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId')
                                })
                            }
                            return 1 < a.length ? a : 0 < a.length ? a[0] : a
                        })(),
                        duration: YTMusic.#ytutils.hms2ms(YTMusic.#ytutils.fv(itemContext[i], 'musicResponsiveListItemFixedColumnRenderer:runs:text', true)),
                        thumbnails: YTMusic.#ytutils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                    })
                }
            } else {
                const flexColumn = YTMusic.#ytutils.fv(
                    itemContext, 'musicResponsiveListItemFlexColumnRenderer', true
                )
                result.content.push({
                    videoId: YTMusic.#ytutils.fv(itemContext, 'playNavigationEndpoint:videoId'),
                    name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    author: (function () {
                        var a = [],
                            c = (YTMusic.#ytutils.fv(_.nth(flexColumn, 1), 'runs'))
                        if (Array.isArray(c)) {
                            c = _.filter(c, function (o) {
                                return o.navigationEndpoint
                            })
                            for (var i = 0; i < c.length; i++) {
                                a.push({
                                    name: YTMusic.#ytutils.fv(c[i], 'text'),
                                    browseId: YTMusic.#ytutils.fv(c[i], 'browseEndpoint:browseId')
                                })
                            }
                        } else {
                            a.push({
                                name: YTMusic.#ytutils.fv(c, 'text'),
                                browseId: YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId')
                            })
                        }
                        return 1 < a.length ? a : 0 < a.length ? a[0] : a
                    })(),
                    duration: YTMusic.#ytutils.hms2ms(YTMusic.#ytutils.fv(itemContext, 'musicResponsiveListItemFixedColumnRenderer:runs:text', true)),
                    thumbnails: YTMusic.#ytutils.fv(itemContext, 'musicThumbnailRenderer:thumbnails', true)
                })
            }
            return result
        },
        parseArtistPage: context => {
            const result = {
                name: '',
                description: '',
                views: '',
                products: {},
                thumbnails: []
            }

            const headerContext = YTMusic.#ytutils.fv(
                context, 'musicImmersiveHeaderRenderer'
            )
            result.name = YTMusic.#ytutils.fv(_.at(headerContext, 'title'), 'text')
            result.thumbnails = YTMusic.#ytutils.fv(_.at(headerContext, 'thumbnail'), 'musicThumbnailRenderer:thumbnails')

            const descriptionContext = YTMusic.#ytutils.fv(
                context, 'musicDescriptionShelfRenderer'
            )
            if (!Array.isArray(descriptionContext)) {
                result.description = YTMusic.#ytutils.fv(_.at(descriptionContext, 'description'), 'text')
                result.views = _.parseInt(
                    _.replace(
                        _.nth(
                            _.split(YTMusic.#ytutils.fv(
                                _.at(descriptionContext, 'subheader'),
                                'text'
                            ),
                                ' '
                            ),
                            0
                        ),
                        /,/g, ''
                    ))
            }

            const nextMusicNavigation = YTMusic.#ytutils.fv(context, 'musicShelfRenderer:bottomEndpoint:browseEndpoint')
            if (!Array.isArray(nextMusicNavigation)) {
                result.products.songs = {
                    content: [],
                    browseId: nextMusicNavigation.browseId,
                    params: nextMusicNavigation.params,
                }
            } else {
                result.products.songs = {
                    content: []
                }
            }
            YTMusic.#ytutils.fv(context, 'musicShelfRenderer:musicResponsiveListItemRenderer').forEach(itemContext => {
                const flexColumn = _.concat(YTMusic.#ytutils.fv(
                    itemContext, 'musicResponsiveListItemFlexColumnRenderer'
                ))
                result.products.songs.content.push({
                    name: YTMusic.#ytutils.fv(_.nth(flexColumn, 0), 'runs:text'),
                    album: (function () {
                        var c = (YTMusic.#ytutils.fv(_.nth(flexColumn, 2), 'runs'))
                        if (!Array.isArray(c) && c instanceof Object) return {
                            name: YTMusic.#ytutils.fv(c, 'text'),
                            browseId: YTMusic.#ytutils.fv(c, 'browseEndpoint:browseId')
                        }
                        return {}
                    })()
                })
            })
            YTMusic.#ytutils.fv(context, 'musicCarouselShelfRenderer').forEach(carouselContext => {
                const carouselName = _.lowerCase(YTMusic.#ytutils.fv(carouselContext, 'musicCarouselShelfBasicHeaderRenderer:title:text'))

                if (['albums', 'singles', 'videos'].includes(carouselName)) {
                    const nextCarouselNavigation = YTMusic.#ytutils.fv(carouselContext, 'musicCarouselShelfBasicHeaderRenderer:title:navigationEndpoint:browseEndpoint')
                    if (!Array.isArray(nextCarouselNavigation)) {
                        result.products[carouselName] = {
                            content: [],
                            browseId: nextCarouselNavigation.browseId,
                            params: nextCarouselNavigation.params,
                        }
                    } else {
                        result.products[carouselName] = {
                            content: []
                        }
                    }

                    const itemContext = YTMusic.#ytutils.fv(carouselContext, 'musicTwoRowItemRenderer')
                    if (Array.isArray(itemContext)) {
                        for (let i = 0; i < itemContext.length; i++) {
                            switch (carouselName) {
                                case 'singles':
                                    result.products[carouselName].content.push({
                                        type: 'single',
                                        browseId: YTMusic.#ytutils.fv(_.at(itemContext[i], 'navigationEndpoint'), 'browseEndpoint:browseId'),
                                        name: YTMusic.#ytutils.fv(_.at(itemContext[i], 'title'), 'text'),
                                        year: YTMusic.#ytutils.fv(_.at(itemContext[i], 'subtitle'), 'text'),
                                        thumbnails: YTMusic.#ytutils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                                    })
                                    break
                                case 'albums':
                                    result.products[carouselName].content.push({
                                        type: _.nth(YTMusic.#ytutils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 0),
                                        browseId: YTMusic.#ytutils.fv(_.at(itemContext[i], 'navigationEndpoint'), 'browseEndpoint:browseId'),
                                        name: YTMusic.#ytutils.fv(_.at(itemContext[i], 'title'), 'text'),
                                        year: _.nth(YTMusic.#ytutils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 2),
                                        thumbnails: YTMusic.#ytutils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                                    })
                                    break
                                case 'videos':
                                    result.products[carouselName].content.push({
                                        type: 'video',
                                        videoId: YTMusic.#ytutils.fv(_.at(itemContext[i], 'title'), 'watchEndpoint:videoId'),
                                        playlistId: YTMusic.#ytutils.fv(_.at(itemContext[i], 'title'), 'watchEndpoint:playlistId'),
                                        name: YTMusic.#ytutils.fv(_.at(itemContext[i], 'title'), 'text'),
                                        author: _.join(_.dropRight(YTMusic.#ytutils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 2), ''),
                                        views: _.nth(YTMusic.#ytutils.fv(_.at(itemContext[i], 'subtitle'), 'text'), 2),
                                        thumbnails: YTMusic.#ytutils.fv(itemContext[i], 'musicThumbnailRenderer:thumbnails')
                                    })
                                    break
                            }
                        }
                    } else if (itemContext instanceof Object) {
                        switch (carouselName) {
                            case 'singles':
                                result.products[carouselName].content.push({
                                    type: 'single',
                                    browseId: YTMusic.#ytutils.fv(_.at(itemContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                                    name: YTMusic.#ytutils.fv(_.at(itemContext, 'title'), 'text'),
                                    year: YTMusic.#ytutils.fv(_.at(itemContext, 'subtitle'), 'text'),
                                    thumbnails: YTMusic.#ytutils.fv(itemContext, 'musicThumbnailRenderer:thumbnails')
                                })
                                break
                            case 'albums':
                                result.products[carouselName].content.push({
                                    type: _.nth(YTMusic.#ytutils.fv(_.at(itemContext, 'subtitle'), 'text'), 0),
                                    browseId: YTMusic.#ytutils.fv(_.at(itemContext, 'navigationEndpoint'), 'browseEndpoint:browseId'),
                                    name: YTMusic.#ytutils.fv(_.at(itemContext, 'title'), 'text'),
                                    year: _.nth(YTMusic.#ytutils.fv(_.at(itemContext, 'subtitle'), 'text'), 2),
                                    thumbnails: YTMusic.#ytutils.fv(itemContext, 'musicThumbnailRenderer:thumbnails')
                                })
                                break
                            case 'videos':
                                result.products[carouselName].content.push({
                                    type: 'video',
                                    videoId: YTMusic.#ytutils.fv(_.at(itemContext, 'title'), 'watchEndpoint:videoId'),
                                    playlistId: YTMusic.#ytutils.fv(_.at(itemContext, 'title'), 'watchEndpoint:playlistId'),
                                    name: YTMusic.#ytutils.fv(_.at(itemContext, 'title'), 'text'),
                                    author: _.join(_.dropRight(YTMusic.#ytutils.fv(_.at(itemContext, 'subtitle'), 'text'), 2), ''),
                                    views: _.nth(YTMusic.#ytutils.fv(_.at(itemContext, 'subtitle'), 'text'), 2),
                                    thumbnails: YTMusic.#ytutils.fv(itemContext, 'musicThumbnailRenderer:thumbnails')
                                })
                                break
                        }
                    }
                }
            })
            return result
        }
    }
    static #createApiRequest(endpointName, inputVariables, inputQuery = {}) {
        var headers = {
            'x-origin': this.BASE_URL,
            /*'X-Goog-Visitor-Id': this.#ytcfg.VISITOR_DATA || "",*/
            'X-YouTube-Client-Name': this.#ytcfg.INNERTUBE_CONTEXT_CLIENT_NAME,
            'X-YouTube-Client-Version': this.#ytcfg.INNERTUBE_CLIENT_VERSION,
            'X-YouTube-Device': this.#ytcfg.DEVICE,
            'X-YouTube-Page-CL': this.#ytcfg.PAGE_CL,
            'X-YouTube-Page-Label': this.#ytcfg.PAGE_BUILD_LABEL,
            'X-YouTube-Utc-Offset': String(-new Date().getTimezoneOffset()),
            'X-YouTube-Time-Zone': new Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Content-Type': 'application/json'
        };
        return new Promise((resolve, reject) => {
            CORS.getText(this.BASE_URL + `/youtubei/${this.#ytcfg.INNERTUBE_API_VERSION}/${endpointName}?${new URLSearchParams(Object.assign({ alt: 'json', key: this.#ytcfg.INNERTUBE_API_KEY }, inputQuery)).toString()}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(Object.assign(inputVariables, YTMusic.#ytutils.createApiContext(this.#ytcfg)))
            })
                .then(res => {
                    if (JSON.parse(res).hasOwnProperty('responseContext')) {
                        resolve(JSON.parse(res));
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
    static init() {
        if (typeof CORS != 'object') {
            console.error("Please include cors.js first.");
            return;
        }
        return new Promise((resolve, reject) => {
            CORS.getText(this.BASE_URL)
                .then(res => {
                    try {
                        res.split('ytcfg.set(').map(v => {
                            try {
                                return JSON.parse(v.split(');')[0]);
                            } catch (_) { }
                        }).filter(Boolean).forEach(cfg => (this.#ytcfg = Object.assign(cfg, this.#ytcfg)))
                        resolve({
                            locale: this.#ytcfg.LOCALE,
                            logged_in: this.#ytcfg.LOGGED_IN
                        })
                    } catch (err) {
                        reject(err)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    static search(query, categoryName, _pageLimit = 1) {
        return new Promise((resolve, reject) => {
            var result = {}
            this.#createApiRequest('search', {
                query: query,
                params: YTMusic.#ytutils.getCategoryURI(categoryName)
            })
                .then(context => {
                    try {
                        switch (_.upperCase(categoryName)) {
                            case 'SONG':
                                result = YTMusic.#ytparsers.parseSongSearchResult(context)
                                break
                            case 'VIDEO':
                                result = YTMusic.#ytparsers.parseVideoSearchResult(context)
                                break
                            case 'ALBUM':
                                result = YTMusic.#ytparsers.parseAlbumSearchResult(context)
                                break
                            case 'ARTIST':
                                result = YTMusic.#ytparsers.parseArtistSearchResult(context)
                                break
                            case 'PLAYLIST':
                                result = YTMusic.#ytparsers.parsePlaylistSearchResult(context)
                                break
                            default:
                                result = YTMusic.#ytparsers.parseSearchResult(context)
                                break
                        }
                        resolve(result)
                    } catch (error) {
                        return resolve({
                            error: error.message
                        })
                    }
                })
                .catch(error => reject(error))
        })
    }
    static getNext(videoId, playlistId, paramString) {
        return new Promise((resolve, reject) => {
            this.#createApiRequest('next', {
                enablePersistentPlaylistPanel: true,
                isAudioOnly: true,
                params: paramString,
                playlistId: playlistId,
                tunerSettingValue: "AUTOMIX_SETTING_NORMAL",
                videoId: videoId
            })
                .then(context => {
                    try {
                        const result = YTMusic.#ytparsers.parseNextPanel(context)
                        resolve(result)
                    } catch (error) {
                        resolve({
                            error: error.message
                        })
                    }
                })
                .catch(error => reject(error))
        })
    }
    static getSongDetails(videoId, playlistId) {
        return new Promise((resolve, reject) => {
            this.#createApiRequest('next', {
                enablePersistentPlaylistPanel: true,
                isAudioOnly: true,
                //playlistId: playlistId,
                tunerSettingValue: "AUTOMIX_SETTING_NORMAL",
                videoId: videoId
            })
                .then(r => {
                    resolve({
                        album: {
                            name: r.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer.contents[0].playlistPanelVideoRenderer.longBylineText.runs[2].text,
                            year: parseInt(r.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer.contents[0].playlistPanelVideoRenderer.longBylineText.runs[4].text),
                        },
                        lyrics_id: r.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[1].tabRenderer.endpoint.browseEndpoint.browseId,
                        related_id: r.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[2].tabRenderer.endpoint.browseEndpoint.browseId
                    })
                })
                .catch(reject)
        })
    }
    static getLyrics(lyrics_id) {
        return new Promise((resolve, reject) => {
            this.#createApiRequest('browse', {
                browseId: lyrics_id
            }).then(r => {
                try {
                    resolve(r.contents.sectionListRenderer.contents[0].musicDescriptionShelfRenderer.description.runs[0].text);
                } catch (e) {
                    resolve("");
                }
            }).catch(reject);
        })
    }
    static getAlbum(browseId) {
        if (_.startsWith(browseId, 'MPREb')) {
            return new Promise((resolve, reject) => {
                this.#createApiRequest('browse', YTMusic.#ytutils.buildEndpointContext('ALBUM', browseId))
                    .then(context => {
                        try {
                            const result = YTMusic.#ytparsers.parseAlbumPage(context)
                            resolve(result)
                        } catch (error) {
                            return resolve({
                                error: error.message
                            })
                        }
                    })
                    .catch(error => reject(error))
            })
        } else {
            throw new Error('invalid album browse id.')
        }
    }
    static getPlaylist(browseId, contentLimit = 100) {
        if (_.startsWith(browseId, 'VL') || _.startsWith(browseId, 'PL')) {
            _.startsWith(browseId, 'PL') && (browseId = 'VL' + browseId)
            return new Promise((resolve, reject) => {
                this.#createApiRequest('browse', YTMusic.#ytutils.buildEndpointContext('PLAYLIST', browseId))
                    .then(context => {
                        try {
                            var result = YTMusic.#ytparsers.parsePlaylistPage(context)
                            const getContinuations = params => {
                                this.#createApiRequest('browse', {}, {
                                    ctoken: params.continuation,
                                    continuation: params.continuation,
                                    itct: params.continuation.clickTrackingParams
                                })
                                    .then(context => {
                                        const continuationResult = YTMusic.#ytparsers.parsePlaylistPage(context)
                                        if (Array.isArray(continuationResult.content)) {
                                            result.content = _.concat(result.content, continuationResult.content)
                                            result.continuation = continuationResult.continuation
                                        }
                                        if (!Array.isArray(continuationResult.continuation) && result.continuation instanceof Object) {
                                            if (contentLimit > result.content.length) {
                                                getContinuations(continuationResult.continuation)
                                            } else {
                                                return resolve(result)
                                            }
                                        } else {
                                            return resolve(result)
                                        }
                                    })
                            }

                            if (contentLimit > result.content.length && (!Array.isArray(result.continuation) && result.continuation instanceof Object)) {
                                getContinuations(result.continuation)
                            } else {
                                return resolve(result)
                            }
                        } catch (error) {
                            return resolve({
                                error: error.message
                            })
                        }
                    })
                    .catch(error => reject(error))
            })
        } else {
            throw new Error('invalid playlist id.')
        }
    }
    static getArtist(browseId) {
        if (_.startsWith(browseId, 'UC')) {
            return new Promise((resolve, reject) => {
                this.#createApiRequest('browse', YTMusic.#ytutils.buildEndpointContext('ARTIST', browseId))
                    .then(context => {
                        try {
                            const result = YTMusic.#ytparsers.parseArtistPage(context)
                            resolve(result)
                        } catch (error) {
                            resolve({
                                error: error.message
                            })
                        }
                    })
                    .catch(error => reject(error))
            })
        } else {
            throw new Error('invalid artist browse id.')
        }
    }
}