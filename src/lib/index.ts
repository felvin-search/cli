import path, { resolve, join } from "path";
import fs from "fs-extra";
import { camelCase, upperFirst } from "lodash";

const felvinSearchAppsPath = resolve(__dirname, "../../../apps");
const appsPackageJsonPath = join(felvinSearchAppsPath, "package.json");
const appsIndexTsPath = join(felvinSearchAppsPath, "src/index.ts");

const npmPackageForAppId = (appId: string) => {
  return `@felvin-community/${appId}`;
};

// TODO: Do it only if the file is present
// Adds newly created app as a dependency in packages/apps/package.json
export const addNewAppDep = async (appId: string) => {
  if(fs.existsSync(appsPackageJsonPath)){
    const newNpmPackage = npmPackageForAppId(appId);
    const appsPackageJson = await fs.readJson(appsPackageJsonPath);
    appsPackageJson["dependencies"][newNpmPackage] = "^1.0.0";
    await fs.writeJson(appsPackageJsonPath, appsPackageJson);
  } else {
    console.log("apps package.json doesn't exist, skipping")
  }

};

// Imports the newly created app in the sandbox
export const updateAppsArray = async (appId: string) => {
  if(fs.existsSync(appsIndexTsPath)) {
    const newNpmPackage = npmPackageForAppId(appId);

    // e.g. converts currency-converter into CurrencyConverter
    const appExportName = upperFirst(camelCase(appId));
    let appsIndexTs = await fs.readFile(appsIndexTsPath, "utf-8");
  
    const importLine = `import ${appExportName} from "${newNpmPackage}";\n`;
    appsIndexTs = `${importLine}${appsIndexTs}`;
  
    appsIndexTs = appsIndexTs.replace(
      /const allApps = \[/gm,
      `const allApps = [\n  ${appExportName},`
    );
  
    await fs.writeFile(appsIndexTsPath, appsIndexTs);
  } else {
    console.log("apps index path of app sandbox doesn't exist, skipping")
  }

};
