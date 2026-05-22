import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 静态资源
app.use(express.static(path.join(__dirname, "dist")));

// ✅ 把 * 改成 /，解决报错！
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/zhang/index.html"));
});

// 处理所有前端路由
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist/zhang/index.html"));
});

// 启动服务
app.listen(3010, "0.0.0.0", () => {
  console.log("✅ 服务启动成功：3010端口");
});
