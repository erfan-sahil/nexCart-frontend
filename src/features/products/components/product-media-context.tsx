"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProductMediaContextValue = {
  activeImage: string | null;
  showImage: (src: string) => void;
};

const ProductMediaContext = createContext<ProductMediaContextValue | null>(
  null,
);

export function ProductMediaProvider({ children }: { children: ReactNode }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const value = useMemo(
    () => ({ activeImage, showImage: setActiveImage }),
    [activeImage],
  );

  return (
    <ProductMediaContext.Provider value={value}>
      {children}
    </ProductMediaContext.Provider>
  );
}

export function useProductMedia() {
  const context = useContext(ProductMediaContext);

  if (!context) {
    throw new Error("useProductMedia must be used within ProductMediaProvider");
  }

  return context;
}
