let formBtn = document.querySelector('.submit-btn');

formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name');
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let tac = document.querySelector('#tc')

    if(fullname.value.length < 1){
        alert('Please enter your name');
    }

})

