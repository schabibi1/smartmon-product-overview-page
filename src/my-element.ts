import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit/task';
import bulbsaurImg from './assets/bulbsaur.png';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Monster id.
   */
  @property({ type: String })
  pokemonId = '1';

  /**
   * The top headline of the overview page component.
   */
  @property({ type: String })
  headline = 'These are our products';

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  
  private _pokemonListTask = new Task(this, {
    task: async () => {
      const getAllPokemons = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';
      const response = await fetch(getAllPokemons);
      console.log(response);
      return response.json();
    },
    args: () => []
  });

  private _pokemonTask = new Task(this, {
    task: async ([pokemonId], {signal}) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {signal});
      console.log(response);
      return response.json();
    },
    args: () => [this.pokemonId]
  });
  
  // Might be useful for filter feature
  private _onClick() {
    console.log(this._pokemonListTask);
    this._pokemonListTask.run();

    console.log(this._pokemonTask);
    this._pokemonTask.run();
  }

  render() {
    return html`
      <div>
        <h1>${this.headline}</h1>
        <!-- TODO: Add filter sidebar component -->
        <h2>Pokemon List</h2>
        <div class="pokemon-list">
          <ul>
            ${this._pokemonListTask._value.results.map((result) => {
              return html`
                <a href=${result.url} target="_blank">
                  <img src=${bulbsaurImg} class="logo" alt="monster image" />
                  <li>
                    <p>${result.name}</p>
                  </li>
                </a>
              `
            })}
          </ul>
        </div>

        <div class="pokemon-type">
          <h2>Type Filter Test Area</h2>
          <ul>
            <p>${this._pokemonTask._value.name}</p>
            <img src=${bulbsaurImg} class="logo" alt="monster image" />
            ${this._pokemonTask._value.types.map((type) => {
              return html`
                <li>
                  <p>${type.type.name}</p>
                </li>
              `
            })}
          </ul>
        </div>
      </div>
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          Pokemon Type Test
        </button>
      </div>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
