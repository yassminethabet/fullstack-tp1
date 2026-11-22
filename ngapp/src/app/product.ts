import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  CategoryWithCount,
  Product,
  ProductInput,
  ProductsResponse,
} from './models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  getProducts(
    limit = 12,
    skip = 0,
    q = '',
    category = ''
  ): Observable<ProductsResponse> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    if (q) params = params.set('q', q);
    if (category) params = params.set('category', category);
    return this.http.get<ProductsResponse>(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<CategoryWithCount[]> {
    return this.http.get<CategoryWithCount[]>(`${environment.apiUrl}/categories`);
  }

  createProduct(product: ProductInput): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: number, product: Partial<ProductInput>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}