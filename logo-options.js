// 三款 logo 候選（viewBox 64×64）。CAT_* / DOG_* 會在 build 時換成主題色。
const G = (ink) => `stroke="${ink}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;
const CAT = { ink: "#4A3346", fur: "#FFFFFF", inner: "#FFC2D4", blush: "#FFB8CB", accent: "#FF9DBB" };
const DOG = { ink: "#3A3550", fur: "#F7E4C6", ear: "#C99A6B", patch: "#E4C193", muzzle: "#FFF7EA", blush: "#FFB3C1", tongue: "#FF8FA3" };
const GOLD = "#FFD66E", GOLD2 = "#FFC94A", GOLD3 = "#FFE9A8";
const dollar = (x, y, ink) => `<path d="M${x + 2.3} ${y - 2.7}c-.8-.9-4.3-1.2-4.6.4s4.8 1.3 4.6 3.3-3.8 1.9-4.8.6M${x} ${y - 5}v10" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`;

// 共用：貓頭（cx, cy 為臉中心）與狗頭
function catHead(cx, cy, eyes = "dots", r = 16) {
  const c = CAT, s = r / 16;
  const P = (x, y) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  const face = eyes === "happy"
    ? `<path d="M${P(-9, -1)}q${3 * s} ${-3 * s} ${6 * s} 0M${P(3, -1)}q${3 * s} ${-3 * s} ${6 * s} 0" fill="none" stroke="${c.ink}" stroke-width="2.2" stroke-linecap="round"/>`
    : eyes === "wink"
    ? `<circle cx="${cx - 6 * s}" cy="${cy - 1 * s}" r="${2.1 * s}" fill="${c.ink}"/><circle cx="${cx - 5.3 * s}" cy="${cy - 1.7 * s}" r="${.7 * s}" fill="#fff"/><path d="M${P(3, -1)}q${3 * s} ${-3 * s} ${6 * s} 0" fill="none" stroke="${c.ink}" stroke-width="2.2" stroke-linecap="round"/>`
    : `<circle cx="${cx - 6 * s}" cy="${cy - 1 * s}" r="${2.1 * s}" fill="${c.ink}"/><circle cx="${cx + 6 * s}" cy="${cy - 1 * s}" r="${2.1 * s}" fill="${c.ink}"/><circle cx="${cx - 5.3 * s}" cy="${cy - 1.7 * s}" r="${.7 * s}" fill="#fff"/><circle cx="${cx + 6.7 * s}" cy="${cy - 1.7 * s}" r="${.7 * s}" fill="#fff"/>`;
  return `<g ${G(c.ink)}>
    <path d="M${P(-14.5, -5)}L${P(-16, -18)}L${P(-6, -12)}z" fill="${c.fur}"/><path d="M${P(14.5, -5)}L${P(16, -18)}L${P(6, -12)}z" fill="${c.fur}"/>
    <path d="M${P(-12.5, -7.5)}L${P(-13.3, -14.5)}L${P(-8, -11.2)}z" fill="${c.inner}" stroke="none"/><path d="M${P(12.5, -7.5)}L${P(13.3, -14.5)}L${P(8, -11.2)}z" fill="${c.inner}" stroke="none"/>
    <path d="M${P(0, -14)}c${10 * s} 0 ${16 * s} ${6 * s} ${16 * s} ${14 * s}s${-7 * s} ${13 * s} ${-16 * s} ${13 * s}${""}s${-16 * s} ${-5 * s} ${-16 * s} ${-13 * s} ${6 * s} ${-14 * s} ${16 * s} ${-14 * s}z" fill="${c.fur}"/>
    <path d="M${P(-2.5, -11.5)}l${.7 * s} ${3.5 * s}M${P(0, -12)}v${4 * s}M${P(2.5, -11.5)}l${-.7 * s} ${3.5 * s}" stroke="${c.accent}"/>
    <path d="M${P(-2.2, 3)}h${4.4 * s}l${-2.2 * s} ${2.2 * s}z" fill="${c.accent}" stroke-width="1.6"/>
    <path d="M${P(0, 5.2)}c${-.8 * s} ${1.6 * s} ${-3 * s} ${1.8 * s} ${-3.8 * s} ${.5 * s}M${P(0, 5.2)}c${.8 * s} ${1.6 * s} ${3 * s} ${1.8 * s} ${3.8 * s} ${.5 * s}" fill="none" stroke-width="1.8"/>
  </g>${face}
  <ellipse cx="${cx - 10 * s}" cy="${cy + 4 * s}" rx="${2.6 * s}" ry="${1.5 * s}" fill="${c.blush}"/><ellipse cx="${cx + 10 * s}" cy="${cy + 4 * s}" rx="${2.6 * s}" ry="${1.5 * s}" fill="${c.blush}"/>`;
}
function dogHead(cx, cy, opts = {}, r = 16) {
  const c = DOG, s = r / 16;
  const P = (x, y) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  const leftEar = opts.flip
    ? `<path d="M${P(-11, -11)}c${-3 * s} ${-7 * s} ${-10 * s} ${-9 * s} ${-12 * s} ${-5 * s}c${-1 * s} ${3 * s} ${3 * s} ${7 * s} ${8 * s} ${9 * s}z" fill="${c.ear}"/>`
    : `<path d="M${P(-14, -11)}c${-6 * s} ${1 * s} ${-8 * s} ${10 * s} ${-6 * s} ${16 * s}c${1 * s} ${3 * s} ${5 * s} ${3 * s} ${6 * s} 0l${2 * s} ${-12 * s}z" fill="${c.ear}"/>`;
  const eyes = opts.happy
    ? `<path d="M${P(-9.5, -1)}q${3 * s} ${-3 * s} ${6 * s} 0M${P(3.5, -1)}q${3 * s} ${-3 * s} ${6 * s} 0" fill="none" stroke="${c.ink}" stroke-width="2.2" stroke-linecap="round"/>`
    : `<circle cx="${cx - 6.5 * s}" cy="${cy - 1 * s}" r="${2.1 * s}" fill="${c.ink}"/><circle cx="${cx + 6.5 * s}" cy="${cy - 1 * s}" r="${2.1 * s}" fill="${c.ink}"/><circle cx="${cx - 5.8 * s}" cy="${cy - 1.7 * s}" r="${.7 * s}" fill="#fff"/><circle cx="${cx + 7.2 * s}" cy="${cy - 1.7 * s}" r="${.7 * s}" fill="#fff"/>`;
  const mouth = opts.coin
    ? `<circle cx="${cx}" cy="${cy + 10.5 * s}" r="${5.5 * s}" fill="${GOLD}" stroke="${c.ink}" stroke-width="2.2"/>${dollar(cx, cy + 10.5 * s, c.ink)}`
    : `<path d="M${P(0, 5.5)}v${1.5 * s}M${P(0, 7)}c${-1 * s} ${1.4 * s} ${-2.8 * s} ${1.4 * s} ${-3.6 * s} ${.3 * s}M${P(0, 7)}c${1 * s} ${1.4 * s} ${2.8 * s} ${1.4 * s} ${3.6 * s} ${.3 * s}" fill="none" stroke="${c.ink}" stroke-width="1.8" stroke-linecap="round"/>
       ${opts.tongue ? `<path d="M${P(-2, 8.3)}c0 ${3.4 * s} ${4 * s} ${3.4 * s} ${4 * s} 0" fill="${c.tongue}" stroke="${c.ink}" stroke-width="1.8"/>` : ""}`;
  return `<g ${G(c.ink)}>
    <path d="M${P(0, -15)}c${10 * s} 0 ${16 * s} ${7 * s} ${16 * s} ${15 * s} 0 ${9 * s} ${-7 * s} ${14 * s} ${-16 * s} ${14 * s}s${-16 * s} ${-5 * s} ${-16 * s} ${-14 * s}c0 ${-8 * s} ${6 * s} ${-15 * s} ${16 * s} ${-15 * s}z" fill="${c.fur}"/>
    <path d="M${P(4, -7)}c${3 * s} ${-3 * s} ${8 * s} ${-1 * s} ${8 * s} ${3 * s}s${-3 * s} ${7 * s} ${-6 * s} ${6 * s}${""}s${-4 * s} ${-6 * s} ${-2 * s} ${-9 * s}z" fill="${c.patch}" stroke="none"/>
    ${leftEar}
    <path d="M${P(14, -11)}c${6 * s} ${1 * s} ${8 * s} ${10 * s} ${6 * s} ${16 * s}c${-1 * s} ${3 * s} ${-5 * s} ${3 * s} ${-6 * s} 0l${-2 * s} ${-12 * s}z" fill="${c.ear}"/>
    <ellipse cx="${cx}" cy="${cy + 6 * s}" rx="${7.5 * s}" ry="${5.2 * s}" fill="${c.muzzle}"/>
    <path d="M${P(-2.3, 3.3)}c${1.4 * s} ${-1 * s} ${3.2 * s} ${-1 * s} ${4.6 * s} 0-${.4 * s} ${1.6 * s}-${1.5 * s} ${2.3 * s}-${2.3 * s} ${2.3 * s}s${-1.9 * s} ${-.7 * s}-${2.3 * s}-${2.3 * s}z" fill="${c.ink}"/>
  </g>${eyes}${mouth}
  <ellipse cx="${cx - 11 * s}" cy="${cy + 4 * s}" rx="${2.4 * s}" ry="${1.4 * s}" fill="${c.blush}"/><ellipse cx="${cx + 11 * s}" cy="${cy + 4 * s}" rx="${2.4 * s}" ry="${1.4 * s}" fill="${c.blush}"/>`;
}

// A：坐著抱金幣
function optA(kind) {
  const c = kind === "cat" ? CAT : DOG, fur = c.fur;
  const tail = kind === "cat"
    ? `<path d="M44 55c9 1 14-5 12-12-1-4-5-4-5-1 1 4-1 8-8 8" fill="${fur}"/>`
    : `<path d="M45 51c6-2 9-7 8-13" fill="none" stroke-width="3.4"/><path d="M55 34l2-3M57 39l3-1" fill="none" stroke-width="1.8"/>`;
  return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true"><g ${G(c.ink)}>${tail}
    <path d="M17 58c-2-11 3-20 15-20s17 9 15 20z" fill="${fur}"/></g>
    ${kind === "cat" ? catHead(32, 24, "dots", 14) : dogHead(32, 24, { tongue: true }, 14)}
    <g ${G(c.ink)}><circle cx="32" cy="48" r="8" fill="${GOLD}"/></g>${dollar(32, 48, c.ink)}
    <g ${G(c.ink)}><ellipse cx="24.5" cy="47" rx="3.6" ry="3" fill="${fur}"/><ellipse cx="39.5" cy="47" rx="3.6" ry="3" fill="${fur}"/>
    <ellipse cx="25" cy="58" rx="4.5" ry="2.6" fill="${fur}"/><ellipse cx="39" cy="58" rx="4.5" ry="2.6" fill="${fur}"/></g></svg>`;
}
// B：從錢袋探頭
function optB(kind) {
  const c = kind === "cat" ? CAT : DOG, fur = c.fur;
  return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
    ${kind === "cat" ? catHead(32, 25, "happy", 15) : dogHead(32, 25, { happy: true, tongue: true }, 15)}
    <g ${G(c.ink)}>
    <path d="M12 43c-3 9-1 15 6 17 9 2 19 2 28 0 7-2 9-8 6-17z" fill="${GOLD}"/>
    <path d="M9 40c8 4 38 4 46 0-.5 3-1.5 4.5-3 5.5-9 3-31 3-40 0-1.5-1-2.5-2.5-3-5.5z" fill="${GOLD2}"/>
    <circle cx="32" cy="53" r="5.5" fill="${GOLD3}"/>
    <ellipse cx="22" cy="41" rx="4.2" ry="3" fill="${fur}"/><ellipse cx="42" cy="41" rx="4.2" ry="3" fill="${fur}"/></g>
    ${dollar(32, 53, c.ink)}
    <path d="M13 50c1 3 2 5 4 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>`;
}
// C：圓形貼紙（貓＝招財貓舉手；狗＝叼金幣）
function optC(kind) {
  const c = kind === "cat" ? CAT : DOG;
  const bg = kind === "cat" ? "#FFE4EE" : "#DDF5EC", ring = kind === "cat" ? "#FF9DBB" : "#8FD6BC";
  const inner = kind === "cat"
    ? `<g ${G(c.ink)}><path d="M42 40c1-6 2-12 3-16 1-4 7-4 7.5 0 .5 4-1.5 10-4 16z" fill="#fff"/>
         <path d="M45.5 21.5c.5-1.5 2-1.5 2.5 0M49 22c.5-1.5 2-1.2 2.3.3" fill="none" stroke-width="1.6"/></g>
       ${catHead(29, 34, "wink", 14)}
       <g ${G(c.ink)}><path d="M20 45.5c6 3 12 3 18 0" fill="none" stroke="#E0605E" stroke-width="3"/><circle cx="29" cy="49" r="3.4" fill="${GOLD}"/></g>`
    : dogHead(32, 30, { flip: true, coin: true }, 15);
  return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
    <circle cx="32" cy="32" r="29.5" fill="${bg}" stroke="${c.ink}" stroke-width="2.4"/>
    <circle cx="32" cy="32" r="26" fill="none" stroke="${ring}" stroke-width="1.8" stroke-dasharray="3 3.5"/>
    ${inner}</svg>`;
}
if (typeof module !== "undefined") module.exports = { optA, optB, optC };
