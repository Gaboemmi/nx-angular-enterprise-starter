import js from "@eslint/js";
import angular from "angular-eslint";
import nx from "@nx/eslint-plugin";
import tseslint from "typescript-eslint";

const typescriptFiles = [
    "**/*.ts",
    "**/*.tsx",
    "**/*.cts",
    "**/*.mts"
];

const withFiles = (configs, files) => configs.map((config) => ({
    ...config,
    files
}));

export default [
    js.configs.recommended,
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    ...withFiles(tseslint.configs.strictTypeChecked, typescriptFiles),
    ...withFiles(tseslint.configs.stylisticTypeChecked, typescriptFiles),
    ...withFiles(angular.configs.tsRecommended, ["**/*.ts"]),
    ...withFiles(angular.configs.templateRecommended, ["**/*.html"]),
    ...withFiles(angular.configs.templateAccessibility, ["**/*.html"]),
    {
        files: typescriptFiles,
        rules: {
            // Angular's decorators give otherwise empty classes a runtime role.
            "@typescript-eslint/no-extraneous-class": "off"
        }
    },
    {
        ignores: [
            "**/dist",
            "**/out-tsc"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts"
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "scope:app",
                            onlyDependOnLibsWithTags: [
                                "scope:app",
                                "scope:domain",
                                "scope:platform",
                                "scope:shared"
                            ]
                        },
                        {
                            sourceTag: "type:app",
                            onlyDependOnLibsWithTags: [
                                "type:shell",
                                "type:platform",
                                "type:ui",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:shell",
                            onlyDependOnLibsWithTags: [
                                "type:feature",
                                "type:application",
                                "type:domain",
                                "type:platform",
                                "type:ui",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:feature",
                            onlyDependOnLibsWithTags: [
                                "type:application",
                                "type:domain",
                                "type:platform",
                                "type:ui",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:domain",
                            onlyDependOnLibsWithTags: [
                                "type:domain",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:application",
                            onlyDependOnLibsWithTags: [
                                "type:application",
                                "type:domain",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:infrastructure",
                            onlyDependOnLibsWithTags: [
                                "type:infrastructure",
                                "type:application",
                                "type:domain",
                                "type:platform",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:presentation",
                            onlyDependOnLibsWithTags: [
                                "type:presentation",
                                "type:application",
                                "type:ui",
                                "type:util"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
