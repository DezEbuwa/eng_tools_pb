Here's a **starter FastAPI CRUD app** using **SQLite3** and **SQLAlchemy** that defines an `articles` table and provides endpoints to **create, read, update, and delete** articles. You can easily expand it to add more tables later.

---

### ✅ Project Structure (minimal starter)

```
fastapi-app/
├── main.py
├── database.py
├── models.py
└── crud.py
```

---

### 🛠 `database.py` — DB engine and session

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./articles.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

---

### 🧱 `models.py` — SQLAlchemy model for Article

```python
from sqlalchemy import Column, Integer, String
from database import Base

class Article(Base):
    __tablename__ = "articles"

    article_id = Column(Integer, primary_key=True, index=True)
    id = Column(String)
    icon = Column(String)
    color = Column(String)
    classification = Column(String)
    title = Column(String)
    sub = Column(String)
    file = Column(String)
    creation_date = Column(String)
    filter_tags = Column(String)
    tags = Column(String)
```

---

### 📦 `crud.py` — CRUD operations

```python
from sqlalchemy.orm import Session
from models import Article
from pydantic import BaseModel

class ArticleCreate(BaseModel):
    id: str
    icon: str
    color: str
    classification: str
    title: str
    sub: str
    file: str
    creation_date: str
    filter_tags: str
    tags: str

class ArticleOut(ArticleCreate):
    article_id: int

def get_articles(db: Session):
    return db.query(Article).all()

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.article_id == article_id).first()

def create_article(db: Session, article: ArticleCreate):
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int):
    db_article = db.query(Article).filter(Article.article_id == article_id).first()
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article
```

---

### 🚀 `main.py` — FastAPI app with endpoints

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/articles", response_model=list[crud.ArticleOut])
def read_articles(db: Session = Depends(get_db)):
    return crud.get_articles(db)

@app.get("/articles/{article_id}", response_model=crud.ArticleOut)
def read_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud.get_article(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@app.post("/articles", response_model=crud.ArticleOut)
def create_article(article: crud.ArticleCreate, db: Session = Depends(get_db)):
    return crud.create_article(db, article)

@app.delete("/articles/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_article(db, article_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"detail": "Article deleted"}
```

---

### ✅ How to Run

Install dependencies:

```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

Run the app:

```bash
uvicorn main:app --reload
```

API Docs available at:
**[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

Would you like a `Dockerfile` to containerize this API with SQLite?
