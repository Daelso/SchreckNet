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

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
