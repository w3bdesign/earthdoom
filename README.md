![version](https://img.shields.io/badge/version-0.1.8-blue)
![React](https://img.shields.io/badge/React-18.2.0-success)
![Next.js](https://img.shields.io/badge/Next.js-13.3.0-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-success)

# This game is under active development. 
# New features are added regularly.

## Earthdoom

Monorepo for Earthdoom.com

<img src="https://user-images.githubusercontent.com/45217974/232975051-79875585-ba7b-4742-a328-0556d9eca77e.png" alt="Screenshot" />

Earthdoom is a web-based game built using Next.js, React, TypeScript, and Prisma. The application is designed to be fast and responsive with an intuitive user interface.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the required dependencies, simply run the following command in the project's root directory:

```bash
npm install
```

You now need to retrieve the API keys for Clerk and Planetscale and enter them into .env (you can rename  env.example)

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

## Dependencies

This project uses the following key dependencies:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [react-query](https://react-query.tanstack.com/)
- [tRPC](https://trpc.io/)
- [Zod](https://github.com/colinhacks/zod)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [react-hot-toast](https://react-hot-toast.com/)

## Contributing

If you'd like to contribute to the development of Earthdoom Game, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them with clear and concise commit messages.
4. Push your changes to your forked repository.
5. Open a pull request with a description of the changes you've made.

## License

This project is licensed under the [MIT License](LICENSE).
