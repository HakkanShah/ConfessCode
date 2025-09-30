# **App Name**: ConfessCode

## Core Features:

- Anonymous User Authentication: User registration/authentication via one-time activation key and anonHash generation based on IP and User-Agent. Implementation of localStorage persistence for the anonHash. The application prevents duplicate registrations from the same IP address.
- Anonymous Confession Posting: Allow users to post text-only confessions anonymously. Confessions are associated with the user's anonHash, IP address, and User-Agent.
- Post Interaction: Enable users to react to confessions. Includes an optional comment section that maintains anonymity using anonHash.
- Automated Content Moderation: Implement an automated content filtering tool system using regular expressions to block phone numbers, emails, and addresses, and an AI-based toxicity detection tool to auto-flag harmful content for moderator review. The rate limit tool restricts posting to once per 10 minutes per anonHash.
- Moderator Dashboard: Admin panel to review flagged/reported posts, delete inappropriate posts, and ban specific anonHash values. Includes CSV/JSON export of logs, which are auto-purged after 90 days.

