import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders initial button", () => {
  render(<App />);
  const zero = screen.getByText("Open csv file");
  expect(zero).toBeInTheDocument();
});
