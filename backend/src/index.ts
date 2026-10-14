import "reflect-metadata";
import "dotenv/config";
import app from "./server"
import http from "http"

http.createServer(app).listen(5001, "0.0.0.0", () => {
    console.log("HTTP API running on https://localhost:5001");
});
