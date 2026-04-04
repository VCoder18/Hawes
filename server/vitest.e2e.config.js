"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '.env.test') });
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        include: ['**/*.e2e-spec.ts'],
        globals: true,
        environment: 'node',
        testTimeout: 30_000,
        hookTimeout: 30_000,
        pool: 'forks',
    },
});
//# sourceMappingURL=vitest.e2e.config.js.map