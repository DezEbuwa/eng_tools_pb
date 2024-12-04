To build an offline searchable knowledgebase in Angular using a JSON file, you can follow these steps. I'll provide a basic starter structure to get you going.

### 1. **Project Setup**

First, create a new Angular project if you haven't already:

```bash
ng new knowledgebase-app
cd knowledgebase-app
```

### 2. **Structure of the JSON File**

Your JSON file will act as your data source. Let's assume your knowledgebase consists of articles, and each article has an `id`, `title`, `content`, and `tags`. Here's an example `knowledgebase.json`:

```json
[
  {
    "id": 1,
    "title": "Getting Started with Angular",
    "content": "Angular is a platform and framework for building single-page client applications using HTML and TypeScript.",
    "tags": ["Angular", "Beginner", "Frontend"]
  },
  {
    "id": 2,
    "title": "Understanding Components",
    "content": "Components are the basic building blocks of Angular applications. Each component is an independent block of the larger system.",
    "tags": ["Angular", "Components", "Frontend"]
  }
]
```

### 3. **Create a Service to Load JSON**

In your Angular project, create a service to load and search through this JSON file.

```bash
ng generate service knowledgebase
```

In the generated `knowledgebase.service.ts`, add the following code:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KnowledgebaseService {

  private jsonUrl = 'assets/knowledgebase.json'; // Path to your JSON file

  constructor(private http: HttpClient) { }

  getKnowledgebase(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
}
```

### 4. **Add the JSON File to Assets**

Place your `knowledgebase.json` file in the `src/assets/` directory of your Angular project.

### 5. **Create a Component to Display and Search Data**

Generate a component where you will display and search through the articles.

```bash
ng generate component knowledgebase-list
```

In `knowledgebase-list.component.ts`, use the service to fetch and filter the data:

```typescript
import { Component, OnInit } from '@angular/core';
import { KnowledgebaseService } from '../knowledgebase.service';

@Component({
  selector: 'app-knowledgebase-list',
  templateUrl: './knowledgebase-list.component.html',
  styleUrls: ['./knowledgebase-list.component.css']
})
export class KnowledgebaseListComponent implements OnInit {
  articles: any[] = [];
  searchTerm: string = '';

  constructor(private kbService: KnowledgebaseService) { }

  ngOnInit(): void {
    this.kbService.getKnowledgebase().subscribe(data => {
      this.articles = data;
    });
  }

  filterArticles() {
    if (!this.searchTerm) {
      return this.articles;
    }

    return this.articles.filter(article =>
      article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
```

### 6. **Create the HTML Template**

In `knowledgebase-list.component.html`, add a search box and display the filtered articles:

```html
<div>
  <input type="text" [(ngModel)]="searchTerm" placeholder="Search the knowledgebase" />
</div>

<div *ngFor="let article of filterArticles()">
  <h3>{{ article.title }}</h3>
  <p>{{ article.content }}</p>
  <ul>
    <li *ngFor="let tag of article.tags">{{ tag }}</li>
  </ul>
  <hr />
</div>
```

### 7. **Import Necessary Modules**

Ensure you have the `HttpClientModule` and `FormsModule` imported in your `AppModule` (`app.module.ts`):

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { KnowledgebaseListComponent } from './knowledgebase-list/knowledgebase-list.component';

@NgModule({
  declarations: [
    AppComponent,
    KnowledgebaseListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 8. **Run the Application**

Finally, run your application:

```bash
ng serve
```

You should now have a basic offline searchable knowledgebase in Angular using a JSON file as your data source. The articles are displayed, and you can search through them using the search box.

This starter can be expanded upon, with features like advanced filtering, categorization, and more.
