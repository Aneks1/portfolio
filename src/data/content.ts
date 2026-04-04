export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Music', href: '#music' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const heroContent = {
  highlights: ['Design Systems', 'Creative Development', 'Sound Designer'],
  title: 'Gonzalo Ames',
  subtitle: 'I help brands turn ideas into immersive digital and sonic experiences.',
  description:
    'Front-of-house developer and music producer crafting cohesive stories across interfaces, animations, and soundscapes.',
  primaryAction: { label: 'View Projects', href: '#projects' },
  secondaryAction: { label: 'Contact Me', href: '#contact' },
};

export const projectList = [
  {
    title: 'Aurora Visualizer',
    description:
      'Reactive audio visual platform that syncs lighting rigs with live performances using WebGL and MIDI.',
    tags: ['Astro', 'Three.js', 'WebAudio'],
    links: [
      { label: 'Case Study', href: '#projects' },
      { label: 'Live Demo', href: 'https://example.com/aurora' },
    ],
  },
  {
    title: 'Muse Studio',
    description:
      'Modular production suite website featuring themeable presets, sample management, and booking integration.',
    tags: ['Vue', 'Tailwind', 'Supabase'],
    links: [
      { label: 'GitHub', href: 'https://github.com/placeholder/muse-studio' },
    ],
  },
  {
    title: 'Echo Trails',
    description:
      'Location-based sound tour app delivering generative ambience and stories for urban explorers.',
    tags: ['Astro', 'Capacitor', 'Mapbox'],
    links: [
      { label: 'Product Page', href: 'https://example.com/echo-trails' },
    ],
  },
];

export const skillCategories = [
  {
    title: 'Frontend',
    items: ['Astro', 'Vue', 'React', 'TypeScript', 'GSAP'],
  },
  {
    title: 'Creative Coding',
    items: ['WebGL', 'Three.js', 'p5.js', 'Shader Graphs'],
  },
  {
    title: 'Audio Production',
    items: ['Ableton Live', 'FM Synthesis', 'Mix & Master', 'Sound Design'],
  },
  {
    title: 'Collaboration',
    items: ['Figma', 'Notion', 'Agile Rituals', 'Client Workshops'],
  },
];

export const serviceList = [
  {
    title: 'Web Experiences',
    description:
      'End-to-end delivery of visually-rich, high-performance web applications tailored to storytelling.',
    highlights: ['Component systems', 'Responsive design', 'CMS integration'],
  },
  {
    title: 'Audio Branding',
    description:
      'Crafting sonic identities, original compositions, and immersive sound design for digital products.',
    highlights: ['Theme development', 'UI sound kits', 'Spatial audio'],
  },
  {
    title: 'Creative Direction',
    description:
      'Helping teams explore concepts and translate creative briefs into tangible prototypes and demos.',
    highlights: ['Design sprints', 'Interactive moodboards', 'Rapid prototyping'],
  },
];

export const aboutContent = {
  paragraphs: [
    'I am a multidisciplinary developer and producer focused on crafting experiences where visuals, interaction, and sound flow together.',
    'Over the last 6 years I have collaborated with studios, artists, and brands to launch interfaces, installations, and shows across Europe and LATAM.',
    'When I am not in front of a DAW or an editor, you can find me exploring modular synth patches or capturing field recordings in the wild.',
  ],
  facts: [
    { label: 'Based in', value: 'Buenos Aires, AR' },
    { label: 'Experience', value: '6+ Years' },
    { label: 'Currently', value: 'Freelance Creative Technologist' },
  ],
};

export const contactEntries = [
  { label: 'Email', value: 'hello@gonzalootero.dev', href: 'mailto:hello@gonzalootero.dev' },
  { label: 'LinkedIn', value: 'linkedin.com/in/gonzalootero', href: 'https://linkedin.com/in/gonzalootero', external: true },
  { label: 'Instagram', value: '@gonzaloaudio', href: 'https://instagram.com/gonzaloaudio', external: true },
  { label: 'Calendly', value: 'Book a call', href: 'https://calendly.com/gonzalootero/intro', external: true },
];

export const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/Aneks1' },
  // { label: 'SoundCloud', href: 'https://soundcloud.com/gonzalootero' },
  // { label: 'Dribbble', href: 'https://dribbble.com/gonzalootero' },
];

export const musicTracks = [
  {
    id: 'cafe-ost',
    title: 'Café - Project Fantasy OST',
    artist: 'Gonzalo Ames',
    cover: '/music/cafe.png',
    src: '/music/cafe.mp3',
  },
  {
    id: 'arcade',
    title: 'Arcade - Project Fantasy OST',
    artist: 'Gonzalo Ames',
    cover: '/music/arcade.png',
    src: '/music/arcade.mp3',
  },
  {
    id: 'boss-sample',
    title: 'Boss Cutscene Sample',
    artist: 'Gonzalo Ames',
    cover: '/music/boss-sample.jpg',
    src: '/music/boss-sample.mp3',
  },
  {
    id: 'fantasy-song',
    title: 'Fantasy Song Experiment',
    artist: 'Gonzalo Ames',
    cover: '/music/fantasy-song.jpg',
    src: '/music/fantasy-song.mp3',
  },
  {
    id: 'futuristic-shooter',
    title: 'Futuristic Shooter OST',
    artist: 'Gonzalo Ames',
    cover: '/music/futuristic-shooter.jpg',
    src: '/music/futuristic-shooter.mp3',
  },
];
