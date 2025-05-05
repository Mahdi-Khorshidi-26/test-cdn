import chokidar from "chokidar";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import * as sass from "sass"; // Import Sass with types

// Paths
const projectRoot = path.resolve(__dirname, "..");
const sectionsPath = path.join(projectRoot, "sections");
const snippetsPath = path.join(projectRoot, "snippets");
const tsSourcePath = path.join(projectRoot, "src", "scripts"); // TypeScript source folder
const assetsPath = path.join(projectRoot, "assets"); // Destination folder for JS files
const stylesPath = path.join(projectRoot, "src", "styles"); // Styles folder
const mainScssPath = path.join(stylesPath, "main.scss"); // The main SCSS file to import everything
const applicationJsPath = path.join(projectRoot, "assets", "application.js"); // The main JS file to import everything
const applicationCssPath = path.join(assetsPath, "application.css"); // The output CSS file

// Watcher
const watcher = chokidar.watch(
  [sectionsPath, snippetsPath, tsSourcePath, stylesPath],
  {
    ignored: /(^|[/\\])icon-.*\.liquid$/, // Skip icon-*.liquid files
    persistent: true,
    ignoreInitial: true, // Don't trigger on files that already exist
  }
);

watcher.on("add", (filePath) => {
  if (filePath.endsWith(".liquid")) {
    console.log(`📦 New .liquid file detected: ${filePath}`);
    exec("npx ts-node scripts/generateScssFiles.ts", (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      if (err) console.error("❌ Error running SCSS generator:", err);
    });
  }

  if (filePath.endsWith(".ts")) {
    console.log(`📦 New TypeScript file detected: ${filePath}`);
    compileTsFile(filePath);
  }

  if (filePath.endsWith(".scss")) {
    console.log(`📦 New SCSS file detected: ${filePath}`);
    buildCss();
  }
});

watcher.on("change", (filePath) => {
  if (filePath.endsWith(".ts")) {
    console.log(`🔄 TypeScript file changed: ${filePath}`);
    compileTsFile(filePath);
  }

  if (filePath.endsWith(".scss")) {
    console.log(`🔄 SCSS file changed: ${filePath}`);
    buildCss();
  }
});

watcher.on("unlink", (filePath) => {
  if (filePath.endsWith(".liquid")) {
    console.log(`❌ .liquid file deleted: ${filePath}`);
    const importName = getScssImportName(filePath);

    // Remove the import from main.scss
    removeFromMainScss(importName);

    // Rebuild the CSS after deletion
    buildCss();
  }

  if (filePath.endsWith(".ts")) {
    console.log(`❌ TypeScript file deleted: ${filePath}`);
    const relativeFilePath = path.relative(tsSourcePath, filePath);
    const jsFilePath = path.join(
      assetsPath,
      relativeFilePath.replace(".ts", ".js")
    );
    deleteFile(jsFilePath);
    removeFromApplicationJs(jsFilePath);
  }

  if (filePath.endsWith(".scss")) {
    console.log(`❌ SCSS file deleted: ${filePath}`);
    buildCss();
  }
});

console.log(
  "👀 Watching for new .liquid, .ts, and .scss files and deletions..."
);

// Function to compile TypeScript file and append to application.js
const compileTsFile = (filePath: string) => {
  const relativeFilePath = path.relative(tsSourcePath, filePath);
  const outputFilePath = path.join(
    assetsPath,
    relativeFilePath.replace(".ts", ".js")
  );

  const outputDir = path.dirname(outputFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  exec(`tsc --outDir ${outputDir} ${filePath}`, (err, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (err) console.error("❌ Error compiling TypeScript:", err);

    if (fs.existsSync(outputFilePath)) {
      appendToApplicationJs(outputFilePath);
    }
  });
};

// Function to append JS imports into application.js
const appendToApplicationJs = (jsFilePath: string) => {
  const relativeJsPath = path
    .relative(projectRoot, jsFilePath)
    .replace(/\\/g, "/");
  const importStatement = `import './${relativeJsPath}';\n`;

  if (fs.existsSync(applicationJsPath)) {
    const content = fs.readFileSync(applicationJsPath, "utf8");
    if (!content.includes(importStatement)) {
      fs.appendFileSync(applicationJsPath, importStatement);
      console.log(`➕ Added import to application.js: ${importStatement}`);
    } else {
      console.log(`⏩ Skipped (already imported): ${importStatement}`);
    }
  } else {
    console.error(`❌ application.js not found at ${applicationJsPath}`);
  }
};

// Function to delete a file
const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`❌ Deleted: ${filePath}`);
  }
};

// Function to remove SCSS import from main.scss
const removeFromMainScss = (importName: string) => {
  if (fs.existsSync(mainScssPath)) {
    let content = fs.readFileSync(mainScssPath, "utf8");
    const importLine = `@use "${importName}";\n`;
    if (content.includes(importLine)) {
      content = content.replace(importLine, "");
      fs.writeFileSync(mainScssPath, content);
      console.log(`➖ Removed import from main.scss: ${importLine}`);
    } else {
      console.log(`⏩ Skipped (import not found): ${importLine}`);
    }
  } else {
    console.error(`❌ main.scss not found at ${mainScssPath}`);
  }
};

// Function to remove JS import from application.js
const removeFromApplicationJs = (jsFilePath: string) => {
  if (fs.existsSync(applicationJsPath)) {
    let content = fs.readFileSync(applicationJsPath, "utf8");
    const relativeJsPath = path
      .relative(projectRoot, jsFilePath)
      .replace(/\\/g, "/");
    const importStatement = `import './${relativeJsPath}';\n`;
    if (content.includes(importStatement)) {
      content = content.replace(importStatement, "");
      fs.writeFileSync(applicationJsPath, content);
      console.log(`➖ Removed import from application.js: ${importStatement}`);
    } else {
      console.log(`⏩ Skipped (import not found): ${importStatement}`);
    }
  } else {
    console.error(`❌ application.js not found at ${applicationJsPath}`);
  }
};

// Function to compile all SCSS to CSS
const buildCss = async () => {
  try {
    const result = sass.compile(mainScssPath);
    fs.writeFileSync(applicationCssPath, result.css);
    console.log(`✅ CSS compiled and saved to ${applicationCssPath}`);
  } catch (err) {
    console.error("❌ Error compiling SCSS:", err);
  }
};

// Helper functions
const getScssFilename = (filename: string) =>
  `_${filename.replace(".liquid", "")}.module.scss`;
const getScssImportName = (filename: string) =>
  `${filename.replace(".liquid", "")}.module`;
