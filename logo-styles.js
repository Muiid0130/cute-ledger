// 第二輪 logo：四種風格 × 貓狗。每個函式回傳 64×64 的 SVG 字串。
const INK = { cat: "#4A3346", dog: "#3A3550" };

// 1. 蠟筆手繪：顆粒筆觸＋故意塗出線外的色塊
const CRAYON_DEFS = `<defs>
  <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="4" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.55" result="mask"/>
    <feComposite in="SourceGraphic" in2="mask" operator="in" result="tex"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="9" result="wob"/>
    <feDisplacementMap in="tex" in2="wob" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>
  </filter></defs>`;
function crayon(kind) {
  const ink = INK[kind];
  if (kind === "cat") {
    const ears = "M15 30L13 10l12 8zM49 30l2-20-12 8z";
    const head = "M32 16c13 0 20 8 20 19s-9 19-20 19-20-7-20-19 7-19 20-19z";
    return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">${CRAYON_DEFS}
      <g filter="url(#crayon)">
        <g transform="translate(1.6 1.8)"><path d="${ears}" fill="#FFB3C8"/><path d="${head}" fill="#FFD1DE"/></g>
        <path d="M17 26l-1-11 7 5zM47 26l1-11-7 5z" fill="#FF8FB1"/>
        <ellipse cx="20" cy="40" rx="4" ry="2.6" fill="#FF8FB1"/><ellipse cx="44" cy="40" rx="4" ry="2.6" fill="#FF8FB1"/>
        <g fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ears}"/><path d="${head}"/>
          <path d="M23 33q3-3 6 0M35 33q3-3 6 0"/><path d="M32 40c-1 2-3.5 2.2-4.5.6M32 40c1 2 3.5 2.2 4.5.6"/>
          <path d="M6 36l8 1.5M6 42l8-1.5M58 36l-8 1.5M58 42l-8-1.5" stroke-width="2"/></g>
        <path d="M30 37.3h4l-2 2.2z" fill="${ink}"/>
      </g></svg>`;
  }
  const head = "M32 14c12 0 19 8 19 19 0 12-8 20-19 20s-19-8-19-20c0-11 7-19 19-19z";
  const ears = "M16 17c-7 1-10 12-8 19 1 5 7 5 8 1l3-15zM48 17c7 1 10 12 8 19-1 5-7 5-8 1l-3-15z";
  return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">${CRAYON_DEFS}
    <g filter="url(#crayon)">
      <g transform="translate(1.6 1.8)"><path d="${head}" fill="#F4D3A6"/><path d="${ears}" fill="#B98558"/></g>
      <path d="M37 22c4-3 9-1 9 3s-3 8-7 7-5-7-2-10z" fill="#DDB07A"/>
      <ellipse cx="32" cy="42" rx="10" ry="7" fill="#FFF3E0"/>
      <ellipse cx="19" cy="38" rx="3.4" ry="2.2" fill="#FF9FB3"/><ellipse cx="45" cy="38" rx="3.4" ry="2.2" fill="#FF9FB3"/>
      <g fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="${head}"/><path d="${ears}"/>
        <path d="M32 41v2.5M32 43.5c-1.5 2-4 2-5.2.4M32 43.5c1.5 2 4 2 5.2.4"/></g>
      <circle cx="24.5" cy="31" r="2.6" fill="${ink}"/><circle cx="39.5" cy="31" r="2.6" fill="${ink}"/>
      <path d="M29 37.5c1.8-1.3 4.2-1.3 6 0-.5 2.2-2 3.2-3 3.2s-2.5-1-3-3.2z" fill="${ink}"/>
      <path d="M30 46c0 3.4 4 3.4 4 0" fill="#FF8FA3"/>
    </g></svg>`;
}

// 2. 極簡一筆畫：單色細線，只點一個顏色
function line(kind) {
  const ink = INK[kind];
  const S = `fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"`;
  if (kind === "cat") {
    return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
      <path ${S} d="M22 57c-5-5-6-16-3-26l-3-18 10 7c4-1.5 8-1.5 12 0l10-7-3 18c3 10 2 21-3 26-5 3-15 3-20 0-5-2-11 0-12-5s5-7 7-3"/>
      <path ${S} d="M26 33v2M38 33v2M32 40c-1 1.6-3 1.8-3.8.6M32 40c1 1.6 3 1.8 3.8.6M28 57v-5M36 57v-5M14 37l6 1M14 41l6-.8M50 37l-6 1M50 41l-6-.8"/>
      <path d="M30.4 37.4h3.2l-1.6 1.7z" fill="#FF8FB1"/></svg>`;
  }
  return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
    <path ${S} d="M22 19c4-4 16-4 20 0 6-3 11 3 10 12-1 6-6 7-7 3 2 8 1 17-4 22-4 3-14 3-18 0-5-5-6-14-4-22-1 4-6 3-7-3-1-9 4-15 10-12M45 52c5-2 8-6 7-12"/>
    <path ${S} d="M26.5 31v2.2M37.5 31v2.2M32 40.5v1.5M32 42c-1.2 1.6-3 1.6-3.8.4M32 42c1.2 1.6 3 1.6 3.8.4M28 58v-5M36 58v-5"/>
    <path d="M29.8 37.6c1.4-1 3-1 4.4 0-.4 1.6-1.4 2.3-2.2 2.3s-1.8-.7-2.2-2.3z" fill="${ink}"/>
    <path d="M30.5 43.4c0 2.8 3 2.8 3 0" fill="#FF8FA3"/></svg>`;
}

// 3. 圓滾滾大頭：沒有黑色外框，柔和色塊
function round(kind) {
  const ink = INK[kind];
  if (kind === "cat") {
    return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
      <ellipse cx="32" cy="59" rx="16" ry="2.6" fill="#000" opacity=".07"/>
      <path d="M13 30l1-17 13 9z" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M51 30l-1-17-13 9z" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M16.5 25l.5-8 6 4.2z" fill="#FFC2D4" stroke="#FFC2D4" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M47.5 25l-.5-8-6 4.2z" fill="#FFC2D4" stroke="#FFC2D4" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="32" cy="38" rx="23" ry="19.5" fill="#fff"/>
      <ellipse cx="32" cy="45" rx="19" ry="11" fill="#FFF1F5"/>
      <ellipse cx="24" cy="37" rx="2" ry="2.7" fill="${ink}"/><ellipse cx="40" cy="37" rx="2" ry="2.7" fill="${ink}"/>
      <circle cx="24.7" cy="36" r=".8" fill="#fff"/><circle cx="40.7" cy="36" r=".8" fill="#fff"/>
      <ellipse cx="18.5" cy="43" rx="4.2" ry="2.8" fill="#FFB8CB" opacity=".8"/><ellipse cx="45.5" cy="43" rx="4.2" ry="2.8" fill="#FFB8CB" opacity=".8"/>
      <ellipse cx="32" cy="41.5" rx="1.6" ry="1.1" fill="#FF8FB1"/>
      <path d="M32 42.6c-.6 1.3-2.4 1.4-3 .4M32 42.6c.6 1.3 2.4 1.4 3 .4" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/></svg>`;
  }
  return `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
    <ellipse cx="32" cy="59" rx="16" ry="2.6" fill="#000" opacity=".07"/>
    <ellipse cx="11.5" cy="36" rx="6.5" ry="12" transform="rotate(14 11.5 36)" fill="#C4946A"/>
    <ellipse cx="52.5" cy="36" rx="6.5" ry="12" transform="rotate(-14 52.5 36)" fill="#C4946A"/>
    <ellipse cx="32" cy="36" rx="22" ry="20.5" fill="#F4D6AE"/>
    <ellipse cx="40.5" cy="31" rx="6.5" ry="6" fill="#E6C08E"/>
    <ellipse cx="32" cy="45" rx="10.5" ry="7.5" fill="#FFF5E6"/>
    <ellipse cx="24" cy="33" rx="2" ry="2.7" fill="${ink}"/><ellipse cx="40" cy="33" rx="2" ry="2.7" fill="${ink}"/>
    <circle cx="24.7" cy="32" r=".8" fill="#fff"/><circle cx="40.7" cy="32" r=".8" fill="#fff"/>
    <ellipse cx="17" cy="41" rx="4" ry="2.6" fill="#FFB3C1" opacity=".8"/><ellipse cx="47" cy="41" rx="4" ry="2.6" fill="#FFB3C1" opacity=".8"/>
    <ellipse cx="32" cy="41" rx="3" ry="2.1" fill="${ink}"/>
    <path d="M32 43v1.4M32 44.4c-.9 1.2-2.4 1.2-3 .3M32 44.4c.9 1.2 2.4 1.2 3 .3" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M30.6 45.6c0 2.6 2.8 2.6 2.8 0" fill="#FF8FA3"/></svg>`;
}

// 4. 像素風：16×16 點陣
const PIX = {
  cat: { rows: [
    "................",
    "..K..........K..",
    "..KK........KK..",
    "..KPK......KPK..",
    "..KPPKKKKKKPPK..",
    "..KWWWWNNWWWWK..",
    ".KWWWWWWWWWWWWK.",
    ".KWWKWWWWWWKWWK.",
    ".KWWKWWWWWWKWWK.",
    ".KPWWWWNNWWWWPK.",
    ".KWWWWKWWKWWWWK.",
    "..KWWWWKKWWWWK..",
    "...KKWWWWWWKK...",
    ".....KKKKKK.....",
    "................",
    "................"],
    pal: { K: "#4A3346", W: "#FFFFFF", P: "#FFB8CB", N: "#FF8FB1" } },
  dog: { rows: [
    "................",
    "....KKKKKKKK....",
    "..KKFFFFFFFFKK..",
    ".KEKFFFFFFSSKEK.",
    "KEEKFFFFFSSSKEEK",
    "KEEKFFFFFFFFKEEK",
    "KEEKFKFFFFKFKEEK",
    "KEEKFKFFFFKFKEEK",
    "KEKFFFMMMMFFFKEK",
    ".KKFFMMKKMMFFKK.",
    "...KFMMMMMMFK...",
    "...KFMKMMKMFK...",
    "....KMMTTMMK....",
    ".....KKTTKK.....",
    "......KKKK......",
    "................"],
    pal: { K: "#3A3550", F: "#F4D6AE", E: "#B98558", S: "#E0B884", M: "#FFF5E6", T: "#FF8FA3" } },
};
function pixel(kind) {
  const { rows, pal } = PIX[kind];
  let r = "";
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) r += `<rect x="${x * 4}" y="${y * 4 + 2}" width="4" height="4" fill="${pal[ch]}"/>`; }));
  return `<svg viewBox="0 0 64 64" class="mascot" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}

if (typeof module !== "undefined") module.exports = { crayon, line, round, pixel };
