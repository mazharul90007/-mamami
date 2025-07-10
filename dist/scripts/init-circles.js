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
Object.defineProperty(exports, "__esModule", { value: true });
const circles_service_1 = require("../app/modules/Circles/circles.service");
function initializeCircles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Initializing default circles...');
            yield circles_service_1.CirclesService.initializeDefaultCircles();
            console.log('Default circles initialized successfully!');
            process.exit(0);
        }
        catch (error) {
            console.error('Error initializing circles:', error);
            process.exit(1);
        }
    });
}
initializeCircles();
