"use strict";

var mathlib = (function() {

	var Cnk = [], fact = [1];
	for (var i=0; i<12; ++i) {
		Cnk[i] = [];
		for (var j=0; j<12; ++j) {
			Cnk[i][j] = 0;
		}
	}
	for (var i=0; i<12; ++i) {
		Cnk[i][0] = Cnk[i][i] = 1;
		fact[i + 1] = fact[i] * (i + 1);
		for (var j=1; j<i; ++j) {
			Cnk[i][j] = Cnk[i-1][j-1] + Cnk[i-1][j];
		}
	}
	
	function circleOri(arr, a, b, c, d, ori) {
		var temp = arr[a];
		arr[a] = arr[d] ^ ori;
		arr[d] = arr[c] ^ ori;
		arr[c] = arr[b] ^ ori;
		arr[b] = temp ^ ori;
	}
	
	function circle(arr) {
		var length = arguments.length - 1, temp = arr[arguments[length]];
		for (var i=length; i>1; i--) {
			arr[arguments[i]] = arr[arguments[i-1]];
		}
		arr[arguments[1]] = temp;
		return circle;
	}
	
	function getPruning(table, index) {
		return table[index >> 3] >> ((index & 7) << 2) & 15;
	}
	
	function setNPerm(arr, idx, n) {
		var i, j;
		arr[n - 1] = 0;
		for (i = n - 2; i >= 0; --i) {
			arr[i] = idx % (n - i);
			idx = ~~(idx / (n - i));
			for (j = i + 1; j < n; ++j) {
				arr[j] >= arr[i] && ++arr[j];
			}
		}
	}

	function getNPerm(arr, n) {
		var i, idx, j;
		idx = 0;
		for (i = 0; i < n; ++i) {
			idx *= n - i;
			for (j = i + 1; j < n; ++j) {
				arr[j] < arr[i] && ++idx;
			}
		}
		return idx;
	}
	
	function getNParity(idx, n) {
		var i, p;
		p = 0;
		for (i = n - 2; i >= 0; --i) {
			p ^= idx % (n - i);
			idx = ~~(idx / (n - i));
		}
		return p & 1;
	}

	function get8Perm(arr, n) {
		if (n === undefined) {
			n = 8;
		}
		var i, idx, v, val;
		idx = 0;
		val = 1985229328;
		for (i = 0; i < n - 1; ++i) {
			v = arr[i] << 2;
			idx = (n - i) * idx + (val >> v & 7);
			val -= 286331152 << v;
		}
		return idx;
	}
	
	function set8Perm(arr, idx, n) {
		if (n === undefined) {
			n = 8;
		}
		n--;
		var i, m, p, v, val;
		val = 1985229328;
		for (i = 0; i < n; ++i) {
			p = fact[n - i];
			v = ~~(idx / p);
			idx %= p;
			v <<= 2;
			arr[i] = val >> v & 7;
			m = (1 << v) - 1;
			val = (val & m) + (val >> 4 & ~m);
		}
		arr[n] = val & 7;
	}

	function createMove(moveTable, size, doMove, N_MOVES) {
		N_MOVES = N_MOVES || 6;
		for (var j=0; j<N_MOVES; j++) {
			moveTable[j] = [];
			for (var i=0; i<size; i++) {
				moveTable[j][i] = doMove(i, j);
			}
		}
	}

	function edgeMove(arr, m) {
		if (m==0) {//F
			circleOri(arr, 0, 7, 8, 4, 1);
		} else if (m==1) {//R
			circleOri(arr, 3, 6, 11, 7, 0);
		} else if (m==2) {//U
			circleOri(arr, 0, 1, 2, 3, 0);
		} else if (m==3) {//B
			circleOri(arr, 2, 5, 10, 6, 1);
		} else if (m==4) {//L
			circleOri(arr, 1, 4, 9, 5, 0);
		} else if (m==5) {//D
			circleOri(arr, 11, 10, 9, 8, 0);
		}		
	}

	function createPrun(prun, init, size, maxd, doMove, N_MOVES, N_POWER, N_INV) {
		var isMoveTable = $.isArray(doMove);
		N_MOVES = N_MOVES || 6;
		N_POWER = N_POWER || 3;
		N_INV = N_INV || 256;
		for (var i=0, len=(size + 7)>>>3; i<len; i++) {
			prun[i] = -1;
		}
		prun[init >> 3] ^= 15 << ((init & 7) << 2);
//		var done = 1;
		var t = +new Date;
		for (var l=0; l<=maxd; l++) {
//			done = 0;
			var inv = l >= N_INV;
			var fill = (l + 1) ^ 15;
			var find = inv ? 0xf : l;
			var check = inv ? l : 0xf;
			out: for (var p=0; p<size; p++){
				if (getPruning(prun, p) == find) {
					for (var m=0; m<N_MOVES; m++){
						var q=p;
						for (var c=0; c<N_POWER; c++){
							q = isMoveTable ? doMove[m][q] : doMove(q, m);
							if(getPruning(prun, q) == check) {
//								++done;
								if (inv) {
									prun[p >> 3] ^= fill << ((p & 7) << 2);								
									continue out;
								} else {
									prun[q >> 3] ^= fill << ((q & 7) << 2);								
								}
							}
						}
					}
				}
			}
//			console.log(done);
		}
//		console.log(+new Date - t);
	}
	
	function rndEl(x) {
		return x[~~(Math.random()*x.length)];
	}
	
	function rn(n) {
		return ~~(Math.random()*n)
	}

	return {
		Cnk: Cnk, 
		fact: fact, 
		getPruning: getPruning,	
		setNPerm: setNPerm,
		getNPerm: getNPerm,
		getNParity: getNParity,		
		get8Perm: get8Perm,
		set8Perm: set8Perm,
		createMove: createMove,
		edgeMove: edgeMove,
		circle: circle,
		createPrun: createPrun,
		rn: rn,
		rndEl: rndEl
	}

})();