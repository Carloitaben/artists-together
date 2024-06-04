# Contributor Manual

> **Tip for new contributors:**
> Take a look at [https://github.com/firstcontributions/first-contributions](https://github.com/firstcontributions/first-contributions) for helpful information on contributing

## Quick Guide

### Prerequisites

```shell
node: ">=20"
```

### Setting up your local repository

Clone the repository:

```shell
git clone https://github.com/carloitaben/artists-together.git
```

Enable [Corepack](https://nodejs.org/api/corepack.html):

```shell
corepack enable
```

Install workspace dependencies in the root directory:

```shell
pnpm install
```

### Development

This repository is a TypeScript monorepo. A monorepo allows us to share code across applications without friction. To do that, we build _packages_ to share code between _apps_.

#### Packages

A package is a piece of shared code. _Installed packages_ live in the `node_modules` folder, and _local packages_ live in the `/packages` folder.

#### Apps

An app is a _launchable_ project and live in the `/apps` folder.

#### Interacting with packages and apps

Both packages and apps are directories that host a `package.json` file. As a rule of thumb, the `package.json` `name` field corresponds with the directory name. You can interact with any `package.json` using the [`--filter`](https://pnpm.io/filtering) flag of `pnpm`. Usually you will use it followed by the `name` of that `package.json`. Here are some examples:

Install a dependency in `/apps/web`:

```shell
pnpm --filter web add zod
```

Run the `dev` script of `/apps/web`:

```shell
pnpm --filter web dev
```

Install a development-only dependency in `/packages/db`:

```shell
pnpm --filter db add -D typescript
```

Run the `push` script of `/packages/db`:

```shell
pnpm --filter db push
```

### Developing a package or app

Some packages or apps need specific configuration in order to be able to run locally. Refer to their respective `README.md` file to read more.

### Running tests

TODO

## Branches

TODO improve this section

### `main`

The **stable** release of `apps` and `packages` happens on this branch. Pull requests landed here will redeploy production environments.

### Other branches

Other branches are usually linked to a pull request.
