const dns = require('node:dns');
const fs = require('fs')
const ip=process.argv[2]
const newip=process.argv[3]
const options = { family: 4 };
const os = require('node:os');

dns.lookup(os.hostname(), options, (err, addr) => {
    if (!err) {
        let files = ['static/login/template.html','static/login/script.js', 'static/app/index.html',
            'static/PWA/manifest.json','static/PWA/sw.js','static/app/script.js','conf/nginx.conf','backend/.env']
        for (let i = 0; i < files.length; i++) {
            let m = 0
            fs.readFile(files[i], 'UTF-8', (err, data) => {
                if (err) console.log(err)
                else {
                    let loc = data.indexOf(ip)
                    while (loc != -1) {
                        if(newip.length>0)
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

