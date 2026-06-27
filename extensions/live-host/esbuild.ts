import esbuild, { type Plugin } from "esbuild"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import path from "path"

const production = process.argv.includes("--production")
const watch = process.argv.includes("--watch")

const __filename = (url: string) => fileURLToPath(url)
const __dirname = (url: string) => dirname(__filename(url))

const esbuildProblemMatcherPlugin: Plugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started")
    })
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`🔴 [ERROR] ${text}`)
        console.error(`    ${location?.file}:${location?.line}:${location?.column}:`)
      })
      console.log("[watch] build finished")
    })
  },
}

async function main() {
  const ctx = await esbuild.context({
    alias: {
      "@": path.join(__dirname(import.meta.url), "src"),
    },
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "silent",
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  })
  if (watch) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
