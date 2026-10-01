# Steve Nyami — Medical AI portfolio

A personal portfolio for Steve Nyami, a Computer Science Master's student at TU Darmstadt with experience in Medical AI. Built with vanilla JavaScript and Vite, with a navy, teal, and soft-white visual theme.

The site introduces Steve's background, projects, work experience, and education, shows an illustrative computer-vision pipeline running on surgical video, and links to Steve's email and LinkedIn profile. The projects section is a placeholder until project details are available.

Experience, education, certifications, skills, and languages come from Steve's LinkedIn profile export (September 2026). The export does not include LinkedIn's Projects section.

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

- Edit `index.html` for the introduction, work experience, project details, about text, contact links, and page metadata.
- Each role in the Experience section is an `experience-item` with dates, location, role, organization, description, and up to three topic tags. Recognition, certifications, and skills sit in the `qualifications` groups below the roles.
- Each degree in the Education section is an `education-card` with its level, degree, and university.
- Replace the project placeholder when Steve's project information is available. For each project, include the problem, Steve's role, methods, a real preview, and any repository, demo, or paper links. Add evaluation results only with their dataset and setup.
- The Contact section links to Steve's email and LinkedIn profile. Add a CV link only when a document is available. There is no contact form or backend.
- Edit `src/main.js` for the mobile navigation and footer year, and `src/scan-figure.js` for the hero figure's animation loop and its timings. Essential content and navigation remain available without JavaScript.
- Edit the color variables, typography, spacing, and components in `src/style.css` for the visual design.
- Search metadata lives in the `<head>` of `index.html`: the title, description, canonical link, Open Graph tags, and a JSON-LD `Person` record that should match the page's content. The production URL `https://steve-nyami.vercel.app/` appears there and in `public/robots.txt` and `public/sitemap.xml`. Update all of them if the site moves to a custom domain.
- Put static assets such as the favicon in `public/`. Photos live in `public/images/`: `steve-nyami.jpg` is the original 800 × 800 portrait, and `steve-nyami-portrait.jpg` is the 480 × 480 head-and-shoulders crop shown on the About profile card.

See [the medical AI design plan](docs/medical-ai-design-plan.md) for the visual system, accessibility goals, and case-study structure.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import this GitHub repository.
3. Vercel should detect **Vite** automatically. If you enter the settings manually, use the repository root, `npm run build` as the build command, and `dist` as the output directory.
4. Deploy. Future pushes to the connected production branch will trigger new deployments.

No Next.js conversion or `vercel.json` file is needed for this static portfolio. Vercel's [Vite deployment guide](https://vercel.com/docs/frameworks/frontend/vite) covers the supported setup.
