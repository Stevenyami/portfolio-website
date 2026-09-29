# Steve Nyami — Medical AI portfolio

A personal portfolio for Steve Nyami, a Computer Science Master's student at TU Darmstadt with experience in Medical AI. Built with vanilla JavaScript and Vite, with a navy, teal, and soft-white visual theme.

The site introduces Steve's background and focus, shows an illustrative AI workflow, and provides space for future project case studies. Project details and contact links will be added when they are available.

## Develop locally

Install Node.js 22.12 or newer, then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build locally:

```sh
npm run build
npm run preview
```

## Customize

- Edit `index.html` for the introduction, project details, about text, contact links, and page metadata.
- Replace the project placeholder when Steve's project information is available. For each project, include the problem, Steve's role, methods, a real preview, and any repository, demo, or paper links. Add evaluation results only with their dataset and setup.
- Replace the contact notice with a real email link and verified professional profiles. Add a CV link only when a document is available. There is no contact form or backend.
- Edit `src/main.js` for the mobile navigation and footer year. Essential content and navigation remain available without JavaScript.
- Edit the color variables, typography, spacing, and components in `src/style.css` for the visual design.
- Put static assets such as the favicon in `public/`.

See [the medical AI design plan](docs/medical-ai-design-plan.md) for the visual system, accessibility goals, and case-study structure.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import this GitHub repository.
3. Vercel should detect **Vite** automatically. If you enter the settings manually, use the repository root, `npm run build` as the build command, and `dist` as the output directory.
4. Deploy. Future pushes to the connected production branch will trigger new deployments.

No Next.js conversion or `vercel.json` file is needed for this static portfolio. Vercel's [Vite deployment guide](https://vercel.com/docs/frameworks/frontend/vite) covers the supported setup.
