# Mesto: деплой на сервер через PM2

Учебный проект Mesto с раздельными `backend` и `frontend`, подготовленный к деплою на Ubuntu-сервер через `pm2 deploy`.

## Адреса

- IP сервера: `51.250.16.114`
- Frontend: `http://artem-mesto.nomoreparties.nomorepartiessite.ru`
- API: `https://api-artem-mesto.nomorepartiessite.ru`
- SSH-доступ: `temaberezkin@51.250.16.114`

## Репозиторий

```bash
git clone git@github.com:ArtemBerezkin/pm2-deploy.git
cd pm2-deploy
```

## Backend

Установка и локальная проверка:

```bash
cd backend
npm ci
npm run lint
npm run build
npm run start
```

Перед запуском нужен локальный файл `backend/.env`. Пример доступен в `backend/.env.example`.

Минимальные переменные:

```env
NODE_ENV=production
JWT_SECRET=replace_with_a_strong_secret
```

Если MongoDB работает локально на сервере по адресу `mongodb://localhost:27017/mestodb`, переменную `DB_ADDRESS` можно не задавать.

## Frontend

Установка и сборка:

```bash
cd frontend
npm ci
npm run build
```

Frontend обращается к API по адресу:

```text
https://api-artem-mesto.nomorepartiessite.ru
```

Собранную директорию `frontend/build` раздаёт Nginx. PM2-процесс для frontend не создаётся.

## PM2 Deploy

Настройки deploy берутся из локальных файлов:

- `backend/.env.deploy`
- `frontend/.env.deploy`

Эти файлы игнорируются Git и не должны попадать в коммит.

Backend deploy:

```bash
cd backend
pm2 deploy production setup
pm2 deploy production
```

Во время backend deploy:

- PM2 клонирует репозиторий `git@github.com:ArtemBerezkin/pm2-deploy.git`;
- используется ветка `origin/master`;
- код размещается в `/var/www/mesto-backend`;
- локальный `backend/.env` копируется на сервер в `/var/www/mesto-backend/shared/.env`;
- на сервере выполняются `npm ci`, `npm run build`;
- приложение `mesto-backend` запускается или перезапускается через PM2 на порту `3000`;
- после запуска выполняется `pm2 save`.

Frontend deploy:

```bash
cd frontend
pm2 deploy production setup
pm2 deploy production
```

Во время frontend deploy:

- PM2 клонирует тот же репозиторий и ветку `origin/master`;
- код размещается в `/var/www/mesto-frontend`;
- на сервере выполняются `npm ci` и `npm run build`;
- Nginx раздаёт готовую сборку из директории `frontend/build`.

Команда `setup` нужна только при первом деплое соответствующей части проекта.
