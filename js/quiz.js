const card = document.getElementById("card");
const titleEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const barFill = document.getElementById("barFill");
const errorEl = document.getElementById("error");

// Background art: three slots (left, small, right). Each question shows a new set.
const ART = ["pug", "cattree", "walk", "corgi", "catgraph", "blackcat"].map((n) => `images/${n}.png`);
ART.forEach((src) => { new Image().src = src; });
const slots = ["d-l", "d-s", "d-r"].map((c) => document.querySelector(`.decor .${c}`));
const OFFSETS = [0, 1, 3]; // distinct mod 6, so no repeats on screen

function renderArt(i) {
  slots.forEach((el, k) => {
    el.src = ART[(i + OFFSETS[k]) % ART.length];
    el.classList.remove("swap");
    void el.offsetWidth;
    el.classList.add("swap");
  });
}

const answers = [];
let step = 0;

function render() {
  const q = QUESTIONS[step];
  progressEl.textContent = `Question ${step + 1} of ${QUESTIONS.length}`;
  titleEl.textContent = q.text;
  errorEl.hidden = true;
  barFill.style.width = `${(step / QUESTIONS.length) * 100}%`;
  card.classList.remove("enter");
  void card.offsetWidth;
  card.classList.add("enter");
  optionsEl.replaceChildren(
    ...q.options.map((opt, i) => {
      const label = document.createElement("label");
      label.className = "option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "answer";
      input.value = i;
      input.addEventListener("change", () => {
        optionsEl.querySelectorAll("input").forEach((el) => { if (el !== input) el.checked = false; });
      });
      label.append(input, opt.label);
      return label;
    })
  );
  renderArt(step);
  titleEl.focus();
}

card.addEventListener("submit", (e) => {
  e.preventDefault();
  const picked = optionsEl.querySelector("input:checked");
  if (!picked) {
    errorEl.hidden = false;
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    return;
  }
  answers[step] = Number(picked.value);
  step++;
  const last = step >= QUESTIONS.length;
  if (last) {
    sessionStorage.setItem("petQuizDogPercent", String(dogPercent(answers)));
    barFill.style.width = "100%";
  }
  card.classList.add("leaving");
  setTimeout(() => {
    card.classList.remove("leaving");
    if (last) location.href = "results.html";
    else render();
  }, 220);
});

render();
