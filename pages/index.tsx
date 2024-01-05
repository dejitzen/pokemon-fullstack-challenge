import React, { useEffect, useMemo, useRef, useState } from "react";
import PokemonCard from "../components/PokemonCard/PokemonCard";
import { getPokemonData } from "../endpoints/getPokemonData";
import { searchPokemon } from "../endpoints/searchPokemon";
import { Pokemon } from "../entities/Pokemon";
import styles from "./Home.module.scss";
import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import animation from "../assets/animation.json";
import Home from "../screens/Home/Home";

export async function getServerSideProps({ req }) {
  const originUrl = req ? `http://${req?.headers?.host}` : "";
  const data = await getPokemonData(originUrl, 1);
  if (data.length === 0) {
    return { notFound: true };
  }
  return { props: { data } };
}
const pokeballSVG = "https://www.svgrepo.com/show/276264/pokeball-pokemon.svg";

const Index: React.FC = ({ data }: { data: Pokemon[] }) => {
  return (
    <>
      <Head>
        <title>Pokémon</title>
        <link rel="icon" type="image/x-icon" href={pokeballSVG}></link>
      </Head>
      <Home data={data} />
    </>
  );
};

export default Index;
