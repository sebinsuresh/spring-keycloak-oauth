## About

Experimenting with Spring Security + Keycloak + OIDC/OAuth 2.0 + Angular

## Setup

### Create

Run Keycloak server, nginx, and postgres (port 80 needs to be free for the first 2):

```bash
docker compose up
```

This should import Keycloak realm, client, user, etc. data from version controlled file stored in this repo.

These were the steps taken to create that data - for future reference:
- Login using `admin` `admin` at http://localhost/auth
- Create realm `spring-resource-users`
- Make sure that's the active realm
- Create client `spring-angular-bff` with
    - Client authentication enabled. Standard flow.
    - `http://localhost/` as home URL
    - `http://localhost/api/login/oauth2/code/keycloak` as valid redirect URI
    - `http://localhost/api/*` and `http://localhost/*` as valid post logout redirect URI
    - `http://localhost` and `http://localhost/*` as web origins
    - **Client secret** will be generated.
        - This will be a different value every time you re-create the client (i.e. you used `docker compose down -v` when bringing down services).
        - Make sure the current client secret is used to populate value in `application.yml`
- Create user `testuser` `123456` `testuser@example.com`
- Create user `testadmin` `123456` `testadmin@example.com`
- Auth setup
    - Create roles `admin` and `regular_user`
    - Create groups `admin` and `user`
        - Add both roles to `admin` group, only `regular_user` role to `user` group
    - Add `testuser` to `user` group, `testadmin` to `admin` group
    - To ensure `realm_access.roles` is present in the JWT returned to Spring BFF:
        - Go to Keycloak admin UI -> `spring-resource-users` realm
        - Go to `Client Scopes -> roles -> Mappers -> Realm Roles -> Enable Add to UserInfo -> Save`
        - This is required for role-based authentication rules in Spring security to work correctly.
            The reason is that Keycloak sends these roles with the JWT access & ID tokens but not with
            the UserInfo endpoint, which Spring Security uses to get the authorities.

### Starting up Angular and Spring Services

Run Angular using host 0.0.0.0 so that nginx in docker can reach it:
```bash
cd angular_app
pnpm start --host=0.0.0.0
```

Run Spring Boot BFF service:
```bash
cd spring_bff
./gradlew start
```

Run Spring Boot resource sevice:
```bash
cd spring_resource
./gradlew bootRun
```

### Destroy

Bring down docker compose services:

```bash
docker compose down
```

Add the `-v` param if you want to remove the volume as well - this will destroy the realm & data you've created in Keycloak and Postgres.

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
