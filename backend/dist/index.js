import express from "express";
const app = express();
app.use(express.json());
app.post("/home", (req, res) => {
    res.json({
        message: "Hello, your email is "
    });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map