<template>
  <section
    class="player"
    :class="{ 'player--inactive': !currentTrack, 'player--hidden': !hasScrolled }"
  >
    <Transition name="album-queue" appear>
      <aside
        v-if="currentTrack && activePlaylist.length"
        class="album-queue"
        :class="{ 'album-queue--collapsed': isQueueCollapsed }"
      >
        <button
          type="button"
          class="album-queue__toggle"
          :aria-expanded="!isQueueCollapsed"
          @click="isQueueCollapsed = !isQueueCollapsed"
        >
          <span>
            <small>Playing album</small>
            <strong>{{ currentTrack.albumTitle ?? 'Track list' }}</strong>
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" fill="currentColor" />
          </svg>
        </button>

        <div class="album-queue__body">
          <ol class="album-queue__tracks">
            <li v-for="(track, index) in activePlaylist" :key="track.id">
              <button
                type="button"
                class="album-queue__track"
                :class="{ 'album-queue__track--active': currentTrack.id === track.id }"
                @click="loadTrack(track)"
              >
                <span class="album-queue__number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="album-queue__title">{{ track.title }}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
                </svg>
              </button>
            </li>
          </ol>
        </div>
      </aside>
    </Transition>
    <div class="player__details">
      <div class="cover" v-if="currentTrack?.cover" :style="coverStyle"></div>
      <div class="meta" v-if="currentTrack">
        <span class="label">Now Playing</span>
        <h3>{{ currentTrack.title }}</h3>
        <p>{{ currentTrack.artist }}</p>
      </div>
      <div class="placeholder" v-else>
        <p>Select a track to start the session.</p>
      </div>
    </div>
    <div class="player__transport">
      <div class="controls">
        <button
          type="button"
          class="control control--icon"
          @click="playPrevious"
          :disabled="!currentTrack"
          aria-label="Play previous track"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M17 5v14l-10-7 10-7zM5 5h2v14H5z" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          class="control control--primary"
          @click="togglePlay"
          :disabled="!currentTrack"
        >
          <svg
            v-if="!isPlaying"
            class="icon icon--play"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
          </svg>
          <svg
            v-else
            class="icon icon--pause"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 5h4v14H8zM14 5h4v14h-4z" fill="currentColor" />
          </svg>
          <span class="sr-only">{{ isPlaying ? 'Pause' : 'Play' }}</span>
        </button>
        <button
          type="button"
          class="control control--icon"
          @click="playNext"
          :disabled="!canSkipNext"
          aria-label="Play next track"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 5v14l10-7-10-7zM19 5h-2v14h2z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div class="timeline">
        <span class="time">{{ formattedCurrentTime }}</span>
        <input
          class="timeline__bar"
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          :disabled="!currentTrack || !duration"
          @input="handleSeek"
        />
        <span class="time">{{ formattedDuration }}</span>
      </div>
    </div>
    <div class="player__spacer" aria-hidden="true"></div>
    <audio
      ref="audioEl"
      preload="metadata"
      @ended="handleEnded"
      @pause="isPlaying = false"
      @play="isPlaying = true"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
    ></audio>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type Track = {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  cover?: string;
  src: string;
  albumId?: string;
  albumTitle?: string;
};

const props = defineProps<{
  playlist?: Track[];
}>();

const audioEl = ref<HTMLAudioElement | null>(null);
const currentTrack = ref<Track | null>(null);
const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const progress = ref(0);
const hasScrolled = ref(false);
const isQueueCollapsed = ref(false);

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const coverStyle = computed(() => {
  if (!currentTrack.value?.cover) return undefined;
  return { backgroundImage: `url(${currentTrack.value.cover})` };
});

const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => {
  if (duration.value) {
    return formatTime(duration.value);
  }
  return currentTrack.value?.duration ?? '--:--';
});

const playlist = computed(() => props.playlist ?? []);
const activePlaylist = ref<Track[]>([]);
const playbackQueue = computed(() =>
  activePlaylist.value.length ? activePlaylist.value : playlist.value,
);

const currentIndex = computed(() => {
  if (!currentTrack.value) return -1;
  return playbackQueue.value.findIndex((item) => item.id === currentTrack.value?.id);
});

const canSkipNext = computed(() => playbackQueue.value.length > 1 && currentIndex.value !== -1);

const loadTrack = (track: Track) => {
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
  if (playPromise && typeof playPromise.then === 'function') {
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
  progress.value = rawDuration
    ? Math.min((audioEl.value.currentTime / rawDuration) * 100, 100)
    : 0;
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

const handleTrackRequest = (event: Event) => {
  const detail = (event as CustomEvent<Track | { track: Track; playlist?: Track[] }>).detail;
  if (!detail) return;
  const isAlbumRequest = 'track' in detail;
  const requestedTrack = isAlbumRequest ? detail.track : detail;
  if (isAlbumRequest && detail.playlist?.length) {
    activePlaylist.value = detail.playlist;
    isQueueCollapsed.value = false;
  } else {
    activePlaylist.value = [];
  }
  const track = requestedTrack.src
    ? requestedTrack
    : playbackQueue.value.find((item) => item.id === requestedTrack.id) ?? null;
  if (!track) return;
  loadTrack(track);
};

const handleSeek = (event: Event) => {
  if (!audioEl.value || !currentTrack.value || !duration.value) return;
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  const newTime = (clamped / 100) * duration.value;
  audioEl.value.currentTime = newTime;
  currentTime.value = newTime;
  progress.value = clamped;
};

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('music:play', handleTrackRequest as EventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('music:play', handleTrackRequest as EventListener);
  if (audioEl.value) {
    audioEl.value.pause();
  }
});

</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: grid;
  --player-side-width: min(320px, 28vw);
  grid-template-columns: var(--player-side-width) minmax(0, 1fr) var(--player-side-width);
  align-items: center;
  gap: 1.25rem 2rem;
  padding: 1rem 1.75rem;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0));
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #f2f1ff;
  width: 100%;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
}

.player::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  background-color: rgba(15, 15, 15, 0.5);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
}

.player audio {
  grid-column: 1 / -1;
}

.album-queue {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 1.75rem;
  width: min(360px, calc(100vw - 3.5rem));
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background-color: rgba(15, 15, 15, 0.5);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  isolation: isolate;
}

.album-queue-enter-active,
.album-queue-leave-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.album-queue-enter-from,
.album-queue-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.97);
}

.album-queue::after {
  content: "";
  position: absolute;
  bottom: -7px;
  left: 34px;
  width: 14px;
  height: 14px;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 15, 15, 0.72);
  transform: rotate(45deg);
}

.album-queue__toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.4rem 1.2rem;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.album-queue__toggle span {
  display: grid;
  gap: 0.4rem;
}

.album-queue__toggle small {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.album-queue__toggle strong {
  overflow: hidden;
  font-size: 1.05rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album-queue__toggle svg {
  flex: 0 0 auto;
  width: 20px;
  transition: transform 0.2s ease;
}

.album-queue--collapsed .album-queue__toggle svg {
  transform: rotate(180deg);
}

.album-queue__body {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: grid-template-rows 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
}

.album-queue--collapsed .album-queue__body {
  grid-template-rows: 0fr;
  opacity: 0;
}

.album-queue__tracks {
  display: grid;
  min-height: 0;
  overflow: hidden;
  gap: 0.25rem;
  margin: 0;
  padding: 0 0.8rem 0.9rem;
  list-style: none;
}

.album-queue__track {
  display: grid;
  width: 100%;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.72rem 0.75rem;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  text-align: left;
  transition: background 0.18s ease, color 0.18s ease;
}

.album-queue__track:hover,
.album-queue__track:focus-visible,
.album-queue__track--active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.album-queue__track--active {
  color: var(--main-color-2);
}

.album-queue__number {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}

.album-queue__title {
  overflow: hidden;
  font-size: 0.86rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album-queue__track svg {
  width: 15px;
}

.player--hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(24px);
  pointer-events: none;
}

.player__details {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  min-width: 0;
}

.player__transport {
  display: grid;
  gap: 0.75rem;
}

.player__spacer {
  min-height: 1px;
}

.cover {
  width: 72px;
  aspect-ratio: 1;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: rgba(60, 56, 94, 0.8);
}

.meta {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
}

.label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.65rem;
  color: #9f99c5;
}

h3 {
  margin: 0;
  font-size: 1.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p {
  margin: 0;
  color: #cbc7e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder {
  color: #a9a5cc;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.control:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.control:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.control--icon {
  width: 44px;
  height: 44px;
  font-size: 0.9rem;
}

.control--primary {
  width: 56px;
  height: 56px;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #7f5af0, #2cb1bc);
  color: #0f0f14;
  box-shadow: 0 14px 24px rgba(78, 59, 160, 0.35);
}

.icon {
  width: 18px;
  height: 18px;
  display: block;
}

.icon--play,
.icon--pause {
  width: 20px;
  height: 20px;
}

.control--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #9470ff, #36c4cf);
}

.timeline {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  color: #bbb6dc;
}

.timeline__bar {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  outline: none;
  cursor: pointer;
}

.timeline__bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #7f5af0;
  box-shadow: 0 0 0 2px rgba(19, 21, 34, 0.92);
}

.timeline__bar::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: #7f5af0;
  box-shadow: 0 0 0 2px rgba(19, 21, 34, 0.92);
}

.timeline__bar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.time {
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .player {
    grid-template-columns: 1fr;
    padding: 0.85rem 1.25rem;
    gap: 1rem;
  }

  .player__details {
    justify-content: space-between;
  }

  .album-queue {
    left: 1rem;
    width: min(360px, calc(100vw - 2rem));
  }

  .player__spacer {
    display: none;
  }

  .meta {
    flex: 1;
  }

  h3 {
    font-size: 1rem;
  }

  .control--icon {
    width: 40px;
    height: 40px;
  }

  .control--primary {
    width: 52px;
    height: 52px;
  }
}
</style>
