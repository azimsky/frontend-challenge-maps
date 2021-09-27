import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";

/*
  This is just a glimpse of testing.
  To make a proper testing it is required to deeply refactor the code:
  - extract inner Components from Main
  - exctract API calls
  - implement a state management
  That's the idea, but it is not easy to implement within the given time frame.
*/

import Main from "./index";

// ideally import it from the same place that in the Component itself
const mockFilters = [
	{ id: 'pizza', label: 'Pizza' },
	{ id: 'burgers', label: 'Burger' },
	{ id: 'sushi', label: 'Sushi' },
];

afterEach(cleanup);

it('Filters by category is there', () => {
  const { container } = render(<Main />);
  const filters = container.querySelectorAll('[data-qa="filter__category"]');

  expect(filters.length).toEqual(mockFilters.length);
  expect(filters[0].textContent).toEqual(mockFilters[0].label);
});

it('Clicking on the category changes state', () => {
  const { container } = render(<Main />);
  const filters = container.querySelectorAll('[data-qa="filter__category"]');

  fireEvent.click(filters[0]);

  const activeButton = container.querySelector('.MuiButton-contained');
  const progressLoader = container.querySelector('.MuiCircularProgress-root');

  // loader is spinning
  expect(progressLoader).toBeInTheDocument();
  // chosen category should be Pizza
  expect(activeButton.textContent).toEqual(mockFilters[0].label);
});
