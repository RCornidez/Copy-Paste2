import fs, { readdirSync } from 'fs';
import path, { join, extname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as Terser from 'terser';

// Function to get JavaScript files from a directory
function getJsFiles(dir) {
    const files = readdirSync(dir);
    return files
        .filter(file => extname(file) === '.js')
        .map(file => join(dir, file));
}

// Minify a single JavaScript file
const minifyFile = async (inputFile) => {
    try {
        // Read the input file
        const input = fs.readFileSync(inputFile, 'utf8');
        
        // Generate the output file name
        const dirname = path.dirname(inputFile);
        const basename = path.basename(inputFile, path.extname(inputFile));
        const outputFile = path.join(dirname, `${basename}.js`);
        
        // Minify the JavaScript
        const result = await Terser.minify(input, {
            compress: {
                drop_console: true,    // Remove console statements
                drop_debugger: true,   // Remove debugger statements
                reduce_vars: true,     // Reduce variables that are only used once
                inline: true,          // Inline small functions
                passes: 9,             // Number of compress passes
                collapse_vars: true,  // Collapse variables declared but only used once
                reduce_funcs: true,   // Reduce function names
                hoist_vars: true,     // Hoist variables declared within block scopes to the top
            },
            mangle: {
                toplevel: true,        // Mangle top-level variable and function names
                reserved: [],          // List of names to avoid mangling
                keep_fnames: false,    // Do not keep function names
            },
        });

        if (result.error) {
            console.error('Error during minification:', result.error);
        } else {
            // Remove the original file
            fs.unlinkSync(inputFile);
            console.log(`Original file removed: ${inputFile}`);

            // Write the minified output to a file
            fs.writeFileSync(outputFile, result.code);
            console.log(`Minification complete. Output file: ${outputFile}`);

        }
    } catch (error) {
        console.error('Error in minification process:', error);
    }
};

// Resolve the path for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing JavaScript files
const jsDir = '../public/v2/';

// Get all .js files from the directory
const entryPoints = getJsFiles(resolve(__dirname, jsDir));

// Function to minify all JavaScript files
const minifyAllFiles = async () => {
    for (const file of entryPoints) {
        await minifyFile(file);
    }
};

// Execute the minification
minifyAllFiles();
