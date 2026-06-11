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
      { label: 'Scripting', href: '#' },
    ],
    // Replace with your actual image path: '/images/projects/boba-time.jpg'
    image: '/images/Projects/BobaTime.png',
    pages: [
      {
        title: 'Overview',
        summary: 
        'Boba Time is a 3D narrative-driven game built on a custom game engine by a team of 9 people' +
                  '. 3 designers and 6 developers.' + 
                  ' \n\n It tells the story of a young girl whose father once left home to chase the idea of making the world’s greatest bubble tea. Years later, he returns, only to find the house empty.' + 
                  ' Left with that quiet absence and memory, she decides to learn the craft herself and build a bubble tea shop called Boba Time.'+
                  ' \n\n The game takes the player through 3 levels, starting from simple practice, growing into running a real shop, and finally competing in a high-stakes bubble tea competition.'+
                  ' The ending changes depending on how well the player performs, giving each playthrough a slightly different emotional outcome',
        video: 'https://www.youtube.com/embed/yUd73w6TIa4',
      },
      {
        title: 'Gameplay',
        summary:
          'Boba Time is a fast-paced casual game about making and serving bubble tea orders before time runs out. Players choose the correct tea base and toppings, then seal each cup accurately while dealing with a growing queue of customers that gets more chaotic over time.' +
          '\n\nThe game has three levels, each adding new mechanics to the main gameplay loop. Level 1 consist of the tutorial and letting player to get used to the main gameplay loop. It also introduces special customer types that disrupt your workflow. Level 2 increases the challenge by introducing a shop upgrade system, including a fryer and more troublesome customers that adds an extra preparation step and makes time management more important. Level 3 is the final stage, a timed competition where a combo system rewards consecutive correct orders, and your final score leads to different endings.' +
          '\n\nThe difficulty is designed to grow step by step, so players can learn the basics first before things get more complex. Throughout the game, the focus stays on the fun fantasy of running a busy bubble tea shop.',
        images: ['/images/Projects/BobaTime/BobaTime1.jpg', '/images/Projects/BobaTime/BobaTime2.jpg', '/images/Projects/BobaTime/BobaTime3.jpg', '/images/Projects/BobaTime/BobaTime4.jpg', '/images/Projects/BobaTime/BobaTime5.jpg' ,'/images/Projects/BobaTime/BobaTime6.jpg'],
        imageLinks: [
          { label: 'tea base', imageIndex: 0 },
          { label: 'toppings', imageIndex: 1 },
          { label: 'special customer types', imageIndex: 2 },
          { label: 'shop upgrade system', imageIndex: 4 },
          { label: 'troublesome customers', imageIndex: 3 },
          { label: 'final score', imageIndex: 5 },
        ],
      },
      {
        title: '2D & UI Art',
        summary:
          '2D\nBoba Time uses a soft and colourful 2D art style with warm pastel colours that create a cosy and emotional feeling. The characters have a cute chibi design with expressive faces. Story scenes are shown through simple comic-style panels that help tell the story between levels.' +
          '\n\nUI\nThe UI was designed to blend seamlessly with the game\'s cosy aesthetic, using rounded shapes, soft pastel colours, and playful typography throughout. Key information such as objectives, timers, upgrades, and progression is displayed in a clear and easy-to-read way, helping players stay focused on gameplay without feeling overwhelmed.',
        images: ['/images/Projects/BobaTime/BobaTime8.png', '/images/Projects/BobaTime/BobaTime7.png', '/images/Projects/BobaTime/BobaTime11.png'],
        imageLinks: [
          { label: '2D', imageIndex: 0 },
          { label: 'UI', imageIndex: 1 },
        ],
      },
      {
        title: '3D Art',
        summary: 'All the 3D assets were made in Maya using a cute, stylised low-poly look to give Boba Time its warm and playful feel. I modelled the characters, including different customer types for each level, along with the environment and props like the town square, street lamps, seating areas, and shop equipment. I also created the bubble tea assets used in gameplay and added animations to help bring the characters and world to life.',
        images: ['/images/Projects/BobaTime/BobaTime10.png', '/images/Projects/BobaTime/BobaTime9.png'],
        animations: [
          { label: 'Boy Angry 2', model: '/images/Projects/BobaTime/fbx/boyAngry2.fbx', image: '/images/Projects/BobaTime/Angry.png' },
          { label: 'Critic Walking', model: '/images/Projects/BobaTime/fbx/critic_walking.fbx', image: '/images/Projects/BobaTime/Walking.png' },
          { label: 'Girl Idle', model: '/images/Projects/BobaTime/fbx/girlIdle.fbx', image: '/images/Projects/BobaTime/Idle.png' },
          { label: 'Hot Guy 3 Stars', model: '/images/Projects/BobaTime/fbx/Hotguy_3stars.fbx', image: '/images/Projects/BobaTime/Kisses.png' },
          { label: 'Indecisive Think', model: '/images/Projects/BobaTime/fbx/Indicisive_Think.fbx', image: '/images/Projects/BobaTime/Thinking.png' },
          { label: 'Karen Scolding', model: '/images/Projects/BobaTime/fbx/karen_scolding.fbx', image: '/images/Projects/BobaTime/Scolding.png' },
          { label: 'Happy', model: '/images/Projects/BobaTime/fbx/player_happy.fbx', image: '/images/Projects/BobaTime/Happy.png' },
          { label: 'Rival Angry', model: '/images/Projects/BobaTime/fbx/rival_angry.fbx', image: '/images/Projects/BobaTime/Dissapointed.png' },
          { label: 'Sus Rival Sitting', model: '/images/Projects/BobaTime/fbx/susRival_sitting.fbx', image: '/images/Projects/BobaTime/Sitting.png' },
        ],
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
