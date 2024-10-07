const dns = require('node:dns');
const fs = require('fs')
const ip=process.argv[2]
const newip=process.argv[3]
const options = { family: 4 };
const os = require('node:os');
require('dotenv').config()

if(ip){}
else{
    ip=process.env.HOST
}

dns.lookup(os.hostname(), options, (err, addr) => {
    console.log("replacing with " + addr)
    if (!err) {
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
                        if(newip)
                           data = data.replace(ip, newip)
                        else
                           data = data.replace(ip, addr)
                        m = 1
                        loc = data.indexOf(ip)
                    }
                    if (m) fs.writeFile(files[i], data, () => {
                    })
                }
            })
        }
    }
});

