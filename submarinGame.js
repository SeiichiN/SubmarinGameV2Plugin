import * as myList from './selectCell.js';
import * as myRobo from './robo.js';


/**
 * Submarin -- 潜水艦ゲーム
 * @summery:
 *   7つのマス目に、3個の大きさで潜水艦を配置する。
 *   マス目の番号は、1, 2, 3, 4, 5, 6, 7 とする。
 *   そのうちの3つに潜水艦を配置する（連続）。
 *   それが潜水艦の大きさとなる。
 *   （例）[2, 3, 4]
 *   ユーザーは、何番目のマス目に潜水艦があるかを当てる。
 *   3つ当たれば「撃沈」となる。
 * @Author: Seiichi Nukayama
 */
class Submarin {
    constructor() {
        // 潜水艦の配置 -- ['B2', 'B3', 'B4']
        this.locationCells = [];
        // 潜水艦の大きさ -- 要素数
        this.length = 0;
        // 命中した数 -- 3で撃沈
        this.numOfHits = 0;   // 使っていない
        // 潜水艦の名前
        this.name = "none";
        // 反応
        this.result = "";
    }

    // @summery: 配置を決める
    // @param: locs -- ['B2', 'B3', 'B4'] などの配列
    setLocationCells(locs) {
        this.locationCells = locs;
        this.length = this.locationCells.length;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    // @ デバッグ用に潜水艦の位置を表示するメソッド
    getLocationCells() {
        return this.locationCells.reduce((a, x) => a += x, "");
    }

    // @summery: ユーザーからの攻撃に対する判定処理
    // @param:  String guess -- ユーザーからの攻撃。 2 とか、3とか。
    checkYourself(guess) {
        this.result = '失敗';

        let newCells = this.locationCells.map(x => {
            let s = "";
            if (x === guess) {
                this.result = '命中';
                this.numOfHits++;
            } else {
                s = x;
            }
            if (this.numOfHits === 3) {
                this.result = '撃沈';
            }
            return s;
        });
            
        this.locationCells = newCells;

        return this.result;
    }
}

class GameHelper {
    
    constructor () {
        this.grid = [];
        for (let i=0; i < GRID_SIZE; i++) {
            this.grid[i] = 0;
        }
        this.subCount = 0;
    }

    // @summery: 潜水艦の配置セルを提案する
    // @param: int subSize -- 潜水艦の大きさ
    locateSubmarin(subSize) {
        let alphaCells = [];
        let alphaCoords = [];  // "a3"などのコードを保持する
        let success = false;   // 配置が適切かどうかを示す
        let attempts = 0;      // 試行回数のカウンタ
        let location = 0;      // 検討対象のセル
        let coords = [];       // 候補となる海域セル番号を保持する
                               // 潜水艦が保持
        let incr = 1;          // 配置を決めるときのセルの増加分
        let x = 0;             // 潜水艦の大きさ（カウンタ用）

        this.subcount++;

        let i = Math.floor(Math.random() * 30);
        if ((i % 2) === 1) {
            incr = GRID_LENGTH;
        } 

        // location には、0 ? 48 の数字がはいる。
        // coords は、潜水艦(セル３つ分)。候補となるlocation番号を保持する。
        while (success === false && attempts++ < 200) {
            // 0?48のどれかをランダムに選ぶ
            location = Math.floor(Math.random() * GRID_SIZE);
            success = true;
            x = 0;
            // 潜水艦の大きさが subSize -- 3 以下ならば
            while (success === true && x < subSize) {
                // その海域がまだ不使用ならば
                if (this.grid[location] === 0) {
                    coords[x] = location;  // この海域番号を保持する。
                    x++;
                    location += incr;      // 次の海域セル
                    // そのセルが全海域サイズよりも大きければ
                    if (location >= GRID_SIZE) {
                        success = false;
                    }
                    // そのセルが7で割り切れるということは、はみ出ているということ
                    if (x > 0 && location % GRID_LENGTH === 0) {
                                            success = false;
                    }
                } else {             // その海域は使用済み(1)
                    success = false;
                }
            }
        }

        x = 0;      // 潜水艦の大きさ（セルの数）
        let row = 0;
        let col = 0;
        while (x < subSize) {
            // coords[x]には、0 ? 48 の数字が格納されている。
            this.grid[coords[x]] = 1;  // そのセルを使用済みとする。
            row = Math.floor(coords[x] / GRID_LENGTH);   // 縦番号
            col = coords[x] % GRID_LENGTH;               // 横番号
            let alpha = ALPHABET.charAt(col);
            alphaCells[coords[x]] = alpha + (row + 1);
            alphaCoords[x] = alphaCells[coords[x]];
            x++;
        }
        return alphaCoords;
    }
}

/**
 * @summery: 'B4'などのセル指定の結果を得る
 * @param: String guess -- セルの指定。例：'b4'
 * @return: result -- Map(3) { SeaTiger =>  "失敗", Papiyon => "命中", Mermaid => "撃沈"}
 */
function checkYourGuess(guess) {
    numOfGuess++;

    console.log(guess);
    guess = guess.toUpperCase();

    let result = new Map();

    for (const s of submarinList) {
        result.set(s.getName(), s.checkYourself(guess));
    }

    // console.log(result);

    // result = submarinList.map(ship => ({ nam: ship.getName(), out: ship.checkYourself(guess) }));


    // numOfHitsが3であるもの（=3回命中したもの）がみつかったら、
    if (submarinList.find(s => s.numOfHits === 3)) {
        // numOfHitsが3でないもので配列を作り直す。
        submarinList = submarinList.filter(s => s.numOfHits !== 3);
        // 潜水艦の数を1つ減らす。
        numOfSubmarin--;
    }
    
    return result;
}

function checkUsedCell(cell) {

    if (usedCells.find(x => x === cell)) {
        // console.log('used!');
        return true;
    } else {
        // console.log('not used');
        usedCells.push(cell);
        return false;
    }
}


/**
 * @summery: セルを指定したあとの処理。
 *           画面に「命中」とかの表示をする。
 * @param: ユーザの入力したセル（文字列 ex.'B3'）
 */
function selection(cell) {

    if (numOfSubmarin === 0) return false;
    if (checkUsedCell(cell)) return false;

    // res -- Map(3) { SeaTiger → "失敗", Papiyon → "命中", Mermaid → "失敗" }
    const res = checkYourGuess(cell);
    roboResult = roboPlay();
    console.log(roboResult);

    // デバッグ用
    // console.log(submarinList.map(x => x.getLocationCells()));
    console.log(res);
    // console.log(cell);
    
    // ドキュメントに表示する
	const ele = document.getElementById(cell);
    const message1 = document.getElementById('mes1');
    const message2 = document.getElementById('mes2');
    const hantei = document.getElementById('kekka');
    const replay = document.getElementById('replay');

    // 敵の攻撃
    const tekiMes1 = document.getElementById('teki-mes1');
    const tekiMes2 = document.getElementById('teki-mes2');
    const tekiKekka = document.getElementById('teki-kekka');

    replay.onclick = (() => {
        // location.reload();
        message1.textContent = "";
        message2.textContent = "";
        hantei.textContent = "";
        tekiMes1.textContent = "";
        tekiMes2.textContent = "";
        tekiKekka.textContent = "";
        replay.setAttribute("style", "display: none");
        kiroku('all', 0);
        kekka_clear();
        init();
        setUserShip();
        roboInit();
        // ユーザーの命中された数はクロージャを使っている。
        countDamage = makeCountDamage();
        play();
    });

	function kiroku(name, c) {
		const ship = {SeaTiger: 0, Papiyon: 1, Mermaid: 2};
        let ele1 = {};
        let ele2 = {};
        // ship[name] -- 0,1,2 が入る
        if (Object.keys(ship).find(x => x === name)) {
		    ele1 = document.getElementsByClassName('dotComName')[ship[name]];
		    ele2 = document.getElementsByClassName('dotComX')[ship[name]];
		    ele1.textContent = name;
		    ele2.textContent = " X".repeat(c);
 		    ele2.setAttribute('style', 'display: inline-block');
        }
        else if (name === "all" && c === 0) {
            // x -- 'SeaTiger', 'Papiyon', 'Mermaid' が入る
            Object.keys(ship).map(x => {
		        ele1 = document.getElementsByClassName('dotComName')[ship[x]];
		        ele2 = document.getElementsByClassName('dotComX')[ship[x]];
                ele1.textContent = "";
                ele2.textContent = "";
		        ele2.setAttribute('style', 'display: none');
            });
        }
	}

	let dotShip = "";
	let tar = {};
    let hit = false;
    for (const [k, v] of res) {
        switch(v) {
            case "命中":
 		        ele.textContent = "@";
                hantei.textContent = "命中";
                hit = true;
                hantei.animate([
                    {opacity: 1, backgroundColor: "#f00"},
                    {opacity: 1, backgroundColor: "#fff"}
                ], { duration: 1000 });
                tar = submarinList.filter(x => x.name === k);
                console.log(tar[0].numOfHits);
                console.log(k);
                kiroku(k, tar[0].numOfHits);
                break;
            case "撃沈":
 		        ele.textContent = "@";
                hantei.textContent = k + "を撃沈";
                hit = true;
                hantei.animate([
                    {opacity: 1, backgroundColor: "#f00"},
                    {opacity: 1, backgroundColor: "#fff"}
                ], { duration: 1000, iterations: 2 });
				kiroku(k, 3);
                break;
            default:
                ele.textContent = "x";
                hantei.textContent = "失敗";
                hantei.animate([
                    {opacity: 1, backgroundColor: "#ff0"},
                    {opacity: 1, backgroundColor: "#fff"}
                ], { duration: 1000 });
                break;
        }
        if (hit) break;
    }
    
                
    if (numOfSubmarin === 0) {
        message1.textContent = "おめでとう。全て撃沈しました。";
        message2.textContent = "あなたの攻撃回数は、" + numOfGuess + "回です。";
        replay.setAttribute("style", "display: block");
        return false;
    }

    function kekka_myship(idname, times) {
        let mykekka = document.getElementById(idname);
        let mark = "X".repeat(times);
        mykekka.textContent = mark;
        mykekka.setAttribute('style', 'display: inline-block;');
    }

    // ユーザーの命中した潜水艦の画像を見えなくする。
    function kekka_clear() {
        let myShipArea = document.getElementsByClassName('kekka-ship');
        console.log(myShipArea);
        for (let x = 0; x < myShipArea.length; x++) {
            myShipArea[x].setAttribute('style', 'display: none;');
        }
    }

    // 敵の攻撃
    let tekiHit = false;
    let damage;
    
    for (const [n, s] of roboResult) {
        let idname = 'kekka-' + n.substr(0, 3);
        switch(s) {
            case "命中":
                tekiKekka.textContent = "敵の攻撃が " + n + " に命中。";
                tekiKekka.animate([
                    {opacity: 1, backgroundColor: "#f00"},
                    {opacity: 1, backgroundColor: "#fff"}
                ], { duration: 1000 });
                damage = countDamage(n);
                kekka_myship(idname, damage[n]);
                tekiHit = true;
                break;
            case "撃沈":
                tekiKekka.textContent = n + "が敵に撃沈された。";
                tekiKekka.animate([
                    {opacity: 1, backgroundColor: "#f00"},
                    {opacity: 1, backgroundColor: "#fff"}
                ], { duration: 1000, iterations: 2 });
                damage = countDamage(n);
                kekka_myship(idname, damage[n]);
                tekiHit = true;
                break;
            default:
                tekiKekka.textContent = "敵の攻撃が失敗。";
                tekiKekka.animate([
                    {opacity: 1, backgroundColor: "#ff0"},
                    {opacity: 1, backgroundColor: "#fff"}
                ], { duration: 1000 });
                break;
        }
        if (tekiHit) break;
    }

    if (myNumOfSubmarin === 0) {
        tekiMes1.textContent = "敵の攻撃により、我が艦隊は全滅しました。";
        tekiMes2.textContent = "敵の攻撃回数は、" + roboNumOfGuess + "回です。";
        replay.setAttribute("style", "display: block");
        return false;
    }
                
}

/**
 * テーブルの各TD要素には class="select" id="A1" などとしてある。
 * クラス名を指定して、そのクラスの要素全てを取得し、それぞれに
 * クリック時の関数をセットした。
 */
function play() {

    let al = "";

    const cells = document.getElementsByClassName('select');
    
    for (let cell of cells) {
        cell.onclick = (() => { selection(cell.id) });
    }
}

/**
 * HTMLの<table>の<td>の'#A1'?'#G7'までのセルに'.'を入れる
 */
function initCells() {
    const alpha = "ABCDEFG";
    let al = "";

    let cells = document.getElementsByClassName('select');
    for (let cell of cells) {
        cell.textContent = '.';
    };
}

function init() {
    usedCells.length = 0;
    let loc = [];
    numOfGuess = 0;    // 攻撃回数をゼロにセット
    submarinList.length = 0;    // 潜水艦リストを空にする
    numOfSubmarin = 3;

    initCells();
    
    const numOfCells = 3;             // 潜水艦の大きさ
    const submarin1 = new Submarin();
    const submarin2 = new Submarin();
    const submarin3 = new Submarin();

    const game = new GameHelper();

    loc = game.locateSubmarin(numOfCells);
    submarin1.setLocationCells(loc);
    submarin1.setName('SeaTiger');
    // console.log(submarin1.getName() + ":" + submarin1.getLocationCells());

    loc = game.locateSubmarin(numOfCells);
    submarin2.setLocationCells(loc);
    submarin2.setName('Papiyon');
    // console.log(submarin2.getName() + ":" + submarin2.getLocationCells());

    loc = game.locateSubmarin(numOfCells);
    submarin3.setLocationCells(loc);
    submarin3.setName('Mermaid');
    // console.log(submarin3.getName() + ":" + submarin3.getLocationCells());

    submarinList.push(submarin1);
    submarinList.push(submarin2);
    submarinList.push(submarin3);


}

function roboInit() {
    roboNumOfGuess = 0;    // 攻撃回数をゼロにセット
    mySubmarinList.length = 0;    // 潜水艦リストを空にする
    myNumOfSubmarin = 3;
    roboResult = null;
    mySubmarinList = [];

    const name1 = 'Odyssey';
    const name2 = 'Poseidon';
    const name3 = 'Hermes';
    
    robo = new myRobo.Robo(name1, name2, name3);

    const numOfCells = 3;
    const mySubmarin1 = new Submarin();
    const mySubmarin2 = new Submarin();
    const mySubmarin3 = new Submarin();

    console.log(odyssey);

    const loc1 = (odyssey.length > 0) ? odyssey : ["C4", "C5", "C6"];
    mySubmarin1.setLocationCells(loc1);
    mySubmarin1.setName(name1);
    writeShip('ship1', loc1);

    const loc2 = (poseidon.length > 0) ? poseidon : ["E2", "F2", "G2"];
    mySubmarin2.setLocationCells(loc2);
    mySubmarin2.setName(name2);
    writeShip('ship2', loc2);

    const loc3 = (hermes.length > 0) ? hermes : ["A3", "A4", "A5"];
    mySubmarin3.setLocationCells(loc3);
    mySubmarin3.setName(name3);
    writeShip('ship3', loc3);

    mySubmarinList.push(mySubmarin1);
    mySubmarinList.push(mySubmarin2);
    mySubmarinList.push(mySubmarin3);

}

function writeShip(idname, loc) {
    const userShip = document.getElementById(idname);
    userShip.textContent = loc.join(" ");
}

// roboの攻撃結果を判定する
// @param: String gs -- インスタンス robo から受け取った文字列 
function checkRoboGuess(gs) {
    roboNumOfGuess++;

    let guess = gs.toUpperCase();

    let result = new Map();

    for (const s of mySubmarinList) {
        result.set(s.getName(), s.checkYourself(guess));
    }

    // console.log(result);

    // result = submarinList.map(ship => ({ nam: ship.getName(), out: ship.checkYourself(guess) }));


    // numOfHitsが3であるもの（=3回命中したもの）がみつかったら、
    if (mySubmarinList.find(s => s.numOfHits === 3)) {
        // numOfHitsが3でないもので配列を作り直す。
        mySubmarinList = mySubmarinList.filter(s => s.numOfHits !== 3);
        // 潜水艦の数を1つ減らす。
        myNumOfSubmarin--;
    }

    // 判定結果を インスタンスrobo に返す
    return result;
}


function roboPlay() {
    let target = robo.attack();
    let result = checkRoboGuess(target);
    return robo.getback(target, result);
}

function howto() {
    const openHowto = document.getElementById('howto-btn');
    const desBox = document.getElementsByClassName('des')[0];
    const closeDes = document.getElementById('close-des');
    
    openHowto.onclick = (() => {
        desBox.setAttribute("style", "display: block");
        openHowto.setAttribute("style", "display: none");
    });

    closeDes.onclick = (() => {
        desBox.setAttribute("style", "display: none");
        openHowto.setAttribute("style", "display: block");
    });
}

/**
 * ユーザーに潜水艦の位置をセットしてもらう
 */
function setUserShip() {
    const startSetBtn = document.getElementById('start-set-btn');
    const setOk = document.getElementById("set-ok");
    
    const setShipArea = document.getElementsByClassName('set-players-ship')[0];
    setShipArea.setAttribute('style','display: none;');

    startSetBtn.onclick = (() => {
        startSetBtn.setAttribute('style','display: none;');
        setShipArea.setAttribute('style','display: block;');
    });
    setOk.onclick = (() => {

        let ody1 = myList.ody1.value;
        let ody2 = myList.ody2.value;
        let ody3 = myList.ody3.value;
        let pos1 = myList.pos1.value;
        let pos2 = myList.pos2.value;
        let pos3 = myList.pos3.value;
        let her1 = myList.her1.value;
        let her2 = myList.her2.value;
        let her3 = myList.her3.value;
        
        odyssey = [ody1, ody2, ody3];
        poseidon = [pos1, pos2, pos3];
        hermes = [her1, her2, her3];

        startSetBtn.setAttribute('style','display: block;');
        setShipArea.setAttribute('style','display: none;');
        roboInit();
    });
}

let makeCountDamage = function() {
    let damage = {
        Odyssey: 0,
        Poseidon: 0,
        Hermes: 0
    };
    return function(name) {
        damage[name]++;
        return damage;
    };
};

// 広域変数
const ALPHABET = "ABCDEFG";
const GRID_LENGTH = 7;
const GRID_SIZE = 49;
let cell = "";
let usedCells = [];       // そのセルが未使用かどうか

let numOfGuess = 0;       // 攻撃回数
let numOfSubmarin = 3;    // 潜水艦の数

/**
 * データのオブジェクト
 * submarinList
 * [{ locationCells: ['D2', 'E2', 'F2'] ,
 *    name:          'SeaTiger',
 *    numOfHits:     0,
 *    result:        '失敗''},
 *  { locationCells: ['C5', 'D5', 'E5'] ,
 *    name:          'Papiyon',
 *    numOfHits:     0,
 *    result:        '失敗''},
 *  { locationCells: ['C7', 'D7', 'E7'] ,
 *    name:          'MerMaid',
 *    numOfHits:     0,
 *    result:        '失敗''}]
 */

let submarinList = [];    // 潜水艦オブジェクトの配列

// プレーヤー側の潜水艦
let mySubmarinList = [];  // プレーヤーの潜水艦のリスト
let roboNumOfGuess = 0;   // 敵からの攻撃回数
let myNumOfSubmarin = 3;  // プレーヤーの潜水艦の数
let roboResult = {};      // 敵の攻撃結果（プレーヤーの状況）
let robo = {}; //  = new myRobo.Robo();  // 敵ロボット作成
let odyssey = [];
let poseidon = [];
let hermes = [];

let countDamage = makeCountDamage();

window.onload = (() => {
    init();               // プレーヤー側の攻撃準備
    setUserShip();
    roboInit();           // 敵（ロボ）の攻撃準備
    howto();
    play(); 
});
