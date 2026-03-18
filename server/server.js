import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// 🔍 DEBUG: pastikan request benar-benar masuk
// app.use((req, res, next) => {
//   console.log("REQ MASUK:", req.method, req.url);
//   next();
// });

// 🔌 CONNECT DATABASE
await connectDB();

// 🧱 MIDDLEWARE
app.use(cors()); // sementara open (development)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧪 TEST ROUTE (WAJIB ADA UNTUK DEBUG)
app.get("/test", (req, res) => {
  console.log("HIT TEST ROUTE");
  res.send("SERVER OK");
});

// 🌐 ROUTES
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ❌ GLOBAL ERROR HANDLER (paling bawah)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

export default app;
