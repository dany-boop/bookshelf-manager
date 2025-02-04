This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


if you want to use supabase use this .env file 

DATABASE_URL="postgresql://postgres.gyzskfbyqbzfopfxejnh:bycpDApaJ2ykYHhg@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="OxsyzWimgiYHFyugzfsZlvduusyw0kHdjinqSMkuV2SNnPEv2zxCRRod6KSUCvn+5n0fwUDQEaFZHTcYXf6UvA=="
JWT_EXPIRES_IN="1h"

and also change the prisma schema datasource to 
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

and then run command 

>npx prisma migrate dev --name
and run npx prisma generate

if you want to use the sqlite use this .env file 
 DATABASE_URL="file:./bookshelf.db"
 JWT_SECRET="3afb0658974a6d4051a3166963544729c790b097c960996f202683a685bad071436de276d6c53afff0583f6db443382247836d90111e416a681354fa366650d1"
 JWT_EXPIRES_IN="1h"

and also change the prisma schema datasoure to

 datasource db {
   provider = "sqlite"
   url      = env("DATABASE_URL")
 }

 >npx prisma migrate dev --name
and run npx prisma generate