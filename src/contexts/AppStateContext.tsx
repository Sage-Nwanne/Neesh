import { createContext, useContext, useReducer } from 'react';

const AppStateContext = createContext();

const appStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, {
    loading: false,
    error: null,
  });

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);