import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Papa from "papaparse";
import gsap from "gsap";

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

function normalizeName(
  value = ""
) {
  return String(value)
    .toLowerCase()
    .trim()

    // Gender symbols
    .replace(/♀/g, " female ")
    .replace(/♂/g, " male ")

    // Normalize apostrophes
    .replace(/[’']/g, "")

    // Treat punctuation and separators consistently
    .replace(/[-_]/g, " ")
    .replace(
      /[()[\],.]/g,
      " "
    )

    // Keep percentages meaningful
    .replace(
      /%/g,
      " percent "
    )

    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePvPokeName(
  value = ""
) {
  let name =
    normalizeName(value);

  for (
    const [
      from,
      to,
    ] of FORM_REPLACEMENTS
  ) {
    name = name.replace(
      new RegExp(
        `\\b${from}\\b`,
        "g"
      ),
      to
    );
  }

  return name
    .replace(/\s+/g, " ")
    .trim();
}

function removeBattleStatus(
  value = ""
) {
  let name = value;

  for (const status of STATUS_FORMS) {
    name = name.replace(
      new RegExp(
        `\\b${status}\\b`,
        "g"
      ),
      ""
    );
  }

  return name
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Special cases where PvPoke terminology
 * and PokeAPI terminology do not line up.
 */
function applySpecialAliases(
  value
) {
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

  return (
    aliases[value] || value
  );
}

function createPokemonIndexes() {
  const exact = new Map();
  const base = new Map();

  pokeList.forEach(
    ([id, rawName]) => {
      const normalized =
        normalizePvPokeName(
          rawName
        );

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
       * Also receive a base fallback.
       */
      const baseName =
        normalizePvPokeName(
          rawName.replace(
            /\([^)]*\)/g,
            ""
          )
        );

      if (!base.has(baseName)) {
        base.set(baseName, {
          id,
          apiName: rawName,
        });
      }
    }
  );

  return {
    exact,
    base,
  };
}

const pokemonIndexes =
  createPokemonIndexes();

function findPokemon(
  pvpokeName
) {
  if (!pvpokeName) {
    return null;
  }

  let normalized =
    normalizePvPokeName(
      pvpokeName
    );

  const isShadow =
    /\bshadow\b/i.test(
      pvpokeName
    );

  const isPurified =
    /\bpurified\b/i.test(
      pvpokeName
    );

  /*
   * Shadow and Purified do not have
   * unique PokeAPI sprites.
   */
  normalized =
    removeBattleStatus(
      normalized
    );

  normalized =
    applySpecialAliases(
      normalized
    );

  // =========================================
  // 1. EXACT FORM MATCH
  // =========================================

  const exactMatch =
    pokemonIndexes.exact.get(
      normalized
    );

  if (exactMatch) {
    return {
      ...exactMatch,

      status: isShadow
        ? "Shadow"
        : isPurified
          ? "Purified"
          : null,
    };
  }

  // =========================================
  // 2. REMOVE "FORME" OR "FORM"
  // =========================================

  const withoutFormWord =
    normalized
      .replace(
        /\bforme?\b/g,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();

  const formMatch =
    pokemonIndexes.exact.get(
      withoutFormWord
    );

  if (formMatch) {
    return {
      ...formMatch,

      status: isShadow
        ? "Shadow"
        : isPurified
          ? "Purified"
          : null,
    };
  }

  // =========================================
  // 3. FALL BACK TO BASE SPECIES
  // =========================================

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

  let baseCandidate =
    normalized;

  fallbackWords.forEach(
    (word) => {
      baseCandidate =
        baseCandidate.replace(
          new RegExp(
            `\\b${word}\\b`,
            "g"
          ),
          ""
        );
    }
  );

  baseCandidate =
    baseCandidate
      .replace(
        /\b[xyz]\b/g,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();

  const baseMatch =
    pokemonIndexes.base.get(
      baseCandidate
    ) ||
    pokemonIndexes.exact.get(
      baseCandidate
    );

  if (baseMatch) {
    return {
      ...baseMatch,

      status: isShadow
        ? "Shadow"
        : isPurified
          ? "Purified"
          : null,

      usedFallback: true,
    };
  }

  return null;
}

function formatPokemonName(
  name = ""
) {
  return name
    .split(" ")
    .map((word) => {
      if (!word) {
        return "";
      }

      return (
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

const PARALLAX_STRENGTH = 30;

/*
 * A shallow 3D cube version of the Pokémon card.
 *
 * The outer element supplies perspective while
 * GSAP rotates only the inner element.
 */
function PokemonCard3D({
  item,
  imageUrl,
  imageMissing,
  onImageError,
}) {
  const cardRef =
    useRef(null);

  useLayoutEffect(() => {
    const card =
      cardRef.current;

    if (!card) {
      return undefined;
    }

    const rotation = {
      flipX: 0,
      tiltX: 0,
      tiltY: 0,
    };

    let isFlipped = false;

    const renderRotation =
      () => {
        gsap.set(card, {
          rotateX:
            rotation.flipX +
            rotation.tiltX,

          rotateY:
            rotation.tiltY,

          transformPerspective:
            1100,

          transformOrigin:
            "center center",
        });
      };

    const handlePointerEnter =
      () => {
        isFlipped = false;

        gsap.to(
          rotation,
          {
            flipX: 180,

            duration: 0.55,

            ease:
              "power2.inOut",

            overwrite: true,

            onUpdate:
              renderRotation,

            onComplete:
              () => {
                isFlipped =
                  true;
              },
          }
        );
      };

    const handlePointerMove =
      (event) => {
        if (!isFlipped) {
          return;
        }

        const bounds =
          card.getBoundingClientRect();

        const offsetX =
          (event.clientX -
            (bounds.left +
              bounds.width /
                2)) /
          bounds.width;

        const offsetY =
          (event.clientY -
            (bounds.top +
              bounds.height /
                2)) /
          bounds.height;

        gsap.to(
          rotation,
          {
            tiltX:
              -offsetY *
              PARALLAX_STRENGTH,

            tiltY:
              offsetX *
              PARALLAX_STRENGTH,

            duration: 0.25,

            ease:
              "power2.out",

            overwrite: true,

            onUpdate:
              renderRotation,
          }
        );
      };

    const handlePointerLeave =
      () => {
        isFlipped = false;

        gsap.to(
          rotation,
          {
            flipX: 0,
            tiltX: 0,
            tiltY: 0,

            duration: 0.55,

            ease:
              "power2.inOut",

            overwrite: true,

            onUpdate:
              renderRotation,
          }
        );
      };

    renderRotation();

    card.addEventListener(
      "pointerenter",
      handlePointerEnter
    );

    card.addEventListener(
      "pointermove",
      handlePointerMove
    );

    card.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      card.removeEventListener(
        "pointerenter",
        handlePointerEnter
      );

      card.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      card.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      gsap.killTweensOf(
        rotation
      );
    };
  }, []);

  const cardContent = (
    <>
      <div className="rank-badge">
        #{item.rank}
      </div>

      {/* Only render the image area when the Pokémon matched */}
      {item.imageAvailable && (
        <div className="sprite-wrapper">
          {!imageMissing ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="pokemon-image"
              loading="lazy"
              onError={
                onImageError
              }
            />
          ) : (
            <div className="image-fallback">
              ?
            </div>
          )}
        </div>
      )}

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
    </>
  );

  return (
    <div
      style={{
        position: "relative",
        minHeight: "290px",
        perspective:
          "1100px",
      }}
    >
      <div
        ref={cardRef}
        style={{
          position:
            "absolute",

          inset: 0,

          cursor: "pointer",

          transformStyle:
            "preserve-3d",

          willChange:
            "transform",
        }}
      >
        <article
          className="pokemon-card"
          style={{
            position:
              "absolute",

            inset: 0,

            height: "100%",

            backfaceVisibility:
              "hidden",

            transform:
              "translateZ(12px)",
          }}
        >
          {cardContent}
        </article>

        <article
          className="pokemon-card"
          aria-hidden="true"
          style={{
            position:
              "absolute",

            inset: 0,

            height: "100%",

            backfaceVisibility:
              "hidden",

            transform:
              "rotateX(180deg) translateZ(12px)",
          }}
        >
          {cardContent}
        </article>
      </div>
    </div>
  );
}

function App() {
  const [
    pokemon,
    setPokemon,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    displayLimit,
    setDisplayLimit,
  ] = useState("50");

  const [
    imageErrors,
    setImageErrors,
  ] = useState(
    new Set()
  );

  const [
    fileName,
    setFileName,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    unmatched,
    setUnmatched,
  ] = useState([]);

  const handleFileUpload =
    (event) => {
      const file =
        event.target
          .files?.[0];

      if (!file) {
        return;
      }

      setError("");
      setPokemon([]);
      setUnmatched([]);
      setImageErrors(
        new Set()
      );
      setFileName(
        file.name
      );

      Papa.parse(file, {
        header: true,

        skipEmptyLines:
          true,

        transformHeader:
          (header) =>
            header.trim(),

        complete: ({
          data,
          errors,
        }) => {
          if (
            errors.length > 0
          ) {
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
            Object.keys(
              data[0]
            ).find(
              (column) =>
                column
                  .trim()
                  .toLowerCase() ===
                "pokemon"
            );

          if (
            !pokemonColumn
          ) {
            setError(
              'Could not find a "Pokemon" column. Make sure this is a PvPoke rankings CSV.'
            );

            return;
          }

          const rankings =
            [];

          const failed = [];

          data.forEach(
            (
              row,
              index
            ) => {
              const rawName =
                row[
                  pokemonColumn
                ]?.trim();

              if (!rawName) {
                return;
              }

              const csvRank =
                row.Rank ||
                row.rank ||
                row["#"];

              const rank =
                Number(
                  csvRank
                ) ||
                index + 1;

              const match =
                findPokemon(
                  rawName
                );

              /*
               * If no match is found, keep the Pokémon
               * in the ranking list using its CSV name
               * and rank, but do not give it an image.
               */
              if (!match) {
                failed.push(
                  rawName
                );

                rankings.push(
                  {
                    id: null,

                    apiName:
                      null,

                    name: rawName,

                    rank,

                    status:
                      null,

                    usedFallback:
                      false,

                    imageAvailable:
                      false,
                  }
                );

                return;
              }

              rankings.push(
                {
                  id: match.id,

                  apiName:
                    match.apiName,

                  name: rawName,

                  rank,

                  status:
                    match.status,

                  usedFallback:
                    match.usedFallback ||
                    false,

                  imageAvailable:
                    true,
                }
              );
            }
          );

          rankings.sort(
            (a, b) =>
              a.rank -
              b.rank
          );

          setPokemon(
            rankings
          );

          setUnmatched(
            failed
          );

          if (
            !rankings.length
          ) {
            setError(
              "No Pokémon names could be read from this CSV."
            );
          }
        },

        error: (
          parseError
        ) => {
          console.error(
            parseError
          );

          setError(
            "There was a problem reading that CSV file."
          );
        },
      });
    };

  const visiblePokemon =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      let result =
        pokemon;

      if (
        normalizedSearch
      ) {
        result =
          result.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
          );
      }

      if (
        displayLimit !==
        "all"
      ) {
        result =
          result.slice(
            0,
            Number(
              displayLimit
            )
          );
      }

      return result;
    }, [
      pokemon,
      search,
      displayLimit,
    ]);

  const handleImageError =
    (pokemonId) => {
      setImageErrors(
        (previous) => {
          const next =
            new Set(
              previous
            );

          next.add(
            pokemonId
          );

          return next;
        }
      );
    };

  const clearResults =
    () => {
      setPokemon([]);
      setSearch("");
      setFileName("");
      setError("");
      setUnmatched([]);
      setImageErrors(
        new Set()
      );
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
            <span>
              {" "}
              but visual.
            </span>
          </h1>

          <p className="hero__description">
            Export your
            rankings from
            PvPoke, upload the
            CSV, and instantly
            see every ranked
            Pokémon with its
            sprite.
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
                onClick={
                  clearResults
                }
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="hero__preview">
          <div className="preview-card preview-card--1">
            <span>
              #1
            </span>

            <div>
              🏆
            </div>
          </div>

          <div className="preview-card preview-card--2">
            <span>
              #2
            </span>

            <div>
              ⚔️
            </div>
          </div>

          <div className="preview-card preview-card--3">
            <span>
              #3
            </span>

            <div>
              🛡️
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="message message--error">
          {error}
        </div>
      )}

      {pokemon.length >
        0 && (
        <section className="rankings-section">
          <div className="rankings-header">
            <div>
              <span className="section-label">
                Imported
                Rankings
              </span>

              <h2>
                {
                  pokemon.length
                }{" "}
                Pokémon loaded
              </h2>
            </div>

            <div className="filters">
              <div className="search-wrapper">
                <span>
                  ⌕
                </span>

                <input
                  type="search"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Search Pokémon..."
                />
              </div>

              <select
                value={
                  displayLimit
                }
                onChange={(
                  event
                ) =>
                  setDisplayLimit(
                    event
                      .target
                      .value
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

            {unmatched.length >
              0 && (
              <span className="unmatched">
                {
                  unmatched.length
                }{" "}
                unmatched
              </span>
            )}
          </div>

          {visiblePokemon.length >
          0 ? (
            <div className="pokemon-grid">
              {visiblePokemon.map(
                (item) => {
                  const imageUrl =
                    item.imageAvailable
                      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`
                      : "";

                  const imageMissing =
                    item.imageAvailable &&
                    imageErrors.has(
                      item.id
                    );

                  return (
                    <PokemonCard3D
                      key={`${item.rank}-${item.name}`}
                      item={
                        item
                      }
                      imageUrl={
                        imageUrl
                      }
                      imageMissing={
                        imageMissing
                      }
                      onImageError={() => {
                        if (
                          item.imageAvailable
                        ) {
                          handleImageError(
                            item.id
                          );
                        }
                      }}
                    />
                  );
                }
              )}
            </div>
          ) : (
            <div className="empty-search">
              <h3>
                No Pokémon
                found
              </h3>

              <p>
                Try another
                search.
              </p>
            </div>
          )}

          {unmatched.length >
            0 && (
            <details className="unmatched-panel">
              <summary>
                Couldn&apos;t
                match{" "}
                {
                  unmatched.length
                }{" "}
                Pokémon
              </summary>

              <p>
                These entries
                are shown by
                name only
                because no
                matching sprite
                was found:
              </p>

              <div className="unmatched-list">
                {unmatched.map(
                  (
                    name,
                    index
                  ) => (
                    <span
                      key={`${name}-${index}`}
                    >
                      {name}
                    </span>
                  )
                )}
              </div>
            </details>
          )}
        </section>
      )}

      {pokemon.length ===
        0 &&
        !error && (
          <section className="instructions">
            <div>
              <span>
                01
              </span>

              <h3>
                Export
                rankings
              </h3>

              <p>
                Open PvPoke
                and download
                the rankings
                CSV you want
                to visualize.
              </p>
            </div>

            <div>
              <span>
                02
              </span>

              <h3>
                Upload the
                CSV
              </h3>

              <p>
                Drop the
                exported
                ranking file
                into this
                page.
              </p>
            </div>

            <div>
              <span>
                03
              </span>

              <h3>
                Learn visually
              </h3>

              <p>
                Browse rankings
                with Pokémon
                sprites instead
                of memorizing
                every name.
              </p>
            </div>
          </section>
        )}
    </main>
  );
}

export default App;