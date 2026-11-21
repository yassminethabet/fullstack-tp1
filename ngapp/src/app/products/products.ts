import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../product';
import { Product } from '../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products',
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private service = inject(ProductService);
  readonly limit = 12;

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  skip = signal(0);
  total = signal(0);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service.getProducts(this.limit, this.skip()).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load the products');
        this.loading.set(false);
      },
    });
  }

  next() {
    if (this.skip() + this.limit < this.total()) {
      this.skip.update((s) => s + this.limit);
      this.load();
    }
  }

  previous() {
    if (this.skip() > 0) {
      this.skip.update((s) => s - this.limit);
      this.load();
    }
  }
}