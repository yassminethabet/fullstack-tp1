import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product';
import { Product, ProductInput } from '../models/product';

const EMPTY: ProductInput = {
  title: '',
  description: '',
  price: 0,
  thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.webp',
  stock: 0,
  category: '',
};

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private service = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  message = signal('');
  editingId = signal<number | null>(null);
  form: ProductInput = { ...EMPTY };

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.service.getProducts(100, 0).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load the products');
        this.loading.set(false);
      },
    });
  }

  edit(p: Product) {
    this.editingId.set(p.id);
    this.form = {
      title: p.title,
      description: p.description,
      price: Number(p.price),
      thumbnail: p.thumbnail,
      stock: p.stock,
      category: p.category.name,
    };
    this.message.set('');
  }

  cancel() {
    this.editingId.set(null);
    this.form = { ...EMPTY };
  }

  save() {
    this.error.set('');
    const id = this.editingId();
    const request = id
      ? this.service.updateProduct(id, this.form)
      : this.service.createProduct(this.form);

    request.subscribe({
      next: () => {
        this.message.set(id ? 'Product updated' : 'Product created');
        this.cancel();
        this.load();
      },
      error: () => this.error.set('Unable to save the product'),
    });
  }

  remove(p: Product) {
    if (!confirm(`Delete "${p.title}" ?`)) return;
    this.service.deleteProduct(p.id).subscribe({
      next: () => {
        this.message.set('Product deleted');
        this.load();
      },
      error: () => this.error.set('Unable to delete the product'),
    });
  }
}