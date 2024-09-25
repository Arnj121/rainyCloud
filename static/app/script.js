let fuw=0,iuw=0,fullscreen=0,editmode=0,ew=0,pw=0,dw=0,cfw=0,sw=0,share=0,abtwind=0,cfoldwin=0;
let rw=0,cw=0,addc=0,neww=0,searchresultsshowing=0,searchtrack=-1,searchvalue=0,searchids=[];
let currentselected = 0,contextmenuopened=0,minicontextmenuopened=0,popup=0,addpeople=0,peopleselct=0
let Filerecieved ={},showpplwind=0,selectfile=0,selectedfilelist=[]
let filesSelected={},vw=0,aw=0,siw=0
let imagesSelected ={};
let rndids={},rndlist=[],info={},searchredirest={};
let cwd='ROOT',cwdstring='ROOT'
let browsehistory = ['ROOT']
let p=0,nav=0,collection=0;
let userdetails = {'loggedin':0,'name':0,'token':0,'email':0,'password':0,'space':0}
let searchresults={}
let absoluteids=[];
let curmenu='my-home',masking='Home',curcolname=0,FileSharedRecieved={};
let status=0,oldcwdstring,newcwdstring,selectedFileToTransfer,selectedFileType;
let FavFilesRecieved ={},CollectionList=[],collectiontoadd='',CollFilesRecieved={},shareids={}
let filters={'image-notch':0,'file-notch':0,'folder-notch':0,'video-notch':0,'audio-notch':0},BinFilesRecieved={},trashids={}
let ShareFilesRecieved={},peopleRecieved,searchOption=0,userinfo=0,filedblclicked=0
let searchparam = {'searchloc':'home','owner':'all','email':0,'search-type':'all'}
let view=0,pr=1
inituserdetails()
initmenu()
initCollections()
getFiles()
getnewshares()

function cookieExist(name){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}
function getCookie(name){
    return document.cookie.split(';').some(c=>{
        if (c.trim().startsWith(name + '=')) return c.trim().split('=')[1]
    })
}
function updateCookie(name,data){
    function deleteCookie(name){
        let d=new Date()
        d.setMonth(d.getMonth()-1)
        document.cookie = `${name}=;expires=${d};path='/`
    }

    let d=new Date()
    d.setHours(d.getHours()+24)
    console.log(d)
    if (cookieExist(name))
        deleteCookie(name)
    document.cookie = `${name}=${data};expires=${d};path='/`
}

function getnewshares(t=0) {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let c = parseInt(this.responseText)
            if (c > 0){
                document.getElementById('shareno').innerText = c.toString()
                document.getElementById('shareno').style.visibility ='visible'
            }
        }
    }
    let url = `http://localhost:4000/getsharefile?token=${userdetails['token']}&only=only`
    if(t==1)
        url = `http://localhost:4000/getsharefile?token=${userdetails['token']}&only=notonly`
    xhr.onerror = function (){
        if (cookieExist('getsharefile')) {
            let c = parseInt(getCookie('getsharefile'))
            if (c > 0) {
                document.getElementById('shareno').innerText = c.toString()
                document.getElementById('shareno').style.visibility = 'visible'
            }
        }
    }
    xhr.open('GET',url)
    xhr.send()
}
function initmenu() {
    document.getElementById(curmenu).style.backgroundColor='whitesmoke'
    document.getElementById(curmenu).style.color='#FFAB00'
}

function initspace(){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState ==4){
            userdetails['space'] = parseInt(this.responseText)
            displayspace()
        }
    }
    xhr.onerror = function (){
        if (cookieExist('getspace')){
            userdetails['space'] = parseInt(getCookie('getspace'))
            displayspace()
        }
    }
    xhr.open('GET',`http://localhost:4000/getspace?email=${userdetails['email']}`)
    xhr.send()
}

function displayspace(){
    document.getElementById('space-lbl').innerText =`${convertBytes(userdetails['space'])} / 5 Gb`
    document.getElementById('space-progress').value = (userdetails['space']/(5*(10**9))).toString()
}
document.onclick = (e)=>{
    console.log(e.target.id)
    if(minicontextmenuopened==1){
        document.getElementById('right-click-contextmenu-paste').style.visibility ='hidden'
        minicontextmenuopened=0
    }
    if(contextmenuopened==1){
        document.getElementById('right-click-contextmenu').style.visibility='hidden'
        contextmenuopened=0
    }
    if (currentselected && (e.target.id =='container-lvl2' || e.target.id=='')) {
        if(view==0)
            document.getElementById(currentselected).parentElement.style.opacity = '1'
        else
            document.getElementById(currentselected).parentElement.style.backgroundColor = 'white'
        currentselected = 0
    }
    if(neww == 1){
        document.getElementById('add-new-child').style.visibility='hidden'
        neww=0
    }
    if(sw==1 && e.target.id!='setting-icon'){
        sw=0
        document.getElementById('settings').style.visibility='hidden'
    }
    if(userinfo==1 && e.target.id=='blank')
        document.getElementById('user-info').click()
}

document.body.onkeyup = (e)=>{
    if(e.key == 'Enter'){
        if(fuw==1){
            document.getElementById('file-upload-confirm').click()
        }
        if(iuw==1){
            document.getElementById('image-upload-confirm').click()
        }
        if(currentselected){
            let dblclick=document.createEvent('MouseEvents')
            dblclick.initEvent('dblclick',true,true)
            document.getElementById(currentselected).dispatchEvent(dblclick)
        }
        if(searchresultsshowing!=0 && searchvalue!=0){
            document.getElementById(searchvalue).click()
        }
        if(cfw==1){
            document.getElementById('save-file').click()
        }
        if(cfoldwin==1){
            document.getElementById('create-folder-confirm').click()
        }
    }
    if(e.key == 'Backspace'){
        if(fuw==0 && iuw==0 && fullscreen==0 && editmode==0 && ew==0 && pw==0 && dw==0 && cfw==0 && rw==0 &&
            cw==0 && addc==0 && cfoldwin==0 && vw==0 && siw==0 && aw==0)
            document.getElementById('back').click()
    }
    if(e.key == 'Escape') {
        if (currentselected) {
            document.getElementById(currentselected).click()
        }
        if(ew==1){
            document.getElementById('close-editor-window').click()
        }if(pw==1){
            document.getElementById('close-photo-window').click()
        }
        if(dw==1){
            document.getElementById('close-detail-window').click()
        }
        if(cfw==1)
            document.getElementById('save-cancel-file').click()
        if(neww==1)
            document.getElementById('add-new').click()
        if(sw == 1)
            document.getElementById('setting-icon').click()
        if(addpeople==1)
            document.getElementById('add-people-cancel').click()
        if(userinfo==1)
            document.getElementById('user-info').click()
    }
    if(e.key == 'ArrowLeft' && currentselected && fuw==0 && iuw==0 && fullscreen==0 && editmode==0 && addc==0 && cfoldwin==0 &&
    ew==0 && pw==0 && dw==0 && cfw==0 && sw==0 && rw==0 && cw==0 && addc==0 && vw==0 && siw==0 && aw==0){
        nav = rndlist.indexOf(currentselected)
        nav--
        if(nav<0)
            nav = rndlist.length-1
        document.getElementById(rndlist[nav]).click()
    }
    if(e.key == 'ArrowRight' && currentselected && fuw==0 && iuw==0 && fullscreen==0 && editmode==0 && addc==0 && cfoldwin==0 &&
        ew==0 && pw==0 && dw==0 && cfw==0 && sw==0 && rw==0 && cw==0 && vw==0 && siw==0 && aw==0){
        nav = rndlist.indexOf(currentselected)
        nav++
        if(nav>=rndlist.length)
            nav = 0
        document.getElementById(rndlist[nav]).click()
    }
    if(e.key == 'ArrowDown' && searchresultsshowing==1){
        searchtrack++
        let searchkeys = Object.keys(searchredirest)
        if(searchtrack>=searchkeys.length)
            searchtrack=0
        if(searchvalue!=0)
            document.getElementById(searchvalue).style.backgroundColor='whitesmoke'
        searchvalue = searchkeys[searchtrack]
        document.getElementById(searchvalue).style.backgroundColor='white'

    }
    if(e.key == 'ArrowUp' && searchresultsshowing==1){
        searchtrack--
        let searchkeys = Object.keys(searchredirest)
        if(searchtrack<0)
            searchtrack=searchkeys.length-1
        if(searchvalue!=0)
            document.getElementById(searchvalue).style.backgroundColor='whitesmoke'
        searchvalue = searchkeys[searchtrack]
        document.getElementById(searchvalue).style.backgroundColor='white'
    }
}
document.oncontextmenu = (e)=>{
    e.preventDefault()
    if(minicontextmenuopened==1 && (e.target.id=='mainframe' || e.target.id=='' || e.target.id=='container-lvl2')){
        document.getElementById('right-click-contextmenu-paste').style.left = e.clientX.toString()+'px'
        document.getElementById('right-click-contextmenu-paste').style.top = e.clientY.toString()+'px'
        document.getElementById('right-click-contextmenu-paste').style.visibility='visible'
    }
    else if(e.target.id=='mainframe' || e.target.id=='' || e.target.id=='container-lvl2'){
        minicontextmenuopened=1
        document.getElementById('right-click-contextmenu-paste').style.left = e.clientX.toString()+'px'
        document.getElementById('right-click-contextmenu-paste').style.top = e.clientY.toString()+'px'
        document.getElementById('right-click-contextmenu-paste').style.visibility='visible'
    }
}
document.getElementById('setting-icon').onclick = ()=>{
    if(sw==1){
        sw=0
        document.getElementById('settings').style.visibility='hidden'
    }
    else{
        sw=1
        document.getElementById('settings').style.visibility = 'visible'
    }
}
document.getElementById('user-info').onclick = ()=>{
    //code red
}

function convertBytes(bytes){
    let s = bytes.toString(),x
    if(s.toString().length>9) {
        x = (s / 10 ** 9).toString()
        x = x.toString().slice(0, x.toString().indexOf('.') + 2) + ' Gb'
    }
    else if(s.toString().length>6) {
        x = (s / 10 ** 6).toString()
        x = x.toString().slice(0, x.toString().indexOf('.') + 2) + ' Mb'
    }
    else if(s.toString().length>2){
        x = (s / 10 ** 3).toString()
        x = x.toString().slice(0, x.toString().indexOf('.') + 2) + ' Kb'
    }
    else
        x= s+' b'
    return x
}

document.getElementById('space-info').onclick = ()=>{

    function temp(response){
        if(response['status']==1) {
            let l = 5 * (10 ** 9)
            document.getElementById('video').style.width = ((response['videosize'] / l) * 100).toString() + '%'
            document.getElementById('videocount').innerText = response['videocount']
            document.getElementById('video-size').innerText = convertBytes(response['videosize'])

            document.getElementById('audio').style.width = ((response['audiosize'] / l) * 100).toString() + '%'
            document.getElementById('audiocount').innerText = response['audiocount']
            document.getElementById('audio-size').innerText = convertBytes(response['audiosize'])

            document.getElementById('images').style.width = ((response['imgsize'] / l) * 100).toString() + '%'
            document.getElementById('imgcount').innerText = response['imgcount']
            document.getElementById('img-size').innerText = convertBytes(response['imgsize'])

            document.getElementById('docs').style.width = ((response['docsize'] / l) * 100).toString() + '%'
            document.getElementById('doccount').innerText = response['doccount']
            document.getElementById('docs-size').innerText = convertBytes(response['docsize'])

            let k = l - (response['videosize'] + response['imgsize'] + response['audiosize'] + response['docsize'])
            document.getElementById('free').style.width = ((k / l) * 100).toString() + '%'
            document.getElementById('free-size').innerText = convertBytes(k)
            document.getElementById('space-info-window').style.visibility = 'visible'
            document.getElementById('blank').style.visibility = 'visible'
        }
        else{
            let l = 5 * (10 ** 9)
            document.getElementById('video').style.width = '0%'
            document.getElementById('videocount').innerText = response['videocount']
            document.getElementById('video-size').innerText = convertBytes(0)

            document.getElementById('audio').style.width = '0%'
            document.getElementById('audiocount').innerText = response['audiocount']
            document.getElementById('audio-size').innerText = convertBytes(0)

            document.getElementById('images').style.width = '0%'
            document.getElementById('imgcount').innerText = response['imgcount']
            document.getElementById('img-size').innerText = convertBytes(0)

            document.getElementById('docs').style.width = '0%'
            document.getElementById('doccount').innerText = response['doccount']
            document.getElementById('docs-size').innerText = convertBytes(0)

            let k = l
            document.getElementById('free').style.width = ((k / l) * 100).toString() + '%'
            document.getElementById('free-size').innerText = convertBytes(k)
            document.getElementById('space-info-window').style.visibility = 'visible'
            document.getElementById('blank').style.visibility = 'visible'
        }
    }
    siw=1
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState ==4){
            let response = JSON.parse(this.response)
            console.log(response)
            temp(response)

        }
    }
    xhr.onerror = function (){
        if (cookieExist('spaceanalysis')){
            temp(JSON.parse(getCookie('sapceanalysis')))
        }
    }
    xhr.open('GET',`http://localhost:4000/spaceanalysis?token=${userdetails['token']}`)
    xhr.send()
}
document.getElementById('close-space-window').onclick = ()=>{
    siw=0
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('space-info-window').style.visibility = 'hidden'
    /*document.getElementById('video').style.width = (response['videosize']/l).toString()+'%'
    document.getElementById('videocount').innerText = response['videocount']
    document.getElementById('audio').style.width = (response['audiosize']/l).toString()+'%'
    document.getElementById('audiocount').innerText = response['audiocount']
    document.getElementById('images').style.width = (response['imgsize']/l).toString()+'%'
    document.getElementById('imgcount').innerText = response['imgcount']
    document.getElementById('docs').style.width = (response['docsize']/l).toString()+'%'
    document.getElementById('doccount').innerText = response['doccount']
    document.getElementById('free').style.width = (l-(response['videosize']+response['imgsize']+response['audiocount']+response['dococunt'])/l).toString()+'%'
    document.getElementById('space-info-window').style.visibility='visible'
    document.getElementById('blank').style.visibility = 'visible'*/
}
let show_ppl_added=[];
document.getElementById('show-added-people').onclick = ()=>{
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            peopleRecieved = JSON.parse(this.response)
            peopleRecieved = peopleRecieved['0']
            if(peopleRecieved.length == 0){
                let ele = document.createElement('label')
                ele.style.margin = 'auto'
                ele.innerText = 'You have not added anyone'
                ele.style.fontSize ='large'
                ele.id = 'notadded'
                document.getElementById('people-added-window').appendChild(ele)
            }
            else {
                for (let i = 0; i < peopleRecieved.length; i++) {
                    let lab = document.createElement('label')
                    lab.id = Math.floor(Math.random() * 1000).toString() + 'rnd'
                    let fa = document.createElement('i');
                    fa.className = 'fal fa-user';
                    fa.style.marginRight = '10px'
                    show_ppl_added.push(lab.id)
                    lab.className = 'people-added-var'
                    lab.innerText = peopleRecieved[i]
                    lab.style.color = 'black'
                    lab.onclick = (e) => {
                        peopleselct = e.target.id
                        if (document.getElementById(peopleselct).style.color == 'black') {
                            document.getElementById(peopleselct).style.backgroundColor = 'black'
                            document.getElementById(peopleselct).style.color = 'white'
                        } else {
                            document.getElementById(peopleselct).style.backgroundColor = 'whitesmoke'
                            document.getElementById(peopleselct).style.color = 'black'
                        }
                    }
                    lab.prepend(fa)
                    document.getElementById('people-added-window').appendChild(lab)
                }
            }
            document.getElementById('show-added-people-window').style.visibility = 'visible'
            document.getElementById('blank').style.visibility='visble'
            document.getElementById('blank').style.visibility = 'visible'
            peopleRecieved={}
            showpplwind = 1
        }
    }
    xhr.open('GET',`http://localhost:4000/getpeople?token=${userdetails['token']}`)
    xhr.send()
}
document.getElementById('add-more').onclick = ()=>{
    document.getElementById('add-people-window').style.visibility='visible'
    document.getElementById('show-added-people-window').style.visibility='hidden'
    document.getElementById('people-added-window').removeChild(document.getElementById('notadded'))
    let ele = document.getElementsByClassName('people-added-var')
    for(let i=0;i<ele.length;i++){
        document.getElementById('people-added-window').removeChild(ele[i])
    }
    addpeople=1;showpplwind=0
}

document.getElementById('remove-more').onclick = ()=>{
    if(peopleselct!=0){
        let email = document.getElementById(peopleselct).innerText
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                document.getElementById('people-added-window').removeChild(document.getElementById(peopleselct))
                peopleselct=0
                displaypopup(`'${email}' has been removed from people`)
            }
        }
        xhr.onerror = function (){
            displaypopup('No network connection:(')
        }
        xhr.open('DELETE',`http://localhost:4000/removepeople?token=${userdetails['token']}&email=${email}`)
        xhr.send()
    }
}
document.getElementById('show-added-people-window-close').onclick=()=>{
    document.getElementById('show-added-people-window').style.visibility ='hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    peopleselct=0
    showpplwind=0
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('people-added-window').removeChild(document.getElementById('notadded'))
    for(let i=0;i<show_ppl_added.length;i++) {
        try {
            document.getElementById('people-added-window').removeChild(document.getElementById(show_ppl_added[i]))
        }catch (e) {}
    }
    show_ppl_added=[]
}
document.getElementById('search').oninput = (e)=>{
    let val = e.target.value
    if(val.length>=3){
        if(searchOption==1){
            document.getElementById('search-settings-window').style.visibility='hidden'
            document.getElementById('blank').style.visibility='hidden'
            searchOption=0
        }
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4){
                searchresults= JSON.parse(this.responseText)
                clearSearchResutls()
                displaySearchResults()
                document.getElementById('search').style.borderBottomRightRadius = '0'
                document.getElementById('search').style.borderBottomLeftRadius = '0'
                document.getElementById('search-results').style.borderTopRightRadius='0'
                document.getElementById('search-results').style.borderTopLeftRadius='0'
            }
        }
        xhr.onerror = function (){
            displaypopup('No network connection:(')
        }
        xhr.open('GET',`http://localhost:4000/search?search=${val}&token=${userdetails['token']}&searchloc=${searchparam['searchloc']}&owner=${searchparam['owner']}&email=${searchparam['email']}&searchType=${searchparam['search-type']}`)
        xhr.send()
    }
    else{
        searchresultsshowing=0
        searchtrack=-1
        searchvalue=0
        searchresults = {}
        searchredirest={}
        for(let i=0;i<searchids.length;i++){
            document.getElementById('search-results').removeChild(document.getElementById(searchids[i]))
        }
        searchids=[]
        document.getElementById('search').style.borderBottomRightRadius = '5px'
        document.getElementById('search').style.borderBottomLeftRadius = '5px'
        document.getElementById('search-results').style.removeProperty('border-top-right-radius')
        document.getElementById('search-results').style.removeProperty('border-top-right-radius')

    }
}

document.getElementById('image-filter').onclick = ()=>{
    if(filters['image-notch'] ==0 ){
        filters['image-notch'] = 1
        document.getElementById('image-filter').style.backgroundColor='black'
        document.getElementById('image-notch').style.color ='#FFA615'
        document.getElementById('image-filter').style.color = 'white'
        RelaodWithFilter()
    }
    else{
        filters['image-notch'] =0
        document.getElementById('image-filter').style.backgroundColor='whitesmoke'
        document.getElementById('image-notch').style.color ='#FF4081'
        document.getElementById('image-filter').style.color = '#4A148C'
        RelaodWithFilter()
    }
}
document.getElementById('file-filter').onclick = ()=>{
    if(filters['file-notch'] ==0 ){
        filters['file-notch'] = 1
        document.getElementById('file-filter').style.backgroundColor='black'
        document.getElementById('file-notch').style.color ='#FFA615'
        document.getElementById('file-filter').style.color = 'white'
        RelaodWithFilter()
    }
    else{
        filters['file-notch'] =0
        document.getElementById('file-filter').style.backgroundColor='whitesmoke'
        document.getElementById('file-notch').style.color ='#FF4081'
        document.getElementById('file-filter').style.color = '#4A148C'
        RelaodWithFilter()
    }
}
document.getElementById('folder-filter').onclick = ()=>{
    if(filters['folder-notch'] ==0 ){
        filters['folder-notch'] = 1
        document.getElementById('folder-filter').style.backgroundColor='black'
        document.getElementById('folder-notch').style.color ='#FFA615'
        document.getElementById('folder-filter').style.color = 'white'
        RelaodWithFilter()
    }
    else{
        filters['folder-notch'] =0
        document.getElementById('folder-filter').style.backgroundColor='whitesmoke'
        document.getElementById('folder-notch').style.color ='#FF4081'
        document.getElementById('folder-filter').style.color = '#4A148C'
        RelaodWithFilter()
    }
}

document.getElementById('video-filter').onclick = ()=>{
    if(filters['video-notch'] ==0 ){
        filters['video-notch'] = 1
        document.getElementById('video-filter').style.backgroundColor='black'
        document.getElementById('video-notch').style.color ='#FFA615'
        document.getElementById('video-filter').style.color = 'white'
        RelaodWithFilter()
    }
    else{
        filters['video-notch'] =0
        document.getElementById('video-filter').style.backgroundColor='whitesmoke'
        document.getElementById('video-notch').style.color ='#FF4081'
        document.getElementById('video-filter').style.color = '#4A148C'
        RelaodWithFilter()
    }
}
document.getElementById('audio-filter').onclick = ()=>{
    if(filters['audio-notch'] ==0 ){
        filters['audio-notch'] = 1
        document.getElementById('audio-filter').style.backgroundColor='black'
        document.getElementById('audio-notch').style.color ='#FFA615'
        document.getElementById('audio-filter').style.color = 'white'
        RelaodWithFilter()
    }
    else{
        filters['audio-notch'] =0
        document.getElementById('audio-filter').style.backgroundColor='whitesmoke'
        document.getElementById('audio-notch').style.color ='#FF4081'
        document.getElementById('audio-filter').style.color = '#4A148C'
        RelaodWithFilter()
    }
}

function RelaodWithFilter() {
    let filterlist = ''
    if (filters['image-notch'] == 1)
        filterlist += 'image-filter;'
    if (filters['file-notch'] == 1)
        filterlist += 'file-filter;'
    if (filters['folder-notch'] == 1)
        filterlist += 'folder-filter;'
    if(filters['video-notch'] ==1)
        filterlist +='video-filter;'
    if(filters['audio-notch']==1)
        filterlist+='audio-filter;'
    if (filterlist.length != 0) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let filterFilerecieved = JSON.parse(this.response)
                cleanUp()
                ShowFiles(filterFilerecieved)
                eventListeners()
                showNav()
                if(masking=='Bin')
                    showTrashIcon()
            }
        }
        let url = `http://localhost:4000/reloadwithfilter?filterlist=${filterlist}&cwdstring=${cwdstring}&token=${userdetails['token']}`
        if(masking=='Bin')
            url = `http://localhost:4000/reloadwithfilter?filterlist=${filterlist}&cwdstring=${cwdstring}&token=${userdetails['token']}&bin=1`
        else if(masking =='Favorites')
            url = `http://localhost:4000/reloadwithfilter?filterlist=${filterlist}&cwdstring=${cwdstring}&token=${userdetails['token']}&fav=1`
        else if(masking == 'shared with me')
            url = `http://localhost:4000/reloadwithfilter?filterlist=${filterlist}&cwdstring=${cwdstring}&token=${userdetails['token']}&swm=1`
        else if(masking == 'files-shared')
            url = `http://localhost:4000/reloadwithfilter?filterlist=${filterlist}&cwdstring=${cwdstring}&token=${userdetails['token']}&fs=1`
        xhr.open('GET',url)
        xhr.send()
    } else {
        cleanUp()
        getFiles()
    }
}

document.getElementById('select-file').onclick = ()=>{
    if(selectfile==1) {
        selectfile = 0
        document.getElementById('select-file').style.backgroundColor = 'whitesmoke'
        document.getElementById('select-file').style.color = '#4A148C'
        document.getElementById('check').style.color ='#ff4081'
        for (let i = 0; i < selectedfilelist.length; i++) {
            try{
                document.getElementById(selectedfilelist[i]).removeChild(document.getElementsByTagName('i')[0])
            }
            catch (e) {

            }
        }
        selectedfilelist = []
    }
    else{
        selectfile=1
        document.getElementById('select-file').style.backgroundColor = 'black'
        document.getElementById('select-file').style.color='white'
        document.getElementById('check').style.color = '#3FFF4D'
    }
}
function addcheck(id){
    if(selectedfilelist.includes(id)){
        selectedfilelist = selectedfilelist.slice(0,selectedfilelist.indexOf(id)).concat(selectedfilelist.slice(selectedfilelist.indexOf(id)+1,selectedfilelist.length-1))
        if(view ==0)
            try {document.getElementById(id).removeChild(document.getElementById(id).getElementsByTagName('i')[0])}catch (e) {}
        else{
            document.getElementById(id).style.backgroundColor = 'white'
        }

    }
    else {
        if(view==0) {
            let ele = document.createElement('i')
            ele.className = 'fal fa-check-square fa-2x'
            selectedfilelist.push(id)
            ele.style.color = '#3FFF4D'
            ele.style.margin= '10px 0 0 10px'
            //ele.style.transform = 'scale(3)'
            try {document.getElementById(id).appendChild(ele)} catch (e) {}
        }
        else{
            selectedfilelist.push(id)
            document.getElementById(id).parentElement.style.backgroundColor = 'whitesmoke'
            document.getElementById(id).parentElement.style.borderRadius = '5px'
        }
    }
}
document.getElementById('delete-all').onclick = ()=> {
    if (selectfile == 1) {
        for (let i = 0; i < selectedfilelist.length; i++) {
            let xhr = new XMLHttpRequest()
            let url;
            if (rndids[selectedfilelist[i]]['type'] == 'file')
                url = `http://localhost:4000/deletefile?filename=${rndids[selectedfilelist[i]]['name']}&token=${info[selectedfilelist[i]]['owner']}&cwdstring=${cwdstring}`
            else if (rndids[selectedfilelist[i]]['type'] == 'image')
                url = `http://localhost:4000/deleteimage?filename=${rndids[selectedfilelist[i]]['name']}&token=${info[selectedfilelist[i]]['owner']}&cwdstring=${cwdstring}`
            else
                url = `http://localhost:4000/deletefolder?filename=${rndids[selectedfilelist[i]]['name']}&token=${userdetails['token']}&cwd=${cwd}&cwdstring=${cwdstring}`
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    //remove the element from dom
                    delete rndids[selectedfilelist[i]]
                    delete info[selectedfilelist[i]]
                    delete rndlist[rndlist.indexOf(selectedfilelist[i])]
                    document.getElementById('container-lvl2').removeChild(document.getElementById(selectedfilelist[i]).parentElement)
                    if(Object.keys(rndids).length==0){
                        let ele = document.createElement('label')
                        ele.innerText = 'Nothing here'
                        ele.id ='nothing'
                        ele.style.fontSize = 'large'
                        ele.style.margin = 'auto'
                        document.getElementById('container-lvl2').appendChild(ele)
                    }
                }
            }
            xhr.onerror = function (){
                displaypopup('No network connection:(')
            }
            xhr.open('DELETE', url)
            xhr.send()
        }

        displaypopup(`${selectedfilelist.length} File${selectedfilelist.length > 1 ? 's' : ''} deleted`)
        document.getElementById('select-file').style.backgroundColor = 'whitesmoke'
        document.getElementById('select-file').style.color = 'black'
        document.getElementById('check').style.color = 'black'
        selectfile = 0
    }
}

document.getElementById('list-view').onclick = ()=>{
    view = 1
    cleanUp()
    getFiles()
    document.getElementById('list-view-header').style.visibility='visible'
    document.getElementById('gallery-view').style.color='#d1d1d0'
    document.getElementById('list-view').style.color='#FF4081'
    document.getElementById('container-lvl2').style.flexDirection  = 'column'
    document.getElementById('container-lvl2').style.flexWrap  = 'nowrap'


}
document.getElementById('gallery-view').onclick = ()=>{
    view=0
    cleanUp()
    getFiles()
    document.getElementById('list-view-header').style.visibility='hidden'
    document.getElementById('gallery-view').style.color='#FF4081'
    document.getElementById('list-view').style.color='#d1d1d0'
    document.getElementById('container-lvl2').style.flexWrap = 'wrap'
    document.getElementById('container-lvl2').style.removeProperty('flexDirection')
}

function displaypopup(msg){
    function hide(){
        document.getElementById('pop-up').style.animationName='hidepopup'
        popup=0
    }

    if(popup==1){
        clearInterval(hide)
        document.getElementById('pop-up').style.animationName='hidepopup'
        popup=0
        displaypopup(msg)
    }
    else{
        document.getElementById('msg').innerText=msg
        document.getElementById('pop-up').style.animationName='showpopup'
        setTimeout(hide,5000)
        popup=1
    }

}
document.getElementById('search-options').onclick = ()=>{
    if(searchOption==1) {
        document.getElementById('search-settings-window').style.animationName = 'hide-search-options'
        document.getElementById('blank').style.visibility='hidden'
        setTimeout(() => {
            document.getElementById('search-settings-window').style.visibility = 'hidden'
        }, 800)
        searchOption = 0
    }
    else{
        document.getElementById('search-settings-window').style.animationName='show-search-options'
        document.getElementById('search-settings-window').style.visibility = 'visible'
        document.getElementById('blank').style.visibility='visible'
        searchOption=1
    }
}
document.getElementById('close-settings-window').onclick = ()=>{
    document.getElementById('search-options').click()
}


document.getElementById('search-location-input').onchange = (e)=>{
    searchparam['searchloc'] = e.target.value
}
document.getElementById('from-input').onchange = (e)=>{
    searchparam['owner'] = e.target.value
}
document.getElementById('user-email').onchange = (e)=>{
    searchparam['email'] = e.target.value
}
document.getElementById('search-type').onchange = (e)=>{
    searchparam['search-type'] = e.target.value
}

function clearSearchResutls() {
    for(let i=0;i<searchids.length;i++){
        document.getElementById('search-results').removeChild(document.getElementById(searchids[i]))
    }
    searchids=[];searchredirest={};searchresultsshowing=0
}

document.getElementById('user-info').onclick = ()=>{
    if(userinfo==1){
        userinfo=0
        document.getElementById('userinfo-window').style.visibility = 'hidden'
        document.getElementById('blank').style.visibility = 'hidden'
        document.getElementById('change-username').style.visibility='hidden'
        document.getElementById('change-password').style.visibility='hidden'
        if(document.getElementById('the-eye').classList.contains('fa-eye')){
            document.getElementById('password').style.visibility = 'hidden'
            document.getElementById('the-eye').classList.remove('fa-eye')
            document.getElementById('the-eye').classList.add('fa-eye-slash')
        }
    }
    else{
        userinfo=1
        document.getElementById('userinfo-window').style.visibility = 'visible'
        document.getElementById('blank').style.visibility = 'visible'
        document.getElementById('change-username').style.visibility='visible'
        document.getElementById('change-password').style.visibility='visible'
    }
}

document.getElementById('change-username').onclick = ()=>{
    document.getElementById('change-username').style.visibility = 'hidden'
    document.getElementById('newusername').style.visibility= 'visible'
    document.getElementById('username-ok').style.visibility = 'visible'
    document.getElementById('username-back').style.visibility = 'visible'
}
document.getElementById('change-password').onclick = ()=>{
    document.getElementById('change-password').style.visibility = 'hidden'
    document.getElementById('newpassword').style.visibility= 'visible'
    document.getElementById('password-ok').style.visibility = 'visible'
    document.getElementById('password-back').style.visibility = 'visible'
}

document.getElementById('username-ok').onclick = ()=>{
    let newusername = document.getElementById('newusername').value
    if(newusername.length!=0){
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4 && xhr.status==200){
                displaypopup('Username has been changed')
                userdetails['name'] = newusername
                document.getElementById('username').innerText = newusername
                document.getElementById('newusername').value = ''
                document.getElementById('username-back').click()
            }
        }
        xhr.onerror = function (){
            displaypopup('No network connection:(')
        }
        xhr.open("PUT",`http://localhost:4000/edituser?type=name`)
        xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'val':newusername,'email':userdetails['email']}))
    }
}
document.getElementById('username-back').onclick = ()=>{
    document.getElementById('change-username').style.visibility = 'visible'
    document.getElementById('newusername').style.visibility= 'hidden'
    document.getElementById('username-ok').style.visibility = 'hidden'
    document.getElementById('username-back').style.visibility = 'hidden'
}
document.getElementById('password-ok').onclick = ()=>{
    let newpassword = document.getElementById('newpassword').value
    if(newpassword.length!=0){
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4 && xhr.status==200){
                displaypopup('Password has been changed')
                document.getElementById('newpassword').value =''
                document.getElementById('password-back').click()
                userdetails['password'] = newpassword
            }
        }
        xhr.onerror = function (){
            displaypopup('No network connection:(')
        }
        xhr.open("PUT",`http://localhost:4000/edituser?type=password`)
        xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'val':newpassword,'email':userdetails['email']}))
    }
}
document.getElementById('password-back').onclick = ()=>{
    document.getElementById('change-password').style.visibility = 'visible'
    document.getElementById('newpassword').style.visibility= 'hidden'
    document.getElementById('password-ok').style.visibility = 'hidden'
    document.getElementById('password-back').style.visibility = 'hidden'
}
document.getElementById('view-password').onclick = ()=>{
    if(document.getElementById('the-eye').classList.contains('fa-eye-slash')){
        document.getElementById('password').style.visibility = 'visible'
        document.getElementById('password').innerText = userdetails['password']
        document.getElementById('the-eye').classList.remove('fa-eye-slash')
        document.getElementById('the-eye').classList.add('fa-eye')
    }
    else{
        document.getElementById('password').style.visibility = 'hidden'
        document.getElementById('the-eye').classList.remove('fa-eye')
        document.getElementById('the-eye').classList.add('fa-eye-slash')
    }
}
document.getElementById('about-lbl').onclick = ()=>{
    document.getElementById('about-window').style.visibility ='visible'
    document.getElementById('blank').style.visibility = 'visible'
    abtwind=1
}
document.getElementById('close-about-window').onclick = ()=>{
    document.getElementById('about-window').style.visibility='hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    abtwind=0
}

function displaySearchResults(){
    let filenamekeys = Object.keys(searchresults)
    for(let i=0;i<Math.min(8,filenamekeys.length);i++){
        searchresultsshowing=1
        let  p =document.createElement('label')
        p.innerText = searchresults[filenamekeys[i]]['name']+' in '+ searchresults[filenamekeys[i]]['pathtoshow']
        let uniqu = searchresults[filenamekeys[i]]['path']+'!!'+searchresults[filenamekeys[i]]['name']
        p.id=uniqu;
        searchids.push(uniqu)
        searchredirest[uniqu]={'type':searchresults[filenamekeys[i]]['type'],'name':searchresults[filenamekeys[i]]['name'],'path':searchresults[filenamekeys[i]]['path']}
        p.addEventListener('click',(e)=>{
            if(searchredirest[e.target.id]['type'] == 'file'){
                let xhr = new XMLHttpRequest()
                let data;
                xhr.onreadystatechange = function() {
                    if(xhr.readyState==4) {
                        data = this.responseText
                        document.getElementById('information').innerText = data
                        document.getElementById('file-name-opened').innerText = searchredirest[e.target.id]['name']
                        document.getElementById('editor-window').style.visibility = 'visible'
                        document.getElementById('blank').style.visibility = 'visible'
                        ew = 1
                        clearSearchResutls()
                        document.getElementById('search').value = ''
                    }
                }
                xhr.onerror = function (){
                    displaypopup('No network connection:(')
                }
                xhr.open('GET',`http://localhost:4000/loadfile?filename=${searchredirest[e.target.id]['name']}&token=${searchredirest[e.target.id]['path']}&cwdstring=${e.target.id}`)
                xhr.send()
            }
            else if(searchredirest[e.target.id]['type'] == 'image'){
                document.getElementById('photo-data').src = searchredirest[e.target.id]['path']
                document.getElementById('photo-name').innerText = searchredirest[e.target.id]['name']
                document.getElementById('photo-window').style.visibility = 'visible'
                document.getElementById('blank').style.visibility = 'visible'
                pw = 1
                clearSearchResutls()
                document.getElementById('search').value = ''
            }
            else{
                console.log('its a dir')
            }
        })
        document.getElementById('search-results').appendChild(p)
    }
    document.getElementById('search-results').style.visibility = 'visible'
}

function initCollections() {

    function temp(res){
        for (let i = 0; i < res.length; i++) {
            CollectionList.push(res[i])
            let ele = document.createElement('label')
            ele.className = 'col-listitems'
            ele.id=res[i]+'p'
            let icon = document.createElement('i')
            icon.className = 'fal fa-minus cursor'
            icon.style.marginRight = '10px'
            icon.id = res[i]+'rm'
            icon.style.color='#4A148C'
            icon.onclick = (e)=>{
                let xhr = new XMLHttpRequest()
                xhr.onreadystatechange = function () {
                    if(xhr.readyState==4){
                        document.getElementById('usercollec').removeChild(document.getElementById(e.target.id.slice(0, -2)+'p'))
                    }
                }
                xhr.open('POST',`http://localhost:4000/removecol`)
                xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
                xhr.send(JSON.stringify({'name':e.target.id.slice(0,-2),'token':userdetails['token']}))
            }
            ele.appendChild(icon)
            let lbl = document.createElement('label')
            lbl.className = 'cursor'
            lbl.innerText = res[i]
            lbl.id=res[i]
            lbl.onclick = (e)=>{
                cwd = 'ROOT'
                cwdstring = 'ROOT'
                masking='Collections'
                browsehistory = ['collection#'+e.target.id]
                curcolname = e.target.id
                document.getElementById(curmenu).style.backgroundColor='whitesmoke'
                initmenu()
                cleanUp()
                getCollecFiles()
            }
            ele.appendChild(lbl)
            document.getElementById('usercollec').appendChild(ele)
        }
    }

    if(userdetails['token'].length!=0) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let res = JSON.parse(this.response)
                res = res[0];
                temp(res)

            }
        }
        xhr.onerror = function (){
            if (cookieExist('getcollection')){
                temp(JSON.parse(getCookie('getcollection')))
            }
            else
                displaypopup('No network connection:(')
        }
        xhr.open('GET', `http://localhost:4000/getcollection?token=${userdetails['token']}`)
        xhr.send()
    }
}
function inituserdetails() {
    let cookies = document.cookie
    cookies  = cookies.split(';')
    for(let i=0;i<cookies.length;i++){
        let v = cookies[i].split('=')
        let key =v[0].replaceAll(' ','')
        if(key == 'loggedin') userdetails['loggedin'] = 1
        if(key == 'token') userdetails['token'] = v[1]
        if(key == 'name') userdetails['name'] = v[1]
        if(key == 'email') userdetails['email'] = v[1]
        if(key=='password') userdetails['password'] = v[1]
    }
    if(userdetails['token'] ==0 || userdetails['name']==0){
        location.replace('http://localhost:4000/loginpage')
    }
    document.getElementById('username').innerText=userdetails['name']
    initspace()
}

document.getElementById('logout-lbl').onclick=logout
function logout() {
    userdetails['loggedin'] =0
    userdetails['name'] =0
    userdetails['token'] = 0
    cwd = 'ROOT'
    let d = new Date()
    d.setFullYear(d.getFullYear()-1)
    document.cookie=`loggedin=;expires=${d};path=/`
    document.cookie = `name=;expires=${d};path=/`;
    document.cookie = `token=;expires=${d};path=/`
    document.cookie = `email=;expires=${d};path=/`
    document.cookie = `password=;expires=${d};path=/`
    location.replace('http://localhost:4000/loginpage')
    let xhr= new XMLHttpRequest()
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4) {
    //         userdetails['loggedin'] =0
    //         userdetails['name'] =0
    //         userdetails['token'] = 0
    //         cwd = 'ROOT'
    //         let d = new Date()
    //         d.setFullYear(d.getFullYear()-1)
    //         document.cookie=`loggedin=;expires=${d};path=/mydrive`
    //         document.cookie = `name=;expires=${d};path=/mydrive`;
    //         document.cookie = `token=;expires=${d};path=/mydrive`
    //         document.cookie = `email=;expires=${d};path=/mydrive`
    //         document.cookie = `password=;expires=${d};path=/mydrive`
    //         location.replace('http://localhost:4000/loginpage')
    //     }
    // }
    xhr.open('GET',`http://localhost:4000/logout?token=${userdetails['token']}`)
    xhr.send()
}
document.getElementById('add-people').onclick=()=>{
    document.getElementById('add-people-window').style.visibility ='visible'
    addpeople=1
    document.getElementById('blank').style.visibility = 'visible'

}
let emails=[]
document.getElementById('add-plus').onclick = ()=>{
    let email = document.getElementById('add-email-input').value
    if(email.length!=0){
        let ele = document.createElement('label')
        ele.innerText = email
        ele.className='people-added-var'
        let fa = document.createElement('i');fa.className='fal fa-user'
        fa.style.marginRight='10px'
        ele.id=Math.floor(Math.random()*1000).toString()+'rnd'
        emails.push(ele.id)
        ele.style.color='black'
        ele.onclick = (e)=>{
            peopleselct = e.target.id
            if(document.getElementById(peopleselct).style.color=='black'){
                document.getElementById(peopleselct).style.color = 'white'
                document.getElementById(peopleselct).style.backgroundColor= 'black'
            }
            else{
                document.getElementById(peopleselct).style.color='black'
                document.getElementById(peopleselct).style.backgroundColor='whitesmoke'
            }
        }
        ele.prepend(fa)
        document.getElementById('people-added').appendChild(ele)
        document.getElementById('add-email-input').value = ''
    }
}

document.getElementById('remove-people').onclick = ()=>{
    if(peopleselct!=0){
        document.getElementById('people-added').removeChild(document.getElementById(peopleselct))
        peopleselct=0
    }
}
document.getElementById('add-people-confirm').onclick = ()=>{
    let email =[]
    for(let i=0;i<emails.length;i++){
        email.push(document.getElementById(emails[i]).innerText)
    }
    for(let i=0;i<emails.length;i++){
        document.getElementById('people-added').removeChild(document.getElementById(emails[i]))
    }
    let xhr= new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
            document.getElementById('add-people-window').style.visibility = 'hidden'
            document.getElementById('blank').style.visibility = 'hidden'
            peopleselct = 0
            addpeople=0
            displaypopup(`Poeple have been added`)
        }
    }
    xhr.onerror = function(){
        displaypopup('No Network Connection!:(')
    }
    xhr.open('POST',`http://localhost:4000/addpeople?token=${userdetails['token']}`)
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify({'0':email}))

}
document.getElementById('add-people-cancel').onclick = ()=>{
    document.getElementById('add-people-window').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    peopleselct = 0
    addpeople=0
    for(let i=0;i<emails.length;i++){
        document.getElementById('people-added').removeChild(document.getElementById(emails[i]))
    }
}

function cleanUp(){
    let cont = document.createElement('div');cont.id='container-lvl2'
    document.getElementById('container').removeChild(document.getElementById('container-lvl2'))
    document.getElementById('container').appendChild(cont)
    rndids = {}
    Filerecieved = {}
    rndlist=[]
    if(contextmenuopened){
        contextmenuopened=0
        document.getElementById('right-click-contextmenu').style.visibility='hidden'
    }
    currentselected = 0
    fullscreen = 0
    info={}
}

//sideline event listenr
document.getElementById('my-home').onclick = ()=>{
    if(collection){
        document.getElementById('collection-list').style.display='none'
        collection=0
    }
    cwd = 'ROOT'
    cwdstring = 'ROOT'
    masking='Home'
    document.getElementById(curmenu).style.backgroundColor='white'
    document.getElementById(curmenu).style.color ='#4A148C'
    curmenu = 'my-home'
    initmenu()
    browsehistory = ['ROOT']
    cleanUp()
    getFiles()
}
document.getElementById('favorites').onclick = ()=>{
    if(collection){
        document.getElementById('collection-list').style.display='none'
        collection=0
    }
    cwd = 'ROOT'
    cwdstring = 'ROOT'
    masking='Favorites'
    browsehistory = ['Favorites']
    document.getElementById(curmenu).style.backgroundColor='white'
    document.getElementById(curmenu).style.color ='#4A148C'
    curmenu = 'favorites'
    initmenu()
    cleanUp()
    getFavfiles()
}
document.getElementById('share').onclick = ()=>{
    if(collection){
        document.getElementById('collection-list').style.display='none'
        collection=0
    }
    getnewshares(1)
    cwd = 'ROOT'
    cwdstring = 'ROOT'
    masking='Shared with me'
    document.getElementById('shareno').innerText ='0'
    document.getElementById('shareno').style.visibility='hidden'
    browsehistory = ['Shared with me']
    document.getElementById(curmenu).style.backgroundColor='white'
    document.getElementById(curmenu).style.color ='#4A148C'
    curmenu = 'share'
    initmenu()
    cleanUp()
    getsharefiles()
}


document.getElementById('bin').onclick = (e)=>{
    if(collection){
        document.getElementById('collection-list').style.display='none'
        collection=0
    }
    cwd = 'ROOT'
    cwdstring = 'ROOT'
    masking='Bin'
    browsehistory = ['Bin']
    document.getElementById(curmenu).style.backgroundColor='white'
    document.getElementById(curmenu).style.color ='#4A148C'
    curmenu = e.target.id
    initmenu()
    cleanUp()
    getBinFiles()
}
document.getElementById('files-shared').onclick = (e)=>{
    if(collection){
        document.getElementById('collection-list').style.display='none'
        collection=0
    }
    cwd = 'ROOT'
    cwdstring = 'ROOT'
    masking='Files-Shared'
    browsehistory = ['Files-Shared']
    document.getElementById(curmenu).style.backgroundColor='white'
    document.getElementById(curmenu).style.color ='#4A148C'
    curmenu = e.target.id
    initmenu()
    cleanUp()
    getfilesshared()
}

document.getElementById('collection').onclick = (e)=>{
    if(collection){
        document.getElementById('collection-list').style.display='none'
        collection=0
    }
    else{
        document.getElementById('collection-list').style.display='block'
        collection=1
        document.getElementById(curmenu).style.backgroundColor='white'
        document.getElementById(curmenu).style.color ='#4A148C'
        curmenu = e.target.id
        initmenu()
    }

}

document.getElementById('addnewcoll').onclick = ()=>{
    cw=1
    document.getElementById('create-collection-window').style.visibility='visible'
    document.getElementById('blank').style.visibility = 'visible'
}

document.getElementById('create-collection-confirm').onclick = () =>{
    let name = document.getElementById('name-coll').value
    document.getElementById('name-coll').value=''
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            displaypopup(`Collection '${name}' created`)
            document.getElementById('create-collection-window').style.visibility= 'hidden'
            document.getElementById('blank').style.visibility = 'hidden'
            cw=0
            CollectionList.push(name)
            let ele = document.createElement('label')
            ele.className = 'col-listitems'
            ele.id=name+'p'
            let icon = document.createElement('i')
            icon.className = 'fal fa-minus cursor'
            icon.style.marginRight = '10px'
            icon.id = name+'rm'
            icon.style.color='#4A148C'
            icon.onclick = (e)=>{
                let xhr = new XMLHttpRequest()
                xhr.onreadystatechange = function () {
                    if(xhr.readyState==4){
                        document.getElementById('usercollec').removeChild(document.getElementById(e.target.id.slice(0, -2)+'p'))
                    }
                }
                xhr.open('POST',`http://localhost:4000/removecol`)
                xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
                xhr.send(JSON.stringify({'name':e.target.id.slice(0,-2),'token':userdetails['token']}))
            }
            ele.appendChild(icon)
            let lbl = document.createElement('label')
            lbl.className = 'cursor'
            lbl.innerText = name
            lbl.id=name
            lbl.onclick = (e)=>{
                cwd = 'ROOT'
                cwdstring = 'ROOT'
                masking='Collections'
                browsehistory = ['collection#'+e.target.id]
                curcolname = e.target.id
                document.getElementById(curmenu).style.backgroundColor='whitesmoke'
                initmenu()
                cleanUp()
                getCollecFiles()
            }
            ele.appendChild(lbl)
            document.getElementById('usercollec').appendChild(ele)
        }
    }
    xhr.onerror = function (){
        displaypopup('No Network Connection!:(')
    }
    xhr.open('POST',`http://localhost:4000/createcollection?name=${name}&token=${userdetails['token']}`)
    xhr.send()
}
document.getElementById('create-collection-cancel').onclick = ()=>{
    document.getElementById('create-collection-window').style.visibility= 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    cw=0
}

//add new folder the plus symblo onw
document.getElementById('add-new').onclick = ()=>{
    if(neww){
        neww=0
        document.getElementById('add-new-child').style.visibility = 'hidden'
    }
    else{
        setTimeout(()=>{
            neww=1
            document.getElementById('add-new-child').style.visibility = 'visible'
        },50)
    }
}

//here comes the windows for the above opertaion
document.getElementById('upload-file').onclick = ()=>{
    if(fuw) {
        document.getElementById('upload-file-input-window').style.visibility = 'hidden'
        fuw = 0
        document.getElementById('blank').style.visibility = 'hidden'
    }
    else{
        document.getElementById('upload-file-input-window').style.visibility = 'visible'
        fuw=1
        document.getElementById('blank').style.visibility = 'visible'
    }
}
document.getElementById('upload-image').onclick = ()=>{
    if(iuw) {
        document.getElementById('upload-image-input-window').style.visibility = 'hidden'
        iuw = 0
        document.getElementById('blank').style.visibility = 'hidden'
    }
    else{
        document.getElementById('upload-image-input-window').style.visibility = 'visible'
        iuw=1
        document.getElementById('blank').style.visibility = 'visible'
    }
}
document.getElementById('cancel-file').onclick= ()=>{
    document.getElementById('upload-file-input-window').style.visibility = 'hidden'
    fuw = 0
    document.getElementById('blank').style.visibility = 'hidden'
    let filesSelectedkeys = Object.keys(filesSelected)
    for(let i=0; i<filesSelectedkeys.length; i++)
        document.getElementById('files-selected').removeChild(document.getElementById(filesSelectedkeys[i]).parentElement)
    filesSelected = {}
}
document.getElementById('cancel-image').onclick= ()=>{
    document.getElementById('upload-image-input-window').style.visibility = 'hidden'
    iuw = 0
    document.getElementById('blank').style.visibility = 'hidden'
    let imagesSelectedkeys = Object.keys(imagesSelected)
    for(let i=0;i<imagesSelectedkeys.length;i++)
        document.getElementById('images-selected').removeChild(document.getElementById(imagesSelectedkeys[i]).parentElement)
    imagesSelected = {}
}
//fsdhfjsdnfdksfkdsjnfk
document.getElementById('add-file').onclick = ()=> {
    document.getElementById('file-input').click()
}
document.getElementById('file-input').onchange = (e)=>{
    for(let i of Object.keys(e.target.files)){
        filesSelected[e.target.files[i]['names']]= e.target.files[i]
        displayselection(e.target.files[i]['name'],'file')
    }
}
function displayselection(object,x){
    let ele = document.createElement('div')
    let lbl = document.createElement('label')
    lbl.innerText = object
    lbl.style.textOverflow = 'ellipsis'
    lbl.style.whiteSpace = 'nowrap'
    lbl.style.overflow = 'hidden'
    lbl.style.fontSize = 'small'
    ele.appendChild(lbl)
    ele.className='fileselectedobj'
    let fa = document.createElement('i')
    fa.id = object
    fa.style.color = '#AA00FF'
    fa.className = 'fal fa-minus cursor'
    fa.style.marginLeft = '10px'
    ele.appendChild(fa)
    let t = 'files-selected'
    if(x == 'image')
        t = 'images-selected'
    fa.onclick = (e)=>{
        document.getElementById(t).removeChild(document.getElementById(e.target.id).parentElement)
        delete filesSelected[e.target.id]
        delete imagesSelected[e.target.id]
    }
    document.getElementById(t).appendChild(ele)
}

//here comes the final process of uploadingfils
document.getElementById('file-upload-confirm').onclick = ()=>{
    let filesSelectedkeys=Object.keys(filesSelected)
    for(let i=0;i<filesSelectedkeys.length;i++){
        let formdata = new FormData()
        formdata.append('files',filesSelected[filesSelectedkeys[i]])
        fetch(`http://localhost:4000/uploadfile?token=${userdetails['token']}&cwd=${cwd}&lastmod=${filesSelected[filesSelectedkeys[i]].lastModifiedDate.toString().slice(0,24)}&cwdstring=${cwdstring}`,{method:'POST',body:formdata})
            .then(res=>{console.log(res)})
    }
    for(let i=0;i<filesSelectedkeys.length;i++){
        if(view == 0) {
            let rnd = createFilelvlElement({
                'type': 'file',
                'size': filesSelected[filesSelectedkeys[i]].size,
                'name': filesSelected[filesSelectedkeys[i]].name,
                'lastmod': filesSelected[filesSelectedkeys[i]].lastModifiedDate.toString().slice(0, 24),
                'mimetype': filesSelected[filesSelectedkeys[i]].type,
                'owner': userdetails['token']
            })
            eventListeners(rnd)
        }
        else {
            let rnd = createListlvlElement({
                'type': 'file',
                'size': filesSelected[filesSelectedkeys[i]].size,
                'name': filesSelected[filesSelectedkeys[i]].name,
                'lastmod': filesSelected[filesSelectedkeys[i]].lastModifiedDate.toString().slice(0, 24),
                'mimetype': filesSelected[filesSelectedkeys[i]].type,
                'owner': userdetails['token']
            })
            eventListeners(rnd)
        }
        userdetails['space']+=filesSelected[filesSelectedkeys[i]].size
        document.getElementById('files-selected').removeChild(document.getElementById(filesSelected[filesSelectedkeys[i]]['name']).parentElement)
    }
    displaypopup(`${filesSelectedkeys.length} File${filesSelectedkeys.length==1?'':'s'} uploaded`)
    filesSelected ={}
    displayspace()
    try {
        document.getElementById('container-lvl2').removeChild(document.getElementById('nothing'))
    }
    catch (e) {}
    document.getElementById('upload-file-input-window').style.visibility = 'hidden';
    fuw = 0
    document.getElementById('blank').style.visibility = 'hidden'
}

//fsdkjhfjdsfnkjds

document.getElementById('add-image').onclick = ()=>{
    document.getElementById('image-input').click()

}
document.getElementById('image-input').onchange = (e)=>{
    for(let i of Object.keys(e.target.files)){
        imagesSelected[e.target.files[i]['name']]=e.target.files[i]
        displayselection(e.target.files[i]['name'],'image')
    }
}
document.getElementById('image-upload-confirm').onclick = ()=>{
    let imagesSelectedkeys=Object.keys(imagesSelected)
    for(let i=0;i<imagesSelectedkeys.length;i++){
        let formdata = new FormData()
        formdata.append('files',imagesSelected[imagesSelectedkeys[i]])
        fetch(`http://localhost:4000/uploadimage?token=${userdetails['token']}&cwdstring=${cwdstring}&lastmod=${imagesSelected[imagesSelectedkeys[i]].lastModifiedDate.toString().slice(0,24)}&cwdstring=${cwdstring}`,{method:'POST',body:formdata})
           .then(res=>console.log(res))
    }
    let filename;
    setTimeout(()=>{
        //let imagesSelectedkeys = Object.keys(imagesSelected)
        for(let i=0;i<imagesSelectedkeys.length;i++){
            filename=imagesSelected[imagesSelectedkeys[i]].name
            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    let source=this.responseText;
                    let ss = source.split('/')
                    ss = ss[ss.length-1]
                    let type = 'image'
                    if(imagesSelected[imagesSelectedkeys[i]]['type'].indexOf('video') !=-1)
                        type='video'
                    else if(imagesSelected[imagesSelectedkeys[i]]['type'].indexOf('audio')!=-1)
                        type='audio'
                    if(view == 1){
                        let rnd = createListlvlElement({
                            'type': type,
                            'size': imagesSelected[imagesSelectedkeys[i]].size,
                            'src': source,
                            'name': ss,
                            'lastmod': imagesSelected[imagesSelectedkeys[i]].lastModifiedDate.toString().slice(0, 24),
                            'mimetype': imagesSelected[imagesSelectedkeys[i]].type
                        })
                        eventListeners(1, rnd)
                    }
                    else {
                        if(type == 'image') {
                            let rnd = createImagelvlElement({
                                'type': type,
                                'size': imagesSelected[imagesSelectedkeys[i]].size,
                                'src': source,
                                'name': ss,
                                'lastmod': imagesSelected[imagesSelectedkeys[i]].lastModifiedDate.toString().slice(0, 24),
                                'mimetype': imagesSelected[imagesSelectedkeys[i]].type
                            })
                            eventListeners(1, rnd)
                        }
                        else if(type == 'video') {
                            let rnd = createVideolvlElement({
                                'type': type,
                                'size': imagesSelected[imagesSelectedkeys[i]].size,
                                'src': source,
                                'name': ss,
                                'lastmod': imagesSelected[imagesSelectedkeys[i]].lastModifiedDate.toString().slice(0, 24),
                                'mimetype': imagesSelected[imagesSelectedkeys[i]].type
                            })
                            eventListeners(1, rnd)
                        }
                        else if(type =='audio'){
                            let rnd = createAudiolvlElement({
                                'type': type,
                                'size': imagesSelected[imagesSelectedkeys[i]].size,
                                'src': source,
                                'name': ss,
                                'lastmod': imagesSelected[imagesSelectedkeys[i]].lastModifiedDate.toString().slice(0, 24),
                                'mimetype': imagesSelected[imagesSelectedkeys[i]].type
                            })
                            eventListeners(1, rnd)
                        }
                    }
                    userdetails['space']+=imagesSelected[imagesSelectedkeys[i]].size
                    document.getElementById('images-selected').removeChild(document.getElementById(imagesSelected[imagesSelectedkeys[i]]['name']).parentElement)
                }
            }
            xhr.open('GET',`http://localhost:4000/loadimage?filename=${filename}&token=${userdetails['token']}&cwdstring=${cwdstring}`)
            xhr.send()
        }
        setTimeout(()=>{
            displaypopup(`${imagesSelectedkeys.length} File${imagesSelectedkeys.length==1? '':'s'} uploaded`)
            imagesSelected = {}
            displayspace()
        },2000)
        document.getElementById('upload-image-input-window').style.visibility = 'hidden';
        iuw=0
        try {
            document.getElementById('container-lvl2').removeChild(document.getElementById('nothing'))
        }catch (e) {}
        document.getElementById('blank').style.visibility='hidden'
    },500)
}


document.getElementById('create-folder').onclick = ()=>{
    document.getElementById('create-folder-window').style.visibility = 'visible'
    document.getElementById('blank').style.visibility = 'visible'
    document.getElementById('folder-name').focus()
    cfoldwin=1
}
document.getElementById('cancel-folder-confirm').onclick = ()=>{
    document.getElementById('create-folder-window').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('folder-name').value = ''
    cfoldwin=0

}
document.getElementById('create-folder-confirm').onclick = createFolder

function createFolder(){
    let name = document.getElementById('folder-name').value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            let date = this.responseText
            document.getElementById('cancel-folder-confirm').click()
            if(view==0){
                let rnd = createDirlvlElement({'created':date,'name':name,'type':'dir'})
                eventListeners(1,rnd)
            }
            else{
                let rnd = createListlvlElement({'lastmod':date,'name':name,'type':'dir'})
                eventListeners(1,rnd)
            }
            displaypopup(`Folder created`)
            cfoldwin=0
            try {
                document.getElementById('container-lvl2').removeChild(document.getElementById('nothing'))
            }catch (e) {}
        }
    }
    xhr.open('POST',`http://localhost:4000/createfolder?name=${name}&token=${userdetails['token']}&cwd=${cwd}&cwdstring=${cwdstring}`)
    xhr.send()

}

document.getElementById('create-file').onclick = ()=>{
    document.getElementById('create-file-window').style.visibility ='visible'
    cfw=1
    document.getElementById('blank').style.visibility='visible'
    if(currentselected){
        document.getElementById(currentselected).click()
    }
}
document.getElementById('save-file').onclick = ()=>{
    let data = document.getElementById('text-data').value
    let name = document.getElementById('unnamedfile').value
    name = name == '' ? 'unnamedFile'+Math.floor(Math.random()*100).toString()+'.txt': name
    let lastmod = new Date().toString().slice(0,24)
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4){
            document.getElementById('create-file-window').style.visibility = 'hidden'
            document.getElementById('blank').style.visibility='hidden'
            let rnd = createFilelvlElement({'type':'file','mimetype':'plain/text','lastmod':lastmod,
            'size':data.length,'owner':userdetails['token'],'name':name})
            eventListeners(1,rnd)
            userdetails['space']+=data.length
            document.getElementById('unnamedfile').value=''
            document.getElementById('text-data').value=''
            displaypopup('File created')
            cfw=0
            displayspace()
            try {
                document.getElementById('container-lvl2').removeChild(document.getElementById('nothing'))
            }catch (e) {}
        }
    }
    xhr.open('POST',`http://localhost:4000/createfile?token=${userdetails['token']}&data=${data}&name=${name}&lastmod=${lastmod}&cwdstring=${cwdstring}&size=${data.length}`)
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify({'token':userdetails['token'],'data':data,'name':name,'lastmod':lastmod,'cwdstring':cwdstring,'size':data.length}))
}
document.getElementById('save-cancel-file').onclick = ()=>{
    document.getElementById('text-data').value = ''
    document.getElementById('unnamedfile').value =''
    document.getElementById('blank').style.visibility='hidden'
        document.getElementById('create-file-window').style.visibility = 'hidden'
    cfw=0
}

//here is the deletton of file
document.getElementById('delete').onclick=()=>{
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    let xhr = new XMLHttpRequest()
    let url;console.log(rndids[currentselected]['type'])
    if(rndids[currentselected]['type'] == 'file')
        url = `http://localhost:4000/deletefile?filename=${rndids[currentselected]['name']}&token=${info[currentselected]['owner']}&cwdstring=${cwdstring}`
    else if(rndids[currentselected]['type'] == 'image' || rndids[currentselected]['type'] == 'video' || rndids[currentselected]['type'] == 'audio')
        url = `http://localhost:4000/deleteimage?filename=${rndids[currentselected]['name']}&token=${info[currentselected]['owner']}&cwdstring=${cwdstring}`
    else
        url = `http://localhost:4000/deletefolder?filename=${rndids[currentselected]['name']}&token=${userdetails['token']}&cwd=${cwd}&cwdstring=${cwdstring}`
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            //remove the element from dom
            displaypopup(`'${rndids[currentselected]['name']}' deleted`)
            delete rndids[currentselected]
            delete info[currentselected]
            delete rndlist[rndlist.indexOf(currentselected)]
            document.getElementById('container-lvl2').removeChild(document.getElementById(currentselected).parentElement)
            currentselected = 0
            if(Object.keys(rndids).length==0) {
                let ele = document.createElement('label')
                ele.innerText = 'Nothing here'
                ele.id ='nothing'
                ele.style.fontSize = 'large'
                ele.style.margin = 'auto'
                document.getElementById('container-lvl2').appendChild(ele)
            }
        }
    }
    xhr.open('DELETE',url)
    xhr.send()
}
document.getElementById('rename').onclick = ()=>{
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'visible'
    document.getElementById('renamefile-window').style.visibility = 'visible'
    document.getElementById('newfilename').focus()
    document.getElementById('newfilename').value = rndids[currentselected]['name']
    rw=1
}
document.getElementById('rename-confirm').onclick = ()=>{
    let newfilename = document.getElementById('newfilename').value
    let xhr = new XMLHttpRequest()
    let url = `http://localhost:4000/updatefilename?oldname=${rndids[currentselected]['name']}&newname=${newfilename}&token=${userdetails['token']}&cwdstring=${cwdstring}`
    if(rndids[currentselected]['type'] == 'image')
        url = `http://localhost:4000/updateimagename?oldname=${rndids[currentselected]['name']}&newname=${newfilename}&token=${userdetails['token']}&cwdstring=${cwdstring}`
    else if(rndids[currentselected]['type'] == 'dir')
        url = `http://localhost:4000/updatefoldername?oldname=${rndids[currentselected]['name']}&newname=${newfilename}&token=${userdetails['token']}&cwdstring=${cwdstring}`
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            displaypopup(`file '${rndids[currentselected]['name']}' renamed`)
            document.getElementById(currentselected).previousElementSibling.innerText = newfilename
            document.getElementById('blank').style.visibility = 'hidden'
            document.getElementById('newfilename').value = ''
            document.getElementById('renamefile-window').style.visibility ='hidden'
            info[currentselected]['name'] = newfilename
            rndids[currentselected]['name']=newfilename
            rw=0
        }
    }
    xhr.open('PUT',url)
    xhr.send()

}
document.getElementById('rename-cancel').onclick = ()=>{
    document.getElementById('newfilename').value = ''
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('renamefile-window').style.visibility ='hidden'
    rw=0
}

document.getElementById('download').onclick = ()=>{
    let file=rndids[currentselected]['name']
    window.location.assign(`http://localhost:4000/download?name=${file}&token=${userdetails['token']}&type=${info[currentselected]['type']}`)
    document.getElementById(currentselected).click()
    currentselected=0
}



document.getElementById('details').onclick = displaydetail

function displaydetail(){
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    let information = info[currentselected]
    if(information['name'] != undefined)
        document.getElementById('name').innerText = information['name']
    else
        document.getElementById('name').innerText ='Unknown'

    if(information['mimetype'] != undefined)
        document.getElementById('type').innerText = information['mimetype']
    else
        document.getElementById('type').innerText = 'Unknown'
    if(information['size'] != undefined){
        let s = information['size'].toString()
        let a
        //further modification
        if(s.length> 6){
            a = (parseFloat(s)/1000000).toString().slice(0,4)+' MB'
        }
        else if(s.length >= 4)
            a = (parseFloat(s)/1000).toString().slice(0,4)+' kB'
        else
            a = s+' b'
        document.getElementById('size').innerText = a

    }
    else
        document.getElementById('size').innerText = 'Unknown'
    if(information['lastmod'] != undefined)
        document.getElementById('lastmod').innerText = information['lastmod']
    else{
        if(information['created']!=undefined)
            document.getElementById('lastmod').innerText = information['created']
        else
            document.getElementById('lastmod').innerText = 'Unknown'
    }
    if(information['src'] != undefined)
        document.getElementById('src').innerText = information['src']
    else
        document.getElementById('src').innerText = 'Unknown'
    document.getElementById('blank').style.visibility = 'visible'

    document.getElementById('details-window').style.visibility = 'visible'
    document.getElementById('blank').style.visibility = 'visible'

}

document.getElementById('close-detail-window').onclick = ()=>{
    document.getElementById('name').innerText =''
    document.getElementById('type').innerText = ''
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('size').innerText = ''
    document.getElementById('lastmod').innerText = ''
    document.getElementById('src').innerText = ''
    document.getElementById('details-window').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    dw=0
}


document.getElementById('fav').onclick = ()=>{
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    let type = rndids[currentselected]['type']
    let filename=rndids[currentselected]['name']
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            displaypopup(`'${filename}' added to Favorites`)
        }
    }
    xhr.open('POST',`http://localhost:4000/addfav?token=${userdetails['token']}&cwdstring=${cwdstring}&filename=${filename}&type=${type}`)
    xhr.send()
}

document.getElementById('add-to').onclick = ()=>{
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    for(let i=0;i<CollectionList.length;i++){
        let ele = document.createElement('label')
        ele.innerText = CollectionList[i]+' +'
        ele.id=CollectionList[i]+'abc';
        ele.className='collect-var'
        ele.onclick = (e)=>{
            let text = document.getElementById(e.target.id).innerText
            if(collectiontoadd.split('!!').indexOf(e.target.id)==-1){
                collectiontoadd+=(e.target.id+'!!')
                document.getElementById(e.target.id).style.backgroundColor='#14070e'
                document.getElementById(e.target.id).style.color = 'white'
                document.getElementById(e.target.id).innerText = text.substr(0,text.length-2)+' -'
            }
            else{
                let collectiontoaddsplit = collectiontoadd.split('!!')
                collectiontoaddsplit = collectiontoaddsplit.slice(0,collectiontoaddsplit.length-1)
                collectiontoadd = collectiontoaddsplit.slice(0,collectiontoaddsplit.indexOf(e.target.id))
                    .concat(collectiontoaddsplit.slice(collectiontoaddsplit.indexOf(e.target.id)+1,collectiontoaddsplit.length-1))
                    .join('!!')
                document.getElementById(e.target.id).style.backgroundColor='whitesmoke'
                document.getElementById(e.target.id).style.color = 'black'
                document.getElementById(e.target.id).innerText = text.substr(0,text.length-2)+' +'
            }

        }
        document.getElementById('collect-var').appendChild(ele)
    }
    document.getElementById('display-collection').style.visibility = 'visible'
    document.getElementById('blank').style.visibility = 'visible'
    addc=1
}
document.getElementById('add-confirm').onclick = ()=>{
    let cname = collectiontoadd;
    let name = rndids[currentselected]['name']
    let type=rndids[currentselected]['type']
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState== 4 && xhr.status==200){
            displaypopup(`'${name}' added to collection`)
            addc=0
            collectiontoadd=''
            for(let i=0;i<CollectionList.length;i++){
                document.getElementById('collect-var').removeChild(document.getElementById(CollectionList[i]+'abc'))
            }
            document.getElementById('display-collection').style.visibility ='hidden'
            document.getElementById('blank').style.visibility = 'hidden'
        }
    }
    xhr.open('POST',`http://localhost:4000/addtocollection?cname=${cname}&type=${type}&name=${name}&token=${userdetails['token']}&cwdstring=${cwdstring}`)
    xhr.send()
}
document.getElementById('cancel-confirm').onclick = ()=>{
    addc=0
    document.getElementById('display-collection').style.visibility='hidden'
    document.getElementById('blank').style.visibility = 'hidden'
}

document.getElementById('sharethis').onclick = ()=>{
    share=1
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            peopleRecieved = JSON.parse(this.response)
            peopleRecieved = peopleRecieved['0']
            peopleRecieved.forEach(ele => {
                let opt = document.createElement('option')
                opt.value = ele
                opt.innerText=ele
                opt.className='people-people'
                document.getElementById('private-person-input').appendChild(opt)
            })
            peopleRecieved={}
            document.getElementById('share-window').style.visibility='visible'
            document.getElementById('blank').style.visibility = 'visible'
        }
    }
    xhr.open('GET',`http://localhost:4000/getpeople?token=${userdetails['token']}`)
    xhr.send()

}
document.getElementById('share-cancel').onclick = ()=>{
    share=0
    document.getElementById('share-window').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    let ele = document.getElementsByClassName('people-people')
    for(let i=0;i<ele.length;i++){
        document.getElementById('private-person-input').removeChild(ele[i])
    }
}
document.getElementById('add-from-share').onclick = ()=>{
    share=0
    document.getElementById('share-window').style.visibility= 'hidden'
    document.getElementById('add-people-window').style.visibility= 'visible'
    addpeople=1
}

document.getElementById('share-ok').onclick = shareFile

function shareFile(){
    let select = document.getElementById('public-private-select').value
    let email = document.getElementById('private-person-input').value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4 && xhr.status==200){
            if(this.responseText == 'error'){
                displaypopup(`Folders cannot be shared at the moment`)
            }
            else{
                displaypopup('File shared')
            }
            document.getElementById('share-window').style.visibility = 'hidden'
            document.getElementById('private-person-input').value=''
            document.getElementById('public-private-select').value='share-public'
            document.getElementById('blank').style.visibility = 'hidden'
            let ele = document.getElementsByClassName('people-people')
            for(let i=0;i<ele.length;i++){
                document.getElementById('private-person-input').removeChild(ele[i])
            }
        }
    }
    xhr.open('POST',`http://localhost:4000/sharefile?select=${select}&email=${email}&token=${userdetails['token']}&cwdstring=${cwdstring}`)
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify(info[currentselected]))
}

document.getElementById('cut').onclick = ()=>{
    displaypopup(`cut`)
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    status = 1
    oldcwdstring = cwdstring
    selectedFileToTransfer=rndids[currentselected]['name']
    selectedFileType = rndids[currentselected]['type']
}

document.getElementById('copy').onclick = ()=>{
    displaypopup(`'${rndids[currentselected]['name']}' copied`)
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    status=0
    selectedFileToTransfer=rndids[currentselected]['name']
    selectedFileType = rndids[currentselected]['type']
    oldcwdstring = cwdstring
}


document.getElementById('paste').onclick = ()=>{
    document.getElementById('right-click-contextmenu').style.visibility = 'hidden'
    let filename=selectedFileToTransfer || ''
    if(filename.length!=0) {
        let type = selectedFileType
        newcwdstring = cwdstring
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4 && xhr.status==200){
                if(status==1){
                    displaypopup(`'${filename}' moved`)
                }
                else{
                    displaypopup(`'${filename}' copied`)
                }
                cleanUp()
                getFiles()
            }
        }
        xhr.open('POST', `http://localhost:4000/transfer?oldcwdstring=${oldcwdstring}&newcwdstring=${newcwdstring}&token=${userdetails['token']}&status=${status}&type=${type}&filename=${filename}`)
        xhr.send()
    }

}
document.getElementById('close-editor-window').onclick = ()=>{
    document.getElementById('editor-window').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('information').innerText = ''
    document.getElementById('file-name-opened').innerText = ''
    ew=0
    filedblclicked=0
}
document.getElementById('close-photo-window').onclick = ()=>{
    document.getElementById('photo-window').style.visibility = 'hidden'
    document.getElementById('blank').style.visibility = 'hidden'
    document.getElementById('photo-data').src = '#'
    document.getElementById('photo-name').innerText = ''
    pw=0
    if(fullscreen == 1){
        document.getElementById('full-screen').click()
    }

}
document.getElementById('full-screen').onclick = ()=>{
    let ele=document.getElementById('photo-window')
    if(fullscreen){
        fullscreen = 0
        ele.style.height = '80%'
        ele.style.width = '80%'
        ele.style.top = '10%'
        ele.style.left='15%'
        document.getElementById('full-screen').innerText = 'Full Screen'

    }
    else{
        fullscreen=1
        ele.style.height = '100%'
        ele.style.width = '100%'
        ele.style.top = '0'
        ele.style.left='0'
        document.getElementById('full-screen').innerText = 'Exit Full Screen'

    }
}

document.getElementById('close-video').onclick = ()=>{
    vw=0;pr=1
    document.getElementById('video-window').style.visibility='hidden'
    document.getElementById('video-data').src=''
    document.getElementById('blank').style.visibility = 'hidden'
}
document.getElementById('close-audio').onclick = ()=>{
    aw=0;pr=1
    document.getElementById('audio-window').style.visibility='hidden'
    document.getElementById('audio-data').src=''
    document.getElementById('blank').style.visibility = 'hidden'
}

document.getElementById('video-backward').onclick = ()=>{
    let y = document.getElementById('video-data').currentTime
    y-=10
    if(y<0)
        y = 0
    document.getElementById('video-data').currentTime=y
}
document.getElementById('video-forward').onclick = ()=>{
    let x = document.getElementById('video-data').duration
    let y = document.getElementById('video-data').currentTime
    y+=10
    if(y>x)
        y = x
    document.getElementById('video-data').currentTime=y
}
document.getElementById('video-plus').onclick = ()=>{
    pr+=0.5
    document.getElementById('video-data').playbackRate = pr
    document.getElementById('video-pr').innerText = pr
}
document.getElementById('video-minus').onclick = ()=>{
    pr-=0.5
    if(pr<0.5)
        pr=0.5
    document.getElementById('video-data').playbackRate = pr
    document.getElementById('video-pr').innerText = pr
}


document.getElementById('audio-backward').onclick = ()=>{
    let y = document.getElementById('audio-data').currentTime
    y-=10
    if(y<0)
        y = 0
    document.getElementById('audio-data').currentTime=y
}
document.getElementById('audio-forward').onclick = ()=> {
    let x = document.getElementById('audio-data').duration
    let y = document.getElementById('audio-data').currentTime
    y += 10
    if (y > x)
        y = x
    document.getElementById('audio-data').currentTime = y
}
document.getElementById('audio-plus').onclick = ()=>{
    pr+=0.5
    document.getElementById('audio-data').playbackRate = pr
    document.getElementById('audio-pr').innerText = pr
}
document.getElementById('audio-minus').onclick = ()=>{
    pr-=0.5
    if(pr<0.5)
        pr=0.5
    document.getElementById('audio-data').playbackRate = pr
    document.getElementById('audio-pr').innerText = pr
}
document.getElementById('edit-file').onclick =()=>{
    if(editmode){
        let div = document.createElement('div')
        div.id='information'
        editmode=0
        let value = document.getElementById('information').value
        document.getElementById('edit-file-edit').innerText = 'Edit'
        document.getElementById('editor-window').removeChild(document.getElementById('information'))
        document.getElementById('editor-window').appendChild(div)
        document.getElementById('information').innerText = value
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4 && xhr.status==200){
                let res = JSON.parse(this.response)
                if(res.status){
                    displaypopup(`file '${info[filedblclicked]['name']}' saved`)
                }
                else{
                    displaypopup(`file '${info[filedblclicked]['name']}' cannot be saved`)
                }
            }
        }
        xhr.open('POST',`http://localhost:4000/savefile?token=${userdetails['token']}`)
        xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'val':value,'filename':info[filedblclicked]['name'],'owner':info[filedblclicked]['owner']}))

    }
    else {
        let textarea = document.createElement('textarea')
        textarea.id = 'information'
        editmode=1
        document.getElementById('edit-file-edit').innerText = 'Save'
        document.getElementById('edit-icon').className ='fal fa-save'
        textarea.innerHTML=document.getElementById('information').innerText
        document.getElementById('editor-window').removeChild(document.getElementById('information'))
        document.getElementById('editor-window').appendChild(textarea)
    }
}

//mavigation of the page starts here
document.getElementById('back').onclick = ()=>{
    if(browsehistory.length>1) {
        if (browsehistory[browsehistory.length - 1] != undefined) {
            browsehistory.pop()
            cwd = browsehistory[browsehistory.length - 1]
            if(browsehistory[browsehistory.length-1] == 'Favorites') document.getElementById('favorites').click()
            else if(browsehistory[browsehistory.length-1] == 'collection#'+curcolname) {
                let s = browsehistory[browsehistory.length-1].split('#')
                document.getElementById(s[1]).click()
            }
            else{
                let cwdsplitstring = cwdstring.split('-')
                cwdstring = cwdsplitstring.slice(0, cwdsplitstring.length - 1).join('-')
                document.getElementById(cwdstring).click()
            }
        }
    }
}

function showNav(){
    let abskeys = Object.keys(absoluteids)
    for(let i=0;i<abskeys.length;i++){
        document.getElementById('nav-display').removeChild(document.getElementById(absoluteids[abskeys[i]]))
    }
    absoluteids=[];
    let splitcwdstring = cwdstring.split('-')
    for(let i=0;i<splitcwdstring.length;i++){
        let name = document.createElement('label')
        let j = document.createElement('i')
        let text;
        if(splitcwdstring[i] == 'ROOT')
            text = masking
        else
            text = splitcwdstring[i]
        name.innerText=text
        let nameid=splitcwdstring.slice(0,i+1).join('-')
        name.id=text == masking?'ROOT':nameid
        name.className = 'links'
        j.className='fal fa-chevron-right arrow'
        let rnd= Math.floor(Math.random()*1000).toString()+'abc'
        absoluteids[nameid] = text ==masking?'ROOT':nameid
        rnd = Math.floor(Math.random()*1000).toString()+'abc'
        j.id=rnd
        absoluteids[rnd]=rnd
        name.addEventListener('click',(e)=>{
            cwdstring=e.target.id;//it has the id to where the cut-off must be perfomred
            let cwdstringsplit = cwdstring.split('-')
            cwd = cwdstringsplit[cwdstringsplit.length-1]
            cleanUp();
            getFiles()})
        document.getElementById('nav-display').appendChild(name)
        document.getElementById('nav-display').appendChild(j)
    }

}


function eventListeners(all=1,work=0) {
    let key = Object.keys(rndids)
    if(work != 0){
        key = [work]
    }
    for(let i=0;i<key.length;i++) {
        let id = key[i]
        document.getElementById(id).onclick = (e) => {
            if(selectfile==1){
                addcheck(e.target.id)
            }
            else {
                if (currentselected == 0) {
                    currentselected = e.target.id
                    if(view ==0)
                        document.getElementById(currentselected).parentElement.style.opacity = '0.8'
                    else {
                        document.getElementById(currentselected).parentElement.style.backgroundColor = 'whitesmoke'
                    }
                } else if (currentselected == e.target.id) {
                    if(view ==0)
                        document.getElementById(currentselected).parentElement.style.opacity='1';
                    else{
                        document.getElementById(currentselected).parentElement.style.backgroundColor = 'white'
                    }
                    currentselected = 0

                } else {
                    if(view == 0)
                        document.getElementById(currentselected).parentElement.style.opacity='1';
                    else{
                        document.getElementById(currentselected).parentElement.style.backgroundColor = 'white'
                        document.getElementById(currentselected).parentElement.style.borderRadius='0'
                    }
                    currentselected = e.target.id
                    if(view ==0 )
                        document.getElementById(currentselected).parentElement.style.opacity='0.8';
                    else{
                        document.getElementById(currentselected).parentElement.style.backgroundColor = 'whitesmoke'
                        document.getElementById(currentselected).parentElement.style.borderRadius='5px'
                    }
                }
            }
        }
        document.getElementById(id).oncontextmenu = (e) => {
            e.preventDefault()
            if(selectfile==0 && masking!='Bin' && masking!='shared with me' && masking!='Favorites' && masking!='Files-Shared') {
                if (currentselected == 0) {
                    contextmenuopened = 1
                    currentselected = e.target.id
                    rndids[currentselected]['ow'] = 1
                    document.getElementById('right-click-contextmenu').style.top = e.clientY.toString() + 'px'
                    document.getElementById('right-click-contextmenu').style.left = e.clientX.toString() + 'px'
                    document.getElementById('right-click-contextmenu').style.visibility = 'visible'
                    if(view==0)
                        document.getElementById(currentselected).parentElement.style.opacity = '0.8'
                    else
                        document.getElementById(currentselected).parentElement.style.backgroundColor = 'whitesmoke'
                } else {
                    contextmenuopened = 1
                    if(view==0)
                        document.getElementById(currentselected).parentElement.style.opacity = '1'
                    else
                        document.getElementById(currentselected).parentElement.style.backgroundColor ='white'
                    rndids[currentselected]['ow'] = 0
                    document.getElementById('right-click-contextmenu').style.top = e.clientY.toString() + 'px'
                    document.getElementById('right-click-contextmenu').style.left = e.clientX.toString() + 'px'
                    document.getElementById('right-click-contextmenu').style.visibility = 'visible';
                    currentselected = e.target.id
                    rndids[currentselected]['ow'] = 1
                    if(view==0)
                        document.getElementById(currentselected).parentElement.style.opacity = '0.8'
                    else
                        document.getElementById(currentselected).parentElement.style.backgroundColor = 'whitesmoke'
                }
            }
        }
        document.getElementById(id).ondblclick = (e) => {
            if(selectfile ==0) {
                document.getElementById('blank').style.visibility = 'visible'
                let filename = rndids[e.target.id]['name']
                if (rndids[e.target.id]['type'] == 'file') {
                    filedblclicked = e.target.id
                    let url = `http://localhost:4000/loadfile?filename=${filename}&token=${info[e.target.id]['owner']}&cwdstring=${cwdstring}`
                    let xhr = new XMLHttpRequest()
                    let data = ''
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            data = xhr.responseText
                            data = data.replaceAll('\n', '<br>').replaceAll(' ', '&nbsp')
                            document.getElementById('information').innerHTML = data
                            document.getElementById('file-name-opened').innerText = filename
                            document.getElementById('editor-window').style.visibility = 'visible'
                            ew = 1
                        }
                    }
                    xhr.open('GET', url)
                    xhr.send()
                } else if (rndids[e.target.id]['type'] == 'image') {
                    document.getElementById('photo-data').src = info[e.target.id]['src']
                    document.getElementById('photo-name').innerText = filename
                    document.getElementById('photo-window').style.visibility = 'visible'
                    pw = 1
                }
                else if(rndids[e.target.id]['type'] =='video'){
                    document.getElementById('video-data').src = info[e.target.id]['src']
                    document.getElementById('video-window').style.visibility = 'visible'
                    document.getElementById('video-name').innerText = info[e.target.id]['name']
                    document.getElementById('video-data').play()
                    vw=1
                }
                else if(rndids[e.target.id]['type'] == 'audio'){
                    document.getElementById('audio-data').src=info[e.target.id]['src']
                    document.getElementById('audio-window').style.visibility = 'visible'
                    document.getElementById('audio-name').innerText=info[e.target.id]['name']
                    document.getElementById('audio-data').play()
                    aw=1
                }
                else if (rndids[e.target.id]['type'] == 'dir') {
                    if (masking == 'Favorites') {
                        masking = 'Home'
                        cwdstring = rndids[e.target.id]['cwd']
                        browsehistory.push(rndids[e.target.id]['name'])
                        cleanUp()
                        getFiles()
                    } else if (masking == 'Collections') {
                        masking = 'Home'
                        cwdstring = rndids[e.target.id]['cwd']
                        browsehistory.push(rndids[e.target.id]['name'])
                        cleanUp()
                        getFiles()
                    } else if (masking == 'Shared with me') {
                        masking = 'Home'
                        cwdstring = rndids[e.target.id]['cwd']
                        browsehistory.push(rndids[e.target.id]['name'])
                        cleanUp()
                        getFiles()
                    } else if(masking =='Bin'){
                        masking = 'Home'
                        cwdstring = rndids[e.target.id]['cwd']
                        browsehistory.push(rndids[e.target.id]['name'])
                        cleanUp()
                        getFiles()
                    }
                    else {
                        cwd = rndids[e.target.id]['name']
                        cwdstring += ('-' + cwd)
                        browsehistory.push(rndids[e.target.id]['name'])
                        cleanUp()
                        getFiles()
                    }
                    document.getElementById('blank').style.visibility = 'hidden'
                }
            }
        }
    }
}

function createImagelvlElement(obj){
    let rnd = Math.floor(Math.random()*1000).toString()+'rnd'
    let ele= document.createElement('div')
    let trans = document.createElement('div')
    trans.className='trans'
    trans.id=rnd
    ele.className = `images`
    let img = document.createElement('img')
    img.src = obj['src']
    img.className = 'src'
    let name = document.createElement('label')
    name.innerText = obj['name']
    name.className = `file-lbl`
    ele.append(img,name,trans)
    document.getElementById('container-lvl2').appendChild(ele)
    rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'image','cwd':obj['cwd']}
    info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'src':obj['src'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}

    return rnd

}
function createFilelvlElement(obj) {
    let rnd = Math.floor(Math.random()*1000).toString()+'rnd'

    let ele= document.createElement('div')
    let trans = document.createElement('div')

    trans.className='trans'
    ele.className = `files`

    let encode = ['py','java','c','cpp','css','js','html','swift','rb','pynb','json','sass']
    let img = document.createElement('label')
    let i = document.createElement('i')
    let splitted = obj['name'].split('.');
    let split = splitted[splitted.length-1];
    if(split == 'txt') i.className = `fal fa-file-alt `
    else if(encode.includes(split)) i.className = `fal fa-file-code `
    else if(['zip','rar'].includes(split)) i.className ='fal fa-file-archive '
    else if(['mp3','m4a'].includes(split)) i.className = 'fal fa-file-audio '

    img.style.display = 'flex'
    img.style.justifyContent = 'center'
    img.style.position='relative'
    i.style.position='absolute'
    i.style.top = '50%'
    trans.id=rnd
    i.style.transform = 'scale(4)'
    i.style.color='#FF5252'
    img.className='src'
    img.appendChild(i)

    let name = document.createElement('label')
    name.innerText = obj['name']
    name.className = `file-lbl`

    //info.appendChild(name)
    ele.append(img,name,trans)
    document.getElementById('container-lvl2').appendChild(ele)
    rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'file','cwd':obj['cwd']}
    info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}
    return rnd

}
function createDirlvlElement(obj) {
    let rnd = Math.floor(Math.random()*1000).toString()+'rnd'
    let ele= document.createElement('div')
    let trans = document.createElement('div')

    trans.className='trans'
    ele.className = `files`

    let img = document.createElement('label')
    let i = document.createElement('i')
    i.className = `fal fa-folder fa-4x`
    img.style.display = 'flex'
    img.style.justifyContent = 'center'
    trans.id=rnd
    i.style.color='#448AFF'
    i.style.margin='auto'
    img.appendChild(i)
    img.className='src'
    let name = document.createElement('label')
    name.innerText = obj['name']
    name.className = `file-lbl`
    ele.append(img,name,trans)

    document.getElementById('container-lvl2').appendChild(ele)
    rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'dir','cwd':obj['cwd']}
    info[rnd] = {'rnd':rnd,'name':obj['name'],'created':obj.created,'type':'dir','mimetype':'dir'}

    return rnd
}

function createVideolvlElement(obj) {
    let rnd = Math.floor(Math.random()*1000).toString()+'rnd'
    let ele= document.createElement('div')
    let trans = document.createElement('div')

    trans.className='trans'
    ele.className = `files`

    let img = document.createElement('label')
    let i = document.createElement('i')
    i.className = `fal fa-file-video fa-4x`
    img.style.display = 'flex'
    img.style.justifyContent = 'center'
    trans.id=rnd
    i.style.color='#FFAB00'
    i.style.margin='auto'
    img.appendChild(i)
    img.className='src'
    let name = document.createElement('label')
    name.innerText = obj['name']
    name.className = `file-lbl`
    ele.append(img,name,trans)

    document.getElementById('container-lvl2').appendChild(ele)
    rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'video','cwd':obj['cwd']}
    info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'src':obj['src'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}

    return rnd
}
function createAudiolvlElement(obj) {
    let rnd = Math.floor(Math.random()*1000).toString()+'rnd'
    let ele= document.createElement('div')
    let trans = document.createElement('div')

    trans.className='trans'
    ele.className = `files`

    let img = document.createElement('label')
    let i = document.createElement('i')
    i.className = `fal fa-file-audio fa-4x`
    img.style.display = 'flex'
    img.style.justifyContent = 'center'
    trans.id=rnd
    i.style.color='#E040FB'
    i.style.margin='auto'
    img.appendChild(i)
    img.className='src'
    let name = document.createElement('label')
    name.innerText = obj['name']
    name.className = `file-lbl`
    ele.append(img,name,trans)

    document.getElementById('container-lvl2').appendChild(ele)
    rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'audio','cwd':obj['cwd']}
    info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'src':obj['src'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}
    return rnd
}

function createListlvlElement(obj){
    let rnd = Math.floor(Math.random()*1000).toString()+'rnd'
    let ele= document.createElement('div')
    let trans = document.createElement('div')
    let icon = document.createElement('i');icon.style.margin = '0 10px 0 10px'
    let name = document.createElement('label')
    let date = document.createElement('label')
    let size = document.createElement('label');
    let type = document.createElement('label')

    trans.className='translist'
    ele.className = `list`
    trans.id=rnd

    name.innerText = obj['name']
    name.className = `name`
    name.style.gridArea = '1/1/1/2'

    try {
        date.innerText = obj['lastmod'].slice(0, 15)
    }catch (e) {
        date.innerText = obj['created'].slice(0, 15)
    }
    date.style.marginLeft='70px'
    date.style.gridArea = '1/2/1/3'
    ele.appendChild(date)
    try {
        let a, s = obj['size'].toString()
        if (s.length > 6) {
            a = (parseFloat(s) / 1000000).toString().slice(0, 4) + ' MB'
        } else if (s.length >= 4)
            a = (parseFloat(s) / 1000).toString().slice(0, 4) + ' kB'
        else
            a = s + ' b'
        size.innerText = a
        size.style.marginLeft = '60px'
        size.style.gridArea = '1/3/1/4'
        ele.appendChild(size)
    }catch (e) {
        
    }
    type.innerText = obj['mimetype']
    //type.style.marginLeft='30px'
    type.style.textAlign = 'center'
    type.style.gridArea='1/4/1/4'
    ele.appendChild(type)

    ele.append(name,trans)
    icon.style.color='#b4b4b3'
    if(obj['type']=='image'){
        icon.className = 'fal fa-image'
        icon.style.color = '#E040FB'
        rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'image','cwd':obj['cwd']}
        info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'src':obj['src'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}

    }
    else if(obj['type'] == 'file'){
        icon.className='fal fa-file'
        icon.style.color = '#FF5252'
        rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'file','cwd':obj['cwd']}
        info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}
    }
    else if(obj['type'] == 'video'){
        icon.className='fal fa-file-video'
        icon.style.color = '#FFAB00'
        rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'video','cwd':obj['cwd']}
        info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'src':obj['src'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}
    }
    else if(obj['type'] == 'audio'){
        icon.className='fal fa-file-audio'
        icon.style.color = '#FFFF00'
        rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'audio','cwd':obj['cwd']}
        info[rnd] = {'rnd':rnd,'name':obj['name'],'type':obj['type'],'src':obj['src'],'size':obj['size'],'lastmod':obj['lastmod'],'mimetype':obj['mimetype'],'owner':obj['owner'],'cwd':obj['cwd']}
    }
    else{
        icon.className = 'fal fa-folder'
        icon.style.color = '#448AFF'
        rndids[rnd] = {'rnd':rnd,'ow':0,'name':obj['name'],'type':'dir','cwd':obj['cwd']}
        info[rnd] = {'rnd':rnd,'name':obj['name'],'created':obj.created}
    }
    name.prepend(icon)
    document.getElementById('container-lvl2').appendChild(ele)
    return rnd
}

//this here is to retrieve files based on indiviusl response
function getFavfiles(){
    FavFilesRecieved={}
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            FavFilesRecieved = JSON.parse(this.response)
            ShowFiles(FavFilesRecieved)
            showremovefavicon()
            eventListeners()
            showNav()
        }
    }
    xhr.open('GET', `http://localhost:4000/getfav?token=${userdetails['token']}`)
    xhr.onerror = function (){
        console.log('error')
    }
    xhr.send()
}

function getsharefiles() {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4 && xhr.status==200){
            ShareFilesRecieved = JSON.parse(this.response)
            ShowFiles(ShareFilesRecieved)
            eventListeners()
            showNav()
        }
    }
    xhr.open('GET',`http://localhost:4000/getsharefile?token=${userdetails['token']}&only=all`)
    xhr.send()
}
function getCollecFiles() {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState==4 && xhr.status == 200){
            CollFilesRecieved = JSON.parse(xhr.response)
            ShowFiles(CollFilesRecieved)
            eventListeners()
            showremovefromcol()
            showNav()
        }
    }
    xhr.open('GET',`http://localhost:4000/listcollection?token=${userdetails['token']}&cname=${curcolname}`)
    xhr.send()
}

function getfilesshared() {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4 && xhr.status==200){
            FileSharedRecieved=JSON.parse(this.response)
            ShowFiles(FileSharedRecieved)
            showStopSharingicon()
            eventListeners()
            showNav()
        }
    }
    xhr.open('GET',`http://localhost:4000/getfilesshared?token=${userdetails['token']}`)
    xhr.send()
}

function getBinFiles() {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4 && xhr.status==200){
            BinFilesRecieved=JSON.parse(this.response)
            ShowFiles(BinFilesRecieved)
            eventListeners()
            showNav()
            showTrashIcon()
        }
    }
    xhr.open('GET',`http://localhost:4000/listbinfiles?token=${userdetails['token']}&bin=1`)
    xhr.send()
}
function showTrashIcon() {
    let rndidskeys = Object.keys(rndids)
    for(let i=0;i<rndidskeys.length;i++){
        let id = Math.floor(Math.random()*1000).toString()+'tra'
        trashids[id] = rndidskeys[i]
        let ele = document.createElement('i')
        ele.className = 'fal fa-trash-restore-alt cursor'
        ele.id=id
        ele.style.transform = 'scale(1.5)'
        ele.style.marginLeft = '10px'
        ele.style.marginTop = '10px'
        ele.style.color = '#1A237E'
        ele.onclick = (e)=>{
            let filename = rndids[trashids[e.target.id]]['name']
            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4 && xhr.status==200){
                    delete rndids[trashids[e.target.id]]
                    delete info[trashids[e.target.id]]
                    delete rndlist[rndlist.indexOf(trashids[e.target.id])]
                    document.getElementById('container-lvl2').removeChild(document.getElementById(trashids[e.target.id]).parentElement)
                    displaypopup(`'${filename}' restored`)
                    if(Object.keys(rndids).length==0){
                        if(view ==0) {
                            let ele = document.createElement('label')
                            ele.innerText = 'Nothing here'
                            ele.id ='nothing'
                            ele.style.fontSize = 'large'
                            ele.style.margin = 'auto'
                            document.getElementById('container-lvl2').appendChild(ele)
                        }
                        else{
                            let ele = document.createElement('label')
                            ele.innerText = 'Nothing here'
                            ele.id ='nothing'
                            ele.style.fontSize = 'large'
                            ele.style.margin = 'auto'
                            document.getElementById('container-lvl2').appendChild(ele)
                        }
                    }
                }
            }
            xhr.open('POST',`http://localhost:4000/restorefile?token=${userdetails['token']}`)
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify({'filename':filename,'cwdstring':info[trashids[e.target.id]]['cwd']}))
        }
        document.getElementById(rndidskeys[i]).appendChild(ele)
    }
}

function showStopSharingicon() {
    let rndidskeys = Object.keys(rndids)
    for(let i=0;i<rndidskeys.length;i++){
        let id = Math.floor(Math.random()*1000).toString()+'stsh'
        shareids[id] = rndidskeys[i]
        let ele = document.createElement('label')
        ele.id=id
        ele.className='cursor'
        ele.innerText='Stop Sharing'
        ele.style.padding='0 10px 5px 10px'
        ele.style.backgroundColor='#252524'
        ele.style.color = 'white'
        ele.onclick = (e)=>{
            let filename = rndids[shareids[e.target.id]]['name']
            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4 && xhr.status==200){
                    delete rndids[shareids[e.target.id]]
                    delete info[shareids[e.target.id]]
                    delete rndlist[rndlist.indexOf(shareids[e.target.id])]
                    document.getElementById('container-lvl2').removeChild(document.getElementById(shareids[e.target.id]).parentElement)
                    displaypopup(`'${filename}' stopped sharing`)
                    if(Object.keys(rndids).length==0){
                        let ele = document.createElement('label')
                        ele.innerText = 'Nothing here'
                        ele.style.fontSize='large'
                        ele.id ='nothing'
                        ele.style.margin ='auto'
                        document.getElementById('container-lvl2').appendChild(ele)
                    }
                }
            }
            xhr.open('POST',`http://localhost:4000/stopsharing?token=${userdetails['token']}`)
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify({'filename':filename,'cwdstring':info[shareids[e.target.id]]['cwd']}))
        }
        document.getElementById(rndidskeys[i]).appendChild(ele)
    }
}

function showremovefavicon(){
    let keys = Object.keys(rndids)
    for(let i=0;i<keys.length;i++){
        let ele = document.createElement('i')
        ele.className = 'fal fa-minus cursor'
        ele.style.margin = '10px 0 0 15px'
        ele.style.color = '#AA00FF'
        ele.style.transform  = 'scale(1.5)'
        ele.id = keys[i]+'fav'
        ele.onclick = (e)=>{
            let id = e.target.id.slice(0,-3)
            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4){
                    document.getElementById('container-lvl2').removeChild(document.getElementById(id).parentElement)
                    displaypopup(`'${info[id]['name']}' removed from favorites`)
                    delete rndids[id]
                    delete info[id]
                    delete rndlist[rndlist.indexOf(id)]
                    if(Object.keys(rndids).length==0){
                        let ele = document.createElement('label')
                        ele.innerText = 'Nothing here'
                        ele.style.fontSize='large'
                        ele.id ='nothing'
                        ele.style.margin ='auto'
                        document.getElementById('container-lvl2').appendChild(ele)
                    }
                }
            }
            xhr.open('POST','http://localhost:4000/removefav')
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify({'token':userdetails['token'],'cwd':info[id]['cwd'],'name':info[id]['name']}))
        }
        document.getElementById(keys[i]).appendChild(ele)
    }
}

function  showremovefromcol() {
    let keys = Object.keys(rndids)
    for(let i=0;i<keys.length;i++){
        let ele = document.createElement('i')
        ele.className = 'fal fa-minus cursor'
        ele.style.color = '#AA00FF'
        ele.style.transform  = 'scale(1.5)'
        ele.id = keys[i]+'col'
        ele.style.marginLeft ='10px'
        ele.onclick = (e)=>{
            let id = e.target.id.slice(0,-3)
            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4){
                    document.getElementById('container-lvl2').removeChild(document.getElementById(id).parentElement)
                    displaypopup(`'${info[id]['name']}' removed from ${curcolname}`)
                    delete rndids[id]
                    delete info[id]
                    delete rndlist[rndlist.indexOf(id)]
                    if(Object.keys(rndids).length==0){
                        let ele = document.createElement('label')
                        ele.innerText = 'Nothing here'
                        ele.style.fontSize='large'
                        ele.id ='nothing'
                        ele.style.margin ='auto'
                        document.getElementById('container-lvl2').appendChild(ele)
                    }
                }
            }
            xhr.open('POST','http://localhost:4000/removefromcol')
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            xhr.send(JSON.stringify({'token':userdetails['token'],'cwd':info[id]['cwd'],'name':info[id]['name'],'cname':curcolname}))
        }
        document.getElementById(keys[i]).appendChild(ele)
    }
}

function getFiles() {
    if(masking == 'Favorites'){
        getFavfiles()
        showremovefavicon()
    }
    else if(masking == 'collection')
        getCollecFiles()
    else if (masking=='Shared with me')
        getsharefiles()
    else if(masking=='Bin'){
        getBinFiles()
    }
    else if(masking == 'Files-Shared')
        getfilesshared()
    else if(masking == 'Home') {
        Filerecieved = {}
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                Filerecieved = JSON.parse(this.response)
                console.log(Filerecieved)
                ShowFiles(Filerecieved)
                eventListeners()
                showNav()
            }
        }
        xhr.open('GET', `http://localhost:4000/listallfiles?token=${userdetails['token']}&cwd=${cwd}&cwdstring=${cwdstring}`)
        xhr.send()
    }
}
//finally show the file
function ShowFiles(object) {
    if(Object.keys(object).length ==0){
        let ele = document.createElement('label')
        ele.innerText = 'Nothing here'
        ele.style.fontSize='large'
        ele.id ='nothing'
        ele.style.margin ='auto'
        document.getElementById('container-lvl2').appendChild(ele)
        document.getElementById('list-view-header').style.visibility='hidden'
    }
    else {
        for (let i of Object.keys(object)) {
            let obj = object[i]
            if (view == 1) {
                document.getElementById('list-view-header').style.visibility='visible'
                createListlvlElement(obj)
            } else {
                if (obj['type'] == 'image')
                    createImagelvlElement(obj)
                else if (obj['type'] == 'dir')
                    createDirlvlElement(obj)
                else if(obj['type'] == 'file')
                    createFilelvlElement(obj)
                else if(obj['type'] == 'video')
                    createVideolvlElement(obj)
                else if(obj['type'] =='audio')
                    createAudiolvlElement(obj)
            }
        }
    }
    rndlist = Object.keys(rndids)
}