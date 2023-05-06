![version](https://img.shields.io/badge/version-0.2.4-blue)
![React](https://img.shields.io/badge/React-18.2.0-success)
![Next.js](https://img.shields.io/badge/Next.js-13.4.0-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-success)

## This game is under active development and may have bugs. 


* * *

## Earthdoom

<img src="https://user-images.githubusercontent.com/45217974/232975051-79875585-ba7b-4742-a328-0556d9eca77e.png" alt="Screenshot" />

Earthdoom is a full-stack web-based strategy game built using Typescript, Next.js, React, tRPC, Tailwind, Prisma and more. 

The database is handled through mySQL and Planetscale. 

Authentication is handled through Clerk.

The application is designed with a modern, responsive and intuitive user interface.

## Technologies used

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [React Hot Toast](https://react-hot-toast.com)
- [React Chart.js](https://react-chartjs-2.js.org)
- [Clerk](https://clerk.com)
- [Tailwind Elements](https://tailwind-elements.com)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the required dependencies, simply run the following command in the project's root directory (/game):

```bash
npm install
```

You now need to retrieve the API keys for Clerk and Planetscale and enter them into .env (you need to rename .env.example to .env)

## Usage

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Scripts

This project includes the following npm scripts for development and building:

- `build`: Builds the application for production.
- `dev`: Starts the development server.
- `postinstall`: Generates Prisma client after installing dependencies.
- `lint`: Lints the codebase using ESLint.
- `start`: Starts the production server.
- `prisma:generate`: Generates the Prisma client.
- `format`: Formats the codebase using Prettier.
- `refresh`: Removes node_modules, package-lock.json, installs dependencies, and formats the codebase.

## Contributing

If you'd like to contribute to the development of Earthdoom Game, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them with clear and concise commit messages.
4. Push your changes to your forked repository.
5. Open a pull request with a description of the changes you've made.

## License

This project is licensed under the [MIT License](LICENSE).
