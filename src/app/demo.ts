export const slots = ['Head', 'Hands', 'Body', 'Feet', 'Sphere', 'Rope'] as const;
export type Slot = (typeof slots)[number];
export const slotNames: Record<Slot, string> = {
  Head: 'Head', Hands: 'Hands', Body: 'Body', Feet: 'Feet', Sphere: 'Planar Sphere', Rope: 'Link Rope',
};
export type DemoRelic = {
  id: string;
  name: string;
  shortName: string;
  set: string;
  shortSet: string;
  slot: Slot;
  image: string;
  main: [string, string];
  substats: [string, string][];
  equipped: boolean;
  locked: boolean;
};

const pioneer = 'Pioneer Diver of Dead Waters';
const izumo = 'Izumo Gensei and Takama Divine Realm';

export const demoRelics: DemoRelic[] = [
  { id: 'demo-head-01', name: "Pioneer's Heatproof Shell", shortName: 'Heatproof Shell', set: pioneer, shortSet: 'Pioneer Diver', slot: 'Head', image: '117_0.png', main: ['HP', '705'], substats: [['CRIT Rate', '8.7%'], ['CRIT DMG', '17.4%'], ['ATK', '8.6%'], ['SPD', '2']], equipped: true, locked: true },
  { id: 'demo-hands-01', name: "Pioneer's Lacuna Compass", shortName: 'Lacuna Compass', set: pioneer, shortSet: 'Pioneer Diver', slot: 'Hands', image: '117_1.png', main: ['ATK', '352'], substats: [['CRIT Rate', '5.8%'], ['CRIT DMG', '23.3%'], ['ATK', '4.3%'], ['DEF', '21']], equipped: true, locked: true },
  { id: 'demo-body-01', name: "Pioneer's Sealed Lead Apron", shortName: 'Sealed Lead Apron', set: pioneer, shortSet: 'Pioneer Diver', slot: 'Body', image: '117_2.png', main: ['CRIT DMG', '64.8%'], substats: [['CRIT Rate', '8.7%'], ['ATK', '8.6%'], ['SPD', '4'], ['HP', '38']], equipped: true, locked: true },
  { id: 'demo-feet-01', name: "Pioneer's Starfaring Anchor", shortName: 'Starfaring Anchor', set: pioneer, shortSet: 'Pioneer Diver', slot: 'Feet', image: '117_3.png', main: ['ATK', '43.2%'], substats: [['CRIT Rate', '11.6%'], ['CRIT DMG', '11.7%'], ['SPD', '2'], ['DEF', '21']], equipped: true, locked: true },
  { id: 'demo-sphere-01', name: "Izumo's Magatsu no Morokami", shortName: 'Magatsu no Morokami', set: izumo, shortSet: 'Izumo Gensei', slot: 'Sphere', image: '314_0.png', main: ['Lightning DMG', '38.8%'], substats: [['CRIT Rate', '5.8%'], ['CRIT DMG', '17.4%'], ['ATK', '8.6%'], ['HP', '38']], equipped: true, locked: true },
  { id: 'demo-rope-01', name: "Izumo's Blades of Origin and End", shortName: 'Blades of Origin and End', set: izumo, shortSet: 'Izumo Gensei', slot: 'Rope', image: '314_1.png', main: ['ATK', '43.2%'], substats: [['CRIT Rate', '8.7%'], ['CRIT DMG', '17.4%'], ['SPD', '4'], ['DEF', '21']], equipped: true, locked: true },
  { id: 'demo-body-02', name: "Pioneer's Sealed Lead Apron", shortName: 'Sealed Lead Apron', set: pioneer, shortSet: 'Pioneer Diver', slot: 'Body', image: '117_2.png', main: ['CRIT Rate', '32.4%'], substats: [['CRIT DMG', '23.3%'], ['ATK', '4.3%'], ['SPD', '4'], ['HP', '38']], equipped: false, locked: false },
  { id: 'demo-feet-02', name: "Pioneer's Starfaring Anchor", shortName: 'Starfaring Anchor', set: pioneer, shortSet: 'Pioneer Diver', slot: 'Feet', image: '117_3.png', main: ['SPD', '25'], substats: [['CRIT Rate', '5.8%'], ['CRIT DMG', '17.4%'], ['ATK', '8.6%'], ['DEF', '21']], equipped: false, locked: false },
];
