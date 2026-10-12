const card = document.getElementById("card");
const titleEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const barFill = document.getElementById("barFill");
const errorEl = document.getElementById("error");

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
