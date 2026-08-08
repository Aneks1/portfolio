/**
 * Serializable shapes shared by the local catalog, UI, and a future API.
 * `src` and `cover` accept local paths today and absolute cloud URLs later.
 */
export interface TrackData {
  id: string;
  title: string;
  src: string;
  artist?: string;
  cover?: string;
  duration?: string;
}

export interface AlbumData {
  id: string;
  title: string;
  artist: string;
  tracks: TrackData[];
  cover?: string;
  description?: string;
  year?: number;
}

export class MusicTrack {
  readonly id: string;
  readonly title: string;
  readonly src: string;
  readonly artist?: string;
  readonly cover?: string;
  readonly duration?: string;

  constructor(data: TrackData) {
    this.id = data.id;
    this.title = data.title;
    this.src = data.src;
    this.artist = data.artist;
    this.cover = data.cover;
    this.duration = data.duration;

    if (!this.id || !this.title || !this.src) {
      throw new Error('Every music track requires an id, title, and src.');
    }
  }

  toJSON(): TrackData {
    return {
      id: this.id,
      title: this.title,
      src: this.src,
      ...(this.artist && { artist: this.artist }),
      ...(this.cover && { cover: this.cover }),
      ...(this.duration && { duration: this.duration }),
    };
  }
}

export class MusicAlbum {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly cover?: string;
  readonly description?: string;
  readonly year?: number;
  readonly tracks: readonly MusicTrack[];

  constructor(data: Omit<AlbumData, 'tracks'> & { tracks: Array<MusicTrack | TrackData> }) {
    this.id = data.id;
    this.title = data.title;
    this.artist = data.artist;
    this.cover = data.cover;
    this.description = data.description;
    this.year = data.year;
    this.tracks = Object.freeze(
      data.tracks.map((track) =>
        track instanceof MusicTrack ? track : new MusicTrack(track),
      ),
    );

    if (!this.id || !this.title || !this.artist) {
      throw new Error('Every music album requires an id, title, and artist.');
    }

    if (!this.tracks.length) {
      throw new Error(`The album "${this.title}" must contain at least one track.`);
    }
  }

  get firstTrack(): MusicTrack {
    return this.tracks[0];
  }

  toJSON(): AlbumData {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      tracks: this.tracks.map((track) => track.toJSON()),
      ...(this.cover && { cover: this.cover }),
      ...(this.description && { description: this.description }),
      ...(this.year && { year: this.year }),
    };
  }
}

export class MusicCatalog {
  readonly albums: readonly MusicAlbum[];

  constructor(albums: Array<MusicAlbum | AlbumData>) {
    this.albums = Object.freeze(
      albums.map((album) =>
        album instanceof MusicAlbum ? album : new MusicAlbum(album),
      ),
    );

    const albumIds = new Set<string>();
    const trackIds = new Set<string>();

    for (const album of this.albums) {
      if (albumIds.has(album.id)) throw new Error(`Duplicate album id: ${album.id}`);
      albumIds.add(album.id);

      for (const track of album.tracks) {
        if (trackIds.has(track.id)) throw new Error(`Duplicate track id: ${track.id}`);
        trackIds.add(track.id);
      }
    }
  }

  getAlbum(id: string): MusicAlbum | undefined {
    return this.albums.find((album) => album.id === id);
  }

  getTrack(id: string): MusicTrack | undefined {
    return this.albums.flatMap((album) => album.tracks).find((track) => track.id === id);
  }

  toJSON(): AlbumData[] {
    return this.albums.map((album) => album.toJSON());
  }
}

/**
 * Repository boundary for the future backend. The UI only needs a catalog,
 * regardless of whether it came from this file or an HTTP API.
 */
export abstract class MusicRepository {
  abstract loadCatalog(): Promise<MusicCatalog>;
}

export class LocalMusicRepository extends MusicRepository {
  constructor(private readonly catalog: MusicCatalog) {
    super();
  }

  async loadCatalog(): Promise<MusicCatalog> {
    return this.catalog;
  }
}

export class ApiMusicRepository extends MusicRepository {
  constructor(private readonly endpoint: string) {
    super();
  }

  async loadCatalog(): Promise<MusicCatalog> {
    const response = await fetch(this.endpoint);
    if (!response.ok) throw new Error(`Could not load music catalog (${response.status}).`);

    const albums = (await response.json()) as AlbumData[];
    return new MusicCatalog(albums);
  }
}

// Local asset helper. Replace these paths with API/cloud URLs without changing
// AlbumCard, MusicSection, or MusicPlayer.
const musicAsset = (filename: string) => `/music/${filename}`;

export const musicCatalog = new MusicCatalog([
  new MusicAlbum({
    id: 'catfishing-ost',
    title: 'Catfishing OST',
    artist: 'Gonzalo Ames',
    cover: musicAsset('catfishing.png'),
    description: 'OST for Catfishing.',
    tracks: [
      new MusicTrack({
        id: 'glasswater',
        title: 'Glasswater',
        src: musicAsset('Glasswater.mp3'),
      }),
    ],
  }),
    new MusicAlbum({
    id: 'undertale',
    title: 'Undertale Orchestral',
    artist: 'Gonzalo Ames',
    cover: musicAsset('undertale-orchestral.png'),
    description: 'Orchestral version of the Undertale OST.',
    tracks: [
      new MusicTrack({
        id: 'once-upon-a-time',
        title: 'Once Upon a Time',
        src: musicAsset('once-upon-a-time.wav'),
      })
    ],
  }),
  new MusicAlbum({
    id: 'rain-ost',
    title: 'The Rain, The River OST',
    artist: 'Gonzalo Ames',
    cover: musicAsset('the-rain-the-river.png'),
    description: 'Themes and scenes from a colorful fantasy world.',
    tracks: [
      new MusicTrack({
        id: 'tlalocan',
        title: 'Tlalocan',
        src: musicAsset('Tlalocan.mp3'),
      }),
      new MusicTrack({
        id: 'teotihuacan',
        title: 'Teotihuacan',
        src: musicAsset('Teotihuacan.mp3'),
      }),
      new MusicTrack({
        id: 'village',
        title: 'Village',
        src: musicAsset('Village.mp3'),
      }),
    ],
  }),
]);

export const localMusicRepository = new LocalMusicRepository(musicCatalog);
