import { useEffect, useReducer } from "react";
import { CitiesContext } from "./CitiesContext";

const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: true,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    };

    fetchCities();
  }, []);

  const getCity = async (id) => {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city...",
      });
    }
  };

  return (
    <CitiesContext
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
      }}
    >
      {children}
    </CitiesContext>
  );
}

export { CitiesProvider };
