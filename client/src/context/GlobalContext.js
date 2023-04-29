import { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const [currentPin, setCurrentPin] = useState(null);
  const [newPin, setNewPin] = useState(null);
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('pin-my-map-user'))
  );

  const getPins = useCallback(async () => {
    if (authUser) {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${authUser.user.id}`
      );
      if (res.status !== 200) {
        toast.error('Network error. Please try again later.');
        setIsLoading(false);
      } else {
        const user = await res.json();
        setPins(user.pins);
        setIsLoading(false);
      }
    }
  }, [authUser]);

  useEffect(() => {
    getPins();
  }, [getPins]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        pins,
        setPins,
        authUser,
        setAuthUser,
        currentPin,
        setCurrentPin,
        newPin,
        setNewPin,
        getPins,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
