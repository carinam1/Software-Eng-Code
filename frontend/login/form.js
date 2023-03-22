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
        })
    }
} else{
    if(!email.value.length || !password.value.length){
        alert('Fill all the inputs')
        sendData('/users',{
            email: email.value,
            password: password.value,
        })
    }
}

})
