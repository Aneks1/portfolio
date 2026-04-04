<template>
  <article class="music-card">
    <button type="button" class="card" @click="playTrack">
      <div class="artwork" :class="{ 'artwork--placeholder': !track.cover }" :style="coverStyle">
        <span class="play-indicator" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div class="details">
        <h4>{{ track.title }}</h4>
        <p class="artist">{{ track.artist }}</p>
      </div>
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Track = {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  src: string;
};

const props = defineProps<{ track: Track }>();

const coverStyle = computed(() => {
  if (!props.track.cover) return undefined;
  return { backgroundImage: `url(${props.track.cover})` };
});

const playTrack = () => {
  window.dispatchEvent(
    new CustomEvent('music:play', {
      detail: props.track,
    }),
  );
};
</script>

<style scoped>
.music-card {
  flex: 0 0 clamp(200px, 24vw, 280px);
  scroll-snap-align: start;
  border-radius: 10px;
  transition: transform 0.25s ease, background 0.25s ease;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  border: none;
  background: none;
  color: inherit;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: inherit;
  align-items: center;
}

.music-card:hover,
.music-card:focus-within {
  background: rgba(255, 255, 255, 0.08);
}

.artwork {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  background-color: rgba(80, 78, 110, 0.6);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.music-card:hover .artwork,
.music-card:focus-within .artwork {
  transform: translateY(-4px) scale(1.01);
}

.artwork--placeholder {
  background-image: linear-gradient(135deg, rgba(127, 90, 240, 0.6), rgba(44, 177, 188, 0.55));
}

.play-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 14, 24, 0.45);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.play-indicator svg {
  width: 42px;
  height: 42px;
  padding-left: 4px;
  color: #ffffff;
}

.music-card:hover .play-indicator,
.music-card:focus-within .play-indicator {
  opacity: 1;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  align-items: flex-start;
}

h4 {
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}

.artist {
  margin: 0;
  color: #c7c3e5;
  font-size: 0.95rem;
}
</style>
