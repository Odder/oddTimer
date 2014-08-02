var scramblePyra = (function(circle) {
	function r() {
		function l(a, c) {
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
			0 == c && circle(e, 0, 1, 3);
			1 == c && circle(e, 1, 2, 5);
			2 == c && circle(e, 0, 4, 2);
			3 == c && circle(e, 3, 5, 4);
			a = 0;
			j = 5517840;
			for (b = 0; 4 > b; b++) d = e[b] << 2,
			a *= 6 - b,
			a += j >> d & 15,
			j -= 1118480 << d;
			return a
		}
		function i(a, c) {
			var e, d, f;
			d = 0;
			var b = [],
			h = a;
			for (e = 0; 4 >= e; e++) b[e] = h & 1,
			h >>= 1,
			d ^= b[e];
			b[5] = d;
			for (e = 6; 9 >= e; e++) f = ~~ (h / 3),
			d = h - 3 * f,
			h = f,
			b[e] = d;
			b[c+6] = (b[c+6] + 1) % 3;
			0 == c && (circle(b, 0, 1, 3), b[1] ^= 1, b[3] ^= 1);
			1 == c && (circle(b, 1, 2, 5), b[2] ^= 1, b[5] ^= 1);
			2 == c && (circle(b, 0, 4, 2), b[0] ^= 1, b[2] ^= 1);
			3 == c && (circle(b, 3, 5, 4), b[3] ^= 1, b[4] ^= 1);
			h = 0;
			for (e = 9; 6 <= e; e--) h = 3 * h + b[e];
			for (e = 4; 0 <= e; e--) h = 2 * h + b[e];
			return h
		}
		r = $.noop;
		var k = [1, 1, 1, 3, 12, 60, 360];

		mathlib.createMove(p, 360, l, 4);//moveTable, size, doMove, N_MOVES)
		mathlib.createPrun(n, 0, 360, 4, p, 4, 2);
		mathlib.createMove(q, 2592, i, 4);//moveTable, size, doMove, N_MOVES)
		mathlib.createPrun(o, 0, 2592, 5, q, 4, 2);
//		mathlib.createPrun([], 0, 2592*360, 12, function(idx, m){return p[m][idx%360]+q[m][~~(idx/360)]*360;}, 4, 2);
	}
	function s(l, i, g, k, m) {
		if (0 == g) return 0 == l && 0 == i;
		if (mathlib.getPruning(n, l) > g || mathlib.getPruning(o, i) > g) return ! 1;
		for (var a = 0; 4 > a; a++) if (a != k) for (var f = l,
		d = i,
		c = 0; 2 > c; c++) if (f = p[a][f], d = q[a][d], s(f, d, g - 1, a, m)) return m.push("ULRB".charAt(a) + ["", "'"][c]),
		!0;
		return ! 1
	}
	var n = [],
	o = [],
	p = [],
	q = [];
	function getScramble(type) {
		r();
		var i = mathlib.rn(360),
		l = type == 'pyrso' ? 8 : 0, 
		g = mathlib.rn(2592),
		k = [];
		if (0 != i || 0 != g) for (; 99 > l && !s(i, g, l, -1, k); l++) {};
		k = k.reverse().join(" ") + " ";
		for (g = 0; 4 > g; g++) i = mathlib.rn(3),
		2 > i && (k += "lrbu".charAt(g) + ["", "'"][i] + " ");
		return k
	}
	return {
		getScramble: getScramble 
	};
})(mathlib.circle);