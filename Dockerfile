# Dockerfile (สำหรับ frontend)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json และ package-lock.json (ถ้ามี) ก่อน
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code ที่เหลือทั้งหมด
COPY . .

# Build the Next.js app
RUN npm run build

# บอกว่าเราจะรันที่ port 3000
EXPOSE 3000

# รัน Next.js production server
CMD ["npm", "start"]
