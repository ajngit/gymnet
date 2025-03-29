import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-userdetails',
  imports: [CommonModule,RouterModule],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.css'
})
export class UserdetailsComponent {

}
