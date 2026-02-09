import { createContext, useContext, useState } from "react";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <SelectionContext.Provider
      value={{
        selectedCustomer,
        setSelectedCustomer,
        selectedItems,
        setSelectedItems
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);
