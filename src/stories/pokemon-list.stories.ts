import { Meta, StoryObj } from '@storybook/web-components';
import '../components/pokemon-list';

const meta: Meta = {
  title: 'PokemonList',
  component: 'pokemon-list',
  args: {
    pokemons: [
      {
        name: 'bulbasaur',
        sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      },
    ],
    types: [
      { name: 'grass' },
    ],
    selectedType: '',
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const FilteredByType = {
  args: {
    ...Default.args,
    selectedType: 'grass',
  },
};