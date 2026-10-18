/**
 * constants/data.js
 * Centralised data for the portfolio.
 * Edit this file to update content without touching component logic.
 */

import { withBaseAssetUrls } from '../utils/assetUrl'

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
export const SKILLS = withBaseAssetUrls([
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
      'AWS',
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
])

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
export const PROJECTS = withBaseAssetUrls([
  {
    id: 'boba-time',
    title: 'Boba Time',
    category: 'Game',
    summary: 'Developed a bubble tea simulation game from scratchwith a team of 9 for a school project. Designed gameplay mechanics, built all 3 levels in Unity (C#), created 3D assets in Maya, and designed the interfaces in Figma and Procreate.',
    description:
      'Boba Time is a 3D single-player game where you inherit a bubble tea shop and chase your absent father\'s legacy as the best boba maker. The game tasks you with making bubble tea, serving customers, and managing the store across 3 levels — culminating in a head-to-head competition. I designed the gameplay mechanics and built all 3 levels in Unity using C#, and served as the main artist — modeling the shop, equipment, and characters in Maya, and designing all interfaces with Procreate and Figma.',
    type: 'Game Development & 3D Art',
    role: 'Gameplay Designer, Level Designer & Lead Artist',
    tools: ['unity', 'csharp', 'maya', 'procreate', 'figma'],
    date: '2024 - 2025',
    links: [
      { label: '3D', href: '#' },
      { label: 'Designer', href: '#' },
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
          'The core gameplay loop focuses on receiving, preparing, and serving bubble tea orders within a time limit.' +
          '\n\nPlayers must identify customer requests, select the correct ingredients, prepare drinks, and complete orders while managing an increasingly demanding queue.' +
          '\n\nThe gameplay is designed around three key elements:' +
          '\n\n- **Accuracy:** Players must correctly prepare orders using the required tea bases and toppings.' +
          '\n- **Time Management:** Players balance preparation time against incoming customer demands.' +
          '\n- **Prioritisation:** Different customer behaviours and preparation requirements encourage players to decide which orders to complete first.' +
          '\n\nAs players progress, additional mechanics increase the complexity of decision-making while building upon previously learned systems.' +
          '\n\n**Level 1 — Learning the Core Loop**\n\n**Design Goal:** Familiarise players with the core mechanics before introducing more complex challenges.\n\nIntroduces the drink-making process through a tutorial, allowing players to learn how to prepare and serve orders. Special customer types are gradually introduced to encourage players to adapt their workflow.' +
          '\n\n**Level 2 — Managing Complexity**\n\n**Design Goal:** Increase gameplay complexity by encouraging multitasking and task prioritisation.\n\nIntroduces shop upgrades, food preparation mechanics, and more demanding customer types. Players must manage additional preparation steps while balancing customer patience and incoming orders.' +
          '\n\n**Level 3 — Mastery & Competition**\n\n**Design Goal:** Challenge players to apply previously learned mechanics while balancing speed and accuracy.\n\nTransforms the gameplay into a timed competition. A combo system rewards consecutive correctly completed orders, encouraging consistent performance. The player\'s final score determines the narrative ending.' +
          '\n\nThe difficulty was structured so players could first understand the core mechanics before being introduced to additional systems, creating a gradual progression from learning to mastery.\n\nChallenges\n\nDuring development, the initial gameplay loop of preparing and serving bubble tea became repetitive, with limited variety in player interactions. To address this, we introduced ingredient-specific preparation mechanics and a table-cleaning system to encourage multitasking, quick decision-making, and task prioritisation.\n\nAs players progressed, new levels felt too similar despite introducing additional ingredients. To create a more noticeable difficulty curve, we introduced unique customer behaviours, a furniture upgrade system, and food preparation mechanics to provide new challenges and increase gameplay complexity.\n\nHowever, player feedback indicated that Level 2 became too difficult due to the additional mechanics. To balance the difficulty, we introduced a purchasable upgrade that increases customer patience, allowing players to manage their tasks more comfortably without removing the challenge.\n\nFor the final level, we introduced a combo system that rewards consecutive correctly completed orders. This encourages players to maintain accuracy and consistency while providing a stronger incentive to perform well during the final competition.',
        images: ['/images/Projects/BobaTime/gameplay-loop.png', '/images/Projects/BobaTime/BobaTime1.jpg', '/images/Projects/BobaTime/BobaTime2.jpg', '/images/Projects/BobaTime/BobaTime3.jpg', '/images/Projects/BobaTime/BobaTime4.jpg', '/images/Projects/BobaTime/BobaTime5.jpg' ,'/images/Projects/BobaTime/BobaTime6.jpg', '/images/Projects/BobaTime/design-decisions.png'],
        imageLinks: [
          { label: 'Challenges', imageIndex: 7 },
          { label: 'core gameplay loop', imageIndex: 0 },
          { label: 'tea base', imageIndex: 1 },
          { label: 'toppings', imageIndex: 2 },
          { label: 'special customer types', imageIndex: 3 },
          { label: 'shop upgrades', imageIndex: 5 },
          { label: 'More demanding customer types', imageIndex: 4 },
          { label: 'final score', imageIndex: 6 },
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
      { label: 'Designer', href: '#' },
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
    id: 'muju',
    title: 'Muju',
    detailTitle: 'Muju Card Game',
    category: 'Others',
    summary: 'Created Muju, a single-player tabletop dungeon card game, with a team of four, working within a strict limit of 50 cards and 20 tokens. As Lead Gameplay Designer and Designer, I was responsible for designing the core gameplay mechanics and card layouts.',
    description:
      'Created Muju, a single-player tabletop dungeon card game, with a team of four, working within a strict limit of 50 cards and 20 tokens. As Lead Gameplay Designer and Designer, I was responsible for designing the core gameplay mechanics and card layouts.',
    type: 'Card Game',
    role: 'Gameplay Designer and Designer',
    tools: ['figma', 'procreate'],
    date: '2024',
    links: [
      { label: 'Card Game', href: '#' },
      { label: 'Designer', href: '#' },
    ],
    image: '/images/Projects/Muju.png',
    pages: [
      {
        title: 'Overview',
        summary:
          'Muju is a single-player dungeon crawler that combines turn-based combat, exploration, and resource management into a strategic tabletop experience.\n\nPlayers navigate a dungeon deck containing monsters, random events, and opportunities to acquire resources. With limited health, coins, and inventory space, each decision requires players to consider the risks of continuing their exploration versus preparing for future encounters.\n\nEvery four rounds, players encounter a Muju, a powerful enemy with unique abilities and special combat conditions. Defeating three Mujus completes the game.\n\nThe game was designed around a strict component limit of 50 cards and 20 tokens, encouraging the use of multipurpose cards and streamlined mechanics.',
        image: '/images/Projects/Muju/Muju2.png',
      },
      {
        title: 'Gameplay',
        summary:
          '**Core Gameplay**\n\nThe core gameplay revolves around choosing between **preparing at the store or exploring the dungeon**, while managing resources to survive increasingly challenging encounters.\n\nPlayers begin by selecting one of three roles: Mage, Warrior, or Archer. Each role provides different starting attributes that influence combat strategies.\n\nEach round, players choose between two actions:\n\n- **Visit the Store:** Draw three item cards and purchase one, managing a limited inventory of two items.\n- **Explore the Dungeon:** Draw a dungeon card that triggers combat or a random scenario, offering potential rewards or consequences.\n\nThe gameplay focuses on three key systems:\n\n- **Risk vs. Reward:** Decide whether to continue exploring for rewards or visit the store to prepare for upcoming encounters.\n- **Resource Management:** Manage health, coins, item durability, and limited inventory space.\n- **Turn-Based Combat:** Use character attributes, dice rolls, and equipment bonuses to overcome enemies.\n\nEvery four rounds, players face a Muju encounter that tests their preparation and resource management. Defeating three Mujus completes the game.\n\n**Turn-Based Combat**\n\n**Design Goal:** Create a combat system that combines strategic preparation with unpredictable outcomes.\n\nCombat uses dice rolls and character attack values to determine the outcome of each exchange.\n\nPlayers roll a six-sided die (D6) and add their attack value, while enemies roll a four-sided die (D4) and add their attack value.\n\nPlayers can use equipment to increase their attack power, creating decisions around when to spend limited item durability.\n\nThe difference between attack totals determines the damage dealt, and combat continues until one side is defeated.\n\n**Inventory & Resource Management**\n\n**Design Goal:** Encourage meaningful decisions through limited inventory capacity and consumable equipment.\n\nPlayers can hold a maximum of two items, requiring them to carefully consider which equipment to keep or replace.\n\nAt the store, players draw three items and may purchase one using their available coins. Items provide combat bonuses but have limited durability, eventually breaking or returning to the item deck.\n\nThis creates a trade-off between saving resources, upgrading equipment, and preparing for stronger encounters.\n\n**Dungeon Exploration & Encounters**\n\n**Design Goal:** Introduce uncertainty and encourage players to adapt their strategies.\n\nExploring the dungeon reveals either a monster or a scenario card.\n\nMonster encounters reward players with coins upon victory, providing resources for future equipment purchases.\n\nScenario cards introduce unpredictable events, ranging from beneficial rewards to penalties such as losing health or facing multiple enemies simultaneously.\n\nThese encounters encourage players to adapt their decisions based on their current resources and the risks of continuing their exploration.\n\n**Muju Encounters & Progression**\n\n**Design Goal:** Establish recurring milestones that test the player\'s preparation and strategic planning.\n\nEvery four rounds, players encounter a Muju, a powerful enemy with unique abilities and combat conditions.\n\nUnlike regular monsters, Mujus introduce additional challenges that require players to reconsider their equipment choices and combat approach.\n\nDefeating a Muju rewards players with its card, serving as a progression marker toward the final objective of defeating three Mujus.\n\nThis structure creates a recurring cycle of exploration, preparation, and major encounters.',
        image: '/images/Projects/Muju/Muju1.png',
      },
      {
        title: 'Visual Design',
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
          'Wonderland is a 2D cooperative puzzle platformer where two players control Alice and Alter Alice as they attempt to escape Wonderland.' +
          '\n\nThe central mechanic is that both players experience the same level from opposite perspectives. Alice sees the world normally, while Alter Alice experiences it upside down. This creates different paths, obstacles, and interactions for each player.' +
          '\n\nThe game is designed around communication and cooperation, requiring both players to understand how their individual actions affect the other player\'s environment.',
        video: 'https://youtu.be/garvaJ6r98w',
        download: {
          label: 'Download Wonderland',
          href: '/images/Projects/Wonderland/Wonderland.zip',
        },
      },
      {
        title: 'Gameplay',
        summary:
          'The core gameplay revolves around solving environmental puzzles using each character\'s different perspective and abilities.' +
          '\n\n**Opposite Perspectives**\n\n**Design Goal:** Create asymmetric gameplay where each player experiences different challenges within the same environment.\n\nAlice and Alter Alice navigate the same level from opposite orientations. Platforms and obstacles accessible to one character may be inaccessible to the other.\n\nThis encourages players to communicate about their surroundings and coordinate their movements to overcome obstacles.\n\n**Character Size Manipulation**\n\n**Design Goal:** Introduce complementary abilities that encourage players to approach obstacles differently.\n\nPlayers can manipulate their character sizes, causing one Alice to become smaller while the other becomes larger.\n\n- **Smaller Character:** Can travel through narrow spaces and access restricted areas.\n- **Larger Character:** Can interact with heavier objects and reach otherwise inaccessible areas.\n\nThis creates opportunities for puzzles where players must determine which character should perform a particular action.\n\n**Cooperative Puzzle Interaction**\n\n**Design Goal:** Design puzzles that require both players to contribute towards a shared solution.\n\nEnvironmental objects can be manipulated by one player to create new opportunities for the other.\n\nFor example, Alter Alice can push a box from her side of the environment, causing it to fall into Alice\'s side and become a platform that allows her to reach a previously inaccessible area.\n\nBy combining perspective, character size, and shared environmental interactions, the puzzles encourage players to think beyond their individual surroundings and consider how their actions affect their partner.',
        images: [
          '/images/Projects/Wonderland/Wonderland1.jpg',
          '/images/Projects/Wonderland/Wonderland2.jpg',
          '/images/Projects/Wonderland/Wonderland3.jpg',
        ],
        imageLinks: [
          { label: 'box', imageIndex: 0 },
          { label: 'narrow spaces', imageIndex: 2 },
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
])

export const PROJECT_CATEGORIES = ['Design', 'Game', 'Others']

export const PROJECT_TOOLS = withBaseAssetUrls({
  unity: { name: 'Unity', image: '/images/Tools/Unity.png' },
  csharp: { name: 'C#', image: '/images/Tools/csharp.png' },
  'c++': { name: 'C++', image: '/images/Tools/c++.png' },
  maya: { name: 'Maya', image: '/images/Tools/maya.png' },
  procreate: { name: 'Procreate', image: '/images/Tools/procreate.jpeg' },
  figma: { name: 'Figma', image: '/images/Tools/figma.png' },
  react: { name: 'React' },
  css: { name: 'CSS' },
  photoshop: { name: 'Photoshop' },
})

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
