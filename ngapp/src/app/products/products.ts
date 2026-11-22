import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product';
import { CategoryWithCount, Product } from '../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products',
  imports: [ProductCard, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private service = inject(ProductService);
  readonly limit = 12;

  products = signal<Product[]>([]);
  categories = signal<CategoryWithCount[]>([]);
  loading = signal(true);
  error = signal('');
  skip = signal(0);
  total = signal(0);

  q = '';
  category = '';

  constructor() {
    this.service.getCategories().subscribe({
      next: (c) => this.categories.set(c),
    });
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service
      .getProducts(this.limit, this.skip(), this.q, this.category)
      .subscribe({
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

  search() {
    this.skip.set(0);
    this.load();
  }

  reset() {
    this.q = '';
    this.category = '';
    this.search();
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