Yes, it's **absolutely possible** to containerize your Angular + FastAPI + SQLite3 application into a **single Podman image** and automate builds/pushes using a **GitLab pipeline** that pushes to **Harbor**.

Here’s a high-level breakdown of how you can do it:

---

### ✅ 1. **Project Structure**
You can structure your repo like this:

```
my-app/
├── frontend/           # Angular 19 app
├── backend/            # FastAPI app (main.py, etc.)
├── database/           # Optional initial SQLite DB file
├── Dockerfile          # For full-stack container
├── .gitlab-ci.yml      # GitLab pipeline config
└── ...
```

---

### ✅ 2. **Single Container Dockerfile (Podman-compatible)**

```Dockerfile
# Build Angular frontend
FROM node:20 as frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install && npm run build

# Build FastAPI backend with SQLite
FROM python:3.11-slim as backend
WORKDIR /app

# Copy backend and install dependencies
COPY backend/ /app/backend
COPY database/ /app/database  # If you have a prebuilt .sqlite3 file
RUN pip install fastapi uvicorn[standard]

# Copy frontend build into backend static folder
COPY --from=frontend-builder /app/frontend/dist/ /app/backend/static/

# Expose the FastAPI app
WORKDIR /app/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```

✅ Make sure `main.py` in FastAPI is serving the Angular build using `StaticFiles`.

---

### ✅ 3. **.gitlab-ci.yml (Using Podman and Push to Harbor)**

```yaml
stages:
  - build
  - push

variables:
  IMAGE_NAME: harbor.example.com/myproject/my-app

build:
  stage: build
  image: quay.io/podman/stable
  script:
    - podman build -t $IMAGE_NAME:$CI_COMMIT_SHORT_SHA .
    - podman tag $IMAGE_NAME:$CI_COMMIT_SHORT_SHA $IMAGE_NAME:latest
    - podman login harbor.example.com -u $HARBOR_USERNAME -p $HARBOR_PASSWORD
    - podman push $IMAGE_NAME:$CI_COMMIT_SHORT_SHA
    - podman push $IMAGE_NAME:latest
```

**Secrets:**
- Store `$HARBOR_USERNAME` and `$HARBOR_PASSWORD` in **GitLab CI/CD variables**.

---

### ✅ 4. **Serving Angular via FastAPI (example)**

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Serve Angular dist folder
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Optional: catch-all to serve index.html for Angular routes
@app.get("/{full_path:path}")
async def serve_vue_app():
    return FileResponse("static/index.html")
```

---

### ✅ 5. **SQLite**
SQLite works well in a container as long as:
- The `.sqlite3` file is in the container and has appropriate read/write permissions.
- If you want persistent data across container runs, mount a volume.

---

### ⚠️ Notes
- Podman can run in rootless mode, and in GitLab it often runs in rootless containers. You might need to tweak permissions or use `--storage-driver=vfs` in the GitLab job if needed.
- If you're using a remote runner, ensure Podman is installed and has access to the required storage/network features.



Great question — if you're pushing your image to **Harbor** and want an easy way to **pull and run it**, you can use **Podman** just like Docker. Here's how to do it step-by-step:

---

### 🛠️ 1. **Log in to Harbor (if needed)**

```bash
podman login harbor.example.com
```

You'll be prompted for your username and password (or you can use `-u` and `-p` options).

---

### 📥 2. **Pull the Image**

Replace `yourproject` and `yourimage` with your Harbor project and image name.

```bash
podman pull harbor.example.com/yourproject/yourimage:latest
```

Or use a specific tag, e.g.:
```bash
podman pull harbor.example.com/yourproject/yourimage:abc123
```

---

### ▶️ 3. **Run the Container**

Here’s a basic command to run it:

```bash
podman run -d --name my-web-app -p 8080:80 harbor.example.com/yourproject/yourimage:latest
```

This:
- Runs in the background (`-d`)
- Names the container `my-web-app`
- Maps host port `8080` to container port `80` (where FastAPI is running)
- Uses your image

Now you can access your app at:  
**http://localhost:8080**

---

### 🧱 4. (Optional) Mount a Volume for Persistent SQLite

If your FastAPI app uses an SQLite file and you want to **persist it across runs**:

```bash
podman run -d \
  --name my-web-app \
  -p 8080:80 \
  -v /host/data/sqlite:/app/backend/database \
  harbor.example.com/yourproject/yourimage:latest
```

Make sure your FastAPI app points to `/app/backend/database/yourfile.sqlite`.

---

Let me know if you also want a helper shell script or `make` target to streamline this for your team.



---

Would you like me to generate the full example `.gitlab-ci.yml` or Dockerfile customized to your folder structure?

### ✅ `.gitlab-ci.yml`

```yaml
stages:
  - build
  - push

variables:
  IMAGE_NAME: harbor.example.com/myproject/my-app
  TAG: $CI_COMMIT_SHORT_SHA

# Podman-in-Docker image (or install manually if using custom runner)
build:
  stage: build
  image: quay.io/podman/stable
  before_script:
    - echo "Using Podman version:"
    - podman --version
  script:
    # Optional: debug build context
    - ls -la
    # Build the container image with Podman
    - podman build -t $IMAGE_NAME:$TAG -t $IMAGE_NAME:latest .
  artifacts:
    paths:
      - .podman/images # optional for caching
    expire_in: 1 hour

push:
  stage: push
  image: quay.io/podman/stable
  script:
    - echo "$HARBOR_PASSWORD" | podman login harbor.example.com -u "$HARBOR_USERNAME" --password-stdin
    - podman push $IMAGE_NAME:$TAG
    - podman push $IMAGE_NAME:latest
  only:
    - main  # or "master", or remove this line to run on every commit
```

---

### 🔐 GitLab CI/CD Variables (set in your repo under Settings → CI/CD → Variables):

| Variable           | Description                   |
|--------------------|-------------------------------|
| `HARBOR_USERNAME`  | Your Harbor registry username |
| `HARBOR_PASSWORD`  | Harbor password or robot token|

---

### 🧱 Dockerfile Path

Ensure the `Dockerfile` is at the **root** of your repo, or update the build command like:

```yaml
- podman build -f path/to/Dockerfile -t $IMAGE_NAME:$TAG .
```

---

### ✅ Optional Improvements

- **Trigger only on certain branches or tags**:
  ```yaml
  only:
    - main
    - tags
  ```

- **Add cache for faster builds** using a Podman volume or GitLab cache (can add later if builds get long).

- **Enable CI/CD for merge requests** to preview changes.

---

Let me know if you want the `Dockerfile` updated to match this CI/CD flow exactly or want to build/test Angular and FastAPI separately before the full image build.
