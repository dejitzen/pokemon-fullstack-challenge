import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Lottie from "react-lottie";
import animation from "../../assets/animation.json";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import { getPokemonData } from "../../endpoints/getPokemonData";
import { searchPokemon } from "../../endpoints/searchPokemon";
import { Pokemon } from "../../entities/Pokemon";
import styles from "./Home.module.scss";

const pokeballSVG = "https://www.svgrepo.com/show/276264/pokeball-pokemon.svg";

const Home: React.FC<{ data: Pokemon[] }> = ({ data }) => {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>(data);
  const [isOpenId, setIsOpenId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [noData, setNoData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortStat, setSortStat] = useState<string>("speed");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const animateReverseCard = () => {
    const cardItself = document.getElementById(`pokemon-card-${isOpenId}`);
    if (cardItself) {
      cardItself.style.translate = `0px 0px`;
      cardItself.style.scale = `1`;
    }
  };

  const debouncedValue = useRef("");

  const getData = async () => {
    setLoading(true);
    const data = await getPokemonData(window.location.origin, page);
    if (data.length > 0) {
      setNoData(false);
      setPokemonData(data);
    } else {
      setNoData(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page]);

  const searchFunction = async (value) => {
    setLoading(true);
    const data = await searchPokemon(value);
    if (data.length > 0) {
      setNoData(false);
      setPokemonData(data);
    } else {
      setNoData(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    const debounceSearch = () => {
      if (debouncedValue.current != "") {
        searchFunction(debouncedValue.current);
      }
    };
    const debouncedEffect = setTimeout(() => {
      debounceSearch();
    }, 300);

    return () => {
      clearTimeout(debouncedEffect);
    };
  }, [debouncedValue.current]);
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedValue.current = e.target.value;
  };
  const sortedPokemon = useMemo(
    () =>
      [...pokemonData].sort((a, b) => {
        const aVal =
          a.stats[a.stats.findIndex((a) => a.stat.name === sortStat)].base_stat;
        const bVal =
          b.stats[b.stats.findIndex((b) => b.stat.name === sortStat)].base_stat;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }),
    [sortStat, sortOrder, pokemonData]
  );

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className={styles.home}
      onClick={() => {
        animateReverseCard();
        setIsOpenId(null);
      }}
    >
      <div className={styles.header}>
        <h1>
          P
          <Image
            className={styles.pokeball}
            src={pokeballSVG}
            alt="pokeball"
            width={26}
            height={26}
          />
          kémon
        </h1>
        <div className={styles.inputAndSorting}>
          <input
            className={styles.search}
            onChange={handleInputChange}
            placeholder="Search for a Pokemon"
            value={searchTerm}
          />
          <div className={styles.selectWrapper}>
            <select name="stats" onChange={(e) => setSortStat(e.target.value)}>
              <option value="speed">Speed</option>
              <option value="special-defense">Special Defense</option>
              <option value="special-attack">Special Attack</option>
              <option value="defense">Defense</option>
              <option value="attack">Attack</option>
              <option value="hp">HP</option>
            </select>
          </div>
          <div className={styles.selectWrapper}>
            <select
              name="order"
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              defaultValue={"desc"}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className={styles.pagination}>
          {searchTerm ? (
            <div
              className={styles.clear}
              onClick={() => {
                setSearchTerm("");
                getData();
              }}
            >
              Clear
            </div>
          ) : (
            <>
              <div
                aria-disabled={page === 1}
                onClick={() => {
                  page > 1 && setPage(page - 1);
                }}
              >
                {"<"}
              </div>
              <div onClick={() => setPage(page + 1)}>{">"}</div>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Lottie options={defaultOptions} height={100} width={100} />
        </div>
      ) : !noData ? (
        <div className={styles.pokemonCards}>
          {sortedPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              sortStat={sortStat}
              isOpenId={isOpenId}
              setIsOpenId={setIsOpenId}
            />
          ))}
        </div>
      ) : (
        <b>No results for &quot;{searchTerm}&quot;</b>
      )}
    </div>
  );
};

export default Home;
