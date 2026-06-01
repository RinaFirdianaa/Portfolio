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

  The more bubbles you add to one section, the smaller the bubbles become
  automatically so they fit better inside the box.
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
    summary: 'A neon game UI project focused on playful menu flow and player immersion.',
    description:
      'An interactive game UI project featuring vibrant neon aesthetics and intuitive in-game menus designed for maximum player immersion.',
    type: 'Game UI',
    role: 'UI/UX Designer',
    tools: ['Figma', 'Unity'],
    status: 'Prototype',
    links: [
      { label: 'Case Study', href: '#' },
      { label: 'Prototype', href: '#' },
    ],
    // Replace with your actual image path: '/images/projects/boba-time.jpg'
    image: '/images/placeholder.png',
    pages: [
      {
        title: 'Overview',
        summary: 'Main visual direction and project mood.',
        image: '/images/placeholder.png',
      },
      {
        title: 'Menu Flow',
        summary: 'Screens and interactions for moving through the game menu.',
        image: '/images/placeholder.png',
      },
      {
        title: 'Final Look',
        summary: 'Polished UI direction and presentation screen.',
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
    tools: ['Figma', 'Photoshop', 'Unity'],
    status: 'In progress',
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
