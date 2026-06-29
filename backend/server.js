import express from "express";
import session from "express-session";
import callbackRouter from "./auth/callback.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);

app.use("/auth", callbackRouter);

app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
