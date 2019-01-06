export class Robo {

    constructor(name1, name2, name3) {
        this.area = [];            // 攻撃対象のセル・この中から選ぶ
        this.orgArea = [];         // ゲームの最初のセルを保存・B7とかのセル情報を保存
        this.shipArea = [];        // 命中させたセル・B7とかの情報を保存
        this.newTarget = "";
        this.enemyNum = 0;          // 何番目の敵か
        this.lockOnMode = false;
        this.orgTarget = "";       // 最初に命中したセルを覚えておく
        this.secTarget = "";
        this.lockOnName = "";
        this.lockOnNum = 0;
        this.roboNumOfGuess = 0;
        this.GRID_LENGTH = 7;
        this.GRID_SIZE = 49;
        
        this.enemy = [
            { area: [], name: name1, times: 0 },
            { area: [], name: name2, times: 0 },
            { area: [], name: name3, times: 0 },
        ];
        
        this.setArea();
    }

    setArea () {
        let al = "";
        let s = 0;
        const ALPHABET = "ABCDEFG";
        
        for (let i = 0; i < 7; i++) {
            al = ALPHABET.substr(i, 1);
            for (let j = 1; j <= 7; j++) {
                this.orgArea[s] = al + j.toString();
                s++;
            }
        }

        this.area = this.orgArea;
    }

    attack () {
        let target = "";
        let index = 0;
        
        console.log('lockOnMode:' + this.lockOnMode);
        if (this.lockOnMode) {
            target = this.newTarget;
            index = this.area.indexOf(target);
        } else {
            let length = this.area.length;                    // length = 49
            index = Math.floor(Math.random() * length);   // 0 〜 48
            target = this.area[index];
        }
        console.log('Target: ' + target);
        return target;
    }

    getback(target, result) {
        // let result = checkRoboGuess(target);
        // 攻撃したセルを対象セルからはずす
        this.area = this.area.filter(x => x !== target);
        // 10回目の攻撃から、知能を働かせる。
        if (this.area.length < 40) {
            this.area = this.considerArea();
        }
//        console.log(this.area);  // 攻撃対象セル一覧

        let count = 0;
        // console.log(result);
//        console.log('result.size:' + result.size);
        
        // 攻撃結果から処理を選択する
        // {'xxx'-> '失敗, 'YYY'->'失敗', 'ZZZ'->'命中'}
        for (let [name, status] of result.entries()) {
            count++;
            if (status === '命中') {
                if (this.lockOnMode === false) {
                    this.orgTarget = target;
                }
                for (let ene of this.enemy) {
                    if (ene.name === name) {
                        
                        console.log(ene.area);
                        console.log('tar:' + target);
                        
                        ene.area.push(target);
                        
                        console.log(ene.area);
                        
                        ene.times++;
                        this.lockOnNum = ene.times;
                        if (ene.times === 2) {
                            this.secTarget = target;
                        }
                    }                    
                }
                this.lockOnMode = true;
                this.shipArea.push(target);
                break;
            }
            else if (status === '撃沈') {
                this.enemy = this.enemy.filter((x) => x.name !== name);
                for (let ene of this.enemy) {
                    switch (ene.times) {
                        case 1:
                            this.orgTarget = ene.area[0];
                            this.lockOnNum = 1;
                            break;
                        case 2:
                            this.secTarget = ene.area[1];
                            this.lockOnNum = 2;
                            break;
                        default:
                            this.orgTarget = "";
                            this.secTarget = "";
                            this.lockOnNum = 0;
                    }
                }
//                if (this.orgTarget === "" && this.secTarget === "") {
                if (this.lockOnNum === 0) {
                    this.lockOnMode = false;
                }
                this.shipArea.push(target);
                break;
            }
            else if (status === '失敗' && count === result.size) {
                if (this.secTarget !== "") {
                    target = this.secTarget;
                } else if (this.orgTarget !== "") {
                    target = this.orgTarget;
                }
            }

        }
        console.log('lockOnNum:' + this.lockOnNum);
//        console.log(this.enemy);
//        console.log('orgTar:' + this.orgTarget + ' secTar:' + this.secTarget);
        this.hasEnemy();

        if (this.lockOnMode) {
            this.newTarget = this.thinkTarget(target);
            console.log('newTarget: ' + this.newTarget);
        }
           
        return result;
    }

    thinkTarget(target) {
        let newTarget = "";
        switch (this.lockOnNum) {
            case 1:
                let nowIdx = this.orgArea.indexOf(target);
                // 左のセルが攻撃可能ならばそのセルで決定
                if (nowIdx - this.GRID_LENGTH >= 0 &&
                    (newTarget = this.getNextTarget(this.orgArea[nowIdx - this.GRID_LENGTH]))) {
                    // console.log('L' + this.lockOnNum +': ' + newTarget);
                    return newTarget;
                }
                // 上のセルが攻撃可能ならばそのセルで決定
                if (nowIdx - 1 >= 0 &&
                    (newTarget = this.getNextTarget(this.orgArea[nowIdx - 1]))) {
                    // console.log('U' + this.lockOnNum +': ' + newTarget);
                    return newTarget;
                }
                // 右のセルが攻撃可能ならばそのセルで決定
                if (nowIdx + this.GRID_LENGTH < this.GRID_SIZE &&
                    (newTarget = this.getNextTarget(this.orgArea[nowIdx + this.GRID_LENGTH]))) {
                    // console.log('R' + this.lockOnNum +': ' + newTarget);
                    return newTarget;
                }
                // 下のセルが攻撃可能ならばそのセルで決定
                if (nowIdx + 1 < this.GRID_SIZE &&
                    (newTarget = this.getNextTarget(this.orgArea[nowIdx + 1]))) {
                    // console.log('D' + this.lockOnNum +': ' + newTarget);
                    return newTarget;
                }
                break;
            case 2:
                // 1回目の命中のindex
                let firstIndex = this.orgArea.indexOf(this.orgTarget);
                // 2回目の命中のindex
                let secondIndex = this.orgArea.indexOf(this.secTarget);
                // 2つのうち、大きいほうと小さいほうを決定
                let small = Math.min(firstIndex, secondIndex);
                let large = Math.max(firstIndex, secondIndex);

                // もしも上下の配置なら
                if (large - small === 1) {
                    // 上のセルが攻撃可能ならそのセルで決定
                    if (small - 1 >= 0 &&
                        (newTarget = this.getNextTarget(this.orgArea[small - 1]))) {
                        return newTarget;
                    }
                    // 下のセルが攻撃可能ならそのセルで決定
                    if (large + 1 < this.GRID_SIZE &&
                        (newTarget = this.getNextTarget(this.orgArea[large + 1]))) {
                        return newTarget;
                    }
                }
                // もしも左右の配置なら
                if (large - small === this.GRID_LENGTH) {
                    // 左のセルが攻撃可能ならそのセルで決定
                    if (small - this.GRID_LENGTH >= 0 &&
                        (newTarget = this.getNextTarget(this.orgArea[small - this.GRID_LENGTH]))) {
                        return newTarget;
                    }
                    // 右のセルが攻撃可能ならそのセルで決定
                    if (large + this.GRID_LENGTH < this.GRID_SIZE &&
                        (newTarget = this.getNextTarget(this.orgArea[large + this.GRID_LENGTH]))) {
                        return newTarget;
                    }
                }
                break;
        }  
    }

    // this.area の中に target があるかどうか
    existTarget(target) {
        return this.area.find(x => x === target);
    }

    /**
     * Get Next Target -- 次の攻撃目標（セル）を得る
     *
     * 次の攻撃セルが this.area の中に存在していることが必要
     */
    getNextTarget(newTarget) {
        if (newTarget && this.existTarget(newTarget)) {
            return newTarget;
        } else {
            return false;
        }
    }

    /**
     * 現在の攻撃可能エリアを検討する
     */
    considerArea() {
        const area =
            this.area.filter(x => 
					(this.hasX(x) || this.hasL(x) ||
					 this.hasR(x) || this.hasY(x) ||
					 this.hasU(x) || this.hasD(x) || this.hasEnemy(x) )
			);
		// console.log('consider:<' + area.length + "> " + area);
        return area;
    }

    /**
     * 攻撃済みのセルでも、そこが命中したセルなら、
     * それが隣にあるセルは攻撃可能セルにカウントできる
     *
     * this.shipArea -- Array 命中したセル
     */
    hasEnemy(ele) {
//        console.log('hasEnemy:' + this.shipArea);
        const p = this.orgArea.indexOf(ele);
        // 左に命中セルがあるか
        let leftIdx = p - this.GRID_LENGTH;
        let leftCell = this.orgArea[leftIdx];
        if (leftIdx >= 0 &&
            this.shipArea.find(x => x === leftCell)) {
            return true;
        }
        // 右に命中セルがあるか
        let rightIdx = p + this.GRID_LENGTH;
        let rightCell = this.orgArea[rightIdx];
        if (rightIdx < this.GRID_SIZE &&
            this.shipArea.find(x => x === rightCell)) {
            return true;
        }
        // 上に命中セルがあるか
        let upIdx = p - 1;
        let upCell = this.orgArea[upIdx];
        if (upIdx >= 0 &&
            this.shipArea.find(x => x === upCell)) {
            return true;
        }
        // 下に命中セルがあるか
        let downIdx = p + 1;
        let downCell = this.orgArea[downIdx];
        if (downIdx < this.GRID_SIZE &&
            this.shipArea.find(x => x === downCell)) {
            return true;
        }
        return false;
    }
    // 左右に攻撃可能セルがある
    hasX(ele) {
        const p = this.orgArea.indexOf(ele);
        // 左右が 7x7 の中にあるかどうか
		if (p - this.GRID_LENGTH < 0 || p + this.GRID_LENGTH > 48) return false;
        // 左右のセルが攻撃可能セルのなかに無ければ、そのセルはすでに攻撃済みである
        if (this.area.indexOf(this.orgArea[p - this.GRID_LENGTH]) === -1 ||
            this.area.indexOf(this.orgArea[p + this.GRID_LENGTH]) === -1 ) {
            return false;
        } else {
            return true;
        }
    }
    // 左2つのセルが攻撃可能セルであるか
    hasL(ele) {
        const p = this.orgArea.indexOf(ele);
		if (p - this.GRID_LENGTH < 0) return false;
        if (this.area.indexOf(this.orgArea[p - this.GRID_LENGTH]) === -1 ||
            this.area.indexOf(this.orgArea[p - this.GRID_LENGTH * 2]) === -1 ) {
            return false;
        } else {
            return true;
        }
    }
    // 右2つのセルが攻撃可能セルであるか
    hasR(ele) {
        const p = this.orgArea.indexOf(ele);
		if (p + this.GRID_LENGTH >= this.GRID_SIZE) return false;
        if (this.area.indexOf(this.orgArea[p + this.GRID_LENGTH]) === -1 ||
            this.area.indexOf(this.orgArea[p + this.GRID_LENGTH * 2]) === -1 ) {
            return false;
        } else {
            return true;
        }
    }
    // 上下2つのセルが攻撃可能セルであるか
    hasY(ele) {
        const p = this.orgArea.indexOf(ele);
		if (p-1 < 0 || p+1 >= this.GRID_SIZE) return false;
        if (this.area.indexOf(this.orgArea[p-1]) === -1 ||
            this.area.indexOf(this.orgArea[p+1]) === -1 ) {
            return false;
        } else {
            return true;
        }
    }
    // 上2つのセルが攻撃可能セルであるか
    hasU(ele) {
        const p = this.orgArea.indexOf(ele);
		if (p-1 < 0) return false;
        if (this.area.indexOf(this.orgArea[p-1]) === -1 ||
            this.area.indexOf(this.orgArea[p-2]) === -1 ) {
            return false;
        } else {
            return true;
        }
    }
    // 下2つのセルが攻撃可能セルであるか
    hasD(ele) {
        const p = this.orgArea.indexOf(ele);
		if (p+1 >= this.GRID_SIZE) return false;
        if (this.area.indexOf(this.orgArea[p+1]) === -1 ||
            this.area.indexOf(this.orgArea[p+2]) === -1 ) {
            return false;
        } else {
            return true;
        }
    }

}
