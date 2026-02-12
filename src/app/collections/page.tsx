import { getActiveProducts } from "@/lib/data";
import { ShopClient } from "./ShopClient";

export default async function CollectionsPage() {
  const products = await getActiveProducts();
  return <ShopClient products={products} />;
}
