"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const webSocket_1 = require("./app/utils/webSocket");
let server;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        server = app_1.default.listen(config_1.default.port || 5000, () => {
            console.log(`🚀 App is listening on port: ${config_1.default.port || 5000}`);
        });
        // ✅ Connect WebSocket
        (0, webSocket_1.connectWebSocketServer)(server);
    }
    catch (err) {
        console.log("❌ Error starting server:", err);
        process.exit(1);
    }
});
main();
// Graceful shutdown handling
const shutdown = () => {
    console.log("🛑 Shutting down servers...");
    if (server) {
        server.close(() => {
            console.log("✅ Servers closed");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};
process.on("unhandledRejection", (error) => {
    console.log(`❌ unhandledRejection is detected, shutting down...`);
    console.error(error);
    shutdown();
});
process.on("uncaughtException", (error) => {
    console.log(`❌ uncaughtException is detected, shutting down...`);
    console.error(error);
    shutdown();
});
process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received");
    shutdown();
});
process.on("SIGINT", () => {
    console.log("🛑 SIGINT received");
    shutdown();
});
