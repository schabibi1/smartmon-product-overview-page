import axios from 'axios';

const endpoint = 'https://pokeapi.co/api/v2/';

interface PokemonListResponse {
  results: Array<{ name: string; url: string }>;
}

interface PokemonDetailsResponse {
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{ type: { name: string } }>;
}

interface PokemonTypeResponse {
  results: Array<{ name: string }>;
}

// https://pokeapi.co/api/v2/pokemon?limit=15&offset=0
export const fetchPokemonList = async (limit = 15, offset = 0): Promise<{ name: string; url: string }[]> => {
  const response = await axios.get<PokemonListResponse>(`${endpoint}pokemon`, {
    params: { limit, offset },
  });
  return response.data.results;
};

export const fetchPokemonDetails = async (url: string): Promise<PokemonDetailsResponse> => {
  const response = await axios.get<PokemonDetailsResponse>(url);
  return response.data;
};

export const fetchPokemonTypes = async (): Promise<{ name: string }[]> => {
  const response = await axios.get<PokemonTypeResponse>(`${endpoint}type`);
  return response.data.results;
};