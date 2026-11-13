# SpendWise — Personal Finance Tracker

SpendWise is a responsive, browser-based personal finance dashboard for tracking income, expenses and monthly spending goals. It is built with plain HTML, CSS and JavaScript, so it can be hosted as a static website without a build step.

## Project Description

The dashboard gives users a quick view of their total balance, income, expenses and monthly budget. Users can add and delete transactions, categorize spending, view an income-versus-expenses chart and monitor budget progress. Transaction data is stored in the browser using localStorage.

> **Demo note:** This is a front-end learning project. Data stays in the current browser on the current device; there is no account system, cloud database or cross-device synchronization. The displayed data is personal demo data entered by the user.

## Technologies Used

- HTML5 — semantic page structure and forms
- CSS3 — responsive layout and styling
- JavaScript (ES6) — transaction, budget and dashboard logic
- Chart.js 4 — spending overview chart (loaded from CDN)
- Browser localStorage — persistent local demo data
- Git and GitHub — version control and source hosting
- Netlify — static website hosting and continuous deployment

## GitHub Repository Information

- **Repository:** [45Keach/Deploy-and-Publish-SpendWise-Using-GitHub-Netlify-](https://github.com/45Keach/Deploy-and-Publish-SpendWise-Using-GitHub-Netlify-)
- **Default branch:** `main`
- **Visibility:** Public

## Live Netlify Website URL

**Deployment required:** The Netlify site has not yet been created or connected to this repository, so a live URL cannot be truthfully listed yet.

After completing the Netlify steps below, replace this line with the actual published URL, for example:

`https://YOUR-CHOSEN-SITE-NAME.netlify.app`

Suggested site name: **spendwise-45keach** (subject to availability in Netlify).

## Run Locally

No package installation or build command is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/45Keach/Deploy-and-Publish-SpendWise-Using-GitHub-Netlify-.git
   cd Deploy-and-Publish-SpendWise-Using-GitHub-Netlify-
   ```
2. Open `index.html` in a modern browser, or run a local static server:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000`.

## Deployment Process Summary

1. Organized the application into `index.html`, `styles.css` and `app.js`, with a root-level `netlify.toml`.
2. Published the project to the public GitHub repository above.
3. Sign in to [Netlify](https://app.netlify.com/) and choose **Add new project → Import an existing project**.
4. Select **GitHub**, authorize Netlify if prompted, and choose this repository.
5. Use the following build settings:
   - **Branch:** `main`
   - **Build command:** leave blank
   - **Publish directory:** `.` (repository root)
6. Deploy the site. In **Site configuration → General → Site details → Change site name**, choose `spendwise-45keach` if it is available.
7. Copy the actual `.netlify.app` URL into the Live Netlify Website URL section above and commit the README update.
8. For the continuous deployment test, make a visible change to the page, commit and push it to `main`. Confirm a new deploy appears in Netlify's **Deploys** tab and that the change is visible on the live site.

Because the Netlify account authorization and site creation must be completed by the account owner, these steps are provided for the remaining external setup.

## Testing Checklist

After deployment, verify the following in the live site:

- [ ] Dashboard loads without missing files or browser console errors.
- [ ] Income and expense transactions can be added.
- [ ] Totals, balance, category breakdown and chart update after adding a transaction.
- [ ] Transactions can be deleted.
- [ ] Monthly budget can be changed and progress updates.
- [ ] Refreshing the page preserves transactions in the same browser.
- [ ] Layout works on desktop and mobile screen sizes.
- [ ] CSS, JavaScript, fonts and Chart.js load successfully.
- [ ] A GitHub commit triggers an automatic Netlify deployment and the visible update appears on the live site.

## Challenges Encountered During Deployment

- A static site needs the correct publish directory. This project uses the repository root (`.`) because `index.html` is at the top level.
- External CDN assets depend on an internet connection. The dashboard's core transaction features continue to work if the chart library is unavailable.
- Browser localStorage is specific to a browser and device, so it is not a substitute for a secure shared database.
- Netlify account authorization, site naming and the final live URL require access to the owner's Netlify account; those steps remain pending until the repository is imported there.

## Lessons Learned

- Keeping static project files organized makes deployment simpler.
- GitHub provides a reliable source of truth for the application.
- Netlify can automatically publish changes when it is connected to a GitHub branch.
- The publish directory and build settings must match the project's structure.
- Testing the deployed website is important because a successful upload alone does not prove that every asset and interaction works.
- Client-side storage is useful for a learning project, but production finance applications need secure authentication, server-side storage, validation and privacy protections.

## Continuous Deployment Update

After the first Netlify deployment, make a small visible edit (for example, change the footer tagline in `index.html`), commit it to `main`, and verify the new deploy in Netlify. Record the actual result here before submitting the assignment.
