const fs = require('fs')
const ip = process.argv[2]
const newip = process.argv[3]
require('dotenv').config()

let files = ['webpack/template.html', 'static/PWA/manifest.json', 'static/PWA/sw.js', 'static/app/script.js',
    'static/dist/bundle.js', '.env']
for (let i = 0; i < files.length; i++) {
    let m = 0
    fs.readFile(files[i], 'UTF-8', (err, data) => {
        if (err) console.log(err)
        else {
            let loc = data.indexOf(ip)
            while (loc != -1) {
                console.log("replacing")
                data = data.replace(ip, newip)
                m = 1
                loc = data.indexOf(ip)
            }
            if (m) fs.writeFile(files[i], data, () => {
            })
        }
    })
}

