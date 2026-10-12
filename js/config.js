// Point PETS_SOURCE at an API or JSON feed of Austin Pets Alive animals.
// Accepts the Austin Pets Alive export (object with a "pets" array) or a plain array; see normalizePet() in results.js.
// Field names from a real feed can be mapped in normalizePet() in results.js.
const CONFIG = {
  PETS_SOURCE: "data/pets.json",
  MAX_PETS: 8,
  APA_LINKS: {
    dog: "https://www.austinpetsalive.org/adopt/dogs",
    cat: "https://www.austinpetsalive.org/adopt/cats"
  }
};
