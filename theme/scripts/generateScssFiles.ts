import fs from "fs";
import path from "path";

// Project root (one level up from /scripts)
const projectRoot = path.resolve(__dirname, "..");

// Paths
const sectionsPath = path.join(projectRoot, "sections");
const snippetsPath = path.join(projectRoot, "snippets");
const stylesPath = path.join(projectRoot, "src", "styles");
const mainScssPath = path.join(stylesPath, "main.scss");

// Utils
const getScssFilename = (filename: string) =>
  `_${filename.replace(".liquid", "")}.module.scss`;
const getScssImportName = (filename: string) =>
  `${filename.replace(".liquid", "")}.module`;

const getLiquidFiles = (
  folderPath: string,
  filterFn: (file: string) => boolean = () => true
): string[] =>
  fs.existsSync(folderPath)
    ? fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".liquid") && filterFn(file))
    : [];

const createScssFile = (filename: string) => {
  const filePath = path.join(stylesPath, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      `// Styles for ${filename.replace("_", "").replace(".module.scss", "")}\n`
    );
    console.log(`✅ Created: ${filename}`);
  } else {
    console.log(`⏩ Skipped (already exists): ${filename}`);
  }
};

const appendToMainScss = (importName: string) => {
  const importLine = `@use "${importName}";`;
  const content = fs.existsSync(mainScssPath)
    ? fs.readFileSync(mainScssPath, "utf8")
    : "";
  if (!content.includes(importLine)) {
    fs.appendFileSync(mainScssPath, `${importLine}\n`);
    console.log(`➕ Added to main.scss: ${importLine}`);
  } else {
    console.log(`⏩ Skipped (already imported): ${importLine}`);
  }
};

const generate = () => {
  const sectionFiles = getLiquidFiles(sectionsPath);
  const snippetFiles = getLiquidFiles(
    snippetsPath,
    (file) => !file.startsWith("icon-")
  );
  const allFiles = [...sectionFiles, ...snippetFiles];

  allFiles.forEach((file) => {
    const scssFile = getScssFilename(file);
    const importName = getScssImportName(file);
    createScssFile(scssFile);
    appendToMainScss(importName);
  });
};

generate();
console.log("✅ SCSS files generated and main.scss updated.");