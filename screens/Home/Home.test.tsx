import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import Home from "./Home";

const mockPokemonData = [
  {
    id: 1,
    name: "Bulbasaur",
    stats: [{ base_stat: 45, effort: 0, stat: { name: "hp", url: "" } }],
    types: [{ slot: 1, type: { name: "grass", url: "" } }],
  },
];

test("renders Home component", async () => {
  const { getByText } = render(<Home data={mockPokemonData} />);
  const titleRegex = /P(?:<img .*? \/>|\.|kémon)/i;
  const titleElement = getByText(titleRegex);

  expect(titleElement).toBeInTheDocument();
});
