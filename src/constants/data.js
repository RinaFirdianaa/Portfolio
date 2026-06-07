/**
 * constants/data.js
 * Centralised data for the portfolio.
 * Edit this file to update content without touching component logic.
 */

export const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills' },
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

/*
  HOW TO ADD SKILLS

  Each section below has an items list. You can add either:
  - Text bubble:  { label: 'React' }
  - Image bubble: { label: 'Figma', image: '/images/placeholder.png' }

  A section with 5 bubbles starts each bubble at 100px. Every extra bubble
  makes the starting size 10px smaller, and merged bubbles grow by 30px for
  every extra skill inside them.
*/
export const SKILLS = [
  {
    id: 'code',
    icon: '</>',
    label: 'Code',
    items: [
      { label: 'HTML5 & CSS3' },
      { label: 'JavaScript' },
      { label: 'React' },
      { label: 'Python' },
      { label: 'C#' },
    ],
  },
  {
    id: 'design',
    icon: '✦',
    label: 'Design',
    bgColor: 'var(--color-skill-pink-bg)',
    borderColor: 'var(--color-skill-pink-br)',
    items: [
      { label: 'UI/UX' },
      { label: 'Wireframes' },
      { label: 'Prototypes' },
      { label: 'Research' },
      { label: 'Game UI' },
    ],
  },
  {
    id: 'tools',
    icon: '🔧',
    label: 'Tools',
    bgColor: 'var(--color-skill-yellow-bg)',
    borderColor: 'var(--color-skill-yellow-br)',
    items: [
      { label: 'Figma', image: '/images/placeholder.png' },
      { label: 'Adobe XD', image: '/images/placeholder.png' },
      { label: 'Photoshop', image: '/images/placeholder.png' },
      { label: 'Illustrator', image: '/images/placeholder.png' },
      { label: 'Unity', image: '/images/placeholder.png' },
    ],
  },
  {
    id: 'soft',
    icon: '👤',
    label: 'Soft Skills',
    bgColor: 'var(--color-skill-pink-bg)',
    borderColor: 'var(--color-skill-pink-br)',
    items: [
      { label: 'Communication' },
      { label: 'Teamwork' },
      { label: 'Problem Solving' },
      { label: 'Time Management' },
      { label: 'Adaptability' },
    ],
  },
]

/*
  HOW TO ADD A PROJECT

  Copy one object below and edit these fields:
  - id: short unique name, lowercase with dashes
  - title: card title
  - category: must be 'Design', 'Game', or 'Others'
  - summary: short text shown under the selected title
  - description: longer text used in the popup
  - image: main card/popup image from public/images
  - pages: popup pages for showing your work step by step

  Add as many popup pages as you need:
  pages: [
    {
      title: 'Research',
      summary: 'What this page shows.',
      image: '/images/placeholder.png',
    },
    {
      title: 'Final UI',
      summary: 'What changed in the final design.',
      image: '/images/placeholder.png',
    },
  ]
*/
export const PROJECTS = [
  {
    id: 'boba-time',
    title: 'Boba Time',
    category: 'Game',
    summary: 'Developed a bubble tea simulation game from scratchwith a team of 9 for a school project. Designed gameplay mechanics, built all 3 levels in Unity (C#), created 3D assets in Maya, and designed the UI/UX in Figma and Procreate.',
    description:
      'Boba Time is a 3D single-player game where you inherit a bubble tea shop and chase your absent father\'s legacy as the best boba maker. The game tasks you with making bubble tea, serving customers, and managing the store across 3 levels — culminating in a head-to-head competition. I designed the gameplay mechanics and built all 3 levels in Unity using C#, and served as the main artist — modeling the shop, equipment, and characters in Maya, and designing all UI/UX with Procreate and Figma.',
    type: 'Game Development & 3D Art',
    role: 'Gameplay Designer, Level Designer & Lead Artist',
    tools: [
      { name: 'Unity',     image: '/images/Tools/Unity.png' },
      { name: 'C#',        image: '/images/Tools/csharp.png' },
      { name: 'Maya',      image: '/images/Tools/maya.png' },
      { name: 'Procreate', image: '/images/Tools/procreate.jpeg' },
      { name: 'Figma',     image: '/images/Tools/figma.png' },
    ],
    date: '2024 - 2025',
    links: [
      { label: '3D', href: '#' },
      { label: 'UI/UX', href: '#' },
    ],
    // Replace with your actual image path: '/images/projects/boba-time.jpg'
    image: '/images/Projects/BobaTime.png',
    pages: [
      {
        title: 'Overview',
        summary: 'A bubble tea sim meets horror — story, concept, and visual direction.',
        image: '/images/placeholder.png',
      },
      {
        title: 'Gameplay & Levels',
        summary: 'Mechanics design and level breakdowns across all 3 stages, ending in the final competition.',
        image: '/images/placeholder.png',
      },
      {
        title: '3D Art & UI',
        summary: 'Characters, shop environment, equipment models, and in-game UI crafted in Maya, Procreate, and Figma.',
        image: '/images/placeholder.png',
      },
    ],
  },
  {
    id: 'wonderland',
    title: 'Wonderland',
    category: 'Game',
    summary: 'A fantasy mobile game interface with whimsical visuals and accessible UX.',
    description:
      'A fantasy-themed mobile game interface that blends whimsical visual design with accessible UX patterns.',
    type: 'Game UI',
    role: 'UI/UX Designer',
    tools: [
      { name: 'Figma',      image: '/images/tools/maya.png' },
      { name: 'Photoshop',  image: '/images/tools/maya.png' },
      { name: 'Unity',      image: '/images/tools/maya.png' },
    ],
    date: '2024',
    links: [
      { label: 'Case Study', href: '#' },
    ],
    image: '/images/placeholder.png',
    pages: [
      {
        title: 'Concept',
        summary: 'Early direction for the Wonderland visual style.',
        image: '/images/placeholder.png',
      },
      {
        title: 'Interface',
        summary: 'Game interface layout and player-facing controls.',
        image: '/images/placeholder.png',
      },
    ],
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
