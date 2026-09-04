import React, { useMemo, useState } from "react";
import Papa from "papaparse";

import "./App.css";
import { pokeList } from "./pokemonData";

const STATUS_FORMS = [
  "shadow",
  "purified",
];

const FORM_REPLACEMENTS = [
  ["alolan", "alola"],
  ["galarian", "galar"],
  ["hisuian", "hisui"],
  ["paldean", "paldea"],

  ["mega x", "mega x"],
  ["mega y", "mega y"],

  ["defense forme", "defense"],
  ["attack forme", "attack"],
  ["speed forme", "speed"],
  ["normal forme", "normal"],

  ["altered forme", "altered"],
  ["origin forme", "origin"],

  ["therian forme", "therian"],
  ["incarnate forme", "incarnate"],

  ["zen mode", "zen"],
];

function normalizeName(value = "") {
  return String(value)
    .toLowerCase()
    .trim()

    // Gender symbols
    .replace(/♀/g, " female ")
    .replace(/♂/g, " male ")

    // Normalize apostrophes
    .replace(/[’']/g, "")

    // Treat punctuation/separators consistently
    .replace(/[-_]/g, " ")
    .replace(/[()[\],.]/g, " ")

    // Keep percentages meaningful
    .replace(/%/g, " percent ")

    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePvPokeName(value = "") {
  let name = normalizeName(value);

  for (const [from, to] of FORM_REPLACEMENTS) {
    name = name.replace(
      new RegExp(`\\b${from}\\b`, "g"),
      to
    );
  }

  return name.replace(/\s+/g, " ").trim();
}

function removeBattleStatus(value = "") {
  let name = value;

  for (const status of STATUS_FORMS) {
    name = name.replace(
      new RegExp(`\\b${status}\\b`, "g"),
      ""
    );
  }

  return name.replace(/\s+/g, " ").trim();
}

/*
 * Special cases where PvPoke terminology and PokeAPI terminology
 * don't line up perfectly.
 */
function applySpecialAliases(value) {
  const aliases = {
    "zygarde 10 percent forme":
      "zygarde 10 power construct",

    "zygarde 10 percent":
      "zygarde 10 power construct",

    "zygarde complete forme":
      "zygarde complete forme",

    "darmanitan zen mode":
      "darmanitan zen",

    "darmanitan galarian":
      "darmanitan galar standard",
  };

  return aliases[value] || value;
}

function createPokemonIndexes() {
  const exact = new Map();
  const base = new Map();

  pokeList.forEach(([id, rawName]) => {
    const normalized = normalizePvPokeName(rawName);

    exact.set(normalized, {
      id,
      apiName: rawName,
    });

    /*
     * Parenthetical PokeAPI names:
     *
     * Giratina (Altered)
     * Deoxys (Normal)
     * Wormadam (Plant)
     *
     * Also get a base fallback.
     */
    const baseName = normalizePvPokeName(
      rawName.replace(/\([^)]*\)/g, "")
    );

    if (!base.has(baseName)) {
      base.set(baseName, {
        id,
        apiName: rawName,
      });
    }
  });

  return {
    exact,
    base,
  };
}

const pokemonIndexes = createPokemonIndexes();

function findPokemon(pvpokeName) {
  if (!pvpokeName) {
    return null;
  }

  let normalized = normalizePvPokeName(pvpokeName);

  const isShadow =
    /\bshadow\b/i.test(pvpokeName);

  const isPurified =
    /\bpurified\b/i.test(pvpokeName);

  /*
   * Shadow/Purified don't have unique PokeAPI sprites.
   * Remove that status before looking for the Pokémon.
   */
  normalized = removeBattleStatus(normalized);

  normalized = applySpecialAliases(normalized);

  // ---------------------------------------
  // 1. EXACT FORM MATCH
  // ---------------------------------------

  const exactMatch =
    pokemonIndexes.exact.get(normalized);

  if (exactMatch) {
    return {
      ...exactMatch,
      status:
        isShadow
          ? "Shadow"
          : isPurified
            ? "Purified"
            : null,
    };
  }

  // ---------------------------------------
  // 2. TRY REMOVING "FORME" / "FORM"
  // ---------------------------------------

  const withoutFormWord = normalized
    .replace(/\bforme?\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const formMatch =
    pokemonIndexes.exact.get(withoutFormWord);

  if (formMatch) {
    return {
      ...formMatch,
      status:
        isShadow
          ? "Shadow"
          : isPurified
            ? "Purified"
            : null,
    };
  }

  // ---------------------------------------
  // 3. FALL BACK TO BASE SPECIES
  // ---------------------------------------

  /*
   * Remove known form descriptors if that exact
   * PokeAPI variant isn't available.
   */
  const fallbackWords = [
    "alola",
    "galar",
    "hisui",
    "paldea",
    "therian",
    "incarnate",
    "origin",
    "altered",
    "standard",
    "zen",
    "hero",
    "mega",
    "defense",
    "attack",
    "speed",
    "normal",
    "chill",
    "shock",
    "douse",
    "burn",
    "average",
    "small",
    "large",
    "super",
  ];

  let baseCandidate = normalized;

  fallbackWords.forEach((word) => {
    baseCandidate = baseCandidate.replace(
      new RegExp(`\\b${word}\\b`, "g"),
      ""
    );
  });

  baseCandidate = baseCandidate
    .replace(/\b[xyz]\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const baseMatch =
    pokemonIndexes.base.get(baseCandidate) ||
    pokemonIndexes.exact.get(baseCandidate);

  if (baseMatch) {
    return {
      ...baseMatch,
      status:
        isShadow
          ? "Shadow"
          : isPurified
            ? "Purified"
            : null,

      usedFallback: true,
    };
  }

  return null;
}

function formatPokemonName(name = "") {
  return name
    .split(" ")
    .map((word) => {
      if (!word) return "";

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

function App() {
  const [pokemon, setPokemon] = useState([]);

  const [search, setSearch] = useState("");

  const [displayLimit, setDisplayLimit] =
    useState("50");

  const [imageErrors, setImageErrors] =
    useState(new Set());

  const [fileName, setFileName] = useState("");

  const [error, setError] = useState("");

  const [unmatched, setUnmatched] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setPokemon([]);
    setUnmatched([]);
    setImageErrors(new Set());
    setFileName(file.name);

    Papa.parse(file, {
      header: true,

      skipEmptyLines: true,

      transformHeader: (header) =>
        header.trim(),

      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          console.warn(
            "CSV parsing warnings:",
            errors
          );
        }

        if (!data.length) {
          setError(
            "The CSV appears to be empty."
          );
          return;
        }

        const pokemonColumn =
          Object.keys(data[0]).find(
            (column) =>
              column
                .trim()
                .toLowerCase() ===
              "pokemon"
          );

        if (!pokemonColumn) {
          setError(
            'Could not find a "Pokemon" column. Make sure this is a PvPoke rankings CSV.'
          );

          return;
        }

        const rankings = [];

        const failed = [];

        data.forEach((row, index) => {
          const rawName =
            row[pokemonColumn]?.trim();

          if (!rawName) {
            return;
          }

          const match =
            findPokemon(rawName);

          if (!match) {
            failed.push(rawName);
            return;
          }

          const csvRank =
            row.Rank ||
            row.rank ||
            row["#"];

          rankings.push({
            id: match.id,

            apiName: match.apiName,

            name: rawName,

            rank:
              Number(csvRank) ||
              index + 1,

            status: match.status,

            usedFallback:
              match.usedFallback || false,
          });
        });

        rankings.sort(
          (a, b) => a.rank - b.rank
        );

        setPokemon(rankings);
        setUnmatched(failed);

        if (!rankings.length) {
          setError(
            "No Pokémon could be matched from this CSV."
          );
        }
      },

      error: (parseError) => {
        console.error(parseError);

        setError(
          "There was a problem reading that CSV file."
        );
      },
    });
  };

  const visiblePokemon = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    let result = pokemon;

    if (normalizedSearch) {
      result = result.filter((item) =>
        item.name
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    if (displayLimit !== "all") {
      result = result.slice(
        0,
        Number(displayLimit)
      );
    }

    return result;
  }, [
    pokemon,
    search,
    displayLimit,
  ]);

  const handleImageError = (
    pokemonId
  ) => {
    setImageErrors((previous) => {
      const next = new Set(previous);

      next.add(pokemonId);

      return next;
    });
  };

  const clearResults = () => {
    setPokemon([]);
    setSearch("");
    setFileName("");
    setError("");
    setUnmatched([]);
    setImageErrors(new Set());
  };

  return (
    <main className="app">
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">
            PvPoke Companion
          </span>

          <h1>
            Pokémon Rankings,
            <span> but visual.</span>
          </h1>

          <p className="hero__description">
            Export your rankings from
            PvPoke, upload the CSV, and
            instantly see every ranked
            Pokémon with its sprite.
          </p>

          <div className="hero__actions">
            <a
              href="https://pvpoke.com/rankings/all/1500/overall/"
              target="_blank"
              rel="noreferrer"
              className="button button--secondary"
            >
              Open PvPoke
              <span>↗</span>
            </a>

            <label className="button button--primary">
              Upload CSV

              <input
                className="file-input"
                type="file"
                accept=".csv,text/csv"
                onChange={
                  handleFileUpload
                }
              />
            </label>
          </div>

          {fileName && (
            <div className="file-status">
              <span className="status-dot" />

              <span>
                Loaded{" "}
                <strong>
                  {fileName}
                </strong>
              </span>

              <button
                onClick={clearResults}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="hero__preview">
          <div className="preview-card preview-card--1">
            <span>#1</span>
            <div>🏆</div>
          </div>

          <div className="preview-card preview-card--2">
            <span>#2</span>
            <div>⚔️</div>
          </div>

          <div className="preview-card preview-card--3">
            <span>#3</span>
            <div>🛡️</div>
          </div>
        </div>
      </section>

      {error && (
        <div className="message message--error">
          {error}
        </div>
      )}

      {pokemon.length > 0 && (
        <section className="rankings-section">
          <div className="rankings-header">
            <div>
              <span className="section-label">
                Imported Rankings
              </span>

              <h2>
                {pokemon.length} Pokémon
                loaded
              </h2>
            </div>

            <div className="filters">
              <div className="search-wrapper">
                <span>⌕</span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search Pokémon..."
                />
              </div>

              <select
                value={displayLimit}
                onChange={(event) =>
                  setDisplayLimit(
                    event.target.value
                  )
                }
                aria-label="Number of rankings to show"
              >
                <option value="25">
                  Top 25
                </option>

                <option value="50">
                  Top 50
                </option>

                <option value="100">
                  Top 100
                </option>

                <option value="250">
                  Top 250
                </option>

                <option value="all">
                  Show all
                </option>
              </select>
            </div>
          </div>

          <div className="results-bar">
            <span>
              Showing{" "}
              <strong>
                {
                  visiblePokemon.length
                }
              </strong>{" "}
              result
              {visiblePokemon.length ===
              1
                ? ""
                : "s"}
            </span>

            {unmatched.length > 0 && (
              <span className="unmatched">
                {unmatched.length} unmatched
              </span>
            )}
          </div>

          {visiblePokemon.length >
          0 ? (
            <div className="pokemon-grid">
              {visiblePokemon.map(
                (item) => {
                  const imageUrl =
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

                  const imageMissing =
                    imageErrors.has(
                      item.id
                    );

                  return (
                    <article
                      className="pokemon-card"
                      key={`${item.rank}-${item.name}`}
                    >
                      <div className="rank-badge">
                        #{item.rank}
                      </div>

                      <div className="sprite-wrapper">
                        {!imageMissing ? (
                          <img
                            src={imageUrl}
                            alt={
                              item.name
                            }
                            className="pokemon-image"
                            loading="lazy"
                            onError={() =>
                              handleImageError(
                                item.id
                              )
                            }
                          />
                        ) : (
                          <div className="image-fallback">
                            ?
                          </div>
                        )}
                      </div>

                      <div className="pokemon-info">
                        <h3>
                          {formatPokemonName(
                            item.name
                          )}
                        </h3>

                        {item.status && (
                          <span
                            className={`status-tag status-tag--${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        )}

                        {item.usedFallback && (
                          <span
                            className="fallback-tag"
                            title="A base Pokémon sprite was used because a matching form sprite was unavailable."
                          >
                            Base sprite
                          </span>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="empty-search">
              <h3>
                No Pokémon found
              </h3>

              <p>
                Try another search.
              </p>
            </div>
          )}

          {unmatched.length > 0 && (
            <details className="unmatched-panel">
              <summary>
                Couldn't match{" "}
                {unmatched.length} Pokémon
              </summary>

              <p>
                These entries were kept
                out rather than showing an
                incorrect sprite:
              </p>

              <div className="unmatched-list">
                {unmatched.map(
                  (name) => (
                    <span key={name}>
                      {name}
                    </span>
                  )
                )}
              </div>
            </details>
          )}
        </section>
      )}

      {pokemon.length === 0 &&
        !error && (
          <section className="instructions">
            <div>
              <span>01</span>

              <h3>
                Export rankings
              </h3>

              <p>
                Open PvPoke and download
                the rankings CSV you want
                to visualize.
              </p>
            </div>

            <div>
              <span>02</span>

              <h3>
                Upload the CSV
              </h3>

              <p>
                Drop the exported ranking
                file into this page.
              </p>
            </div>

            <div>
              <span>03</span>

              <h3>
                Learn visually
              </h3>

              <p>
                Browse rankings with
                Pokémon sprites instead
                of memorizing every name.
              </p>
            </div>
          </section>
        )}
    </main>
  );
}

export default App;