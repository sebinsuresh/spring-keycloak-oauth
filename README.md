## About

Experimenting with Spring Security + Keycloak + OIDC/OAuth 2.0 + Angular

## Setup

### Create

Run Keycloak server and nginx (port 80 needs to be free):

```bash
docker compose up
```

- Login using `admin` `admin` at http://localhost/auth
- Create realm `spring-resource-users`
- Make sure that's the active realm
- Create client `spring-angular-bff` with
    - `http://localhost/` as home URL
    - `http://localhost/api/login/oauth2/code/keycloak` as valid redirect URI
    - `http://localhost/api/*` and `http://localhost/*` as valid post logout redirect URI
    - `http://localhost` and `http://localhost/*` as web origins
    - Client authentication enabled. Standard flow.
    - **Client secret** will be generated.
- Create user `testuser` `123456` `testuser@example.com`
- Create user `testadmin` `123456` `testadmin@example.com`

### Destroy

Delete keycloak container:

```bash
docker compose down
```

Add the `-v` param if you want to remove the volume as well - this will destroy the realm & data you've created in Keycloak.

## Run

### Spring Boot Angular BFF

```bash
cd spring-bff
./gradlew bootRun
```

### Angular FE

I use pnpm instead of npm on this one:

```bash
cd angular_app
pnpm start
```
