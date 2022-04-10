window.onload = () => {
    if(localStorage.length !== 0){
        generateTable();
    }
}

//Dinamično nalaganje ključev v tabelo in dropdown
const generateTable = async() => {
    console.log("generating table...")
    let keys = JSON.parse(localStorage.getItem(localStorage.key(0))) || [];
  
    let table = document.getElementById('keysTable');

    for (const key of keys)
    {
        let row = table.insertRow();
        row.classList.add("row");
        let cell1 = row.insertCell();
        cell1.innerHTML = localStorage.key(0);
        cell1.classList.add('cell');
       
        let cell2 = row.insertCell();
        cell2.innerHTML = keys.indexOf(key) + 1;
        cell2.classList.add('cell');
    }
}




