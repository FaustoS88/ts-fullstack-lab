/* eslint-disable no-irregular-whitespace */
import { fetchJson } from './fetchJson';

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
}

void (async () => {
  const pikachu = await fetchJson<Pokemon>(
    'https://pokeapi.co/api/v2/pokemon/pikachu',
  );
  console.log(`#${pikachu.id} – ${pikachu.name}`);
  console.log('Sprite URL:', pikachu.sprites.front_default);
})();
