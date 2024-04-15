import { useContext, createContext, ReactNode, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Props = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;

  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeItem: (id: number) => void;

  cartQuantity: number;
  items: CartItem[];
};

const shoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(shoppingCartContext);
}

export function ShoppingCartProvider({ children }: Props) {
  const [items, setItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
  const [isOpen, setisOpen] = useState(false);

  const cartQuantity = items.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setisOpen(true);
  const closeCart = () => setisOpen(false);

  function getItemQuantity(id: number) {
    return items.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setItems((citem) => {
      if (citem.find((item) => item.id === id) == null) {
        return [...citem, { id, quantity: 1 }];
      } else {
        return citem.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setItems((citem) => {
      if (citem.find((item) => item.id === id)?.quantity === 1) {
        return citem.filter((item) => item.id !== id);
      } else {
        return citem.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeItem(id: number) {
    setItems((citem) => {
      return citem.filter((item) => item.id !== id);
    });
  }

  return (
    <shoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeItem,
        openCart,
        closeCart,
        cartQuantity,
        items,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </shoppingCartContext.Provider>
  );
}
