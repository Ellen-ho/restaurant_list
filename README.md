# Restaurant List

## 功能描述 (features)

- 列出餐廳清單
- 可針對餐廳名稱進行搜尋
- 點選餐廳會列出餐廳詳細資料，包括名稱、電話、地址、圖片、類別與 Google 地圖

## 安裝與執行步驟 (installation and execution)

- 下載專案到本地端

  ```
  git clone https://github.com/Ellen-ho/restaurant_list
  ```

- 打開終端機進入到下載的資料夾

  ```
  cd restaurant_list
  ```

- 執行指令安裝所需套件

  ```
  npm install
  ```

- 安裝完成後，執行 nodemon 啟動專案

  ```
  npm run dev
  ```

  或想直接使用 node 指定啟動專案，可以執行以下指令

  ```
  npm start
  ```

- 看到終端機顯示 "Express is listening on localhost:3000"，即可開啟瀏覽器在網址列輸入 localhost:3000 進入網站

## 環境建置與需求 (prerequisites)

- Node.js: v10.15.0
- express: v4.17.1
- express-handlebars: v5.2.0
- bootstrap: v4.2.1
- font-awesome: v5.8.1
- jQuery: v3.3.1