let prevButton = document.getElementById('prevButton');
let nextButton = document.getElementById('nextButton');
let prj = document.querySelectorAll('.prj');
let prj2 = document.getElementsByClassName('prj2');
let curPrj = 0;

function next() {
    curPrj++;
    if(curPrj >= prj.length){
        curPrj = prj.length -1;
    }
    setPrj();
}

function prev() {
    curPrj--;
    if(curPrj < 0){
        curPrj = 0;
    }
    setPrj();
}

function setPrj(){
    for (let i = 0; i < prj.length; i++) {
        if(i < curPrj){
            prj[i].classList.remove("enter")
            prj[i].classList.add("remove")
        }else if(i > curPrj){
            prj[i].classList.add("waiting");
            prj[i].classList.remove("enter");
        }else{

            prj[i].classList.remove("remove")
            prj[i].classList.remove("waiting")
        prj[i].classList.add("enter");
        }
    }
}

setPrj();
