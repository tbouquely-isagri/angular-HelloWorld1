import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
  `,
})
export class App {
  name = 'Angular';
}

class Person {
  name: string;
  weight: number;
  public weightValidate() {
    if (this.weight < 0) {
      return 'le poids ne peut etre inférieure à zéro !';
    } else {
      return '';
    }
  }
}

bootstrapApplication(App);
