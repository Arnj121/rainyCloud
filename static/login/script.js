console.log(document.cookie)
document.getElementById('emailid').onfocus = ()=>{
    document.getElementById('error-lbl').style.visibility = 'hidden'
}
document.getElementById('password').onfocus = ()=>{
    document.getElementById('error-lbl').style.visibility = 'hidden'
}

document.getElementById('login-lbl').onclick = Login //go to
document.getElementById('signup-lbl').onclick=opensignupwindow
document.getElementById('signup-lbl15').onclick =signup//go to
document.getElementById('login-lbl15').onclick  =closesignupwindow

function Login(){
    let email = document.getElementById('emailid').value
    let password = document.getElementById('password').value
    let xhr= new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
            console.log(xhr.response)
            let res = JSON.parse(xhr.response)
            if(res['status']) {
                let d = new Date()
                d.setMonth(d.getMonth()+1)
                document.cookie=`loggedin=1;expires=${d};path=/mainpage;`
                document.cookie = `name=${res['name']};expires=${d};path=/mainpage;`;
                document.cookie = `token=${res['token']};expires=${d};path=/mainpage;`
                document.cookie = `email=${res['email']};expires=${d};path=/mainpage;`
                document.cookie = `password=${res['password']};expires=${d};path=/mainpage;`
                location.replace(`http://localhost:4000/mainpage`)
            }
            else{
                document.getElementById('error-lbl').style.visibility = 'visible'
            }
        }
    }
    xhr.open('GET',`http://localhost:4000/login?email=${email}&password=${password}`)
    xhr.send()
}
function opensignupwindow(){
    document.getElementById('emailid').value = ''
    document.getElementById('password').value = ''
    document.getElementById('login-window').style.visibility = 'hidden'
    document.getElementById('signup-window').style.visibility = 'visible'
    document.getElementById('loginsignup').innerText='Sign Up'
}
function closesignupwindow(){
    document.getElementById('login-window').style.visibility= 'visible'
    document.getElementById('signup-window').style.visibility = 'hidden'
    document.getElementById('emailid15').value =''
    document.getElementById('password15').value = ''
    document.getElementById('name15').value = ''
    document.getElementById('loginsignup').innerText='Login'
}

function signup(){
    let email = document.getElementById('emailid15').value
    let password = document.getElementById('password15').value
    let name = document.getElementById('name15').value
    let xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4){
            let res = JSON.parse(this.response)
            if(res['status']){
                let d = new Date()
                d.setMonth(d.getMonth()+1)
                document.cookie=`loggedin=1;expires=${d};path=/mainpage;`
                document.cookie = `name=${res['name']};expires=${d};path=/mainpage;`;
                document.cookie = `token=${res['token']};expires=${d};path=/mainpage;`
                document.cookie = `email=${res['email']};expires=${d};path=/mainpage;`
                document.cookie = `password=${res['password']};expires=${d};path=/mainpage;`
                location.replace(`http://localhost:4000/mainpage`)
            }
            else{
                document.getElementById('error-lbl15').style.visibility = 'visible'
            }
        }
    }
    xhr.open('POST',`http://localhost:4000/signup?email=${email}&password=${password}&name=${name}`)
    xhr.send()
}
document.getElementById('p1').onclick = ()=>{
    if(document.getElementById('p1').classList.contains('fa-eye-slash')){
        document.getElementById('p1').classList.remove('fa-eye-slash')
        document.getElementById('p1').classList.add('fa-eye')
        document.getElementById('password').type = 'text'
    }
    else{
        document.getElementById('p1').classList.remove('fa-eye')
        document.getElementById('p1').classList.add('fa-eye-slash')
        document.getElementById('password').type = 'password'
    }
}
document.getElementById('p2').onclick = ()=>{
    if(document.getElementById('p2').classList.contains('fa-eye-slash')){
        document.getElementById('p2').classList.remove('fa-eye-slash')
        document.getElementById('p2').classList.add('fa-eye')
        document.getElementById('password15').type = 'text'
    }
    else{
        document.getElementById('p2').classList.remove('fa-eye')
        document.getElementById('p2').classList.add('fa-eye-slash')
        document.getElementById('password15').type = 'password'
    }
}
