import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'docs/**', 'coverage/**']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        "rules": {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }]
        }
    },
    {
        // The ported test suite preserves the original (pre-modernization)
        // assertions verbatim, which rely on a few legacy patterns.
        "files": ["test/**/*.ts"],
        "rules": {
            "prefer-rest-params": "off",
            "no-useless-escape": "off",
            "no-empty": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrors": "none"
            }]
        }
    }
);
