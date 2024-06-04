# Artists Together Website

The source code of the official website for the Artist Together community.

## Development

> **Important**
> Before proceeding, make sure to [set up the `db` package](../../packages/db/README.md).

> **Important**
> Before proceeding, make sure to [set up the `auth` package](../../packages/auth/README.md).

Install workspace dependencies in the root directory:

```shell
pnpm install
```

Run the development server:

```shell
pnpm --parallel --filter db --filter web dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
