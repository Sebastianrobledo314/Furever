// Point PETS_SOURCE at an API or JSON feed of Austin Pets Alive animals.
// Expected shape: array of { name, species: "dog"|"cat", breed, age, image, url }.
// Field names from a real feed can be mapped in normalizePet() in results.js.
const CONFIG = {
  PETS_SOURCE: "data/pets.json",
  MAX_PETS: 8,
  APA_LINKS: {
    dog: "https://www.austinpetsalive.org/adopt/dogs",
    cat: "https://www.austinpetsalive.org/adopt/cats"
  }
};
