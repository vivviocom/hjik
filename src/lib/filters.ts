import type { Category, Collection, Product } from "../types";

export const filterByCategory =
  (cat: Category) =>
  (p: Product) =>
    p.category === cat || p.category === "unisex";

export const filterByCollection =
  (col: Collection) =>
  (p: Product) =>
    p.collections.includes(col);
