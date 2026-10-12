const raw = sessionStorage.getItem("petQuizDogPercent");
const headline = document.getElementById("headline");
const matchEl = document.getElementById("match");
const petsEl = document.getElementById("pets");
const actionsEl = document.getElementById("actions");

function formatAge(a) {
  if (!a) return "";
  const y = a.years, m = a.months;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m || !y) parts.push(`${m} mo`);
  return parts.join(" ");
}

// Maps the Austin Pets Alive export (data/pets.json) to the shape the cards use.
function normalizePet(p) {
  const species = String(p.species || "").toLowerCase();
  const health = (p.health_conditions || []).map((h) => h.label).join(", ");
  return {
    name: p.name,
    species,
    breed: p.breed || "",
    age: formatAge(p.age),
    fee: p.adoption_fee_usd != null ? `$${p.adoption_fee_usd}` : "",
    location: p.location ? p.location.name : "",
    health,
    image: p.image || "",
    url: p.profile_url || p.source_url || ""
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

async function main() {
  if (raw === null) {
    headline.textContent = "Take the quiz first!";
    actionsEl.innerHTML = '<a href="index.html">Start the quiz</a>';
    return;
  }
  const dogPct = Number(raw);
  const species = dogPct >= 50 ? "dog" : "cat";
  const pct = species === "dog" ? dogPct : 100 - dogPct;
  headline.textContent = species === "dog" ? "You're a dog person!" : "You're a cat person!";
  matchEl.textContent = `${pct}% match for a ${species}.`;

  const link = document.createElement("a");
  link.href = CONFIG.APA_LINKS[species];
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = `See all ${species}s at Austin Pets Alive`;
  const retake = document.createElement("a");
  retake.href = "index.html";
  retake.className = "alt";
  retake.textContent = "Retake the quiz";
  actionsEl.append(link, retake);

  try {
    const res = await fetch(CONFIG.PETS_SOURCE);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const pets = (Array.isArray(data) ? data : data.pets).map(normalizePet).filter((p) => p.species === species);
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
