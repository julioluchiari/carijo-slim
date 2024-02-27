## Carijó Slim

Um modesto competidor muito para a [Rinha de Backend - 2024/Q1]().

PS: O sufixo `slim` existe porque tentei fazer com NestJS e TypeORM e não deu muito certo.

> Carijó é o galo da "Galinha Pintadinha"

## Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nginx](https://www.nginx.com/)

## Requisitos

- [Docker](https://www.docker.com/)
- [GNU Make](https://www.gnu.org/software/make/)
- [Node.js 20.11.1](https://nodejs.org/)
- [Gatling](https://gatling.io/)

## Executar a aplicação localmente

Para inicializar o postgres:

```
make docker-up
```

Para inicializar o servidor express:

```bash
make install
make start
```

Verificar se está funcionando:

```bash
make health
```

## Executar o stress test

```bash
make stress-test
```

## Demais comandos disponíveis

```bash
make help
```

## Licença

<a href="http://www.wtfpl.net/"><img src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png" width="80" height="15" alt="WTFPL" /></a>

Carijó Slim possui [licença WTFPL](LICENSE).
