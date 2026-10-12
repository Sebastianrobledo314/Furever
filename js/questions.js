// dog: -1 (strongly cat) .. +1 (strongly dog). weight: how much the question matters.
const QUESTIONS = [
  { text: "Do you travel often?", weight: 1, options: [
    { label: "Yes, lots for my job.", dog: -1 },
    { label: "Every once in a while.", dog: 0 },
    { label: "No/very rarely.", dog: 1 } ] },
  { text: "Are you an affectionate person?", weight: 1, options: [
    { label: "Yes, I love cuddling all day!", dog: 0.3 },
    { label: "No, I like my space.", dog: -0.7 },
    { label: "I'm affectionate, but need my me time.", dog: 0 } ] },
  { text: "Are you looking for a pet to help with specific mental health issues?", weight: 0.75, options: [
    { label: "No", dog: 0 },
    { label: "Anxiety", dog: 0.5 },
    { label: "Depression", dog: 0.4 },
    { label: "Anxiety and Depression", dog: 0.6 } ] },
  { text: "Do you have any young children or elderly people living in the house?", weight: 0.75, options: [
    { label: "Young children", dog: 0.2 },
    { label: "Elderly People", dog: -0.3 },
    { label: "Both", dog: -0.1 },
    { label: "None", dog: 0 } ] },
  { text: "How big of a home do you have?", weight: 1.5, options: [
    { label: "Small apartment, no backyard.", dog: -0.8 },
    { label: "1 - 2 story house, small backyard.", dog: 0.2 },
    { label: "1 - 2 story house, big backyard.", dog: 1 } ] },
  { text: "What reason are you looking for a pet?", weight: 1, options: [
    { label: "A companion to brighten my days.", dog: -0.2 },
    { label: "A purpose to get out of my bed and get outside.", dog: 1 } ] },
  { text: "How much time taking care of your pet are you willing to do?", weight: 1.5, options: [
    { label: "2-4 hours", dog: -0.5 },
    { label: "4-6 hours", dog: 0.8 } ] },
  { text: "Are you looking to be more active outdoors or someone to enjoy lazy Sundays with?", weight: 1.5, options: [
    { label: "A friend to stay in with.", dog: -0.6 },
    { label: "I need a friend to go on walks with.", dog: 1 } ] },
  { text: "On average, how long are you out of the house daily?", weight: 1.25, options: [
    { label: "Less than 2 hours", dog: 0.8 },
    { label: "2 - 5 hours", dog: 0.3 },
    { label: "6 - 8 hours", dog: -0.4 },
    { label: "8 + hours", dog: -0.9 } ] }
];

// Returns 0-100: likelihood the best match is a dog (kept internal until results).
function dogPercent(answers) {
  let sum = 0, max = 0;
  QUESTIONS.forEach((q, i) => {
    sum += q.options[answers[i]].dog * q.weight;
    max += q.weight;
  });
  return Math.round(50 + (50 * sum) / max);
}
