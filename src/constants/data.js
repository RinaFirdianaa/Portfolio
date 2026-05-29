/**
 * constants/data.js
 * Centralised data for the portfolio.
 * Edit this file to update content without touching component logic.
 */

export const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Work',     href: '#work' },
]

export const EDUCATION = [
  {
    id: 'sit',
    school: 'Singapore Institute of Technology (Digipen)',
    course: 'Computer Science in Game Development and Design',
    period: '2022–2026',
    completed: true,
  },
  {
    id: 'nyp',
    school: 'Nanyang Polytechnic',
    course: 'Diploma in Multimedia and Infocomm Technology',
    period: '2019–2022',
    completed: false,
  },
  {
    id: 'ite',
    school: 'Institute of Technology (ITE)',
    course: 'Higher Nitec in Games Art and Design',
    period: '2016–2019',
    completed: false,
  },
]

export const SKILLS = [
  {
    id: 'code',
    icon: '</>',
    label: 'Code',
    bgColor: 'var(--color-skill-yellow-bg)',
    borderColor: 'var(--color-skill-yellow-br)',
    items: [
      'HTML5 & CSS3',
      'JavaScript (ES6+)',
      'React',
      'Python',
      'C# (Unity)',
    ],
  },
  {
    id: 'design',
    icon: '✦',
    label: 'Design',
    bgColor: 'var(--color-skill-pink-bg)',
    borderColor: 'var(--color-skill-pink-br)',
    items: [
      'UI/UX Design',
      'Wireframing & Prototyping',
      'User Research',
      'Human-Computer Interaction',
      'Game UI / HUDs',
    ],
  },
  {
    id: 'tools',
    icon: '🔧',
    label: 'Tools',
    bgColor: 'var(--color-skill-yellow-bg)',
    borderColor: 'var(--color-skill-yellow-br)',
    items: [
      'Figma',
      'Adobe XD',
      'Photoshop',
      'Illustrator',
      'Unity',
    ],
  },
  {
    id: 'soft',
    icon: '👤',
    label: 'Soft Skills',
    bgColor: 'var(--color-skill-pink-bg)',
    borderColor: 'var(--color-skill-pink-br)',
    items: [
      'Communication',
      'Team Collaboration',
      'Problem Solving',
      'Time Management',
      'Adaptability',
    ],
  },
]

export const PROJECTS = [
  {
    id: 'boba-time',
    title: 'Boba Time',
    category: 'Game',
    description:
      'An interactive game UI project featuring vibrant neon aesthetics and intuitive in-game menus designed for maximum player immersion.',
    // Replace with your actual image path: '/images/projects/boba-time.jpg'
    image: null,
    thumbnails: [null, null, null, null],
  },
  {
    id: 'wonderland',
    title: 'Wonderland',
    category: 'Game',
    description:
      'A fantasy-themed mobile game interface that blends whimsical visual design with accessible UX patterns.',
    image: null,
    thumbnails: [null, null],
  },
]

export const PROJECT_CATEGORIES = ['Design', 'Game', 'Others']

export const EXPERIENCES = [
  {
    id: 'mas',
    name: 'Monetary Authority of Singapore (MAS)',
    period: 'May 2023 – April 2026',
    // Replace with: '/images/logos/mas.png'
    logo: null,
    logoBg: '#1a237e',
    initials: 'MAS',
    initialsColor: '#ffffff',
  },
  {
    id: 'viseo',
    name: 'Viseo',
    period: 'Sep 2021 – Feb 2022',
    logo: null,
    logoBg: '#ffffff',
    initials: 'VISEO',
    initialsColor: '#e91e8c',
  },
  {
    id: 'imda',
    name: 'Infocomm Media Development Authority (IMDA)',
    period: 'Oct 2017 – Oct 2019',
    logo: null,
    logoBg: '#ffffff',
    initials: 'IMDA',
    initialsColor: '#c0392b',
  },
]

export const FOOTER_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Work',     href: '#projects' },
]
