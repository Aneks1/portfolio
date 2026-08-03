import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, m as maybeRenderHead, n as renderComponent, o as renderScript, s as spreadAttributes, u as unescapeHTML } from '../chunks/astro/server_HOFtHqr8.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                 */
import { defineComponent, useSSRContext, ref, computed, onMounted, onBeforeUnmount, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
export { renderers } from '../renderers.mjs';

const $$Astro$5 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Gonzalo Ames | Composer & Music Producer",
    description = "Original music for games, visual media, and imagined worlds by Peruvian composer Gonzalo Ames."
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}><title>${title}</title>${renderHead()}</head> <body> <div class="noise"></div> <div class="wrapper"> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "D:/GitHub/portfolio/src/layouts/Layout.astro", void 0);

const logo = new Proxy({"src":"/_astro/logo.CmURsUol.png","width":300,"height":300,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "D:/GitHub/portfolio/src/assets/logo.png";
							}
							
							return target[name];
						}
					});

const $$Astro$4 = createAstro();
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Navbar;
  const { links = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="navbar" data-astro-cid-5blmo7yk> <div class="brand" data-astro-cid-5blmo7yk> <img${addAttribute(logo.src, "src")} alt="Site logo" class="brand-logo" loading="lazy" data-astro-cid-5blmo7yk> </div> <ul class="nav-links" data-astro-cid-5blmo7yk> ${links.map((link) => renderTemplate`<li data-astro-cid-5blmo7yk><a${addAttribute(link.href, "href")} data-astro-cid-5blmo7yk>${link.label}</a></li>`)} </ul> </nav> `;
}, "D:/GitHub/portfolio/src/components/Navbar.astro", void 0);

const $$Astro$3 = createAstro();
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Hero;
  const { links = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="hero" id="home" data-astro-cid-bbe6dxrz> ${renderComponent($$result, "Navbar", $$Navbar, { "links": links, "data-astro-cid-bbe6dxrz": true })} <div class="hero-inner" data-astro-cid-bbe6dxrz> <h1 class="hero-title" data-astro-cid-bbe6dxrz> <span data-astro-cid-bbe6dxrz>Yo!</span> <span class="hero-title-small" data-astro-cid-bbe6dxrz>I am</span> <span data-astro-cid-bbe6dxrz>Gonzalo Ames,</span> <span class="hero-title-small" data-astro-cid-bbe6dxrz>aka </span> <span class="aka" aria-label="Aneks" data-astro-cid-bbe6dxrz>Aneks</span> </h1> <p class="hero-subtitle" data-astro-cid-bbe6dxrz>
A composer creating original music for games, stories, and imagined worlds.
</p> <div class="hero-cta" data-astro-cid-bbe6dxrz> <a class="cta main" href="#music" data-astro-cid-bbe6dxrz> <span class="cta-label" data-astro-cid-bbe6dxrz>Listen to my music</span> </a> <a class="cta ghost" href="#contact" data-astro-cid-bbe6dxrz>Contact me</a> </div> </div> </section> `;
}, "D:/GitHub/portfolio/src/components/Hero.astro", void 0);

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MusicPlayer",
  props: {
    playlist: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const audioEl = ref(null);
    const currentTrack = ref(null);
    const isPlaying = ref(false);
    const duration = ref(0);
    const currentTime = ref(0);
    const progress = ref(0);
    const hasScrolled = ref(false);
    const isQueueCollapsed = ref(false);
    function formatTime(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
      const wholeSeconds = Math.floor(seconds);
      const minutes = Math.floor(wholeSeconds / 60);
      const remainingSeconds = wholeSeconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    const coverStyle = computed(() => {
      if (!currentTrack.value?.cover) return void 0;
      return { backgroundImage: `url(${currentTrack.value.cover})` };
    });
    const formattedCurrentTime = computed(() => formatTime(currentTime.value));
    const formattedDuration = computed(() => {
      if (duration.value) {
        return formatTime(duration.value);
      }
      return currentTrack.value?.duration ?? "--:--";
    });
    const playlist = computed(() => props.playlist ?? []);
    const activePlaylist = ref([]);
    const playbackQueue = computed(
      () => activePlaylist.value.length ? activePlaylist.value : playlist.value
    );
    const currentIndex = computed(() => {
      if (!currentTrack.value) return -1;
      return playbackQueue.value.findIndex((item) => item.id === currentTrack.value?.id);
    });
    const canSkipNext = computed(() => playbackQueue.value.length > 1 && currentIndex.value !== -1);
    const loadTrack = (track) => {
      if (!audioEl.value) return;
      if (!track.src) return;
      const hasChanged = currentTrack.value?.id !== track.id;
      currentTrack.value = track;
      duration.value = 0;
      currentTime.value = 0;
      progress.value = 0;
      if (hasChanged) {
        audioEl.value.src = track.src;
      }
      const playPromise = audioEl.value.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          isPlaying.value = false;
        });
      }
    };
    const togglePlay = () => {
      if (!audioEl.value || !currentTrack.value) return;
      if (audioEl.value.paused) {
        audioEl.value.play();
      } else {
        audioEl.value.pause();
      }
    };
    const playNext = () => {
      if (!playbackQueue.value.length) return;
      if (!currentTrack.value) {
        loadTrack(playbackQueue.value[0]);
        return;
      }
      const index = currentIndex.value;
      if (index === -1) return;
      const nextIndex = (index + 1) % playbackQueue.value.length;
      if (playbackQueue.value[nextIndex]) {
        loadTrack(playbackQueue.value[nextIndex]);
      }
    };
    const playPrevious = () => {
      if (!audioEl.value || !currentTrack.value) return;
      const hasPlaylist = playbackQueue.value.length > 0 && currentIndex.value !== -1;
      if (audioEl.value.currentTime > 3 || !hasPlaylist) {
        audioEl.value.currentTime = 0;
        currentTime.value = 0;
        progress.value = 0;
        return;
      }
      const prevIndex = (currentIndex.value - 1 + playbackQueue.value.length) % playbackQueue.value.length;
      const previousTrack = playbackQueue.value[prevIndex];
      if (previousTrack) {
        loadTrack(previousTrack);
      }
    };
    const handleTimeUpdate = () => {
      if (!audioEl.value) return;
      const rawDuration = Number.isFinite(audioEl.value.duration) ? audioEl.value.duration : 0;
      if (rawDuration && rawDuration !== duration.value) {
        duration.value = rawDuration;
      }
      currentTime.value = audioEl.value.currentTime;
      progress.value = rawDuration ? Math.min(audioEl.value.currentTime / rawDuration * 100, 100) : 0;
    };
    const handleLoadedMetadata = () => {
      if (!audioEl.value) return;
      const rawDuration = Number.isFinite(audioEl.value.duration) ? audioEl.value.duration : 0;
      if (rawDuration) {
        duration.value = rawDuration;
      }
    };
    const handleEnded = () => {
      isPlaying.value = false;
      playNext();
    };
    const handleTrackRequest = (event) => {
      const detail = event.detail;
      if (!detail) return;
      const isAlbumRequest = "track" in detail;
      const requestedTrack = isAlbumRequest ? detail.track : detail;
      if (isAlbumRequest && detail.playlist?.length) {
        activePlaylist.value = detail.playlist;
        isQueueCollapsed.value = false;
      } else {
        activePlaylist.value = [];
      }
      const track = requestedTrack.src ? requestedTrack : playbackQueue.value.find((item) => item.id === requestedTrack.id) ?? null;
      if (!track) return;
      loadTrack(track);
    };
    const handleSeek = (event) => {
      if (!audioEl.value || !currentTrack.value || !duration.value) return;
      const target = event.target;
      const value = Number(target.value);
      const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
      const newTime = clamped / 100 * duration.value;
      audioEl.value.currentTime = newTime;
      currentTime.value = newTime;
      progress.value = clamped;
    };
    const handleScroll = () => {
      hasScrolled.value = window.scrollY > 0;
    };
    onMounted(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("music:play", handleTrackRequest);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("music:play", handleTrackRequest);
      if (audioEl.value) {
        audioEl.value.pause();
      }
    });
    const __returned__ = { props, audioEl, currentTrack, isPlaying, duration, currentTime, progress, hasScrolled, isQueueCollapsed, formatTime, coverStyle, formattedCurrentTime, formattedDuration, playlist, activePlaylist, playbackQueue, currentIndex, canSkipNext, loadTrack, togglePlay, playNext, playPrevious, handleTimeUpdate, handleLoadedMetadata, handleEnded, handleTrackRequest, handleSeek, handleScroll };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    class: ["player", { "player--inactive": !$setup.currentTrack, "player--hidden": !$setup.hasScrolled }]
  }, _attrs))} data-v-6aaabaf3><template>`);
  if ($setup.currentTrack && $setup.activePlaylist.length) {
    _push(`<aside class="${ssrRenderClass([{ "album-queue--collapsed": $setup.isQueueCollapsed }, "album-queue"])}" data-v-6aaabaf3><button type="button" class="album-queue__toggle"${ssrRenderAttr("aria-expanded", !$setup.isQueueCollapsed)} data-v-6aaabaf3><span data-v-6aaabaf3><small data-v-6aaabaf3>Playing album</small><strong data-v-6aaabaf3>${ssrInterpolate($setup.currentTrack.albumTitle ?? "Track list")}</strong></span><svg viewBox="0 0 24 24" aria-hidden="true" data-v-6aaabaf3><path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" fill="currentColor" data-v-6aaabaf3></path></svg></button><div class="album-queue__body" data-v-6aaabaf3><ol class="album-queue__tracks" data-v-6aaabaf3><!--[-->`);
    ssrRenderList($setup.activePlaylist, (track, index) => {
      _push(`<li data-v-6aaabaf3><button type="button" class="${ssrRenderClass([{ "album-queue__track--active": $setup.currentTrack.id === track.id }, "album-queue__track"])}" data-v-6aaabaf3><span class="album-queue__number" data-v-6aaabaf3>${ssrInterpolate(String(index + 1).padStart(2, "0"))}</span><span class="album-queue__title" data-v-6aaabaf3>${ssrInterpolate(track.title)}</span><svg viewBox="0 0 24 24" aria-hidden="true" data-v-6aaabaf3><path d="M8 5v14l11-7-11-7z" fill="currentColor" data-v-6aaabaf3></path></svg></button></li>`);
    });
    _push(`<!--]--></ol></div></aside>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</template><div class="player__details" data-v-6aaabaf3>`);
  if ($setup.currentTrack?.cover) {
    _push(`<div class="cover" style="${ssrRenderStyle($setup.coverStyle)}" data-v-6aaabaf3></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($setup.currentTrack) {
    _push(`<div class="meta" data-v-6aaabaf3><span class="label" data-v-6aaabaf3>Now Playing</span><h3 data-v-6aaabaf3>${ssrInterpolate($setup.currentTrack.title)}</h3><p data-v-6aaabaf3>${ssrInterpolate($setup.currentTrack.artist)}</p></div>`);
  } else {
    _push(`<div class="placeholder" data-v-6aaabaf3><p data-v-6aaabaf3>Select a track to start the session.</p></div>`);
  }
  _push(`</div><div class="player__transport" data-v-6aaabaf3><div class="controls" data-v-6aaabaf3><button type="button" class="control control--icon"${ssrIncludeBooleanAttr(!$setup.currentTrack) ? " disabled" : ""} aria-label="Play previous track" data-v-6aaabaf3><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-v-6aaabaf3><path d="M17 5v14l-10-7 10-7zM5 5h2v14H5z" fill="currentColor" data-v-6aaabaf3></path></svg></button><button type="button" class="control control--primary"${ssrIncludeBooleanAttr(!$setup.currentTrack) ? " disabled" : ""} data-v-6aaabaf3>`);
  if (!$setup.isPlaying) {
    _push(`<svg class="icon icon--play" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-v-6aaabaf3><path d="M8 5v14l11-7-11-7z" fill="currentColor" data-v-6aaabaf3></path></svg>`);
  } else {
    _push(`<svg class="icon icon--pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-v-6aaabaf3><path d="M8 5h4v14H8zM14 5h4v14h-4z" fill="currentColor" data-v-6aaabaf3></path></svg>`);
  }
  _push(`<span class="sr-only" data-v-6aaabaf3>${ssrInterpolate($setup.isPlaying ? "Pause" : "Play")}</span></button><button type="button" class="control control--icon"${ssrIncludeBooleanAttr(!$setup.canSkipNext) ? " disabled" : ""} aria-label="Play next track" data-v-6aaabaf3><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-v-6aaabaf3><path d="M7 5v14l10-7-10-7zM19 5h-2v14h2z" fill="currentColor" data-v-6aaabaf3></path></svg></button></div><div class="timeline" data-v-6aaabaf3><span class="time" data-v-6aaabaf3>${ssrInterpolate($setup.formattedCurrentTime)}</span><input class="timeline__bar" type="range" min="0" max="100" step="0.1"${ssrRenderAttr("value", $setup.progress)}${ssrIncludeBooleanAttr(!$setup.currentTrack || !$setup.duration) ? " disabled" : ""} data-v-6aaabaf3><span class="time" data-v-6aaabaf3>${ssrInterpolate($setup.formattedDuration)}</span></div></div><div class="player__spacer" aria-hidden="true" data-v-6aaabaf3></div><audio preload="metadata" data-v-6aaabaf3></audio></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/MusicPlayer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MusicPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-6aaabaf3"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AlbumCard",
  props: {
    album: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const coverStyle = computed(
      () => props.album.cover ? { backgroundImage: `url(${props.album.cover})` } : void 0
    );
    const playlist = computed(
      () => props.album.tracks.map((track) => ({
        ...track,
        artist: track.artist ?? props.album.artist,
        cover: track.cover ?? props.album.cover,
        albumId: props.album.id,
        albumTitle: props.album.title
      }))
    );
    function playAlbum() {
      const track = playlist.value[0];
      if (!track) return;
      window.dispatchEvent(
        new CustomEvent("music:play", {
          detail: { track, playlist: playlist.value }
        })
      );
    }
    const __returned__ = { props, coverStyle, playlist, playAlbum };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<article${ssrRenderAttrs(mergeProps({ class: "album-card" }, _attrs))} data-v-0245e572><button type="button" class="album" data-v-0245e572><div class="${ssrRenderClass([{ "artwork--placeholder": !$props.album.cover }, "artwork"])}" style="${ssrRenderStyle($setup.coverStyle)}" data-v-0245e572><span class="play-overlay" aria-hidden="true" data-v-0245e572><svg viewBox="0 0 24 24" focusable="false" data-v-0245e572><path d="M8 5v14l11-7-11-7z" fill="currentColor" data-v-0245e572></path></svg></span></div><div class="details" data-v-0245e572><h3 data-v-0245e572>${ssrInterpolate($props.album.title)}</h3><p data-v-0245e572>${ssrInterpolate($props.album.artist)}</p><span data-v-0245e572>${ssrInterpolate($props.album.tracks.length)} ${ssrInterpolate($props.album.tracks.length === 1 ? "track" : "tracks")}</span></div></button></article>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/AlbumCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AlbumCard = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0245e572"]]);

const $$Astro$2 = createAstro();
const $$MusicSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MusicSection;
  const {
    title = "Music",
    description = "",
    albums = []
  } = Astro2.props;
  const tracks = albums.flatMap(
    (album) => album.tracks.map((track) => ({
      ...track,
      artist: track.artist ?? album.artist,
      cover: track.cover ?? album.cover,
      albumId: album.id,
      albumTitle: album.title
    }))
  );
  return renderTemplate`${maybeRenderHead()}<section class="section" id="music" data-astro-cid-c2fdjekn> <div class="section-header" data-astro-cid-c2fdjekn> <h2 data-astro-cid-c2fdjekn>${title}</h2> ${description && renderTemplate`<p data-astro-cid-c2fdjekn>${description}</p>`} </div> <div class="music-carousel" data-carousel data-astro-cid-c2fdjekn> <button type="button" class="music-carousel__nav" aria-label="Scroll to previous tracks" data-carousel-prev disabled data-astro-cid-c2fdjekn> <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-astro-cid-c2fdjekn> <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" data-astro-cid-c2fdjekn></path> </svg> </button> <div class="music-carousel__viewport" data-carousel-viewport data-astro-cid-c2fdjekn> ${albums.map((album) => renderTemplate`${renderComponent($$result, "AlbumCard", AlbumCard, { "client:load": true, "album": album, "client:component-hydration": "load", "client:component-path": "D:/GitHub/portfolio/src/components/AlbumCard.vue", "client:component-export": "default", "data-astro-cid-c2fdjekn": true })}`)} </div> <button type="button" class="music-carousel__nav" aria-label="Scroll to next tracks" data-carousel-next data-astro-cid-c2fdjekn> <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-astro-cid-c2fdjekn> <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor" data-astro-cid-c2fdjekn></path> </svg> </button> </div> ${renderComponent($$result, "MusicPlayer", MusicPlayer, { "client:load": true, "playlist": tracks, "client:component-hydration": "load", "client:component-path": "D:/GitHub/portfolio/src/components/MusicPlayer.vue", "client:component-export": "default", "data-astro-cid-c2fdjekn": true })} </section>  ${renderScript($$result, "D:/GitHub/portfolio/src/components/MusicSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/GitHub/portfolio/src/components/MusicSection.astro", void 0);

function createSvgComponent({ meta, attributes, children }) {
  const Component = createComponent((_, props) => {
    const normalizedProps = normalizeProps(attributes, props);
    return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
  });
  Object.defineProperty(Component, "toJSON", {
    value: () => meta,
    enumerable: false
  });
  return Object.assign(Component, meta);
}
const ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
const DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}

const checkIcon = createSvgComponent({"meta":{"src":"/_astro/check2-circle.Dvwnt0zm.svg","width":16,"height":16,"format":"svg"},"attributes":{"width":"16","height":"16","fill":"currentColor","class":"bi bi-check2-circle","viewBox":"0 0 16 16"},"children":"\n  <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0\" />\n  <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z\" />\n"});

const $$Astro$1 = createAstro();
const $$ServicesSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ServicesSection;
  const {
    title = "Services",
    description = "",
    services = []
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="section" id="services" data-astro-cid-satlbe6z> <div class="section-header" data-astro-cid-satlbe6z> <h2 data-astro-cid-satlbe6z>${title}</h2> ${description && renderTemplate`<p data-astro-cid-satlbe6z>${description}</p>`} </div> <div class="services-grid" data-astro-cid-satlbe6z> ${services.map((service) => renderTemplate`<article class="service-card" data-astro-cid-satlbe6z> <h3 data-astro-cid-satlbe6z>${service.title}</h3> <p data-astro-cid-satlbe6z>${service.description}</p> ${service.features && renderTemplate`<ul class="service-features" data-astro-cid-satlbe6z> ${service.features.map((feature) => renderTemplate`<li data-astro-cid-satlbe6z> <span class="check-icon"${addAttribute(`--check-icon: url("${checkIcon.src}")`, "style")} aria-hidden="true" data-astro-cid-satlbe6z></span> <span data-astro-cid-satlbe6z>${feature}</span> </li>`)} </ul>`} <div class="service-footer" data-astro-cid-satlbe6z> <a class="service-action" href="#contact" data-astro-cid-satlbe6z>${service.action}</a> <div${addAttribute({
    "service-pricing": true,
    "has-starting-price": Boolean(service.priceLabel)
  }, "class:list")} data-astro-cid-satlbe6z> <strong${addAttribute({ "custom-quote": service.price === "Custom quote" }, "class:list")} data-astro-cid-satlbe6z> ${service.price} </strong> </div> </div> </article>`)} </div> </section> `;
}, "D:/GitHub/portfolio/src/components/ServicesSection.astro", void 0);

const $$ContactSection = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="contact-section" id="contact" data-astro-cid-jjagjrbk> <div class="contact-card" data-astro-cid-jjagjrbk> <div class="contact-heading" data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Have something in mind?</span> <h2 data-astro-cid-jjagjrbk>Contact Me</h2> <p data-astro-cid-jjagjrbk>Tell me a little about what you are creating and the kind of music or audio you need.</p> </div> <form class="contact-form" data-contact-form data-astro-cid-jjagjrbk> <div class="form-grid" data-astro-cid-jjagjrbk> <label data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Name</span> <input type="text" name="name" autocomplete="name" maxlength="80" required data-astro-cid-jjagjrbk> </label> <label data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Email / Discord</span> <input type="text" name="contact" maxlength="120" placeholder="Email address or Discord username" required data-astro-cid-jjagjrbk> </label> <label data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Project name</span> <input type="text" name="projectName" maxlength="100" required data-astro-cid-jjagjrbk> </label> <label data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Service</span> <select name="service" required data-astro-cid-jjagjrbk> <option value="" selected disabled data-astro-cid-jjagjrbk>Select a service</option> <option data-astro-cid-jjagjrbk>Ambient Textures & Loops</option> <option data-astro-cid-jjagjrbk>Original Music Composition</option> <option data-astro-cid-jjagjrbk>Full Game Audio</option> <option data-astro-cid-jjagjrbk>Custom Audio Solution</option> </select> </label> <label data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Budget</span> <input type="text" name="budget" maxlength="80" placeholder="Optional" data-astro-cid-jjagjrbk> </label> <label data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Desired timeline</span> <input type="text" name="timeline" maxlength="100" placeholder="Optional" data-astro-cid-jjagjrbk> </label> </div> <label class="message-field" data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Tell me about your game</span> <textarea name="message" rows="6" maxlength="1800" required data-astro-cid-jjagjrbk></textarea> </label> <label class="website-field" aria-hidden="true" data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Website</span> <input type="text" name="website" tabindex="-1" autocomplete="off" data-astro-cid-jjagjrbk> </label> <div class="form-footer" data-astro-cid-jjagjrbk> <p class="form-status" data-form-status aria-live="polite" data-astro-cid-jjagjrbk></p> <button type="submit" data-submit-button data-astro-cid-jjagjrbk> <span data-astro-cid-jjagjrbk>Submit</span> </button> </div> </form> </div> </section> ${renderScript($$result, "D:/GitHub/portfolio/src/components/ContactSection.astro?astro&type=script&index=0&lang.ts")} `;
}, "D:/GitHub/portfolio/src/components/ContactSection.astro", void 0);

const $$Astro = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Footer;
  const { copyright, links = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<footer class="footer" data-astro-cid-sz7xmlte> <span data-astro-cid-sz7xmlte>${copyright}</span> ${links.length > 0 && renderTemplate`<ul class="footer-links" data-astro-cid-sz7xmlte> ${links.map((link) => renderTemplate`<li data-astro-cid-sz7xmlte><a${addAttribute(link.href, "href")} data-astro-cid-sz7xmlte>${link.label}</a></li>`)} </ul>`} </footer> `;
}, "D:/GitHub/portfolio/src/components/Footer.astro", void 0);

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Music", href: "#music" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" }
];
const serviceList = [
  {
    title: "Ambient Textures & Loops",
    priceLabel: "Starting at",
    price: "$30",
    description: "Immersive environmental audio for menus, interiors, dream sequences, horror environments, exploration, and subtle background ambience.",
    features: [
      "One original ambient texture or atmospheric loop",
      "Up to 30 seconds",
      "Seamless looping",
      "Mixing & mastering",
      "Commercial-use license for one project",
      "One revision"
    ],
    action: "Request Ambient Audio"
  },
  {
    title: "Original Music Composition",
    priceLabel: "Starting at",
    price: "$60",
    description: "A fully original composition written around your game’s emotion, gameplay, and artistic direction—never templates or stock music.",
    features: [
      "One original composition",
      "Up to 90 seconds",
      "Custom instrumentation",
      "Professional arrangement",
      "Loop-ready version when needed",
      "Mixing & mastering",
      "Commercial-use license for one project",
      "Two revisions"
    ],
    action: "Commission a Track"
  },
  {
    title: "Full Game Audio",
    priceLabel: "",
    price: "Custom quote",
    description: "A complete musical direction and cohesive soundtrack designed to evolve with your world, gameplay, and story.",
    features: [
      "Original soundtrack tailored to your game",
      "As many tracks as the game requires",
      "Shared themes and recurring motifs",
      "Consistent artistic direction",
      "Loop-ready exports",
      "Mixing & mastering",
      "Commercial-use license",
      "Ongoing collaboration throughout development",
      "Multiple revisions during production"
    ],
    action: "Build My Soundtrack"
  },
  {
    title: "Custom Audio Solution",
    priceLabel: "",
    price: "Custom quote",
    description: "A tailored solution for adaptive music, implementation support, custom collections, unusual scopes, or specific budgets.",
    features: [
      "Original compositions and ambient textures",
      "Music packs, stems, and alternate versions",
      "Adaptive music",
      "Audio consulting",
      "Long-term collaboration"
    ],
    action: "Let's Talk"
  }
];
const musicAlbums = [
  {
    id: "fantasy-ost",
    title: "Fantasy OST",
    artist: "Gonzalo Ames",
    cover: "/music/cafe.png",
    description: "Themes and scenes from a colorful fantasy world.",
    tracks: [
      {
        id: "cafe-ost",
        title: "Café",
        artist: "Gonzalo Ames",
        src: "/music/cafe.mp3"
      },
      {
        id: "arcade",
        title: "Arcade",
        artist: "Gonzalo Ames",
        src: "/music/arcade.mp3"
      },
      {
        id: "boss-sample",
        title: "Boss Cutscene",
        artist: "Gonzalo Ames",
        src: "/music/boss-sample.mp3"
      }
    ]
  },
  {
    id: "experiments",
    title: "Experiments",
    artist: "Gonzalo Ames",
    cover: "/music/arcade.png",
    description: "Standalone sketches exploring different moods and genres.",
    tracks: [
      {
        id: "fantasy-song",
        title: "Fantasy Song Experiment",
        artist: "Gonzalo Ames",
        src: "/music/fantasy-song.mp3"
      },
      {
        id: "futuristic-shooter",
        title: "Futuristic Shooter OST",
        artist: "Gonzalo Ames",
        src: "/music/futuristic-shooter.mp3"
      }
    ]
  }
];

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="page" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Hero", $$Hero, { "links": navLinks, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "MusicSection", $$MusicSection, { "title": "Selected Music", "description": "Original themes, cinematic cues, and experiments written for games and imagined worlds. Select an album to listen.", "albums": musicAlbums, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "ServicesSection", $$ServicesSection, { "title": "Services", "description": "Flexible music and audio packages shaped around the needs of your game.", "services": serviceList, "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "ContactSection", $$ContactSection, { "data-astro-cid-j7pv25f6": true })} </main> ${renderComponent($$result2, "Footer", $$Footer, { "copyright": `\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Gonzalo Ames`, "data-astro-cid-j7pv25f6": true })} ` })} `;
}, "D:/GitHub/portfolio/src/pages/index.astro", void 0);

const $$file = "D:/GitHub/portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
