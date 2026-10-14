// Point PETS_SOURCE at an API or JSON feed of Austin Pets Alive animals.
// Slim array of { id, name, species, breed, months, fee, loc, health }; see normalizePet() in results.js.
const CONFIG = {
  PETS_SOURCE: "data/pets.json",
  MAX_PETS: 8,
  APA_LINKS: {
    dog: "https://www.austinpetsalive.org/adopt/dogs",
    cat: "https://www.austinpetsalive.org/adopt/cats"
  }
};
