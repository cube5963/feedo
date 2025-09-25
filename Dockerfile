FROM node:22.17

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .github/workflows .

RUN npm run build

ENV NEXT_PUBLIC_SUPABASE_URL = "https://your-supabase-url.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key"
ENV NEXT_PUBLIC_AI_API_URL = "https://your-ai-api-url.com"
ENV NEXT_PUBLIC_REDIRECT_URL = "http://localhost:3000/project"

EXPOSE 3000

CMD ["npm", "start"]