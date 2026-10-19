const raw = sessionStorage.getItem("petQuizDogPercent");
const headline = document.getElementById("headline");
const matchEl = document.getElementById("match");
const petsEl = document.getElementById("pets");
const actionsEl = document.getElementById("actions");
const heroEl = document.getElementById("hero");

function formatAge(months) {
  if (months == null) return "";
  const y = Math.floor(months / 12), m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m || !y) parts.push(`${m} mo`);
  return parts.join(" ");
}

// Slim record: { id, name, species, breed, months, fee, loc, health[] }.
// The profile link is built from the id, e.g. /adopt/dogs/apa-a-197045.
function normalizePet(p) {
  return {
    name: p.name,
    species: p.species,
    breed: p.breed || "",
    age: formatAge(p.months),
    fee: p.fee != null ? `$${p.fee}` : "",
    location: p.loc || "",
    health: (p.health || []).join(", "),
    image: CONFIG.PET_IMAGES[p.species] || "",
    url: `${CONFIG.APA_LINKS[p.species]}/${p.id}`
  };
}

function petCard(p) {
  const a = document.createElement("a");
  a.className = "pet";
  a.href = p.url || CONFIG.APA_LINKS[p.species];
  a.target = "_blank";
  a.rel = "noopener";
  let img;
  if (p.image) {
    img = document.createElement("img");
    img.alt = p.name;
    img.loading = "lazy";
    img.src = p.image;
  } else {
    img = document.createElement("div");
    img.className = "ph";
    img.textContent = p.species === "dog" ? "🐶" : "🐱";
  }
  const body = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = p.name;
  const meta = document.createElement("span");
  meta.textContent = [p.breed, p.age].filter(Boolean).join(" · ");
  const extra = document.createElement("span");
  extra.textContent = [p.fee, p.location].filter(Boolean).join(" · ");
  body.append(name, meta, extra);
  if (p.health) {
    const h = document.createElement("span");
    h.textContent = `Health: ${p.health}`;
    body.append(h);
  }
  a.append(img, body);
  return a;
}

function list(items) {
  const ul = document.createElement("ul");
  items.forEach((t) => { const li = document.createElement("li"); li.textContent = t; ul.append(li); });
  return ul;
}

function block(title, ...nodes) {
  const d = document.createElement("div");
  const h = document.createElement("h2");
  h.textContent = title;
  d.append(h, ...nodes);
  return d;
}

function para(text) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}

function infoSection(species) {
  const i = INFO[species];
  const sec = document.createElement("section");
  sec.id = "info";
  sec.className = "info";
  sec.hidden = true;
  const compare = document.createElement("div");
  compare.className = "two";
  compare.append(block(i.compare.left, para(i.compare.leftText)), block(i.compare.right, para(i.compare.rightText)));
  const dd = document.createElement("div");
  dd.className = "two";
  const dos = block("Do's", list(i.dos)); dos.className = "do";
  const donts = block("Don'ts", list(i.donts)); donts.className = "dont";
  dd.append(dos, donts);
  sec.append(
    block(`Why a ${species} fits you`, para(i.why)),
    block("The benefits", list(i.benefits)),
    block("Why adopt", para(i.adopt)),
    block(i.compare.title, compare),
    dd
  );
  return sec;
}

async function main() {
  if (raw === null) {
    headline.textContent = "Take the quiz first!";
    actionsEl.innerHTML = '<a href="index.html">Start the quiz</a>';
    return;
  }
  const dogPct = Number(raw);
  const species = dogPct >= 50 ? "dog" : "cat";
  const pct = species === "dog" ? dogPct : 100 - dogPct;
  heroEl.src = CONFIG.PET_IMAGES[species];
  heroEl.hidden = false;
  headline.textContent = species === "dog" ? "You're a dog person!" : "You're a cat person!";
  matchEl.textContent = `${pct}% match for a ${species}.`;

  const link = document.createElement("a");
  link.href = CONFIG.APA_LINKS[species];
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = `See all ${species}s at Austin Pets Alive`;
  const learn = document.createElement("button");
  learn.type = "button";
  learn.className = "alt";
  learn.textContent = `What to know about ${species}s`;
  learn.setAttribute("aria-expanded", "false");
  learn.setAttribute("aria-controls", "info");
  const info = infoSection(species);
  learn.addEventListener("click", () => {
    const open = info.hidden;
    info.hidden = !open;
    learn.setAttribute("aria-expanded", String(open));
    if (open) info.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  actionsEl.append(link, learn);
  actionsEl.after(info);

  try {
    const res = await fetch(CONFIG.PETS_SOURCE);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const pets = data.map(normalizePet).filter((p) => p.species === species);
    petsEl.replaceChildren(...pets.slice(0, CONFIG.MAX_PETS).map((p, i) => {
      const c = petCard(p);
      c.style.animationDelay = `${0.3 + i * 0.08}s`;
      return c;
    }));
  } catch {
    matchEl.textContent += " (Couldn't load pet listings. Use the link below.)";
  }
}

main();
