import { defineConfig, env } from 'prisma/config'

try {
  process.loadEnvFile()
} catch {
  // no .env file: rely on real environment variables (CI, production)
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed/index.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
