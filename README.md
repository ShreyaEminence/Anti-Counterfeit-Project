# QRCode Frontend

A Next.js frontend application with Google OAuth integration placeholder.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Modern login/signup page
- Google OAuth button placeholder (ready for integration)
- Email/password form
- Responsive design with Tailwind CSS
- Dark mode support

## Next Steps

To add Google OAuth:

1. Install Google OAuth library (e.g., `next-auth` or `@react-oauth/google`)
2. Set up Google OAuth credentials in Google Cloud Console
3. Add environment variables for OAuth client ID
4. Implement the `handleGoogleSignIn` function in `app/page.tsx`

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Login/signup page
│   └── globals.css     # Global styles
├── components/         # React components (to be added)
├── public/            # Static assets
└── package.json       # Dependencies
```

