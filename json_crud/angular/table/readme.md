To implement pagination in an Angular table, you can use **Angular Material's MatTable with MatPaginator**. Here’s how to set it up using your `Deployment` data.

---

### **Step 1: Install Angular Material (if not installed)**
Run the following command in your Angular project:
```sh
ng add @angular/material
```
Choose a theme and enable global styles as prompted.

---

### **Step 2: Import Material Modules**
Modify your `app.module.ts` to include the required Material modules:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

### **Step 3: Create a Deployment Table Component**
Generate a new component:
```sh
ng generate component components/deployment-table
```

Modify the `deployment-table.component.ts` file:

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeploymentService } from '../../services/deployment.service';
import { Deployment } from '../../models/deployment.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-deployment-table',
  templateUrl: './deployment-table.component.html',
  styleUrls: ['./deployment-table.component.css']
})
export class DeploymentTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'status'];
  dataSource = new MatTableDataSource<Deployment>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private deploymentService: DeploymentService) {}

  ngOnInit(): void {
    this.deploymentService.getDeployments().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
```

---

### **Step 4: Create the Table in the HTML Template**
Modify `deployment-table.component.html`:

```html
<div class="table-container">
  <mat-form-field>
    <input matInput (keyup)="applyFilter($event)" placeholder="Filter deployments">
  </mat-form-field>

  <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
      <td mat-cell *matCellDef="let deployment">{{ deployment.name }}</td>
    </ng-container>

    <!-- Description Column -->
    <ng-container matColumnDef="description">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
      <td mat-cell *matCellDef="let deployment">{{ deployment.description }}</td>
    </ng-container>

    <!-- Status Column -->
    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
      <td mat-cell *matCellDef="let deployment">{{ deployment.status }}</td>
    </ng-container>

    <!-- Table Header & Rows -->
    <thead>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    </thead>
    <tbody>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </tbody>
  </table>

  <!-- Pagination Controls -->
  <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
</div>
```

---

### **Step 5: Add Styling (Optional)**
Modify `deployment-table.component.css`:

```css
.table-container {
  width: 100%;
  margin: 20px 0;
}

mat-form-field {
  width: 100%;
  margin-bottom: 10px;
}
```

---

### **Step 6: Use the Component in Your App**
Modify `app.component.html`:

```html
<app-deployment-table></app-deployment-table>
```

---

### **Step 7: Run Your Angular App**
Start your application:
```sh
ng serve
```

Now, your deployments are displayed in a paginated table with sorting and filtering functionality. 🚀 Let me know if you need any improvements!
