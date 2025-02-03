// subnet-form.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

interface Subnet {
  name: string;
  cidr: string;
}

@Component({
  selector: 'app-subnet-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <form [formGroup]="subnetForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill">
        <mat-label>Subnet Name</mat-label>
        <input matInput formControlName="name" placeholder="Enter subnet name">
        @if (subnetForm.get('name')?.hasError('required') && subnetForm.get('name')?.touched) {
          <mat-error>Subnet name is required</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>CIDR</mat-label>
        <input matInput formControlName="cidr" placeholder="Enter CIDR (e.g., 10.0.0.0/24)">
        @if (subnetForm.get('cidr')?.hasError('required') && subnetForm.get('cidr')?.touched) {
          <mat-error>CIDR is required</mat-error>
        }
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" 
              [disabled]="!subnetForm.valid">
        Add Subnet
      </button>
    </form>

    <div class="subnets-list">
      <h3>Subnets:</h3>
      @for (subnet of subnets; track subnet.name) {
        <div class="subnet-item">
          {{ subnet.name }} - {{ subnet.cidr }}
        </div>
      }
    </div>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      margin: 2rem auto;
    }

    .subnets-list {
      margin-top: 2rem;
      max-width: 400px;
      margin: 2rem auto;
    }

    .subnet-item {
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
  `]
})
export class SubnetFormComponent {
  subnetForm: FormGroup;
  subnets: Subnet[] = [];

  constructor(private fb: FormBuilder) {
    this.subnetForm = this.fb.group({
      name: ['', Validators.required],
      cidr: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.subnetForm.valid) {
      const newSubnet: Subnet = {
        name: this.subnetForm.value.name,
        cidr: this.subnetForm.value.cidr
      };
      
      this.subnets.push(newSubnet);
      this.subnetForm.reset();
    }
  }
}
