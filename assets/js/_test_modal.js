// document.querySelector('p').textContent = 'Hello World!';
// window.alert('Hello World!!!!');
// console.log('Hello World!!!!, console.');

// document.write("test");
// document.body.innerHTML = "test2";
// const newElement = document.createElement("div");
// newElement.textContent = "test3";
// document.body.appendChild(newElement);

// const bmi = 27;
// console.log(`you bmi is ${bmi}:`);
// if (bmi>25) {
//     console.log('obese')
// } else if (bmi < 18.5) {
//     console.assert('skinny')
// } else {
//     console.log('normal')
// }

// const ul = document.getElementById('list');
// for (let i=0; i<5; i+=1) {
//     const li = document.createElement('li');
//     li.textContent = `child element ${i}`;
//     ul.appendChild(li);
// }

const buttonOpen = document.getElementById("modalOpen");
const buttonClose = document.getElementsByClassName("modalClose")[0];
const modal = document.getElementById("easyModal");

buttonOpen.addEventListener("click", modalOpen);
function modalOpen() {
    modal.style.display = "block";
}

buttonClose.addEventListener("click", modalClose);
function modalClose() {
    modal.style.display = "none";
}

document.addEventListener("click", outsideClose);
function outsideClose(e) {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}
