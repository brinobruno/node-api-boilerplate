FROM node:20

# Set the working directory
WORKDIR /app

COPY package*.json ./

RUN npm i -g yarn --force && yarn cache clean && yarn install

RUN yarn global add tsx pnpm

# Copy the rest of the application
COPY . .

# Default command
CMD ["yarn", "dev"]
