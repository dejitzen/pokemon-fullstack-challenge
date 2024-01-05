import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PokemonCard from "./PokemonCard";

const mockPokemon = {
  id: 1,
  name: "Bulbasaur",
  stats: [{ base_stat: 45, effort: 0, stat: { name: "hp", url: "" } }],
  types: [{ slot: 1, type: { name: "grass", url: "" } }],
};

test("renders PokemonCard component", () => {
  const { getByText, getByAltText, getByTestId } = render(
    <PokemonCard
      pokemon={mockPokemon}
      sortStat="hp"
      isOpenId={null}
      setIsOpenId={() => {}}
    />
  );

  expect(getByText("Bulbasaur")).toBeInTheDocument();
  expect(getByAltText("Bulbasaur")).toBeInTheDocument();
  expect(getByTestId("pokemon-card")).toBeInTheDocument();
});

test("handles click event correctly", () => {
  const setIsOpenIdMock = jest.fn();
  const { getByTestId } = render(
    <PokemonCard
      pokemon={mockPokemon}
      sortStat="hp"
      isOpenId={null}
      setIsOpenId={setIsOpenIdMock}
    />
  );

  fireEvent.click(getByTestId("pokemon-card"));

  expect(setIsOpenIdMock).toHaveBeenCalledWith(mockPokemon.id);
});
