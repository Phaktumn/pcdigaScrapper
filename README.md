## About the project

This is a web scraper to watch and registe the price oscillation in the Pc Diga website. I made this project to know when to buy the products I was interested in.

*When the scraper is called the data is saved on the database*
## Built With

* [NestJs](https://nestjs.com/)
* [Puppeteer](https://pptr.dev/)
* [MongoDb](https://www.mongodb.com/)
* [GraphQl](https://graphql.org/)
* [ApolloGraphQl](https://www.apollographql.com/)
* [SendGrid](https://sendgrid.com/)
* [Docker](https://www.docker.com/)

<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

Install npm
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_These are the steps to install and use the scraper_

1. Get a free API Key at [SendGrid](https://sendgrid.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/flav1o/scraper-pcdiga.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API Key in `.env`
   ```env
   SEND_GRID_API_KEY=ENTER YOUR API
   ```
5. Run docker compose
    ```sh
    docker-compose up
    ```
6. Run the application
    ```sh
    npm run start:dev
    ```

## License
