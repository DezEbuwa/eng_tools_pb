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
