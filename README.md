# Hash Form Demo
This app demonstrates how to implement a hash check to improve feedback when multiple users are editing the same record.

## Running Locally
*Requirements*
Docker Desktop

1. Clone this repo locally.
2. From a terminal in the root of this project, run `docker compose up`

## Try the Demo
Load the app: http://localhost:5173/

To simulate the experience multiple users, follow these steps:
1. Load the above URL into two different browser windows
2. Change one or more values in a single section and click save.
3. In the other browser window, try to change a value and click save.

![App Screenshot](demo/screenshot.png)

### Tech Stack
**App**
- React / Vite
- React Hook Form
- Tanstack Query
**API**
- Fastify
- Knex
- Postgres
