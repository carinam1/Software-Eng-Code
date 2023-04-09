const basePath = 'http://localhost:3000';
const sendData = (path, data, successCallback=()=>{}, erroCallback=()=>{}) => {
    const token = localStorage.getItem('token');
    fetch(basePath + path, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    })
    .then(res => {
        console.log(res);
        return res.json()
    })
    .then(data => {
        if(data.Status == 200) {
            successCallback(data);
        } else {
            erroCallback(data.Message);
        } 
        
    })
    .catch((e)=>{
        console.log(e);    
        erroCallback('Something went wrong')
    });

    localStorage.setItem('token', '' );
}


const sendDataGET = (path, successCallback=()=>{}, erroCallback=()=>{}) => {
    const token = localStorage.getItem('token');
   fetch(basePath + path, {
        method: 'GET',
        headers: new Headers({'Content-Type': 'application/json','authorization':`Bearer ${token}`}),
    })
    .then(res => res.json())
    .then(data => {
        if(data.Status == 200) {
            // console.log(data);
            successCallback(data);
        } else {
            erroCallback('Unauthorised access');
        } 
        
    })
    .catch((e)=>{
        console.log(e);    
        erroCallback('Something went wrong')
    });

   // localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjgwMDA3ODEwLCJleHAiOjE2ODAwMTUwMTB9.b05I7gxj-d8TrrwlhKPU5RECJ15xRPDQ6pIYu0-kOEg' );
}
const processData = (data) => {
    console.log(data);
}
