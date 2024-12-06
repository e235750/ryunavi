FROM node:20-bullseye

WORKDIR /next-project/ryunavi

# 必要な依存関係をインストール
RUN apt update \
    && apt upgrade -y \
    && apt install -y \
        fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
        libxss1 libgtk2.0-0 libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2 \
        chromium \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer 用環境変数の設定（システム全体で有効化）
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_CONFIG='["--no-sandbox", "--disable-setuid-sandbox"]'

# package.json をコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .
