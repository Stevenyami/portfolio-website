# Medical AI portfolio — design plan

## Direction

Make Steve Nyami's portfolio feel calm, precise, and approachable. Use medical AI workflows, clear technical explanations, and thoughtful human review as the organizing ideas.

Working audience: healthcare AI employers and research teams, with a secondary path for collaborators. The visitor journey is **understand the focus → explore the work → understand Steve's contribution → get in touch**.

Confirmed background: **Steve Nyami is a Master's student at TU Darmstadt studying Computer Science and has experience in Medical AI.** The initial implementation uses these facts in the hero, biography, and page metadata. Project details will follow later; the project section clearly communicates that they are coming soon. Contact details remain a visible notice until real links are supplied.

This document guides the implemented homepage and future case studies. It records design intent; browser and accessibility verification must be checked against the running site.

## 1. Color system

Use mostly soft white and white surfaces. Let deep navy anchor the hero and footer, with restrained teal for the primary action. Use blue for secondary data series and reference links when needed.

| Token | Value | Use |
| --- | --- | --- |
| `--color-page` | `#F5F9FA` | Main page background |
| `--color-surface` | `#FFFFFF` | Project cards and expanded content |
| `--color-navy` | `#102B3A` | Hero, footer, high-emphasis sections |
| `--color-text` | `#16323D` | Headings and body text on light surfaces |
| `--color-text-muted` | `#526974` | Descriptions and metadata on light surfaces |
| `--color-on-navy` | `#F5F9FA` | Primary text on navy |
| `--color-on-navy-muted` | `#B6C8D0` | Secondary text on navy |
| `--color-primary` | `#087F83` | Primary button background with white text |
| `--color-primary-hover` | `#06676B` | Button hover and text on soft teal |
| `--color-teal-soft` | `#DCF3EF` | Topic chips and quiet highlights |
| `--color-teal-bright` | `#7DE0D2` | Small accents on navy; dark text when used as a fill |
| `--color-link` | `#2563A6` | Underlined inline links on light surfaces |
| `--color-border` | `#D5E3E8` | Decorative separators and card outlines |
| `--color-control-border` | `#6C8490` | Essential input boundaries |
| `--color-warning` | `#9A5A00` | Review-needed text on `#FFF3D6` |
| `--color-error` | `#B42318` | Error text on `#FEF3F2` |

Approximate surface balance: 65% light neutrals, 25% navy, 10% teal and supporting accents. This is a composition guide, not a rigid quota.

### Pairing rules

- Use white on the teal primary button; use dark teal `#06676B` for small text on soft teal. The lighter primary teal does not meet the normal-text contrast target on soft teal.
- Use bright teal only on navy or as a fill with navy text.
- Reserve amber and red for actual attention and error states. Pair every state color with a text label.
- Keep decorative borders separate from interactive control boundaries.
- Measured text contrast ratios: body/page **12.72:1**, muted/white **5.78:1**, white/teal button **4.80:1**, muted/navy **8.51:1**, warning/soft amber **4.96:1**. These validate the listed pairs, not the whole future site.

## 2. Typography, shape, and spacing

- Keep the existing **Manrope** headings and **DM Sans** body font. Use system sans-serif fallbacks and limit font weights to those actually used.
- Headings: 600–700 weight, about `-0.035em` tracking, natural wrapping.
- Hero title: fluid 40–72px; section titles: 30–44px; card titles: 22–28px.
- Body: 16–18px with about 1.6 line-height. Metadata: 13–14px. Keep essential labels at least 14px.
- Keep text blocks around 60–70 characters wide. Avoid forcing titles onto one line.
- Main content width: up to 1200px. Gutters: 20px on small screens, 32px on tablets, 48px on desktop.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Section padding: 80–96px on desktop and 48–64px on mobile.
- Corner radius: 10px controls, 16px cards. Use rounded pills only for short tags or statuses.
- Use thin outlines and soft shadows sparingly. Let spacing establish the hierarchy.

## 3. Homepage structure

| Section | Content and purpose | Layout and interaction |
| --- | --- | --- |
| Header | Steve Nyami wordmark; Focus, Experience, Projects, About; Contact action | White sticky header with a subtle separator. Mobile disclosure menu. |
| Hero | Medical AI focus, one clear headline, confirmed study background | Navy split layout. Text on the left, illustrative workflow on the right. Anchor actions lead to existing sections. |
| Focus areas | Computer Science, Medical AI, and the relationship between them | Quiet supporting labels or cards that stack or wrap on mobile. Avoid listing unconfirmed specializations. |
| Experience | Roles from Steve's LinkedIn profile, then education, recognition, certifications, and skills | White band with a dated list: dates and location beside the role on desktop, stacked on mobile. Topic tags are display-only. |
| Projects | A visible notice that project details are coming soon | A finished placeholder treatment without invented project titles, metrics, or inactive case-study links. Replace it with real work when supplied. |
| Approach | Principles for useful, assessable medical AI | Explain the context, methods, evaluation, and role of human review. Present these as guiding principles. |
| About | A personal introduction and verified background | Master's studies in Computer Science at TU Darmstadt and experience in Medical AI. CV link only when a real document exists. |
| Contact | Space for future professional contact information | A clear notice until a real email address or profile is supplied. Add active links when available. |
| Footer | Name, year, back-to-top link | Compact navy footer. |

### Hero content

The hero names Steve Nyami, introduces the intersection of AI and healthcare, and states his background directly: **a Computer Science Master's student at TU Darmstadt with experience in Medical AI**. Its actions are **Explore my focus** (`#focus`) and **A little about me** (`#about`).

Keep the introduction short. Specific techniques, research roles, organizations, and achievements can be added after Steve supplies them.

### Hero visual

The hero combines a static network illustration with the sequence **Data → Intelligence → Human insight**. Its caption identifies it as an illustrative view of connected intelligence. The diagram supports the theme without implying a specific model, dataset, or clinical result.

## 4. Project and case-study system

The initial homepage replaces the previous sample cards with a **Project details coming soon** notice. Steve will provide actual project information later. Keep this section informative and visually complete without suggesting that a case study, demo, or repository is already available.

Once projects are supplied, begin with the strongest example and add more as their content becomes ready. The number and layout of cards should follow the available material.

### Project card

Each future card has a consistent order: preview → project status → title → intended user and problem → Steve's contribution → case-study link when content exists. Limit topic tags to two or three. Use descriptive link text and avoid multiple overlapping click targets.

### Case-study page

1. **Summary:** the workflow, intended users, status, date, role, and collaborators.
2. **Problem:** what the user needed to understand or accomplish.
3. **Design and method:** interface decisions, relevant model or technical choices, and the data source where applicable.
4. **Evidence:** authentic screenshots, source links, and evaluation results with their context.
5. **Human review:** how a person inspects, corrects, or questions the output.
6. **Limitations and next steps:** known gaps and how they could be evaluated.
7. **Resources:** real repository, demo, paper, or project links; next project; contact.

If performance results exist, show the metric name, dataset, sample size, evaluation setup, and uncertainty when available. If results do not exist, omit the metric block. Concept previews use visibly labeled illustrative data. Claims about deployments, clinical impact, certifications, clients, and affiliations require real supporting material.

## 5. Reusable components and behavior

| Component | Specification |
| --- | --- |
| Primary button | Teal fill, white label, 48px minimum height, 10px radius. Darker hover, clear keyboard focus, brief pressed state. One primary action per section. |
| Secondary button / link | Navy text with a visible border or underline on light surfaces; light text on navy. Real navigation uses anchors. |
| Topic chip | Soft teal with dark teal text. Display-only unless it actually filters content. |
| Project card | White surface, subtle outline, 16px radius. Real preview or inspectable diagram. A small hover change; no essential hover-only content. |
| Status label | Plain labels such as Concept, In progress, or Published. Color supplements the text. Status describes the project, not an implied clinical approval. |
| Evidence block | Verified result, label, context, and source together. Never a large unqualified accuracy number. |
| Process step | Number, short verb phrase, one short description. Reading order remains clear without connecting lines. |
| Expandable content | Native details/summary for optional implementation notes. Keep the main story visible. Case studies get linkable pages when substantive content is available. |
| Data visualization | Labeled axes, units, source, and a readable text summary. Consistent color mapping with labels or line styles. Only include a chart when it communicates actual evidence. |
| Contact | Show a short availability notice until real details are supplied. Then use a real email link and optional professional profiles. The initial implementation has no form or backend. |

Use simple outline icons consistently for concepts such as documents, analysis, and collaboration. Keep action labels visible. Use real project images or clearly illustrative vector diagrams; imagery should help explain the work.

## 6. Responsive UX and accessibility

- Start from the mobile reading order: identity → focus → primary action → project evidence → approach → contact.
- Below approximately 768px, stack hero copy above its visual, use one-column project cards, and show the approach as an ordered vertical sequence. Between mobile and desktop, allow two-column project layouts where content fits.
- Keep the mobile menu button's accessible name and expanded state synchronized. Escape closes the menu and returns focus to its trigger when focus was inside the menu. Selecting an anchor closes the menu and moves the visitor to its destination.
- Preserve the existing skip link, semantic headings, and reduced-motion handling. Offset anchor destinations for the sticky header, and ensure focused content is not hidden behind it.
- Aim for WCAG 2.2 AA. Normal text needs at least 4.5:1 contrast, and qualifying large text at least 3:1. Design primary controls with at least 44 × 44 CSS-pixel targets; that target size is a deliberate choice above the AA minimum. See [W3C's WCAG 2.2 reference](https://www.w3.org/TR/WCAG22/).
- Give inputs and essential graphical boundaries sufficient contrast. Use a light outer focus ring on navy and a dark teal ring on light surfaces.
- Check keyboard-only use, meaningful image alternatives, 200% text zoom, and reflow at a 320 CSS-pixel viewport.
- Show essential information directly. Do not require hover, color perception, motion, or dragging to understand a project.
- Keep interaction transitions around 150–200ms. Respect reduced-motion preferences and avoid looping scans or pulses.
- Essential portfolio content and contact links should remain readable if JavaScript fails. Enhance the mobile menu progressively so navigation stays available.

## 7. Implementation scope and verification

The initial implementation covers:

1. **Foundation:** semantic palette variables and consistent spacing in `src/style.css`, readable typography, consistent actions, and visible focus states.
2. **Structure and content:** `index.html` with Steve's identity, medical AI hero, project notice, approach, biography, contact notice, and matching metadata.
3. **Visuals:** a clearly illustrative workflow in place of unrelated sample project artwork.
4. **Behavior:** minimal JavaScript in `src/main.js` for mobile navigation and the footer year. Navigation is available before JavaScript enhances the menu.

Remaining content work: add case studies and working contact links once Steve supplies the material. Keep navigation and resource URLs compatible with Vite.

Verification checklist: run the production build; inspect 320, 390, 768, 1024, and 1440px layouts; check contrast, keyboard navigation, zoom, reduced motion, all links, and page metadata. This list does not claim that those checks have passed.

The existing vanilla JavaScript and Vite setup can support this design. Keep the initial delivery as a focused portfolio with minimal JavaScript. Defer project filters until there are enough real projects to make them useful, and add a theme switch only if a second appearance will be maintained and checked.

## 8. Content needed for the finished site

- Any additional biography details Steve wants to share.
- Actual projects and their current status.
- Role, methods, images, links, and any supporting evaluation for each project.
- Real email address, professional links, and optional CV.
- Any publication or collaboration information that should be highlighted.

These inputs determine the final copy; the visual system and component work can proceed independently.
