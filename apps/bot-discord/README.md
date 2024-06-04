# Pal @ Discord

The source code of the Discord integration of Pal (Programmable Artistic Life-form), the assistant bot for the Artist Together community.

## Development

> **Important**
> Before proceeding, make sure to [install `bun`](https://bun.sh/).

> **Important**
> Before proceeding, make sure to [set up the `db` package](../../packages/db/README.md).

> **Important**
> Before proceeding, make sure to [set up the `auth` package](../../packages/auth/README.md).

Install workspace dependencies in the root directory:

```shell
pnpm install
```

Run the `dev` command to start the server in development mode:

```shell
pnpm --parallel --filter db --filter bot-discord dev
```
