export type Flavor = {
  id: string;
  name: string;
  short: string;
  bag: string; // bag body color
  bagDark: string; // shading / crimp
  card: string; // shop card bg
  bg: string; // hero page bg
  ring: string; // hero ring tone
  ink: string; // text on bag
  chip: string; // chip tint
  note: string;
  price: number;
};

export const FLAVORS: Flavor[] = [
  { id: "classic", name: "Classic", short: "Classic", bag: "#ffd23f", bagDark: "#e0a800", card: "#f7b500", bg: "#f2c200", ring: "#d9a900", ink: "#c1121f", chip: "#f6d36b", note: "Just potato, oil & salt.", price: 2.49 },
  { id: "sour-cream", name: "Sour Cream & Onion", short: "Sour Cream", bag: "#2fb34a", bagDark: "#16812d", card: "#21a33f", bg: "#b8c400", ring: "#97a300", ink: "#ffffff", chip: "#efe0a0", note: "Cool, tangy, herby.", price: 2.49 },
  { id: "barbecue", name: "Barbecue", short: "BBQ", bag: "#5a2416", bagDark: "#2f0f07", card: "#d8241f", bg: "#b5281c", ring: "#8f1d13", ink: "#ffb703", chip: "#d98a3d", note: "Sweet smoke, slow heat.", price: 2.49 },
  { id: "salt-vinegar", name: "Salt & Vinegar", short: "Salt & Vin", bag: "#2d9bf0", bagDark: "#1667b5", card: "#2a8ff0", bg: "#1f7fe0", ring: "#1765b8", ink: "#ffffff", chip: "#f3e3a6", note: "Sharp. Bright. Puckery.", price: 2.49 },
  { id: "flamin-hot", name: "Flamin' Hot", short: "Flamin'", bag: "#e3170a", bagDark: "#8f0a03", card: "#e1140a", bg: "#e01434", ring: "#b80d28", ink: "#ffd60a", chip: "#ff4d2e", note: "Loud heat. No apologies.", price: 2.79 },
  { id: "cheddar", name: "Cheddar & Sour Cream", short: "Cheddar", bag: "#ff8c1a", bagDark: "#c25e00", card: "#f39200", bg: "#f08000", ring: "#c76a00", ink: "#ffffff", chip: "#ffb347", note: "Sharp cheddar, soft finish.", price: 2.49 },
  { id: "all-dressed", name: "All Dressed", short: "All Dressed", bag: "#7b3fe4", bagDark: "#4a1ea3", card: "#6c2fd8", bg: "#6a2bd1", ring: "#5320ab", ink: "#ffd23f", chip: "#e0a85a", note: "Every seasoning. At once.", price: 2.59 },
  { id: "sweet-heat", name: "Sweet Southern Heat BBQ", short: "Sweet Heat", bag: "#b3122e", bagDark: "#6b0717", card: "#b01030", bg: "#9e0f2a", ring: "#7c0a20", ink: "#ffd23f", chip: "#e2763a", note: "Honey up front, fire behind.", price: 2.79 },
  { id: "bacon-cheese", name: "Bacon Grilled Cheese", short: "Bacon Cheese", bag: "#f2b705", bagDark: "#b07f00", card: "#f0a500", bg: "#e89b00", ring: "#c47f00", ink: "#7a1e0b", chip: "#f4c35a", note: "Diner booth in a bag.", price: 2.79 },
];

export const PACK_PRICE = 5.98;

export function wrapIndex(i: number, n: number) {
  return ((i % n) + n) % n;
}
