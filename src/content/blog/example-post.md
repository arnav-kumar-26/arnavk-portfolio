---
title: "Example Post — Static Content Collections"
description: "A minimal example post validating the blog collection Zod schema and build-time type checking."
publishDate: 2025-08-10
tags: ["astro", "content-collections"]
draft: false
---

This is an example post for the `blog` collection. It validates that frontmatter conforms to the Zod schema in `src/content.config.ts`.

## Why this exists

- Proves `getCollection('blog')` can query this entry at build time.
- Malformed frontmatter (e.g., missing `title` or too-long `description`) fails `astro build`, not runtime.

Hello from the portfolio blog.
