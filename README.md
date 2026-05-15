# SchreckNet (WoD Character Creator)

This is a character creator app based on the World of Darkness (Vampire: the Masquerade, Werewolf: the Apocalypse, etc) line of games. It features book-legal character creation, character saving and sharing, export to PDF and more. I made this while learning JS so some of the code is absolutely abysmal. Look more towards Werewolf code and stuff that came after for a semblence of decent work.

https://discord.gg/CvUuaM84Ng

## Env format:

```
ENV = "DEV"
# or prod above, I use it to differentiate environments for annoying CORs issues on local dev
PORT = 3000
# whatever you want
ACCESS_TOKEN_SECRET = yoursecrethere
REFRESH_TOKEN_SECRET = yoursecrethere
DB_HOST = "yourHostHere"
DB_NAME = "yourDbNameHere"
DB_USER = "yourSqlUser"
DB_PASSWORD = "yourSqlPw"
MAILER_USER = "yourmaileruser"
MAILER_PASSWORD = "yourmailerpw"
RESET_TOKEN_SECRET = yourresetsecret
OWNER_EMAIL = "owner email"
```

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

## Database migrations

Schema changes go through sequelize-cli (introduced 2026-05). The flow:

```bash
npm run migration:create -- some-name   # scaffolds server/migrations/<ts>-some-name.js
# edit the generated file
npm run db:migrate                       # apply
npm run db:migrate:undo                  # undo the most recent migration
```

The CLI reads connection info from `server/config/config.js`, which reuses
the same `.env` keys the app uses at runtime. Migration history is tracked
in a `SequelizeMeta` table created on first run.

Migrations started tracking from the `add-xp-log` migration forward;
prior schema is implicit (defined directly by the Sequelize models).

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
