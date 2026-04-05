const fs = require('fs');
const path = require('path');

const formalReplacements = [
    { regex: /silahkan/g, replace: 'silakan' },
    { regex: /Silahkan/g, replace: 'Silakan' },
    { regex: /SILAHKAN/g, replace: 'SILAKAN' },
    { regex: /[✨🤖✅❌📊📋🔍⚠️🛡️🔒📦⚖️✍️✉️▶️ℹ️⏱️️]/g, replace: '' },
    { regex: /\bwkwk(?:wk)*\b/gi, replace: '' }
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.php')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const { regex, replace } of formalReplacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replace);
                    modified = true;
                }
            }
            
            if (modified) {
                // DO NOT DO GLOBAL SPACE NEUTRALIZATION! It destroys indentations.
                // React and HTML automatically collapse double spaces, so any extra space left by emoji removals is perfectly safe on the frontend.
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated safely: ${fullPath}`);
            }
        }
    }
}

try {
    processDir('d:/AI/privasimu/frontend/src');
    processDir('d:/AI/privasimu/backend/app/Http');
    processDir('d:/AI/privasimu/backend/app/Services');
    console.log('✅ Formatting Done Safely!');
} catch (e) {
    console.error(e);
}
