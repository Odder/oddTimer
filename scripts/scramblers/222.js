var scramble222 = (function(circle) {
	function search(perm, ori, maxl, lm, sol) {
		if (maxl == 0) {
			return ori + perm == 0;
		}
		if (mathlib.getPruning(permprun, perm) > maxl || mathlib.getPruning(oriprun, ori) > maxl) return false;
		var h, g, f, i;
		for (i = 0; i < 3; i++) if (i != lm) {
			h = perm;
			g = ori;
			for (f = 0; f < 3; f++) {
				h = permmove[i][h];
				g = orimove[i][g];
				if (search(h, g, maxl - 1, i, sol)) {
					sol.push("URF".charAt(i) + "'2 ".charAt(f))
					return true;
				}
			}
		}
	}
	function init() {
		init = $.noop;
		mathlib.createMove(permmove, 5040, doPermMove, 3);//moveTable, size, doMove, N_MOVES)
		mathlib.createPrun(permprun, 0, 5040, 6, permmove, 3);
		mathlib.createMove(orimove, 729, doOriMove, 3);//moveTable, size, doMove, N_MOVES)
		mathlib.createPrun(oriprun, 0, 729, 5, orimove, 3);
//		mathlib.createPrun([], 0, 5040*729, 12, function(idx, m){return permmove[m][idx%5040]+orimove[m][~~(idx/5040)]*5040;}, 3);
	}
	function doPermMove(idx, m) {
		var b, d, e,
		g = [];
		mathlib.set8Perm(g, idx, 7);
		if (m == 0) {
			circle(g, 0, 2, 3, 1);
		} else if (m == 1) {
			circle(g, 0, 1, 5, 4);
		} else if (m == 2) {
			circle(g, 0, 4, 6, 2);
		}
		return mathlib.get8Perm(g, 7);
	}
	function doOriMove(a, c) {
		var b, d, e, h = 0,
		g = a,
		f = [];
		for (b = 1; 6 >= b; b++) e = ~~ (g / 3),
		d = g - 3 * e,
		g = e,
		f[b] = d,
		h -= d,
		0 > h && (h += 3);
		f[0] = h;
		0 == c ? circle(f, 0, 2, 3, 1) : 1 == c ? (circle(f, 0, 1, 5, 4), f[0] += 2, f[1]++, f[5] += 2, f[4]++) : 2 == c && (circle(f, 0, 4, 6, 2), f[2] += 2, f[0]++, f[4] += 2, f[6]++);
		g = 0;
		for (b = 6; 1 <= b; b--) g = 3 * g + f[b] % 3;
		return g
	}
	var permprun = [],
		oriprun = [],
		permmove = [],
		orimove = [];
	function getScramble(type) {
		init();
		var a, b, c, d, g;
		a = type == '222o' ? 0 : 9;
		d = [];
		g = [[0, 0, 0, 0, 4, 5, 6],
			 [0, 0, 0, 0, 4, 6, 5],
			 [0, 0, 0, 0, 5, 4, 6],
			 [0, 0, 0, 0, 5, 6, 4],
			 [0, 0, 0, 0, 6, 4, 5],
			 [0, 0, 0, 0, 6, 5, 4]];
		if (type == '222o' || type == '222so') {
			c = mathlib.rn(5040);
			b = mathlib.rn(729);
		} else if (type == '222eg') {
			c = mathlib.rn(24);
			b = mathlib.rn(27);
			g = g[mathlib.rn(6)];
			mathlib.set8Perm(g, c, 4);
			c = mathlib.get8Perm(g, 7);
		} else if (type == '222eg0') {
			c = mathlib.rn(24);
			b = mathlib.rn(27);
			g = g[0];
			mathlib.set8Perm(g, c, 4);
			c = mathlib.get8Perm(g, 7);
		} else if (type == '222eg1') {
			c = mathlib.rn(24);
			b = mathlib.rn(27);
			g = g[mathlib.rn(4) + 2];
			mathlib.set8Perm(g, c, 4);
			c = mathlib.get8Perm(g, 7);
		} else if (type == '222eg2') {
			c = mathlib.rn(24);
			b = mathlib.rn(27);
			g = g[1];
			mathlib.set8Perm(g, c, 4);
			c = mathlib.get8Perm(g, 7);
		}
		if (0 != c || 0 != b) for (; 99 > a && !search(c, b, a, -1, d); a++) {};
		return d.join(" ").replace(/ +/g, ' ');
	}
	return {
		getScramble: getScramble 
	};
}) (mathlib.circle);