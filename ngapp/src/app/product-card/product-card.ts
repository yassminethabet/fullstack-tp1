import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<Product>();

  shortDescription = computed(() => {
    const d = this.product().description;
    return d.length > 80 ? d.slice(0, 80) + '...' : d;
  });
}