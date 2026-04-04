<template>
  <section
    class="player"
    :class="{ 'player--inactive': !currentTrack, 'player--hidden': !hasScrolled }"
  >
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

const currentIndex = computed(() => {
  if (!currentTrack.value) return -1;
  return playlist.value.findIndex((item) => item.id === currentTrack.value?.id);
});

const canSkipNext = computed(() => playlist.value.length > 1 && currentIndex.value !== -1);

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
  if (!playlist.value.length) return;
  if (!currentTrack.value) {
    loadTrack(playlist.value[0]);
    return;
  }
  const index = currentIndex.value;
  if (index === -1) return;
  const nextIndex = (index + 1) % playlist.value.length;
  if (playlist.value[nextIndex]) {
    loadTrack(playlist.value[nextIndex]);
  }
};

const playPrevious = () => {
  if (!audioEl.value || !currentTrack.value) return;
  const hasPlaylist = playlist.value.length > 0 && currentIndex.value !== -1;
  if (audioEl.value.currentTime > 3 || !hasPlaylist) {
    audioEl.value.currentTime = 0;
    currentTime.value = 0;
    progress.value = 0;
    return;
  }
  const prevIndex = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length;
  const previousTrack = playlist.value[prevIndex];
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
  const detail = (event as CustomEvent<Track>).detail;
  if (!detail) return;
  const track = detail.src
    ? detail
    : playlist.value.find((item) => item.id === detail.id) ?? null;
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
  background: rgba(15, 15, 15, 0.5);
  backdrop-filter: blur(30px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #f2f1ff;
  width: 100%;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
}

.player audio {
  grid-column: 1 / -1;
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
