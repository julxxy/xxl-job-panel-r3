# XXL-JOB-PANEL-R3

> A third-party React-based web admin panel for XXL-JOB — delivering the best experience you’ve ever had.

---

## Screenshots

## 📱 Mobile Preview

|   ![Mobile 1](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/gif-2025-06-28%20at%2021.58.15_20250628215849.gif)    |       ![Mobile 2](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223126757_20250619223126.png)       |       ![Mobile 3](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223227140_20250619223227.png)       |
| :---------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
|       ![Mobile 4](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223501043_20250619223501.png)       |       ![Mobile 5](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223807392_20250619223807.png)       |       ![Mobile 6](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223937925_20250619223938.png)       |
| ![Mobile 7](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/iShot%20Pro%202025-06-19%2022.44.07_20250619224523.png) | ![Mobile 8](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/iShot%20Pro%202025-06-19%2022.44.42_20250619224534.png) | ![Mobile 9](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/iShot%20Pro%202025-06-19%2022.45.05_20250619224546.png) |

---

## 💻 Desktop Preview

| ![Desktop 1](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/gif-2025-06-28%20at%2021.25.20_20250628212733.gif) | ![Desktop 2](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619220914127_20250619220914.png)  |
| :------------------------------------------------------------------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------: |
| ![Desktop 3](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221728812_20250619221728.png)        | ![Desktop 4](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221345225_20250619221345.png)  |
| ![Desktop 5](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221007810_20250619221007.png)        | ![Desktop 6](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221112753_20250619221112.png)  |
| ![Desktop 7](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221148168_20250619221148.png)        | ![Desktop 8](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221941926_20250619221942.png)  |
| ![Desktop 9](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619222411265_20250619222411.png)        | ![Desktop 10](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619222451538_20250619222451.png) |

---

### 1. Prerequisites

- **Node.js:** v20 or newer is recommended
- **Package Manager:** npm (v9+) or yarn

### 2. Clone the Repository

```bash
git clone https://github.com/julxxy/xxl-job-panel-r3.git
cd xxl-job-panel-r3
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Development Server

Start the development server (default port: 80):

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost](http://localhost) in your browser.

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## Scripts

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start development server (Vite) |
| `npm run build`   | Build for production            |
| `npm run preview` | Preview the production build    |
| `npm run lint`    | Run ESLint for code quality     |
| `npm run format`  | Format code using Prettier      |

---

## Stack

- **Vite 6**
- **TypeScript**
- **React 19**
- **React Router v7**
- **Tailwind CSS 4**
- **Radix UI**
- **Ant Design 5**
- **Zustand** (state management)

---

## Version Mapping

This table helps you quickly identify which front-end and back-end versions are compatible. Whenever a major update
occurs on either side, please update this table accordingly for clarity.

|                     **xxl-job-panel-r3** (Front-end)                     |                     **xxl-job-r3** (Back-end)                      | Description                                 |
| :----------------------------------------------------------------------: | :----------------------------------------------------------------: | :------------------------------------------ |
| [v1.0.2](https://github.com/julxxy/xxl-job-panel-r3/releases/tag/v1.0.2) | [v3.1.2](https://github.com/julxxy/xxl-job-r3/releases/tag/v3.1.2) | LDAP login supported, menu permission fixes |

> **How to maintain:**
> Whenever the front-end or back-end receives significant updates, please record the new mapping here. Link each version
> to its corresponding release and summarize the key changes for future reference.

---

## Configuration

- Update API endpoints and environment variables in `.env` files as needed.
- **For production deployments, it is strongly recommended to set `VITE_IS_DEBUG_ENABLE` to `false` in
  your `.env.production` file to avoid exposing debug information in the production environment.**
- Make sure the [XXL-JOB back-end service](https://github.com/julxxy/xxl-job-r3) is running and accessible[1][2][3].

**Example:**

```env
# .env.production
VITE_IS_DEBUG_ENABLE=false
```

This ensures that debug features are disabled in production builds, improving security and performance[2][3].

---

## License

GNU

---

For more details, see the [official documentation](https://github.com/julxxy/xxl-job-panel-r3) and the sample
screenshots above.
