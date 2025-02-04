# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Set environment variable for production (Vercel will override these with its own)
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:bookshelfDrew2424@@db.gyzskfbyqbzfopfxejnh.supabase.co:5432/postgres"

# Generate Prisma client using production schema
RUN npx prisma generate --schema=./prisma/schema.prod.prisma
# Install Prisma
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
