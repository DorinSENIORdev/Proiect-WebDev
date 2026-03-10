# EasySell API (SQL Server)

## 1. Instaleaza dependintele

```bash
npm install
```

## 2. Configureaza variabilele de mediu

1. Copiaza `.env.example` in `.env`
2. Completeaza utilizatorul/parola SQL Server in `.env`

> Pentru SQL Server Express local, poti pastra:
> - `DB_SERVER=localhost`
> - `DB_INSTANCE=SQLEXPRESS`

## 3. Creeaza baza de date

1. Deschide SQL Server Management Studio
2. Ruleaza scriptul [sql/init.sql](./sql/init.sql)
3. Ruleaza scriptul [sql/create-app-login.sql](./sql/create-app-login.sql)
4. Pune aceeasi parola in `.env` la `DB_PASSWORD`

## 4. Porneste API-ul

```bash
npm run dev
```

API health check:

`GET http://localhost:4000/api/health`
