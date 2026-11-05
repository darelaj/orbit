export const slots = ['Head', 'Hands', 'Body', 'Feet', 'Sphere', 'Rope'] as const;
export type Slot = (typeof slots)[number];
export type DemoRelic = {
  id: string;
  name: string;
  set: string;
  slot: Slot;
  image: string;
  main: [string, string];
  substats: [string, string][];
  equipped: boolean;
  locked: boolean;
};

export const demoRelics: DemoRelic[] = [
  { id: 'demo-head-01', name: "Pioneer's Heatproof Shell", set: 'Pioneer Diver of Dead Waters', slot: 'Head', image: '117_0.png', main: ['HP', '705'], substats: [['CRIT Rate', '8.7%'], ['CRIT DMG', '17.4%'], ['ATK', '8.6%'], ['SPD', '2']], equipped: true, locked: true },
  { id: 'demo-hands-01', name: "Pioneer's Lacuna Compass", set: 'Pioneer Diver of Dead Waters', slot: 'Hands', image: '117_1.png', main: ['ATK', '352'], substats: [['CRIT Rate', '5.8%'], ['CRIT DMG', '23.3%'], ['ATK', '8.6%'], ['DEF', '19']], equipped: true, locked: true },
  { id: 'demo-body-01', name: "Pioneer's Sealed Lead Apron", set: 'Pioneer Diver of Dead Waters', slot: 'Body', image: '117_2.png', main: ['CRIT DMG', '64.8%'], substats: [['CRIT Rate', '11.6%'], ['ATK', '8.6%'], ['SPD', '4'], ['HP', '38']], equipped: true, locked: true },
  { id: 'demo-feet-01', name: "Pioneer's Starfaring Anchor", set: 'Pioneer Diver of Dead Waters', slot: 'Feet', image: '117_3.png', main: ['SPD', '25'], substats: [['CRIT Rate', '8.7%'], ['CRIT DMG', '17.4%'], ['ATK', '8.6%'], ['HP', '38']], equipped: true, locked: true },
  { id: 'demo-sphere-01', name: "Izumo's Magatsu no Morokami", set: 'Izumo Gensei and Takama Divine Realm', slot: 'Sphere', image: '314_0.png', main: ['Lightning DMG', '38.8%'], substats: [['CRIT Rate', '5.8%'], ['CRIT DMG', '17.4%'], ['ATK', '12.9%'], ['SPD', '2']], equipped: true, locked: true },
  { id: 'demo-rope-01', name: "Izumo's Blades of Origin and End", set: 'Izumo Gensei and Takama Divine Realm', slot: 'Rope', image: '314_1.png', main: ['ATK', '43.2%'], substats: [['CRIT Rate', '8.7%'], ['CRIT DMG', '17.4%'], ['SPD', '4'], ['HP', '38']], equipped: true, locked: true },
  { id: 'demo-head-02', name: "Pioneer's Heatproof Shell", set: 'Pioneer Diver of Dead Waters', slot: 'Head', image: '117_0.png', main: ['HP', '705'], substats: [['CRIT Rate', '5.8%'], ['CRIT DMG', '11.6%'], ['SPD', '6'], ['DEF', '9.7%']], equipped: false, locked: false },
  { id: 'demo-feet-02', name: "Pioneer's Starfaring Anchor", set: 'Pioneer Diver of Dead Waters', slot: 'Feet', image: '117_3.png', main: ['ATK', '43.2%'], substats: [['CRIT Rate', '8.7%'], ['CRIT DMG', '23.3%'], ['SPD', '2'], ['DEF', '19']], equipped: false, locked: false },
];
