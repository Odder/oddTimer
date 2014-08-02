var scrambleSkewb = (function(circle) {
	function r() {
		function l(a, c) {
			var ax = a % 12;
			a = ~~(a / 12);
			for (var e = [], j = 5517840, f = 0, b = 0; 5 > b; b++) {
				var h = k[5 - b],
				d = ~~ (a / h),
				a = a - d * h,
				f = f ^ d,
				d = d << 2;
				e[b] = j >> d & 15;
				h = (1 << d) - 1;
				j = (j & h) + (j >> 4 & ~h)
			}
			0 == (f & 1) ? e[5] = j: (e[5] = e[4], e[4] = j);
			0 == c && circle(e, 0, 3, 1);
			2 == c && circle(e, 1, 5, 2);
			1 == c && circle(e, 0, 2, 4);
			3 == c && circle(e, 3, 4, 5);
			a = 0;
			j = 5517840;
			for (b = 0; 4 > b; b++) d = e[b] << 2,
			a *= 6 - b,
			a += j >> d & 15,
			j -= 1118480 << d;
			return a * 12 + cornerpermmv[ax][c];
		}
		function i(idx, move) {
	        var fixedtwst = [];
	        var twst = [];
	        for (var i = 0; i < 4; i++) {
	            fixedtwst[i] = idx % 3;
	            idx = ~~(idx / 3);
	        }
	        for (var i = 0; i < 3; i++) {
	            twst[i] = idx % 3;
	            idx = ~~(idx / 3);
	        }
	        twst[3] = (6 - twst[0] - twst[1] - twst[2]) % 3;
	        fixedtwst[move] = (fixedtwst[move] + 1) % 3;
	        var t;
	        switch (move) {
	            case 0:
	                t = twst[0];
	                twst[0] = twst[2] + 2;
	                twst[2] = twst[1] + 2;
	                twst[1] = t + 2;
	                break;
	            case 1:
	                t = twst[0];
	                twst[0] = twst[1] + 2;
	                twst[1] = twst[3] + 2;
	                twst[3] = t + 2;
	                break;
	            case 2:
	                t = twst[0];
	                twst[0] = twst[3] + 2;
	                twst[3] = twst[2] + 2;
	                twst[2] = t + 2;
	                break;
	            case 3:
	                t = twst[1];
	                twst[1] = twst[2] + 2;
	                twst[2] = twst[3] + 2;
	                twst[3] = t + 2;
	                break;
	            default:
	        }
	        for (var i = 2; i >= 0; i--) {
	            idx = idx * 3 + twst[i] % 3;
	        }
	        for (var i = 3; i >= 0; i--) {
	            idx = idx * 3 + fixedtwst[i];
	        }
	        return idx;
		}
		r = $.noop;
		var k = [1, 1, 1, 3, 12, 60, 360];
		var cornerpermmv = [[ 6, 5, 10, 1 ], [ 9, 7, 4, 2 ], [ 3, 11, 8, 0 ], [ 10, 1, 6, 5 ],
	        [ 0, 8, 11, 3 ], [ 7, 9, 2, 4 ], [ 4, 2, 9, 7 ], [ 11, 3, 0, 8 ],
	        [ 1, 10, 5, 6 ], [ 8, 0, 3, 11 ], [ 2, 4, 7, 9 ], [ 5, 6, 1, 10 ] ];

		mathlib.createMove(p, 4320, l, 4);//moveTable, size, doMove, N_MOVES)
		mathlib.createPrun(n, 0, 4320, 7, p, 4, 2);
		mathlib.createMove(q, 2187, i, 4);//moveTable, size, doMove, N_MOVES)
		mathlib.createPrun(o, 0, 2187, 6, q, 4, 2);
//		mathlib.createPrun([], 0, 4320 * 2187, 12, function(idx, m){return p[m][idx%4320]+q[m][~~(idx/4320)]*4320;}, 4, 2);
	}
	function s(l, i, g, k, m) {
		if (0 == g) return 0 == l && 0 == i;
		if (mathlib.getPruning(n, l) > g || mathlib.getPruning(o, i) > g) return ! 1;
		for (var a = 0; 4 > a; a++) if (a != k) for (var f = l,
		d = i,
		c = 0; 2 > c; c++) if (f = p[a][f], d = q[a][d], s(f, d, g - 1, a, m)) return m.push(a * 2 + (1 - c)),
		!0;
		return ! 1
	}
	var n = [],
	o = [],
	p = [],
	q = [];

    function getSolution(sol) {
        var ret = [];
        var move2str = ["L", "R", "B", "U"];//RLDB (in jaap's notation) rotated by z2
        for (var i = 0; i < sol.length; i++) {
            var axis = sol[i] >> 1;
            var pow = sol[i] & 1;
            if (axis == 2) {//step two.
                for (var p=0; p<=pow; p++) {
                    var temp = move2str[0];
                    move2str[0] = move2str[1];
                    move2str[1] = move2str[3];
                    move2str[3] = temp;
                }
            }
            ret.push(move2str[axis] + ((pow == 1) ? "'" : ""));
        }
        return ret.join(" ");
    }

    var ori = [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0];

	function getScramble() {
		r();
		var perm = mathlib.rn(4320),
		l = 8, 
		twst = mathlib.rn(2187),
		k = [];
		while (ori[perm % 12] != (twst + ~~(twst / 3) + ~~(twst / 9) + ~~(twst / 27)) % 3) {
			twst = mathlib.rn(2187);
		}
		if (0 != perm || 0 != twst) for (; 99 > l && !s(perm, twst, l, -1, k); l++) {};
		return getSolution(k);
	}
	
	return {
		getScramble: getScramble 
	};
})(mathlib.circle);