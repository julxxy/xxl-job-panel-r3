# XXL-JOB-PANEL-R3

> A third-party React-based web admin panel for XXL-JOB — delivering the best experience you’ve ever had.

---

## Screenshots

### 📱 Mobile Preview

| ![Mobile 1](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619222705924_20250619222706.png) | ![Mobile 2](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223126757_20250619223126.png) | ![Mobile 3](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223227140_20250619223227.png) |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |

<div style="display: flex; gap: 5px;">
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619222705924_20250619222706.png" alt="image-20250619222705924" style="zoom:50%;"/>
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223126757_20250619223126.png" alt="image-20250619223126757" style="zoom:50%;"/>
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223227140_20250619223227.png" alt="image-20250619223227140" style="zoom:50%;"/>
</div>

<div style="display: flex; gap: 5px; flex-wrap: wrap;">
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223501043_20250619223501.png" alt="image-20250619223501043" style="zoom:50%;" />
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223807392_20250619223807.png" alt="image-20250619223807392" style="zoom:50%;" />
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619223937925_20250619223938.png" alt="image-20250619223937925" style="zoom:50%;" />
</div>

<div style="display: flex; gap: 5px; flex-wrap: wrap;">
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/iShot%20Pro%202025-06-19%2022.44.07_20250619224523.png" alt="iShot Pro 2025-06-19 22.44.07" style="zoom:50%;" />
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/iShot%20Pro%202025-06-19%2022.44.42_20250619224534.png" alt="iShot Pro 2025-06-19 22.44.42" style="zoom:50%;" />
<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/iShot%20Pro%202025-06-19%2022.45.05_20250619224546.png" alt="iShot Pro 2025-06-19 22.45.05" style="zoom:50%;" />
</div>

### 💻 Desktop Preview

![image-20250619220802169](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619220802169_20250619220803.png)

![image-20250619220914127](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619220914127_20250619220914.png)

![image-20250619221728812](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221728812_20250619221728.png)

![image-20250619221345225](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221345225_20250619221345.png)

![image-20250619221007810](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221007810_20250619221007.png)

![image-20250619221112753](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221112753_20250619221112.png)

![image-20250619221148168](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221148168_20250619221148.png)

<img src="https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619221941926_20250619221942.png" alt="image-20250619221941926" style="zoom:50%;" />

![image-20250619222411265](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619222411265_20250619222411.png)

![image-20250619222451538](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/image-20250619222451538_20250619222451.png)

---

### 1. Prerequisites

- **Node.js:** v18 or newer is recommended
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
|-------------------|---------------------------------|
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
