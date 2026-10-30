# Billora landing page (draft)

A standalone, responsive one-page marketing site for a proposed GST billing SaaS. It does not modify the existing React/Vite billing application.

## Preview locally

Open `index.html` in a browser. Google Fonts are optional; system fallbacks are included.

## Deploy

For Vercel or Netlify, set the project/root directory to this folder (`billora-landing`) and deploy as a static site. No build command or framework is required.

## Before publishing

1. **Brand**: “Billora” is a working draft. Replace it with your chosen name across the title, footer and visible labels.
2. **Pricing**: Free / ₹499 / ₹999 / custom are proposed draft tiers. Change the prices and entitlements in the Pricing section. Yearly displayed rates are ₹399 and ₹799 per month, billed annually; they are illustrative.
3. **Backend**: CTA buttons currently navigate to pricing/sections. Add your real signup, login, checkout, support and contact routes.
4. **Feature verification**: Only list cloud sync, team seats, automatic reminders, account access, online backup, hosted multi-device access or integrations as available after these are implemented and tested. The existing upstream repo describes itself as offline-first and local-data-first. This marketing draft carefully avoids promising that the landing-page mockup itself is a live SaaS dashboard.
5. **Tax/compliance wording**: JSON export is not the same as direct filing. Confirm all GST calculations, GSTR exports, reconciliation, e-Way Bill/TDS/TCS workflows, API permissions and current rules before publishing compliance claims.
6. **Open-source obligations**: Review the upstream MIT licence, retain required copyright/licence notices in the software distribution, and review dependency licences. This page links to the upstream project for transparency.
7. Replace any support email or legal URLs only after you have real destinations. Add Terms, Privacy Policy and cancellation/refund terms before taking payments.

## Customize quickly

- Colors: CSS variables at the top of the `<style>` block.
- Brand: search for `Billora` and `billora`.
- Prices: `data-month` and `data-year` values on the Growth and Pro cards.
- Sections: Features, How it works, Pricing, FAQs and final CTA are all in this one file.
