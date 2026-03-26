declare const _default: (() => {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
    bcryptSaltRounds: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
    bcryptSaltRounds: string;
}>;
export default _default;
