# Sayan Tech Services — repaired project

This copy was rebuilt from the uploaded project source.

## Fixed
- Restored the real homepage at `src/app/page.tsx`.
- Kept the client dashboard at `src/app/dashboard/page.tsx`.
- Fixed `admin/oreders` to `admin/orders`.
- Fixed admin order API routing.
- Restored admin support API/page/client routing.
- Restored functional dashboard support page.
- Added dashboard notifications page/client.
- Restored atomic order + pending transaction + notification creation.
- Fixed logout to redirect to `/login`.
- Authentication now checks the current user/role in PostgreSQL.
- Removed obsolete duplicate routes.
- Fixed login query-param handling.
- TypeScript and ESLint checks pass.

## Local setup

Keep your existing local `.env` file in the project root. It is intentionally not included in this ZIP.

Then run:

```powershell
cd C:\Users\KIIT\Desktop\sayan-tech-services
npm install
npx prisma generate
npx tsc --noEmit
npm run lint
npm run dev
```

The source was checked with TypeScript and ESLint successfully.

A production build could not be completed in the repair environment because Next.js attempted to download its platform SWC package and external npm access was unavailable. This is an environment/network limitation.
