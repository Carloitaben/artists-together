# Artists Together Database

The source code of the database service for all Artist Together apps.

## Development

Install workspace dependencies in the root directory:

```shell
pnpm install
```

Start the `libsql` server:

```shell
pnpm --filter db dev
```

Run the `push` script on a separate terminal to bootstrap the database:

```shell
pnpm --filter db push
```

> **Note**
> When making changes in the database schema, run the `push` script to apply the updates. Learn more about prototyping with `db push` in the [Drizzle ORM documentation](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).

You can visually browse and modify the database using the `studio` command:

```shell
pnpm --filter db studio
```
