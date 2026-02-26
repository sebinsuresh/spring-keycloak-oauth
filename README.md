## About

Experimenting with Spring Security + Keycloak + OIDC/OAuth 2.0 + Angular

## Setup

### Create

Run Keycloak server:

```bash
docker compose up
```

- Login using `admin` `admin` at http://localhost:8080
- Create realm `spring-resource-users`
- Make sure that's the active realm
- Create client `spring-angular-bff` with
    - `http://localhost:4200` as home URL
    - `http://localhost:8081/login/oauth2/code/keycloak` as valid redirect URI
    - `http://localhost:8081/*` as valid post logout redirect URI
    - `http://localhost:4200` as web origins
    - Client authentication enabled. Standard flow.
    - **Client secret** will be generated.
- Create user `testuser` `123456` `testuser@example.com`

### Destroy

Delete keycloak container and volumes (persistent storage):

```bash
docker compose down -v
```

## Run

### Spring Boot Angular BFF

```bash
cd spring-bff
./gradlew bootRun
```
