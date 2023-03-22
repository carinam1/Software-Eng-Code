const sendData = (path, data) => {
    console.log(data);
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(data => processData(data));

}

const processData = (data) => {
    console.log(data);
}

