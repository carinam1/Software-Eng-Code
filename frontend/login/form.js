let formBtn = document.querySelector('.submit-btn');

formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name');
    let email = document.querySelector('#email');
    let password = document.querySelector('#password') || null;
    let tac = document.querySelector('#tc') || null;

if(fullname != null){ //signup page
    if(fullname.value.length < 1){ 
        alert('Please enter your name');
    } else if(!email.value.length){
        alert('Enter your email');
    } else if(email.value.length<8){
        alert('Your password must be at least 8 characters long');
    } else if(!tac.checked){
        alert('You must agree to our terms and conditions');
    } else{
        sendData('/users',{
            name: fullname.value,
            email: email.value,
            password: password.value,
            tac: tac.checked
        }, (response) => {
            alert("Thank you for registration, please to access private area");
            window.location.href = '/Login/login.html';

        }, (errr) => {
            alert(errr);
        });
    }
} else{
    if(!email.value.length || !password.value.length){
        alert('Fill all the inputs')
      
    } else {
        sendData('/login',{
            email: email.value,
            password: password.value,
        },  (response) =>{
           if(response.token) {
                localStorage.setItem('token', response.token);
                checkUserList();
            }
        }, (err) => {
            console.log(err);
        })
    }
}

})

const checkUserList = () => {
    // if(localStorage.getItem('token')) {} // if token is there then give access to page using JS
    sendDataGET('/users', (response) =>{
       console.log(response);
    }, (err) => {
        console.log(err);
    })
}
