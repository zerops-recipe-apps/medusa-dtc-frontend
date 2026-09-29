# Medusa DTC Storefront Recipe App

<!-- #ZEROPS_EXTRACT_START:intro# -->
Next.js 15 direct-to-consumer storefront for [medusa-dtc](https://github.com/zerops-recipe-apps/medusa-dtc) — catalog, cart, and checkout against Medusa storefront APIs. Wired as the `nextstore` service in the [Medusa DTC recipe](https://app.zerops.io/recipes/medusa-dtc) on [Zerops](https://zerops.io).
<!-- #ZEROPS_EXTRACT_END:intro# -->

Used within [Medusa DTC recipe](https://app.zerops.io/recipes/medusa-dtc) for the Zerops platform.

⬇️ **Deploy the full stack**

[![Deploy on Zerops](https://github.com/zeropsio/recipe-shared-assets/blob/main/deploy-button/light/deploy-button.svg)](https://app.zerops.io/recipes/medusa-dtc?environment=small-production)

![cover](https://github.com/zeropsio/recipe-shared-assets/blob/main/covers/svg/cover-nextjs.svg)

## Repositories

| Repo | Role |
| --- | --- |
| [medusa-dtc](https://github.com/zerops-recipe-apps/medusa-dtc) | Medusa API + admin |
| [medusa-dtc-frontend](https://github.com/zerops-recipe-apps/medusa-dtc-frontend) (this repo) | Next.js DTC storefront |

## Local development

```bash
yarn install
cp .env.template .env.local
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
# NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_…
yarn dev   # http://localhost:8000
```

## Integration Guide

<!-- #ZEROPS_EXTRACT_START:integration-guide# -->

### 1. Adding `zerops.yml`

Same deploy model as [medusa-b2b-frontend](https://github.com/zerops-recipe-apps/medusa-b2b-frontend): `prod` ships the Next build output; `dev` uses `deployFiles: ./`.

```yaml
zerops:
  - setup: prod
    build:
      base: nodejs@24
      buildCommands:
        - yarn
        - yarn build
      deployFiles:
        - .next
        - package.json
        - node_modules
        - public
    run:
      ports:
        - port: 8000
          httpSupport: true
      healthCheck:
        httpGet:
          port: 8000
          path: /api/health

  - setup: dev
    build:
      deployFiles: ./
```

Import YAML sets `buildFromGit` to this repository for `nextstore*` services. Publishable key comes from the backend `setInitialPublishableKey` step into project vault `CHANNEL_PUBLISHABLE_KEY`.

<!-- #ZEROPS_EXTRACT_END:integration-guide# -->
