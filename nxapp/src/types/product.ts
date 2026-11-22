export interface Category {
  id: number;
  name: string;
}

export interface CategoryWithCount extends Category {
  _count: { products: number };
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | string;
  thumbnail: string;
  stock: number;
  category: Category;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}