import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fetchPokemonList, fetchPokemonDetails, fetchPokemonTypes } from '../api/poke-api';

interface Pokemon {
  name: string;
  sprites: { front_default: string };
  types: Array<{ type: { name: string } }>;
}

@customElement('pokemon-list')
export class PokemonList extends LitElement {
  @property({ type: Array }) pokemons: Pokemon[] = [];
  @property({ type: Array }) types: { name: string }[] = [];
  @property({ type: String }) selectedType: string = '';
  @property({ type: Boolean }) loading: boolean = true;

  async connectedCallback() {
    super.connectedCallback();
    this.types = await fetchPokemonTypes();
    this.pokemons = await this.fetchPokemons();
  }

  async fetchPokemons(): Promise<Pokemon[]> {
    const allPokemons = await fetchPokemonList(15, 0);
    const detailedPokemons = await Promise.all(
      allPokemons.map(async (pokemon) => {
        const details = await fetchPokemonDetails(pokemon.url);
        return details;
      })
    );
    this.loading = false;
    return detailedPokemons;
  }

  filterPokemonsByType(pokemon: Pokemon): boolean {
    if (!this.selectedType) return true;
    return pokemon.types.some((type) => type.type.name === this.selectedType);
  }

  render() {
    return html`
      <div>
        <select @change="${this.handleTypeChange}">
          <option value="">All Types</option>
          ${this.types.map(
            (type) =>
              html`<option value="${type.name}">${type.name}</option>`
          )}
        </select>
        
        <h1>These are our products</h1>
        <div class="pokemon-list">
          ${this.loading
            ? html`<p>Loading...</p>`
            : this.pokemons
                .filter((pokemon) => this.filterPokemonsByType(pokemon))
                .map(
                  (pokemon) =>
                    html`
                      <div class="pokemon-card">
                        <h3>${pokemon.name}</h3>
                        <img
                          src="${pokemon.sprites.front_default}"
                          alt="${pokemon.name}"
                        />
                      </div>
                    `
                )}
        </div>
      </div>
    `;
  }

  handleTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType = select.value;
    this.requestUpdate();
  }

  static styles = css`
    .pokemon-list {
      display: flex;
      flex-wrap: wrap;
    }

    .pokemon-card {
      margin: 10px;
      text-align: center;
      width: 120px;
    }

    .pokemon-card img {
      width: 100%;
    }

    select {
      margin-bottom: 20px;
    }
  `;
}