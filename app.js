const express = require('express')
const bodyparser = require('body-parser')
const fileUpload = require('express-fileupload')
const fileprocessor = require('./FileProcessor')
const loginsignup =require('./login-signup')
const path = require('path')
const {auth}  = require('express-openid-connect');
const logger = require('morgan');

const cors = require('cors')
require('dotenv').config()
const corsoptions ={
    origin:'*',
    optionsSuccessStatus:200
}
const config = {
    authRequired: false,
    auth0Logout: true
};
if (!config.baseURL && !process.env.BASE_URL && process.env.APP_PORT && process.env.NODE_ENV !== 'production') {
    config.baseURL = `http://${process.env.HOST}:${process.env.APP_PORT}`;
}
const server = express()
const imageserver= express()

server.use(logger('dev'));
server.use(cors(corsoptions))
server.use(auth(config));
server.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
});
server.use(bodyparser.urlencoded({extended: false}))
server.use(bodyparser.json())
server.use(fileUpload())
server.use('/resource',express.static(path.join(__dirname,'static')))

imageserver.use(cors(corsoptions))
imageserver.use('/images',express.static(path.join(__dirname,'serverimages')))

server.get('/loginpage',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','login','index.html'))})
server.get('/mainpage',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','app','index.html'))
})
server.get('/ping',(req,res)=>{res.send({status:200})})
server.get('/getspace',fileprocessor.getspace)
server.post('/uploadfile',fileprocessor.uploadFile)
server.post('/uploadimage',fileprocessor.uploadImage)
server.get('/loadfile',fileprocessor.loadFile)
server.get('/loadimage',fileprocessor.loadImage)
server.get('/listallfiles',fileprocessor.listAllFiles)
server.delete('/deletefile',fileprocessor.deleteFile)
server.delete('/deleteimage',fileprocessor.deleteImage)
server.put('/updatefilename',fileprocessor.updateFileName)
server.put('/updateimagename',fileprocessor.updateImageName)
server.get('/login',loginsignup.userLogin)
server.post('/signup',loginsignup.userSignup)
server.get('/logout',loginsignup.userlogout)
server.post('/createfolder',fileprocessor.createFolder)
server.delete('/deletefolder',fileprocessor.deleteFolder)
server.get('/search',fileprocessor.search)
server.post('/createfile',fileprocessor.createfile)
server.get('/getfav',fileprocessor.getfav)
server.post('/addfav',fileprocessor.addfav)
server.post('/createcollection',fileprocessor.createcollection)
server.get('/getcollection',fileprocessor.getcollection)
server.post('/transfer',fileprocessor.transfer)
server.put('/updatefoldername',fileprocessor.updatefoldername)
server.post('/addtocollection',fileprocessor.addtocollection)
server.get('/listcollection',fileprocessor.listcollection)
server.get('/reloadwithfilter',fileprocessor.reloadwithfilter)
server.post('/sharefile',fileprocessor.sharefile)
server.get('/getsharefile',fileprocessor.getsharefile)
server.post('/addpeople',fileprocessor.addpeople)
server.get('/getpeople',fileprocessor.getpeople)
server.delete('/removepeople',fileprocessor.removepeople)
server.post('/savefile',fileprocessor.savefile)
server.put('/edituser',loginsignup.edituser)
server.get('/listbinfiles',fileprocessor.listBinFiles)
server.post('/restorefile',fileprocessor.restorefile)
server.get('/download',fileprocessor.download)
server.get('/getfilesshared',fileprocessor.getfilesshared)
server.post('/stopsharing',fileprocessor.stopsharing)
server.post('/removefav',fileprocessor.removefav)
server.get('/spaceanalysis',fileprocessor.spaceanalysis)
server.post('/removecol',fileprocessor.removecol)
server.post('/removefromcol',fileprocessor.removefromcol)
imageserver.get('/images/:token/:imagename',(req,res)=>{
    res.sendFile(path.join(__dirname,'serverimages',req.params.token,req.params.imagename))
})

server.listen(process.env.APP_PORT,process.env.HOST || 4000,()=>{
    console.log(`listening on http://${process.env.HOST}:${process.env.APP_PORT}/loginpage`)
})
imageserver.listen(process.env.IMG_PORT,process.env.HOST || 3000,()=>{
    console.log(`listening on http://${process.env.HOST}:${process.env.IMG_PORT}/images/`)
})
