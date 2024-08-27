import { fileURLToPath } from 'url';
import path, { dirname, join, extname, resolve } from 'path';
import { readdirSync, copyFileSync, mkdirSync, statSync } from 'fs';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directories containing JavaScript, CSS, and assets files
const htmlDir = '../MVC/Views/pages/';
const jsDir = '../MVC/Views/scripts/';
const cssDir = '../MVC/Views/styles/';
const assetsDir = '../MVC/Views/assets/';
const publicDir = 'public/v2/';

async function build() {
  try {
    // Function to get JavaScript and CSS files from a directory
    function getFiles(dir, extension) {
      const files = readdirSync(dir);
      return files
        .filter(file => extname(file) === extension)
        .map(file => join(dir, file));
    }

    // Function to copy a directory recursively
    function copyDirectory(srcDir, destDir) {
      readdirSync(srcDir).forEach(file => {
        const srcPath = join(srcDir, file);
        const destPath = join(destDir, file);
        const stats = statSync(srcPath);

        if (stats.isDirectory()) {
          mkdirSync(destPath, { recursive: true });
          copyDirectory(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      });
    }

    // Get all .js and .css files from the directories
    const htmlFiles = getFiles(resolve(__dirname, htmlDir), '.html');
    const jsFiles = getFiles(resolve(__dirname, jsDir), '.js');
    const cssFiles = getFiles(resolve(__dirname, cssDir), '.css');

    // Build with ESBuild for JavaScript files
    await esbuild.build({
      entryPoints: jsFiles,
      bundle: true,
      minify: false,
      sourcemap: false,  // set to true if you want to debug bundled version in the browser
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      outdir: publicDir,
      platform: 'browser', // Ensure platform is set to 'browser'
      format: 'esm',
    });

    // Copy HTML files to the public directory
    htmlFiles.forEach(file => {
      const destination = join(publicDir, path.basename(file));
      copyFileSync(file, destination);
    });

    // Copy CSS files to the public directory
    cssFiles.forEach(file => {
      const destination = join(publicDir, path.basename(file));
      copyFileSync(file, destination);
    });

    // Copy assets folder to the public directory
    const destAssetsDir = join(publicDir, 'assets');
    mkdirSync(destAssetsDir, { recursive: true });
    copyDirectory(resolve(__dirname, assetsDir), destAssetsDir);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error(`An error occurred during the build process: ${error.message}`);
    process.exit(1);
  }
}

build();
