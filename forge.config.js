module.exports = {
  makers: [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "neurosis"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "html": "./src/index.html",
              "js": "./src/renderer.ts",
              "name": "main_window",
              "preload": {
                "js": "./src/preload.ts"
              }
            }
          ]
        }
      }
    ]
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      platforms: ["win32"],
      config: {
        repository: {
          owner: "ts5h",
          name: "neurosis"
        }
      }
    }
  ]
}