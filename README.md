# Oasis Quartermaster

An army list builder for [Oasis: Tactical Salvage Reclamation](http://oasiswargame.com)
. Build, validate, save, and print army lists, look up the rules, and roll dice.

## Features

- **Army list builder** — pick a faction, list type, units, and commands, with live validation of points and faction/unit rules.
- **Drafts without an account** — guests can build a list as a local draft and view, edit, or print it; signing in lets you save it.
- **Saved lists** — registered users can create, edit, duplicate, delete, and optionally make lists public.
- **Printing** — print a list as a unit list, unit cards, or faction and command cards.
- **Rules reference** and a **dice roller**.
- **Accounts** — registration, login, email verification, password reset, and 2FA via Laravel Fortify.

## Tech Stack

- **Backend:** PHP 8.3+, Laravel 13, Fortify, Sanctum, Inertia v3
- **Frontend:** Vue 3 + TypeScript, Bootstrap 5 / bootstrap-vue-next, Pinia, Sass
- **Tooling:** Vite (via Vite+), Laravel Wayfinder (typed route helpers), Pest, Pint, Larastan
- **Database:** MySQL

## Getting Started

### Requirements

- PHP 8.3+ and Composer
- Node.js and pnpm
- MySQL
- [Laravel Herd](https://herd.laravel.com) (recommended; serves the app at `http://oasis-quartermaster.test`)

### Installation

```bash
composer install
pnpm install

cp .env.example .env   # then set your DB_* credentials
php artisan key:generate
php artisan migrate --seed
```

The seeder creates a local test user (`test@oasis-testing.com` / `oasis-test1234`) when `APP_ENV=local`, and loads the units, factions, list types, and commands from `static-data/data.json`.

### Development

```bash
composer run dev   # or: pnpm dev
```

If you're using Herd, the site is already served. Otherwise, run `php artisan serve` alongside the dev server.

## Game Data

The game data lives in `resources/data/`:

| File | Contents |
| --- | --- |
| `master-unit-grid.csv` | Master spreadsheet of unit stats |
| `units.ts` | Units, generated from the CSV |
| `factions.ts`, `commands.ts`, `army-list-types.ts` | Factions, commands, and list types |
| `abilities-and-traits.ts` | Unit abilities and traits |

To update the unit stats:

1. Update `resources/data/master-unit-grid.csv`.
2. Regenerate `units.ts` with `pnpm import:units`.
3. Run `pnpm dev` or `pnpm build`. A Vite plugin compiles `resources/data/*.ts` into `static-data/data.json`.
4. Reseed the database with `php artisan db:seed` so the backend picks up the new IDs and names.

## Project Structure

```
app/
  Http/Controllers/ArmyListController.php   # List CRUD, drafts, printing
  Models/                                   # ArmyList, Unit, Faction, Command, ArmyListType
database/seeders/                           # Seeds game data from static-data/data.json
resources/
  data/                                     # Game data source (see above)
  js/
    pages/                                  # Inertia pages (ArmyLists, Rules, DiceRoller, auth, settings)
    composables/                            # Army list and unit helpers
    lib/                                    # Validation rules, draft storage, Vite static-data plugin
  scripts/import-units.mjs                  # CSV → units.ts importer
routes/web.php                              # App routes
tests/Feature/                              # Pest feature tests
```

## Testing & Code Quality

```bash
php artisan test --compact   # Pest tests
composer lint                # Format PHP with Pint
composer types:check         # PHPStan / Larastan
pnpm check                   # Lint and format the frontend
pnpm types:check             # vue-tsc
composer ci:check            # All of the above
```

## License

The source code is licensed under the [GNU Affero General Public License v3.0](LICENSE). If you run a modified version of this app as a network service, you must make your modified source available to its users.

Code is licensed under AGPL-3.0. Oasis: Tactical Salvage Reclamation names, artwork, and game data are © their respective owners and not covered by this license.
