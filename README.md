# REInvestorGuide Form Mockup

Static high-conversion form mockup for real estate investor financing leads.

Open `index.html` directly in a browser. No build step or package install is required.

## Research Applied

- Starts with the investor's deal, not loan-product jargon.
- Asks Realtor questions only for purchase deals.
- Uses one concise question per screen to reduce perceived effort.
- Groups progress into Deal, Property, Numbers, and You.
- Saves contact capture until after a potential lender match is generated.
- Shows a short matching screen before contact capture.
- Uses a gated best-match lender preview without showing fake rates, approvals, or guaranteed terms.
- Pulls lender rules from the Google Sheet through the Google Visualization feed when public.
- Pulls affiliate recommendations from the `Affiliates` tab and shows up to three on the thank-you page.
- Falls back to the current embedded lender table during local/private-sheet testing.
- Rotates the highest-scoring qualified lenders with round robin and breaks fresh ties toward the more specific lender.
- Can hand assignment to a deployed Apps Script by setting `MATCHING_API_URL` in `app.js`.
- Keeps reassurance close to sensitive fields: no SSN, credit-safe, estimates accepted.
- Includes analytics stubs through `window.dataLayer` and console events.

## Event Hooks

- `form_start`
- `form_step_view`
- `form_step_complete`
- `match_loading_view`
- `lender_match_selected`
- `lender_match_unlock_view`
- `contact_step_view`
- `form_submit`
- `lead_submission_success`

## Lender Sheet

Source sheet:
`https://docs.google.com/spreadsheets/d/1yZ2-YDj9DkzV58KFbCFTlXUZ_FfXbQS176eLg7veOKw/edit`

Expected `Lender` tab columns:
`Lender Name`, `Logo Link`, `Website`, `Phone Number`, `States`, `Loan Types`,
`Property Type`, `Usage`, `Loan Amounts`, `Credit Score`, `Benefit 1`,
`Benefit 2`, `Benefit 3`.

Expected `Affiliates` tab columns:
`Affiliate Name`, `When to show`, `CTA`, `Logo Link`, `Affiliate Link`,
`Benefit 1`, `Benefit 2`, `Benefit 3`.

For the static mockup to read the live sheet in-browser, the sheet must be
published or shared so the Google Visualization feed is accessible without
Google login.

Round robin in this static mockup is stored in browser `localStorage` until
`MATCHING_API_URL` is set. For live traffic across all users, use the Apps
Script in `apps-script/Code.gs` so the tally lives in the shared Google Sheet.
