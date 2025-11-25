# Earth Doom

Welcome to the **Earth Doom** website project! This site is built using [Astro](https://astro.build/) and serves as a platform for the Earth Doom blog and manual.

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Content:** [MDX](https://mdxjs.com/) for blog posts
- **Deployment:** Static Site Generation (SSG)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.14.1 or higher)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/earthdoom/blog.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Development

Start the local development server:

```sh
npm run dev
```

The site will be available at `http://localhost:4321/`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📂 Project Structure

```text
/
├── public/           # Static assets (fonts, images, etc.)
├── src/
│   ├── components/   # Reusable UI components
│   ├── content/      # Content collections (blog posts)
│   ├── layouts/      # Page layouts
│   ├── pages/        # File-based routing
│   └── styles/       # Global styles
├── astro.config.mjs  # Astro configuration
└── package.json      # Project dependencies and scripts
```

## 📝 License

Distributed under the MIT License.