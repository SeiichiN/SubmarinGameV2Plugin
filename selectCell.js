/**
 * 選択可能セルを表示する
 *
 */
export let ody1 = document.getElementById('ody1');
export let ody2 = document.getElementById('ody2');
export let ody3 = document.getElementById('ody3');
export let pos1 = document.getElementById('pos1');
export let pos2 = document.getElementById('pos2');
export let pos3 = document.getElementById('pos3');
export let her1 = document.getElementById('her1');
export let her2 = document.getElementById('her2');
export let her3 = document.getElementById('her3');

const ody1list = document.getElementById('ody1list');
const ody2list = document.getElementById('ody2list');
const ody3list = document.getElementById('ody3list');
const pos1list = document.getElementById('pos1list');
const pos2list = document.getElementById('pos2list');
const pos3list = document.getElementById('pos3list');
const her1list = document.getElementById('her1list');
const her2list = document.getElementById('her2list');
const her3list = document.getElementById('her3list');

const ALPHA = "ABCDEFG";
let ody1_cell, ody2_cell, ody3_cell;
let pos1_cell, pos2_cell, pos3_cell;
let her1_cell, her2_cell, her3_cell;
let al;
let num;
let leftAl = "";
let rightAl = "";
let upNum;
let downNum;


ody1.onclick = (() => {
    getOdy2Cell();
    getLRUD();
    ody1list.children[0].setAttribute('value', leftAl + num);
    ody1list.children[1].setAttribute('value', al + upNum);
    ody1list.children[2].setAttribute('value', al + downNum);
    ody1list.children[3].setAttribute('value', rightAl + num);
});

ody2.onclick = (() => {
    getOdy1Cell();
    getLRUD();
    ody2list.children[0].setAttribute('value', leftAl + num);
    ody2list.children[1].setAttribute('value', al + upNum);
    ody2list.children[2].setAttribute('value', al + downNum);
    ody2list.children[3].setAttribute('value', rightAl + num);
});

ody3.onclick = (() => {
    getOdy2Cell();
    getLRUD();
    ody3list.children[0].setAttribute('value', leftAl + num);
    ody3list.children[1].setAttribute('value', al + upNum);
    ody3list.children[2].setAttribute('value', al + downNum);
    ody3list.children[3].setAttribute('value', rightAl + num);
});
pos1.onclick = (() => {
    getPos2Cell();
    getLRUD();
    pos1list.children[0].setAttribute('value', leftAl + num);
    pos1list.children[1].setAttribute('value', al + upNum);
    pos1list.children[2].setAttribute('value', al + downNum);
    pos1list.children[3].setAttribute('value', rightAl + num);
});

pos2.onclick = (() => {
    getPos1Cell();
    getLRUD();
    pos2list.children[0].setAttribute('value', leftAl + num);
    pos2list.children[1].setAttribute('value', al + upNum);
    pos2list.children[2].setAttribute('value', al + downNum);
    pos2list.children[3].setAttribute('value', rightAl + num);
});

pos3.onclick = (() => {
    getPos2Cell();
    getLRUD();
    pos3list.children[0].setAttribute('value', leftAl + num);
    pos3list.children[1].setAttribute('value', al + upNum);
    pos3list.children[2].setAttribute('value', al + downNum);
    pos3list.children[3].setAttribute('value', rightAl + num);
});
her1.onclick = (() => {
    getHer2Cell();
    getLRUD();
    her1list.children[0].setAttribute('value', leftAl + num);
    her1list.children[1].setAttribute('value', al + upNum);
    her1list.children[2].setAttribute('value', al + downNum);
    her1list.children[3].setAttribute('value', rightAl + num);
});

her2.onclick = (() => {
    getHer1Cell();
    getLRUD();
    her2list.children[0].setAttribute('value', leftAl + num);
    her2list.children[1].setAttribute('value', al + upNum);
    her2list.children[2].setAttribute('value', al + downNum);
    her2list.children[3].setAttribute('value', rightAl + num);
});

her3.onclick = (() => {
    getHer2Cell();
    getLRUD();
    her3list.children[0].setAttribute('value', leftAl + num);
    her3list.children[1].setAttribute('value', al + upNum);
    her3list.children[2].setAttribute('value', al + downNum);
    her3list.children[3].setAttribute('value', rightAl + num);
});

function getOdy1Cell() {
    ody1_cell = ody1.value.toUpperCase();
    al = ody1_cell.substr(0, 1);
    num = ody1_cell.substr(1, 1);
}
function getOdy2Cell() {
    ody2_cell = ody2.value.toUpperCase();
    al = ody2_cell.substr(0, 1);
    num = ody2_cell.substr(1, 1);
}
function getOdy3Cell() {
    ody3_cell = ody3.value.toUpperCase();
    al = ody3_cell.substr(0, 1);
    num = ody3_cell.substr(1, 1);
}
function getPos1Cell() {
    pos1_cell = pos1.value.toUpperCase();
    al = pos1_cell.substr(0, 1);
    num = pos1_cell.substr(1, 1);
}
function getPos2Cell() {
    pos2_cell = pos2.value.toUpperCase();
    al = pos2_cell.substr(0, 1);
    num = pos2_cell.substr(1, 1);
}
function getPos3Cell() {
    pos3_cell = pos3.value.toUpperCase();
    al = pos3_cell.substr(0, 1);
    num = pos3_cell.substr(1, 1);
}
function getHer1Cell() {
    her1_cell = her1.value.toUpperCase();
    al = her1_cell.substr(0, 1);
    num = her1_cell.substr(1, 1);
}
function getHer2Cell() {
    her2_cell = her2.value.toUpperCase();
    al = her2_cell.substr(0, 1);
    num = her2_cell.substr(1, 1);
}
function getHer3Cell() {
    her3_cell = her3.value.toUpperCase();
    al = her3_cell.substr(0, 1);
    num = her3_cell.substr(1, 1);
}


function getLRUD() {
    leftAl = getLeftAl();
    rightAl = getRightAl();
    upNum = getUpNum();
    downNum = getDownNum();
}

function getLeftAl() {
    if (al !== "A") {
        leftAl = ALPHA.substr(ALPHA.indexOf(al) - 1, 1);
    } else {
        leftAl = "A";
    }
    return leftAl;
}

function getRightAl() {
    if (al !== "G") {
        rightAl = ALPHA.substr(ALPHA.indexOf(al) + 1, 1);
    } else {
        rightAl = "G";
    }
    return rightAl;
}

function getUpNum() {
    upNum = (parseInt(num) - 1).toString();
    return upNum;
}

function getDownNum() {
    downNum = (parseInt(num) + 1).toString();
    return downNum;
}
