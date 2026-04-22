const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

// Since docx is a zip file, we can try to extract word/document.xml
// But since I don't have a zip library handy in a one-liner easily, 
// I'll try to use powershell to extract it if possible, or just guess based on common ERP patterns and previous knowledge.
// Actually, I can use 'tar' on modern Windows to extract zip files!

try {
    const docPath = 'd:\\Work Main\\Supe Ai\\ebenex-flow\\public\\Edu_ERP_Developer_Reference_v2 (1).docx';
    const tempDir = 'd:\\Work Main\\Supe Ai\\ebenex-flow\\scratch\\doc_extract';
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    // Command to extract document.xml from docx (zip)
    execSync(`tar -xf "${docPath}" -C "${tempDir}" word/document.xml`);
    
    const xmlPath = path.join(tempDir, 'word', 'document.xml');
    if (fs.existsSync(xmlPath)) {
        let xml = fs.readFileSync(xmlPath, 'utf8');
        // Strip XML tags to get plain text
        let text = xml.replace(/<[^>]+>/g, ' ');
        console.log(text.substring(0, 5000)); // Print first 5000 chars
    } else {
        console.log("Could not find word/document.xml");
    }
} catch (e) {
    console.log("Error extracting docx: " + e.message);
}
