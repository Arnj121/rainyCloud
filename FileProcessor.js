const fs= require('fs')
const path = require('path')
const db= require('./db')

const getspace = (req,res)=>{
    db.getDb().collection('users').findOne({'email':req.query.email},(err,result)=>{
        res.send(result.value.space.toString())
    })
}

const fileDbsave  =(obj,token,cwd,type,update=0) =>{
    if(update == 1){
        let n = new Date()
        n = n.toString()
        n = n.slice(0,24)
        db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwd,'name':obj.oldname},{$set:{'name':obj.newname,'lastmod':n}})
    }
    else{
        db.getDb().collection('userfiles').insertOne({'token':token,'cwd':cwd,'name':obj.name,'size':obj.size,'mimetype':obj['mimetype'],
                                            'lastmod':obj.lastmod,'type':type,'fav':0,'collections':[],'shared':0,'owner':token,'bin':0,'FILES':'FILES'})
        db.getDb().collection('users').findOne({'value.token':token},(err,result)=>{
            db.getDb().collection('users').findOneAndUpdate({'value.token':token},{$set:{'value.space':parseInt(result.value.space)+obj.size}})
        })
    }
}

const fileDBdelet = (dest,name,token,cwd)=>{
    db.getDb().collection('share').deleteOne({'token':token,'name':name})
    console.log(29, name,token,cwd)
    db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwd,'name':name},{$set:{'bin':1}})
    return true
}
const uploadFile = (req,res)=>{
    let file = req.files.files
    let token = req.query.token
    let cwdstring = typeof req.query.cwdstring == 'object' ? req.query.cwdstring[0] : req.query.cwdstring
    console.log(cwdstring,'fromloadfi')
    let data = file.data
    let name = file.name
    let lastmodified = req.query.lastmod
    let size = file.size
    let mimetype = file.mimetype
    let dest = path.join(__dirname,'serverfiles',token,name)
    fs.writeFile(dest,data,(err)=>{
        if(err)console.log(err)
    })
    fileDbsave({'name':name,'lastmod':lastmodified,'size':size,'mimetype':mimetype,'fav':0},token,cwdstring,'file')
    console.log(dest,'from upload file')
    res.send('done')
}

const uploadImage = (req,res)=>{
    let file = req.files.files
    let name = file.name
    let cwdstring = typeof req.query.cwdstring == 'object' ? req.query.cwdstring[0] : req.query.cwdstring
    ;console.log(cwdstring,'from upim')
    let token=req.query.token
    let lastmodified = req.query.lastmod
    let size = file.size
    let mimetype = file.mimetype
    let dest = path.join(__dirname,'serverimages',token,name)
    file.mv(dest,(err)=>{
        if(err)console.log(err)
    })
    let stype = 'image'
    if(mimetype.indexOf('video')!=-1)
        stype = 'video'
    if(mimetype.indexOf('audio')!=-1)
        stype='audio'
    fileDbsave({'name':name,'lastmod':lastmodified,'size':size,'mimetype':mimetype,'fav':0},token,cwdstring,stype)
    console.log(dest,'sent')
    res.send('done')
}

const loadFile = (req,res)=>{
    console.log('loading file')
    let fileName = req.query.filename
    let token = req.query.token
    let dest = path.join(__dirname, 'serverfiles',token, fileName)
    console.log('success', dest)
    fs.readFile(`${dest}`, 'utf8', (err, data) => {
        res.send(data)
    })
}
const loadImage = (req,res)=>{
    let token =req.query.token
    let cwdstring = typeof req.query.cwdstring == 'object' ? req.query.cwdstring[0] : req.query.cwdstring
    console.log(cwdstring,'fromloadi')
    let fileName = req.query.filename
    let dest = `http://localhost:3000/images/${token}/${fileName}`
    res.send(dest)
    console.log('success from laod image', dest)
}

const deleteFile = (req,res)=>{
    let token = req.query.token
    let cwdstring=req.query.cwdstring
    let fileName = req.query.filename
    if (fileDBdelet('Files',fileName, token,cwdstring))
        res.send('true')
    else
        res.send('false')
}
const deleteImage = (req,res)=> {
    let fileName = req.query.filename
    let token = req.query.token
    let cwdstring = req.query.cwdstring
    if (fileDBdelet('images',fileName, token,cwdstring))
        res.send('true')
    else
        res.send('false')
}
const listAllFiles=(req,res)=> {
    let token = req.query.token
    let cwdstring = typeof req.query.cwdstring =='object' ? req.query.cwdstring[0]: req.query.cwdstring
    let responseJson = {}
    let c = 0
    db.getDb().collection('userfiles').find({'token':token,'cwd':cwdstring,'FILES':'FILES'}).toArray((err,result)=>{
        for (let i=0;i<result.length;i++) {
            if(result[i]['type'] == 'file' && result[i]['bin']==0) {
                responseJson[c] = {
                    'type': 'file', 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token,'cwd':result[i]['cwd']
                }
                c+=1
            }
            else if((result[i]['type'] == 'image' || result[i]['type']=='video' || result[i]['type'] =='audio') && result[i]['bin']==0) {
                let dest = `http://localhost:3000/images/${token}/${result[i]['name']}`
                responseJson[c] = {
                'type': result[i]['type'], 'src': dest, 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token, 'cwd':result[i]['cwd']
                }
                c += 1
            }
        }
        db.getDb().collection('userfiles').find({'token':token,'cwd':cwdstring,'DIR':'DIR'}).toArray((err,result)=>{
            for (let i=0;i<result.length;i++) {
                responseJson[c] = {'type': 'dir','mimetype':'dir','name': result[i]['name'], 'created': result[i]['created']}
                c += 1
            }
            res.send(responseJson)
        })
    })

}
const updateFileName = (req,res)=>{
    let token = req.query.token
    let cwdstring = req.query.cwdstring
    let oldname = req.query.oldname
    let newname = req.query.newname
    fileDbsave({'newname':newname,'oldname':oldname}, token,cwdstring,'file',update=1)
    let oldpath = path.join(__dirname, 'serverfiles',token, oldname)
    let newpath = path.join(__dirname, 'serverfiles',token, newname)
    fs.rename(oldpath, newpath, (err) => {
        if (err) console.log(err, 'from update file name')
    })
    res.send('true')
}
const updateImageName = (req,res)=>{
    let token = req.query.token
    let cwdstring = req.query.cwdstring
    let oldname = req.query.oldname
    let newname = req.query.newname
    fileDbsave({'newname':newname,'oldname':oldname}, token,cwdstring,'image',update=1)
    let oldpath = path.join(__dirname, 'serverimages', token,oldname)
    let newpath = path.join(__dirname, 'serverimages',token, newname)
    fs.rename(oldpath, newpath, (err) => {
        if (err) console.log(err, 'from update file name')
    })
    res.send('true')
}
const createFolder = function(req,res){
    let foldername=req.query.name
    let token = req.query.token
    let cwdstring = req.query.cwdstring
    let d =new Date().toString().slice(0,24)
    db.getDb().collection('userfiles').insertOne({'token':token,'cwd':cwdstring,'name':foldername,'created':d,'fav':0,'collections':[],'bin':0,'mimetype':'dir','type':'dir',
        'DIR':'DIR'})
    res.send(d)

}

const deleteFolder = (req,res) =>{
    console.log('deleting folders')
    let token = req.query.token
    let foldername=req.query.filename
    let cwdstring = req.query.cwdstring
    deleteContentsFromDirectory(foldername,cwdstring)
    function deleteContentsFromDirectory(foldername,cwdstring) {
        db.getDb().collection('userfiles').deleteOne({'token': token, 'name': foldername, 'cwd': cwdstring})
        db.getDb().collection('userfiles').find({'token': token, 'cwd': cwdstring + '-' + foldername})
            .toArray((err, result) => {
                for (let i = 0; i < result.length; i++) {
                    db.getDb().collection('userfiles').deleteOne({'token':token,'cwd':cwdstring+'-'+foldername,'name':result[i]['name']})
                    if (result[i]['type']=='dir')
                        deleteContentsFromDirectory(result[i]['name'],result[i]['cwd'])
                    else if(result[i]['type']=='file')
                        fs.unlink(path.join(__dirname,'serverfiles',token,result[i]['name']),(err)=>{
                            if(err)console.log(err)
                        })
                    else if(result[i]['type']=='image' || result[i]['type'] == 'video' || result[i]['type'] == 'audio')
                        fs.unlink(path.join(__dirname,'serverimages',token,result[i]['name']),(err)=>{
                            if(err)console.log(err)
                        })
                }
        })
    }
    res.send('done')
}
const updatefoldername = (req,res)=>{
    let oldname = req.query.oldname
    let newname = req.query.newname
    let token = req.query.token
    let cwdstring = req.query.cwdstring
    db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwdstring,'name':oldname},{$set:{'name':newname}})
    db.getDb().collection('userfiles').updateMany({'token':token,'cwd':cwdstring+'-'+oldname},{$set:{'cwd':cwdstring+'-'+newname}})
    res.send('done')
}

const search = function(req,res){
    let name = req.query['search']
    let token = req.query['token']
    let responseJson = {},s,ids=0
    let searchloc = req.query.searchloc
    let owner = req.query.owner
    let email =req.query.email
    let searchtype = req.query.searchType
    if(searchloc == 'everywhere' && owner == 'all'){
        console.log(1)
        db.getDb().collection('share').find({'name':{$regex:name}}).toArray((err,result)=>{
            for(let i=0;i<result.length;i++) {
                if (result[i]['type'] == 'image' && (searchtype == 'all' || searchtype == 'images')) {
                    responseJson[ids] = {
                        'name': [j],
                        'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'image', 'pathtoshow': `from ${result[i]['token']}`,
                    }
                } else if (result[i]['type'] == 'file' && (searchtype == 'docs' || searchtype == 'all')) {
                    responseJson[ids] = {
                        'name': result[i]['name'],
                        'path': result[i]['cwd'], 'type': 'file', 'pathtoshow': `from ${result[i]['token']}`,
                    }
                }
                else if (result[i]['type'] == 'video' && (searchtype == 'video' || searchtype == 'all')) {
                    responseJson[ids] = {
                        'name': [j],
                        'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'video', 'pathtoshow': `from ${result[i]['token']}`,
                    }
                }
                else if (result[i]['type'] == 'audio' && (searchtype == 'audio' || searchtype == 'all')) {
                    responseJson[ids] = {
                        'name': [j],
                        'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'audio', 'pathtoshow': `from ${result[i]['token']}`,
                    }
                }
                ids += 1
            }
            res.send(responseJson)
        })
    }
    else if(searchloc == 'everywhere' && owner=='user' && email.length!=0){
        console.log(2)
        db.getDb().collection('users').findOne({'email':email},(err,result)=>{
            let x= result.value.token,y=result.value.name
            db.getDb().collection('share').find({'token':x,'name':{$regex:name}}).toArray((err,result)=>{
                for(let i=0;i<result.length;i++){
                    if(result[i]['type'] == 'image' && (searchtype=='all' || searchtype=='images')){
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'image', 'pathtoshow': `from ${y}`,
                        }
                    }
                    else if(result[i]['type'] =='file' && (searchtype=='docs' || searchtype=='all')){
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': result[i]['cwd'], 'type': 'file', 'pathtoshow': `from ${y}`,
                        }
                    }
                    else if (result[i]['type'] == 'video' && (searchtype == 'video' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'video', 'pathtoshow': `from ${y}`,
                        }
                    }
                    else if (result[i]['type'] == 'audio' && (searchtype == 'audio' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'audio', 'pathtoshow': `from ${y}`,
                        }
                    }
                    ids+=1
                }
                res.send(responseJson)
            })
        })
    }
    else {
        if (searchloc == 'shared') {
            db.getDb().collection('userfiles').find({'cwd': 'SHARE', 'token': token, 'name': {$regex: name}}).toArray((err, result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i]['type'] == 'image' && (searchtype == 'all' || searchtype == 'images')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'image', 'pathtoshow': 'shared with me'
                        }
                    } else if (result[j]['type'] == 'file' && (searchtype == 'docs' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': result[i]['owner'], 'type': 'file', 'pathtoshow': 'shared with me'
                        }
                    }
                    else if (result[i]['type'] == 'video' && (searchtype == 'video' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'video', 'pathtoshow': 'shared with me'
                        }
                    }
                    else if (result[i]['type'] == 'audio' && (searchtype == 'audio' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:300/images/${token}/${result[i]['name']}`, 'type': 'audio', 'pathtoshow': 'shared with me'
                        }
                    }
                    ids++;
                }
                res.send(responseJson)
            })
        }
        else if (searchloc == 'home') {
            db.getDb().collection('userfiles').find({'token': token, 'name': {$regex: name}, 'bin': 0}).toArray((err, result) => {
                for (let i = 0; i < result.length; i++) {
                    s = result[i]['cwd'].split('-')
                    s[0] = 'Home'
                    s = s.join('/')
                    if (result[i]['type'] == 'image' && (searchtype == 'all' || searchtype == 'images')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:3000/images/${token}/${result[i]['name']}`, 'type': 'image', 'pathtoshow': s
                        }
                    }
                    if (result[i]['type'] == 'file' && (searchtype == 'docs' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': result[i]['owner'], 'type': 'file', 'pathtoshow': s
                        }
                    }
                    if (result[i]['type'] == 'dir' && searchtype == 'all') {
                        responseJson[ids] = {
                            'name': result[i]['name'], 'path': result[i]['cwd'], 'type': 'dir', 'pathtoshow': s
                        }
                    }
                    if (result[i]['type'] == 'video' && (searchtype == 'video' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:3000/images/${token}/${result[i]['name']}`, 'type': 'video', 'pathtoshow': s
                        }
                    }
                    if (result[i]['type'] == 'audio' && (searchtype == 'audio' || searchtype == 'all')) {
                        responseJson[ids] = {
                            'name': result[i]['name'],
                            'path': `http://localhost:3000/images/${token}/${result[i]['name']}`, 'type': 'audio', 'pathtoshow': s
                        }
                    }
                    ids++
                }
                res.send(responseJson)
            })
        }
    }
}
const createfile= function(req,res){
    let token =req.body.token
    let name = req.body.name
    let lastmod=  req.body.lastmod
    let data = req.body.data
    let cwdstring = req.body.cwdstring
    let size = req.body.size
    fs.writeFile(path.join(__dirname,'serverfiles',token,name),data,(err)=>{
        if(err)console.log(err)
    })
    fileDbsave({'name':name,'lastmod':lastmod,'size':parseInt(size),'mimetype':'plain/text'},token,cwdstring,'file')
    res.send('done')
}
const addfav = (req,res)=>{
    let filename = req.query.filename
    let cwdstring = req.query.cwdstring
    let token = req.query.token
    db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwdstring,'name':filename},{$set:{'fav':1}})
    res.send('done')
}
const getfav = (req,res)=> {
    let token = req.query.token
    let c = 0
    let responseJson = {}
    db.getDb().collection('userfiles').find({'token':token,'fav':1}).toArray((err,result)=>{
        for(let i=0;i<result.length;i++) {
            if (result[i]['type'] == 'file' && result[i]['bin'] == 0)
                responseJson[c] = {
                    'type': 'file',
                    'name': result[i]['name'],
                    'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'],
                    'lastmod': result[i]['lastmod'],
                    'cwd':result[i]['cwd']
                }
            else if ((result[i]['type'] == 'image' || result[i]['type']=='video'|| result[i]['type']=='audio') && result[i]['bin'] == 0)
                responseJson[c] = {
                    'type': result[i]['type'],
                    'src': `http://localhost:3000/images/${token}/${result[i]['name']}`,
                    'name': result[i]['name'],
                    'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'],
                    'lastmod': result[i]['lastmod'],
                    'cwd': result[i]['cwd']
                }
            else if (result[i]['type'] == 'dir' && result[i]['bin'] == 0)
                responseJson[c] = {
                    'type': 'dir',
                    'name': result[i]['name'],
                    'created': result[i]['created'],
                    'cwd': result[i]['cwd'],
                    'mimetype':'dir',
                }
            c += 1
        }
        res.send(responseJson)
    })
}
const getcollection = (req,res)=>{
    let token = req.query.token
    db.getDb().collection('collection').findOne({'token':token},(err,result)=>{
        if(result) {
            let colllsit = result.value
            res.send({0: colllsit})
        }
        else{
            res.send({0:[]})
        }
    })
}
const createcollection = (req,res)=>{
    let name = req.query.name
    let token = req.query.token
    db.getDb().collection('collection').update({'token':token},{$push:{'value':name}})
    res.send('done')
}
const addtocollection = (req,res)=> {
    let token = req.query.token
    let cname = req.query.cname.substr(0,req.query.cname.length-2).split('!!')
    let cwdstring = req.query.cwdstring
    let type = req.query.type;
    type = type == 'f' || type == 'i' || type == 'file' || type == 'image' ? 'FILES' : 'DIR'
    let name = req.query.name
    for (let i = 0; i < cname.length; i++) {
        let x = cname[i].substr(0, cname[i].length - 3)
        db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'name':name,'cwd':cwdstring},{$push:{'collections':x}})
    }
    res.send('done')
}

const listcollection = (req,res)=>{
    let token  = req.query.token
    let cname = req.query.cname
    let c = 0
    let responseJson = {}
    db.getDb().collection('userfiles').find({'token':token,'collections':{$in:[cname]},'bin':0}).toArray((err,result)=>{
        for(let i=0;i<result.length;i++){
                if (result[i]['type'] == 'file')
                    responseJson[c] = {
                        'type': 'file',
                        'name':result[i]['name'],
                        'mimetype':result[i]['mimetype'],
                        'size':result[i]['size'],
                        'lastmod':result[i]['lastmod'],
                        'cwd':result[i]['cwd']
                    }
                else if (result[i]['type'] == 'image' || result[i]['type']=='video' || result[i]['type']=='audio')
                    responseJson[c] = {
                        'type': result[i]['type'],
                        'src': `http://localhost:3000/images/${token}/${result[i]['name']}`,
                        'name':result[i]['name'],
                        'mimetype':result[i]['mimetype'],
                        'size':result[i]['size'],
                        'lastmod':result[i]['lastmod'],
                        'cwd':result[i]['cwd']
                    }
                else if(result[i]['type']=='dir')
                    responseJson[c] = {
                        'type': 'dir',
                        'name': result[i]['name'],
                        'created': result[i]['created'],
                        'cwd':result[i]['cwd'],
                        'mimetype':'dir'
                    }
                c += 1
        }
        res.send(responseJson)
        console.log('done')
    })
}
const listBinFiles = (req,res)=>{
    let token = req.query.token
    let responseJson = {},c=0
    db.getDb().collection('userfiles').find({'token':token,'bin':1}).toArray((err,result)=>{
        console.log(456,result)
        for(let i=0;i<result.length;i++) {
            if (result[i]['type'] == 'file') {
                responseJson[c] = {
                    'type': 'file',
                    'name': result[i]['name'],
                    'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'],
                    'lastmod': result[i]['lastmod'],
                    'owner': token,
                    'cwd': result[i]['cwd']
                }
            } else if (result[i]['type'] == 'image' || result[i]['type']=='video' || result[i]['type']=='audio') {
                let dest = `http://localhost:3000/images/${token}/${result[i]['name']}`
                responseJson[c] = {
                    'type': result[i]['type'],
                    'src': dest,
                    'name': result[i]['name'],
                    'mimetype': result[i]['mimetype'],
                    'cwd': result[i]['cwd'],
                    'size': result[i]['size'],
                    'lastmod': result[i]['lastmod'],
                    'owner': token
                }
            }
            c += 1
        }
        res.send(responseJson)
    })

}

const transfer = (req,res)=>{
    let oldcwdstring = req.query.oldcwdstring
    let newcwdstring = req.query.newcwdstring
    let filename = req.query.filename
    let token = req.query.token
    let type = req.query.type
    let status = req.query.status
    if (oldcwdstring == newcwdstring) {
        res.send('done')
    } else {
        if (type == 'file' || type=='image') {
            console.log('moving file')
            if(status==1) {
                db.getDb().collection('userfiles').findOneAndUpdate({'cwd': oldcwdstring, 'token': token, 'name': filename}, {$set:{'cwd':newcwdstring}})
            }
            else{
                db.getDb().collection('userfiles').findOne({'cwd':oldcwdstring,'token':token,'name':filename},(err,result)=>{
                    let x = result
                    delete x['_id']
                    x['cwd'] = newcwdstring
                    db.getDb().insertOne(x)
                    res.send('done')
                })
            }
        } else {
            if(status == 1){
                db.getDb().collection('userfiles').findOneAndUpdate({'cwd':oldcwdstring,'token':token,'name':filename},{$set:{'cwd':newcwdstring}})
                    .then(db.getDb().collection('userfiles').updateMany({'cwd':oldcwdstring+'-'+filename,'token':token},{$set:{'cwd':newcwdstring+'-'+filename}}))
                res.send('done')
            }
            else{
                db.getDb().collection('userfiles').findOne({'cwd':oldcwdstring,'token':token,'name':filename},(err,result)=>{
                    let x = result
                    x['cwd'] = newcwdstring
                    delete x['_id']
                    db.getDb().collection('userfiles').insertOne(x)
                    db.getDb().collection('userfiles').find({'cwd':oldcwdstring+'-'+filename,'token':token}).toArray((err,result)=>{
                        for(let i=0;i<result.length;i++){
                            let x = result[i]
                            x['cwd'] = newcwdstring+'-'+filename
                            delete x['_id']
                            db.getDb().collection('userfiles').insertOne(x)
                        }
                    })
                    res.send('done')
                })
            }
        }
    }
}
const reloadwithfilter= (req,res)=>{
    let token = req.query.token
    let binstatus=0
    let favstatus=0
    let swmstatus=0
    let fsstatus=0
    if(req.query.bin=='1')
        binstatus=1
    if(req.query.fav =='1')
        favstatus=1
    if(req.query.swm == '1')
        swmstatus=1
    if(req.query.fs == '1')
        fsstatus=1
    let responseJson ={}
    let filterlist = req.query.filterlist
    filterlist = filterlist.split(';')
    let cwdstring= req.query.cwdstring
    let c = 0
    let filter={'token':token,'cwd':cwdstring,'bin':binstatus}
    if(favstatus){
        filter['fav']=1
    }
    if(fsstatus){
        filter['shared']=1
    }
    db.getDb().collection('userfiles').find(filter).toArray((err,result)=>{
        for(let i=0;i<result.length;i++){
            if(result[i]['type'] == 'file' && filterlist.includes('file-filter')) {
                responseJson[c] = {
                    'type': 'file', 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token
                }
                c+=1
            }
            else if(result[i]['type'] == 'image' && filterlist.includes('image-filter')) {
                let dest = `http://localhost:3000/images/${token}/${result[i]['name']}`
                responseJson[c] = {
                    'type': 'image', 'src': dest, 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token
                }
                c += 1
            }
            else if(result[i]['type'] == 'dir' && filterlist.includes('folder-filter')){
                responseJson[c] = {'type': 'dir', 'name': result[i]['name'], 'created': result[i]['created'],'mimetype':'dir'}
                c += 1
            }
            else if(result[i]['type'] == 'video' && filterlist.includes('video-filter')) {
                let dest = `http://localhost:3000/images/${token}/${result[i]['name']}`
                responseJson[c] = {
                    'type': 'video', 'src': dest, 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token
                }
                c += 1
            }
            else if(result[i]['type'] == 'audio' && filterlist.includes('audio-filter')) {
                let dest = `http://localhost:3000/images/${token}/${result[i]['name']}`
                responseJson[c] = {
                    'type': 'audio', 'src': dest, 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token
                }
                c += 1
            }
        }
        res.send(responseJson)
    })
}
const sharefile = (req,res)=>{
    let token = req.query.token
    let cwdstring = req.query.cwdstring
    let email = req.query.email
    let select = req.query.select
    let data = req.body
    data['owner'] = token
    data['seen'] = 0
    delete data['rnd']
    if(select == 'share-public' && data.type!='dir'){
        db.getDb().collection('share').insertOne(data)
        res.send('done')
        db.getDb().collection('userfiles').updateOne({'token':token,'cwd':cwdstring,'name':data.name},{$set:{'shared':1}})
    }
    else if(select == 'share-private' && data.type!='dir'){
        data['cwd'] = 'SHARE'
        db.getDb().collection('users').findOne({'email':email},(err,result)=>{
            data['token'] = result['value']['token']
            db.getDb().collection('userfiles').insertOne(data)
                res.send('done')
        })
    }
    else{
        res.send('error')
    }
}
const getsharefile = (req,res)=>{
    let token=req.query.token
    let only=req.query.only
    let responseJson = {},c=0
    if(only=='only'){
        db.getDb().collection('userfiles').find({'token':token,'cwd':'SHARE','seen':0}).toArray((err,result)=>{
            let c=0;
            for(let i=0;i<result.length;i++){
                c+=1
            }
            res.send(c.toString())
        })
    }
    else if(only=='notonly'){
        db.getDb().collection('userfiles').updateMany({'token':token,'cwd':'SHARE','seen':0},{$set:{'seen':1}})
        res.send('done')
    }
    else {
        db.getDb().collection('userfiles').find({'token':token,'cwd':"SHARE"}).toArray((err,result)=>{
            for (let i = 0; i < result.length; i++) {
                responseJson[c] = result[i]
                c += 1
            }
            res.send(responseJson)
        })
    }
}
const addpeople = (req,res)=> {
    let data = req.body
    let token = req.query.token
    let email = data['0']
    for (let i = 0; i < email.length; i++) {
        db.getDb().collection('users').findOne({'email': email}, (err, result) => {
            if (result && result['token'] != token)
                db.getDb().collection('people').findOneAndUpdate({'token': token}, {$push: {'value': email[i]}})
        })
    }
    res.send('done')
}
const getpeople = (req,res)=>{
    let token = req.query.token
    db.getDb().collection('people').findOne({'token':token},(err,result)=>{
        res.send({'0':result['value']})
    })
}
const removepeople =(req,res)=>{
    let token = req.query.token
    let email = req.query.email
    db.getDb().collection('people').findOne({'token':token},(err,result)=>{
        let x = result['value']
        let y = x.slice(0,x.indexOf(email)).concat(x.slice(x.indexOf(email)+1,x.length))
        db.getDb().collection('people').findOneAndUpdate({'token':token},{$set:{'value':y}})
        console.log('removed')
        res.send('done')
    })
}

const savefile = (req,res)=>{
    let token = req.query.token
    let owner = req.body.owner
    let data = req.body.val
    let filename = req.body.filename
    if(token == owner){
        fs.writeFile(path.join(__dirname,'serverfiles',token,filename),data,(err)=>{
            if(err)console.log(err)
        })
        res.send({'status':true})
    }
    else{
        res.send({'status':false})
    }
}

const restorefile = (req,res)=>{
    let token = req.query.token
    let cwd = req.body.cwdstring
    let filename = req.body.filename
    db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwd,'name':filename},{$set:{'bin':0}})
    res.send('done')
    console.log('file restored')
}
const download = (req,res)=>{
    let file = req.query.name
    let type = req.query.type
    let token = req.query.token
    if(type=='image' || type=='video' || type=='audio'){
        res.download(path.join(__dirname,'serverimages',token,file),file)
        console.log('image downloaded')
    }
    else{
        res.download(path.join(__dirname,'serverfiles',token,file),file)
        //res.send()
        console.log('file downloaded')
    }
}
const getfilesshared = (req,res)=>{
    let token = req.query.token
    let responseJson = {},c=0
    db.getDb().collection('userfiles').find({'token':token,'shared':1}).toArray((err,result)=>{
        for(let i=0;i<result.length;i++){
            if (result[i]['type'] == 'image' || result[i]['type'] =='video' || result[i]['type'] =='audio'){
                let dest = `http://localhost:3000/images/${token}/${result[i]['name']}`
                responseJson[c] = {
                    'type': result[i]['type'], 'src': dest, 'name': result[i]['name'],'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token,'cwd':result[i]['cwd']
                }
                c += 1
            }
            else{
                responseJson[c] = {
                    'type': 'file', 'name': result[i]['name'], 'mimetype': result[i]['mimetype'],
                    'size': result[i]['size'], 'lastmod': result[i]['lastmod'],'owner':token,'cwd':result[i]['cwd']
                }
                c+=1
            }
        }
        res.send(responseJson)
    })
}
const removefav = (req,res)=>{
    let token = req.body.token
    let cwd = req.body.cwd
    let name = req.body.name
    db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwd,'name':name},{$set:{'fav':0}})
    res.send('done')
}

const spaceanalysis = (req,res)=>{
    let token = req.query.token
    db.getDb().collection('userfiles').find({'token':token}).toArray((err,result)=>{
        if(result.length!=0){
            let imgsize=0,imgcount=0,docsize=0,doccount=0,videosize=0,videocount=0,audiosize=0,audiocount=0
            for(let i=0;i<result.length;i++){
                if(result[i]['type']== 'image'){
                    imgcount++
                    imgsize+=result[i]['size']
                }
                else if(result[i]['type'] == 'file'){
                    doccount++
                    docsize+=result[i]['size']
                }
                else if(result[i]['type'] =='video' ){
                    videocount++
                    videosize+=result[i]['size']
                }
                else if(result[i]['type'] == 'audio'){
                    audiocount++
                    audiosize+=result[i]['size']
                }
            }
            res.send(JSON.stringify({'status':1,'imgcount':imgcount,'imgsize':imgsize,'videocount':videocount,'videosize':videosize,'audiocount':audiocount,
            'audiosize':audiosize,'docsize':docsize,'doccount':doccount}))
        }
        else
            res.send(JSON.stringify({'status':0,'imgcount':0,'imgsize':0,'videocount':0,'videosize':0,'audiocount':0,
                'audiosize':0,'docsize':0,'doccount':0}))
    })
}
const stopsharing = (req,res)=>{
    let filename = req.body.filename
    let token = req.query.token
    let cwd = req.body.cwdstring
    db.getDb().collection('userfiles').findOneAndUpdate({'token':token,'cwd':cwd,'name':filename},{$set:{'shared':0}})
    db.getDb().collection('share').deleteOne({'owner':token,'name':filename})
    res.send('done')
}
const removecol = (req,res)=>{
    let name = req.body.name
    let token = req.body.token
    db.getDb().collection('collection').findOne({'token':token},(err,result)=>{
        let x = result.value
        x  = x.slice(0,x.indexOf(name)).concat(x.slice(x.indexOf(name)+1,x.length))
        db.getDb().collection('collection').findOneAndUpdate({'token':token},{$set:{'value':x}})
        res.send('done')
    })
}
const removefromcol = (req,res)=>{
    let cname = req.body.cname
    let token = req.body.token
    let name = req.body.name
    let cwd = req.body.cwd
    db.getDb().collection('userfiles').findOne({'token':token,'cwd':cwd,'name':name,'collections':{$in:[cname]}},(err,result)=>{
        let x = result.collections
        x = x.slice(0,x.indexOf(cname)).concat(x.slice(x.indexOf(cname)+1,x.length))
        db.getDb().collection('userfiles').updateOne({'token':token,'cwd':cwd,'name':name},{$set:{'collections':x}})
        res.send('done')
    })
}

module.exports = {getspace,uploadFile,uploadImage,loadFile,loadImage,deleteFile,deleteImage,listAllFiles,updatefoldername,download,getfilesshared,removecol,
updateFileName,updateImageName,createFolder,deleteFolder,search,createfile,addfav,getfav,getcollection,createcollection,listBinFiles,removefav,stopsharing,
transfer,addtocollection,listcollection,reloadwithfilter,sharefile,getsharefile,addpeople,getpeople,removepeople,savefile,restorefile,spaceanalysis,removefromcol}
