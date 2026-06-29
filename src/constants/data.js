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

  Add skills by editing the items list inside each section.
  You can use any of these formats:

  - Text only:
    { label: 'React' }

  - Icon plus text:
    { label: 'React', icon: '</>' }

  - Image icon:
    { label: 'Figma', image: '/images/Tools/figma.png' }

  You can also add a quick text-only skill as a plain string:
    'React'

  A section with 5 bubbles starts each bubble at 100px. Every extra bubble
  makes the starting size 10px smaller, and merged bubbles grow by 30px for
  every extra skill inside them.
*/
export const SKILLS = [
  {
    id: 'code',
    icon: '</>',
    label: 'Dev & Web',
    items: [
      'PHP',
      'HTML',
      'CSS',
      'JavaScript',
      'SQL',
      'C',
      'C++',
      'C#',
      'Jetpack Compose',
    ],
  },
  {
    id: 'tools',
    icon: '✦',
    label: 'Tools',
    bgColor: 'var(--color-skill-pink-bg)',
    borderColor: 'var(--color-skill-pink-br)',
    items: [
      'Git',
      'VS Code',
      'Visual Studio',
      'Unity',
    ],
  },
  {
    id: 'design',
    icon: '🔧',
    label: 'Design',
    bgColor: 'var(--color-skill-yellow-bg)',
    borderColor: 'var(--color-skill-yellow-br)',
    items: [
      { label: 'Figma', image: '/images/Tools/figma.png' },
      { label: 'Photoshop', image: '/images/Tools/photoshop.png' },
      { label: 'Adobe XD', image: '/images/Tools/xd.png' },
      { label: 'Canva', image: '/images/Tools/canva.png' },
      { label: 'Maya', image: '/images/Tools/maya.png' },
      { label: 'Blender', image: '/images/Tools/blender.png' },
      { label: 'Procreate', image: '/images/Tools/procreate.jpeg' },
    ],
  },
  {
    id: 'soft',
    icon: '👤',
    label: 'Soft Skills',
    bgColor: 'var(--color-skill-pink-bg)',
    borderColor: 'var(--color-skill-pink-br)',
    items: [
      'Adaptable',
      'Creative',
      'Team Player',
      'Flexible',
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
    tools: ['unity', 'csharp', 'maya', 'procreate', 'figma'],
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
          '\n\nUI\nThe UI was designed to match the game\'s playful and cute aesthetic through rounded shapes, soft pastel colours, and bold, friendly typography. These visual choices make the interface feel approachable while keeping important information clear and easy to read.' +
          '\n\nThe layout is structured to help players easily find the information they need, such as objectives, progress, and settings, without disrupting the flow of gameplay.',
        images: ['/images/Projects/BobaTime/BobaTime8.png', '/images/Projects/BobaTime/BobaTime7.png', '/images/Projects/BobaTime/BobaTime11.png'],
        imageLinks: [
          { label: '2D', imageIndex: 0 },
          { label: 'UI', imageIndex: 1 },
        ],
      },
      {
        title: '3D Art',
        summary: 'All the 3D assets were made in Maya using a cute, stylised low-poly look to give Boba Time its warm and playful feel. I modelled the characters, including different customer types for each level, along with the environment and props like the town square, street lamps, seating areas, and shop equipment. I also created the bubble tea assets used in gameplay and added animations to help bring the characters and world to life.',
        images: ['/images/Projects/BobaTime/BobaTime10.png'],
        imageLinks: [
          { label: 'environment', imageIndex: 0 },
          { label: 'characters', imageIndex: 1 },
        ],
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
    id: 'design-1',
    title: 'Dashboard',
    detailTitle: 'Web Dashboard',
    category: 'Design',
    summary:
      'I designed and developed a web-based AWS CloudWatch Alarm Reporting Dashboard to monitor infrastructure alarms more clearly and efficiently. The dashboard presents alarm data in a structured interface, using summary cards, charts, tables, and filters to help users quickly understand system health, identify issues, and investigate alarms.',
    description:
      'I designed and developed a web-based AWS CloudWatch Alarm Reporting Dashboard to monitor infrastructure alarms more clearly and efficiently. The dashboard presents alarm data in a structured interface, using summary cards, charts, tables, and filters to help users quickly understand system health, identify issues, and investigate alarms.',
    type: 'Web Dashboard',
    tools: ['figma', 'react', 'css'],
    date: '2025',
    links: [
      { label: 'Web', href: '#' },
      { label: 'UI/UX', href: '#' },
    ],
    image: '/images/Projects/Dashboard.png',
    pages: [
      {
        title: 'Overview',
        summary:
          'I designed and developed a web-based CloudWatch Alarm Reporting Dashboard to monitor infrastructure alarms more clearly and efficiently. The dashboard presents CloudWatch alarm data in a structured interface, using summary cards, charts, tables, and filters to help users understand system health at a glance.' +
          '\n\n**Problem**\nTo investigate an alarm, users often had to click through multiple pages in AWS, open individual alarm details, check related metrics, and switch between different views. This made the process slower and less efficient, especially when monitoring many alarms across different services.',
        image: '/images/Projects/Dashboard/Dashboard1.png',
      },
      {
        title: 'Goals',
        summary:
          'The design goals were to make alarm monitoring clearer, faster, and easier to manage. I wanted the dashboard to help users:' +
          '\n\n- Understand system health at a glance' +
          '\n- Identify critical alarm states quickly' +
          '\n- Filter and organise alarms without extra navigation' +
          '\n- View alarm data in a more visual and structured way' +
          '\n- Customise the dashboard based on different monitoring needs',
        image: '/images/Projects/Dashboard/Dashboard9.png',
      },
      {
        title: 'Design',
        summary:
          'The solution was a centralised dashboard that brings alarm information into one clear interface. Instead of forcing users to move through multiple CloudWatch pages, the dashboard displays key alarm information through summary cards, visual charts, and a structured alarm table.' +
          '\n\n' +
          '**Summary Cards**\nThe dashboard uses summary cards to show the total number of alarms and the number of alarms in each state: OK, ALARM, and INSUFFICIENT DATA. This gives users a quick view of system health at a glance.' +
          '\n\n**Alarm Table**\nThe alarm table displays key details such as alarm name, current state, service, namespace, tags, and last updated time. This makes the information easier to scan and helps users investigate alarms in a more organised way.' +
          '\n\n**Filtering & Organisation**\nUsers can search and filter alarms by name, service, alarm state, namespace, and tags. The filters update instantly without requiring a full page reload, making the investigation process faster and smoother.' +
          '\n\n**Data Visualisation**\nThe dashboard uses charts, tables, summary cards, and text cards to present alarm data in different ways. This helps users move between a high-level overview and more detailed alarm information depending on what they need.' +
          '\n\n**Customisable Dashboard Cards**\nUsers can move, resize, add, edit, and save dashboard cards. This allows different users or teams to personalise the layout based on their monitoring needs.' +
          '\n\n**Historical Alarm View**\nThe dashboard supports historical alarm visualisation, allowing users to view alarm behaviour across selected time ranges. This helps users observe patterns and understand how alarm states change over time.',
        image: '/images/Projects/Dashboard/Dashboard1.png',
        images: [
          '/images/Projects/Dashboard/Dashboard1.png',
          '/images/Projects/Dashboard/Dashboard6.png',
          '/images/Projects/Dashboard/Dashboard5.jpg',
          '/images/Projects/Dashboard/Dashboard7.jpg',
        ],
        imageLinks: [
          {
            label: 'summary cards',
            imageIndex: 0,
            callout: { imageIndex: 0, x: 1.5, y: 18, width: 55, height: 20 },
          },
          {
            label: 'Alarm Table',
            imageIndex: 0,
            callout: { imageIndex: 0, x: 1.5, y: 58, width: 96, height: 37 },
          },
          {
            label: 'Filtering & Organisation',
            imageIndex: 0,
            callout: { imageIndex: 0, x: 1.5, y: 50, width: 96, height: 13 },
          },
          {
            label: 'Data Visualisation',
            imageIndex: 2,
          },
          {
            label: 'charts',
            imageIndex: 2,
            callout: { imageIndex: 2, x: 71, y: 25, width: 28, height: 70 },
          },
          {
            label: 'text cards',
            imageIndex: 2,
            callout: { imageIndex: 2, x: 1.5, y: 15, width: 96, height: 13 },
          },
          {
            label: 'tables',
            imageIndex: 0,
            callout: { imageIndex: 0, x: 1.5, y: 58, width: 96, height: 37 },
          },
          {
            label: 'Customisable Dashboard Cards',
            imageIndex: 1,
          },
          {
            label: 'can move',
            imageIndex: 2,
            callout: { imageIndex: 2, x: 1.5, y: 15, width: 96, height: 5 },
          },
          {
            label: 'edit',
            imageIndex: 2,
            callout: { imageIndex: 2, x: 92, y: 19, width: 4, height: 5 },
          },
          {
            label: 'resize',
            imageIndex: 2,
            callout: { imageIndex: 2, x: 68.5, y: 58.5, width: 4, height: 5 },
          },
          {
            label: 'add',
            imageIndex: 2,
            callout: { imageIndex: 2, x: 89.3, y: 3.5, width: 10, height: 7 },
          },
          {
            label: 'Historical Alarm View',
            imageIndex: 3,
          },
        ],
      },
      {
        title: 'Outcome',
        summary:
          'The final dashboard met the design goals by making CloudWatch alarm monitoring clearer and easier to manage.' +
          '\n\nSummary cards help users **understand system health at a glance**, while clear alarm states make it easier to **identify critical issues quickly**. Filters allow users to **search and organise alarms without extra navigation** by service, state, name, namespace, and tags.' +
          '\n\nBy using charts, tables, and visual cards, the dashboard allows users to **view alarm data in a more visual and structured way**. Customisable cards also allow users to **adjust the dashboard based on different monitoring needs**.',
        image: '/images/Projects/Dashboard/Dashboard8.png',
      },
    ],
  },
  {
    id: 'design-2',
    title: 'UI Redesign',
    category: 'Design',
    summary: 'This project focuses on redesigning a game settings interface to make it clearer, easier to read, and more intuitive to use. The redesign improves how players understand and interact with different setting options through better layout, clearer controls, and more visual feedback.',
    description: 'A design project placeholder ready to be updated.',
    type: 'Design',
    tools: ['figma'],
    date: '2026',
    links: [
      { label: 'Case Study', href: '#' },
    ],
    image: '/images/Projects/shorthike.png',
    pages: [
      {
        title: 'Overview',
        summary:
          'I redesigned the settings screen from A Short Hike, which is located in the game’s main menu. This screen allows players to adjust different game options, such as resolution, pixel size, and shadow visibility. The goal of this redesign was to improve the clarity and usability of the settings page.' +
          '\n\n**Problems Identified**' +
          '\n**Affordance**: Although the options are shown in a different colour, they do not clearly appear clickable or adjustable. This makes it less obvious which parts of the settings screen players can interact with.' +
          '\n\n**Mapping**:The text and options are not clearly grouped together, making the settings harder to scan at a glance. As a result, players may take longer to understand which option belongs to each setting.',
        image: '/images/Projects/UI/shorthike1.jpg',
      },
      {
        title: 'Design',
        summary:
          'The goal of the redesign was to make the settings screen clearer, easier to scan, and more intuitive to interact with.' +
          '\n[figma prototype](https://www.figma.com/proto/vm4kZujNBfT6m52s9vv3sa/Untitled?node-id=2131-587&t=sl8JzZMgxjEazzsu-1&scaling=contain&content-scaling=fixed&page-id=2112%3A3473)' +
          '\n\nTo improve affordance, I redesigned the settings options to look more clearly clickable or adjustable. This helps players understand that each setting can be interacted with.' +
          '\n\nTo improve mapping, I organised the text and controls into a cleaner layout. Labels and their related options are placed closer together, making the relationship between them easier to understand.' +
          '\n\nThe redesigned settings screen improves the user experience by making the interface easier to understand and faster to use. Players can now identify which settings are interactable, read the options more clearly, and switch settings with less effort.',
        image: '/images/Projects/UI/shorthike2.png',
      },
    ],
  },
  {
    id: 'muju',
    title: 'Muju',
    detailTitle: 'Muju Card Game',
    category: 'Others',
    summary: 'Created Muju, a single-player tabletop dungeon card game, with a team of four, working within a strict limit of 50 cards and 20 tokens. As Lead Gameplay Designer and UI/UX Designer, I was responsible for designing the core gameplay mechanics, and card layouts.',
    description:
      'Created Muju, a single-player tabletop dungeon card game, with a team of four, working within a strict limit of 50 cards and 20 tokens. As Lead Gameplay Designer and UI/UX Designer, I was responsible for designing the core gameplay mechanics and card layouts.',
    type: 'Card Game',
    role: 'Gameplay Designer and UI/UX Designer',
    tools: ['figma', 'procreate'],
    date: '2024',
    links: [
      { label: 'Card Game', href: '#' },
      { label: 'UI/UX', href: '#' },
    ],
    image: '/images/Projects/Muju.png',
    pages: [
      {
        title: 'Overview',
        summary:
          'Muju is a single-player tabletop dungeon card game that blends exploration, turn-based combat, and resource management into a strategic survival experience. Players progress through a dungeon deck filled with monsters, random scenarios, and item opportunities, requiring careful decision-making to manage health, coins, and limited inventory space.' +
          '\n\nThroughout the journey, players must adapt to unpredictable encounters while optimizing their loadout through a constrained item system. Every four rounds introduces a Muju encounter, a powerful entity with unique abilities and special conditions that challenge the player\'s strategy and preparation. Defeating a Muju rewards its card, marking progression toward the final objective.',
        image: '/images/Projects/Muju/Muju2.png',
      },
      {
        title: 'Gameplay',
        summary:
          'In Muju, gameplay is based on choosing between two actions each round: going to the store or entering the dungeon.' +
          '\n\nAt the start of the game, the player chooses a role card: Mage, Warrior, or Archer. Each role gives different starting strengths and influences how the player approaches combat throughout the game.' +
          '\n\nIn the store, the player draws three item cards, chooses one to buy, and puts the other two back into the deck. The player can only hold up to two items, so they must discard one if they want to buy a new one. Items help in combat and are returned to the item deck after being used or broken.' +
          '\n\nWhen entering the dungeon, the player draws a card from the Dungeon deck. This can be a monster or a scenario. In combat, the player rolls a 6-sided die and adds it to their attack value. The enemy rolls a 4-sided die and adds it to their attack. The player can also use items to increase their attack. Damage is calculated by comparing total attack values, and the fight continues until either the player or the enemy is defeated.' +
          '\n\nIf the player wins, they earn coins from the monster card. They can then choose to go back to the store, use items, or continue exploring the dungeon.' +
          '\n\nScenario cards create random events that can help or hurt the player, such as gaining items or losing health. Some scenarios also involve fighting two enemies at once, where the player can only attack one at a time while both enemies can attack the player.' +
          '\n\nEvery four rounds, the player faces a Muju instead of a normal dungeon card. Mujus are powerful enemies with special rules or requirements. Defeating a Muju gives the player its card. The game ends when the player defeats three Mujus.',
        image: '/images/Projects/Muju/Muju1.png',
      },
      {
        title: 'UI/UX Design',
        summary:
          'To keep the game easy to understand, I used the same icons and colors across all card types. This helps players quickly understand what each card does without needing to read too much.' +
          '\n\nPlayer & Muju Cards\nPlayer and Muju cards show key stats such as health, attack, and starting coins. The heart icon represents health, the sword icon represents attack, and the coin icon shows how many coins the player starts with. This makes the card information easy to read at a glance.' +
          '\n\nMonster Cards\nMonster cards show health and attack using the same icons as the other cards. The coin value is placed on the back of the monster card, so when a monster is defeated, players can flip it over and use it as a coin token. This reduces the need for extra components and keeps the game easier to manage.' +
          '\n\nItem Cards\nItem cards show the cost, attack bonus, and durability. The coin icon shows how much the item costs, while the sword icon shows how much attack it adds. I also added short flavor text and a "breaks after X attacks" note to make the items feel more fun and playful.' +
          '\n\nDesign Approach\nI reused the same icon system across all card types so players only need to learn it once. This makes the cards easier to understand, reduces confusion, and helps the gameplay feel faster and smoother, especially for new players.',
        images: [
          '/images/Projects/Muju/Muju3.png',
          '/images/Projects/Muju/Muju4.png',
          '/images/Projects/Muju/Muju5.png',
        ],
        imageLinks: [
          { label: 'Player & Muju Cards', imageIndex: 0 },
          { label: 'Monster Cards', imageIndex: 2 },
          { label: 'Item Cards', imageIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'wonderland',
    title: 'Wonderland',
    category: 'Game',
    summary: 'Developed a 2D cooperative puzzle game using the school\'s custom game engine as part of a team of five developers. Served as the Game Designer and Artist, designing the game\'s puzzles, implementing gameplay features in C++, and developing the game\'s user interface systems',
    description:
      'A fantasy-themed mobile game interface that blends whimsical visual design with accessible UX patterns.',
    type: 'Game UI',
    role: 'Gameplay Designer, Artist & Developer',
    tools: ['procreate', 'c++'],
    date: '2024',
    links: [
      { label: '2D', href: '#' },
      { label: 'Downloadable', href: '#' },
    ],
    image: '/images/Projects/Wonderland.png',
    pages: [
      {
        title: 'Overview',
        summary:
          'Wonderland is a 2D cooperative puzzle platformer where two players work together as Alice and Alter Alice to escape the strange world of Wonderland. The game is built around the idea that each player experiences the same level differently. While Alice sees the world normally, Alter Alice sees everything upside down, creating different paths, obstacles, and solutions for each player.' +
          '\n\nThe game focuses on teamwork, communication, and puzzle-solving. Players must use their different perspectives and abilities to help each other progress through each level and overcome the challenges found throughout Wonderland.',
        video: 'https://youtu.be/garvaJ6r98w',
        download: {
          label: 'Download Wonderland',
          href: '/images/Projects/Wonderland/Wonderland.zip',
        },
      },
      {
        title: 'Gameplay',
        summary:
          'Players control Alice and Alter Alice, who explore the same environment from opposite perspectives. Because one player sees the world upside down, platforms and obstacles may appear completely different to each character. This requires players to communicate and work together to find a way forward.' +
          '\n\nAnother key mechanic is character size. Throughout the game, one Alice may become smaller while the other becomes larger. Smaller characters can fit through narrow spaces and reach areas that would otherwise be inaccessible, while larger characters can move obstacles or jump higher.' +
          '\n\nMany puzzles combine these mechanics. For example, Alter Alice may be able to move a box that Alice cannot interact with. By pushing the box off an edge, it falls into Alice\'s side of the level and becomes a platform that the smaller Alice can use to reach higher areas.',
        images: [
          '/images/Projects/Wonderland/Wonderland1.jpg',
          '/images/Projects/Wonderland/Wonderland2.jpg',
          '/images/Projects/Wonderland/Wonderland3.jpg',
        ],
        imageLinks: [
          { label: 'box', imageIndex: 0 },
          { label: 'character size', imageIndex: 2 },
        ],
      },
      {
        title: '2D Art',
        summary:
          'Since the project was mainly assessed on gameplay and programming rather than visuals, the art style was kept simple and focused on supporting the game experience.' +
          '\n\nCharacter Design\nAlice and Alter Alice share the same design, with the only difference being their colours. Alice wears white while Alter Alice wears black, helping to show that they are mirror versions of the same character.' +
          '\n\nEnvironment & Key Props\nThe environment is inspired by Alice\'s Adventures in Wonderland, using a simple and whimsical art style to create a mysterious Wonderland atmosphere. Important props, such as the card-themed boxes, are based on the playing card elements that are strongly associated with the story.' +
          '\n\nUI Design\nThe pause menu, game over screen, and death screen all feature the Cheshire Cat\'s face in the background, subtly suggesting his connection to the strange events and chaos happening throughout Wonderland.' +
          '\n\nThe buttons are designed with a card-inspired style, using heart, spade, and diamond symbols to match the Wonderland aesthetic. When selected, the shapes rotate to show that they are selected.',
        images: [
          '/images/Projects/Wonderland/Wonderland4.png',
          '/images/Projects/Wonderland/Wonderland5.png',
          '/images/Projects/Wonderland/Wonderland6.png',
          '/images/Projects/Wonderland/Wonderland7.png',
        ],
        imageLinks: [
          { label: 'Character Design', imageIndex: 0 },
          { label: 'Environment', imageIndex: 1 },
          { label: 'Key Props', imageIndex: 2 },
          { label: 'UI Design', imageIndex: 3 },
        ],
      },
    ],
  },
]

export const PROJECT_CATEGORIES = ['Design', 'Game', 'Others']

export const PROJECT_TOOLS = {
  unity: { name: 'Unity', image: '/images/Tools/Unity.png' },
  csharp: { name: 'C#', image: '/images/Tools/csharp.png' },
  'c++': { name: 'C++', image: '/images/Tools/c++.png' },
  maya: { name: 'Maya', image: '/images/Tools/maya.png' },
  procreate: { name: 'Procreate', image: '/images/Tools/procreate.jpeg' },
  figma: { name: 'Figma', image: '/images/Tools/figma.png' },
  react: { name: 'React' },
  css: { name: 'CSS' },
  photoshop: { name: 'Photoshop' },
}

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
