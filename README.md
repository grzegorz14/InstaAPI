# Insta API Node.js

This API is used by InstaClient android app (in my repos). It's a server written in basic Node.js without express.

Models on server:
- user (password is hashed and token is needed to confirm account and authorize requests)
- post (contains image and tag model)
- image (images and videos are stored on server)
- tag

Uploads folder contains uploaded files and initial example files.
Endpoints are tested by simple http requests in tests folder.

## Run locally

```
  npm install
  node .\index.js
```

