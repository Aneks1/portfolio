export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Music', href: '#music' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const heroContent = {
  highlights: ['Composer', 'Music Producer', 'Sound Designer'],
  title: 'Gonzalo Ames',
  subtitle: 'Original music for games, stories, and imagined worlds.',
  description:
    'A Peruvian composer creating expressive scores that move between cinematic atmosphere, intimate melody, and guitar-driven energy.',
  primaryAction: { label: 'Listen to My Music', href: '#music' },
  secondaryAction: { label: 'Contact Me', href: '#contact' },
};

export const serviceList = [
  {
    title: 'Ambient Textures & Loops',
    priceLabel: 'Starting at',
    price: '$30',
    description:
      'Immersive environmental audio for menus, interiors, dream sequences, horror environments, exploration, and subtle background ambience.',
    features: [
      'One original ambient texture or atmospheric loop',
      'Up to 30 seconds',
      'Seamless looping',
      'Mixing & mastering',
      'Commercial-use license for one project',
      'One revision',
    ],
    action: 'Request Ambient Audio',
  },
  {
    title: 'Original Music Composition',
    priceLabel: 'Starting at',
    price: '$60',
    description:
      'A fully original composition written around your game’s emotion, gameplay, and artistic direction—never templates or stock music.',
    features: [
      'One original composition',
      'Up to 90 seconds',
      'Custom instrumentation',
      'Professional arrangement',
      'Loop-ready version when needed',
      'Mixing & mastering',
      'Commercial-use license for one project',
      'Two revisions',
    ],
    action: 'Commission a Track',
  },
  {
    title: 'Full Game Audio',
    priceLabel: '',
    price: 'Custom quote',
    description:
      'A complete musical direction and cohesive soundtrack designed to evolve with your world, gameplay, and story.',
    features: [
      'Original soundtrack tailored to your game',
      'As many tracks as the game requires',
      'Shared themes and recurring motifs',
      'Consistent artistic direction',
      'Loop-ready exports',
      'Mixing & mastering',
      'Commercial-use license',
      'Ongoing collaboration throughout development',
      'Multiple revisions during production',
    ],
    action: 'Build My Soundtrack',
  },
  {
    title: 'Custom Audio Solution',
    priceLabel: '',
    price: 'Custom quote',
    description:
      'A tailored solution for adaptive music, implementation support, custom collections, unusual scopes, or specific budgets.',
    features: [
      'Original compositions and ambient textures',
      'Music packs, stems, and alternate versions',
      'Adaptive music',
      'Audio consulting',
      'Long-term collaboration',
    ],
    action: "Let's Talk",
  },
];

export const aboutContent = {
  paragraphs: [
    'I am Gonzalo Ames, also known as Aneks, a Peruvian composer and music producer drawn to the way music can give a world its identity.',
    'My work moves between ambient and cinematic writing, memorable melodic themes, electronic textures, and guitar-led pieces. I compose with story first: every cue should reveal something about a place, a character, or a feeling.',
    'I am especially interested in music for games and visual media, where a score can grow alongside the experience and stay with the listener after it ends.',
  ],
};

export const contactEntries = [
  { label: 'Email', value: 'hello@gonzalootero.dev', href: 'mailto:hello@gonzalootero.dev' },
  { label: 'LinkedIn', value: 'linkedin.com/in/gonzalootero', href: 'https://linkedin.com/in/gonzalootero', external: true },
  { label: 'Instagram', value: '@gonzaloaudio', href: 'https://instagram.com/gonzaloaudio', external: true },
  { label: 'Calendly', value: 'Book a call', href: 'https://calendly.com/gonzalootero/intro', external: true },
];

export const musicAlbums = [
  {
    id: 'fantasy-ost',
    title: 'Fantasy OST',
    artist: 'Gonzalo Ames',
    cover: '/music/cafe.png',
    description: 'Themes and scenes from a colorful fantasy world.',
    tracks: [
      {
        id: 'cafe-ost',
        title: 'Café',
        artist: 'Gonzalo Ames',
        src: '/music/cafe.mp3',
      },
      {
        id: 'arcade',
        title: 'Arcade',
        artist: 'Gonzalo Ames',
        src: '/music/arcade.mp3',
      },
      {
        id: 'boss-sample',
        title: 'Boss Cutscene',
        artist: 'Gonzalo Ames',
        src: '/music/boss-sample.mp3',
      },
    ],
  },
  {
    id: 'experiments',
    title: 'Experiments',
    artist: 'Gonzalo Ames',
    cover: '/music/arcade.png',
    description: 'Standalone sketches exploring different moods and genres.',
    tracks: [
      {
        id: 'fantasy-song',
        title: 'Fantasy Song Experiment',
        artist: 'Gonzalo Ames',
        src: '/music/fantasy-song.mp3',
      },
      {
        id: 'futuristic-shooter',
        title: 'Futuristic Shooter OST',
        artist: 'Gonzalo Ames',
        src: '/music/futuristic-shooter.mp3',
      },
    ],
  },
];
