import * as Joi from "joi";

export const envValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    APP_NAME: Joi.string().default("Daily Planner API"),
    NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
    API_PREFIX: Joi.string().default("api"),
    JWT_ACCESS_SECRET: Joi.string().min(16).default("access-secret-key-123"),
    JWT_REFRESH_SECRET: Joi.string().min(16).default("refresh-secret-key-123"),
    JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d")
});
