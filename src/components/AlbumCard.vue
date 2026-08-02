<template>
  <article class="album-card">
    <button type="button" class="album" @click="playAlbum">
      <div
        class="artwork"
        :class="{ 'artwork--placeholder': !album.cover }"
        :style="coverStyle"
      >
        <span class="play-overlay" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div class="details">
        <h3>{{ album.title }}</h3>
        <p>{{ album.artist }}</p>
        <span>{{ album.tracks.length }} {{ album.tracks.length === 1 ? 'track' : 'tracks' }}</span>
      </div>
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Track = {
  id: string;
  title: string;
  artist?: string;
  cover?: string;
  src: string;
  duration?: string;
};

type Album = {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  tracks: Track[];
};

const props = defineProps<{ album: Album }>();

const coverStyle = computed(() =>
  props.album.cover ? { backgroundImage: `url(${props.album.cover})` } : undefined,
);

const playlist = computed(() =>
  props.album.tracks.map((track) => ({
    ...track,
    artist: track.artist ?? props.album.artist,
    cover: track.cover ?? props.album.cover,
    albumId: props.album.id,
    albumTitle: props.album.title,
  })),
);

function playAlbum() {
  const track = playlist.value[0];
  if (!track) return;

  window.dispatchEvent(
    new CustomEvent('music:play', {
      detail: { track, playlist: playlist.value },
    }),
  );
}
</script>

<style scoped>
.album-card {
  flex: 0 0 clamp(220px, 25vw, 300px);
  border-radius: 12px;
  scroll-snap-align: start;
}

.album {
  width: 100%;
  padding: 1.25rem;
  border: 0;
  border-radius: inherit;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.25s ease, transform 0.25s ease;
}

.album-card:hover .album,
.album:focus-visible {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
}

.artwork {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: 7px;
  background-color: rgba(80, 78, 110, 0.6);
  background-position: center;
  background-size: cover;
}

.artwork--placeholder {
  background-image: linear-gradient(135deg, rgba(127, 90, 240, 0.7), rgba(44, 177, 188, 0.55));
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(8, 8, 14, 0.48);
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.play-overlay svg {
  width: 46px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
  transform: translateY(5px);
  transition: transform 0.2s ease;
}

.album-card:hover .play-overlay,
.album:focus-visible .play-overlay {
  opacity: 1;
}

.album-card:hover .play-overlay svg,
.album:focus-visible .play-overlay svg {
  transform: translateY(0);
}

.details {
  display: grid;
  gap: 0.35rem;
  padding-top: 1rem;
}

.details h3,
.details p {
  margin: 0;
}

.details h3 {
  font-size: 1.15rem;
}

.details p {
  color: #c7c3e5;
}

.details span {
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.82rem;
}
</style>
