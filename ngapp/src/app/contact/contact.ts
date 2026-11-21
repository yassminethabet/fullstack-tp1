import { Component , inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [FormsModule],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
   id: string | null = null;
  private route = inject(ActivatedRoute);
formData = {
  name: '',
  email: '',
};

onSubmit() {
  console.log('Form submitted:', this.formData);
}
  constructor() {
    // 'id' is the same name used in the route definition
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
  }
}
