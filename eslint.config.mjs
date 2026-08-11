import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
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
            "**/*.js",
            "**/*.jsx"
        ],
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
