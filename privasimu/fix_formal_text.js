const fs = require('fs');
const path = require('path');
function processDir(dir) {
    if(!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.php')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let prev = content;
            content = content.replace(/silahkan/g, 'silakan');
            content = content.replace(/Silahkan/g, 'Silakan');
            content = content.replace(/SILAHKAN/g, 'SILAKAN');
            if (content !== prev) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed silahkan: ${fullPath}`);
            }
        }
    }
}
processDir('d:/AI/privasimu');
console.log("Check complete.");
