# **App Name**: ConfessCode

## Core Features:

- Anonymous User Authentication: User registration/authentication via one-time activation key and anonHash generation based on IP and User-Agent. Implementation of localStorage persistence for the anonHash. The application prevents duplicate registrations from the same IP address.
- Anonymous Confession Posting: Allow users to post text-only confessions anonymously. Confessions are associated with the user's anonHash, IP address, and User-Agent.
- Post Interaction: Enable users to react to confessions. Includes an optional comment section that maintains anonymity using anonHash.
- Automated Content Moderation: Implement an automated content filtering tool system using regular expressions to block phone numbers, emails, and addresses, and an AI-based toxicity detection tool to auto-flag harmful content for moderator review. The rate limit tool restricts posting to once per 10 minutes per anonHash.
- Moderator Dashboard: Admin panel to review flagged/reported posts, delete inappropriate posts, and ban specific anonHash values. Includes CSV/JSON export of logs, which are auto-purged after 90 days.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to create a sense of seriousness.
- Background color: Light Gray (#D3D3D3) to maximize readability and create a subdued backdrop.
- Accent color: Soft Lavender (#E6E6FA) to highlight interactive elements such as reactions and reports.
- Body and headline font: 'Inter' sans-serif, which provides a modern and objective feel for readability and a consistent, professional appearance.
- Code font: 'Source Code Pro' to emulate the terminal / code-snippet aesthetic in this coder-friendly UI.
- Monochrome icons to maintain a minimalistic design; icons representing reactions, reports, and moderation actions.
- Grid-based layout for clear content presentation. Use distinct containers/cards for each confession, with spacing that creates visual separation.