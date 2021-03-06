/*
jqGrid  4.3.1  - jQuery Grid
Copyright (c) 2008, Tony Tomov, tony@trirand.com
Dual licensed under the MIT and GPL licenses
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl-2.0.html
Date: 2011-12-20
*/
(function (a) {
	a.jgrid = a.jgrid || {};
	a.extend(a.jgrid, {
		htmlDecode: function (c) {
			if (c && (c == "&nbsp;" || c == "&#160;" || c.length === 1 && c.charCodeAt(0) === 160)) return "";
			return !c ? c : String(c).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
		},
		htmlEncode: function (c) {
			return !c ? c : String(c).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
		},
		format: function (c) {
			var e = a.makeArray(arguments).slice(1);
			if (c === undefined) c = "";
			return c.replace(/\{(\d+)\}/g, function (b, f) {
				return e[f]
			})
		},
		getCellIndex: function (c) {
			c = a(c);
			if (c.is("tr")) return -1;
			c = (!c.is("td") && !c.is("th") ? c.closest("td,th") : c)[0];
			if (a.browser.msie) return a.inArray(c, c.parentNode.cells);
			return c.cellIndex
		},
		stripHtml: function (c) {
			c += "";
			var e = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
			if (c) return (c = c.replace(e, "")) && c !== "&nbsp;" && c !== "&#160;" ? c.replace(/\"/g, "'") : "";
			else return c
		},
		realType: function (c) {
			return Object.prototype.toString.call(c).slice(8, -1)
		},
		stripPref: function (c, e) {
			var b = this.realType(c);
			if (b == "String" || b == "Number") {
				c = String(c);
				e = c !== "" ? String(e).replace(String(c), "") : e
			}
			return e
		},
		stringToDoc: function (c) {
			var e;
			if (typeof c !== "string") return c;
			try {
				e = (new DOMParser).parseFromString(c, "text/xml")
			} catch (b) {
				e = new ActiveXObject("Microsoft.XMLDOM");
				e.async = false;
				e.loadXML(c)
			}
			return e && e.documentElement && e.documentElement.tagName != "parsererror" ? e : null
		},
		parse: function (c) {
			if (c.substr(0, 9) == "while(1);") c = c.substr(9);
			if (c.substr(0, 2) == "/*") c = c.substr(2, c.length - 4);
			c || (c = "{}");
			return a.jgrid.useJSON === true && typeof JSON === "object" && typeof JSON.parse === "function" ? JSON.parse(c) : eval("(" + c + ")")
		},
		parseDate: function (c, e) {
			var b = {
				m: 1,
				d: 1,
				y: 1970,
				h: 0,
				i: 0,
				s: 0,
				u: 0
			},
                f, g, h;
			f = /[\\\/:_;.,\t\T\s-]/;
			if (e && e !== null && e !== undefined) {
				e = a.trim(e);
				e = e.split(f);
				c = c.split(f);
				var i = a.jgrid.formatter.date.monthNames,
                    d = a.jgrid.formatter.date.AmPm,
                    k = function (m, l) {
                    	if (m === 0) {
                    		if (l === 12) l = 0
                    	} else if (l !== 12) l += 12;
                    	return l
                    };
				f = 0;
				for (g = c.length; f < g; f++) {
					if (c[f] == "M") {
						h = a.inArray(e[f], i);
						if (h !== -1 && h < 12) e[f] = h + 1
					}
					if (c[f] == "F") {
						h = a.inArray(e[f], i);
						if (h !== -1 && h > 11) e[f] = h + 1 - 12
					}
					if (c[f] == "a") {
						h = a.inArray(e[f], d);
						if (h !== -1 && h < 2 && e[f] == d[h]) {
							e[f] = h;
							b.h = k(e[f], b.h)
						}
					}
					if (c[f] == "A") {
						h = a.inArray(e[f], d);
						if (h !== -1 && h > 1 && e[f] == d[h]) {
							e[f] = h - 2;
							b.h = k(e[f], b.h)
						}
					}
					if (e[f] !== undefined) b[c[f].toLowerCase()] = parseInt(e[f], 10)
				}
				b.m = parseInt(b.m, 10) - 1;
				f = b.y;
				if (f >= 70 && f <= 99) b.y = 1900 + b.y;
				else if (f >= 0 && f <= 69) b.y = 2E3 + b.y
			}
			return new Date(b.y, b.m, b.d, b.h, b.i, b.s, b.u)
		},
		jqID: function (c) {
			return String(c).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&")
		},
		guid: 1,
		uidPref: "jqg",
		randId: function (c) {
			return (c ? c : a.jgrid.uidPref) + a.jgrid.guid++
		},
		getAccessor: function (c, e) {
			var b, f, g = [],
                h;
			if (typeof e === "function") return e(c);
			b = c[e];
			if (b === undefined) try {
				if (typeof e === "string") g = e.split(".");
				if (h = g.length) for (b = c; b && h--; ) {
					f = g.shift();
					b = b[f]
				}
			} catch (i) { }
			return b
		},
		getXmlData: function (c, e, b) {
			var f = typeof e === "string" ? e.match(/^(.*)\[(\w+)\]$/) : null;
			if (typeof e === "function") return e(c);
			if (f && f[2]) return f[1] ? a(f[1], c).attr(f[2]) : a(c).attr(f[2]);
			else {
				c = a(e, c);
				if (b) return c;
				return c.length > 0 ? a(c).text() : undefined
			}
		},
		ajaxOptions: {},
		from: function (c) {
			return new function (e, b) {
				if (typeof e == "string") e = a.data(e);
				var f = this,
                    g = e,
                    h = true,
                    i = false,
                    d = b,
                    k = /[\$,%]/g,
                    m = null,
                    l = null,
                    n = 0,
                    o = false,
                    j = "",
                    v = [],
                    r = true;
				if (typeof e == "object" && e.push) {
					if (e.length > 0) r = typeof e[0] != "object" ? false : true
				} else throw "data provides is not an array";
				this._hasData = function () {
					return g === null ? false : g.length === 0 ? false : true
				};
				this._getStr = function (p) {
					var q = [];
					i && q.push("jQuery.trim(");
					q.push("String(" + p + ")");
					i && q.push(")");
					h || q.push(".toLowerCase()");
					return q.join("")
				};
				this._strComp = function (p) {
					return typeof p == "string" ? ".toString()" : ""
				};
				this._group = function (p, q) {
					return {
						field: p.toString(),
						unique: q,
						items: []
					}
				};
				this._toStr = function (p) {
					if (i) p = a.trim(p);
					h || (p = p.toLowerCase());
					return p = p.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"')
				};
				this._funcLoop = function (p) {
					var q = [];
					a.each(g, function (u, x) {
						q.push(p(x))
					});
					return q
				};
				this._append = function (p) {
					var q;
					if (d === null) d = "";
					else d += j === "" ? " && " : j;
					for (q = 0; q < n; q++) d += "(";
					if (o) d += "!";
					d += "(" + p + ")";
					o = false;
					j = "";
					n = 0
				};
				this._setCommand = function (p, q) {
					m = p;
					l = q
				};
				this._resetNegate = function () {
					o = false
				};
				this._repeatCommand = function (p, q) {
					if (m === null) return f;
					if (p !== null && q !== null) return m(p, q);
					if (l === null) return m(p);
					if (!r) return m(p);
					return m(l, p)
				};
				this._equals = function (p, q) {
					return f._compare(p, q, 1) === 0
				};
				this._compare = function (p, q, u) {
					if (u === undefined) u = 1;
					if (p === undefined) p = null;
					if (q === undefined) q = null;
					if (p === null && q === null) return 0;
					if (p === null && q !== null) return 1;
					if (p !== null && q === null) return -1;
					if (!h && typeof p !== "number" && typeof q !== "number") {
						p = String(p).toLowerCase();
						q = String(q).toLowerCase()
					}
					if (p < q) return -u;
					if (p > q) return u;
					return 0
				};
				this._performSort = function () {
					if (v.length !== 0) g = f._doSort(g, 0)
				};
				this._doSort = function (p, q) {
					var u = v[q].by,
                        x = v[q].dir,
                        D = v[q].type,
                        C = v[q].datefmt;
					if (q == v.length - 1) return f._getOrder(p, u, x, D, C);
					q++;
					u = f._getGroup(p, u, x, D, C);
					x = [];
					for (D = 0; D < u.length; D++) {
						C = f._doSort(u[D].items, q);
						for (var A = 0; A < C.length; A++) x.push(C[A])
					}
					return x
				};
				this._getOrder = function (p, q, u, x, D) {
					var C = [],
                        A = [],
                        B = u == "a" ? 1 : -1,
                        J, z;
					if (x === undefined) x = "text";
					z = x == "float" || x == "number" || x == "currency" || x == "numeric" ?
                    function (V) {
                    	V = parseFloat(String(V).replace(k, ""));
                    	return isNaN(V) ? 0 : V
                    } : x == "int" || x == "integer" ?
                    function (V) {
                    	return V ? parseFloat(String(V).replace(k, "")) : 0
                    } : x == "date" || x == "datetime" ?
                    function (V) {
                    	return a.jgrid.parseDate(D, V).getTime()
                    } : a.isFunction(x) ? x : function (V) {
                    	V || (V = "");
                    	return a.trim(String(V).toUpperCase())
                    };
					a.each(p, function (V, la) {
						J = q !== "" ? a.jgrid.getAccessor(la, q) : la;
						if (J === undefined) J = "";
						J = z(J, la);
						A.push({
							vSort: J,
							index: V
						})
					});
					A.sort(function (V, la) {
						V = V.vSort;
						la = la.vSort;
						return f._compare(V, la, B)
					});
					x = 0;
					for (var aa = p.length; x < aa; ) {
						u = A[x].index;
						C.push(p[u]);
						x++
					}
					return C
				};
				this._getGroup = function (p, q, u, x, D) {
					var C = [],
                        A = null,
                        B = null,
                        J;
					a.each(f._getOrder(p, q, u, x, D), function (z, aa) {
						J = a.jgrid.getAccessor(aa, q);
						if (J === undefined) J = "";
						if (!f._equals(B, J)) {
							B = J;
							A !== null && C.push(A);
							A = f._group(q, J)
						}
						A.items.push(aa)
					});
					A !== null && C.push(A);
					return C
				};
				this.ignoreCase = function () {
					h = false;
					return f
				};
				this.useCase = function () {
					h = true;
					return f
				};
				this.trim = function () {
					i = true;
					return f
				};
				this.noTrim = function () {
					i = false;
					return f
				};
				this.execute = function () {
					var p = d,
                        q = [];
					if (p === null) return f;
					a.each(g, function () {
						eval(p) && q.push(this)
					});
					g = q;
					return f
				};
				this.data = function () {
					return g
				};
				this.select = function (p) {
					f._performSort();
					if (!f._hasData()) return [];
					f.execute();
					if (a.isFunction(p)) {
						var q = [];
						a.each(g, function (u, x) {
							q.push(p(x))
						});
						return q
					}
					return g
				};
				this.hasMatch = function () {
					if (!f._hasData()) return false;
					f.execute();
					return g.length > 0
				};
				this.andNot = function (p, q, u) {
					o = !o;
					return f.and(p, q, u)
				};
				this.orNot = function (p, q, u) {
					o = !o;
					return f.or(p, q, u)
				};
				this.not = function (p, q, u) {
					return f.andNot(p, q, u)
				};
				this.and = function (p, q, u) {
					j = " && ";
					if (p === undefined) return f;
					return f._repeatCommand(p, q, u)
				};
				this.or = function (p, q, u) {
					j = " || ";
					if (p === undefined) return f;
					return f._repeatCommand(p, q, u)
				};
				this.orBegin = function () {
					n++;
					return f
				};
				this.orEnd = function () {
					if (d !== null) d += ")";
					return f
				};
				this.isNot = function (p) {
					o = !o;
					return f.is(p)
				};
				this.is = function (p) {
					f._append("this." + p);
					f._resetNegate();
					return f
				};
				this._compareValues = function (p, q, u, x, D) {
					var C;
					C = r ? "jQuery.jgrid.getAccessor(this,'" + q + "')" : "this";
					if (u === undefined) u = null;
					var A = u,
                        B = D.stype === undefined ? "text" : D.stype;
					if (u !== null) switch (B) {
						case "int":
						case "integer":
							A = isNaN(Number(A)) || A === "" ? "0" : A;
							C = "parseInt(" + C + ",10)";
							A = "parseInt(" + A + ",10)";
							break;
						case "float":
						case "number":
						case "numeric":
							A = String(A).replace(k, "");
							A = isNaN(Number(A)) || A === "" ? "0" : A;
							C = "parseFloat(" + C + ")";
							A = "parseFloat(" + A + ")";
							break;
						case "date":
						case "datetime":
							A = String(a.jgrid.parseDate(D.newfmt || "Y-m-d", A).getTime());
							C = 'jQuery.jgrid.parseDate("' + D.srcfmt + '",' + C + ").getTime()";
							break;
						default:
							C = f._getStr(C);
							A = f._getStr('"' + f._toStr(A) + '"')
					}
					f._append(C + " " + x + " " + A);
					f._setCommand(p, q);
					f._resetNegate();
					return f
				};
				this.equals = function (p, q, u) {
					return f._compareValues(f.equals, p, q, "==", u)
				};
				this.notEquals = function (p, q, u) {
					return f._compareValues(f.equals, p, q, "!==", u)
				};
				this.isNull = function (p, q, u) {
					return f._compareValues(f.equals, p, null, "===", u)
				};
				this.greater = function (p, q, u) {
					return f._compareValues(f.greater, p, q, ">", u)
				};
				this.less = function (p, q, u) {
					return f._compareValues(f.less, p, q, "<", u)
				};
				this.greaterOrEquals = function (p, q, u) {
					return f._compareValues(f.greaterOrEquals, p, q, ">=", u)
				};
				this.lessOrEquals = function (p, q, u) {
					return f._compareValues(f.lessOrEquals, p, q, "<=", u)
				};
				this.startsWith = function (p, q) {
					var u = q === undefined || q === null ? p : q;
					u = i ? a.trim(u.toString()).length : u.toString().length;
					if (r) f._append(f._getStr("jQuery.jgrid.getAccessor(this,'" + p + "')") + ".substr(0," + u + ") == " + f._getStr('"' + f._toStr(q) + '"'));
					else {
						u = i ? a.trim(q.toString()).length : q.toString().length;
						f._append(f._getStr("this") + ".substr(0," + u + ") == " + f._getStr('"' + f._toStr(p) + '"'))
					}
					f._setCommand(f.startsWith, p);
					f._resetNegate();
					return f
				};
				this.endsWith = function (p, q) {
					var u = q === undefined || q === null ? p : q;
					u = i ? a.trim(u.toString()).length : u.toString().length;
					r ? f._append(f._getStr("jQuery.jgrid.getAccessor(this,'" + p + "')") + ".substr(" + f._getStr("jQuery.jgrid.getAccessor(this,'" + p + "')") + ".length-" + u + "," + u + ') == "' + f._toStr(q) + '"') : f._append(f._getStr("this") + ".substr(" + f._getStr("this") + '.length-"' + f._toStr(p) + '".length,"' + f._toStr(p) + '".length) == "' + f._toStr(p) + '"');
					f._setCommand(f.endsWith, p);
					f._resetNegate();
					return f
				};
				this.contains = function (p, q) {
					r ? f._append(f._getStr("jQuery.jgrid.getAccessor(this,'" + p + "')") + '.indexOf("' + f._toStr(q) + '",0) > -1') : f._append(f._getStr("this") + '.indexOf("' + f._toStr(p) + '",0) > -1');
					f._setCommand(f.contains, p);
					f._resetNegate();
					return f
				};
				this.groupBy = function (p, q, u, x) {
					if (!f._hasData()) return null;
					return f._getGroup(g, p, q, u, x)
				};
				this.orderBy = function (p, q, u, x) {
					q = q === undefined || q === null ? "a" : a.trim(q.toString().toLowerCase());
					if (u === null || u === undefined) u = "text";
					if (x === null || x === undefined) x = "Y-m-d";
					if (q == "desc" || q == "descending") q = "d";
					if (q == "asc" || q == "ascending") q = "a";
					v.push({
						by: p,
						dir: q,
						type: u,
						datefmt: x
					});
					return f
				};
				return f
			} (c, null)
		},
		extend: function (c) {
			a.extend(a.fn.jqGrid, c);
			this.no_legacy_api || a.fn.extend(c)
		}
	});
	a.fn.jqGrid = function (c) {
		if (typeof c == "string") {
			var e = a.jgrid.getAccessor(a.fn.jqGrid, c);
			if (!e) throw "jqGrid - No such method: " + c;
			var b = a.makeArray(arguments).slice(1);
			return e.apply(this, b)
		}
		return this.each(function () {
			if (!this.grid) {
				var f = a.extend(true, {
					url: "",
					height: 150,
					page: 1,
					rowNum: 20,
					rowTotal: null,
					records: 0,
					pager: "",
					pgbuttons: true,
					pginput: true,
					colModel: [],
					rowList: [],
					colNames: [],
					sortorder: "asc",
					sortname: "",
					datatype: "xml",
					mtype: "GET",
					altRows: false,
					selarrrow: [],
					savedRow: [],
					shrinkToFit: true,
					xmlReader: {},
					jsonReader: {},
					subGrid: false,
					subGridModel: [],
					reccount: 0,
					lastpage: 0,
					lastsort: 0,
					selrow: null,
					beforeSelectRow: null,
					onSelectRow: null,
					onSortCol: null,
					ondblClickRow: null,
					onRightClickRow: null,
					onPaging: null,
					onSelectAll: null,
					loadComplete: null,
					gridComplete: null,
					loadError: null,
					loadBeforeSend: null,
					afterInsertRow: null,
					beforeRequest: null,
					beforeProcessing: null,
					onHeaderClick: null,
					viewrecords: false,
					loadonce: false,
					multiselect: false,
					multikey: false,
					editurl: null,
					search: false,
					caption: "",
					hidegrid: true,
					hiddengrid: false,
					postData: {},
					userData: {},
					treeGrid: false,
					treeGridModel: "nested",
					treeReader: {},
					treeANode: -1,
					ExpandColumn: null,
					tree_root_level: 0,
					prmNames: {
						page: "page",
						rows: "rows",
						sort: "sidx",
						order: "sord",
						search: "_search",
						nd: "nd",
						id: "id",
						oper: "oper",
						editoper: "edit",
						addoper: "add",
						deloper: "del",
						subgridid: "id",
						npage: null,
						totalrows: "totalrows"
					},
					forceFit: false,
					gridstate: "visible",
					cellEdit: false,
					cellsubmit: "remote",
					nv: 0,
					loadui: "enable",
					toolbar: [false, ""],
					scroll: false,
					multiboxonly: false,
					deselectAfterSort: true,
					scrollrows: false,
					autowidth: false,
					scrollOffset: 18,
					cellLayout: 5,
					subGridWidth: 20,
					multiselectWidth: 20,
					gridview: false,
					rownumWidth: 25,
					rownumbers: false,
					pagerpos: "center",
					recordpos: "right",
					footerrow: false,
					userDataOnFooter: false,
					hoverrows: true,
					altclass: "ui-priority-secondary",
					viewsortcols: [false, "vertical", true],
					resizeclass: "",
					autoencode: false,
					remapColumns: [],
					ajaxGridOptions: {},
					direction: "ltr",
					toppager: false,
					headertitles: false,
					scrollTimeout: 40,
					data: [],
					_index: {},
					grouping: false,
					groupingView: {
						groupField: [],
						groupOrder: [],
						groupText: [],
						groupColumnShow: [],
						groupSummary: [],
						showSummaryOnHide: false,
						sortitems: [],
						sortnames: [],
						groupDataSorted: false,
						summary: [],
						summaryval: [],
						plusicon: "ui-icon-circlesmall-plus",
						minusicon: "ui-icon-circlesmall-minus"
					},
					ignoreCase: false,
					cmTemplate: {},
					idPrefix: ""
				}, a.jgrid.defaults, c || {}),
                    g = {
                    	headers: [],
                    	cols: [],
                    	footers: [],
                    	dragStart: function (s, t, w) {
                    		this.resizing = {
                    			idx: s,
                    			startX: t.clientX,
                    			sOL: w[0]
                    		};
                    		this.hDiv.style.cursor = "col-resize";
                    		this.curGbox = a("#rs_m" + a.jgrid.jqID(f.id), "#gbox_" + a.jgrid.jqID(f.id));
                    		this.curGbox.css({
                    			display: "block",
                    			left: w[0],
                    			top: w[1],
                    			height: w[2]
                    		});
                    		a.isFunction(f.resizeStart) && f.resizeStart.call(this, t, s);
                    		document.onselectstart = function () {
                    			return false
                    		}
                    	},
                    	dragMove: function (s) {
                    		if (this.resizing) {
                    			var t = s.clientX - this.resizing.startX;
                    			s = this.headers[this.resizing.idx];
                    			var w = f.direction === "ltr" ? s.width + t : s.width - t,
                                    y;
                    			if (w > 33) {
                    				this.curGbox.css({
                    					left: this.resizing.sOL + t
                    				});
                    				if (f.forceFit === true) {
                    					y = this.headers[this.resizing.idx + f.nv];
                    					t = f.direction === "ltr" ? y.width - t : y.width + t;
                    					if (t > 33) {
                    						s.newWidth = w;
                    						y.newWidth = t
                    					}
                    				} else {
                    					this.newWidth = f.direction === "ltr" ? f.tblwidth + t : f.tblwidth - t;
                    					s.newWidth = w
                    				}
                    			}
                    		}
                    	},
                    	dragEnd: function () {
                    		this.hDiv.style.cursor = "default";
                    		if (this.resizing) {
                    			var s = this.resizing.idx,
                                    t = this.headers[s].newWidth || this.headers[s].width;
                    			t = parseInt(t, 10);
                    			this.resizing = false;
                    			a("#rs_m" + a.jgrid.jqID(f.id)).css("display", "none");
                    			f.colModel[s].width = t;
                    			this.headers[s].width = t;
                    			this.headers[s].el.style.width = t + "px";
                    			this.cols[s].style.width = t + "px";
                    			if (this.footers.length > 0) this.footers[s].style.width = t + "px";
                    			if (f.forceFit === true) {
                    				t = this.headers[s + f.nv].newWidth || this.headers[s + f.nv].width;
                    				this.headers[s + f.nv].width = t;
                    				this.headers[s + f.nv].el.style.width = t + "px";
                    				this.cols[s + f.nv].style.width = t + "px";
                    				if (this.footers.length > 0) this.footers[s + f.nv].style.width = t + "px";
                    				f.colModel[s + f.nv].width = t
                    			} else {
                    				f.tblwidth = this.newWidth || f.tblwidth;
                    				a("table:first", this.bDiv).css("width", f.tblwidth + "px");
                    				a("table:first", this.hDiv).css("width", f.tblwidth + "px");
                    				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                    				if (f.footerrow) {
                    					a("table:first", this.sDiv).css("width", f.tblwidth + "px");
                    					this.sDiv.scrollLeft = this.bDiv.scrollLeft
                    				}
                    			}
                    			a.isFunction(f.resizeStop) && f.resizeStop.call(this, t, s)
                    		}
                    		this.curGbox = null;
                    		document.onselectstart = function () {
                    			return true
                    		}
                    	},
                    	populateVisible: function () {
                    		g.timer && clearTimeout(g.timer);
                    		g.timer = null;
                    		var s = a(g.bDiv).height();
                    		if (s) {
                    			var t = a("table:first", g.bDiv),
                                    w, y;
                    			if (t[0].rows.length) try {
                    				y = (w = t[0].rows[1]) ? a(w).outerHeight() || g.prevRowHeight : g.prevRowHeight
                    			} catch (E) {
                    				y = g.prevRowHeight
                    			}
                    			if (y) {
                    				g.prevRowHeight = y;
                    				var T = f.rowNum;
                    				w = g.scrollTop = g.bDiv.scrollTop;
                    				var I = Math.round(t.position().top) - w,
                                        Q = I + t.height();
                    				y *= T;
                    				var O, K, M;
                    				if (Q < s && I <= 0 && (f.lastpage === undefined || parseInt((Q + w + y - 1) / y, 10) <= f.lastpage)) {
                    					K = parseInt((s - Q + y - 1) / y, 10);
                    					if (Q >= 0 || K < 2 || f.scroll === true) {
                    						O = Math.round((Q + w) / y) + 1;
                    						I = -1
                    					} else I = 1
                    				}
                    				if (I > 0) {
                    					O = parseInt(w / y, 10) + 1;
                    					K = parseInt((w + s) / y, 10) + 2 - O;
                    					M = true
                    				}
                    				if (K) if (!(f.lastpage && O > f.lastpage || f.lastpage == 1 || O === f.page && O === f.lastpage)) if (g.hDiv.loading) g.timer = setTimeout(g.populateVisible, f.scrollTimeout);
                    				else {
                    					f.page = O;
                    					if (M) {
                    						g.selectionPreserver(t[0]);
                    						g.emptyRows(g.bDiv, false, false)
                    					}
                    					g.populate(K)
                    				}
                    			}
                    		}
                    	},
                    	scrollGrid: function (s) {
                    		if (f.scroll) {
                    			var t = g.bDiv.scrollTop;
                    			if (g.scrollTop === undefined) g.scrollTop = 0;
                    			if (t != g.scrollTop) {
                    				g.scrollTop = t;
                    				g.timer && clearTimeout(g.timer);
                    				g.timer = setTimeout(g.populateVisible, f.scrollTimeout)
                    			}
                    		}
                    		g.hDiv.scrollLeft = g.bDiv.scrollLeft;
                    		if (f.footerrow) g.sDiv.scrollLeft = g.bDiv.scrollLeft;
                    		s && s.stopPropagation()
                    	},
                    	selectionPreserver: function (s) {
                    		var t = s.p,
                                w = t.selrow,
                                y = t.selarrrow ? a.makeArray(t.selarrrow) : null,
                                E = s.grid.bDiv.scrollLeft,
                                T = t.gridComplete;
                    		t.gridComplete = function () {
                    			t.selrow = null;
                    			t.selarrrow = [];
                    			if (t.multiselect && y && y.length > 0) for (var I = 0; I < y.length; I++) y[I] != w && a(s).jqGrid("setSelection", y[I], false);
                    			w && a(s).jqGrid("setSelection", w, false);
                    			s.grid.bDiv.scrollLeft = E;
                    			t.gridComplete = T;
                    			t.gridComplete && T()
                    		}
                    	}
                    };
				if (this.tagName.toUpperCase() != "TABLE") alert("Element is not a table");
				else {
					a(this).empty().attr("tabindex", "1");
					this.p = f;
					this.p.useProp = !!a.fn.prop;
					var h, i, d;
					if (this.p.colNames.length === 0) for (h = 0; h < this.p.colModel.length; h++) this.p.colNames[h] = this.p.colModel[h].label || this.p.colModel[h].name;
					if (this.p.colNames.length !== this.p.colModel.length) alert(a.jgrid.errors.model);
					else {
						var k = a("<div class='ui-jqgrid-view'></div>"),
                            m, l = a.browser.msie ? true : false,
                            n = a.browser.webkit || a.browser.safari ? true : false;
						d = this;
						d.p.direction = a.trim(d.p.direction.toLowerCase());
						if (a.inArray(d.p.direction, ["ltr", "rtl"]) == -1) d.p.direction = "ltr";
						i = d.p.direction;
						a(k).insertBefore(this);
						a(this).appendTo(k).removeClass("scroll");
						var o = a("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
						a(o).insertBefore(k).attr({
							id: "gbox_" + this.id,
							dir: i
						});
						a(k).appendTo(o).attr("id", "gview_" + this.id);
						m = l && a.browser.version <= 6 ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : "";
						a("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").append(m).insertBefore(k);
						a("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(k);
						a(this).attr({
							cellspacing: "0",
							cellpadding: "0",
							border: "0",
							role: "grid",
							"aria-multiselectable": !!this.p.multiselect,
							"aria-labelledby": "gbox_" + this.id
						});
						var j = function (s, t) {
							s = parseInt(s, 10);
							return isNaN(s) ? t ? t : 0 : s
						},
                            v = function (s, t, w, y, E, T) {
                            	var I = d.p.colModel[s],
                                    Q = I.align,
                                    O = 'style="',
                                    K = I.classes,
                                    M = I.name,
                                    H = [];
                            	if (Q) O += "text-align:" + Q + ";";
                            	if (I.hidden === true) O += "display:none;";
                            	if (t === 0) O += "width: " + g.headers[s].width + "px;";
                            	else if (I.cellattr && a.isFunction(I.cellattr)) if ((s = I.cellattr.call(d, E, w, y, I, T)) && typeof s === "string") {
                            		s = s.replace(/style/i, "style").replace(/title/i, "title");
                            		if (s.indexOf("title") > -1) I.title = false;
                            		if (s.indexOf("class") > -1) K = undefined;
                            		H = s.split("style");
                            		if (H.length === 2) {
                            			H[1] = a.trim(H[1].replace("=", ""));
                            			if (H[1].indexOf("'") === 0 || H[1].indexOf('"') === 0) H[1] = H[1].substring(1);
                            			O += H[1].replace(/'/gi, '"')
                            		} else O += '"'
                            	}
                            	if (!H.length) {
                            		H[0] = "";
                            		O += '"'
                            	}
                            	O += (K !== undefined ? ' class="' + K + '"' : "") + (I.title && w ? ' title="' + a.jgrid.stripHtml(w) + '"' : "");
                            	O += ' aria-describedby="' + d.p.id + "_" + M + '"';
                            	return O + H[0]
                            },
                            r = function (s) {
                            	return s === undefined || s === null || s === "" ? "&#160;" : d.p.autoencode ? a.jgrid.htmlEncode(s) : s + ""
                            },
                            p = function (s, t, w, y, E) {
                            	var T = d.p.colModel[w];
                            	if (typeof T.formatter !== "undefined") {
                            		s = {
                            			rowId: s,
                            			colModel: T,
                            			gid: d.p.id,
                            			pos: w
                            		};
                            		t = a.isFunction(T.formatter) ? T.formatter.call(d, t, s, y, E) : a.fmatter ? a.fn.fmatter(T.formatter, t, s, y, E) : r(t)
                            	} else t = r(t);
                            	return t
                            },
                            q = function (s, t, w, y, E) {
                            	t = p(s, t, w, E, "add");
                            	return '<td role="gridcell" ' + v(w, y, t, E, s, true) + ">" + t + "</td>"
                            },
                            u = function (s, t, w) {
                            	var y = '<input role="checkbox" type="checkbox" id="jqg_' + d.p.id + "_" + s + '" class="cbox" name="jqg_' + d.p.id + "_" + s + '"/>';
                            	return '<td role="gridcell" ' + v(t, w, "", null, s, true) + ">" + y + "</td>"
                            },
                            x = function (s, t, w, y) {
                            	w = (parseInt(w, 10) - 1) * parseInt(y, 10) + 1 + t;
                            	return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + v(s, t, w, null, t, true) + ">" + w + "</td>"
                            },
                            D = function (s) {
                            	var t, w = [],
                                    y = 0,
                                    E;
                            	for (E = 0; E < d.p.colModel.length; E++) {
                            		t = d.p.colModel[E];
                            		if (t.name !== "cb" && t.name !== "subgrid" && t.name !== "rn") {
                            			w[y] = s == "local" ? t.name : s == "xml" || s === "xmlstring" ? t.xmlmap || t.name : t.jsonmap || t.name;
                            			y++
                            		}
                            	}
                            	return w
                            },
                            C = function (s) {
                            	var t = d.p.remapColumns;
                            	if (!t || !t.length) t = a.map(d.p.colModel, function (w, y) {
                            		return y
                            	});
                            	if (s) t = a.map(t, function (w) {
                            		return w < s ? null : w - s
                            	});
                            	return t
                            },
                            A = function (s, t, w) {
                            	if (d.p.deepempty) a("#" + a.jgrid.jqID(d.p.id) + " tbody:first tr:gt(0)").remove();
                            	else {
                            		var y = a("#" + a.jgrid.jqID(d.p.id) + " tbody:first tr:first")[0];
                            		a("#" + a.jgrid.jqID(d.p.id) + " tbody:first").empty().append(y)
                            	}
                            	if (t && d.p.scroll) {
                            		a(">div:first", s).css({
                            			height: "auto"
                            		}).children("div:first").css({
                            			height: 0,
                            			display: "none"
                            		});
                            		s.scrollTop = 0
                            	}
                            	if (w === true) if (d.p.treeGrid === true) {
                            		d.p.data = [];
                            		d.p._index = {}
                            	}
                            },
                            B = function () {
                            	var s = d.p.data.length,
                                    t, w, y;
                            	t = d.p.rownumbers === true ? 1 : 0;
                            	w = d.p.multiselect === true ? 1 : 0;
                            	y = d.p.subGrid === true ? 1 : 0;
                            	t = d.p.keyIndex === false || d.p.loadonce === true ? d.p.localReader.id : d.p.colModel[d.p.keyIndex + w + y + t].name;
                            	for (w = 0; w < s; w++) {
                            		y = a.jgrid.getAccessor(d.p.data[w], t);
                            		d.p._index[y] = w
                            	}
                            },
                            J = function (s, t, w, y, E) {
                            	var T = new Date,
                                    I = d.p.datatype != "local" && d.p.loadonce || d.p.datatype == "xmlstring",
                                    Q = d.p.xmlReader,
                                    O = d.p.datatype == "local" ? "local" : "xml";
                            	if (I) {
                            		d.p.data = [];
                            		d.p._index = {};
                            		d.p.localReader.id = "_id_"
                            	}
                            	d.p.reccount = 0;
                            	if (a.isXMLDoc(s)) {
                            		if (d.p.treeANode === -1 && !d.p.scroll) {
                            			A(t, false, true);
                            			w = 1
                            		} else w = w > 1 ? w : 1;
                            		var K, M, H = 0,
                                        X, ga = 0,
                                        ka = 0,
                                        ba = 0,
                                        ca, ra = [],
                                        ha, L = {},
                                        S, Y, ma = [],
                                        Da = d.p.altRows === true ? " " + d.p.altclass : "";
                            		Q.repeatitems || (ra = D(O));
                            		ca = d.p.keyIndex === false ? Q.id : d.p.keyIndex;
                            		if (ra.length > 0 && !isNaN(ca)) {
                            			if (d.p.remapColumns && d.p.remapColumns.length) ca = a.inArray(ca, d.p.remapColumns);
                            			ca = ra[ca]
                            		}
                            		O = (ca + "").indexOf("[") === -1 ? ra.length ?
                                    function (ya, va) {
                                    	return a(ca, ya).text() || va
                                    } : function (ya, va) {
                                    	return a(Q.cell, ya).eq(ca).text() || va
                                    } : function (ya, va) {
                                    	return ya.getAttribute(ca.replace(/[\[\]]/g, "")) || va
                                    };
                            		d.p.userData = {};
                            		d.p.page = a.jgrid.getXmlData(s, Q.page) || 0;
                            		d.p.lastpage = a.jgrid.getXmlData(s, Q.total);
                            		if (d.p.lastpage === undefined) d.p.lastpage = 1;
                            		d.p.records = a.jgrid.getXmlData(s, Q.records) || 0;
                            		if (a.isFunction(Q.userdata)) d.p.userData = Q.userdata.call(d, s) || {};
                            		else a.jgrid.getXmlData(s, Q.userdata, true).each(function () {
                            			d.p.userData[this.getAttribute("name")] = a(this).text()
                            		});
                            		s = a.jgrid.getXmlData(s, Q.root, true);
                            		(s = a.jgrid.getXmlData(s, Q.row, true)) || (s = []);
                            		var ua = s.length,
                                        oa = 0,
                                        za = {},
                                        Ea = parseInt(d.p.rowNum, 10);
                            		if (ua > 0 && d.p.page <= 0) d.p.page = 1;
                            		if (s && ua) {
                            			var Ha = d.p.scroll ? a.jgrid.randId() : 1;
                            			if (E) Ea *= E + 1;
                            			E = a.isFunction(d.p.afterInsertRow);
                            			var Ia = "";
                            			if (d.p.grouping && d.p.groupingView.groupCollapse === true) Ia = ' style="display:none;"';
                            			for (; oa < ua; ) {
                            				S = s[oa];
                            				Y = O(S, Ha + oa);
                            				Y = d.p.idPrefix + Y;
                            				K = w === 0 ? 0 : w + 1;
                            				K = (K + oa) % 2 == 1 ? Da : "";
                            				ma.push("<tr" + Ia + ' id="' + Y + '" tabindex="-1" role="row" class ="ui-widget-content jqgrow ui-row-' + d.p.direction + "" + K + '">');
                            				if (d.p.rownumbers === true) {
                            					ma.push(x(0, oa, d.p.page, d.p.rowNum));
                            					ba = 1
                            				}
                            				if (d.p.multiselect === true) {
                            					ma.push(u(Y, ba, oa));
                            					ga = 1
                            				}
                            				if (d.p.subGrid === true) {
                            					ma.push(a(d).jqGrid("addSubGridCell", ga + ba, oa + w));
                            					ka = 1
                            				}
                            				if (Q.repeatitems) {
                            					ha || (ha = C(ga + ka + ba));
                            					var Ka = a.jgrid.getXmlData(S, Q.cell, true);
                            					a.each(ha, function (ya) {
                            						var va = Ka[this];
                            						if (!va) return false;
                            						X = va.textContent || va.text;
                            						L[d.p.colModel[ya + ga + ka + ba].name] = X;
                            						ma.push(q(Y, X, ya + ga + ka + ba, oa + w, S))
                            					})
                            				} else for (K = 0; K < ra.length; K++) {
                            					X = a.jgrid.getXmlData(S, ra[K]);
                            					L[d.p.colModel[K + ga + ka + ba].name] = X;
                            					ma.push(q(Y, X, K + ga + ka + ba, oa + w, S))
                            				}
                            				ma.push("</tr>");
                            				if (d.p.grouping) {
                            					K = d.p.groupingView.groupField.length;
                            					for (var La = [], Ja = 0; Ja < K; Ja++) La.push(L[d.p.groupingView.groupField[Ja]]);
                            					za = a(d).jqGrid("groupingPrepare", ma, La, za, L);
                            					ma = []
                            				}
                            				if (I || d.p.treeGrid === true) {
                            					L._id_ = Y;
                            					d.p.data.push(L);
                            					d.p._index[Y] = d.p.data.length - 1
                            				}
                            				if (d.p.gridview === false) {
                            					a("tbody:first", t).append(ma.join(""));
                            					E && d.p.afterInsertRow.call(d, Y, L, S);
                            					ma = []
                            				}
                            				L = {};
                            				H++;
                            				oa++;
                            				if (H == Ea) break
                            			}
                            		}
                            		if (d.p.gridview === true) {
                            			M = d.p.treeANode > -1 ? d.p.treeANode : 0;
                            			if (d.p.grouping) {
                            				a(d).jqGrid("groupingRender", za, d.p.colModel.length);
                            				za = null
                            			} else d.p.treeGrid === true && M > 0 ? a(d.rows[M]).after(ma.join("")) : a("tbody:first", t).append(ma.join(""))
                            		}
                            		if (d.p.subGrid === true) try {
                            			a(d).jqGrid("addSubGrid", ga + ba)
                            		} catch (Na) { }
                            		d.p.totaltime = new Date - T;
                            		if (H > 0) if (d.p.records === 0) d.p.records = ua;
                            		ma = null;
                            		if (d.p.treeGrid === true) try {
                            			a(d).jqGrid("setTreeNode", M + 1, H + M + 1)
                            		} catch (Oa) { }
                            		if (!d.p.treeGrid && !d.p.scroll) d.grid.bDiv.scrollTop = 0;
                            		d.p.reccount = H;
                            		d.p.treeANode = -1;
                            		d.p.userDataOnFooter && a(d).jqGrid("footerData", "set", d.p.userData, true);
                            		if (I) {
                            			d.p.records = ua;
                            			d.p.lastpage = Math.ceil(ua / Ea)
                            		}
                            		y || d.updatepager(false, true);
                            		if (I) for (; H < ua; ) {
                            			S = s[H];
                            			Y = O(S, H);
                            			Y = d.p.idPrefix + Y;
                            			if (Q.repeatitems) {
                            				ha || (ha = C(ga + ka + ba));
                            				var Ma = a.jgrid.getXmlData(S, Q.cell, true);
                            				a.each(ha, function (ya) {
                            					var va = Ma[this];
                            					if (!va) return false;
                            					X = va.textContent || va.text;
                            					L[d.p.colModel[ya + ga + ka + ba].name] = X
                            				})
                            			} else for (K = 0; K < ra.length; K++) {
                            				X = a.jgrid.getXmlData(S, ra[K]);
                            				L[d.p.colModel[K + ga + ka + ba].name] = X
                            			}
                            			L._id_ = Y;
                            			d.p.data.push(L);
                            			d.p._index[Y] = d.p.data.length - 1;
                            			L = {};
                            			H++
                            		}
                            	}
                            },
                            z = function (s, t, w, y, E) {
                            	var T = new Date;
                            	if (s) {
                            		if (d.p.treeANode === -1 && !d.p.scroll) {
                            			A(t, false, true);
                            			w = 1
                            		} else w = w > 1 ? w : 1;
                            		var I, Q = d.p.datatype != "local" && d.p.loadonce || d.p.datatype == "jsonstring";
                            		if (Q) {
                            			d.p.data = [];
                            			d.p._index = {};
                            			d.p.localReader.id = "_id_"
                            		}
                            		d.p.reccount = 0;
                            		if (d.p.datatype == "local") {
                            			t = d.p.localReader;
                            			I = "local"
                            		} else {
                            			t = d.p.jsonReader;
                            			I = "json"
                            		}
                            		var O = 0,
                                        K, M, H = [],
                                        X, ga = 0,
                                        ka = 0,
                                        ba = 0,
                                        ca, ra, ha = {},
                                        L, S, Y = [],
                                        ma = d.p.altRows === true ? " " + d.p.altclass : "";
                            		d.p.page = a.jgrid.getAccessor(s, t.page) || 0;
                            		ca = a.jgrid.getAccessor(s, t.total);
                            		d.p.lastpage = ca === undefined ? 1 : ca;
                            		d.p.records = a.jgrid.getAccessor(s, t.records) || 0;
                            		d.p.userData = a.jgrid.getAccessor(s, t.userdata) || {};
                            		t.repeatitems || (X = H = D(I));
                            		I = d.p.keyIndex === false ? t.id : d.p.keyIndex;
                            		if (H.length > 0 && !isNaN(I)) {
                            			if (d.p.remapColumns && d.p.remapColumns.length) I = a.inArray(I, d.p.remapColumns);
                            			I = H[I]
                            		} (ra = a.jgrid.getAccessor(s, t.root)) || (ra = []);
                            		ca = ra.length;
                            		s = 0;
                            		if (ca > 0 && d.p.page <= 0) d.p.page = 1;
                            		var Da = parseInt(d.p.rowNum, 10),
                                        ua = d.p.scroll ? a.jgrid.randId() : 1;
                            		if (E) Da *= E + 1;
                            		var oa = a.isFunction(d.p.afterInsertRow),
                                        za = {},
                                        Ea = "";
                            		if (d.p.grouping && d.p.groupingView.groupCollapse === true) Ea = ' style="display:none;"';
                            		for (; s < ca; ) {
                            			E = ra[s];
                            			S = a.jgrid.getAccessor(E, I);
                            			if (S === undefined) {
                            				S = ua + s;
                            				if (H.length === 0) if (t.cell) {
                            					K = a.jgrid.getAccessor(E, t.cell);
                            					S = K !== undefined ? K[I] || S : S
                            				}
                            			}
                            			S = d.p.idPrefix + S;
                            			K = w === 1 ? 0 : w;
                            			K = (K + s) % 2 == 1 ? ma : "";
                            			Y.push("<tr" + Ea + ' id="' + S + '" tabindex="-1" role="row" class= "ui-widget-content jqgrow ui-row-' + d.p.direction + "" + K + '">');
                            			if (d.p.rownumbers === true) {
                            				Y.push(x(0, s, d.p.page, d.p.rowNum));
                            				ba = 1
                            			}
                            			if (d.p.multiselect) {
                            				Y.push(u(S, ba, s));
                            				ga = 1
                            			}
                            			if (d.p.subGrid) {
                            				Y.push(a(d).jqGrid("addSubGridCell", ga + ba, s + w));
                            				ka = 1
                            			}
                            			if (t.repeatitems) {
                            				if (t.cell) E = a.jgrid.getAccessor(E, t.cell);
                            				X || (X = C(ga + ka + ba))
                            			}
                            			for (M = 0; M < X.length; M++) {
                            				K = a.jgrid.getAccessor(E, X[M]);
                            				Y.push(q(S, K, M + ga + ka + ba, s + w, E));
                            				ha[d.p.colModel[M + ga + ka + ba].name] = K
                            			}
                            			Y.push("</tr>");
                            			if (d.p.grouping) {
                            				K = d.p.groupingView.groupField.length;
                            				M = [];
                            				for (var Ha = 0; Ha < K; Ha++) M.push(ha[d.p.groupingView.groupField[Ha]]);
                            				za = a(d).jqGrid("groupingPrepare", Y, M, za, ha);
                            				Y = []
                            			}
                            			if (Q || d.p.treeGrid === true) {
                            				ha._id_ = S;
                            				d.p.data.push(ha);
                            				d.p._index[S] = d.p.data.length - 1
                            			}
                            			if (d.p.gridview === false) {
                            				a("#" + a.jgrid.jqID(d.p.id) + " tbody:first").append(Y.join(""));
                            				oa && d.p.afterInsertRow.call(d, S, ha, E);
                            				Y = []
                            			}
                            			ha = {};
                            			O++;
                            			s++;
                            			if (O == Da) break
                            		}
                            		if (d.p.gridview === true) {
                            			L = d.p.treeANode > -1 ? d.p.treeANode : 0;
                            			if (d.p.grouping) a(d).jqGrid("groupingRender", za, d.p.colModel.length);
                            			else d.p.treeGrid === true && L > 0 ? a(d.rows[L]).after(Y.join("")) : a("#" + a.jgrid.jqID(d.p.id) + " tbody:first").append(Y.join(""))
                            		}
                            		if (d.p.subGrid === true) try {
                            			a(d).jqGrid("addSubGrid", ga + ba)
                            		} catch (Ia) { }
                            		d.p.totaltime = new Date - T;
                            		if (O > 0) if (d.p.records === 0) d.p.records = ca;
                            		if (d.p.treeGrid === true) try {
                            			a(d).jqGrid("setTreeNode", L + 1, O + L + 1)
                            		} catch (Ka) { }
                            		if (!d.p.treeGrid && !d.p.scroll) d.grid.bDiv.scrollTop = 0;
                            		d.p.reccount = O;
                            		d.p.treeANode = -1;
                            		d.p.userDataOnFooter && a(d).jqGrid("footerData", "set", d.p.userData, true);
                            		if (Q) {
                            			d.p.records = ca;
                            			d.p.lastpage = Math.ceil(ca / Da)
                            		}
                            		y || d.updatepager(false, true);
                            		if (Q) for (; O < ca && ra[O]; ) {
                            			E = ra[O];
                            			S = a.jgrid.getAccessor(E, I);
                            			if (S === undefined) {
                            				S = ua + O;
                            				if (H.length === 0) if (t.cell) S = a.jgrid.getAccessor(E, t.cell)[I] || S
                            			}
                            			if (E) {
                            				S = d.p.idPrefix + S;
                            				if (t.repeatitems) {
                            					if (t.cell) E = a.jgrid.getAccessor(E, t.cell);
                            					X || (X = C(ga + ka + ba))
                            				}
                            				for (M = 0; M < X.length; M++) {
                            					K = a.jgrid.getAccessor(E, X[M]);
                            					ha[d.p.colModel[M + ga + ka + ba].name] = K
                            				}
                            				ha._id_ = S;
                            				d.p.data.push(ha);
                            				d.p._index[S] = d.p.data.length - 1;
                            				ha = {}
                            			}
                            			O++
                            		}
                            	}
                            },
                            aa = function () {
                            	function s(L) {
                            		var S = 0,
                                        Y, ma, Da, ua, oa;
                            		if (L.groups !== undefined) {
                            			(ma = L.groups.length && L.groupOp.toString().toUpperCase() === "OR") && H.orBegin();
                            			for (Y = 0; Y < L.groups.length; Y++) {
                            				S > 0 && ma && H.or();
                            				try {
                            					s(L.groups[Y])
                            				} catch (za) {
                            					alert(za)
                            				}
                            				S++
                            			}
                            			ma && H.orEnd()
                            		}
                            		if (L.rules !== undefined) {
                            			if (S > 0) {
                            				ma = H.select();
                            				H = a.jgrid.from(ma);
                            				if (d.p.ignoreCase) H = H.ignoreCase()
                            			}
                            			try {
                            				(Da = L.rules.length && L.groupOp.toString().toUpperCase() === "OR") && H.orBegin();
                            				for (Y = 0; Y < L.rules.length; Y++) {
                            					oa = L.rules[Y];
                            					ua = L.groupOp.toString().toUpperCase();
                            					if (M[oa.op] && oa.field) {
                            						if (S > 0 && ua && ua === "OR") H = H.or();
                            						H = M[oa.op](H, ua)(oa.field, oa.data, y[oa.field])
                            					}
                            					S++
                            				}
                            				Da && H.orEnd()
                            			} catch (Ea) {
                            				alert(Ea)
                            			}
                            		}
                            	}
                            	var t, w = false,
                                    y = {},
                                    E = [],
                                    T = [],
                                    I, Q, O;
                            	if (a.isArray(d.p.data)) {
                            		var K = d.p.grouping ? d.p.groupingView : false;
                            		a.each(d.p.colModel, function () {
                            			Q = this.sorttype || "text";
                            			if (Q == "date" || Q == "datetime") {
                            				if (this.formatter && typeof this.formatter === "string" && this.formatter == "date") {
                            					I = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : a.jgrid.formatter.date.srcformat;
                            					O = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : a.jgrid.formatter.date.newformat
                            				} else I = O = this.datefmt || "Y-m-d";
                            				y[this.name] = {
                            					stype: Q,
                            					srcfmt: I,
                            					newfmt: O
                            				}
                            			} else y[this.name] = {
                            				stype: Q,
                            				srcfmt: "",
                            				newfmt: ""
                            			};
                            			if (d.p.grouping && this.name == K.groupField[0]) {
                            				var L = this.name;
                            				if (typeof this.index != "undefined") L = this.index;
                            				E[0] = y[L];
                            				T.push(L)
                            			}
                            			if (!w && (this.index == d.p.sortname || this.name == d.p.sortname)) {
                            				t = this.name;
                            				w = true
                            			}
                            		});
                            		if (d.p.treeGrid) a(d).jqGrid("SortTree", t, d.p.sortorder, y[t].stype, y[t].srcfmt);
                            		else {
                            			var M = {
                            				eq: function (L) {
                            					return L.equals
                            				},
                            				ne: function (L) {
                            					return L.notEquals
                            				},
                            				lt: function (L) {
                            					return L.less
                            				},
                            				le: function (L) {
                            					return L.lessOrEquals
                            				},
                            				gt: function (L) {
                            					return L.greater
                            				},
                            				ge: function (L) {
                            					return L.greaterOrEquals
                            				},
                            				cn: function (L) {
                            					return L.contains
                            				},
                            				nc: function (L, S) {
                            					return S === "OR" ? L.orNot().contains : L.andNot().contains
                            				},
                            				bw: function (L) {
                            					return L.startsWith
                            				},
                            				bn: function (L, S) {
                            					return S === "OR" ? L.orNot().startsWith : L.andNot().startsWith
                            				},
                            				en: function (L, S) {
                            					return S === "OR" ? L.orNot().endsWith : L.andNot().endsWith
                            				},
                            				ew: function (L) {
                            					return L.endsWith
                            				},
                            				ni: function (L, S) {
                            					return S === "OR" ? L.orNot().equals : L.andNot().equals
                            				},
                            				"in": function (L) {
                            					return L.equals
                            				},
                            				nu: function (L) {
                            					return L.isNull
                            				},
                            				nn: function (L, S) {
                            					return S === "OR" ? L.orNot().isNull : L.andNot().isNull
                            				}
                            			},
                                            H = a.jgrid.from(d.p.data);
                            			if (d.p.ignoreCase) H = H.ignoreCase();
                            			if (d.p.search === true) {
                            				var X = d.p.postData.filters;
                            				if (X) {
                            					if (typeof X == "string") X = a.jgrid.parse(X);
                            					s(X)
                            				} else try {
                            					H = M[d.p.postData.searchOper](H)(d.p.postData.searchField, d.p.postData.searchString, y[d.p.postData.searchField])
                            				} catch (ga) { }
                            			}
                            			if (d.p.grouping) {
                            				H.orderBy(T, K.groupOrder[0], E[0].stype, E[0].srcfmt);
                            				K.groupDataSorted = true
                            			}
                            			if (t && d.p.sortorder && w) d.p.sortorder.toUpperCase() == "DESC" ? H.orderBy(d.p.sortname, "d", y[t].stype, y[t].srcfmt) : H.orderBy(d.p.sortname, "a", y[t].stype, y[t].srcfmt);
                            			X = H.select();
                            			var ka = parseInt(d.p.rowNum, 10),
                                            ba = X.length,
                                            ca = parseInt(d.p.page, 10),
                                            ra = Math.ceil(ba / ka),
                                            ha = {};
                            			X = X.slice((ca - 1) * ka, ca * ka);
                            			y = H = null;
                            			ha[d.p.localReader.total] = ra;
                            			ha[d.p.localReader.page] = ca;
                            			ha[d.p.localReader.records] = ba;
                            			ha[d.p.localReader.root] = X;
                            			ha[d.p.localReader.userdata] = d.p.userData;
                            			X = null;
                            			return ha
                            		}
                            	}
                            },
                            V = function () {
                            	d.grid.hDiv.loading = true;
                            	if (!d.p.hiddengrid) switch (d.p.loadui) {
                            		case "enable":
                            			a("#load_" + a.jgrid.jqID(d.p.id)).show();
                            			break;
                            		case "block":
                            			a("#lui_" + a.jgrid.jqID(d.p.id)).show();
                            			a("#load_" + a.jgrid.jqID(d.p.id)).show()
                            	}
                            },
                            la = function () {
                            	d.grid.hDiv.loading = false;
                            	switch (d.p.loadui) {
                            		case "enable":
                            			a("#load_" + a.jgrid.jqID(d.p.id)).hide();
                            			break;
                            		case "block":
                            			a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                            			a("#load_" + a.jgrid.jqID(d.p.id)).hide()
                            	}
                            },
                            ia = function (s) {
                            	if (!d.grid.hDiv.loading) {
                            		var t = d.p.scroll && s === false,
                                        w = {},
                                        y, E = d.p.prmNames;
                            		if (d.p.page <= 0) d.p.page = 1;
                            		if (E.search !== null) w[E.search] = d.p.search;
                            		if (E.nd !== null) w[E.nd] = (new Date).getTime();
                            		if (E.rows !== null) w[E.rows] = d.p.rowNum;
                            		if (E.page !== null) w[E.page] = d.p.page;
                            		if (E.sort !== null) w[E.sort] = d.p.sortname;
                            		if (E.order !== null) w[E.order] = d.p.sortorder;
                            		if (d.p.rowTotal !== null && E.totalrows !== null) w[E.totalrows] = d.p.rowTotal;
                            		var T = d.p.loadComplete,
                                        I = a.isFunction(T);
                            		I || (T = null);
                            		var Q = 0;
                            		s = s || 1;
                            		if (s > 1) if (E.npage !== null) {
                            			w[E.npage] = s;
                            			Q = s - 1;
                            			s = 1
                            		} else T = function (K) {
                            			d.p.page++;
                            			d.grid.hDiv.loading = false;
                            			I && d.p.loadComplete.call(d, K);
                            			ia(s - 1)
                            		};
                            		else E.npage !== null && delete d.p.postData[E.npage];
                            		if (d.p.grouping) {
                            			a(d).jqGrid("groupingSetup");
                            			if (d.p.groupingView.groupDataSorted === true) w[E.sort] = d.p.groupingView.groupField[0] + " " + d.p.groupingView.groupOrder[0] + ", " + w[E.sort]
                            		}
                            		a.extend(d.p.postData, w);
                            		var O = !d.p.scroll ? 1 : d.rows.length - 1;
                            		if (a.isFunction(d.p.datatype)) d.p.datatype.call(d, d.p.postData, "load_" + d.p.id);
                            		else {
                            			if (a.isFunction(d.p.beforeRequest)) {
                            				w = d.p.beforeRequest.call(d);
                            				if (w === undefined) w = true;
                            				if (w === false) return
                            			}
                            			y = d.p.datatype.toLowerCase();
                            			switch (y) {
                            				case "json":
                            				case "jsonp":
                            				case "xml":
                            				case "script":
                            					a.ajax(a.extend({
                            						url: d.p.url,
                            						type: d.p.mtype,
                            						dataType: y,
                            						data: a.isFunction(d.p.serializeGridData) ? d.p.serializeGridData.call(d, d.p.postData) : d.p.postData,
                            						success: function (K, M, H) {
                            							a.isFunction(d.p.beforeProcessing) && d.p.beforeProcessing.call(d, K, M, H);
                            							y === "xml" ? J(K, d.grid.bDiv, O, s > 1, Q) : z(K, d.grid.bDiv, O, s > 1, Q);
                            							T && T.call(d, K);
                            							t && d.grid.populateVisible();
                            							if (d.p.loadonce || d.p.treeGrid) d.p.datatype = "local";
                            							s === 1 && la()
                            						},
                            						error: function (K, M, H) {
                            							a.isFunction(d.p.loadError) && d.p.loadError.call(d, K, M, H);
                            							s === 1 && la()
                            						},
                            						beforeSend: function (K, M) {
                            							var H = true;
                            							if (a.isFunction(d.p.loadBeforeSend)) H = d.p.loadBeforeSend.call(d, K, M);
                            							if (H === undefined) H = true;
                            							if (H === false) return false;
                            							else V()
                            						}
                            					}, a.jgrid.ajaxOptions, d.p.ajaxGridOptions));
                            					break;
                            				case "xmlstring":
                            					V();
                            					w = a.jgrid.stringToDoc(d.p.datastr);
                            					J(w, d.grid.bDiv);
                            					I && d.p.loadComplete.call(d, w);
                            					d.p.datatype = "local";
                            					d.p.datastr = null;
                            					la();
                            					break;
                            				case "jsonstring":
                            					V();
                            					w = typeof d.p.datastr == "string" ? a.jgrid.parse(d.p.datastr) : d.p.datastr;
                            					z(w, d.grid.bDiv);
                            					I && d.p.loadComplete.call(d, w);
                            					d.p.datatype = "local";
                            					d.p.datastr = null;
                            					la();
                            					break;
                            				case "local":
                            				case "clientside":
                            					V();
                            					d.p.datatype = "local";
                            					w = aa();
                            					z(w, d.grid.bDiv, O, s > 1, Q);
                            					T && T.call(d, w);
                            					t && d.grid.populateVisible();
                            					la()
                            			}
                            		}
                            	}
                            },
                            ea = function (s) {
                            	a("#cb_" + a.jgrid.jqID(d.p.id), d.grid.hDiv)[d.p.useProp ? "prop" : "attr"]("checked", s);
                            	if (d.p.frozenColumns && d.p.id + "_frozen") a("#cb_" + a.jgrid.jqID(d.p.id), d.grid.fhDiv)[d.p.useProp ? "prop" : "attr"]("checked", s)
                            };
						m = function (s, t) {
							var w = "",
                                y = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
                                E = "",
                                T, I, Q, O, K = function (M) {
                                	var H;
                                	if (a.isFunction(d.p.onPaging)) H = d.p.onPaging.call(d, M);
                                	d.p.selrow = null;
                                	if (d.p.multiselect) {
                                		d.p.selarrrow = [];
                                		ea(false)
                                	}
                                	d.p.savedRow = [];
                                	if (H == "stop") return false;
                                	return true
                                };
							s = s.substr(1);
							t += "_" + s;
							T = "pg_" + s;
							I = s + "_left";
							Q = s + "_center";
							O = s + "_right";
							a("#" + a.jgrid.jqID(s)).append("<div id='" + T + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + I + "' align='left'></td><td id='" + Q + "' align='center' style='white-space:pre;'></td><td id='" + O + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
							if (d.p.rowList.length > 0) {
								E = "<td dir='" + i + "'>";
								E += "<select class='ui-pg-selbox' role='listbox'>";
								for (I = 0; I < d.p.rowList.length; I++) E += '<option role="option" value="' + d.p.rowList[I] + '"' + (d.p.rowNum == d.p.rowList[I] ? ' selected="selected"' : "") + ">" + d.p.rowList[I] + "</option>";
								E += "</select></td>"
							}
							if (i == "rtl") y += E;
							if (d.p.pginput === true) w = "<td dir='" + i + "'>" + a.jgrid.format(d.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + a.jgrid.jqID(s) + "'></span>") + "</td>";
							if (d.p.pgbuttons === true) {
								I = ["first" + t, "prev" + t, "next" + t, "last" + t];
								i == "rtl" && I.reverse();
								y += "<td id='" + I[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
								y += "<td id='" + I[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
								y += w !== "" ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" + w + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" : "";
								y += "<td id='" + I[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
								y += "<td id='" + I[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>"
							} else if (w !== "") y += w;
							if (i == "ltr") y += E;
							y += "</tr></tbody></table>";
							d.p.viewrecords === true && a("td#" + s + "_" + d.p.recordpos, "#" + T).append("<div dir='" + i + "' style='text-align:" + d.p.recordpos + "' class='ui-paging-info'></div>");
							a("td#" + s + "_" + d.p.pagerpos, "#" + T).append(y);
							E = a(".ui-jqgrid").css("font-size") || "11px";
							a(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + E + ";visibility:hidden;' ></div>");
							y = a(y).clone().appendTo("#testpg").width();
							a("#testpg").remove();
							if (y > 0) {
								if (w !== "") y += 50;
								a("td#" + s + "_" + d.p.pagerpos, "#" + T).width(y)
							}
							d.p._nvtd = [];
							d.p._nvtd[0] = y ? Math.floor((d.p.width - y) / 2) : Math.floor(d.p.width / 3);
							d.p._nvtd[1] = 0;
							y = null;
							a(".ui-pg-selbox", "#" + T).bind("change", function () {
								d.p.page = Math.round(d.p.rowNum * (d.p.page - 1) / this.value - 0.5) + 1;
								d.p.rowNum = this.value;
								if (t) a(".ui-pg-selbox", d.p.pager).val(this.value);
								else d.p.toppager && a(".ui-pg-selbox", d.p.toppager).val(this.value);
								if (!K("records")) return false;
								ia();
								return false
							});
							if (d.p.pgbuttons === true) {
								a(".ui-pg-button", "#" + T).hover(function () {
									if (a(this).hasClass("ui-state-disabled")) this.style.cursor = "default";
									else {
										a(this).addClass("ui-state-hover");
										this.style.cursor = "pointer"
									}
								}, function () {
									if (!a(this).hasClass("ui-state-disabled")) {
										a(this).removeClass("ui-state-hover");
										this.style.cursor = "default"
									}
								});
								a("#first" + a.jgrid.jqID(t) + ", #prev" + a.jgrid.jqID(t) + ", #next" + a.jgrid.jqID(t) + ", #last" + a.jgrid.jqID(t)).click(function () {
									var M = j(d.p.page, 1),
                                        H = j(d.p.lastpage, 1),
                                        X = false,
                                        ga = true,
                                        ka = true,
                                        ba = true,
                                        ca = true;
									if (H === 0 || H === 1) ca = ba = ka = ga = false;
									else if (H > 1 && M >= 1) if (M === 1) ka = ga = false;
									else {
										if (M === H) ca = ba = false
									} else if (H > 1 && M === 0) {
										ca = ba = false;
										M = H - 1
									}
									if (this.id === "first" + t && ga) {
										d.p.page = 1;
										X = true
									}
									if (this.id === "prev" + t && ka) {
										d.p.page = M - 1;
										X = true
									}
									if (this.id === "next" + t && ba) {
										d.p.page = M + 1;
										X = true
									}
									if (this.id === "last" + t && ca) {
										d.p.page = H;
										X = true
									}
									if (X) {
										if (!K(this.id)) return false;
										ia()
									}
									return false
								})
							}
							d.p.pginput === true && a("input.ui-pg-input", "#" + T).keypress(function (M) {
								if ((M.charCode ? M.charCode : M.keyCode ? M.keyCode : 0) == 13) {
									d.p.page = a(this).val() > 0 ? a(this).val() : d.p.page;
									if (!K("user")) return false;
									ia();
									return false
								}
								return this
							})
						};
						var wa = function (s, t, w, y) {
							if (d.p.colModel[t].sortable) if (!(d.p.savedRow.length > 0)) {
								if (!w) {
									if (d.p.lastsort == t) if (d.p.sortorder == "asc") d.p.sortorder = "desc";
									else {
										if (d.p.sortorder == "desc") d.p.sortorder = "asc"
									} else d.p.sortorder = d.p.colModel[t].firstsortorder || "asc";
									d.p.page = 1
								}
								if (y) if (d.p.lastsort == t && d.p.sortorder == y && !w) return;
								else d.p.sortorder = y;
								w = d.grid.headers[d.p.lastsort].el;
								y = d.grid.headers[t].el;
								a("span.ui-grid-ico-sort", w).addClass("ui-state-disabled");
								a(w).attr("aria-selected", "false");
								a("span.ui-icon-" + d.p.sortorder, y).removeClass("ui-state-disabled");
								a(y).attr("aria-selected", "true");
								if (!d.p.viewsortcols[0]) if (d.p.lastsort != t) {
									a("span.s-ico", w).hide();
									a("span.s-ico", y).show()
								}
								s = s.substring(5 + d.p.id.length + 1);
								d.p.sortname = d.p.colModel[t].index || s;
								w = d.p.sortorder;
								if (a.isFunction(d.p.onSortCol)) if (d.p.onSortCol.call(d, s, t, w) == "stop") {
									d.p.lastsort = t;
									return
								}
								if (d.p.datatype == "local") d.p.deselectAfterSort && a(d).jqGrid("resetSelection");
								else {
									d.p.selrow = null;
									d.p.multiselect && ea(false);
									d.p.selarrrow = [];
									d.p.savedRow = []
								}
								if (d.p.scroll) {
									w = d.grid.bDiv.scrollLeft;
									A(d.grid.bDiv, true, false);
									d.grid.hDiv.scrollLeft = w
								}
								d.p.subGrid && d.p.datatype == "local" && a("td.sgexpanded", "#" + a.jgrid.jqID(d.p.id)).each(function () {
									a(this).trigger("click")
								});
								ia();
								d.p.lastsort = t;
								if (d.p.sortname != s && t) d.p.lastsort = t
							}
						},
                            xa = function (s) {
                            	var t, w = {},
                                    y = n ? 0 : d.p.cellLayout;
                            	for (t = w[0] = w[1] = w[2] = 0; t <= s; t++) if (d.p.colModel[t].hidden === false) w[0] += d.p.colModel[t].width + y;
                            	if (d.p.direction == "rtl") w[0] = d.p.width - w[0];
                            	w[0] -= d.grid.bDiv.scrollLeft;
                            	if (a(d.grid.cDiv).is(":visible")) w[1] += a(d.grid.cDiv).height() + parseInt(a(d.grid.cDiv).css("padding-top"), 10) + parseInt(a(d.grid.cDiv).css("padding-bottom"), 10);
                            	if (d.p.toolbar[0] === true && (d.p.toolbar[1] == "top" || d.p.toolbar[1] == "both")) w[1] += a(d.grid.uDiv).height() + parseInt(a(d.grid.uDiv).css("border-top-width"), 10) + parseInt(a(d.grid.uDiv).css("border-bottom-width"), 10);
                            	if (d.p.toppager) w[1] += a(d.grid.topDiv).height() + parseInt(a(d.grid.topDiv).css("border-bottom-width"), 10);
                            	w[2] += a(d.grid.bDiv).height() + a(d.grid.hDiv).height();
                            	return w
                            },
                            Ba = function (s) {
                            	var t, w = d.grid.headers,
                                    y = a.jgrid.getCellIndex(s);
                            	for (t = 0; t < w.length; t++) if (s === w[t].el) {
                            		y = t;
                            		break
                            	}
                            	return y
                            };
						this.p.id = this.id;
						if (a.inArray(d.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) == -1) d.p.multikey = false;
						d.p.keyIndex = false;
						for (h = 0; h < d.p.colModel.length; h++) {
							d.p.colModel[h] = a.extend(true, {}, d.p.cmTemplate, d.p.colModel[h].template || {}, d.p.colModel[h]);
							if (d.p.keyIndex === false && d.p.colModel[h].key === true) d.p.keyIndex = h
						}
						d.p.sortorder = d.p.sortorder.toLowerCase();
						if (d.p.grouping === true) {
							d.p.scroll = false;
							d.p.rownumbers = false;
							d.p.subGrid = false;
							d.p.treeGrid = false;
							d.p.gridview = true
						}
						if (this.p.treeGrid === true) {
							try {
								a(this).jqGrid("setTreeGrid")
							} catch (Ca) { }
							if (d.p.datatype != "local") d.p.localReader = {
								id: "_id_"
							}
						}
						if (this.p.subGrid) try {
							a(d).jqGrid("setSubGrid")
						} catch (Fa) { }
						if (this.p.multiselect) {
							this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>");
							this.p.colModel.unshift({
								name: "cb",
								width: n ? d.p.multiselectWidth + d.p.cellLayout : d.p.multiselectWidth,
								sortable: false,
								resizable: false,
								hidedlg: true,
								search: false,
								align: "center",
								fixed: true
							})
						}
						if (this.p.rownumbers) {
							this.p.colNames.unshift("");
							this.p.colModel.unshift({
								name: "rn",
								width: d.p.rownumWidth,
								sortable: false,
								resizable: false,
								hidedlg: true,
								search: false,
								align: "center",
								fixed: true
							})
						}
						d.p.xmlReader = a.extend(true, {
							root: "rows",
							row: "row",
							page: "rows>page",
							total: "rows>total",
							records: "rows>records",
							repeatitems: true,
							cell: "cell",
							id: "[id]",
							userdata: "userdata",
							subgrid: {
								root: "rows",
								row: "row",
								repeatitems: true,
								cell: "cell"
							}
						}, d.p.xmlReader);
						d.p.jsonReader = a.extend(true, {
							root: "rows",
							page: "page",
							total: "total",
							records: "records",
							repeatitems: true,
							cell: "cell",
							id: "id",
							userdata: "userdata",
							subgrid: {
								root: "rows",
								repeatitems: true,
								cell: "cell"
							}
						}, d.p.jsonReader);
						d.p.localReader = a.extend(true, {
							root: "rows",
							page: "page",
							total: "total",
							records: "records",
							repeatitems: false,
							cell: "cell",
							id: "id",
							userdata: "userdata",
							subgrid: {
								root: "rows",
								repeatitems: true,
								cell: "cell"
							}
						}, d.p.localReader);
						if (d.p.scroll) {
							d.p.pgbuttons = false;
							d.p.pginput = false;
							d.p.rowList = []
						}
						d.p.data.length && B();
						var qa = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                            F, G, W, P, Z, R, N, da;
						G = da = "";
						if (d.p.shrinkToFit === true && d.p.forceFit === true) for (h = d.p.colModel.length - 1; h >= 0; h--) if (!d.p.colModel[h].hidden) {
							d.p.colModel[h].resizable = false;
							break
						}
						if (d.p.viewsortcols[1] == "horizontal") {
							da = " ui-i-asc";
							G = " ui-i-desc"
						}
						F = l ? "class='ui-th-div-ie'" : "";
						da = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + da + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + i + "'></span>";
						da += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + G + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + i + "'></span></span>";
						for (h = 0; h < this.p.colNames.length; h++) {
							G = d.p.headertitles ? ' title="' + a.jgrid.stripHtml(d.p.colNames[h]) + '"' : "";
							qa += "<th id='" + d.p.id + "_" + d.p.colModel[h].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + i + "'" + G + ">";
							G = d.p.colModel[h].index || d.p.colModel[h].name;
							qa += "<div id='jqgh_" + d.p.id + "_" + d.p.colModel[h].name + "' " + F + ">" + d.p.colNames[h];
							d.p.colModel[h].width = d.p.colModel[h].width ? parseInt(d.p.colModel[h].width, 10) : 150;
							if (typeof d.p.colModel[h].title !== "boolean") d.p.colModel[h].title = true;
							if (G == d.p.sortname) d.p.lastsort = h;
							qa += da + "</div></th>"
						}
						qa += "</tr></thead>";
						da = null;
						a(this).append(qa);
						a("thead tr:first th", this).hover(function () {
							a(this).addClass("ui-state-hover")
						}, function () {
							a(this).removeClass("ui-state-hover")
						});
						if (this.p.multiselect) {
							var U = [],
                                pa;
							a("#cb_" + a.jgrid.jqID(d.p.id), this).bind("click", function () {
								d.p.selarrrow = [];
								var s = d.p.frozenColumns === true ? d.p.id + "_frozen" : "";
								if (this.checked) {
									a(d.rows).each(function (t) {
										if (t > 0) if (!a(this).hasClass("ui-subgrid") && !a(this).hasClass("jqgroup") && !a(this).hasClass("ui-state-disabled")) {
											a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + a.jgrid.jqID(this.id))[d.p.useProp ? "prop" : "attr"]("checked", true);
											a(this).addClass("ui-state-highlight").attr("aria-selected", "true");
											d.p.selarrrow.push(this.id);
											d.p.selrow = this.id;
											if (s) {
												a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + a.jgrid.jqID(this.id), d.grid.fbDiv)[d.p.useProp ? "prop" : "attr"]("checked", true);
												a("#" + a.jgrid.jqID(this.id), d.grid.fbDiv).addClass("ui-state-highlight")
											}
										}
									});
									pa = true;
									U = []
								} else {
									a(d.rows).each(function (t) {
										if (t > 0) if (!a(this).hasClass("ui-subgrid") && !a(this).hasClass("ui-state-disabled")) {
											a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + a.jgrid.jqID(this.id))[d.p.useProp ? "prop" : "attr"]("checked", false);
											a(this).removeClass("ui-state-highlight").attr("aria-selected", "false");
											U.push(this.id);
											if (s) {
												a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + a.jgrid.jqID(this.id), d.grid.fbDiv)[d.p.useProp ? "prop" : "attr"]("checked", false);
												a("#" + a.jgrid.jqID(this.id), d.grid.fbDiv).removeClass("ui-state-highlight")
											}
										}
									});
									d.p.selrow = null;
									pa = false
								}
								if (a.isFunction(d.p.onSelectAll)) d.p.onSelectAll.call(d, pa ? d.p.selarrrow : U, pa)
							})
						}
						if (d.p.autowidth === true) {
							qa = a(o).innerWidth();
							d.p.width = qa > 0 ? qa : "nw"
						} (function () {
							var s = 0,
                                t = n ? 0 : d.p.cellLayout,
                                w = 0,
                                y, E = d.p.scrollOffset,
                                T, I = false,
                                Q, O = 0,
                                K = 0,
                                M;
							a.each(d.p.colModel, function () {
								if (typeof this.hidden === "undefined") this.hidden = false;
								this.widthOrg = T = j(this.width, 0);
								if (this.hidden === false) {
									s += T + t;
									if (this.fixed) O += T + t;
									else w++;
									K++
								}
							});
							if (isNaN(d.p.width)) d.p.width = g.width = s;
							else g.width = d.p.width;
							d.p.tblwidth = s;
							if (d.p.shrinkToFit === false && d.p.forceFit === true) d.p.forceFit = false;
							if (d.p.shrinkToFit === true && w > 0) {
								Q = g.width - t * w - O;
								if (!isNaN(d.p.height)) {
									Q -= E;
									I = true
								}
								s = 0;
								a.each(d.p.colModel, function (H) {
									if (this.hidden === false && !this.fixed) {
										this.width = T = Math.round(Q * this.width / (d.p.tblwidth - t * w - O));
										s += T;
										y = H
									}
								});
								M = 0;
								if (I) {
									if (g.width - O - (s + t * w) !== E) M = g.width - O - (s + t * w) - E
								} else if (!I && Math.abs(g.width - O - (s + t * w)) !== 1) M = g.width - O - (s + t * w);
								d.p.colModel[y].width += M;
								d.p.tblwidth = s + M + t * w + O;
								if (d.p.tblwidth > d.p.width) {
									d.p.colModel[y].width -= d.p.tblwidth - parseInt(d.p.width, 10);
									d.p.tblwidth = d.p.width
								}
							}
						})();
						a(o).css("width", g.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + d.p.id + "'>&#160;</div>");
						a(k).css("width", g.width + "px");
						qa = a("thead:first", d).get(0);
						var $ = "";
						if (d.p.footerrow) $ += "<table role='grid' style='width:" + d.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + i + "'>";
						k = a("tr:first", qa);
						var sa = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
						d.p.disableClick = false;
						a("th", k).each(function (s) {
							W = d.p.colModel[s].width;
							if (typeof d.p.colModel[s].resizable === "undefined") d.p.colModel[s].resizable = true;
							if (d.p.colModel[s].resizable) {
								P = document.createElement("span");
								a(P).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + i);
								a.browser.opera || a(P).css("cursor", "col-resize");
								a(this).addClass(d.p.resizeclass)
							} else P = "";
							a(this).css("width", W + "px").prepend(P);
							var t = "";
							if (d.p.colModel[s].hidden) {
								a(this).css("display", "none");
								t = "display:none;"
							}
							sa += "<td role='gridcell' style='height:0px;width:" + W + "px;" + t + "'></td>";
							g.headers[s] = {
								width: W,
								el: this
							};
							Z = d.p.colModel[s].sortable;
							if (typeof Z !== "boolean") Z = d.p.colModel[s].sortable = true;
							t = d.p.colModel[s].name;
							t == "cb" || t == "subgrid" || t == "rn" || d.p.viewsortcols[2] && a(">div", this).addClass("ui-jqgrid-sortable");
							if (Z) if (d.p.viewsortcols[0]) {
								a("div span.s-ico", this).show();
								s == d.p.lastsort && a("div span.ui-icon-" + d.p.sortorder, this).removeClass("ui-state-disabled")
							} else if (s == d.p.lastsort) {
								a("div span.s-ico", this).show();
								a("div span.ui-icon-" + d.p.sortorder, this).removeClass("ui-state-disabled")
							}
							if (d.p.footerrow) $ += "<td role='gridcell' " + v(s, 0, "", null, "", false) + ">&#160;</td>"
						}).mousedown(function (s) {
							if (a(s.target).closest("th>span.ui-jqgrid-resize").length == 1) {
								var t = Ba(this);
								if (d.p.forceFit === true) {
									var w = d.p,
                                        y = t,
                                        E;
									for (E = t + 1; E < d.p.colModel.length; E++) if (d.p.colModel[E].hidden !== true) {
										y = E;
										break
									}
									w.nv = y - t
								}
								g.dragStart(t, s, xa(t));
								return false
							}
						}).click(function (s) {
							if (d.p.disableClick) return d.p.disableClick = false;
							var t = "th>div.ui-jqgrid-sortable",
                                w, y;
							d.p.viewsortcols[2] || (t = "th>div>span>span.ui-grid-ico-sort");
							s = a(s.target).closest(t);
							if (s.length == 1) {
								t = Ba(this);
								if (!d.p.viewsortcols[2]) {
									w = true;
									y = s.attr("sort")
								}
								wa(a("div", this)[0].id, t, w, y);
								return false
							}
						});
						if (d.p.sortable && a.fn.sortable) try {
							a(d).jqGrid("sortableColumns", k)
						} catch (fa) { }
						if (d.p.footerrow) $ += "</tr></tbody></table>";
						sa += "</tr>";
						this.appendChild(document.createElement("tbody"));
						a(this).addClass("ui-jqgrid-btable").append(sa);
						sa = null;
						k = a("<table class='ui-jqgrid-htable' style='width:" + d.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(qa);
						var ta = d.p.caption && d.p.hiddengrid === true ? true : false;
						h = a("<div class='ui-jqgrid-hbox" + (i == "rtl" ? "-rtl" : "") + "'></div>");
						qa = null;
						g.hDiv = document.createElement("div");
						a(g.hDiv).css({
							width: g.width + "px"
						}).addClass("ui-state-default ui-jqgrid-hdiv").append(h);
						a(h).append(k);
						k = null;
						ta && a(g.hDiv).hide();
						if (d.p.pager) {
							if (typeof d.p.pager == "string") {
								if (d.p.pager.substr(0, 1) != "#") d.p.pager = "#" + d.p.pager
							} else d.p.pager = "#" + a(d.p.pager).attr("id");
							a(d.p.pager).css({
								width: g.width + "px"
							}).appendTo(o).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
							ta && a(d.p.pager).hide();
							m(d.p.pager, "")
						}
						d.p.cellEdit === false && d.p.hoverrows === true && a(d).bind("mouseover", function (s) {
							N = a(s.target).closest("tr.jqgrow");
							a(N).attr("class") !== "ui-subgrid" && a(N).addClass("ui-state-hover")
						}).bind("mouseout", function (s) {
							N = a(s.target).closest("tr.jqgrow");
							a(N).removeClass("ui-state-hover")
						});
						var ja, na;
						a(d).before(g.hDiv).click(function (s) {
							R = s.target;
							N = a(R, d.rows).closest("tr.jqgrow");
							if (a(N).length === 0 || N[0].className.indexOf("ui-state-disabled") > -1 || a(R, d).closest("table.ui-jqgrid-btable")[0].id.replace("_frozen", "") !== d.id) return this;
							var t = a(R).hasClass("cbox"),
                                w = true;
							if (a.isFunction(d.p.beforeSelectRow)) w = d.p.beforeSelectRow.call(d, N[0].id, s);
							if (R.tagName == "A" || (R.tagName == "INPUT" || R.tagName == "TEXTAREA" || R.tagName == "OPTION" || R.tagName == "SELECT") && !t) return this;
							if (w === true) {
								if (d.p.cellEdit === true) if (d.p.multiselect && t) a(d).jqGrid("setSelection", N[0].id, true);
								else {
									ja = N[0].rowIndex;
									na = a.jgrid.getCellIndex(R);
									try {
										a(d).jqGrid("editCell", ja, na, true)
									} catch (y) { }
								} else if (d.p.multikey) if (s[d.p.multikey]) a(d).jqGrid("setSelection", N[0].id, true);
								else {
									if (d.p.multiselect && t) {
										t = a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + N[0].id).is(":checked");
										a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + N[0].id)[d.p.useProp ? "prop" : "attr"]("checked", t)
									}
								} else {
									if (d.p.multiselect && d.p.multiboxonly) if (!t) {
										var E = d.p.frozenColumns ? d.p.id + "_frozen" : "";
										a(d.p.selarrrow).each(function (T, I) {
											var Q = d.rows.namedItem(I);
											a(Q).removeClass("ui-state-highlight");
											a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + a.jgrid.jqID(I))[d.p.useProp ? "prop" : "attr"]("checked", false);
											if (E) {
												a("#" + a.jgrid.jqID(I), "#" + a.jgrid.jqID(E)).removeClass("ui-state-highlight");
												a("#jqg_" + a.jgrid.jqID(d.p.id) + "_" + a.jgrid.jqID(I), "#" + a.jgrid.jqID(E))[d.p.useProp ? "prop" : "attr"]("checked", false)
											}
										});
										d.p.selarrrow = []
									}
									a(d).jqGrid("setSelection", N[0].id, true)
								}
								if (a.isFunction(d.p.onCellSelect)) {
									ja = N[0].id;
									na = a.jgrid.getCellIndex(R);
									d.p.onCellSelect.call(d, ja, na, a(R).html(), s)
								}
							}
							return this
						}).bind("reloadGrid", function (s, t) {
							if (d.p.treeGrid === true) d.p.datatype = d.p.treedatatype;
							t && t.current && d.grid.selectionPreserver(d);
							if (d.p.datatype == "local") {
								a(d).jqGrid("resetSelection");
								d.p.data.length && B()
							} else if (!d.p.treeGrid) {
								d.p.selrow = null;
								if (d.p.multiselect) {
									d.p.selarrrow = [];
									ea(false)
								}
								d.p.savedRow = []
							}
							d.p.scroll && A(d.grid.bDiv, true, false);
							if (t && t.page) {
								var w = t.page;
								if (w > d.p.lastpage) w = d.p.lastpage;
								if (w < 1) w = 1;
								d.p.page = w;
								d.grid.bDiv.scrollTop = d.grid.prevRowHeight ? (w - 1) * d.grid.prevRowHeight * d.p.rowNum : 0
							}
							if (d.grid.prevRowHeight && d.p.scroll) {
								delete d.p.lastpage;
								d.grid.populateVisible()
							} else d.grid.populate();
							return false
						});
						a.isFunction(this.p.ondblClickRow) && a(this).dblclick(function (s) {
							R = s.target;
							N = a(R, d.rows).closest("tr.jqgrow");
							if (a(N).length === 0) return false;
							ja = N[0].rowIndex;
							na = a.jgrid.getCellIndex(R);
							d.p.ondblClickRow.call(d, a(N).attr("id"), ja, na, s);
							return false
						});
						a.isFunction(this.p.onRightClickRow) && a(this).bind("contextmenu", function (s) {
							R = s.target;
							N = a(R, d.rows).closest("tr.jqgrow");
							if (a(N).length === 0) return false;
							d.p.multiselect || a(d).jqGrid("setSelection", N[0].id, true);
							ja = N[0].rowIndex;
							na = a.jgrid.getCellIndex(R);
							d.p.onRightClickRow.call(d, a(N).attr("id"), ja, na, s);
							return false
						});
						g.bDiv = document.createElement("div");
						if (l) if (String(d.p.height).toLowerCase() === "auto") d.p.height = "100%";
						a(g.bDiv).append(a('<div style="position:relative;' + (l && a.browser.version < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({
							height: d.p.height + (isNaN(d.p.height) ? "" : "px"),
							width: g.width + "px"
						}).scroll(g.scrollGrid);
						a("table:first", g.bDiv).css({
							width: d.p.tblwidth + "px"
						});
						if (l) {
							a("tbody", this).size() == 2 && a("tbody:gt(0)", this).remove();
							d.p.multikey && a(g.bDiv).bind("selectstart", function () {
								return false
							})
						} else d.p.multikey && a(g.bDiv).bind("mousedown", function () {
							return false
						});
						ta && a(g.bDiv).hide();
						g.cDiv = document.createElement("div");
						var Ga = d.p.hidegrid === true ? a("<a role='link' href='javascript:void(0)'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").hover(function () {
							Ga.addClass("ui-state-hover")
						}, function () {
							Ga.removeClass("ui-state-hover")
						}).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css(i == "rtl" ? "left" : "right", "0px") : "";
						a(g.cDiv).append(Ga).append("<span class='ui-jqgrid-title" + (i == "rtl" ? "-rtl" : "") + "'>" + d.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");
						a(g.cDiv).insertBefore(g.hDiv);
						if (d.p.toolbar[0]) {
							g.uDiv = document.createElement("div");
							if (d.p.toolbar[1] == "top") a(g.uDiv).insertBefore(g.hDiv);
							else d.p.toolbar[1] == "bottom" && a(g.uDiv).insertAfter(g.hDiv);
							if (d.p.toolbar[1] == "both") {
								g.ubDiv = document.createElement("div");
								a(g.uDiv).insertBefore(g.hDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id);
								a(g.ubDiv).insertAfter(g.hDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id);
								ta && a(g.ubDiv).hide()
							} else a(g.uDiv).width(g.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id);
							ta && a(g.uDiv).hide()
						}
						if (d.p.toppager) {
							d.p.toppager = a.jgrid.jqID(d.p.id) + "_toppager";
							g.topDiv = a("<div id='" + d.p.toppager + "'></div>")[0];
							d.p.toppager = "#" + d.p.toppager;
							a(g.topDiv).insertBefore(g.hDiv).addClass("ui-state-default ui-jqgrid-toppager").width(g.width);
							m(d.p.toppager, "_t")
						}
						if (d.p.footerrow) {
							g.sDiv = a("<div class='ui-jqgrid-sdiv'></div>")[0];
							h = a("<div class='ui-jqgrid-hbox" + (i == "rtl" ? "-rtl" : "") + "'></div>");
							a(g.sDiv).append(h).insertAfter(g.hDiv).width(g.width);
							a(h).append($);
							g.footers = a(".ui-jqgrid-ftable", g.sDiv)[0].rows[0].cells;
							if (d.p.rownumbers) g.footers[0].className = "ui-state-default jqgrid-rownum";
							ta && a(g.sDiv).hide()
						}
						h = null;
						if (d.p.caption) {
							var Aa = d.p.datatype;
							if (d.p.hidegrid === true) {
								a(".ui-jqgrid-titlebar-close", g.cDiv).click(function (s) {
									var t = a.isFunction(d.p.onHeaderClick),
                                        w = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                        y, E = this;
									if (d.p.toolbar[0] === true) {
										if (d.p.toolbar[1] == "both") w += ", #" + a(g.ubDiv).attr("id");
										w += ", #" + a(g.uDiv).attr("id")
									}
									y = a(w, "#gview_" + a.jgrid.jqID(d.p.id)).length;
									if (d.p.gridstate == "visible") a(w, "#gbox_" + a.jgrid.jqID(d.p.id)).slideUp("fast", function () {
										y--;
										if (y === 0) {
											a("span", E).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
											d.p.gridstate = "hidden";
											a("#gbox_" + a.jgrid.jqID(d.p.id)).hasClass("ui-resizable") && a(".ui-resizable-handle", "#gbox_" + a.jgrid.jqID(d.p.id)).hide();
											if (t) ta || d.p.onHeaderClick.call(d, d.p.gridstate, s)
										}
									});
									else d.p.gridstate == "hidden" && a(w, "#gbox_" + a.jgrid.jqID(d.p.id)).slideDown("fast", function () {
										y--;
										if (y === 0) {
											a("span", E).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
											if (ta) {
												d.p.datatype = Aa;
												ia();
												ta = false
											}
											d.p.gridstate = "visible";
											a("#gbox_" + a.jgrid.jqID(d.p.id)).hasClass("ui-resizable") && a(".ui-resizable-handle", "#gbox_" + a.jgrid.jqID(d.p.id)).show();
											if (t) ta || d.p.onHeaderClick.call(d, d.p.gridstate, s)
										}
									});
									return false
								});
								if (ta) {
									d.p.datatype = "local";
									a(".ui-jqgrid-titlebar-close", g.cDiv).trigger("click")
								}
							}
						} else a(g.cDiv).hide();
						a(g.hDiv).after(g.bDiv).mousemove(function (s) {
							if (g.resizing) {
								g.dragMove(s);
								return false
							}
						});
						a(".ui-jqgrid-labels", g.hDiv).bind("selectstart", function () {
							return false
						});
						a(document).mouseup(function () {
							if (g.resizing) {
								g.dragEnd();
								return false
							}
							return true
						});
						d.formatCol = v;
						d.sortData = wa;
						d.updatepager = function (s, t) {
							var w, y, E, T, I, Q, O, K = "",
                                M = d.p.pager ? "_" + a.jgrid.jqID(d.p.pager.substr(1)) : "",
                                H = d.p.toppager ? "_" + d.p.toppager.substr(1) : "";
							E = parseInt(d.p.page, 10) - 1;
							if (E < 0) E = 0;
							E *= parseInt(d.p.rowNum, 10);
							I = E + d.p.reccount;
							if (d.p.scroll) {
								w = a("tbody:first > tr:gt(0)", d.grid.bDiv);
								E = I - w.length;
								d.p.reccount = w.length;
								if (y = w.outerHeight() || d.grid.prevRowHeight) {
									w = E * y;
									y *= parseInt(d.p.records, 10);
									a(">div:first", d.grid.bDiv).css({
										height: y
									}).children("div:first").css({
										height: w,
										display: w ? "" : "none"
									})
								}
								d.grid.bDiv.scrollLeft = d.grid.hDiv.scrollLeft
							}
							K = d.p.pager ? d.p.pager : "";
							K += d.p.toppager ? K ? "," + d.p.toppager : d.p.toppager : "";
							if (K) {
								O = a.jgrid.formatter.integer || {};
								w = j(d.p.page);
								y = j(d.p.lastpage);
								a(".selbox", K)[this.p.useProp ? "prop" : "attr"]("disabled", false);
								if (d.p.pginput === true) {
									a(".ui-pg-input", K).val(d.p.page);
									T = d.p.toppager ? "#sp_1" + M + ",#sp_1" + H : "#sp_1" + M;
									a(T).html(a.fmatter ? a.fmatter.util.NumberFormat(d.p.lastpage, O) : d.p.lastpage)
								}
								if (d.p.viewrecords) if (d.p.reccount === 0) a(".ui-paging-info", K).html(d.p.emptyrecords);
								else {
									T = E + 1;
									Q = d.p.records;
									if (a.fmatter) {
										T = a.fmatter.util.NumberFormat(T, O);
										I = a.fmatter.util.NumberFormat(I, O);
										Q = a.fmatter.util.NumberFormat(Q, O)
									}
									a(".ui-paging-info", K).html(a.jgrid.format(d.p.recordtext, T, I, Q))
								}
								if (d.p.pgbuttons === true) {
									if (w <= 0) w = y = 0;
									if (w == 1 || w === 0) {
										a("#first" + M + ", #prev" + M).addClass("ui-state-disabled").removeClass("ui-state-hover");
										d.p.toppager && a("#first_t" + H + ", #prev_t" + H).addClass("ui-state-disabled").removeClass("ui-state-hover")
									} else {
										a("#first" + M + ", #prev" + M).removeClass("ui-state-disabled");
										d.p.toppager && a("#first_t" + H + ", #prev_t" + H).removeClass("ui-state-disabled")
									}
									if (w == y || w === 0) {
										a("#next" + M + ", #last" + M).addClass("ui-state-disabled").removeClass("ui-state-hover");
										d.p.toppager && a("#next_t" + H + ", #last_t" + H).addClass("ui-state-disabled").removeClass("ui-state-hover")
									} else {
										a("#next" + M + ", #last" + M).removeClass("ui-state-disabled");
										d.p.toppager && a("#next_t" + H + ", #last_t" + H).removeClass("ui-state-disabled")
									}
								}
							}
							s === true && d.p.rownumbers === true && a("td.jqgrid-rownum", d.rows).each(function (X) {
								a(this).html(E + 1 + X)
							});
							t && d.p.jqgdnd && a(d).jqGrid("gridDnD", "updateDnD");
							a.isFunction(d.p.gridComplete) && d.p.gridComplete.call(d);
							a.isFunction(d.p._complete) && d.p._complete.call(d)
						};
						d.refreshIndex = B;
						d.setHeadCheckBox = ea;
						d.formatter = function (s, t, w, y, E) {
							return p(s, t, w, y, E)
						};
						a.extend(g, {
							populate: ia,
							emptyRows: A
						});
						this.grid = g;
						d.addXmlData = function (s) {
							J(s, d.grid.bDiv)
						};
						d.addJSONData = function (s) {
							z(s, d.grid.bDiv)
						};
						this.grid.cols = this.rows[0].cells;
						ia();
						d.p.hiddengrid = false;
						a(window).unload(function () {
							d = null
						})
					}
				}
			}
		})
	};
	a.jgrid.extend({
		getGridParam: function (c) {
			var e = this[0];
			if (e && e.grid) return c ? typeof e.p[c] != "undefined" ? e.p[c] : null : e.p
		},
		setGridParam: function (c) {
			return this.each(function () {
				this.grid && typeof c === "object" && a.extend(true, this.p, c)
			})
		},
		getDataIDs: function () {
			var c = [],
                e = 0,
                b, f = 0;
			this.each(function () {
				if ((b = this.rows.length) && b > 0) for (; e < b; ) {
					if (a(this.rows[e]).hasClass("jqgrow")) {
						c[f] = this.rows[e].id;
						f++
					}
					e++
				}
			});
			return c
		},
		setSelection: function (c, e) {
			return this.each(function () {
				function b(m) {
					var l = a(f.grid.bDiv)[0].clientHeight,
                        n = a(f.grid.bDiv)[0].scrollTop,
                        o = f.rows[m].offsetTop;
					m = f.rows[m].clientHeight;
					if (o + m >= l + n) a(f.grid.bDiv)[0].scrollTop = o - (l + n) + m + n;
					else if (o < l + n) if (o < n) a(f.grid.bDiv)[0].scrollTop = o
				}
				var f = this,
                    g, h, i, d, k;
				if (c !== undefined) {
					e = e === false ? false : true;
					h = f.rows.namedItem(c + "");
					if (!(!h || !h.className || h.className.indexOf("ui-state-disabled") > -1)) {
						if (f.p.scrollrows === true) {
							g = f.rows.namedItem(c).rowIndex;
							g >= 0 && b(g)
						}
						if (f.p.frozenColumns === true) k = f.p.id + "_frozen";
						if (f.p.multiselect) {
							f.setHeadCheckBox(false);
							f.p.selrow = h.id;
							i = a.inArray(f.p.selrow, f.p.selarrrow);
							if (i === -1) {
								h.className !== "ui-subgrid" && a(h).addClass("ui-state-highlight").attr("aria-selected", "true");
								g = true;
								a("#jqg_" + a.jgrid.jqID(f.p.id) + "_" + a.jgrid.jqID(f.p.selrow))[f.p.useProp ? "prop" : "attr"]("checked", g);
								f.p.selarrrow.push(f.p.selrow)
							} else {
								h.className !== "ui-subgrid" && a(h).removeClass("ui-state-highlight").attr("aria-selected", "false");
								g = false;
								a("#jqg_" + a.jgrid.jqID(f.p.id) + "_" + a.jgrid.jqID(f.p.selrow))[f.p.useProp ? "prop" : "attr"]("checked", g);
								f.p.selarrrow.splice(i, 1);
								d = f.p.selarrrow[0];
								f.p.selrow = d === undefined ? null : d
							}
							if (k) {
								i === -1 ? a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(k)).addClass("ui-state-highlight") : a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(k)).removeClass("ui-state-highlight");
								a("#jqg_" + a.jgrid.jqID(f.p.id) + "_" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(k))[f.p.useProp ? "prop" : "attr"]("checked", g)
							}
							f.p.onSelectRow && e && f.p.onSelectRow.call(f, h.id, g)
						} else if (h.className !== "ui-subgrid") {
							if (f.p.selrow != h.id) {
								a(f.rows.namedItem(f.p.selrow)).removeClass("ui-state-highlight").attr({
									"aria-selected": "false",
									tabindex: "-1"
								});
								a(h).addClass("ui-state-highlight").attr({
									"aria-selected": "true",
									tabindex: "0"
								});
								if (k) {
									a("#" + a.jgrid.jqID(f.p.selrow), "#" + a.jgrid.jqID(k)).removeClass("ui-state-highlight");
									a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(k)).addClass("ui-state-highlight")
								}
								g = true
							} else g = false;
							f.p.selrow = h.id;
							f.p.onSelectRow && e && f.p.onSelectRow.call(f, h.id, g)
						}
					}
				}
			})
		},
		resetSelection: function (c) {
			return this.each(function () {
				var e = this,
                    b, f;
				if (typeof c !== "undefined") {
					f = c === e.p.selrow ? e.p.selrow : c;
					a("#" + a.jgrid.jqID(e.p.id) + " tbody:first tr#" + a.jgrid.jqID(f)).removeClass("ui-state-highlight").attr("aria-selected", "false");
					if (e.p.multiselect) {
						a("#jqg_" + a.jgrid.jqID(e.p.id) + "_" + a.jgrid.jqID(f))[e.p.useProp ? "prop" : "attr"]("checked", false);
						e.setHeadCheckBox(false)
					}
					f = null
				} else if (e.p.multiselect) {
					a(e.p.selarrrow).each(function (g, h) {
						b = e.rows.namedItem(h);
						a(b).removeClass("ui-state-highlight").attr("aria-selected", "false");
						a("#jqg_" + a.jgrid.jqID(e.p.id) + "_" + a.jgrid.jqID(h))[e.p.useProp ? "prop" : "attr"]("checked", false)
					});
					e.setHeadCheckBox(false);
					e.p.selarrrow = []
				} else if (e.p.selrow) {
					a("#" + a.jgrid.jqID(e.p.id) + " tbody:first tr#" + a.jgrid.jqID(e.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false");
					e.p.selrow = null
				}
				if (e.p.cellEdit === true) if (parseInt(e.p.iCol, 10) >= 0 && parseInt(e.p.iRow, 10) >= 0) {
					a("td:eq(" + e.p.iCol + ")", e.rows[e.p.iRow]).removeClass("edit-cell ui-state-highlight");
					a(e.rows[e.p.iRow]).removeClass("selected-row ui-state-hover")
				}
				e.p.savedRow = []
			})
		},
		getRowData: function (c) {
			var e = {},
                b, f = false,
                g, h = 0;
			this.each(function () {
				var i = this,
                    d, k;
				if (typeof c == "undefined") {
					f = true;
					b = [];
					g = i.rows.length
				} else {
					k = i.rows.namedItem(c);
					if (!k) return e;
					g = 2
				}
				for (; h < g; ) {
					if (f) k = i.rows[h];
					if (a(k).hasClass("jqgrow")) {
						a("td", k).each(function (m) {
							d = i.p.colModel[m].name;
							if (d !== "cb" && d !== "subgrid" && d !== "rn") if (i.p.treeGrid === true && d == i.p.ExpandColumn) e[d] = a.jgrid.htmlDecode(a("span:first", this).html());
							else try {
								e[d] = a.unformat(this, {
									rowId: k.id,
									colModel: i.p.colModel[m]
								}, m)
							} catch (l) {
								e[d] = a.jgrid.htmlDecode(a(this).html())
							}
						});
						if (f) {
							b.push(e);
							e = {}
						}
					}
					h++
				}
			});
			return b ? b : e
		},
		delRowData: function (c) {
			var e = false,
                b, f;
			this.each(function () {
				if (b = this.rows.namedItem(c)) {
					a(b).remove();
					this.p.records--;
					this.p.reccount--;
					this.updatepager(true, false);
					e = true;
					if (this.p.multiselect) {
						f = a.inArray(c, this.p.selarrrow);
						f != -1 && this.p.selarrrow.splice(f, 1)
					}
					if (c == this.p.selrow) this.p.selrow = null
				} else return false;
				if (this.p.datatype == "local") {
					var g = this.p._index[c];
					if (typeof g != "undefined") {
						this.p.data.splice(g, 1);
						this.refreshIndex()
					}
				}
				if (this.p.altRows === true && e) {
					var h = this.p.altclass;
					a(this.rows).each(function (i) {
						i % 2 == 1 ? a(this).addClass(h) : a(this).removeClass(h)
					})
				}
			});
			return e
		},
		setRowData: function (c, e, b) {
			var f, g = true,
                h;
			this.each(function () {
				if (!this.grid) return false;
				var i = this,
                    d, k, m = typeof b,
                    l = {};
				k = i.rows.namedItem(c);
				if (!k) return false;
				if (e) try {
					a(this.p.colModel).each(function (v) {
						f = this.name;
						if (e[f] !== undefined) {
							l[f] = this.formatter && typeof this.formatter === "string" && this.formatter == "date" ? a.unformat.date(e[f], this) : e[f];
							d = i.formatter(c, e[f], v, e, "edit");
							h = this.title ? {
								title: a.jgrid.stripHtml(d)
							} : {};
							i.p.treeGrid === true && f == i.p.ExpandColumn ? a("td:eq(" + v + ") > span:first", k).html(d).attr(h) : a("td:eq(" + v + ")", k).html(d).attr(h)
						}
					});
					if (i.p.datatype == "local") {
						var n = i.p._index[c];
						if (i.p.treeGrid) for (var o in i.p.treeReader) l.hasOwnProperty(i.p.treeReader[o]) && delete l[i.p.treeReader[o]];
						if (typeof n != "undefined") i.p.data[n] = a.extend(true, i.p.data[n], l);
						l = null
					}
				} catch (j) {
					g = false
				}
				if (g) {
					if (m === "string") a(k).addClass(b);
					else m === "object" && a(k).css(b);
					a.isFunction(i.p._complete) && i.p._complete.call(i)
				}
			});
			return g
		},
		addRowData: function (c, e, b, f) {
			b || (b = "last");
			var g = false,
                h, i, d, k, m, l, n, o, j = "",
                v, r, p, q, u;
			if (e) {
				if (a.isArray(e)) {
					v = true;
					b = "last";
					r = c
				} else {
					e = [e];
					v = false
				}
				this.each(function () {
					var x = e.length;
					m = this.p.rownumbers === true ? 1 : 0;
					d = this.p.multiselect === true ? 1 : 0;
					k = this.p.subGrid === true ? 1 : 0;
					if (!v) if (typeof c != "undefined") c += "";
					else {
						c = a.jgrid.randId();
						if (this.p.keyIndex !== false) {
							r = this.p.colModel[this.p.keyIndex + d + k + m].name;
							if (typeof e[0][r] != "undefined") c = e[0][r]
						}
					}
					p = this.p.altclass;
					for (var D = 0, C = "", A = {}, B = a.isFunction(this.p.afterInsertRow) ? true : false; D < x; ) {
						q = e[D];
						i = "";
						if (v) {
							try {
								c = q[r]
							} catch (J) {
								c = a.jgrid.randId()
							}
							C = this.p.altRows === true ? (this.rows.length - 1) % 2 === 0 ? p : "" : ""
						}
						c = this.p.idPrefix + c;
						if (m) {
							j = this.formatCol(0, 1, "", null, c, true);
							i += '<td role="gridcell" aria-describedby="' + this.p.id + '_rn" class="ui-state-default jqgrid-rownum" ' + j + ">0</td>"
						}
						if (d) {
							o = '<input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + c + '" class="cbox"/>';
							j = this.formatCol(m, 1, "", null, c, true);
							i += '<td role="gridcell" aria-describedby="' + this.p.id + '_cb" ' + j + ">" + o + "</td>"
						}
						if (k) i += a(this).jqGrid("addSubGridCell", d + m, 1);
						for (n = d + k + m; n < this.p.colModel.length; n++) {
							u = this.p.colModel[n];
							h = u.name;
							A[h] = u.formatter && typeof u.formatter === "string" && u.formatter == "date" ? a.unformat.date(q[h], u) : q[h];
							o = this.formatter(c, a.jgrid.getAccessor(q, h), n, q, "edit");
							j = this.formatCol(n, 1, o, q, c, true);
							i += '<td role="gridcell" aria-describedby="' + this.p.id + "_" + h + '" ' + j + ">" + o + "</td>"
						}
						i = '<tr id="' + c + '" role="row" tabindex="-1" class="ui-widget-content jqgrow ui-row-' + this.p.direction + " " + C + '">' + i + "</tr>";
						if (this.rows.length === 0) a("table:first", this.grid.bDiv).append(i);
						else switch (b) {
							case "last":
								a(this.rows[this.rows.length - 1]).after(i);
								l = this.rows.length - 1;
								break;
							case "first":
								a(this.rows[0]).after(i);
								l = 1;
								break;
							case "after":
								if (l = this.rows.namedItem(f)) a(this.rows[l.rowIndex + 1]).hasClass("ui-subgrid") ? a(this.rows[l.rowIndex + 1]).after(i) : a(l).after(i);
								l++;
								break;
							case "before":
								if (l = this.rows.namedItem(f)) {
									a(l).before(i);
									l = l.rowIndex
								}
								l--
						}
						this.p.subGrid === true && a(this).jqGrid("addSubGrid", d + m, l);
						this.p.records++;
						this.p.reccount++;
						B && this.p.afterInsertRow.call(this, c, q, q);
						D++;
						if (this.p.datatype == "local") {
							A[this.p.localReader.id] = c;
							this.p._index[c] = this.p.data.length;
							this.p.data.push(A);
							A = {}
						}
					}
					if (this.p.altRows === true && !v) if (b == "last") (this.rows.length - 1) % 2 == 1 && a(this.rows[this.rows.length - 1]).addClass(p);
					else a(this.rows).each(function (z) {
						z % 2 == 1 ? a(this).addClass(p) : a(this).removeClass(p)
					});
					this.updatepager(true, true);
					g = true
				})
			}
			return g
		},
		footerData: function (c, e, b) {
			function f(k) {
				for (var m in k) if (k.hasOwnProperty(m)) return false;
				return true
			}
			var g, h = false,
                i = {},
                d;
			if (typeof c == "undefined") c = "get";
			if (typeof b != "boolean") b = true;
			c = c.toLowerCase();
			this.each(function () {
				var k = this,
                    m;
				if (!k.grid || !k.p.footerrow) return false;
				if (c == "set") if (f(e)) return false;
				h = true;
				a(this.p.colModel).each(function (l) {
					g = this.name;
					if (c == "set") {
						if (e[g] !== undefined) {
							m = b ? k.formatter("", e[g], l, e, "edit") : e[g];
							d = this.title ? {
								title: a.jgrid.stripHtml(m)
							} : {};
							a("tr.footrow td:eq(" + l + ")", k.grid.sDiv).html(m).attr(d);
							h = true
						}
					} else if (c == "get") i[g] = a("tr.footrow td:eq(" + l + ")", k.grid.sDiv).html()
				})
			});
			return c == "get" ? i : h
		},
		showHideCol: function (c, e) {
			return this.each(function () {
				var b = this,
                    f = false,
                    g = a.browser.webkit || a.browser.safari ? 0 : b.p.cellLayout,
                    h;
				if (b.grid) {
					if (typeof c === "string") c = [c];
					e = e != "none" ? "" : "none";
					var i = e === "" ? true : false,
                        d = b.p.groupHeader && (typeof b.p.groupHeader === "object" || a.isFunction(b.p.groupHeader));
					d && a(b).jqGrid("destroyGroupHeader", false);
					a(this.p.colModel).each(function (k) {
						if (a.inArray(this.name, c) !== -1 && this.hidden === i) {
							if (b.p.frozenColumns === true && this.frozen === true) return true;
							a("tr", b.grid.hDiv).each(function () {
								a(this.cells[k]).css("display", e)
							});
							a(b.rows).each(function () {
								a(this.cells[k]).css("display", e)
							});
							b.p.footerrow && a("tr.footrow td:eq(" + k + ")", b.grid.sDiv).css("display", e);
							h = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
							if (e === "none") b.p.tblwidth -= h + g;
							else b.p.tblwidth += h + g;
							this.hidden = !i;
							f = true
						}
					});
					if (f === true) a(b).jqGrid("setGridWidth", b.p.shrinkToFit === true ? b.p.tblwidth : b.p.width);
					d && a(b).jqGrid("setGroupHeaders", b.p.groupHeader)
				}
			})
		},
		hideCol: function (c) {
			return this.each(function () {
				a(this).jqGrid("showHideCol", c, "none")
			})
		},
		showCol: function (c) {
			return this.each(function () {
				a(this).jqGrid("showHideCol", c, "")
			})
		},
		remapColumns: function (c, e, b) {
			function f(i) {
				var d;
				d = i.length ? a.makeArray(i) : a.extend({}, i);
				a.each(c, function (k) {
					i[k] = d[this]
				})
			}
			function g(i, d) {
				a(">tr" + (d || ""), i).each(function () {
					var k = this,
                        m = a.makeArray(k.cells);
					a.each(c, function () {
						var l = m[this];
						l && k.appendChild(l)
					})
				})
			}
			var h = this.get(0);
			f(h.p.colModel);
			f(h.p.colNames);
			f(h.grid.headers);
			g(a("thead:first", h.grid.hDiv), b && ":not(.ui-jqgrid-labels)");
			e && g(a("#" + a.jgrid.jqID(h.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
			h.p.footerrow && g(a("tbody:first", h.grid.sDiv));
			if (h.p.remapColumns) if (h.p.remapColumns.length) f(h.p.remapColumns);
			else h.p.remapColumns = a.makeArray(c);
			h.p.lastsort = a.inArray(h.p.lastsort, c);
			if (h.p.treeGrid) h.p.expColInd = a.inArray(h.p.expColInd, c)
		},
		setGridWidth: function (c, e) {
			return this.each(function () {
				if (this.grid) {
					var b = this,
                        f, g = 0,
                        h = a.browser.webkit || a.browser.safari ? 0 : b.p.cellLayout,
                        i, d = 0,
                        k = false,
                        m = b.p.scrollOffset,
                        l, n = 0,
                        o = 0,
                        j;
					if (typeof e != "boolean") e = b.p.shrinkToFit;
					if (!isNaN(c)) {
						c = parseInt(c, 10);
						b.grid.width = b.p.width = c;
						a("#gbox_" + a.jgrid.jqID(b.p.id)).css("width", c + "px");
						a("#gview_" + a.jgrid.jqID(b.p.id)).css("width", c + "px");
						a(b.grid.bDiv).css("width", c + "px");
						a(b.grid.hDiv).css("width", c + "px");
						b.p.pager && a(b.p.pager).css("width", c + "px");
						b.p.toppager && a(b.p.toppager).css("width", c + "px");
						if (b.p.toolbar[0] === true) {
							a(b.grid.uDiv).css("width", c + "px");
							b.p.toolbar[1] == "both" && a(b.grid.ubDiv).css("width", c + "px")
						}
						b.p.footerrow && a(b.grid.sDiv).css("width", c + "px");
						if (e === false && b.p.forceFit === true) b.p.forceFit = false;
						if (e === true) {
							a.each(b.p.colModel, function () {
								if (this.hidden === false) {
									f = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
									g += f + h;
									if (this.fixed) n += f + h;
									else d++;
									o++
								}
							});
							if (d === 0) return;
							b.p.tblwidth = g;
							l = c - h * d - n;
							if (!isNaN(b.p.height)) if (a(b.grid.bDiv)[0].clientHeight < a(b.grid.bDiv)[0].scrollHeight || b.rows.length === 1) {
								k = true;
								l -= m
							}
							g = 0;
							var v = b.grid.cols.length > 0;
							a.each(b.p.colModel, function (r) {
								if (this.hidden === false && !this.fixed) {
									f = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
									f = Math.round(l * f / (b.p.tblwidth - h * d - n));
									if (!(f < 0)) {
										this.width = f;
										g += f;
										b.grid.headers[r].width = f;
										b.grid.headers[r].el.style.width = f + "px";
										if (b.p.footerrow) b.grid.footers[r].style.width = f + "px";
										if (v) b.grid.cols[r].style.width = f + "px";
										i = r
									}
								}
							});
							if (!i) return;
							j = 0;
							if (k) {
								if (c - n - (g + h * d) !== m) j = c - n - (g + h * d) - m
							} else if (Math.abs(c - n - (g + h * d)) !== 1) j = c - n - (g + h * d);
							b.p.colModel[i].width += j;
							b.p.tblwidth = g + j + h * d + n;
							if (b.p.tblwidth > c) {
								k = b.p.tblwidth - parseInt(c, 10);
								b.p.tblwidth = c;
								f = b.p.colModel[i].width -= k
							} else f = b.p.colModel[i].width;
							b.grid.headers[i].width = f;
							b.grid.headers[i].el.style.width = f + "px";
							if (v) b.grid.cols[i].style.width = f + "px";
							if (b.p.footerrow) b.grid.footers[i].style.width = f + "px"
						}
						if (b.p.tblwidth) {
							a("table:first", b.grid.bDiv).css("width", b.p.tblwidth + "px");
							a("table:first", b.grid.hDiv).css("width", b.p.tblwidth + "px");
							b.grid.hDiv.scrollLeft = b.grid.bDiv.scrollLeft;
							b.p.footerrow && a("table:first", b.grid.sDiv).css("width", b.p.tblwidth + "px")
						}
					}
				}
			})
		},
		setGridHeight: function (c) {
			return this.each(function () {
				if (this.grid) {
					var e = a(this.grid.bDiv);
					e.css({
						height: c + (isNaN(c) ? "" : "px")
					});
					this.p.frozenColumns === true && a("#" + this.p.id + "_frozen").parent().height(e.height() - 16);
					this.p.height = c;
					this.p.scroll && this.grid.populateVisible()
				}
			})
		},
		setCaption: function (c) {
			return this.each(function () {
				this.p.caption = c;
				a("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(c);
				a(this.grid.cDiv).show()
			})
		},
		setLabel: function (c, e, b, f) {
			return this.each(function () {
				var g = -1;
				if (this.grid) if (typeof c != "undefined") {
					a(this.p.colModel).each(function (d) {
						if (this.name == c) {
							g = d;
							return false
						}
					});
					if (g >= 0) {
						var h = a("tr.ui-jqgrid-labels th:eq(" + g + ")", this.grid.hDiv);
						if (e) {
							var i = a(".s-ico", h);
							a("[id^=jqgh_]", h).empty().html(e).append(i);
							this.p.colNames[g] = e
						}
						if (b) typeof b === "string" ? a(h).addClass(b) : a(h).css(b);
						typeof f === "object" && a(h).attr(f)
					}
				}
			})
		},
		setCell: function (c, e, b, f, g, h) {
			return this.each(function () {
				var i = -1,
                    d, k;
				if (this.grid) {
					if (isNaN(e)) a(this.p.colModel).each(function (l) {
						if (this.name == e) {
							i = l;
							return false
						}
					});
					else i = parseInt(e, 10);
					if (i >= 0) if (d = this.rows.namedItem(c)) {
						var m = a("td:eq(" + i + ")", d);
						if (b !== "" || h === true) {
							d = this.formatter(c, b, i, d, "edit");
							k = this.p.colModel[i].title ? {
								title: a.jgrid.stripHtml(d)
							} : {};
							this.p.treeGrid && a(".tree-wrap", a(m)).length > 0 ? a("span", a(m)).html(d).attr(k) : a(m).html(d).attr(k);
							if (this.p.datatype == "local") {
								d = this.p.colModel[i];
								b = d.formatter && typeof d.formatter === "string" && d.formatter == "date" ? a.unformat.date(b, d) : b;
								k = this.p._index[c];
								if (typeof k != "undefined") this.p.data[k][d.name] = b
							}
						}
						if (typeof f === "string") a(m).addClass(f);
						else f && a(m).css(f);
						typeof g === "object" && a(m).attr(g)
					}
				}
			})
		},
		getCell: function (c, e) {
			var b = false;
			this.each(function () {
				var f = -1;
				if (this.grid) {
					if (isNaN(e)) a(this.p.colModel).each(function (i) {
						if (this.name === e) {
							f = i;
							return false
						}
					});
					else f = parseInt(e, 10);
					if (f >= 0) {
						var g = this.rows.namedItem(c);
						if (g) try {
							b = a.unformat(a("td:eq(" + f + ")", g), {
								rowId: g.id,
								colModel: this.p.colModel[f]
							}, f)
						} catch (h) {
							b = a.jgrid.htmlDecode(a("td:eq(" + f + ")", g).html())
						}
					}
				}
			});
			return b
		},
		getCol: function (c, e, b) {
			var f = [],
                g, h = 0,
                i, d, k;
			e = typeof e != "boolean" ? false : e;
			if (typeof b == "undefined") b = false;
			this.each(function () {
				var m = -1;
				if (this.grid) {
					if (isNaN(c)) a(this.p.colModel).each(function (j) {
						if (this.name === c) {
							m = j;
							return false
						}
					});
					else m = parseInt(c, 10);
					if (m >= 0) {
						var l = this.rows.length,
                            n = 0;
						if (l && l > 0) {
							for (; n < l; ) {
								if (a(this.rows[n]).hasClass("jqgrow")) {
									try {
										g = a.unformat(a(this.rows[n].cells[m]), {
											rowId: this.rows[n].id,
											colModel: this.p.colModel[m]
										}, m)
									} catch (o) {
										g = a.jgrid.htmlDecode(this.rows[n].cells[m].innerHTML)
									}
									if (b) {
										k = parseFloat(g);
										h += k;
										if (n === 0) d = i = k;
										else {
											i = Math.min(i, k);
											d = Math.max(d, k)
										}
									} else e ? f.push({
										id: this.rows[n].id,
										value: g
									}) : f.push(g)
								}
								n++
							}
							if (b) switch (b.toLowerCase()) {
								case "sum":
									f = h;
									break;
								case "avg":
									f = h / l;
									break;
								case "count":
									f = l;
									break;
								case "min":
									f = i;
									break;
								case "max":
									f = d
							}
						}
					}
				}
			});
			return f
		},
		clearGridData: function (c) {
			return this.each(function () {
				if (this.grid) {
					if (typeof c != "boolean") c = false;
					if (this.p.deepempty) a("#" + a.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove();
					else {
						var e = a("#" + a.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
						a("#" + a.jgrid.jqID(this.p.id) + " tbody:first").empty().append(e)
					}
					this.p.footerrow && c && a(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
					this.p.selrow = null;
					this.p.selarrrow = [];
					this.p.savedRow = [];
					this.p.records = 0;
					this.p.page = 1;
					this.p.lastpage = 0;
					this.p.reccount = 0;
					this.p.data = [];
					this.p._index = {};
					this.updatepager(true, false)
				}
			})
		},
		getInd: function (c, e) {
			var b = false,
                f;
			this.each(function () {
				if (f = this.rows.namedItem(c)) b = e === true ? f : f.rowIndex
			});
			return b
		},
		bindKeys: function (c) {
			var e = a.extend({
				onEnter: null,
				onSpace: null,
				onLeftKey: null,
				onRightKey: null,
				scrollingRows: true
			}, c || {});
			return this.each(function () {
				var b = this;
				a("body").is("[role]") || a("body").attr("role", "application");
				b.p.scrollrows = e.scrollingRows;
				a(b).keydown(function (f) {
					var g = a(b).find("tr[tabindex=0]")[0],
                        h, i, d, k = b.p.treeReader.expanded_field;
					if (g) {
						d = b.p._index[g.id];
						if (f.keyCode === 37 || f.keyCode === 38 || f.keyCode === 39 || f.keyCode === 40) {
							if (f.keyCode === 38) {
								i = g.previousSibling;
								h = "";
								if (i) if (a(i).is(":hidden")) for (; i; ) {
									i = i.previousSibling;
									if (!a(i).is(":hidden") && a(i).hasClass("jqgrow")) {
										h = i.id;
										break
									}
								} else h = i.id;
								a(b).jqGrid("setSelection", h)
							}
							if (f.keyCode === 40) {
								i = g.nextSibling;
								h = "";
								if (i) if (a(i).is(":hidden")) for (; i; ) {
									i = i.nextSibling;
									if (!a(i).is(":hidden") && a(i).hasClass("jqgrow")) {
										h = i.id;
										break
									}
								} else h = i.id;
								a(b).jqGrid("setSelection", h)
							}
							if (f.keyCode === 37) {
								b.p.treeGrid && b.p.data[d][k] && a(g).find("div.treeclick").trigger("click");
								a.isFunction(e.onLeftKey) && e.onLeftKey.call(b, b.p.selrow)
							}
							if (f.keyCode === 39) {
								b.p.treeGrid && !b.p.data[d][k] && a(g).find("div.treeclick").trigger("click");
								a.isFunction(e.onRightKey) && e.onRightKey.call(b, b.p.selrow)
							}
						} else if (f.keyCode === 13) a.isFunction(e.onEnter) && e.onEnter.call(b, b.p.selrow);
						else f.keyCode === 32 && a.isFunction(e.onSpace) && e.onSpace.call(b, b.p.selrow)
					}
				})
			})
		},
		unbindKeys: function () {
			return this.each(function () {
				a(this).unbind("keydown")
			})
		},
		getLocalRow: function (c) {
			var e = false,
                b;
			this.each(function () {
				if (typeof c !== "undefined") {
					b = this.p._index[c];
					if (b >= 0) e = this.p.data[b]
				}
			});
			return e
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.extend({
		getColProp: function (c) {
			var e = {},
                b = this[0];
			if (!b.grid) return false;
			b = b.p.colModel;
			for (var f = 0; f < b.length; f++) if (b[f].name == c) {
				e = b[f];
				break
			}
			return e
		},
		setColProp: function (c, e) {
			return this.each(function () {
				if (this.grid) if (e) for (var b = this.p.colModel, f = 0; f < b.length; f++) if (b[f].name == c) {
					a.extend(this.p.colModel[f], e);
					break
				}
			})
		},
		sortGrid: function (c, e, b) {
			return this.each(function () {
				var f = -1;
				if (this.grid) {
					if (!c) c = this.p.sortname;
					for (var g = 0; g < this.p.colModel.length; g++) if (this.p.colModel[g].index == c || this.p.colModel[g].name == c) {
						f = g;
						break
					}
					if (f != -1) {
						g = this.p.colModel[f].sortable;
						if (typeof g !== "boolean") g = true;
						if (typeof e !== "boolean") e = false;
						g && this.sortData("jqgh_" + this.p.id + "_" + c, f, e, b)
					}
				}
			})
		},
		GridDestroy: function () {
			return this.each(function () {
				if (this.grid) {
					this.p.pager && a(this.p.pager).remove();
					var c = this.id;
					try {
						a("#gbox_" + c).remove()
					} catch (e) { }
				}
			})
		},
		GridUnload: function () {
			return this.each(function () {
				if (this.grid) {
					var c = {
						id: a(this).attr("id"),
						cl: a(this).attr("class")
					};
					this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
					var e = document.createElement("table");
					a(e).attr({
						id: c.id
					});
					e.className = c.cl;
					c = this.id;
					a(e).removeClass("ui-jqgrid-btable");
					if (a(this.p.pager).parents("#gbox_" + c).length === 1) {
						a(e).insertBefore("#gbox_" + c).show();
						a(this.p.pager).insertBefore("#gbox_" + c)
					} else a(e).insertBefore("#gbox_" + c).show();
					a("#gbox_" + c).remove()
				}
			})
		},
		setGridState: function (c) {
			return this.each(function () {
				if (this.grid) if (c == "hidden") {
					a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + this.p.id).slideUp("fast");
					this.p.pager && a(this.p.pager).slideUp("fast");
					this.p.toppager && a(this.p.toppager).slideUp("fast");
					if (this.p.toolbar[0] === true) {
						this.p.toolbar[1] == "both" && a(this.grid.ubDiv).slideUp("fast");
						a(this.grid.uDiv).slideUp("fast")
					}
					this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + this.p.id).slideUp("fast");
					a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
					this.p.gridstate = "hidden"
				} else if (c == "visible") {
					a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + this.p.id).slideDown("fast");
					this.p.pager && a(this.p.pager).slideDown("fast");
					this.p.toppager && a(this.p.toppager).slideDown("fast");
					if (this.p.toolbar[0] === true) {
						this.p.toolbar[1] == "both" && a(this.grid.ubDiv).slideDown("fast");
						a(this.grid.uDiv).slideDown("fast")
					}
					this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + this.p.id).slideDown("fast");
					a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
					this.p.gridstate = "visible"
				}
			})
		},
		filterToolbar: function (c) {
			c = a.extend({
				autosearch: true,
				searchOnEnter: true,
				beforeSearch: null,
				afterSearch: null,
				beforeClear: null,
				afterClear: null,
				searchurl: "",
				stringResult: false,
				groupOp: "AND",
				defaultSearch: "bw"
			}, c || {});
			return this.each(function () {
				function e(i, d) {
					var k = a(i);
					k[0] && jQuery.each(d, function () {
						this.data !== undefined ? k.bind(this.type, this.data, this.fn) : k.bind(this.type, this.fn)
					})
				}
				var b = this;
				if (!this.ftoolbar) {
					var f = function () {
						var i = {},
                                d = 0,
                                k, m, l = {},
                                n;
						a.each(b.p.colModel, function () {
							m = this.index || this.name;
							n = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : this.stype == "select" ? "eq" : c.defaultSearch;
							if (k = a("#gs_" + a.jgrid.jqID(this.name), this.frozen === true && b.p.frozenColumns === true ? b.grid.fhDiv : b.grid.hDiv).val()) {
								i[m] = k;
								l[m] = n;
								d++
							} else try {
								delete b.p.postData[m]
							} catch (q) { }
						});
						var o = d > 0 ? true : false;
						if (c.stringResult === true || b.p.datatype == "local") {
							var j = '{"groupOp":"' + c.groupOp + '","rules":[',
                                    v = 0;
							a.each(i, function (q, u) {
								if (v > 0) j += ",";
								j += '{"field":"' + q + '",';
								j += '"op":"' + l[q] + '",';
								u += "";
								j += '"data":"' + u.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
								v++
							});
							j += "]}";
							a.extend(b.p.postData, {
								filters: j
							});
							a.each(["searchField", "searchString", "searchOper"], function (q, u) {
								b.p.postData.hasOwnProperty(u) && delete b.p.postData[u]
							})
						} else a.extend(b.p.postData, i);
						var r;
						if (b.p.searchurl) {
							r = b.p.url;
							a(b).jqGrid("setGridParam", {
								url: b.p.searchurl
							})
						}
						var p = false;
						if (a.isFunction(c.beforeSearch)) p = c.beforeSearch.call(b);
						p || a(b).jqGrid("setGridParam", {
							search: o
						}).trigger("reloadGrid", [{
							page: 1
						}]);
						r && a(b).jqGrid("setGridParam", {
							url: r
						});
						a.isFunction(c.afterSearch) && c.afterSearch()
					},
                        g = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),
                        h;
					a.each(b.p.colModel, function () {
						var i = this,
                            d, k, m, l;
						k = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + b.p.direction + "'></th>");
						d = a("<div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div>");
						this.hidden === true && a(k).css("display", "none");
						this.search = this.search === false ? false : true;
						if (typeof this.stype == "undefined") this.stype = "text";
						m = a.extend({}, this.searchoptions || {});
						if (this.search) switch (this.stype) {
							case "select":
								if (l = this.surl || m.dataUrl) a.ajax(a.extend({
									url: l,
									dataType: "html",
									success: function (r) {
										if (m.buildSelect !== undefined) (r = m.buildSelect(r)) && a(d).append(r);
										else a(d).append(r);
										m.defaultValue && a("select", d).val(m.defaultValue);
										a("select", d).attr({
											name: i.index || i.name,
											id: "gs_" + i.name
										});
										m.attr && a("select", d).attr(m.attr);
										a("select", d).css({
											width: "100%"
										});
										m.dataInit !== undefined && m.dataInit(a("select", d)[0]);
										m.dataEvents !== undefined && e(a("select", d)[0], m.dataEvents);
										c.autosearch === true && a("select", d).change(function () {
											f();
											return false
										});
										r = null
									}
								}, a.jgrid.ajaxOptions, b.p.ajaxSelectOptions || {}));
								else {
									var n;
									if (i.searchoptions && i.searchoptions.value) n = i.searchoptions.value;
									else if (i.editoptions && i.editoptions.value) n = i.editoptions.value;
									if (n) {
										l = document.createElement("select");
										l.style.width = "100%";
										a(l).attr({
											name: i.index || i.name,
											id: "gs_" + i.name
										});
										var o, j;
										if (typeof n === "string") {
											n = n.split(";");
											for (var v = 0; v < n.length; v++) {
												o = n[v].split(":");
												j = document.createElement("option");
												j.value = o[0];
												j.innerHTML = o[1];
												l.appendChild(j)
											}
										} else if (typeof n === "object") for (o in n) if (n.hasOwnProperty(o)) {
											j = document.createElement("option");
											j.value = o;
											j.innerHTML = n[o];
											l.appendChild(j)
										}
										m.defaultValue && a(l).val(m.defaultValue);
										m.attr && a(l).attr(m.attr);
										m.dataInit !== undefined && m.dataInit(l);
										m.dataEvents !== undefined && e(l, m.dataEvents);
										a(d).append(l);
										c.autosearch === true && a(l).change(function () {
											f();
											return false
										})
									}
								}
								break;
							case "text":
								l = m.defaultValue ? m.defaultValue : "";
								a(d).append("<input type='text' style='width:95%;padding:0px;' name='" + (i.index || i.name) + "' id='gs_" + i.name + "' value='" + l + "'/>");
								m.attr && a("input", d).attr(m.attr);
								m.dataInit !== undefined && m.dataInit(a("input", d)[0]);
								m.dataEvents !== undefined && e(a("input", d)[0], m.dataEvents);
								if (c.autosearch === true) c.searchOnEnter ? a("input", d).keypress(function (r) {
									if ((r.charCode ? r.charCode : r.keyCode ? r.keyCode : 0) == 13) {
										f();
										return false
									}
									return this
								}) : a("input", d).keydown(function (r) {
									switch (r.which) {
										case 13:
											return false;
										case 9:
										case 16:
										case 37:
										case 38:
										case 39:
										case 40:
										case 27:
											break;
										default:
											h && clearTimeout(h);
											h = setTimeout(function () {
												f()
											}, 500)
									}
								})
						}
						a(k).append(d);
						a(g).append(k)
					});
					a("table thead", b.grid.hDiv).append(g);
					this.ftoolbar = true;
					this.triggerToolbar = f;
					this.clearToolbar = function (i) {
						var d = {},
                            k, m = 0,
                            l;
						i = typeof i != "boolean" ? true : i;
						a.each(b.p.colModel, function () {
							k = this.searchoptions && this.searchoptions.defaultValue ? this.searchoptions.defaultValue : "";
							l = this.index || this.name;
							switch (this.stype) {
								case "select":
									var p;
									a("#gs_" + a.jgrid.jqID(this.name) + " option", this.frozen === true && b.p.frozenColumns === true ? b.grid.fhDiv : b.grid.hDiv).each(function (x) {
										if (x === 0) this.selected = true;
										if (a(this).text() == k) {
											this.selected = true;
											p = a(this).val();
											return false
										}
									});
									if (p) {
										d[l] = p;
										m++
									} else try {
										delete b.p.postData[l]
									} catch (q) { }
									break;
								case "text":
									a("#gs_" + a.jgrid.jqID(this.name), this.frozen === true && b.p.frozenColumns === true ? b.grid.fhDiv : b.grid.hDiv).val(k);
									if (k) {
										d[l] = k;
										m++
									} else try {
										delete b.p.postData[l]
									} catch (u) { }
							}
						});
						var n = m > 0 ? true : false;
						if (c.stringResult === true || b.p.datatype == "local") {
							var o = '{"groupOp":"' + c.groupOp + '","rules":[',
                                j = 0;
							a.each(d, function (p, q) {
								if (j > 0) o += ",";
								o += '{"field":"' + p + '",';
								o += '"op":"eq",';
								q += "";
								o += '"data":"' + q.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
								j++
							});
							o += "]}";
							a.extend(b.p.postData, {
								filters: o
							});
							a.each(["searchField", "searchString", "searchOper"], function (p, q) {
								b.p.postData.hasOwnProperty(q) && delete b.p.postData[q]
							})
						} else a.extend(b.p.postData, d);
						var v;
						if (b.p.searchurl) {
							v = b.p.url;
							a(b).jqGrid("setGridParam", {
								url: b.p.searchurl
							})
						}
						var r = false;
						if (a.isFunction(c.beforeClear)) r = c.beforeClear.call(b);
						r || i && a(b).jqGrid("setGridParam", {
							search: n
						}).trigger("reloadGrid", [{
							page: 1
						}]);
						v && a(b).jqGrid("setGridParam", {
							url: v
						});
						a.isFunction(c.afterClear) && c.afterClear()
					};
					this.toggleToolbar = function () {
						var i = a("tr.ui-search-toolbar", b.grid.hDiv),
                            d = b.p.frozenColumns === true ? a("tr.ui-search-toolbar", b.grid.hDiv) : false;
						if (i.css("display") == "none") {
							i.show();
							d && d.show()
						} else {
							i.hide();
							d && d.hide()
						}
					}
				}
			})
		},
		destroyGroupHeader: function (c) {
			if (typeof c == "undefined") c = true;
			return this.each(function () {
				var e, b, f, g, h, i;
				b = this.grid;
				var d = a("table.ui-jqgrid-htable thead", b.hDiv),
                    k = this.p.colModel;
				if (b) {
					e = a("<tr>", {
						role: "rowheader"
					}).addClass("ui-jqgrid-labels");
					g = b.headers;
					b = 0;
					for (f = g.length; b < f; b++) {
						h = k[b].hidden ? "none" : "";
						h = a(g[b].el).width(g[b].width).css("display", h);
						try {
							h.removeAttr("rowSpan")
						} catch (m) {
							h.attr("rowSpan", 1)
						}
						e.append(h);
						i = h.children("span.ui-jqgrid-resize");
						if (i.length > 0) i[0].style.height = "";
						h.children("div")[0].style.top = ""
					}
					a(d).children("tr.ui-jqgrid-labels").remove();
					a(d).prepend(e);
					c === true && a(this).jqGrid("setGridParam", {
						groupHeader: null
					})
				}
			})
		},
		setGroupHeaders: function (c) {
			c = a.extend({
				useColSpanStyle: false,
				groupHeaders: []
			}, c || {});
			return this.each(function () {
				this.p.groupHeader = c;
				var e = this,
                    b, f, g = 0,
                    h, i, d, k, m, l = e.p.colModel,
                    n = l.length,
                    o = e.grid.headers,
                    j = a("table.ui-jqgrid-htable", e.grid.hDiv),
                    v = j.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");
				h = j.children("thead");
				var r, p = j.find(".jqg-first-row-header");
				if (p.html() === null) p = a("<tr>", {
					role: "row",
					"aria-hidden": "true"
				}).addClass("jqg-first-row-header").css("height", "auto");
				else p.empty();
				var q, u = function (x, D) {
					for (var C = 0, A = D.length; C < A; C++) if (D[C].startColumnName === x) return C;
					return -1
				};
				a(e).prepend(h);
				h = a("<tr>", {
					role: "rowheader"
				}).addClass("ui-jqgrid-labels jqg-third-row-header");
				for (b = 0; b < n; b++) {
					d = o[b].el;
					k = a(d);
					f = l[b];
					i = {
						height: "0px",
						width: o[b].width + "px",
						display: f.hidden ? "none" : ""
					};
					a("<th>", {
						role: "gridcell"
					}).css(i).addClass("ui-first-th-" + e.p.direction).appendTo(p);
					d.style.width = "";
					i = u(f.name, c.groupHeaders);
					if (i >= 0) {
						i = c.groupHeaders[i];
						g = i.numberOfColumns;
						m = i.titleText;
						for (i = f = 0; i < g && b + i < n; i++) l[b + i].hidden || f++;
						i = a("<th>").attr({
							role: "columnheader"
						}).addClass("ui-state-default ui-th-column-header ui-th-" + e.p.direction).css({
							height: "22px",
							"border-top": "0px none"
						}).html(m);
						f > 0 && i.attr("colspan", String(f));
						e.p.headertitles && i.attr("title", i.text());
						f === 0 && i.hide();
						k.before(i);
						h.append(d);
						g -= 1
					} else if (g === 0) if (c.useColSpanStyle) k.attr("rowspan", "2");
					else {
						a("<th>", {
							role: "columnheader"
						}).addClass("ui-state-default ui-th-column-header ui-th-" + e.p.direction).css({
							display: f.hidden ? "none" : "",
							"border-top": "0px none"
						}).insertBefore(k);
						h.append(d)
					} else {
						h.append(d);
						g--
					}
				}
				l = a(e).children("thead");
				l.prepend(p);
				h.insertAfter(v);
				j.append(l);
				if (c.useColSpanStyle) {
					j.find("span.ui-jqgrid-resize").each(function () {
						var x = a(this).parent();
						if (x.is(":visible")) this.style.cssText = "height: " + x.height() + "px !important; cursor: col-resize;"
					});
					j.find("div.ui-jqgrid-sortable").each(function () {
						var x = a(this),
                            D = x.parent();
						D.is(":visible") && D.is(":has(span.ui-jqgrid-resize)") && x.css("top", (D.height() - x.outerHeight()) / 2 + "px")
					})
				}
				if (a.isFunction(e.p.resizeStop)) r = e.p.resizeStop;
				q = l.find("tr.jqg-first-row-header");
				e.p.resizeStop = function (x, D) {
					q.find("th").eq(D).width(x);
					a.isFunction(r) && r.call(e, x, D)
				}
			})
		},
		setFrozenColumns: function () {
			return this.each(function () {
				if (this.grid) {
					var c = this,
                        e = c.p.colModel,
                        b = 0,
                        f = e.length,
                        g = -1,
                        h = false;
					if (!(c.p.subGrid == true || c.p.treeGrid === true || c.p.cellEdit == true || c.p.sortable || c.p.scroll || c.p.grouping)) {
						c.p.rownumbers && b++;
						for (c.p.multiselect && b++; b < f; ) {
							if (e[b].frozen === true) {
								h = true;
								g = b
							} else break;
							b++
						}
						if (g >= 0 && h) {
							e = c.p.caption ? a(c.grid.cDiv).outerHeight() : 0;
							b = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(c.p.id)).height();
							c.p.orgEvents = {};
							if (c.p.toppager) e += a(c.grid.topDiv).outerHeight();
							if (c.p.toolbar[0] == true) if (c.p.toolbar[1] != "bottom") e += a(c.grid.uDiv).outerHeight();
							c.grid.fhDiv = a('<div style="position:absolute;left:0px;top:' + e + "px;height:" + b + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
							c.grid.fbDiv = a('<div style="position:absolute;left:0px;top:' + (parseInt(e, 10) + parseInt(b, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
							a("#gview_" + a.jgrid.jqID(c.p.id)).append(c.grid.fhDiv);
							e = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(c.p.id)).clone(true);
							if (c.p.groupHeader) {
								a("tr.jqg-first-row-header, tr.jqg-third-row-header", e).each(function () {
									a("th:gt(" + g + ")", this).remove()
								});
								var i = -1,
                                    d = -1;
								a("tr.jqg-second-row-header th", e).each(function () {
									var k = parseInt(a(this).attr("colspan"), 10);
									if (k) {
										i += k;
										d++
									}
									if (i === g) return false
								});
								if (i !== g) d = g;
								a("tr.jqg-second-row-header", e).each(function () {
									a("th:gt(" + d + ")", this).remove()
								})
							} else a("tr", e).each(function () {
								a("th:gt(" + g + ")", this).remove()
							});
							a(e).width(1);
							a(c.grid.fhDiv).append(e).mousemove(function (k) {
								if (c.grid.resizing) {
									c.grid.dragMove(k);
									return false
								}
							});
							if (a.isFunction(c.p.resizeStop)) c.p.orgEvents.resizeStop = c.p.resizeStop;
							c.p.resizeStop = function (k, m) {
								var l = a(".ui-jqgrid-htable", c.grid.fhDiv);
								a("th:eq(" + m + ")", l).width(k);
								l = a(".ui-jqgrid-btable", c.grid.fbDiv);
								a("tr:first td:eq(" + m + ")", l).width(k);
								if (a.isFunction(c.p.orgEvents.resizeStop)) c.p.orgEvents.resizeStop.call(c, k, m);
								else c.p.orgEvents.resizeStop = null
							};
							c.p.orgEvents.onSortCol = a.isFunction(c.p.onSortCol) ? c.p.onSortCol : null;
							c.p.onSortCol = function (k, m, l) {
								var n = a("tr.ui-jqgrid-labels:last th:eq(" + c.p.lastsort + ")", c.grid.fhDiv),
                                    o = a("tr.ui-jqgrid-labels:last th:eq(" + m + ")", c.grid.fhDiv);
								a("span.ui-grid-ico-sort", n).addClass("ui-state-disabled");
								a(n).attr("aria-selected", "false");
								a("span.ui-icon-" + c.p.sortorder, o).removeClass("ui-state-disabled");
								a(o).attr("aria-selected", "true");
								if (!c.p.viewsortcols[0]) if (c.p.lastsort != m) {
									a("span.s-ico", n).hide();
									a("span.s-ico", o).show()
								}
								a.isFunction(c.p.orgEvents.onSortCol) && c.p.orgEvents.onSortCol.call(c, k, m, l)
							};
							a("#gview_" + a.jgrid.jqID(c.p.id)).append(c.grid.fbDiv);
							jQuery(c.grid.bDiv).scroll(function () {
								jQuery(c.grid.fbDiv).scrollTop(jQuery(this).scrollTop())
							});
							c.p.orgEvents.complete = a.isFunction(c.p._complete) ? c.p._complete : null;
							c.p.hoverrows === true && a("#" + a.jgrid.jqID(c.p.id)).unbind("mouseover").unbind("mouseout");
							c.p._complete = function () {
								a("#" + a.jgrid.jqID(c.p.id) + "_frozen").remove();
								jQuery(c.grid.fbDiv).height(jQuery(c.grid.bDiv).height() - 16);
								var k = a("#" + a.jgrid.jqID(c.p.id)).clone(true);
								a("tr", k).each(function () {
									a("td:gt(" + g + ")", this).remove()
								});
								a(k).width(1).attr("id", a.jgrid.jqID(c.p.id) + "_frozen");
								a(c.grid.fbDiv).append(k);
								if (c.p.hoverrows === true) {
									a("tr.jqgrow", k).hover(function () {
										a(this).addClass("ui-state-hover");
										a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(c.p.id)).addClass("ui-state-hover")
									}, function () {
										a(this).removeClass("ui-state-hover");
										a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(c.p.id)).removeClass("ui-state-hover")
									});
									a("tr.jqgrow", "#" + a.jgrid.jqID(c.p.id)).hover(function () {
										a(this).addClass("ui-state-hover");
										a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(c.p.id) + "_frozen").addClass("ui-state-hover")
									}, function () {
										a(this).removeClass("ui-state-hover");
										a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(c.p.id) + "_frozen").removeClass("ui-state-hover")
									})
								}
								k = null;
								a.isFunction(c.p.orgEvents.complete) && c.p.orgEvents.complete.call(c)
							};
							c.p.frozenColumns = true
						}
					}
				}
			})
		},
		destroyFrozenColumns: function () {
			return this.each(function () {
				if (this.grid) if (this.p.frozenColumns === true) {
					a(this.grid.fhDiv).remove();
					a(this.grid.fbDiv).remove();
					this.grid.fhDiv = null;
					this.grid.fbDiv = null;
					this.p._complete = this.p.orgEvents.complete;
					this.p.resizeStop = this.p.orgEvents.resizeStop;
					this.p.onSortCol = this.p.orgEvents.onSortCol;
					this.p.orgEvents = null;
					if (this.p.hoverrows == true) {
						var c;
						a("#" + a.jgrid.jqID(this.p.id)).bind("mouseover", function (e) {
							c = a(e.target).closest("tr.jqgrow");
							a(c).attr("class") !== "ui-subgrid" && a(c).addClass("ui-state-hover")
						}).bind("mouseout", function (e) {
							c = a(e.target).closest("tr.jqgrow");
							a(c).removeClass("ui-state-hover")
						})
					}
					this.p.frozenColumns = false
				}
			})
		}
	})
})(jQuery);
(function (a) {
	a.fn.jqm = function (l) {
		var n = {
			overlay: 50,
			closeoverlay: true,
			overlayClass: "jqmOverlay",
			closeClass: "jqmClose",
			trigger: ".jqModal",
			ajax: g,
			ajaxText: "",
			target: g,
			modal: g,
			toTop: g,
			onShow: g,
			onHide: g,
			onLoad: g
		};
		return this.each(function () {
			if (this._jqm) return e[this._jqm].c = a.extend({}, e[this._jqm].c, l);
			c++;
			this._jqm = c;
			e[c] = {
				c: a.extend(n, a.jqm.params, l),
				a: g,
				w: a(this).addClass("jqmID" + c),
				s: c
			};
			n.trigger && a(this).jqmAddTrigger(n.trigger)
		})
	};
	a.fn.jqmAddClose = function (l) {
		return m(this, l, "jqmHide")
	};
	a.fn.jqmAddTrigger = function (l) {
		return m(this, l, "jqmShow")
	};
	a.fn.jqmShow = function (l) {
		return this.each(function () {
			a.jqm.open(this._jqm, l)
		})
	};
	a.fn.jqmHide = function (l) {
		return this.each(function () {
			a.jqm.close(this._jqm, l)
		})
	};
	a.jqm = {
		hash: {},
		open: function (l, n) {
			var o = e[l],
                j = o.c,
                v = "." + j.closeClass,
                r = parseInt(o.w.css("z-index"));
			r = r > 0 ? r : 3E3;
			var p = a("<div></div>").css({
				height: "100%",
				width: "100%",
				position: "fixed",
				left: 0,
				top: 0,
				"z-index": r - 1,
				opacity: j.overlay / 100
			});
			if (o.a) return g;
			o.t = n;
			o.a = true;
			o.w.css("z-index", r);
			if (j.modal) {
				b[0] || setTimeout(function () {
					d("bind")
				}, 1);
				b.push(l)
			} else if (j.overlay > 0) j.closeoverlay && o.w.jqmAddClose(p);
			else p = g;
			o.o = p ? p.addClass(j.overlayClass).prependTo("body") : g;
			if (f) {
				a("html,body").css({
					height: "100%",
					width: "100%"
				});
				if (p) {
					p = p.css({
						position: "absolute"
					})[0];
					for (var q in {
						Top: 1,
						Left: 1
					}) p.style.setExpression(q.toLowerCase(), "(_=(document.documentElement.scroll" + q + " || document.body.scroll" + q + "))+'px'")
				}
			}
			if (j.ajax) {
				r = j.target || o.w;
				p = j.ajax;
				r = typeof r == "string" ? a(r, o.w) : a(r);
				p = p.substr(0, 1) == "@" ? a(n).attr(p.substring(1)) : p;
				r.html(j.ajaxText).load(p, function () {
					j.onLoad && j.onLoad.call(this, o);
					v && o.w.jqmAddClose(a(v, o.w));
					h(o)
				})
			} else v && o.w.jqmAddClose(a(v, o.w));
			j.toTop && o.o && o.w.before('<span id="jqmP' + o.w[0]._jqm + '"></span>').insertAfter(o.o);
			j.onShow ? j.onShow(o) : o.w.show();
			h(o);
			return g
		},
		close: function (l) {
			l = e[l];
			if (!l.a) return g;
			l.a = g;
			if (b[0]) {
				b.pop();
				b[0] || d("unbind")
			}
			l.c.toTop && l.o && a("#jqmP" + l.w[0]._jqm).after(l.w).remove();
			if (l.c.onHide) l.c.onHide(l);
			else {
				l.w.hide();
				l.o && l.o.remove()
			}
			return g
		},
		params: {}
	};
	var c = 0,
        e = a.jqm.hash,
        b = [],
        f = a.browser.msie && a.browser.version == "6.0",
        g = false,
        h = function (l) {
        	var n = a('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({
        		opacity: 0
        	});
        	if (f) if (l.o) l.o.html('<p style="width:100%;height:100%"/>').prepend(n);
        	else a("iframe.jqm", l.w)[0] || l.w.prepend(n);
        	i(l)
        },
        i = function (l) {
        	try {
        		a(":input:visible", l.w)[0].focus()
        	} catch (n) { }
        },
        d = function (l) {
        	a(document)[l]("keypress", k)[l]("keydown", k)[l]("mousedown", k)
        },
        k = function (l) {
        	var n = e[b[b.length - 1]];
        	(l = !a(l.target).parents(".jqmID" + n.s)[0]) && i(n);
        	return !l
        },
        m = function (l, n, o) {
        	return l.each(function () {
        		var j = this._jqm;
        		a(n).each(function () {
        			if (!this[o]) {
        				this[o] = [];
        				a(this).click(function () {
        					for (var v in {
        						jqmShow: 1,
        						jqmHide: 1
        					}) for (var r in this[v]) if (e[this[v][r]]) e[this[v][r]].w[v](this);
        					return g
        				})
        			}
        			this[o].push(j)
        		})
        	})
        }
})(jQuery);
(function (a) {
	a.fn.jqDrag = function (i) {
		return g(this, i, "d")
	};
	a.fn.jqResize = function (i, d) {
		return g(this, i, "r", d)
	};
	a.jqDnR = {
		dnr: {},
		e: 0,
		drag: function (i) {
			if (e.k == "d") b.css({
				left: e.X + i.pageX - e.pX,
				top: e.Y + i.pageY - e.pY
			});
			else {
				b.css({
					width: Math.max(i.pageX - e.pX + e.W, 0),
					height: Math.max(i.pageY - e.pY + e.H, 0)
				});
				M1 && f.css({
					width: Math.max(i.pageX - M1.pX + M1.W, 0),
					height: Math.max(i.pageY - M1.pY + M1.H, 0)
				})
			}
			return false
		},
		stop: function () {
			a(document).unbind("mousemove", c.drag).unbind("mouseup", c.stop)
		}
	};
	var c = a.jqDnR,
        e = c.dnr,
        b = c.e,
        f, g = function (i, d, k, m) {
        	return i.each(function () {
        		d = d ? a(d, i) : i;
        		d.bind("mousedown", {
        			e: i,
        			k: k
        		}, function (l) {
        			var n = l.data,
                        o = {};
        			b = n.e;
        			f = m ? a(m) : false;
        			if (b.css("position") != "relative") try {
        				b.position(o)
        			} catch (j) { }
        			e = {
        				X: o.left || h("left") || 0,
        				Y: o.top || h("top") || 0,
        				W: h("width") || b[0].scrollWidth || 0,
        				H: h("height") || b[0].scrollHeight || 0,
        				pX: l.pageX,
        				pY: l.pageY,
        				k: n.k
        			};
        			M1 = f && n.k != "d" ? {
        				X: o.left || f1("left") || 0,
        				Y: o.top || f1("top") || 0,
        				W: f[0].offsetWidth || f1("width") || 0,
        				H: f[0].offsetHeight || f1("height") || 0,
        				pX: l.pageX,
        				pY: l.pageY,
        				k: n.k
        			} : false;
        			if (a("input.hasDatepicker", b[0])[0]) try {
        				a("input.hasDatepicker", b[0]).datepicker("hide")
        			} catch (v) { }
        			a(document).mousemove(a.jqDnR.drag).mouseup(a.jqDnR.stop);
        			return false
        		})
        	})
        },
        h = function (i) {
        	return parseInt(b.css(i)) || false
        };
	f1 = function (i) {
		return parseInt(f.css(i)) || false
	}
})(jQuery);
var xmlJsonClass = {
	xml2json: function (a, c) {
		if (a.nodeType === 9) a = a.documentElement;
		var e = this.toJson(this.toObj(this.removeWhite(a)), a.nodeName, "\t");
		return "{\n" + c + (c ? e.replace(/\t/g, c) : e.replace(/\t|\n/g, "")) + "\n}"
	},
	json2xml: function (a, c) {
		var e = function (g, h, i) {
			var d = "",
                    k, m;
			if (g instanceof Array) if (g.length === 0) d += i + "<" + h + ">__EMPTY_ARRAY_</" + h + ">\n";
			else {
				k = 0;
				for (m = g.length; k < m; k += 1) {
					var l = i + e(g[k], h, i + "\t") + "\n";
					d += l
				}
			} else if (typeof g === "object") {
				k = false;
				d += i + "<" + h;
				for (m in g) if (g.hasOwnProperty(m)) if (m.charAt(0) === "@") d += " " + m.substr(1) + '="' + g[m].toString() + '"';
				else k = true;
				d += k ? ">" : "/>";
				if (k) {
					for (m in g) if (g.hasOwnProperty(m)) if (m === "#text") d += g[m];
					else if (m === "#cdata") d += "<![CDATA[" + g[m] + "]]\>";
					else if (m.charAt(0) !== "@") d += e(g[m], m, i + "\t");
					d += (d.charAt(d.length - 1) === "\n" ? i : "") + "</" + h + ">"
				}
			} else if (typeof g === "function") d += i + "<" + h + "><![CDATA[" + g + "]]\></" + h + ">";
			else {
				if (g === undefined) g = "";
				d += g.toString() === '""' || g.toString().length === 0 ? i + "<" + h + ">__EMPTY_STRING_</" + h + ">" : i + "<" + h + ">" + g.toString() + "</" + h + ">"
			}
			return d
		},
            b = "",
            f;
		for (f in a) if (a.hasOwnProperty(f)) b += e(a[f], f, "");
		return c ? b.replace(/\t/g, c) : b.replace(/\t|\n/g, "")
	},
	toObj: function (a) {
		var c = {},
            e = /function/i;
		if (a.nodeType === 1) {
			if (a.attributes.length) {
				var b;
				for (b = 0; b < a.attributes.length; b += 1) c["@" + a.attributes[b].nodeName] = (a.attributes[b].nodeValue || "").toString()
			}
			if (a.firstChild) {
				var f = b = 0,
                    g = false,
                    h;
				for (h = a.firstChild; h; h = h.nextSibling) if (h.nodeType === 1) g = true;
				else if (h.nodeType === 3 && h.nodeValue.match(/[^ \f\n\r\t\v]/)) b += 1;
				else if (h.nodeType === 4) f += 1;
				if (g) if (b < 2 && f < 2) {
					this.removeWhite(a);
					for (h = a.firstChild; h; h = h.nextSibling) if (h.nodeType === 3) c["#text"] = this.escape(h.nodeValue);
					else if (h.nodeType === 4) if (e.test(h.nodeValue)) c[h.nodeName] = [c[h.nodeName], h.nodeValue];
					else c["#cdata"] = this.escape(h.nodeValue);
					else if (c[h.nodeName]) if (c[h.nodeName] instanceof Array) c[h.nodeName][c[h.nodeName].length] = this.toObj(h);
					else c[h.nodeName] = [c[h.nodeName], this.toObj(h)];
					else c[h.nodeName] = this.toObj(h)
				} else if (a.attributes.length) c["#text"] = this.escape(this.innerXml(a));
				else c = this.escape(this.innerXml(a));
				else if (b) if (a.attributes.length) c["#text"] = this.escape(this.innerXml(a));
				else {
					c = this.escape(this.innerXml(a));
					if (c === "__EMPTY_ARRAY_") c = "[]";
					else if (c === "__EMPTY_STRING_") c = ""
				} else if (f) if (f > 1) c = this.escape(this.innerXml(a));
				else for (h = a.firstChild; h; h = h.nextSibling) if (e.test(a.firstChild.nodeValue)) {
					c = a.firstChild.nodeValue;
					break
				} else c["#cdata"] = this.escape(h.nodeValue)
			}
			if (!a.attributes.length && !a.firstChild) c = null
		} else if (a.nodeType === 9) c = this.toObj(a.documentElement);
		else alert("unhandled node type: " + a.nodeType);
		return c
	},
	toJson: function (a, c, e, b) {
		if (b === undefined) b = true;
		var f = c ? '"' + c + '"' : "",
            g = "\t",
            h = "\n";
		if (!b) h = g = "";
		if (a === "[]") f += c ? ":[]" : "[]";
		else if (a instanceof Array) {
			var i, d, k = [];
			d = 0;
			for (i = a.length; d < i; d += 1) k[d] = this.toJson(a[d], "", e + g, b);
			f += (c ? ":[" : "[") + (k.length > 1 ? h + e + g + k.join("," + h + e + g) + h + e : k.join("")) + "]"
		} else if (a === null) f += (c && ":") + "null";
		else if (typeof a === "object") {
			i = [];
			for (d in a) if (a.hasOwnProperty(d)) i[i.length] = this.toJson(a[d], d, e + g, b);
			f += (c ? ":{" : "{") + (i.length > 1 ? h + e + g + i.join("," + h + e + g) + h + e : i.join("")) + "}"
		} else f += typeof a === "string" ? (c && ":") + '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"' : (c && ":") + '"' + a.toString() + '"';
		return f
	},
	innerXml: function (a) {
		var c = "";
		if ("innerHTML" in a) c = a.innerHTML;
		else {
			var e = function (b) {
				var f = "",
                        g;
				if (b.nodeType === 1) {
					f += "<" + b.nodeName;
					for (g = 0; g < b.attributes.length; g += 1) f += " " + b.attributes[g].nodeName + '="' + (b.attributes[g].nodeValue || "").toString() + '"';
					if (b.firstChild) {
						f += ">";
						for (g = b.firstChild; g; g = g.nextSibling) f += e(g);
						f += "</" + b.nodeName + ">"
					} else f += "/>"
				} else if (b.nodeType === 3) f += b.nodeValue;
				else if (b.nodeType === 4) f += "<![CDATA[" + b.nodeValue + "]]\>";
				return f
			};
			for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
		}
		return c
	},
	escape: function (a) {
		return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
	},
	removeWhite: function (a) {
		a.normalize();
		var c;
		for (c = a.firstChild; c; ) if (c.nodeType === 3) if (c.nodeValue.match(/[^ \f\n\r\t\v]/)) c = c.nextSibling;
		else {
			var e = c.nextSibling;
			a.removeChild(c);
			c = e
		} else {
			c.nodeType === 1 && this.removeWhite(c);
			c = c.nextSibling
		}
		return a
	}
};
(function (a) {
	a.fmatter = {};
	a.extend(a.fmatter, {
		isBoolean: function (c) {
			return typeof c === "boolean"
		},
		isObject: function (c) {
			return c && (typeof c === "object" || a.isFunction(c)) || false
		},
		isString: function (c) {
			return typeof c === "string"
		},
		isNumber: function (c) {
			return typeof c === "number" && isFinite(c)
		},
		isNull: function (c) {
			return c === null
		},
		isUndefined: function (c) {
			return typeof c === "undefined"
		},
		isValue: function (c) {
			return this.isObject(c) || this.isString(c) || this.isNumber(c) || this.isBoolean(c)
		},
		isEmpty: function (c) {
			if (!this.isString(c) && this.isValue(c)) return false;
			else if (!this.isValue(c)) return true;
			c = a.trim(c).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, "");
			return c === ""
		}
	});
	a.fn.fmatter = function (c, e, b, f, g) {
		var h = e;
		b = a.extend({}, a.jgrid.formatter, b);
		if (a.fn.fmatter[c]) h = a.fn.fmatter[c](e, b, f, g);
		return h
	};
	a.fmatter.util = {
		NumberFormat: function (c, e) {
			a.fmatter.isNumber(c) || (c *= 1);
			if (a.fmatter.isNumber(c)) {
				var b = c < 0,
                    f = c + "",
                    g = e.decimalSeparator ? e.decimalSeparator : ".",
                    h;
				if (a.fmatter.isNumber(e.decimalPlaces)) {
					var i = e.decimalPlaces;
					f = Math.pow(10, i);
					f = Math.round(c * f) / f + "";
					h = f.lastIndexOf(".");
					if (i > 0) {
						if (h < 0) {
							f += g;
							h = f.length - 1
						} else if (g !== ".") f = f.replace(".", g);
						for (; f.length - 1 - h < i; ) f += "0"
					}
				}
				if (e.thousandsSeparator) {
					i = e.thousandsSeparator;
					h = f.lastIndexOf(g);
					h = h > -1 ? h : f.length;
					g = f.substring(h);
					for (var d = -1, k = h; k > 0; k--) {
						d++;
						if (d % 3 === 0 && k !== h && (!b || k > 1)) g = i + g;
						g = f.charAt(k - 1) + g
					}
					f = g
				}
				f = e.prefix ? e.prefix + f : f;
				return f = e.suffix ? f + e.suffix : f
			} else return c
		},
		DateFormat: function (c, e, b, f) {
			var g = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
                h = typeof e === "string" ? e.match(g) : null;
			g = function (q, u) {
				q = String(q);
				for (u = parseInt(u, 10) || 2; q.length < u; ) q = "0" + q;
				return q
			};
			var i = {
				m: 1,
				d: 1,
				y: 1970,
				h: 0,
				i: 0,
				s: 0,
				u: 0
			},
                d = 0,
                k, m = ["i18n"];
			m.i18n = {
				dayNames: f.dayNames,
				monthNames: f.monthNames
			};
			if (c in f.masks) c = f.masks[c];
			if (!isNaN(e - 0) && String(c).toLowerCase() == "u") d = new Date(parseFloat(e) * 1E3);
			else if (e.constructor === Date) d = e;
			else if (h !== null) {
				d = new Date(parseInt(h[1], 10));
				if (h[3]) {
					c = Number(h[5]) * 60 + Number(h[6]);
					c *= h[4] == "-" ? 1 : -1;
					c -= d.getTimezoneOffset();
					d.setTime(Number(Number(d) + c * 6E4))
				}
			} else {
				e = String(e).split(/[\\\/:_;.,\t\T\s-]/);
				c = c.split(/[\\\/:_;.,\t\T\s-]/);
				h = 0;
				for (k = c.length; h < k; h++) {
					if (c[h] == "M") {
						d = a.inArray(e[h], m.i18n.monthNames);
						if (d !== -1 && d < 12) e[h] = d + 1
					}
					if (c[h] == "F") {
						d = a.inArray(e[h], m.i18n.monthNames);
						if (d !== -1 && d > 11) e[h] = d + 1 - 12
					}
					if (e[h]) i[c[h].toLowerCase()] = parseInt(e[h], 10)
				}
				if (i.f) i.m = i.f;
				if (i.m === 0 && i.y === 0 && i.d === 0) return "&#160;";
				i.m = parseInt(i.m, 10) - 1;
				d = i.y;
				if (d >= 70 && d <= 99) i.y = 1900 + i.y;
				else if (d >= 0 && d <= 69) i.y = 2E3 + i.y;
				d = new Date(i.y, i.m, i.d, i.h, i.i, i.s, i.u)
			}
			if (b in f.masks) b = f.masks[b];
			else b || (b = "Y-m-d");
			c = d.getHours();
			e = d.getMinutes();
			i = d.getDate();
			h = d.getMonth() + 1;
			k = d.getTimezoneOffset();
			var l = d.getSeconds(),
                n = d.getMilliseconds(),
                o = d.getDay(),
                j = d.getFullYear(),
                v = (o + 6) % 7 + 1,
                r = (new Date(j, h - 1, i) - new Date(j, 0, 1)) / 864E5,
                p = {
                	d: g(i),
                	D: m.i18n.dayNames[o],
                	j: i,
                	l: m.i18n.dayNames[o + 7],
                	N: v,
                	S: f.S(i),
                	w: o,
                	z: r,
                	W: v < 5 ? Math.floor((r + v - 1) / 7) + 1 : Math.floor((r + v - 1) / 7) || (((new Date(j - 1, 0, 1)).getDay() + 6) % 7 < 4 ? 53 : 52),
                	F: m.i18n.monthNames[h - 1 + 12],
                	m: g(h),
                	M: m.i18n.monthNames[h - 1],
                	n: h,
                	t: "?",
                	L: "?",
                	o: "?",
                	Y: j,
                	y: String(j).substring(2),
                	a: c < 12 ? f.AmPm[0] : f.AmPm[1],
                	A: c < 12 ? f.AmPm[2] : f.AmPm[3],
                	B: "?",
                	g: c % 12 || 12,
                	G: c,
                	h: g(c % 12 || 12),
                	H: g(c),
                	i: g(e),
                	s: g(l),
                	u: n,
                	e: "?",
                	I: "?",
                	O: (k > 0 ? "-" : "+") + g(Math.floor(Math.abs(k) / 60) * 100 + Math.abs(k) % 60, 4),
                	P: "?",
                	T: (String(d).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""),
                	Z: "?",
                	c: "?",
                	r: "?",
                	U: Math.floor(d / 1E3)
                };
			return b.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g, function (q) {
				return q in p ? p[q] : q.substring(1)
			})
		}
	};
	a.fn.fmatter.defaultFormat = function (c, e) {
		return a.fmatter.isValue(c) && c !== "" ? c : e.defaultValue ? e.defaultValue : "&#160;"
	};
	a.fn.fmatter.email = function (c, e) {
		return a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, e) : '<a href="mailto:' + c + '">' + c + "</a>"
	};
	a.fn.fmatter.checkbox = function (c, e) {
		var b = a.extend({}, e.checkbox),
            f;
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		f = b.disabled === true ? 'disabled="disabled"' : "";
		if (a.fmatter.isEmpty(c) || a.fmatter.isUndefined(c)) c = a.fn.fmatter.defaultFormat(c, b);
		c += "";
		c = c.toLowerCase();
		return '<input type="checkbox" ' + (c.search(/(false|0|no|off)/i) < 0 ? " checked='checked' " : "") + ' value="' + c + '" offval="no" ' + f + "/>"
	};
	a.fn.fmatter.link = function (c, e) {
		var b = {
			target: e.target
		},
            f = "";
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		if (b.target) f = "target=" + b.target;
		return a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, e) : "<a " + f + ' href="' + c + '">' + c + "</a>"
	};
	a.fn.fmatter.showlink = function (c, e) {
		var b = {
			baseLinkUrl: e.baseLinkUrl,
			showAction: e.showAction,
			addParam: e.addParam || "",
			target: e.target,
			idName: e.idName
		},
            f = "";
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		if (b.target) f = "target=" + b.target;
		b = b.baseLinkUrl + b.showAction + "?" + b.idName + "=" + e.rowId + b.addParam;
		return a.fmatter.isString(c) || a.fmatter.isNumber(c) ? "<a " + f + ' href="' + b + '">' + c + "</a>" : a.fn.fmatter.defaultFormat(c, e)
	};
	a.fn.fmatter.integer = function (c, e) {
		var b = a.extend({}, e.integer);
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		if (a.fmatter.isEmpty(c)) return b.defaultValue;
		return a.fmatter.util.NumberFormat(c, b)
	};
	a.fn.fmatter.number = function (c, e) {
		var b = a.extend({}, e.number);
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		if (a.fmatter.isEmpty(c)) return b.defaultValue;
		return a.fmatter.util.NumberFormat(c, b)
	};
	a.fn.fmatter.currency = function (c, e) {
		var b = a.extend({}, e.currency);
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		if (a.fmatter.isEmpty(c)) return b.defaultValue;
		return a.fmatter.util.NumberFormat(c, b)
	};
	a.fn.fmatter.date = function (c, e, b, f) {
		b = a.extend({}, e.date);
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend({}, b, e.colModel.formatoptions));
		return !b.reformatAfterEdit && f == "edit" ? a.fn.fmatter.defaultFormat(c, e) : a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, e) : a.fmatter.util.DateFormat(b.srcformat, c, b.newformat, b)
	};
	a.fn.fmatter.select = function (c, e) {
		c += "";
		var b = false,
            f = [],
            g;
		if (a.fmatter.isUndefined(e.colModel.formatoptions)) {
			if (!a.fmatter.isUndefined(e.colModel.editoptions)) {
				b = e.colModel.editoptions.value;
				g = e.colModel.editoptions.separator === undefined ? ":" : e.colModel.editoptions.separator
			}
		} else {
			b = e.colModel.formatoptions.value;
			g = e.colModel.formatoptions.separator === undefined ? ":" : e.colModel.formatoptions.separator
		}
		if (b) {
			var h = e.colModel.editoptions.multiple === true ? true : false,
                i = [],
                d;
			if (h) {
				i = c.split(",");
				i = a.map(i, function (n) {
					return a.trim(n)
				})
			}
			if (a.fmatter.isString(b)) for (var k = b.split(";"), m = 0, l = 0; l < k.length; l++) {
				d = k[l].split(g);
				if (d.length > 2) d[1] = jQuery.map(d, function (n, o) {
					if (o > 0) return n
				}).join(":");
				if (h) {
					if (jQuery.inArray(d[0], i) > -1) {
						f[m] = d[1];
						m++
					}
				} else if (a.trim(d[0]) == a.trim(c)) {
					f[0] = d[1];
					break
				}
			} else if (a.fmatter.isObject(b)) if (h) f = jQuery.map(i, function (n) {
				return b[n]
			});
			else f[0] = b[c] || ""
		}
		c = f.join(", ");
		return c === "" ? a.fn.fmatter.defaultFormat(c, e) : c
	};
	a.fn.fmatter.rowactions = function (c, e, b, f) {
		var g = {
			keys: false,
			onEdit: null,
			onSuccess: null,
			afterSave: null,
			onError: null,
			afterRestore: null,
			extraparam: {},
			url: null,
			delOptions: {},
			editOptions: {}
		};
		c = a.jgrid.jqID(c);
		e = a.jgrid.jqID(e);
		f = a("#" + e)[0].p.colModel[f];
		a.fmatter.isUndefined(f.formatoptions) || (g = a.extend(g, f.formatoptions));
		if (!a.fmatter.isUndefined(a("#" + e)[0].p.editOptions)) g.editOptions = a("#" + e)[0].p.editOptions;
		if (!a.fmatter.isUndefined(a("#" + e)[0].p.delOptions)) g.delOptions = a("#" + e)[0].p.delOptions;
		var h = a("#" + e)[0];
		f = function (k, m) {
			g.afterSave && g.afterSave.call(h, k, m);
			a("tr#" + c + " div.ui-inline-edit, tr#" + c + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
			a("tr#" + c + " div.ui-inline-save, tr#" + c + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide()
		};
		var i = function (k) {
			g.afterRestore && g.afterRestore.call(h, k);
			a("tr#" + c + " div.ui-inline-edit, tr#" + c + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
			a("tr#" + c + " div.ui-inline-save, tr#" + c + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide()
		};
		if (a("#" + c, "#" + e).hasClass("jqgrid-new-row")) {
			var d = h.p.prmNames;
			g.extraparam[d.oper] = d.addoper
		}
		switch (b) {
			case "edit":
				a("#" + e).jqGrid("editRow", c, g.keys, g.onEdit, g.onSuccess, g.url, g.extraparam, f, g.onError, i);
				a("tr#" + c + " div.ui-inline-edit, tr#" + c + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").hide();
				a("tr#" + c + " div.ui-inline-save, tr#" + c + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").show();
				a.isFunction(h.p._complete) && h.p._complete.call(h);
				break;
			case "save":
				if (a("#" + e).jqGrid("saveRow", c, g.onSuccess, g.url, g.extraparam, f, g.onError, i)) {
					a("tr#" + c + " div.ui-inline-edit, tr#" + c + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
					a("tr#" + c + " div.ui-inline-save, tr#" + c + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide();
					a.isFunction(h.p._complete) && h.p._complete.call(h)
				}
				break;
			case "cancel":
				a("#" + e).jqGrid("restoreRow", c, i);
				a("tr#" + c + " div.ui-inline-edit, tr#" + c + " div.ui-inline-del", "#" + e + ".ui-jqgrid-btable:first").show();
				a("tr#" + c + " div.ui-inline-save, tr#" + c + " div.ui-inline-cancel", "#" + e + ".ui-jqgrid-btable:first").hide();
				a.isFunction(h.p._complete) && h.p._complete.call(h);
				break;
			case "del":
				a("#" + e).jqGrid("delGridRow", c, g.delOptions);
				break;
			case "formedit":
				a("#" + e).jqGrid("setSelection", c);
				a("#" + e).jqGrid("editGridRow", c, g.editOptions)
		}
	};
	a.fn.fmatter.actions = function (c, e) {
		var b = {
			keys: false,
			editbutton: true,
			delbutton: true,
			editformbutton: false
		};
		a.fmatter.isUndefined(e.colModel.formatoptions) || (b = a.extend(b, e.colModel.formatoptions));
		var f = e.rowId,
            g = "",
            h;
		if (typeof f == "undefined" || a.fmatter.isEmpty(f)) return "";
		if (b.editformbutton) {
			h = "onclick=jQuery.fn.fmatter.rowactions('" + f + "','" + e.gid + "','formedit'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			g = g + "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + h + "><span class='ui-icon ui-icon-pencil'></span></div>"
		} else if (b.editbutton) {
			h = "onclick=jQuery.fn.fmatter.rowactions('" + f + "','" + e.gid + "','edit'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
			g = g + "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + h + "><span class='ui-icon ui-icon-pencil'></span></div>"
		}
		if (b.delbutton) {
			h = "onclick=jQuery.fn.fmatter.rowactions('" + f + "','" + e.gid + "','del'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			g = g + "<div title='" + a.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + h + "><span class='ui-icon ui-icon-trash'></span></div>"
		}
		h = "onclick=jQuery.fn.fmatter.rowactions('" + f + "','" + e.gid + "','save'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
		g = g + "<div title='" + a.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + h + "><span class='ui-icon ui-icon-disk'></span></div>";
		h = "onclick=jQuery.fn.fmatter.rowactions('" + f + "','" + e.gid + "','cancel'," + e.pos + "); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
		g = g + "<div title='" + a.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + h + "><span class='ui-icon ui-icon-cancel'></span></div>";
		return "<div style='margin-left:8px;'>" + g + "</div>"
	};
	a.unformat = function (c, e, b, f) {
		var g, h = e.colModel.formatter,
            i = e.colModel.formatoptions || {},
            d = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
            k = e.colModel.unformat || a.fn.fmatter[h] && a.fn.fmatter[h].unformat;
		if (typeof k !== "undefined" && a.isFunction(k)) g = k(a(c).text(), e, c);
		else if (!a.fmatter.isUndefined(h) && a.fmatter.isString(h)) {
			g = a.jgrid.formatter || {};
			switch (h) {
				case "integer":
					i = a.extend({}, g.integer, i);
					e = i.thousandsSeparator.replace(d, "\\$1");
					g = a(c).text().replace(RegExp(e, "g"), "");
					break;
				case "number":
					i = a.extend({}, g.number, i);
					e = i.thousandsSeparator.replace(d, "\\$1");
					g = a(c).text().replace(RegExp(e, "g"), "").replace(i.decimalSeparator, ".");
					break;
				case "currency":
					i = a.extend({}, g.currency, i);
					e = i.thousandsSeparator.replace(d, "\\$1");
					g = a(c).text().replace(RegExp(e, "g"), "").replace(i.decimalSeparator, ".").replace(i.prefix, "").replace(i.suffix, "");
					break;
				case "checkbox":
					i = e.colModel.editoptions ? e.colModel.editoptions.value.split(":") : ["Yes", "No"];
					g = a("input", c).is(":checked") ? i[0] : i[1];
					break;
				case "select":
					g = a.unformat.select(c, e, b, f);
					break;
				case "actions":
					return "";
				default:
					g = a(c).text()
			}
		}
		return g !== undefined ? g : f === true ? a(c).text() : a.jgrid.htmlDecode(a(c).html())
	};
	a.unformat.select = function (c, e, b, f) {
		b = [];
		c = a(c).text();
		if (f === true) return c;
		e = a.extend({}, e.colModel.editoptions);
		if (e.value) {
			var g = e.value;
			e = e.multiple === true ? true : false;
			f = [];
			var h;
			if (e) {
				f = c.split(",");
				f = a.map(f, function (m) {
					return a.trim(m)
				})
			}
			if (a.fmatter.isString(g)) for (var i = g.split(";"), d = 0, k = 0; k < i.length; k++) {
				h = i[k].split(":");
				if (h.length > 2) h[1] = jQuery.map(h, function (m, l) {
					if (l > 0) return m
				}).join(":");
				if (e) {
					if (jQuery.inArray(h[1], f) > -1) {
						b[d] = h[0];
						d++
					}
				} else if (a.trim(h[1]) == a.trim(c)) {
					b[0] = h[0];
					break
				}
			} else if (a.fmatter.isObject(g) || a.isArray(g)) {
				e || (f[0] = c);
				b = jQuery.map(f, function (m) {
					var l;
					a.each(g, function (n, o) {
						if (o == m) {
							l = n;
							return false
						}
					});
					if (typeof l != "undefined") return l
				})
			}
			return b.join(", ")
		} else return c || ""
	};
	a.unformat.date = function (c, e) {
		var b = a.jgrid.formatter.date || {};
		a.fmatter.isUndefined(e.formatoptions) || (b = a.extend({}, b, e.formatoptions));
		return a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, e) : a.fmatter.util.DateFormat(b.newformat, c, b.srcformat, b)
	}
})(jQuery);
(function (a) {
	a.extend(a.jgrid, {
		showModal: function (c) {
			c.w.show()
		},
		closeModal: function (c) {
			c.w.hide().attr("aria-hidden", "true");
			c.o && c.o.remove()
		},
		hideModal: function (c, e) {
			e = a.extend({
				jqm: true,
				gb: ""
			}, e || {});
			if (e.onClose) {
				var b = e.onClose(c);
				if (typeof b == "boolean" && !b) return
			}
			if (a.fn.jqm && e.jqm === true) a(c).attr("aria-hidden", "true").jqmHide();
			else {
				if (e.gb !== "") try {
					a(".jqgrid-overlay:first", e.gb).hide()
				} catch (f) { }
				a(c).hide().attr("aria-hidden", "true")
			}
		},
		findPos: function (c) {
			var e = 0,
                b = 0;
			if (c.offsetParent) {
				do {
					e += c.offsetLeft;
					b += c.offsetTop
				} while (c = c.offsetParent)
			}
			return [e, b]
		},
		createModal: function (c, e, b, f, g, h, i) {
			var d = document.createElement("div"),
                k, m = this;
			i = a.extend({}, i || {});
			k = a(b.gbox).attr("dir") == "rtl" ? true : false;
			d.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
			d.id = c.themodal;
			var l = document.createElement("div");
			l.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
			l.id = c.modalhead;
			a(l).append("<span class='ui-jqdialog-title'>" + b.caption + "</span>");
			var n = a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function () {
				n.addClass("ui-state-hover")
			}, function () {
				n.removeClass("ui-state-hover")
			}).append("<span class='ui-icon ui-icon-closethick'></span>");
			a(l).append(n);
			if (k) {
				d.dir = "rtl";
				a(".ui-jqdialog-title", l).css("float", "right");
				a(".ui-jqdialog-titlebar-close", l).css("left", "0.3em")
			} else {
				d.dir = "ltr";
				a(".ui-jqdialog-title", l).css("float", "left");
				a(".ui-jqdialog-titlebar-close", l).css("right", "0.3em")
			}
			var o = document.createElement("div");
			a(o).addClass("ui-jqdialog-content ui-widget-content").attr("id", c.modalcontent);
			a(o).append(e);
			d.appendChild(o);
			a(d).prepend(l);
			if (h === true) a("body").append(d);
			else typeof h == "string" ? a(h).append(d) : a(d).insertBefore(f);
			a(d).css(i);
			if (typeof b.jqModal === "undefined") b.jqModal = true;
			e = {};
			if (a.fn.jqm && b.jqModal === true) {
				if (b.left === 0 && b.top === 0 && b.overlay) {
					i = [];
					i = this.findPos(g);
					b.left = i[0] + 4;
					b.top = i[1] + 4
				}
				e.top = b.top + "px";
				e.left = b.left
			} else if (b.left !== 0 || b.top !== 0) {
				e.left = b.left;
				e.top = b.top + "px"
			}
			a("a.ui-jqdialog-titlebar-close", l).click(function () {
				var r = a("#" + c.themodal).data("onClose") || b.onClose,
                    p = a("#" + c.themodal).data("gbox") || b.gbox;
				m.hideModal("#" + c.themodal, {
					gb: p,
					jqm: b.jqModal,
					onClose: r
				});
				return false
			});
			if (b.width === 0 || !b.width) b.width = 300;
			if (b.height === 0 || !b.height) b.height = 200;
			if (!b.zIndex) {
				f = a(f).parents("*[role=dialog]").filter(":first").css("z-index");
				b.zIndex = f ? parseInt(f, 10) + 2 : 950
			}
			f = 0;
			if (k && e.left && !h) {
				f = a(b.gbox).width() - (!isNaN(b.width) ? parseInt(b.width, 10) : 0) - 8;
				e.left = parseInt(e.left, 10) + parseInt(f, 10)
			}
			if (e.left) e.left += "px";
			a(d).css(a.extend({
				width: isNaN(b.width) ? "auto" : b.width + "px",
				height: isNaN(b.height) ? "auto" : b.height + "px",
				zIndex: b.zIndex,
				overflow: "hidden"
			}, e)).attr({
				tabIndex: "-1",
				role: "dialog",
				"aria-labelledby": c.modalhead,
				"aria-hidden": "true"
			});
			if (typeof b.drag == "undefined") b.drag = true;
			if (typeof b.resize == "undefined") b.resize = true;
			if (b.drag) {
				a(l).css("cursor", "move");
				if (a.fn.jqDrag) a(d).jqDrag(l);
				else try {
					a(d).draggable({
						handle: a("#" + l.id)
					})
				} catch (j) { }
			}
			if (b.resize) if (a.fn.jqResize) {
				a(d).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ui-icon-grip-diagonal-se'></div>");
				a("#" + c.themodal).jqResize(".jqResize", c.scrollelm ? "#" + c.scrollelm : false)
			} else try {
				a(d).resizable({
					handles: "se, sw",
					alsoResize: c.scrollelm ? "#" + c.scrollelm : false
				})
			} catch (v) { }
			b.closeOnEscape === true && a(d).keydown(function (r) {
				if (r.which == 27) {
					r = a("#" + c.themodal).data("onClose") || b.onClose;
					m.hideModal(this, {
						gb: b.gbox,
						jqm: b.jqModal,
						onClose: r
					})
				}
			})
		},
		viewModal: function (c, e) {
			e = a.extend({
				toTop: true,
				overlay: 10,
				modal: false,
				overlayClass: "ui-widget-overlay",
				onShow: this.showModal,
				onHide: this.closeModal,
				gbox: "",
				jqm: true,
				jqM: true
			}, e || {});
			if (a.fn.jqm && e.jqm === true) e.jqM ? a(c).attr("aria-hidden", "false").jqm(e).jqmShow() : a(c).attr("aria-hidden", "false").jqmShow();
			else {
				if (e.gbox !== "") {
					a(".jqgrid-overlay:first", e.gbox).show();
					a(c).data("gbox", e.gbox)
				}
				a(c).show().attr("aria-hidden", "false");
				try {
					a(":input:visible", c)[0].focus()
				} catch (b) { }
			}
		},
		info_dialog: function (c, e, b, f) {
			var g = {
				width: 290,
				height: "auto",
				dataheight: "auto",
				drag: true,
				resize: false,
				caption: "<b>" + c + "</b>",
				left: 250,
				top: 170,
				zIndex: 1E3,
				jqModal: true,
				modal: false,
				closeOnEscape: true,
				align: "center",
				buttonalign: "center",
				buttons: []
			};
			a.extend(g, f || {});
			var h = g.jqModal,
                i = this;
			if (a.fn.jqm && !h) h = false;
			c = "";
			if (g.buttons.length > 0) for (f = 0; f < g.buttons.length; f++) {
				if (typeof g.buttons[f].id == "undefined") g.buttons[f].id = "info_button_" + f;
				c += "<a href='javascript:void(0)' id='" + g.buttons[f].id + "' class='fm-button ui-state-default ui-corner-all'>" + g.buttons[f].text + "</a>"
			}
			f = isNaN(g.dataheight) ? g.dataheight : g.dataheight + "px";
			var d = "<div id='info_id'>";
			d += "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + f + ";" + ("text-align:" + g.align + ";") + "'>" + e + "</div>";
			d += b ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" + b + "</a>" + c + "</div>" : c !== "" ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + c + "</div>" : "";
			d += "</div>";
			try {
				a("#info_dialog").attr("aria-hidden") == "false" && this.hideModal("#info_dialog", {
					jqm: h
				});
				a("#info_dialog").remove()
			} catch (k) { }
			this.createModal({
				themodal: "info_dialog",
				modalhead: "info_head",
				modalcontent: "info_content",
				scrollelm: "infocnt"
			}, d, g, "", "", true);
			c && a.each(g.buttons, function (l) {
				a("#" + this.id, "#info_id").bind("click", function () {
					g.buttons[l].onClick.call(a("#info_dialog"));
					return false
				})
			});
			a("#closedialog", "#info_id").click(function () {
				i.hideModal("#info_dialog", {
					jqm: h
				});
				return false
			});
			a(".fm-button", "#info_dialog").hover(function () {
				a(this).addClass("ui-state-hover")
			}, function () {
				a(this).removeClass("ui-state-hover")
			});
			a.isFunction(g.beforeOpen) && g.beforeOpen();
			this.viewModal("#info_dialog", {
				onHide: function (l) {
					l.w.hide().remove();
					l.o && l.o.remove()
				},
				modal: g.modal,
				jqm: h
			});
			a.isFunction(g.afterOpen) && g.afterOpen();
			try {
				a("#info_dialog").focus()
			} catch (m) { }
		},
		createEl: function (c, e, b, f, g) {
			function h(j, v) {
				a.isFunction(v.dataInit) && v.dataInit(j);
				v.dataEvents && a.each(v.dataEvents, function () {
					this.data !== undefined ? a(j).bind(this.type, this.data, this.fn) : a(j).bind(this.type, this.fn)
				});
				return v
			}
			function i(j, v, r) {
				var p = ["dataInit", "dataEvents", "dataUrl", "buildSelect", "sopt", "searchhidden", "defaultValue", "attr"];
				if (typeof r != "undefined" && a.isArray(r)) p = a.extend(p, r);
				a.each(v, function (q, u) {
					a.inArray(q, p) === -1 && a(j).attr(q, u)
				});
				v.hasOwnProperty("id") || a(j).attr("id", a.jgrid.randId())
			}
			var d = "";
			switch (c) {
				case "textarea":
					d = document.createElement("textarea");
					if (f) e.cols || a(d).css({
						width: "98%"
					});
					else if (!e.cols) e.cols = 20;
					if (!e.rows) e.rows = 2;
					if (b == "&nbsp;" || b == "&#160;" || b.length == 1 && b.charCodeAt(0) == 160) b = "";
					d.value = b;
					i(d, e);
					e = h(d, e);
					a(d).attr({
						role: "textbox",
						multiline: "true"
					});
					break;
				case "checkbox":
					d = document.createElement("input");
					d.type = "checkbox";
					if (e.value) {
						c = e.value.split(":");
						if (b === c[0]) {
							d.checked = true;
							d.defaultChecked = true
						}
						d.value = c[0];
						a(d).attr("offval", c[1])
					} else {
						c = b.toLowerCase();
						if (c.search(/(false|0|no|off|undefined)/i) < 0 && c !== "") {
							d.checked = true;
							d.defaultChecked = true;
							d.value = b
						} else d.value = "on";
						a(d).attr("offval", "off")
					}
					i(d, e, ["value"]);
					e = h(d, e);
					a(d).attr("role", "checkbox");
					break;
				case "select":
					d = document.createElement("select");
					d.setAttribute("role", "select");
					f = [];
					if (e.multiple === true) {
						c = true;
						d.multiple = "multiple";
						a(d).attr("aria-multiselectable", "true")
					} else c = false;
					if (typeof e.dataUrl != "undefined") a.ajax(a.extend({
						url: e.dataUrl,
						type: "GET",
						dataType: "html",
						context: {
							elem: d,
							options: e,
							vl: b
						},
						success: function (j) {
							var v = [],
                            r = this.elem,
                            p = this.vl,
                            q = a.extend({}, this.options),
                            u = q.multiple === true;
							if (typeof q.buildSelect != "undefined") j = q.buildSelect(j);
							if (j = a(j).html()) {
								a(r).append(j);
								i(r, q);
								q = h(r, q);
								if (typeof q.size === "undefined") q.size = u ? 3 : 1;
								if (u) {
									v = p.split(",");
									v = a.map(v, function (x) {
										return a.trim(x)
									})
								} else v[0] = a.trim(p);
								setTimeout(function () {
									a("option", r).each(function () {
										a(this).attr("role", "option");
										if (a.inArray(a.trim(a(this).text()), v) > -1 || a.inArray(a.trim(a(this).val()), v) > -1) this.selected = "selected"
									})
								}, 0)
							}
						}
					}, g || {}));
					else if (e.value) {
						var k;
						if (typeof e.size === "undefined") e.size = c ? 3 : 1;
						if (c) {
							f = b.split(",");
							f = a.map(f, function (j) {
								return a.trim(j)
							})
						}
						if (typeof e.value === "function") e.value = e.value();
						var m, l, n = e.separator === undefined ? ":" : e.separator;
						if (typeof e.value === "string") {
							m = e.value.split(";");
							for (k = 0; k < m.length; k++) {
								l = m[k].split(n);
								if (l.length > 2) l[1] = a.map(l, function (j, v) {
									if (v > 0) return j
								}).join(":");
								g = document.createElement("option");
								g.setAttribute("role", "option");
								g.value = l[0];
								g.innerHTML = l[1];
								d.appendChild(g);
								if (!c && (a.trim(l[0]) == a.trim(b) || a.trim(l[1]) == a.trim(b))) g.selected = "selected";
								if (c && (a.inArray(a.trim(l[1]), f) > -1 || a.inArray(a.trim(l[0]), f) > -1)) g.selected = "selected"
							}
						} else if (typeof e.value === "object") {
							n = e.value;
							for (k in n) if (n.hasOwnProperty(k)) {
								g = document.createElement("option");
								g.setAttribute("role", "option");
								g.value = k;
								g.innerHTML = n[k];
								d.appendChild(g);
								if (!c && (a.trim(k) == a.trim(b) || a.trim(n[k]) == a.trim(b))) g.selected = "selected";
								if (c && (a.inArray(a.trim(n[k]), f) > -1 || a.inArray(a.trim(k), f) > -1)) g.selected = "selected"
							}
						}
						i(d, e, ["value"]);
						e = h(d, e)
					}
					break;
				case "text":
				case "password":
				case "button":
					k = c == "button" ? "button" : "textbox";
					d = document.createElement("input");
					d.type = c;
					d.value = b;
					i(d, e);
					e = h(d, e);
					if (c != "button") if (f) e.size || a(d).css({
						width: "98%"
					});
					else if (!e.size) e.size = 20;
					a(d).attr("role", k);
					break;
				case "image":
				case "file":
					d = document.createElement("input");
					d.type = c;
					i(d, e);
					e = h(d, e);
					break;
				case "custom":
					d = document.createElement("span");
					try {
						if (a.isFunction(e.custom_element)) if (n = e.custom_element.call(this, b, e)) {
							n = a(n).addClass("customelement").attr({
								id: e.id,
								name: e.name
							});
							a(d).empty().append(n)
						} else throw "e2";
						else throw "e1";
					} catch (o) {
						o == "e1" && this.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose);
						o == "e2" ? this.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : this.info_dialog(a.jgrid.errors.errcap, typeof o === "string" ? o : o.message, a.jgrid.edit.bClose)
					}
			}
			return d
		},
		checkDate: function (c, e) {
			var b = {},
                f;
			c = c.toLowerCase();
			f = c.indexOf("/") != -1 ? "/" : c.indexOf("-") != -1 ? "-" : c.indexOf(".") != -1 ? "." : "/";
			c = c.split(f);
			e = e.split(f);
			if (e.length != 3) return false;
			f = -1;
			for (var g, h = -1, i = -1, d = 0; d < c.length; d++) {
				g = isNaN(e[d]) ? 0 : parseInt(e[d], 10);
				b[c[d]] = g;
				g = c[d];
				if (g.indexOf("y") != -1) f = d;
				if (g.indexOf("m") != -1) i = d;
				if (g.indexOf("d") != -1) h = d
			}
			g = c[f] == "y" || c[f] == "yyyy" ? 4 : c[f] == "yy" ? 2 : -1;
			d = function (m) {
				for (var l = 1; l <= m; l++) {
					this[l] = 31;
					if (l == 4 || l == 6 || l == 9 || l == 11) this[l] = 30;
					if (l == 2) this[l] = 29
				}
				return this
			} (12);
			var k;
			if (f === -1) return false;
			else {
				k = b[c[f]].toString();
				if (g == 2 && k.length == 1) g = 1;
				if (k.length != g || b[c[f]] === 0 && e[f] != "00") return false
			}
			if (i === -1) return false;
			else {
				k = b[c[i]].toString();
				if (k.length < 1 || b[c[i]] < 1 || b[c[i]] > 12) return false
			}
			if (h === -1) return false;
			else {
				k = b[c[h]].toString();
				if (k.length < 1 || b[c[h]] < 1 || b[c[h]] > 31 || b[c[i]] == 2 && b[c[h]] > (b[c[f]] % 4 === 0 && (b[c[f]] % 100 !== 0 || b[c[f]] % 400 === 0) ? 29 : 28) || b[c[h]] > d[b[c[i]]]) return false
			}
			return true
		},
		isEmpty: function (c) {
			return c.match(/^\s+$/) || c === "" ? true : false
		},
		checkTime: function (c) {
			var e = /^(\d{1,2}):(\d{2})([ap]m)?$/;
			if (!this.isEmpty(c)) if (c = c.match(e)) {
				if (c[3]) {
					if (c[1] < 1 || c[1] > 12) return false
				} else if (c[1] > 23) return false;
				if (c[2] > 59) return false
			} else return false;
			return true
		},
		checkValues: function (c, e, b, f, g) {
			var h, i;
			if (typeof f === "undefined") if (typeof e == "string") {
				f = 0;
				for (g = b.p.colModel.length; f < g; f++) if (b.p.colModel[f].name == e) {
					h = b.p.colModel[f].editrules;
					e = f;
					try {
						i = b.p.colModel[f].formoptions.label
					} catch (d) { }
					break
				}
			} else {
				if (e >= 0) h = b.p.colModel[e].editrules
			} else {
				h = f;
				i = g === undefined ? "_" : g
			}
			if (h) {
				i || (i = b.p.colNames[e]);
				if (h.required === true) if (this.isEmpty(c)) return [false, i + ": " + a.jgrid.edit.msg.required, ""];
				f = h.required === false ? false : true;
				if (h.number === true) if (!(f === false && this.isEmpty(c))) if (isNaN(c)) return [false, i + ": " + a.jgrid.edit.msg.number, ""];
				if (typeof h.minValue != "undefined" && !isNaN(h.minValue)) if (parseFloat(c) < parseFloat(h.minValue)) return [false, i + ": " + a.jgrid.edit.msg.minValue + " " + h.minValue, ""];
				if (typeof h.maxValue != "undefined" && !isNaN(h.maxValue)) if (parseFloat(c) > parseFloat(h.maxValue)) return [false, i + ": " + a.jgrid.edit.msg.maxValue + " " + h.maxValue, ""];
				if (h.email === true) if (!(f === false && this.isEmpty(c))) {
					g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
					if (!g.test(c)) return [false, i + ": " + a.jgrid.edit.msg.email, ""]
				}
				if (h.integer === true) if (!(f === false && this.isEmpty(c))) {
					if (isNaN(c)) return [false, i + ": " + a.jgrid.edit.msg.integer, ""];
					if (c % 1 !== 0 || c.indexOf(".") != -1) return [false, i + ": " + a.jgrid.edit.msg.integer, ""]
				}
				if (h.date === true) if (!(f === false && this.isEmpty(c))) {
					e = b.p.colModel[e].formatoptions && b.p.colModel[e].formatoptions.newformat ? b.p.colModel[e].formatoptions.newformat : b.p.colModel[e].datefmt || "Y-m-d";
					if (!this.checkDate(e, c)) return [false, i + ": " + a.jgrid.edit.msg.date + " - " + e, ""]
				}
				if (h.time === true) if (!(f === false && this.isEmpty(c))) if (!this.checkTime(c)) return [false, i + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
				if (h.url === true) if (!(f === false && this.isEmpty(c))) {
					g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
					if (!g.test(c)) return [false, i + ": " + a.jgrid.edit.msg.url, ""]
				}
				if (h.custom === true) if (!(f === false && this.isEmpty(c))) if (a.isFunction(h.custom_func)) {
					c = h.custom_func.call(b, c, i);
					return a.isArray(c) ? c : [false, a.jgrid.edit.msg.customarray, ""]
				} else return [false, a.jgrid.edit.msg.customfcheck, ""]
			}
			return [true, "", ""]
		}
	})
})(jQuery);
(function (a) {
	a.fn.jqFilter = function (c) {
		if (typeof c === "string") {
			var e = a.fn.jqFilter[c];
			if (!e) throw "jqFilter - No such method: " + c;
			var b = a.makeArray(arguments).slice(1);
			return e.apply(this, b)
		}
		var f = a.extend(true, {
			filter: null,
			columns: [],
			onChange: null,
			afterRedraw: null,
			checkValues: null,
			error: false,
			errmsg: "",
			errorcheck: true,
			showQuery: true,
			sopt: null,
			ops: [{
				name: "eq",
				description: "equal",
				operator: "="
			}, {
				name: "ne",
				description: "not equal",
				operator: "<>"
			}, {
				name: "lt",
				description: "less",
				operator: "<"
			}, {
				name: "le",
				description: "less or equal",
				operator: "<="
			}, {
				name: "gt",
				description: "greater",
				operator: ">"
			}, {
				name: "ge",
				description: "greater or equal",
				operator: ">="
			}, {
				name: "bw",
				description: "begins with",
				operator: "LIKE"
			}, {
				name: "bn",
				description: "does not begin with",
				operator: "NOT LIKE"
			}, {
				name: "in",
				description: "in",
				operator: "IN"
			}, {
				name: "ni",
				description: "not in",
				operator: "NOT IN"
			}, {
				name: "ew",
				description: "ends with",
				operator: "LIKE"
			}, {
				name: "en",
				description: "does not end with",
				operator: "NOT LIKE"
			}, {
				name: "cn",
				description: "contains",
				operator: "LIKE"
			}, {
				name: "nc",
				description: "does not contain",
				operator: "NOT LIKE"
			}, {
				name: "nu",
				description: "is null",
				operator: "IS NULL"
			}, {
				name: "nn",
				description: "is not null",
				operator: "IS NOT NULL"
			}],
			numopts: ["eq", "ne", "lt", "le", "gt", "ge", "nu", "nn", "in", "ni"],
			stropts: ["eq", "ne", "bw", "bn", "ew", "en", "cn", "nc", "nu", "nn", "in", "ni"],
			_gridsopt: [],
			groupOps: [{
				op: "AND",
				text: "AND"
			}, {
				op: "OR",
				text: "OR"
			}],
			groupButton: true,
			ruleButtons: true,
			direction: "ltr"
		}, c || {});
		return this.each(function () {
			if (!this.filter) {
				this.p = f;
				if (this.p.filter === null || this.p.filter === undefined) this.p.filter = {
					groupOp: this.p.groupOps[0].op,
					rules: [],
					groups: []
				};
				var g, h = this.p.columns.length,
                    i, d = /msie/i.test(navigator.userAgent) && !window.opera;
				if (this.p._gridsopt.length) for (g = 0; g < this.p._gridsopt.length; g++) this.p.ops[g].description = this.p._gridsopt[g];
				this.p.initFilter = a.extend(true, {}, this.p.filter);
				if (h) {
					for (g = 0; g < h; g++) {
						i = this.p.columns[g];
						if (i.stype) i.inputtype = i.stype;
						else if (!i.inputtype) i.inputtype = "text";
						if (i.sorttype) i.searchtype = i.sorttype;
						else if (!i.searchtype) i.searchtype = "string";
						if (i.hidden === undefined) i.hidden = false;
						if (!i.label) i.label = i.name;
						if (i.index) i.name = i.index;
						if (!i.hasOwnProperty("searchoptions")) i.searchoptions = {};
						if (!i.hasOwnProperty("searchrules")) i.searchrules = {}
					}
					this.p.showQuery && a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>");
					var k = function (m, l) {
						var n = [true, ""];
						if (a.isFunction(l.searchrules)) n = l.searchrules(m, l);
						else if (a.jgrid && a.jgrid.checkValues) try {
							n = a.jgrid.checkValues(m, -1, null, l.searchrules, l.label)
						} catch (o) { }
						if (n && n.length && n[0] === false) {
							f.error = !n[0];
							f.errmsg = n[1]
						}
					};
					this.onchange = function () {
						this.p.error = false;
						this.p.errmsg = "";
						return a.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : false
					};
					this.reDraw = function () {
						a("table.group:first", this).remove();
						var m = this.createTableForGroup(f.filter, null);
						a(this).append(m);
						a.isFunction(this.p.afterRedraw) && this.p.afterRedraw.call(this, this.p)
					};
					this.createTableForGroup = function (m, l) {
						var n = this,
                            o, j = a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"),
                            v = "left";
						if (this.p.direction == "rtl") {
							v = "right";
							j.attr("dir", "rtl")
						}
						l === null && j.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='" + v + "'></th></tr>");
						var r = a("<tr></tr>");
						j.append(r);
						v = a("<th colspan='5' align='" + v + "'></th>");
						r.append(v);
						if (this.p.ruleButtons === true) {
							var p = a("<select class='opsel'></select>");
							v.append(p);
							r = "";
							var q;
							for (o = 0; o < f.groupOps.length; o++) {
								q = m.groupOp === n.p.groupOps[o].op ? " selected='selected'" : "";
								r += "<option value='" + n.p.groupOps[o].op + "'" + q + ">" + n.p.groupOps[o].text + "</option>"
							}
							p.append(r).bind("change", function () {
								m.groupOp = a(p).val();
								n.onchange()
							})
						}
						r = "<span></span>";
						if (this.p.groupButton) {
							r = a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>");
							r.bind("click", function () {
								if (m.groups === undefined) m.groups = [];
								m.groups.push({
									groupOp: f.groupOps[0].op,
									rules: [],
									groups: []
								});
								n.reDraw();
								n.onchange();
								return false
							})
						}
						v.append(r);
						if (this.p.ruleButtons === true) {
							r = a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>");
							var u;
							r.bind("click", function () {
								if (m.rules === undefined) m.rules = [];
								for (o = 0; o < n.p.columns.length; o++) {
									var x = typeof n.p.columns[o].search === "undefined" ? true : n.p.columns[o].search,
                                        D = n.p.columns[o].hidden === true;
									if (n.p.columns[o].searchoptions.searchhidden === true && x || x && !D) {
										u = n.p.columns[o];
										break
									}
								}
								m.rules.push({
									field: u.name,
									op: (u.searchoptions.sopt ? u.searchoptions.sopt : n.p.sopt ? n.p.sopt : u.searchtype === "string" ? n.p.stropts : n.p.numopts)[0],
									data: ""
								});
								n.reDraw();
								return false
							});
							v.append(r)
						}
						if (l !== null) {
							r = a("<input type='button' value='-' title='Delete group' class='delete-group'/>");
							v.append(r);
							r.bind("click", function () {
								for (o = 0; o < l.groups.length; o++) if (l.groups[o] === m) {
									l.groups.splice(o, 1);
									break
								}
								n.reDraw();
								n.onchange();
								return false
							})
						}
						if (m.groups !== undefined) for (o = 0; o < m.groups.length; o++) {
							v = a("<tr></tr>");
							j.append(v);
							r = a("<td class='first'></td>");
							v.append(r);
							r = a("<td colspan='4'></td>");
							r.append(this.createTableForGroup(m.groups[o], m));
							v.append(r)
						}
						if (m.groupOp === undefined) m.groupOp = n.p.groupOps[0].op;
						if (m.rules !== undefined) for (o = 0; o < m.rules.length; o++) j.append(this.createTableRowForRule(m.rules[o], m));
						return j
					};
					this.createTableRowForRule = function (m, l) {
						var n = this,
                            o = a("<tr></tr>"),
                            j, v, r, p, q = "",
                            u;
						o.append("<td class='first'></td>");
						var x = a("<td class='columns'></td>");
						o.append(x);
						var D = a("<select></select>"),
                            C, A = [];
						x.append(D);
						D.bind("change", function () {
							m.field = a(D).val();
							r = a(this).parents("tr:first");
							for (j = 0; j < n.p.columns.length; j++) if (n.p.columns[j].name === m.field) {
								p = n.p.columns[j];
								break
							}
							if (p) {
								p.searchoptions.id = a.jgrid.randId();
								if (d && p.inputtype === "text") if (!p.searchoptions.size) p.searchoptions.size = 10;
								var z = a.jgrid.createEl(p.inputtype, p.searchoptions, "", true, n.p.ajaxSelectOptions, true);
								a(z).addClass("input-elm");
								v = p.searchoptions.sopt ? p.searchoptions.sopt : n.p.sopt ? n.p.sopt : p.searchtype === "string" ? n.p.stropts : n.p.numopts;
								var aa = "",
                                    V = 0;
								A = [];
								a.each(n.p.ops, function () {
									A.push(this.name)
								});
								for (j = 0; j < v.length; j++) {
									C = a.inArray(v[j], A);
									if (C !== -1) {
										if (V === 0) m.op = n.p.ops[C].name;
										aa += "<option value='" + n.p.ops[C].name + "'>" + n.p.ops[C].description + "</option>";
										V++
									}
								}
								a(".selectopts", r).empty().append(aa);
								a(".selectopts", r)[0].selectedIndex = 0;
								if (a.browser.msie && a.browser.version < 9) {
									aa = parseInt(a("select.selectopts", r)[0].offsetWidth) + 1;
									a(".selectopts", r).width(aa);
									a(".selectopts", r).css("width", "auto")
								}
								a(".data", r).empty().append(z);
								a(".input-elm", r).bind("change", function () {
									m.data = a(this).val();
									n.onchange()
								});
								setTimeout(function () {
									m.data = a(z).val();
									n.onchange()
								}, 0)
							}
						});
						for (j = x = 0; j < n.p.columns.length; j++) {
							u = typeof n.p.columns[j].search === "undefined" ? true : n.p.columns[j].search;
							var B = n.p.columns[j].hidden === true;
							if (n.p.columns[j].searchoptions.searchhidden === true && u || u && !B) {
								u = "";
								if (m.field === n.p.columns[j].name) {
									u = " selected='selected'";
									x = j
								}
								q += "<option value='" + n.p.columns[j].name + "'" + u + ">" + n.p.columns[j].label + "</option>"
							}
						}
						D.append(q);
						q = a("<td class='operators'></td>");
						o.append(q);
						p = f.columns[x];
						p.searchoptions.id = a.jgrid.randId();
						if (d && p.inputtype === "text") if (!p.searchoptions.size) p.searchoptions.size = 10;
						x = a.jgrid.createEl(p.inputtype, p.searchoptions, m.data, true, n.p.ajaxSelectOptions, true);
						var J = a("<select class='selectopts'></select>");
						q.append(J);
						J.bind("change", function () {
							m.op = a(J).val();
							r = a(this).parents("tr:first");
							var z = a(".input-elm", r)[0];
							if (m.op === "nu" || m.op === "nn") {
								m.data = "";
								z.value = "";
								z.setAttribute("readonly", "true");
								z.setAttribute("disabled", "true")
							} else {
								z.removeAttribute("readonly");
								z.removeAttribute("disabled")
							}
							n.onchange()
						});
						v = p.searchoptions.sopt ? p.searchoptions.sopt : n.p.sopt ? n.p.sopt : p.searchtype === "string" ? f.stropts : n.p.numopts;
						q = "";
						a.each(n.p.ops, function () {
							A.push(this.name)
						});
						for (j = 0; j < v.length; j++) {
							C = a.inArray(v[j], A);
							if (C !== -1) {
								u = m.op === n.p.ops[C].name ? " selected='selected'" : "";
								q += "<option value='" + n.p.ops[C].name + "'" + u + ">" + n.p.ops[C].description + "</option>"
							}
						}
						J.append(q);
						q = a("<td class='data'></td>");
						o.append(q);
						q.append(x);
						a(x).addClass("input-elm").bind("change", function () {
							m.data = a(this).val();
							n.onchange()
						});
						q = a("<td></td>");
						o.append(q);
						if (this.p.ruleButtons === true) {
							x = a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>");
							q.append(x);
							x.bind("click", function () {
								for (j = 0; j < l.rules.length; j++) if (l.rules[j] === m) {
									l.rules.splice(j, 1);
									break
								}
								n.reDraw();
								n.onchange();
								return false
							})
						}
						return o
					};
					this.getStringForGroup = function (m) {
						var l = "(",
                            n;
						if (m.groups !== undefined) for (n = 0; n < m.groups.length; n++) {
							if (l.length > 1) l += " " + m.groupOp + " ";
							try {
								l += this.getStringForGroup(m.groups[n])
							} catch (o) {
								alert(o)
							}
						}
						if (m.rules !== undefined) try {
							for (n = 0; n < m.rules.length; n++) {
								if (l.length > 1) l += " " + m.groupOp + " ";
								l += this.getStringForRule(m.rules[n])
							}
						} catch (j) {
							alert(j)
						}
						l += ")";
						return l === "()" ? "" : l
					};
					this.getStringForRule = function (m) {
						var l = "",
                            n = "",
                            o, j;
						for (o = 0; o < this.p.ops.length; o++) if (this.p.ops[o].name === m.op) {
							l = this.p.ops[o].operator;
							n = this.p.ops[o].name;
							break
						}
						for (o = 0; o < this.p.columns.length; o++) if (this.p.columns[o].name === m.field) {
							j = this.p.columns[o];
							break
						}
						o = m.data;
						if (n === "bw" || n === "bn") o += "%";
						if (n === "ew" || n === "en") o = "%" + o;
						if (n === "cn" || n === "nc") o = "%" + o + "%";
						if (n === "in" || n === "ni") o = " (" + o + ")";
						f.errorcheck && k(m.data, j);
						return a.inArray(j.searchtype, ["int", "integer", "float", "number", "currency"]) !== -1 || n === "nn" || n === "nu" ? m.field + " " + l + " " + o : m.field + " " + l + ' "' + o + '"'
					};
					this.resetFilter = function () {
						this.p.filter = a.extend(true, {}, this.p.initFilter);
						this.reDraw();
						this.onchange()
					};
					this.hideError = function () {
						a("th.ui-state-error", this).html("");
						a("tr.error", this).hide()
					};
					this.showError = function () {
						a("th.ui-state-error", this).html(this.p.errmsg);
						a("tr.error", this).show()
					};
					this.toUserFriendlyString = function () {
						return this.getStringForGroup(f.filter)
					};
					this.toString = function () {
						function m(n) {
							var o = "(",
                                j;
							if (n.groups !== undefined) for (j = 0; j < n.groups.length; j++) {
								if (o.length > 1) o += n.groupOp === "OR" ? " || " : " && ";
								o += m(n.groups[j])
							}
							if (n.rules !== undefined) for (j = 0; j < n.rules.length; j++) {
								if (o.length > 1) o += n.groupOp === "OR" ? " || " : " && ";
								var v = n.rules[j];
								if (l.p.errorcheck) {
									var r = void 0,
                                        p = void 0;
									for (r = 0; r < l.p.columns.length; r++) if (l.p.columns[r].name === v.field) {
										p = l.p.columns[r];
										break
									}
									p && k(v.data, p)
								}
								o += v.op + "(item." + v.field + ",'" + v.data + "')"
							}
							o += ")";
							return o === "()" ? "" : o
						}
						var l = this;
						return m(this.p.filter)
					};
					this.reDraw();
					if (this.p.showQuery) this.onchange();
					this.filter = true
				}
			}
		})
	};
	a.extend(a.fn.jqFilter, {
		toSQLString: function () {
			var c = "";
			this.each(function () {
				c = this.toUserFriendlyString()
			});
			return c
		},
		filterData: function () {
			var c;
			this.each(function () {
				c = this.p.filter
			});
			return c
		},
		getParameter: function (c) {
			if (c !== undefined) if (this.p.hasOwnProperty(c)) return this.p[c];
			return this.p
		},
		resetFilter: function () {
			return this.each(function () {
				this.resetFilter()
			})
		},
		addFilter: function (c) {
			if (typeof c === "string") c = jQuery.jgrid.parse(c);
			this.each(function () {
				this.p.filter = c;
				this.reDraw();
				this.onchange()
			})
		}
	})
})(jQuery);
(function (a) {
	var c = {};
	a.jgrid.extend({
		searchGrid: function (e) {
			e = a.extend({
				recreateFilter: false,
				drag: true,
				sField: "searchField",
				sValue: "searchString",
				sOper: "searchOper",
				sFilter: "filters",
				loadDefaults: true,
				beforeShowSearch: null,
				afterShowSearch: null,
				onInitializeSearch: null,
				afterRedraw: null,
				closeAfterSearch: false,
				closeAfterReset: false,
				closeOnEscape: false,
				multipleSearch: false,
				multipleGroup: false,
				top: 0,
				left: 0,
				jqModal: true,
				modal: false,
				resize: true,
				width: 450,
				height: "auto",
				dataheight: "auto",
				showQuery: false,
				errorcheck: true,
				sopt: null,
				stringResult: undefined,
				onClose: null,
				onSearch: null,
				onReset: null,
				toTop: true,
				overlay: 30,
				columns: [],
				tmplNames: null,
				tmplFilters: null,
				tmplLabel: " Template: ",
				showOnLoad: false,
				layer: null
			}, a.jgrid.search, e || {});
			return this.each(function () {
				function b() {
					if (a.isFunction(e.beforeShowSearch)) {
						h = e.beforeShowSearch(a("#" + g));
						if (typeof h === "undefined") h = true
					}
					if (h) {
						a.jgrid.viewModal("#" + i.themodal, {
							gbox: "#gbox_" + g,
							jqm: e.jqModal,
							modal: e.modal,
							overlay: e.overlay,
							toTop: e.toTop
						});
						a.isFunction(e.afterShowSearch) && e.afterShowSearch(a("#" + g))
					}
				}
				var f = this;
				if (f.grid) {
					var g = "fbox_" + f.p.id,
                        h = true,
                        i = {
                        	themodal: "searchmod" + g,
                        	modalhead: "searchhd" + g,
                        	modalcontent: "searchcnt" + g,
                        	scrollelm: g
                        },
                        d = f.p.postData[e.sFilter];
					if (typeof d === "string") d = a.jgrid.parse(d);
					e.recreateFilter === true && a("#" + i.themodal).remove();
					if (a("#" + i.themodal).html() !== null) b();
					else {
						var k = a("<div><div id='" + g + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" + f.p.id),
                            m = "left",
                            l = "";
						if (f.p.direction == "rtl") {
							m = "right";
							l = " style='text-align:left'";
							k.attr("dir", "rtl")
						}
						var n = a.extend([], f.p.colModel),
                            o = "<a href='javascript:void(0)' id='" + g + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" + e.Find + "</a>",
                            j = "<a href='javascript:void(0)' id='" + g + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + e.Reset + "</a>",
                            v = "",
                            r = "",
                            p, q = false,
                            u = -1;
						if (e.showQuery) v = "<a href='javascript:void(0)' id='" + g + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>";
						if (e.columns.length) n = e.columns;
						else a.each(n, function (D, C) {
							if (!C.label) C.label = f.p.colNames[D];
							if (!q) {
								var A = typeof C.search === "undefined" ? true : C.search,
                                    B = C.hidden === true;
								if (C.searchoptions && C.searchoptions.searchhidden === true && A || A && !B) {
									q = true;
									p = C.index || C.name;
									u = D
								}
							}
						});
						if (!d && p || e.multipleSearch === false) {
							var x = "eq";
							if (u >= 0 && n[u].searchoptions && n[u].searchoptions.sopt) x = n[u].searchoptions.sopt[0];
							else if (e.sopt && e.sopt.length) x = e.sopt[0];
							d = {
								groupOp: "AND",
								rules: [{
									field: p,
									op: x,
									data: ""
								}]
							}
						}
						q = false;
						if (e.tmplNames && e.tmplNames.length) {
							q = true;
							r = e.tmplLabel;
							r += "<select class='ui-template'>";
							r += "<option value='default'>Default</option>";
							a.each(e.tmplNames, function (D, C) {
								r += "<option value='" + D + "'>" + C + "</option>"
							});
							r += "</select>"
						}
						m = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + g + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" + m + "'>" + j + r + "</td><td class='EditButton' " + l + ">" + v + o + "</td></tr></tbody></table>";
						a("#" + g).jqFilter({
							columns: n,
							filter: e.loadDefaults ? d : null,
							showQuery: e.showQuery,
							errorcheck: e.errorcheck,
							sopt: e.sopt,
							groupButton: e.multipleGroup,
							ruleButtons: e.multipleSearch,
							afterRedraw: e.afterRedraw,
							_gridsopt: a.jgrid.search.odata,
							ajaxSelectOptions: f.p.ajaxSelectOptions,
							onChange: function () {
								this.p.showQuery && a(".query", this).html(this.toUserFriendlyString())
							},
							direction: f.p.direction
						});
						k.append(m);
						q && e.tmplFilters && e.tmplFilters.length && a(".ui-template", k).bind("change", function () {
							var D = a(this).val();
							D == "default" ? a("#" + g).jqFilter("addFilter", d) : a("#" + g).jqFilter("addFilter", e.tmplFilters[parseInt(D, 10)]);
							return false
						});
						if (e.multipleGroup === true) e.multipleSearch = true;
						if (a.isFunction(e.onInitializeSearch)) e.onInitializeSearch(a("#" + g));
						e.gbox = "#gbox_" + g;
						e.layer ? a.jgrid.createModal(i, k, e, "#gview_" + f.p.id, a("#gbox_" + f.p.id)[0], "#" + e.layer, {
							position: "relative"
						}) : a.jgrid.createModal(i, k, e, "#gview_" + f.p.id, a("#gbox_" + f.p.id)[0]);
						v && a("#" + g + "_query").bind("click", function () {
							a(".queryresult", k).toggle();
							return false
						});
						if (e.stringResult === undefined) e.stringResult = e.multipleSearch;
						a("#" + g + "_search").bind("click", function () {
							var D = a("#" + g),
                                C = {},
                                A, B = D.jqFilter("filterData");
							if (e.errorcheck) {
								D[0].hideError();
								e.showQuery || D.jqFilter("toSQLString");
								if (D[0].p.error) {
									D[0].showError();
									return false
								}
							}
							if (e.stringResult) {
								try {
									A = xmlJsonClass.toJson(B, "", "", false)
								} catch (J) {
									try {
										A = JSON.stringify(B)
									} catch (z) { }
								}
								if (typeof A === "string") {
									C[e.sFilter] = A;
									a.each([e.sField, e.sValue, e.sOper], function () {
										C[this] = ""
									})
								}
							} else if (e.multipleSearch) {
								C[e.sFilter] = B;
								a.each([e.sField, e.sValue, e.sOper], function () {
									C[this] = ""
								})
							} else {
								C[e.sField] = B.rules[0].field;
								C[e.sValue] = B.rules[0].data;
								C[e.sOper] = B.rules[0].op;
								C[e.sFilter] = ""
							}
							f.p.search = true;
							a.extend(f.p.postData, C);
							if (a.isFunction(e.onSearch)) e.onSearch();
							a(f).trigger("reloadGrid", [{
								page: 1
							}]);
							e.closeAfterSearch && a.jgrid.hideModal("#" + i.themodal, {
								gb: "#gbox_" + f.p.id,
								jqm: e.jqModal,
								onClose: e.onClose
							});
							return false
						});
						a("#" + g + "_reset").bind("click", function () {
							var D = {},
                                C = a("#" + g);
							f.p.search = false;
							if (e.multipleSearch === false) D[e.sField] = D[e.sValue] = D[e.sOper] = "";
							else D[e.sFilter] = "";
							C[0].resetFilter();
							q && a(".ui-template", k).val("default");
							a.extend(f.p.postData, D);
							if (a.isFunction(e.onReset)) e.onReset();
							a(f).trigger("reloadGrid", [{
								page: 1
							}]);
							return false
						});
						b();
						a(".fm-button:not(.ui-state-disabled)", k).hover(function () {
							a(this).addClass("ui-state-hover")
						}, function () {
							a(this).removeClass("ui-state-hover")
						})
					}
				}
			})
		},
		editGridRow: function (e, b) {
			b = a.extend({
				top: 0,
				left: 0,
				width: 300,
				height: "auto",
				dataheight: "auto",
				modal: false,
				overlay: 30,
				drag: true,
				resize: true,
				url: null,
				mtype: "POST",
				clearAfterAdd: true,
				closeAfterEdit: false,
				reloadAfterSubmit: true,
				onInitializeForm: null,
				beforeInitData: null,
				beforeShowForm: null,
				afterShowForm: null,
				beforeSubmit: null,
				afterSubmit: null,
				onclickSubmit: null,
				afterComplete: null,
				onclickPgButtons: null,
				afterclickPgButtons: null,
				editData: {},
				recreateForm: false,
				jqModal: true,
				closeOnEscape: false,
				addedrow: "first",
				topinfo: "",
				bottominfo: "",
				saveicon: [],
				closeicon: [],
				savekey: [false, 13],
				navkeys: [false, 38, 40],
				checkOnSubmit: false,
				checkOnUpdate: false,
				_savedData: {},
				processing: false,
				onClose: null,
				ajaxEditOptions: {},
				serializeEditData: null,
				viewPagerButtons: true
			}, a.jgrid.edit, b || {});
			c[a(this)[0].p.id] = b;
			return this.each(function () {
				function f() {
					a("#" + p + " > tbody > tr > td > .FormElement").each(function () {
						var F = a(".customelement", this);
						if (F.length) {
							var G = a(F[0]).attr("name");
							a.each(j.p.colModel, function () {
								if (this.name === G && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
									try {
										z[G] = this.editoptions.custom_value(a("#" + a.jgrid.jqID(G), "#" + p), "get");
										if (z[G] === undefined) throw "e1";
									} catch (P) {
										P === "e1" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, P.message, jQuery.jgrid.edit.bClose)
									}
									return true
								}
							})
						} else {
							switch (a(this).get(0).type) {
								case "checkbox":
									if (a(this).is(":checked")) z[this.name] = a(this).val();
									else {
										F = a(this).attr("offval");
										z[this.name] = F
									}
									break;
								case "select-one":
									z[this.name] = a("option:selected", this).val();
									aa[this.name] = a("option:selected", this).text();
									break;
								case "select-multiple":
									z[this.name] = a(this).val();
									z[this.name] = z[this.name] ? z[this.name].join(",") : "";
									var W = [];
									a("option:selected", this).each(function (P, Z) {
										W[P] = a(Z).text()
									});
									aa[this.name] = W.join(",");
									break;
								case "password":
								case "text":
								case "textarea":
								case "button":
									z[this.name] = a(this).val()
							}
							if (j.p.autoencode) z[this.name] = a.jgrid.htmlEncode(z[this.name])
						}
					});
					return true
				}
				function g(F, G, W, P) {
					var Z, R, N, da = 0,
                        U, pa, $, sa = [],
                        fa = false,
                        ta = "",
                        ja;
					for (ja = 1; ja <= P; ja++) ta += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
					if (F != "_empty") fa = a(G).jqGrid("getInd", F);
					a(G.p.colModel).each(function (na) {
						Z = this.name;
						pa = (R = this.editrules && this.editrules.edithidden === true ? false : this.hidden === true ? true : false) ? "style='display:none'" : "";
						if (Z !== "cb" && Z !== "subgrid" && this.editable === true && Z !== "rn") {
							if (fa === false) U = "";
							else if (Z == G.p.ExpandColumn && G.p.treeGrid === true) U = a("td:eq(" + na + ")", G.rows[fa]).text();
							else {
								try {
									U = a.unformat(a("td:eq(" + na + ")", G.rows[fa]), {
										rowId: F,
										colModel: this
									}, na)
								} catch (Ga) {
									U = this.edittype && this.edittype == "textarea" ? a("td:eq(" + na + ")", G.rows[fa]).text() : a("td:eq(" + na + ")", G.rows[fa]).html()
								}
								if (!U || U == "&nbsp;" || U == "&#160;" || U.length == 1 && U.charCodeAt(0) == 160) U = ""
							}
							var Aa = a.extend({}, this.editoptions || {}, {
								id: Z,
								name: Z
							}),
                                s = a.extend({}, {
                                	elmprefix: "",
                                	elmsuffix: "",
                                	rowabove: false,
                                	rowcontent: ""
                                }, this.formoptions || {}),
                                t = parseInt(s.rowpos, 10) || da + 1,
                                w = parseInt((parseInt(s.colpos, 10) || 1) * 2, 10);
							if (F == "_empty" && Aa.defaultValue) U = a.isFunction(Aa.defaultValue) ? Aa.defaultValue() : Aa.defaultValue;
							if (!this.edittype) this.edittype = "text";
							if (j.p.autoencode) U = a.jgrid.htmlDecode(U);
							$ = a.jgrid.createEl(this.edittype, Aa, U, false, a.extend({}, a.jgrid.ajaxOptions, G.p.ajaxSelectOptions || {}));
							if (U === "" && this.edittype == "checkbox") U = a($).attr("offval");
							if (U === "" && this.edittype == "select") U = a("option:eq(0)", $).text();
							if (c[j.p.id].checkOnSubmit || c[j.p.id].checkOnUpdate) c[j.p.id]._savedData[Z] = U;
							a($).addClass("FormElement");
							if (this.edittype == "text" || this.edittype == "textarea") a($).addClass("ui-widget-content ui-corner-all");
							N = a(W).find("tr[rowpos=" + t + "]");
							if (s.rowabove) {
								Aa = a("<tr><td class='contentinfo' colspan='" + P * 2 + "'>" + s.rowcontent + "</td></tr>");
								a(W).append(Aa);
								Aa[0].rp = t
							}
							if (N.length === 0) {
								N = a("<tr " + pa + " rowpos='" + t + "'></tr>").addClass("FormData").attr("id", "tr_" + Z);
								a(N).append(ta);
								a(W).append(N);
								N[0].rp = t
							}
							a("td:eq(" + (w - 2) + ")", N[0]).html(typeof s.label === "undefined" ? G.p.colNames[na] : s.label);
							a("td:eq(" + (w - 1) + ")", N[0]).append(s.elmprefix).append($).append(s.elmsuffix);
							sa[da] = na;
							da++
						}
					});
					if (da > 0) {
						ja = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (P * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + G.p.id + "_id' value='" + F + "'/></td></tr>");
						ja[0].rp = da + 999;
						a(W).append(ja);
						if (c[j.p.id].checkOnSubmit || c[j.p.id].checkOnUpdate) c[j.p.id]._savedData[G.p.id + "_id"] = F
					}
					return sa
				}
				function h(F, G, W) {
					var P, Z = 0,
                        R, N, da, U, pa;
					if (c[j.p.id].checkOnSubmit || c[j.p.id].checkOnUpdate) {
						c[j.p.id]._savedData = {};
						c[j.p.id]._savedData[G.p.id + "_id"] = F
					}
					var $ = G.p.colModel;
					if (F == "_empty") {
						a($).each(function () {
							P = this.name;
							da = a.extend({}, this.editoptions || {});
							if ((N = a("#" + a.jgrid.jqID(P), "#" + W)) && N.length && N[0] !== null) {
								U = "";
								if (da.defaultValue) {
									U = a.isFunction(da.defaultValue) ? da.defaultValue() : da.defaultValue;
									if (N[0].type == "checkbox") {
										pa = U.toLowerCase();
										if (pa.search(/(false|0|no|off|undefined)/i) < 0 && pa !== "") {
											N[0].checked = true;
											N[0].defaultChecked = true;
											N[0].value = U
										} else {
											N[0].checked = false;
											N[0].defaultChecked = false
										}
									} else N.val(U)
								} else if (N[0].type == "checkbox") {
									N[0].checked = false;
									N[0].defaultChecked = false;
									U = a(N).attr("offval")
								} else if (N[0].type && N[0].type.substr(0, 6) == "select") N[0].selectedIndex = 0;
								else N.val(U);
								if (c[j.p.id].checkOnSubmit === true || c[j.p.id].checkOnUpdate) c[j.p.id]._savedData[P] = U
							}
						});
						a("#id_g", "#" + W).val(F)
					} else {
						var sa = a(G).jqGrid("getInd", F, true);
						if (sa) {
							a('td[role="gridcell"]', sa).each(function (fa) {
								P = $[fa].name;
								if (P !== "cb" && P !== "subgrid" && P !== "rn" && $[fa].editable === true) {
									if (P == G.p.ExpandColumn && G.p.treeGrid === true) R = a(this).text();
									else try {
										R = a.unformat(a(this), {
											rowId: F,
											colModel: $[fa]
										}, fa)
									} catch (ta) {
										R = $[fa].edittype == "textarea" ? a(this).text() : a(this).html()
									}
									if (j.p.autoencode) R = a.jgrid.htmlDecode(R);
									if (c[j.p.id].checkOnSubmit === true || c[j.p.id].checkOnUpdate) c[j.p.id]._savedData[P] = R;
									P = a.jgrid.jqID(P);
									switch ($[fa].edittype) {
										case "password":
										case "text":
										case "button":
										case "image":
										case "textarea":
											if (R == "&nbsp;" || R == "&#160;" || R.length == 1 && R.charCodeAt(0) == 160) R = "";
											a("#" + P, "#" + W).val(R);
											break;
										case "select":
											var ja = R.split(",");
											ja = a.map(ja, function (Ga) {
												return a.trim(Ga)
											});
											a("#" + P + " option", "#" + W).each(function () {
												this.selected = !$[fa].editoptions.multiple && (a.trim(R) == a.trim(a(this).text()) || ja[0] == a.trim(a(this).text()) || ja[0] == a.trim(a(this).val())) ? true : $[fa].editoptions.multiple ? a.inArray(a.trim(a(this).text()), ja) > -1 || a.inArray(a.trim(a(this).val()), ja) > -1 ? true : false : false
											});
											break;
										case "checkbox":
											R += "";
											if ($[fa].editoptions && $[fa].editoptions.value) if ($[fa].editoptions.value.split(":")[0] == R) {
												a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("checked", true);
												a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("defaultChecked", true)
											} else {
												a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("checked", false);
												a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("defaultChecked", false)
											} else {
												R = R.toLowerCase();
												if (R.search(/(false|0|no|off|undefined)/i) < 0 && R !== "") {
													a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("checked", true);
													a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("defaultChecked", true)
												} else {
													a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("checked", false);
													a("#" + P, "#" + W)[j.p.useProp ? "prop" : "attr"]("defaultChecked", false)
												}
											}
											break;
										case "custom":
											try {
												if ($[fa].editoptions && a.isFunction($[fa].editoptions.custom_value)) $[fa].editoptions.custom_value(a("#" + P, "#" + W), "set", R);
												else throw "e1";
											} catch (na) {
												na == "e1" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, na.message, jQuery.jgrid.edit.bClose)
											}
									}
									Z++
								}
							});
							Z > 0 && a("#id_g", "#" + p).val(F)
						}
					}
				}
				function i() {
					a.each(j.p.colModel, function (F, G) {
						if (G.editoptions && G.editoptions.NullIfEmpty === true) if (z.hasOwnProperty(G.name) && z[G.name] === "") z[G.name] = "null"
					})
				}
				function d() {
					var F, G = [true, "", ""],
                        W = {},
                        P = j.p.prmNames,
                        Z, R, N, da, U;
					if (a.isFunction(c[j.p.id].beforeCheckValues)) {
						var pa = c[j.p.id].beforeCheckValues(z, a("#" + r), z[j.p.id + "_id"] == "_empty" ? P.addoper : P.editoper);
						if (pa && typeof pa === "object") z = pa
					}
					for (N in z) if (z.hasOwnProperty(N)) {
						G = a.jgrid.checkValues(z[N], N, j);
						if (G[0] === false) break
					}
					i();
					if (G[0]) {
						if (a.isFunction(c[j.p.id].onclickSubmit)) W = c[j.p.id].onclickSubmit(c[j.p.id], z) || {};
						if (a.isFunction(c[j.p.id].beforeSubmit)) G = c[j.p.id].beforeSubmit(z, a("#" + r))
					}
					if (G[0] && !c[j.p.id].processing) {
						c[j.p.id].processing = true;
						a("#sData", "#" + p + "_2").addClass("ui-state-active");
						R = P.oper;
						Z = P.id;
						z[R] = a.trim(z[j.p.id + "_id"]) == "_empty" ? P.addoper : P.editoper;
						if (z[R] != P.addoper) z[Z] = z[j.p.id + "_id"];
						else if (z[Z] === undefined) z[Z] = z[j.p.id + "_id"];
						delete z[j.p.id + "_id"];
						z = a.extend(z, c[j.p.id].editData, W);
						if (j.p.treeGrid === true) {
							if (z[R] == P.addoper) {
								da = a(j).jqGrid("getGridParam", "selrow");
								z[j.p.treeGridModel == "adjacency" ? j.p.treeReader.parent_id_field : "parent_id"] = da
							}
							for (U in j.p.treeReader) if (j.p.treeReader.hasOwnProperty(U)) {
								W = j.p.treeReader[U];
								if (z.hasOwnProperty(W)) z[R] == P.addoper && U === "parent_id_field" || delete z[W]
							}
						}
						z[Z] = a.jgrid.stripPref(j.p.idPrefix, z[Z]);
						U = a.extend({
							url: c[j.p.id].url ? c[j.p.id].url : a(j).jqGrid("getGridParam", "editurl"),
							type: c[j.p.id].mtype,
							data: a.isFunction(c[j.p.id].serializeEditData) ? c[j.p.id].serializeEditData(z) : z,
							complete: function ($, sa) {
								z[Z] = j.p.idPrefix + z[Z];
								if (sa != "success") {
									G[0] = false;
									G[1] = a.isFunction(c[j.p.id].errorTextFormat) ? c[j.p.id].errorTextFormat($) : sa + " Status: '" + $.statusText + "'. Error code: " + $.status
								} else if (a.isFunction(c[j.p.id].afterSubmit)) G = c[j.p.id].afterSubmit($, z);
								if (G[0] === false) {
									a("#FormError>td", "#" + p).html(G[1]);
									a("#FormError", "#" + p).show()
								} else {
									a.each(j.p.colModel, function () {
										if (aa[this.name] && this.formatter && this.formatter == "select") try {
											delete aa[this.name]
										} catch (ja) { }
									});
									z = a.extend(z, aa);
									j.p.autoencode && a.each(z, function (ja, na) {
										z[ja] = a.jgrid.htmlDecode(na)
									});
									if (z[R] == P.addoper) {
										G[2] || (G[2] = a.jgrid.randId());
										z[Z] = G[2];
										if (c[j.p.id].closeAfterAdd) {
											if (c[j.p.id].reloadAfterSubmit) a(j).trigger("reloadGrid");
											else if (j.p.treeGrid === true) a(j).jqGrid("addChildNode", G[2], da, z);
											else {
												a(j).jqGrid("addRowData", G[2], z, b.addedrow);
												a(j).jqGrid("setSelection", G[2])
											}
											a.jgrid.hideModal("#" + q.themodal, {
												gb: "#gbox_" + v,
												jqm: b.jqModal,
												onClose: c[j.p.id].onClose
											})
										} else if (c[j.p.id].clearAfterAdd) {
											if (c[j.p.id].reloadAfterSubmit) a(j).trigger("reloadGrid");
											else j.p.treeGrid === true ? a(j).jqGrid("addChildNode", G[2], da, z) : a(j).jqGrid("addRowData", G[2], z, b.addedrow);
											h("_empty", j, r)
										} else if (c[j.p.id].reloadAfterSubmit) a(j).trigger("reloadGrid");
										else j.p.treeGrid === true ? a(j).jqGrid("addChildNode", G[2], da, z) : a(j).jqGrid("addRowData", G[2], z, b.addedrow)
									} else {
										if (c[j.p.id].reloadAfterSubmit) {
											a(j).trigger("reloadGrid");
											c[j.p.id].closeAfterEdit || setTimeout(function () {
												a(j).jqGrid("setSelection", z[Z])
											}, 1E3)
										} else j.p.treeGrid === true ? a(j).jqGrid("setTreeRow", z[Z], z) : a(j).jqGrid("setRowData", z[Z], z);
										c[j.p.id].closeAfterEdit && a.jgrid.hideModal("#" + q.themodal, {
											gb: "#gbox_" + v,
											jqm: b.jqModal,
											onClose: c[j.p.id].onClose
										})
									}
									if (a.isFunction(c[j.p.id].afterComplete)) {
										F = $;
										setTimeout(function () {
											c[j.p.id].afterComplete(F, z, a("#" + r));
											F = null
										}, 500)
									}
									if (c[j.p.id].checkOnSubmit || c[j.p.id].checkOnUpdate) {
										a("#" + r).data("disabled", false);
										if (c[j.p.id]._savedData[j.p.id + "_id"] != "_empty") for (var fa in c[j.p.id]._savedData) if (z[fa]) c[j.p.id]._savedData[fa] = z[fa]
									}
								}
								c[j.p.id].processing = false;
								a("#sData", "#" + p + "_2").removeClass("ui-state-active");
								try {
									a(":input:visible", "#" + r)[0].focus()
								} catch (ta) { }
							}
						}, a.jgrid.ajaxOptions, c[j.p.id].ajaxEditOptions);
						if (!U.url && !c[j.p.id].useDataProxy) if (a.isFunction(j.p.dataProxy)) c[j.p.id].useDataProxy = true;
						else {
							G[0] = false;
							G[1] += " " + a.jgrid.errors.nourl
						}
						if (G[0]) if (c[j.p.id].useDataProxy) {
							W = j.p.dataProxy.call(j, U, "set_" + j.p.id);
							if (typeof W == "undefined") W = [true, ""];
							if (W[0] === false) {
								G[0] = false;
								G[1] = W[1] || "Error deleting the selected row!"
							} else {
								U.data.oper == P.addoper && c[j.p.id].closeAfterAdd && a.jgrid.hideModal("#" + q.themodal, {
									gb: "#gbox_" + v,
									jqm: b.jqModal,
									onClose: c[j.p.id].onClose
								});
								U.data.oper == P.editoper && c[j.p.id].closeAfterEdit && a.jgrid.hideModal("#" + q.themodal, {
									gb: "#gbox_" + v,
									jqm: b.jqModal,
									onClose: c[j.p.id].onClose
								})
							}
						} else a.ajax(U)
					}
					if (G[0] === false) {
						a("#FormError>td", "#" + p).html(G[1]);
						a("#FormError", "#" + p).show()
					}
				}
				function k(F, G) {
					var W = false,
                        P;
					for (P in F) if (F[P] != G[P]) {
						W = true;
						break
					}
					return W
				}
				function m() {
					var F = true;
					a("#FormError", "#" + p).hide();
					if (c[j.p.id].checkOnUpdate) {
						z = {};
						aa = {};
						f();
						V = a.extend({}, z, aa);
						if (la = k(V, c[j.p.id]._savedData)) {
							a("#" + r).data("disabled", true);
							a(".confirm", "#" + q.themodal).show();
							F = false
						}
					}
					return F
				}
				function l() {
					if (e !== "_empty" && typeof j.p.savedRow !== "undefined" && j.p.savedRow.length > 0 && a.isFunction(a.fn.jqGrid.restoreRow)) for (var F = 0; F < j.p.savedRow.length; F++) if (j.p.savedRow[F].id == e) {
						a(j).jqGrid("restoreRow", e);
						break
					}
				}
				function n(F, G) {
					F === 0 ? a("#pData", "#" + p + "_2").addClass("ui-state-disabled") : a("#pData", "#" + p + "_2").removeClass("ui-state-disabled");
					F == G ? a("#nData", "#" + p + "_2").addClass("ui-state-disabled") : a("#nData", "#" + p + "_2").removeClass("ui-state-disabled")
				}
				function o() {
					var F = a(j).jqGrid("getDataIDs"),
                        G = a("#id_g", "#" + p).val();
					return [a.inArray(G, F), F]
				}
				var j = this;
				if (j.grid && e) {
					var v = j.p.id,
                        r = "FrmGrid_" + v,
                        p = "TblGrid_" + v,
                        q = {
                        	themodal: "editmod" + v,
                        	modalhead: "edithd" + v,
                        	modalcontent: "editcnt" + v,
                        	scrollelm: r
                        },
                        u = a.isFunction(c[j.p.id].beforeShowForm) ? c[j.p.id].beforeShowForm : false,
                        x = a.isFunction(c[j.p.id].afterShowForm) ? c[j.p.id].afterShowForm : false,
                        D = a.isFunction(c[j.p.id].beforeInitData) ? c[j.p.id].beforeInitData : false,
                        C = a.isFunction(c[j.p.id].onInitializeForm) ? c[j.p.id].onInitializeForm : false,
                        A = true,
                        B = 1,
                        J = 0,
                        z, aa, V, la;
					if (e === "new") {
						e = "_empty";
						b.caption = c[j.p.id].addCaption
					} else b.caption = c[j.p.id].editCaption;
					b.recreateForm === true && a("#" + q.themodal).html() !== null && a("#" + q.themodal).remove();
					var ia = true;
					if (b.checkOnUpdate && b.jqModal && !b.modal) ia = false;
					if (a("#" + q.themodal).html() !== null) {
						if (D) {
							A = D(a("#" + r));
							if (typeof A == "undefined") A = true
						}
						if (A === false) return;
						l();
						a(".ui-jqdialog-title", "#" + q.modalhead).html(b.caption);
						a("#FormError", "#" + p).hide();
						if (c[j.p.id].topinfo) {
							a(".topinfo", "#" + p).html(c[j.p.id].topinfo);
							a(".tinfo", "#" + p).show()
						} else a(".tinfo", "#" + p).hide();
						if (c[j.p.id].bottominfo) {
							a(".bottominfo", "#" + p + "_2").html(c[j.p.id].bottominfo);
							a(".binfo", "#" + p + "_2").show()
						} else a(".binfo", "#" + p + "_2").hide();
						h(e, j, r);
						e == "_empty" || !c[j.p.id].viewPagerButtons ? a("#pData, #nData", "#" + p + "_2").hide() : a("#pData, #nData", "#" + p + "_2").show();
						if (c[j.p.id].processing === true) {
							c[j.p.id].processing = false;
							a("#sData", "#" + p + "_2").removeClass("ui-state-active")
						}
						if (a("#" + r).data("disabled") === true) {
							a(".confirm", "#" + q.themodal).hide();
							a("#" + r).data("disabled", false)
						}
						u && u(a("#" + r));
						a("#" + q.themodal).data("onClose", c[j.p.id].onClose);
						a.jgrid.viewModal("#" + q.themodal, {
							gbox: "#gbox_" + v,
							jqm: b.jqModal,
							jqM: false,
							overlay: b.overlay,
							modal: b.modal
						});
						ia || a(".jqmOverlay").click(function () {
							if (!m()) return false;
							a.jgrid.hideModal("#" + q.themodal, {
								gb: "#gbox_" + v,
								jqm: b.jqModal,
								onClose: c[j.p.id].onClose
							});
							return false
						});
						x && x(a("#" + r))
					} else {
						var ea = isNaN(b.dataheight) ? b.dataheight : b.dataheight + "px";
						ea = a("<form name='FormPost' id='" + r + "' class='FormGrid' onSubmit='return false;' style='width:100%;overflow:auto;position:relative;height:" + ea + ";'></form>").data("disabled", false);
						var wa = a("<table id='" + p + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>");
						if (D) {
							A = D(a("#" + r));
							if (typeof A == "undefined") A = true
						}
						if (A === false) return;
						l();
						a(j.p.colModel).each(function () {
							var F = this.formoptions;
							B = Math.max(B, F ? F.colpos || 0 : 0);
							J = Math.max(J, F ? F.rowpos || 0 : 0)
						});
						a(ea).append(wa);
						D = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + B * 2 + "'></td></tr>");
						D[0].rp = 0;
						a(wa).append(D);
						D = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + B * 2 + "'>" + c[j.p.id].topinfo + "</td></tr>");
						D[0].rp = 0;
						a(wa).append(D);
						A = (D = j.p.direction == "rtl" ? true : false) ? "nData" : "pData";
						var xa = D ? "pData" : "nData";
						g(e, j, wa, B);
						A = "<a href='javascript:void(0)' id='" + A + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
						xa = "<a href='javascript:void(0)' id='" + xa + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>";
						var Ba = "<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>" + b.bSubmit + "</a>",
                            Ca = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + b.bCancel + "</a>";
						A = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + p + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" + (D ? xa + A : A + xa) + "</td><td class='EditButton'>" + Ba + Ca + "</td></tr>";
						A += "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + c[j.p.id].bottominfo + "</td></tr>";
						A += "</tbody></table>";
						if (J > 0) {
							var Fa = [];
							a.each(a(wa)[0].rows, function (F, G) {
								Fa[F] = G
							});
							Fa.sort(function (F, G) {
								if (F.rp > G.rp) return 1;
								if (F.rp < G.rp) return -1;
								return 0
							});
							a.each(Fa, function (F, G) {
								a("tbody", wa).append(G)
							})
						}
						b.gbox = "#gbox_" + v;
						var qa = false;
						if (b.closeOnEscape === true) {
							b.closeOnEscape = false;
							qa = true
						}
						ea = a("<span></span>").append(ea).append(A);
						a.jgrid.createModal(q, ea, b, "#gview_" + j.p.id, a("#gbox_" + j.p.id)[0]);
						if (D) {
							a("#pData, #nData", "#" + p + "_2").css("float", "right");
							a(".EditButton", "#" + p + "_2").css("text-align", "left")
						}
						c[j.p.id].topinfo && a(".tinfo", "#" + p).show();
						c[j.p.id].bottominfo && a(".binfo", "#" + p + "_2").show();
						A = ea = null;
						a("#" + q.themodal).keydown(function (F) {
							var G = F.target;
							if (a("#" + r).data("disabled") === true) return false;
							if (c[j.p.id].savekey[0] === true && F.which == c[j.p.id].savekey[1]) if (G.tagName != "TEXTAREA") {
								a("#sData", "#" + p + "_2").trigger("click");
								return false
							}
							if (F.which === 27) {
								if (!m()) return false;
								qa && a.jgrid.hideModal(this, {
									gb: b.gbox,
									jqm: b.jqModal,
									onClose: c[j.p.id].onClose
								});
								return false
							}
							if (c[j.p.id].navkeys[0] === true) {
								if (a("#id_g", "#" + p).val() == "_empty") return true;
								if (F.which == c[j.p.id].navkeys[1]) {
									a("#pData", "#" + p + "_2").trigger("click");
									return false
								}
								if (F.which == c[j.p.id].navkeys[2]) {
									a("#nData", "#" + p + "_2").trigger("click");
									return false
								}
							}
						});
						if (b.checkOnUpdate) {
							a("a.ui-jqdialog-titlebar-close span", "#" + q.themodal).removeClass("jqmClose");
							a("a.ui-jqdialog-titlebar-close", "#" + q.themodal).unbind("click").click(function () {
								if (!m()) return false;
								a.jgrid.hideModal("#" + q.themodal, {
									gb: "#gbox_" + v,
									jqm: b.jqModal,
									onClose: c[j.p.id].onClose
								});
								return false
							})
						}
						b.saveicon = a.extend([true, "left", "ui-icon-disk"], b.saveicon);
						b.closeicon = a.extend([true, "left", "ui-icon-close"], b.closeicon);
						if (b.saveicon[0] === true) a("#sData", "#" + p + "_2").addClass(b.saveicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.saveicon[2] + "'></span>");
						if (b.closeicon[0] === true) a("#cData", "#" + p + "_2").addClass(b.closeicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.closeicon[2] + "'></span>");
						if (c[j.p.id].checkOnSubmit || c[j.p.id].checkOnUpdate) {
							Ba = "<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + b.bYes + "</a>";
							xa = "<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + b.bNo + "</a>";
							Ca = "<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + b.bExit + "</a>";
							ea = b.zIndex || 999;
							ea++;
							a("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:" + ea + ";display:none;'>&#160;" + (a.browser.msie && a.browser.version == 6 ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : "") + "</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (ea + 1) + "'>" + b.saveData + "<br/><br/>" + Ba + xa + Ca + "</div>").insertAfter("#" + r);
							a("#sNew", "#" + q.themodal).click(function () {
								d();
								a("#" + r).data("disabled", false);
								a(".confirm", "#" + q.themodal).hide();
								return false
							});
							a("#nNew", "#" + q.themodal).click(function () {
								a(".confirm", "#" + q.themodal).hide();
								a("#" + r).data("disabled", false);
								setTimeout(function () {
									a(":input", "#" + r)[0].focus()
								}, 0);
								return false
							});
							a("#cNew", "#" + q.themodal).click(function () {
								a(".confirm", "#" + q.themodal).hide();
								a("#" + r).data("disabled", false);
								a.jgrid.hideModal("#" + q.themodal, {
									gb: "#gbox_" + v,
									jqm: b.jqModal,
									onClose: c[j.p.id].onClose
								});
								return false
							})
						}
						C && C(a("#" + r));
						e == "_empty" || !c[j.p.id].viewPagerButtons ? a("#pData,#nData", "#" + p + "_2").hide() : a("#pData,#nData", "#" + p + "_2").show();
						u && u(a("#" + r));
						a("#" + q.themodal).data("onClose", c[j.p.id].onClose);
						a.jgrid.viewModal("#" + q.themodal, {
							gbox: "#gbox_" + v,
							jqm: b.jqModal,
							overlay: b.overlay,
							modal: b.modal
						});
						ia || a(".jqmOverlay").click(function () {
							if (!m()) return false;
							a.jgrid.hideModal("#" + q.themodal, {
								gb: "#gbox_" + v,
								jqm: b.jqModal,
								onClose: c[j.p.id].onClose
							});
							return false
						});
						x && x(a("#" + r));
						a(".fm-button", "#" + q.themodal).hover(function () {
							a(this).addClass("ui-state-hover")
						}, function () {
							a(this).removeClass("ui-state-hover")
						});
						a("#sData", "#" + p + "_2").click(function () {
							z = {};
							aa = {};
							a("#FormError", "#" + p).hide();
							f();
							if (z[j.p.id + "_id"] == "_empty") d();
							else if (b.checkOnSubmit === true) {
								V = a.extend({}, z, aa);
								if (la = k(V, c[j.p.id]._savedData)) {
									a("#" + r).data("disabled", true);
									a(".confirm", "#" + q.themodal).show()
								} else d()
							} else d();
							return false
						});
						a("#cData", "#" + p + "_2").click(function () {
							if (!m()) return false;
							a.jgrid.hideModal("#" + q.themodal, {
								gb: "#gbox_" + v,
								jqm: b.jqModal,
								onClose: c[j.p.id].onClose
							});
							return false
						});
						a("#nData", "#" + p + "_2").click(function () {
							if (!m()) return false;
							a("#FormError", "#" + p).hide();
							var F = o();
							F[0] = parseInt(F[0], 10);
							if (F[0] != -1 && F[1][F[0] + 1]) {
								if (a.isFunction(b.onclickPgButtons)) b.onclickPgButtons("next", a("#" + r), F[1][F[0]]);
								h(F[1][F[0] + 1], j, r);
								a(j).jqGrid("setSelection", F[1][F[0] + 1]);
								a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("next", a("#" + r), F[1][F[0] + 1]);
								n(F[0] + 1, F[1].length - 1)
							}
							return false
						});
						a("#pData", "#" + p + "_2").click(function () {
							if (!m()) return false;
							a("#FormError", "#" + p).hide();
							var F = o();
							if (F[0] != -1 && F[1][F[0] - 1]) {
								if (a.isFunction(b.onclickPgButtons)) b.onclickPgButtons("prev", a("#" + r), F[1][F[0]]);
								h(F[1][F[0] - 1], j, r);
								a(j).jqGrid("setSelection", F[1][F[0] - 1]);
								a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("prev", a("#" + r), F[1][F[0] - 1]);
								n(F[0] - 1, F[1].length - 1)
							}
							return false
						})
					}
					u = o();
					n(u[0], u[1].length - 1)
				}
			})
		},
		viewGridRow: function (e, b) {
			b = a.extend({
				top: 0,
				left: 0,
				width: 0,
				height: "auto",
				dataheight: "auto",
				modal: false,
				overlay: 30,
				drag: true,
				resize: true,
				jqModal: true,
				closeOnEscape: false,
				labelswidth: "30%",
				closeicon: [],
				navkeys: [false, 38, 40],
				onClose: null,
				beforeShowForm: null,
				beforeInitData: null,
				viewPagerButtons: true
			}, a.jgrid.view, b || {});
			return this.each(function () {
				function f() {
					if (b.closeOnEscape === true || b.navkeys[0] === true) setTimeout(function () {
						a(".ui-jqdialog-titlebar-close", "#" + o.modalhead).focus()
					}, 0)
				}
				function g(B, J, z, aa) {
					for (var V, la, ia, ea = 0, wa, xa, Ba = [], Ca = false, Fa = "<td class='CaptionTD form-view-label ui-widget-content' width='" + b.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", qa = "", F = ["integer", "number", "currency"], G = 0, W = 0, P, Z, R, N = 1; N <= aa; N++) qa += N == 1 ? Fa : "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";
					a(J.p.colModel).each(function () {
						la = this.editrules && this.editrules.edithidden === true ? false : this.hidden === true ? true : false;
						if (!la && this.align === "right") if (this.formatter && a.inArray(this.formatter, F) !== -1) G = Math.max(G, parseInt(this.width, 10));
						else W = Math.max(W, parseInt(this.width, 10))
					});
					P = G !== 0 ? G : W !== 0 ? W : 0;
					Ca = a(J).jqGrid("getInd", B);
					a(J.p.colModel).each(function (da) {
						V = this.name;
						Z = false;
						xa = (la = this.editrules && this.editrules.edithidden === true ? false : this.hidden === true ? true : false) ? "style='display:none'" : "";
						R = typeof this.viewable != "boolean" ? true : this.viewable;
						if (V !== "cb" && V !== "subgrid" && V !== "rn" && R) {
							wa = Ca === false ? "" : V == J.p.ExpandColumn && J.p.treeGrid === true ? a("td:eq(" + da + ")", J.rows[Ca]).text() : a("td:eq(" + da + ")", J.rows[Ca]).html();
							Z = this.align === "right" && P !== 0 ? true : false;
							a.extend({}, this.editoptions || {}, {
								id: V,
								name: V
							});
							var U = a.extend({}, {
								rowabove: false,
								rowcontent: ""
							}, this.formoptions || {}),
                                pa = parseInt(U.rowpos, 10) || ea + 1,
                                $ = parseInt((parseInt(U.colpos, 10) || 1) * 2, 10);
							if (U.rowabove) {
								var sa = a("<tr><td class='contentinfo' colspan='" + aa * 2 + "'>" + U.rowcontent + "</td></tr>");
								a(z).append(sa);
								sa[0].rp = pa
							}
							ia = a(z).find("tr[rowpos=" + pa + "]");
							if (ia.length === 0) {
								ia = a("<tr " + xa + " rowpos='" + pa + "'></tr>").addClass("FormData").attr("id", "trv_" + V);
								a(ia).append(qa);
								a(z).append(ia);
								ia[0].rp = pa
							}
							a("td:eq(" + ($ - 2) + ")", ia[0]).html("<b>" + (typeof U.label === "undefined" ? J.p.colNames[da] : U.label) + "</b>");
							a("td:eq(" + ($ - 1) + ")", ia[0]).append("<span>" + wa + "</span>").attr("id", "v_" + V);
							Z && a("td:eq(" + ($ - 1) + ") span", ia[0]).css({
								"text-align": "right",
								width: P + "px"
							});
							Ba[ea] = da;
							ea++
						}
					});
					if (ea > 0) {
						B = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (aa * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + B + "'/></td></tr>");
						B[0].rp = ea + 99;
						a(z).append(B)
					}
					return Ba
				}
				function h(B, J) {
					var z, aa, V = 0,
                        la, ia;
					if (ia = a(J).jqGrid("getInd", B, true)) {
						a("td", ia).each(function (ea) {
							z = J.p.colModel[ea].name;
							aa = J.p.colModel[ea].editrules && J.p.colModel[ea].editrules.edithidden === true ? false : J.p.colModel[ea].hidden === true ? true : false;
							if (z !== "cb" && z !== "subgrid" && z !== "rn") {
								la = z == J.p.ExpandColumn && J.p.treeGrid === true ? a(this).text() : a(this).html();
								a.extend({}, J.p.colModel[ea].editoptions || {});
								z = a.jgrid.jqID("v_" + z);
								a("#" + z + " span", "#" + n).html(la);
								aa && a("#" + z, "#" + n).parents("tr:first").hide();
								V++
							}
						});
						V > 0 && a("#id_g", "#" + n).val(B)
					}
				}
				function i(B, J) {
					B === 0 ? a("#pData", "#" + n + "_2").addClass("ui-state-disabled") : a("#pData", "#" + n + "_2").removeClass("ui-state-disabled");
					B == J ? a("#nData", "#" + n + "_2").addClass("ui-state-disabled") : a("#nData", "#" + n + "_2").removeClass("ui-state-disabled")
				}
				function d() {
					var B = a(k).jqGrid("getDataIDs"),
                        J = a("#id_g", "#" + n).val();
					return [a.inArray(J, B), B]
				}
				var k = this;
				if (k.grid && e) {
					var m = k.p.id,
                        l = "ViewGrid_" + m,
                        n = "ViewTbl_" + m,
                        o = {
                        	themodal: "viewmod" + m,
                        	modalhead: "viewhd" + m,
                        	modalcontent: "viewcnt" + m,
                        	scrollelm: l
                        },
                        j = a.isFunction(b.beforeInitData) ? b.beforeInitData : false,
                        v = true,
                        r = 1,
                        p = 0;
					if (a("#" + o.themodal).html() !== null) {
						if (j) {
							v = j(a("#" + l));
							if (typeof v == "undefined") v = true
						}
						if (v === false) return;
						a(".ui-jqdialog-title", "#" + o.modalhead).html(b.caption);
						a("#FormError", "#" + n).hide();
						h(e, k);
						a.isFunction(b.beforeShowForm) && b.beforeShowForm(a("#" + l));
						a.jgrid.viewModal("#" + o.themodal, {
							gbox: "#gbox_" + m,
							jqm: b.jqModal,
							jqM: false,
							overlay: b.overlay,
							modal: b.modal
						});
						f()
					} else {
						var q = isNaN(b.dataheight) ? b.dataheight : b.dataheight + "px";
						q = a("<form name='FormPost' id='" + l + "' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:" + q + ";'></form>");
						var u = a("<table id='" + n + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
						if (j) {
							v = j(a("#" + l));
							if (typeof v == "undefined") v = true
						}
						if (v === false) return;
						a(k.p.colModel).each(function () {
							var B = this.formoptions;
							r = Math.max(r, B ? B.colpos || 0 : 0);
							p = Math.max(p, B ? B.rowpos || 0 : 0)
						});
						a(q).append(u);
						g(e, k, u, r);
						j = k.p.direction == "rtl" ? true : false;
						v = "<a href='javascript:void(0)' id='" + (j ? "nData" : "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
						var x = "<a href='javascript:void(0)' id='" + (j ? "pData" : "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                            D = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + b.bClose + "</a>";
						if (p > 0) {
							var C = [];
							a.each(a(u)[0].rows, function (B, J) {
								C[B] = J
							});
							C.sort(function (B, J) {
								if (B.rp > J.rp) return 1;
								if (B.rp < J.rp) return -1;
								return 0
							});
							a.each(C, function (B, J) {
								a("tbody", u).append(J)
							})
						}
						b.gbox = "#gbox_" + m;
						var A = false;
						if (b.closeOnEscape === true) {
							b.closeOnEscape = false;
							A = true
						}
						q = a("<span></span>").append(q).append("<table border='0' class='EditTable' id='" + n + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + b.labelswidth + "'>" + (j ? x + v : v + x) + "</td><td class='EditButton'>" + D + "</td></tr></tbody></table>");
						a.jgrid.createModal(o, q, b, "#gview_" + k.p.id, a("#gview_" + k.p.id)[0]);
						if (j) {
							a("#pData, #nData", "#" + n + "_2").css("float", "right");
							a(".EditButton", "#" + n + "_2").css("text-align", "left")
						}
						b.viewPagerButtons || a("#pData, #nData", "#" + n + "_2").hide();
						q = null;
						a("#" + o.themodal).keydown(function (B) {
							if (B.which === 27) {
								A && a.jgrid.hideModal(this, {
									gb: b.gbox,
									jqm: b.jqModal,
									onClose: b.onClose
								});
								return false
							}
							if (b.navkeys[0] === true) {
								if (B.which === b.navkeys[1]) {
									a("#pData", "#" + n + "_2").trigger("click");
									return false
								}
								if (B.which === b.navkeys[2]) {
									a("#nData", "#" + n + "_2").trigger("click");
									return false
								}
							}
						});
						b.closeicon = a.extend([true, "left", "ui-icon-close"], b.closeicon);
						if (b.closeicon[0] === true) a("#cData", "#" + n + "_2").addClass(b.closeicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.closeicon[2] + "'></span>");
						a.isFunction(b.beforeShowForm) && b.beforeShowForm(a("#" + l));
						a.jgrid.viewModal("#" + o.themodal, {
							gbox: "#gbox_" + m,
							jqm: b.jqModal,
							modal: b.modal
						});
						a(".fm-button:not(.ui-state-disabled)", "#" + n + "_2").hover(function () {
							a(this).addClass("ui-state-hover")
						}, function () {
							a(this).removeClass("ui-state-hover")
						});
						f();
						a("#cData", "#" + n + "_2").click(function () {
							a.jgrid.hideModal("#" + o.themodal, {
								gb: "#gbox_" + m,
								jqm: b.jqModal,
								onClose: b.onClose
							});
							return false
						});
						a("#nData", "#" + n + "_2").click(function () {
							a("#FormError", "#" + n).hide();
							var B = d();
							B[0] = parseInt(B[0], 10);
							if (B[0] != -1 && B[1][B[0] + 1]) {
								if (a.isFunction(b.onclickPgButtons)) b.onclickPgButtons("next", a("#" + l), B[1][B[0]]);
								h(B[1][B[0] + 1], k);
								a(k).jqGrid("setSelection", B[1][B[0] + 1]);
								a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("next", a("#" + l), B[1][B[0] + 1]);
								i(B[0] + 1, B[1].length - 1)
							}
							f();
							return false
						});
						a("#pData", "#" + n + "_2").click(function () {
							a("#FormError", "#" + n).hide();
							var B = d();
							if (B[0] != -1 && B[1][B[0] - 1]) {
								if (a.isFunction(b.onclickPgButtons)) b.onclickPgButtons("prev", a("#" + l), B[1][B[0]]);
								h(B[1][B[0] - 1], k);
								a(k).jqGrid("setSelection", B[1][B[0] - 1]);
								a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("prev", a("#" + l), B[1][B[0] - 1]);
								i(B[0] - 1, B[1].length - 1)
							}
							f();
							return false
						})
					}
					q = d();
					i(q[0], q[1].length - 1)
				}
			})
		},
		delGridRow: function (e, b) {
			b = a.extend({
				top: 0,
				left: 0,
				width: 240,
				height: "auto",
				dataheight: "auto",
				modal: false,
				overlay: 30,
				drag: true,
				resize: true,
				url: "",
				mtype: "POST",
				reloadAfterSubmit: true,
				beforeShowForm: null,
				beforeInitData: null,
				afterShowForm: null,
				beforeSubmit: null,
				onclickSubmit: null,
				afterSubmit: null,
				jqModal: true,
				closeOnEscape: false,
				delData: {},
				delicon: [],
				cancelicon: [],
				onClose: null,
				ajaxDelOptions: {},
				processing: false,
				serializeDelData: null,
				useDataProxy: false
			}, a.jgrid.del, b || {});
			c[a(this)[0].p.id] = b;
			return this.each(function () {
				var f = this;
				if (f.grid) if (e) {
					var g = a.isFunction(c[f.p.id].beforeShowForm),
                        h = a.isFunction(c[f.p.id].afterShowForm),
                        i = a.isFunction(c[f.p.id].beforeInitData) ? c[f.p.id].beforeInitData : false,
                        d = f.p.id,
                        k = {},
                        m = true,
                        l = "DelTbl_" + d,
                        n, o, j, v, r = {
                        	themodal: "delmod" + d,
                        	modalhead: "delhd" + d,
                        	modalcontent: "delcnt" + d,
                        	scrollelm: l
                        };
					if (jQuery.isArray(e)) e = e.join();
					if (a("#" + r.themodal).html() !== null) {
						if (i) {
							m = i(a("#" + l));
							if (typeof m == "undefined") m = true
						}
						if (m === false) return;
						a("#DelData>td", "#" + l).text(e);
						a("#DelError", "#" + l).hide();
						if (c[f.p.id].processing === true) {
							c[f.p.id].processing = false;
							a("#dData", "#" + l).removeClass("ui-state-active")
						}
						g && c[f.p.id].beforeShowForm(a("#" + l));
						a.jgrid.viewModal("#" + r.themodal, {
							gbox: "#gbox_" + d,
							jqm: c[f.p.id].jqModal,
							jqM: false,
							overlay: c[f.p.id].overlay,
							modal: c[f.p.id].modal
						})
					} else {
						var p = isNaN(c[f.p.id].dataheight) ? c[f.p.id].dataheight : c[f.p.id].dataheight + "px";
						p = "<div id='" + l + "' class='formdata' style='width:100%;overflow:auto;position:relative;height:" + p + ";'>";
						p += "<table class='DelTable'><tbody>";
						p += "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>";
						p += "<tr id='DelData' style='display:none'><td >" + e + "</td></tr>";
						p += '<tr><td class="delmsg" style="white-space:pre;">' + c[f.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>";
						p += "</tbody></table></div>";
						p += "<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + l + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" + ("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'>" + b.bSubmit + "</a>") + "&#160;" + ("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'>" + b.bCancel + "</a>") + "</td></tr></tbody></table>";
						b.gbox = "#gbox_" + d;
						a.jgrid.createModal(r, p, b, "#gview_" + f.p.id, a("#gview_" + f.p.id)[0]);
						if (i) {
							m = i(a("#" + l));
							if (typeof m == "undefined") m = true
						}
						if (m === false) return;
						a(".fm-button", "#" + l + "_2").hover(function () {
							a(this).addClass("ui-state-hover")
						}, function () {
							a(this).removeClass("ui-state-hover")
						});
						b.delicon = a.extend([true, "left", "ui-icon-scissors"], c[f.p.id].delicon);
						b.cancelicon = a.extend([true, "left", "ui-icon-cancel"], c[f.p.id].cancelicon);
						if (b.delicon[0] === true) a("#dData", "#" + l + "_2").addClass(b.delicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.delicon[2] + "'></span>");
						if (b.cancelicon[0] === true) a("#eData", "#" + l + "_2").addClass(b.cancelicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.cancelicon[2] + "'></span>");
						a("#dData", "#" + l + "_2").click(function () {
							var q = [true, ""];
							k = {};
							var u = a("#DelData>td", "#" + l).text();
							if (a.isFunction(c[f.p.id].onclickSubmit)) k = c[f.p.id].onclickSubmit(c[f.p.id], u) || {};
							if (a.isFunction(c[f.p.id].beforeSubmit)) q = c[f.p.id].beforeSubmit(u);
							if (q[0] && !c[f.p.id].processing) {
								c[f.p.id].processing = true;
								a(this).addClass("ui-state-active");
								j = f.p.prmNames;
								n = a.extend({}, c[f.p.id].delData, k);
								v = j.oper;
								n[v] = j.deloper;
								o = j.id;
								u = u.split(",");
								for (var x in u) if (u.hasOwnProperty(x)) u[x] = a.jgrid.stripPref(f.p.idPrefix, u[x]);
								n[o] = u.join();
								x = a.extend({
									url: c[f.p.id].url ? c[f.p.id].url : a(f).jqGrid("getGridParam", "editurl"),
									type: c[f.p.id].mtype,
									data: a.isFunction(c[f.p.id].serializeDelData) ? c[f.p.id].serializeDelData(n) : n,
									complete: function (D, C) {
										if (C != "success") {
											q[0] = false;
											q[1] = a.isFunction(c[f.p.id].errorTextFormat) ? c[f.p.id].errorTextFormat(D) : C + " Status: '" + D.statusText + "'. Error code: " + D.status
										} else if (a.isFunction(c[f.p.id].afterSubmit)) q = c[f.p.id].afterSubmit(D, n);
										if (q[0] === false) {
											a("#DelError>td", "#" + l).html(q[1]);
											a("#DelError", "#" + l).show()
										} else {
											if (c[f.p.id].reloadAfterSubmit && f.p.datatype != "local") a(f).trigger("reloadGrid");
											else {
												var A = [];
												A = u.split(",");
												if (f.p.treeGrid === true) try {
													a(f).jqGrid("delTreeNode", f.p.idPrefix + A[0])
												} catch (B) { } else for (var J = 0; J < A.length; J++) a(f).jqGrid("delRowData", f.p.idPrefix + A[J]);
												f.p.selrow = null;
												f.p.selarrrow = []
											}
											a.isFunction(c[f.p.id].afterComplete) && setTimeout(function () {
												c[f.p.id].afterComplete(D, u)
											}, 500)
										}
										c[f.p.id].processing = false;
										a("#dData", "#" + l + "_2").removeClass("ui-state-active");
										q[0] && a.jgrid.hideModal("#" + r.themodal, {
											gb: "#gbox_" + d,
											jqm: b.jqModal,
											onClose: c[f.p.id].onClose
										})
									}
								}, a.jgrid.ajaxOptions, c[f.p.id].ajaxDelOptions);
								if (!x.url && !c[f.p.id].useDataProxy) if (a.isFunction(f.p.dataProxy)) c[f.p.id].useDataProxy = true;
								else {
									q[0] = false;
									q[1] += " " + a.jgrid.errors.nourl
								}
								if (q[0]) if (c[f.p.id].useDataProxy) {
									x = f.p.dataProxy.call(f, x, "del_" + f.p.id);
									if (typeof x == "undefined") x = [true, ""];
									if (x[0] === false) {
										q[0] = false;
										q[1] = x[1] || "Error deleting the selected row!"
									} else a.jgrid.hideModal("#" + r.themodal, {
										gb: "#gbox_" + d,
										jqm: b.jqModal,
										onClose: c[f.p.id].onClose
									})
								} else a.ajax(x)
							}
							if (q[0] === false) {
								a("#DelError>td", "#" + l).html(q[1]);
								a("#DelError", "#" + l).show()
							}
							return false
						});
						a("#eData", "#" + l + "_2").click(function () {
							a.jgrid.hideModal("#" + r.themodal, {
								gb: "#gbox_" + d,
								jqm: c[f.p.id].jqModal,
								onClose: c[f.p.id].onClose
							});
							return false
						});
						g && c[f.p.id].beforeShowForm(a("#" + l));
						a.jgrid.viewModal("#" + r.themodal, {
							gbox: "#gbox_" + d,
							jqm: c[f.p.id].jqModal,
							overlay: c[f.p.id].overlay,
							modal: c[f.p.id].modal
						})
					}
					h && c[f.p.id].afterShowForm(a("#" + l));
					c[f.p.id].closeOnEscape === true && setTimeout(function () {
						a(".ui-jqdialog-titlebar-close", "#" + r.modalhead).focus()
					}, 0)
				}
			})
		},
		navGrid: function (e, b, f, g, h, i, d) {
			b = a.extend({
				edit: true,
				editicon: "ui-icon-pencil",
				add: true,
				addicon: "ui-icon-plus",
				del: true,
				delicon: "ui-icon-trash",
				search: true,
				searchicon: "ui-icon-search",
				refresh: true,
				refreshicon: "ui-icon-refresh",
				refreshstate: "firstpage",
				view: false,
				viewicon: "ui-icon-document",
				position: "left",
				closeOnEscape: true,
				beforeRefresh: null,
				afterRefresh: null,
				cloneToTop: false,
				alertwidth: 200,
				alertheight: "auto",
				alerttop: null,
				alertleft: null,
				alertzIndex: null
			}, a.jgrid.nav, b || {});
			return this.each(function () {
				if (!this.nav) {
					var k = {
						themodal: "alertmod",
						modalhead: "alerthd",
						modalcontent: "alertcnt"
					},
                        m = this,
                        l;
					if (!(!m.grid || typeof e != "string")) {
						if (a("#" + k.themodal).html() === null) {
							if (!b.alerttop && !b.alertleft) {
								if (typeof window.innerWidth != "undefined") {
									b.alertleft = window.innerWidth;
									b.alerttop = window.innerHeight
								} else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined" && document.documentElement.clientWidth !== 0) {
									b.alertleft = document.documentElement.clientWidth;
									b.alerttop = document.documentElement.clientHeight
								} else {
									b.alertleft = 1024;
									b.alerttop = 768
								}
								b.alertleft = b.alertleft / 2 - parseInt(b.alertwidth, 10) / 2;
								b.alerttop = b.alerttop / 2 - 25
							}
							a.jgrid.createModal(k, "<div>" + b.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>", {
								gbox: "#gbox_" + m.p.id,
								jqModal: true,
								drag: true,
								resize: true,
								caption: b.alertcap,
								top: b.alerttop,
								left: b.alertleft,
								width: b.alertwidth,
								height: b.alertheight,
								closeOnEscape: b.closeOnEscape,
								zIndex: b.alertzIndex
							}, "", "", true)
						}
						var n = 1;
						if (b.cloneToTop && m.p.toppager) n = 2;
						for (var o = 0; o < n; o++) {
							var j = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                                v, r;
							if (o === 0) {
								v = e;
								r = m.p.id;
								if (v == m.p.toppager) {
									r += "_top";
									n = 1
								}
							} else {
								v = m.p.toppager;
								r = m.p.id + "_top"
							}
							m.p.direction == "rtl" && a(j).attr("dir", "rtl").css("float", "right");
							if (b.add) {
								g = g || {};
								l = a("<td class='ui-pg-button ui-corner-all'></td>");
								a(l).append("<div class='ui-pg-div'><span class='ui-icon " + b.addicon + "'></span>" + b.addtext + "</div>");
								a("tr", j).append(l);
								a(l, j).attr({
									title: b.addtitle || "",
									id: g.id || "add_" + r
								}).click(function () {
									a(this).hasClass("ui-state-disabled") || (a.isFunction(b.addfunc) ? b.addfunc.call(m) : a(m).jqGrid("editGridRow", "new", g));
									return false
								}).hover(function () {
									a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
								}, function () {
									a(this).removeClass("ui-state-hover")
								});
								l = null
							}
							if (b.edit) {
								l = a("<td class='ui-pg-button ui-corner-all'></td>");
								f = f || {};
								a(l).append("<div class='ui-pg-div'><span class='ui-icon " + b.editicon + "'></span>" + b.edittext + "</div>");
								a("tr", j).append(l);
								a(l, j).attr({
									title: b.edittitle || "",
									id: f.id || "edit_" + r
								}).click(function () {
									if (!a(this).hasClass("ui-state-disabled")) {
										var p = m.p.selrow;
										if (p) a.isFunction(b.editfunc) ? b.editfunc.call(m, p) : a(m).jqGrid("editGridRow", p, f);
										else {
											a.jgrid.viewModal("#" + k.themodal, {
												gbox: "#gbox_" + m.p.id,
												jqm: true
											});
											a("#jqg_alrt").focus()
										}
									}
									return false
								}).hover(function () {
									a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
								}, function () {
									a(this).removeClass("ui-state-hover")
								});
								l = null
							}
							if (b.view) {
								l = a("<td class='ui-pg-button ui-corner-all'></td>");
								d = d || {};
								a(l).append("<div class='ui-pg-div'><span class='ui-icon " + b.viewicon + "'></span>" + b.viewtext + "</div>");
								a("tr", j).append(l);
								a(l, j).attr({
									title: b.viewtitle || "",
									id: d.id || "view_" + r
								}).click(function () {
									if (!a(this).hasClass("ui-state-disabled")) {
										var p = m.p.selrow;
										if (p) a.isFunction(b.viewfunc) ? b.viewfunc.call(m, p) : a(m).jqGrid("viewGridRow", p, d);
										else {
											a.jgrid.viewModal("#" + k.themodal, {
												gbox: "#gbox_" + m.p.id,
												jqm: true
											});
											a("#jqg_alrt").focus()
										}
									}
									return false
								}).hover(function () {
									a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
								}, function () {
									a(this).removeClass("ui-state-hover")
								});
								l = null
							}
							if (b.del) {
								l = a("<td class='ui-pg-button ui-corner-all'></td>");
								h = h || {};
								a(l).append("<div class='ui-pg-div'><span class='ui-icon " + b.delicon + "'></span>" + b.deltext + "</div>");
								a("tr", j).append(l);
								a(l, j).attr({
									title: b.deltitle || "",
									id: h.id || "del_" + r
								}).click(function () {
									if (!a(this).hasClass("ui-state-disabled")) {
										var p;
										if (m.p.multiselect) {
											p = m.p.selarrrow;
											if (p.length === 0) p = null
										} else p = m.p.selrow;
										if (p) a.isFunction(b.delfunc) ? b.delfunc.call(m, p) : a(m).jqGrid("delGridRow", p, h);
										else {
											a.jgrid.viewModal("#" + k.themodal, {
												gbox: "#gbox_" + m.p.id,
												jqm: true
											});
											a("#jqg_alrt").focus()
										}
									}
									return false
								}).hover(function () {
									a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
								}, function () {
									a(this).removeClass("ui-state-hover")
								});
								l = null
							}
							if (b.add || b.edit || b.del || b.view) a("tr", j).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");
							if (b.search) {
								l = a("<td class='ui-pg-button ui-corner-all'></td>");
								i = i || {};
								a(l).append("<div class='ui-pg-div'><span class='ui-icon " + b.searchicon + "'></span>" + b.searchtext + "</div>");
								a("tr", j).append(l);
								a(l, j).attr({
									title: b.searchtitle || "",
									id: i.id || "search_" + r
								}).click(function () {
									a(this).hasClass("ui-state-disabled") || (a.isFunction(b.searchfunc) ? b.searchfunc.call(m, i) : a(m).jqGrid("searchGrid", i));
									return false
								}).hover(function () {
									a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
								}, function () {
									a(this).removeClass("ui-state-hover")
								});
								i.showOnLoad && i.showOnLoad === true && a(l, j).click();
								l = null
							}
							if (b.refresh) {
								l = a("<td class='ui-pg-button ui-corner-all'></td>");
								a(l).append("<div class='ui-pg-div'><span class='ui-icon " + b.refreshicon + "'></span>" + b.refreshtext + "</div>");
								a("tr", j).append(l);
								a(l, j).attr({
									title: b.refreshtitle || "",
									id: "refresh_" + r
								}).click(function () {
									if (!a(this).hasClass("ui-state-disabled")) {
										a.isFunction(b.beforeRefresh) && b.beforeRefresh();
										m.p.search = false;
										try {
											var p = m.p.id;
											m.p.postData.filters = "";
											a("#fbox_" + p).jqFilter("resetFilter");
											a.isFunction(m.clearToolbar) && m.clearToolbar(false)
										} catch (q) { }
										switch (b.refreshstate) {
											case "firstpage":
												a(m).trigger("reloadGrid", [{
													page: 1
												}]);
												break;
											case "current":
												a(m).trigger("reloadGrid", [{
													current: true
												}])
										}
										a.isFunction(b.afterRefresh) && b.afterRefresh()
									}
									return false
								}).hover(function () {
									a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
								}, function () {
									a(this).removeClass("ui-state-hover")
								});
								l = null
							}
							l = a(".ui-jqgrid").css("font-size") || "11px";
							a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + l + ";visibility:hidden;' ></div>");
							l = a(j).clone().appendTo("#testpg2").width();
							a("#testpg2").remove();
							a(v + "_" + b.position, v).append(j);
							if (m.p._nvtd) {
								if (l > m.p._nvtd[0]) {
									a(v + "_" + b.position, v).width(l);
									m.p._nvtd[0] = l
								}
								m.p._nvtd[1] = l
							}
							j = l = l = null;
							this.nav = true
						}
					}
				}
			})
		},
		navButtonAdd: function (e, b) {
			b = a.extend({
				caption: "newButton",
				title: "",
				buttonicon: "ui-icon-newwin",
				onClickButton: null,
				position: "last",
				cursor: "pointer"
			}, b || {});
			return this.each(function () {
				if (this.grid) {
					if (e.indexOf("#") !== 0) e = "#" + e;
					var f = a(".navtable", e)[0],
                        g = this;
					if (f) if (!(b.id && a("#" + b.id, f).html() !== null)) {
						var h = a("<td></td>");
						b.buttonicon.toString().toUpperCase() == "NONE" ? a(h).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + b.caption + "</div>") : a(h).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + b.buttonicon + "'></span>" + b.caption + "</div>");
						b.id && a(h).attr("id", b.id);
						if (b.position == "first") f.rows[0].cells.length === 0 ? a("tr", f).append(h) : a("tr td:eq(0)", f).before(h);
						else a("tr", f).append(h);
						a(h, f).attr("title", b.title || "").click(function (i) {
							a(this).hasClass("ui-state-disabled") || a.isFunction(b.onClickButton) && b.onClickButton.call(g, i);
							return false
						}).hover(function () {
							a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
						}, function () {
							a(this).removeClass("ui-state-hover")
						})
					}
				}
			})
		},
		navSeparatorAdd: function (e, b) {
			b = a.extend({
				sepclass: "ui-separator",
				sepcontent: ""
			}, b || {});
			return this.each(function () {
				if (this.grid) {
					if (e.indexOf("#") !== 0) e = "#" + e;
					var f = a(".navtable", e)[0];
					if (f) {
						var g = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + b.sepclass + "'></span>" + b.sepcontent + "</td>";
						a("tr", f).append(g)
					}
				}
			})
		},
		GridToForm: function (e, b) {
			return this.each(function () {
				var f = this;
				if (f.grid) {
					var g = a(f).jqGrid("getRowData", e);
					if (g) for (var h in g) a("[name=" + a.jgrid.jqID(h) + "]", b).is("input:radio") || a("[name=" + a.jgrid.jqID(h) + "]", b).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(h) + "]", b).each(function () {
						if (a(this).val() == g[h]) a(this)[f.p.useProp ? "prop" : "attr"]("checked", true);
						else a(this)[f.p.useProp ? "prop" : "attr"]("checked", false)
					}) : a("[name=" + a.jgrid.jqID(h) + "]", b).val(g[h])
				}
			})
		},
		FormToGrid: function (e, b, f, g) {
			return this.each(function () {
				if (this.grid) {
					f || (f = "set");
					g || (g = "first");
					var h = a(b).serializeArray(),
                        i = {};
					a.each(h, function (d, k) {
						i[k.name] = k.value
					});
					if (f == "add") a(this).jqGrid("addRowData", e, i, g);
					else f == "set" && a(this).jqGrid("setRowData", e, i)
				}
			})
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.inlineEdit = a.jgrid.inlineEdit || {};
	a.jgrid.extend({
		editRow: function (c, e, b, f, g, h, i, d, k) {
			var m = {},
                l = a.makeArray(arguments).slice(1);
			if (a.jgrid.realType(l[0]) === "Object") m = l[0];
			else {
				if (typeof e !== "undefined") m.keys = e;
				if (a.isFunction(b)) m.oneditfunc = b;
				if (a.isFunction(f)) m.successfunc = f;
				if (typeof g !== "undefined") m.url = g;
				if (typeof h !== "undefined") m.extraparam = h;
				if (a.isFunction(i)) m.aftersavefunc = i;
				if (a.isFunction(d)) m.errorfunc = d;
				if (a.isFunction(k)) m.afterrestorefunc = k
			}
			m = a.extend(true, {
				keys: false,
				oneditfunc: null,
				successfunc: null,
				url: null,
				extraparam: {},
				aftersavefunc: null,
				errorfunc: null,
				afterrestorefunc: null,
				restoreAfterError: true,
				mtype: "POST"
			}, a.jgrid.inlineEdit, m);
			return this.each(function () {
				var n = this,
                    o, j, v = 0,
                    r = null,
                    p = {},
                    q, u;
				if (n.grid) {
					q = a(n).jqGrid("getInd", c, true);
					if (q !== false) if ((a(q).attr("editable") || "0") == "0" && !a(q).hasClass("not-editable-row")) {
						u = n.p.colModel;
						a('td[role="gridcell"]', q).each(function (x) {
							o = u[x].name;
							var D = n.p.treeGrid === true && o == n.p.ExpandColumn;
							if (D) j = a("span:first", this).html();
							else try {
								j = a.unformat(this, {
									rowId: c,
									colModel: u[x]
								}, x)
							} catch (C) {
								j = u[x].edittype && u[x].edittype == "textarea" ? a(this).text() : a(this).html()
							}
							if (o != "cb" && o != "subgrid" && o != "rn") {
								if (n.p.autoencode) j = a.jgrid.htmlDecode(j);
								p[o] = j;
								if (u[x].editable === true) {
									if (r === null) r = x;
									D ? a("span:first", this).html("") : a(this).html("");
									var A = a.extend({}, u[x].editoptions || {}, {
										id: c + "_" + o,
										name: o
									});
									if (!u[x].edittype) u[x].edittype = "text";
									if (j == "&nbsp;" || j == "&#160;" || j.length == 1 && j.charCodeAt(0) == 160) j = "";
									A = a.jgrid.createEl(u[x].edittype, A, j, true, a.extend({}, a.jgrid.ajaxOptions, n.p.ajaxSelectOptions || {}));
									a(A).addClass("editable");
									D ? a("span:first", this).append(A) : a(this).append(A);
									u[x].edittype == "select" && typeof u[x].editoptions !== "undefined" && u[x].editoptions.multiple === true && typeof u[x].editoptions.dataUrl === "undefined" && a.browser.msie && a(A).width(a(A).width());
									v++
								}
							}
						});
						if (v > 0) {
							p.id = c;
							n.p.savedRow.push(p);
							a(q).attr("editable", "1");
							a("td:eq(" + r + ") input", q).focus();
							m.keys === true && a(q).bind("keydown", function (x) {
								if (x.keyCode === 27) {
									a(n).jqGrid("restoreRow", c, k);
									if (n.p._inlinenav) try {
										a(n).jqGrid("showAddEditButtons")
									} catch (D) { }
									return false
								}
								if (x.keyCode === 13) {
									if (x.target.tagName == "TEXTAREA") return true;
									if (a(n).jqGrid("saveRow", c, m)) if (n.p._inlinenav) try {
										a(n).jqGrid("showAddEditButtons")
									} catch (C) { }
									return false
								}
							});
							a.isFunction(m.oneditfunc) && m.oneditfunc.call(n, c)
						}
					}
				}
			})
		},
		saveRow: function (c, e, b, f, g, h, i) {
			var d = a.makeArray(arguments).slice(1),
                k = {};
			if (a.jgrid.realType(d[0]) === "Object") k = d[0];
			else {
				if (a.isFunction(e)) k.successfunc = e;
				if (typeof b !== "undefined") k.url = b;
				if (typeof f !== "undefined") k.extraparam = f;
				if (a.isFunction(g)) k.aftersavefunc = g;
				if (a.isFunction(h)) k.errorfunc = h;
				if (a.isFunction(i)) k.afterrestorefunc = i
			}
			k = a.extend(true, {
				successfunc: null,
				url: null,
				extraparam: {},
				aftersavefunc: null,
				errorfunc: null,
				afterrestorefunc: null,
				restoreAfterError: true,
				mtype: "POST"
			}, a.jgrid.inlineEdit, k);
			var m = false,
                l = this[0],
                n, o = {},
                j = {},
                v = {},
                r, p, q;
			if (!l.grid) return m;
			q = a(l).jqGrid("getInd", c, true);
			if (q === false) return m;
			d = a(q).attr("editable");
			k.url = k.url ? k.url : l.p.editurl;
			if (d === "1") {
				var u;
				a('td[role="gridcell"]', q).each(function (A) {
					u = l.p.colModel[A];
					n = u.name;
					if (n != "cb" && n != "subgrid" && u.editable === true && n != "rn" && !a(this).hasClass("not-editable-cell")) {
						switch (u.edittype) {
							case "checkbox":
								var B = ["Yes", "No"];
								if (u.editoptions) B = u.editoptions.value.split(":");
								o[n] = a("input", this).is(":checked") ? B[0] : B[1];
								break;
							case "text":
							case "password":
							case "textarea":
							case "button":
								o[n] = a("input, textarea", this).val();
								break;
							case "select":
								if (u.editoptions.multiple) {
									B = a("select", this);
									var J = [];
									o[n] = a(B).val();
									o[n] = o[n] ? o[n].join(",") : "";
									a("select option:selected", this).each(function (aa, V) {
										J[aa] = a(V).text()
									});
									j[n] = J.join(",")
								} else {
									o[n] = a("select option:selected", this).val();
									j[n] = a("select option:selected", this).text()
								}
								if (u.formatter && u.formatter == "select") j = {};
								break;
							case "custom":
								try {
									if (u.editoptions && a.isFunction(u.editoptions.custom_value)) {
										o[n] = u.editoptions.custom_value.call(l, a(".customelement", this), "get");
										if (o[n] === undefined) throw "e2";
									} else throw "e1";
								} catch (z) {
									z == "e1" && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose);
									z == "e2" ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, z.message, a.jgrid.edit.bClose)
								}
						}
						p = a.jgrid.checkValues(o[n], A, l);
						if (p[0] === false) {
							p[1] = o[n] + " " + p[1];
							return false
						}
						if (l.p.autoencode) o[n] = a.jgrid.htmlEncode(o[n]);
						if (k.url !== "clientArray" && u.editoptions && u.editoptions.NullIfEmpty === true) if (o[n] === "") v[n] = "null"
					}
				});
				if (p[0] === false) {
					try {
						var x = a.jgrid.findPos(a("#" + a.jgrid.jqID(c), l.grid.bDiv)[0]);
						a.jgrid.info_dialog(a.jgrid.errors.errcap, p[1], a.jgrid.edit.bClose, {
							left: x[0],
							top: x[1]
						})
					} catch (D) {
						alert(p[1])
					}
					return m
				}
				var C;
				d = l.p.prmNames;
				C = d.oper;
				x = d.id;
				if (o) {
					o[C] = d.editoper;
					o[x] = c;
					if (typeof l.p.inlineData == "undefined") l.p.inlineData = {};
					o = a.extend({}, o, l.p.inlineData, k.extraparam)
				}
				if (k.url == "clientArray") {
					o = a.extend({}, o, j);
					l.p.autoencode && a.each(o, function (A, B) {
						o[A] = a.jgrid.htmlDecode(B)
					});
					x = a(l).jqGrid("setRowData", c, o);
					a(q).attr("editable", "0");
					for (d = 0; d < l.p.savedRow.length; d++) if (l.p.savedRow[d].id == c) {
						r = d;
						break
					}
					r >= 0 && l.p.savedRow.splice(r, 1);
					a.isFunction(k.aftersavefunc) && k.aftersavefunc.call(l, c, x);
					m = true;
					a(q).unbind("keydown")
				} else {
					a("#lui_" + l.p.id).show();
					v = a.extend({}, o, v);
					v[x] = a.jgrid.stripPref(l.p.idPrefix, v[x]);
					a.ajax(a.extend({
						url: k.url,
						data: a.isFunction(l.p.serializeRowData) ? l.p.serializeRowData.call(l, v) : v,
						type: k.mtype,
						async: true,
						complete: function (A, B) {
							a("#lui_" + l.p.id).hide();
							if (B === "success") {
								var J = true,
                                    z;
								if (a.isFunction(k.successfunc)) {
									z = k.successfunc.call(l, A);
									if (a.isArray(z)) {
										J = z[0];
										o = z[1] ? z[1] : o
									} else J = z
								}
								if (J === true) {
									l.p.autoencode && a.each(o, function (aa, V) {
										o[aa] = a.jgrid.htmlDecode(V)
									});
									o = a.extend({}, o, j);
									a(l).jqGrid("setRowData", c, o);
									a(q).attr("editable", "0");
									for (J = 0; J < l.p.savedRow.length; J++) if (l.p.savedRow[J].id == c) {
										r = J;
										break
									}
									r >= 0 && l.p.savedRow.splice(r, 1);
									a.isFunction(k.aftersavefunc) && k.aftersavefunc.call(l, c, A);
									m = true;
									a(q).unbind("keydown")
								} else {
									a.isFunction(k.errorfunc) && k.errorfunc.call(l, c, A, B);
									k.restoreAfterError === true && a(l).jqGrid("restoreRow", c, k.afterrestorefunc)
								}
							}
						},
						error: function (A, B) {
							a("#lui_" + l.p.id).hide();
							if (a.isFunction(k.errorfunc)) k.errorfunc.call(l, c, A, B);
							else try {
								a.jgrid.info_dialog(a.jgrid.errors.errcap, '<div class="ui-state-error">' + A.responseText + "</div>", a.jgrid.edit.bClose, {
									buttonalign: "right"
								})
							} catch (J) {
								alert(A.responseText)
							}
							k.restoreAfterError === true && a(l).jqGrid("restoreRow", c, k.afterrestorefunc)
						}
					}, a.jgrid.ajaxOptions, l.p.ajaxRowOptions || {}))
				}
			}
			return m
		},
		restoreRow: function (c, e) {
			var b = a.makeArray(arguments).slice(1),
                f = {};
			if (a.jgrid.realType(b[0]) === "Object") f = b[0];
			else if (a.isFunction(e)) f.afterrestorefunc = e;
			f = a.extend(true, a.jgrid.inlineEdit, f);
			return this.each(function () {
				var g = this,
                    h, i, d = {};
				if (g.grid) {
					i = a(g).jqGrid("getInd", c, true);
					if (i !== false) {
						for (var k = 0; k < g.p.savedRow.length; k++) if (g.p.savedRow[k].id == c) {
							h = k;
							break
						}
						if (h >= 0) {
							if (a.isFunction(a.fn.datepicker)) try {
								a("input.hasDatepicker", "#" + a.jgrid.jqID(i.id)).datepicker("hide")
							} catch (m) { }
							a.each(g.p.colModel, function () {
								if (this.editable === true && this.name in g.p.savedRow[h] && !a(this).hasClass("not-editable-cell")) d[this.name] = g.p.savedRow[h][this.name]
							});
							a(g).jqGrid("setRowData", c, d);
							a(i).attr("editable", "0").unbind("keydown");
							g.p.savedRow.splice(h, 1);
							a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(g.p.id)).hasClass("jqgrid-new-row") && setTimeout(function () {
								a(g).jqGrid("delRowData", c)
							}, 0)
						}
						a.isFunction(f.afterrestorefunc) && f.afterrestorefunc.call(g, c)
					}
				}
			})
		},
		addRow: function (c) {
			c = a.extend(true, {
				rowID: "new_row",
				initdata: {},
				position: "first",
				useDefValues: true,
				useFormatter: false,
				addRowParams: {
					extraparam: {}
				}
			}, c || {});
			return this.each(function () {
				if (this.grid) {
					var e = this;
					c.useDefValues === true && a(e.p.colModel).each(function () {
						if (this.editoptions && this.editoptions.defaultValue) {
							var f = this.editoptions.defaultValue;
							f = a.isFunction(f) ? f.call(e) : f;
							c.initdata[this.name] = f
						}
					});
					a(e).jqGrid("addRowData", c.rowID, c.initdata, c.position);
					a("#" + a.jgrid.jqID(c.rowID), "#" + a.jgrid.jqID(e.p.id)).addClass("jqgrid-new-row");
					if (c.useFormatter) a("#" + a.jgrid.jqID(c.rowID) + " .ui-inline-edit", "#" + a.jgrid.jqID(e.p.id)).click();
					else {
						var b = e.p.prmNames;
						c.addRowParams.extraparam[b.oper] = b.addoper;
						a(e).jqGrid("editRow", c.rowID, c.addRowParams);
						a(e).jqGrid("setSelection", c.rowID)
					}
				}
			})
		},
		inlineNav: function (c, e) {
			e = a.extend({
				edit: true,
				editicon: "ui-icon-pencil",
				add: true,
				addicon: "ui-icon-plus",
				save: true,
				saveicon: "ui-icon-disk",
				cancel: true,
				cancelicon: "ui-icon-cancel",
				addParams: {
					useFormatter: false,
					rowID: "new_row"
				},
				editParams: {},
				restoreAfterSelect: true
			}, a.jgrid.nav, e || {});
			return this.each(function () {
				if (this.grid) {
					var b = this,
                        f;
					b.p._inlinenav = true;
					if (e.addParams.useFormatter === true) {
						var g = b.p.colModel,
                            h;
						for (h = 0; h < g.length; h++) if (g[h].formatter && g[h].formatter === "actions") {
							if (g[h].formatoptions) {
								g = a.extend({
									keys: false,
									onEdit: null,
									onSuccess: null,
									afterSave: null,
									onError: null,
									afterRestore: null,
									extraparam: {},
									url: null
								}, g[h].formatoptions);
								e.addParams.addRowParams = {
									keys: g.keys,
									oneditfunc: g.onEdit,
									successfunc: g.onSuccess,
									url: g.url,
									extraparam: g.extraparam,
									aftersavefunc: g.afterSavef,
									errorfunc: g.onError,
									afterrestorefunc: g.afterRestore
								}
							}
							break
						}
					}
					e.add && a(b).jqGrid("navButtonAdd", c, {
						caption: e.addtext,
						title: e.addtitle,
						buttonicon: e.addicon,
						id: b.p.id + "_iladd",
						onClickButton: function () {
							a(b).jqGrid("addRow", e.addParams);
							if (!e.addParams.useFormatter) {
								a("#" + b.p.id + "_ilsave").removeClass("ui-state-disabled");
								a("#" + b.p.id + "_ilcancel").removeClass("ui-state-disabled");
								a("#" + b.p.id + "_iladd").addClass("ui-state-disabled");
								a("#" + b.p.id + "_iledit").addClass("ui-state-disabled")
							}
						}
					});
					e.edit && a(b).jqGrid("navButtonAdd", c, {
						caption: e.edittext,
						title: e.edittitle,
						buttonicon: e.editicon,
						id: b.p.id + "_iledit",
						onClickButton: function () {
							var i = a(b).jqGrid("getGridParam", "selrow");
							if (i) {
								a(b).jqGrid("editRow", i, e.editParams);
								a("#" + b.p.id + "_ilsave").removeClass("ui-state-disabled");
								a("#" + b.p.id + "_ilcancel").removeClass("ui-state-disabled");
								a("#" + b.p.id + "_iladd").addClass("ui-state-disabled");
								a("#" + b.p.id + "_iledit").addClass("ui-state-disabled")
							} else {
								a.jgrid.viewModal("#alertmod", {
									gbox: "#gbox_" + b.p.id,
									jqm: true
								});
								a("#jqg_alrt").focus()
							}
						}
					});
					if (e.save) {
						a(b).jqGrid("navButtonAdd", c, {
							caption: e.savetext || "",
							title: e.savetitle || "Save row",
							buttonicon: e.saveicon,
							id: b.p.id + "_ilsave",
							onClickButton: function () {
								var i = b.p.savedRow[0].id;
								if (i) {
									if (a("#" + a.jgrid.jqID(i), "#" + a.jgrid.jqID(b.p.id)).hasClass("jqgrid-new-row")) {
										var d = b.p.prmNames,
                                            k = d.oper;
										if (!e.editParams.extraparam) e.editParams.extraparam = {};
										e.editParams.extraparam[k] = d.addoper
									}
									a(b).jqGrid("saveRow", i, e.editParams) && a(b).jqGrid("showAddEditButtons")
								} else {
									a.jgrid.viewModal("#alertmod", {
										gbox: "#gbox_" + b.p.id,
										jqm: true
									});
									a("#jqg_alrt").focus()
								}
							}
						});
						a("#" + b.p.id + "_ilsave").addClass("ui-state-disabled")
					}
					if (e.cancel) {
						a(b).jqGrid("navButtonAdd", c, {
							caption: e.canceltext || "",
							title: e.canceltitle || "Cancel row editing",
							buttonicon: e.cancelicon,
							id: b.p.id + "_ilcancel",
							onClickButton: function () {
								var i = b.p.savedRow[0].id;
								if (i) {
									a(b).jqGrid("restoreRow", i, e.editParams);
									a(b).jqGrid("showAddEditButtons")
								} else {
									a.jgrid.viewModal("#alertmod", {
										gbox: "#gbox_" + b.p.id,
										jqm: true
									});
									a("#jqg_alrt").focus()
								}
							}
						});
						a("#" + b.p.id + "_ilcancel").addClass("ui-state-disabled")
					}
					if (e.restoreAfterSelect === true) {
						f = a.isFunction(b.p.beforeSelectRow) ? b.p.beforeSelectRow : false;
						b.p.beforeSelectRow = function (i, d) {
							var k = true;
							if (b.p.savedRow.length > 0 && b.p._inlinenav === true && i !== b.p.selrow && b.p.selrow !== null) {
								b.p.selrow == e.addParams.rowID ? a(b).jqGrid("delRowData", b.p.selrow) : a(b).jqGrid("restoreRow", b.p.selrow, e.editParams);
								a(b).jqGrid("showAddEditButtons")
							}
							if (f) k = f.call(b, i, d);
							return k
						}
					}
				}
			})
		},
		showAddEditButtons: function () {
			return this.each(function () {
				if (this.grid) {
					a("#" + this.p.id + "_ilsave").addClass("ui-state-disabled");
					a("#" + this.p.id + "_ilcancel").addClass("ui-state-disabled");
					a("#" + this.p.id + "_iladd").removeClass("ui-state-disabled");
					a("#" + this.p.id + "_iledit").removeClass("ui-state-disabled")
				}
			})
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.extend({
		editCell: function (c, e, b) {
			return this.each(function () {
				var f = this,
                    g, h, i, d;
				if (!(!f.grid || f.p.cellEdit !== true)) {
					e = parseInt(e, 10);
					f.p.selrow = f.rows[c].id;
					f.p.knv || a(f).jqGrid("GridNav");
					if (f.p.savedRow.length > 0) {
						if (b === true) if (c == f.p.iRow && e == f.p.iCol) return;
						a(f).jqGrid("saveCell", f.p.savedRow[0].id, f.p.savedRow[0].ic)
					} else window.setTimeout(function () {
						a("#" + f.p.knv).attr("tabindex", "-1").focus()
					}, 0);
					d = f.p.colModel[e];
					g = d.name;
					if (!(g == "subgrid" || g == "cb" || g == "rn")) {
						i = a("td:eq(" + e + ")", f.rows[c]);
						if (d.editable === true && b === true && !i.hasClass("not-editable-cell")) {
							if (parseInt(f.p.iCol, 10) >= 0 && parseInt(f.p.iRow, 10) >= 0) {
								a("td:eq(" + f.p.iCol + ")", f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight");
								a(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover")
							}
							a(i).addClass("edit-cell ui-state-highlight");
							a(f.rows[c]).addClass("selected-row ui-state-hover");
							try {
								h = a.unformat(i, {
									rowId: f.rows[c].id,
									colModel: d
								}, e)
							} catch (k) {
								h = d.edittype && d.edittype == "textarea" ? a(i).text() : a(i).html()
							}
							if (f.p.autoencode) h = a.jgrid.htmlDecode(h);
							if (!d.edittype) d.edittype = "text";
							f.p.savedRow.push({
								id: c,
								ic: e,
								name: g,
								v: h
							});
							if (h == "&nbsp;" || h == "&#160;" || h.length == 1 && h.charCodeAt(0) == 160) h = "";
							if (a.isFunction(f.p.formatCell)) {
								var m = f.p.formatCell.call(f, f.rows[c].id, g, h, c, e);
								if (m !== undefined) h = m
							}
							m = a.extend({}, d.editoptions || {}, {
								id: c + "_" + g,
								name: g
							});
							var l = a.jgrid.createEl(d.edittype, m, h, true, a.extend({}, a.jgrid.ajaxOptions, f.p.ajaxSelectOptions || {}));
							a.isFunction(f.p.beforeEditCell) && f.p.beforeEditCell.call(f, f.rows[c].id, g, h, c, e);
							a(i).html("").append(l).attr("tabindex", "0");
							window.setTimeout(function () {
								a(l).focus()
							}, 0);
							a("input, select, textarea", i).bind("keydown", function (n) {
								if (n.keyCode === 27) if (a("input.hasDatepicker", i).length > 0) a(".ui-datepicker").is(":hidden") ? a(f).jqGrid("restoreCell", c, e) : a("input.hasDatepicker", i).datepicker("hide");
								else a(f).jqGrid("restoreCell", c, e);
								n.keyCode === 13 && a(f).jqGrid("saveCell", c, e);
								if (n.keyCode == 9) if (f.grid.hDiv.loading) return false;
								else n.shiftKey ? a(f).jqGrid("prevCell", c, e) : a(f).jqGrid("nextCell", c, e);
								n.stopPropagation()
							});
							a.isFunction(f.p.afterEditCell) && f.p.afterEditCell.call(f, f.rows[c].id, g, h, c, e)
						} else {
							if (parseInt(f.p.iCol, 10) >= 0 && parseInt(f.p.iRow, 10) >= 0) {
								a("td:eq(" + f.p.iCol + ")", f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight");
								a(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover")
							}
							i.addClass("edit-cell ui-state-highlight");
							a(f.rows[c]).addClass("selected-row ui-state-hover");
							if (a.isFunction(f.p.onSelectCell)) {
								h = i.html().replace(/\&#160\;/ig, "");
								f.p.onSelectCell.call(f, f.rows[c].id, g, h, c, e)
							}
						}
						f.p.iCol = e;
						f.p.iRow = c
					}
				}
			})
		},
		saveCell: function (c, e) {
			return this.each(function () {
				var b = this,
                    f;
				if (!(!b.grid || b.p.cellEdit !== true)) {
					f = b.p.savedRow.length >= 1 ? 0 : null;
					if (f !== null) {
						var g = a("td:eq(" + e + ")", b.rows[c]),
                            h, i, d = b.p.colModel[e],
                            k = d.name,
                            m = a.jgrid.jqID(k);
						switch (d.edittype) {
							case "select":
								if (d.editoptions.multiple) {
									m = a("#" + c + "_" + m, b.rows[c]);
									var l = [];
									if (h = a(m).val()) h.join(",");
									else h = "";
									a("option:selected", m).each(function (q, u) {
										l[q] = a(u).text()
									});
									i = l.join(",")
								} else {
									h = a("#" + c + "_" + m + ">option:selected", b.rows[c]).val();
									i = a("#" + c + "_" + m + ">option:selected", b.rows[c]).text()
								}
								if (d.formatter) i = h;
								break;
							case "checkbox":
								var n = ["Yes", "No"];
								if (d.editoptions) n = d.editoptions.value.split(":");
								i = h = a("#" + c + "_" + m, b.rows[c]).is(":checked") ? n[0] : n[1];
								break;
							case "password":
							case "text":
							case "textarea":
							case "button":
								i = h = a("#" + c + "_" + m, b.rows[c]).val();
								break;
							case "custom":
								try {
									if (d.editoptions && a.isFunction(d.editoptions.custom_value)) {
										h = d.editoptions.custom_value.call(b, a(".customelement", g), "get");
										if (h === undefined) throw "e2";
										else i = h
									} else throw "e1";
								} catch (o) {
									o == "e1" && a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose);
									o == "e2" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, o.message, jQuery.jgrid.edit.bClose)
								}
						}
						if (i !== b.p.savedRow[f].v) {
							if (a.isFunction(b.p.beforeSaveCell)) if (f = b.p.beforeSaveCell.call(b, b.rows[c].id, k, h, c, e)) i = h = f;
							var j = a.jgrid.checkValues(h, e, b);
							if (j[0] === true) {
								f = {};
								if (a.isFunction(b.p.beforeSubmitCell)) (f = b.p.beforeSubmitCell.call(b, b.rows[c].id, k, h, c, e)) || (f = {});
								a("input.hasDatepicker", g).length > 0 && a("input.hasDatepicker", g).datepicker("hide");
								if (b.p.cellsubmit == "remote") if (b.p.cellurl) {
									var v = {};
									if (b.p.autoencode) h = a.jgrid.htmlEncode(h);
									v[k] = h;
									n = b.p.prmNames;
									d = n.id;
									m = n.oper;
									v[d] = a.jgrid.stripPref(b.p.idPrefix, b.rows[c].id);
									v[m] = n.editoper;
									v = a.extend(f, v);
									a("#lui_" + b.p.id).show();
									b.grid.hDiv.loading = true;
									a.ajax(a.extend({
										url: b.p.cellurl,
										data: a.isFunction(b.p.serializeCellData) ? b.p.serializeCellData.call(b, v) : v,
										type: "POST",
										complete: function (q, u) {
											a("#lui_" + b.p.id).hide();
											b.grid.hDiv.loading = false;
											if (u == "success") if (a.isFunction(b.p.afterSubmitCell)) {
												var x = b.p.afterSubmitCell.call(b, q, v.id, k, h, c, e);
												if (x[0] === true) {
													a(g).empty();
													a(b).jqGrid("setCell", b.rows[c].id, e, i, false, false, true);
													a(g).addClass("dirty-cell");
													a(b.rows[c]).addClass("edited");
													a.isFunction(b.p.afterSaveCell) && b.p.afterSaveCell.call(b, b.rows[c].id, k, h, c, e);
													b.p.savedRow.splice(0, 1)
												} else {
													a.jgrid.info_dialog(a.jgrid.errors.errcap, x[1], a.jgrid.edit.bClose);
													a(b).jqGrid("restoreCell", c, e)
												}
											} else {
												a(g).empty();
												a(b).jqGrid("setCell", b.rows[c].id, e, i, false, false, true);
												a(g).addClass("dirty-cell");
												a(b.rows[c]).addClass("edited");
												a.isFunction(b.p.afterSaveCell) && b.p.afterSaveCell.call(b, b.rows[c].id, k, h, c, e);
												b.p.savedRow.splice(0, 1)
											}
										},
										error: function (q, u) {
											a("#lui_" + b.p.id).hide();
											b.grid.hDiv.loading = false;
											a.isFunction(b.p.errorCell) ? b.p.errorCell.call(b, q, u) : a.jgrid.info_dialog(a.jgrid.errors.errcap, q.status + " : " + q.statusText + "<br/>" + u, a.jgrid.edit.bClose);
											a(b).jqGrid("restoreCell", c, e)
										}
									}, a.jgrid.ajaxOptions, b.p.ajaxCellOptions || {}))
								} else try {
									a.jgrid.info_dialog(a.jgrid.errors.errcap, a.jgrid.errors.nourl, a.jgrid.edit.bClose);
									a(b).jqGrid("restoreCell", c, e)
								} catch (r) { }
								if (b.p.cellsubmit == "clientArray") {
									a(g).empty();
									a(b).jqGrid("setCell", b.rows[c].id, e, i, false, false, true);
									a(g).addClass("dirty-cell");
									a(b.rows[c]).addClass("edited");
									a.isFunction(b.p.afterSaveCell) && b.p.afterSaveCell.call(b, b.rows[c].id, k, h, c, e);
									b.p.savedRow.splice(0, 1)
								}
							} else try {
								window.setTimeout(function () {
									a.jgrid.info_dialog(a.jgrid.errors.errcap, h + " " + j[1], a.jgrid.edit.bClose)
								}, 100);
								a(b).jqGrid("restoreCell", c, e)
							} catch (p) { }
						} else a(b).jqGrid("restoreCell", c, e)
					}
					a.browser.opera ? a("#" + b.p.knv).attr("tabindex", "-1").focus() : window.setTimeout(function () {
						a("#" + b.p.knv).attr("tabindex", "-1").focus()
					}, 0)
				}
			})
		},
		restoreCell: function (c, e) {
			return this.each(function () {
				var b = this,
                    f;
				if (!(!b.grid || b.p.cellEdit !== true)) {
					f = b.p.savedRow.length >= 1 ? 0 : null;
					if (f !== null) {
						var g = a("td:eq(" + e + ")", b.rows[c]);
						if (a.isFunction(a.fn.datepicker)) try {
							a("input.hasDatepicker", g).datepicker("hide")
						} catch (h) { }
						a(g).empty().attr("tabindex", "-1");
						a(b).jqGrid("setCell", b.rows[c].id, e, b.p.savedRow[f].v, false, false, true);
						a.isFunction(b.p.afterRestoreCell) && b.p.afterRestoreCell.call(b, b.rows[c].id, b.p.savedRow[f].v, c, e);
						b.p.savedRow.splice(0, 1)
					}
					window.setTimeout(function () {
						a("#" + b.p.knv).attr("tabindex", "-1").focus()
					}, 0)
				}
			})
		},
		nextCell: function (c, e) {
			return this.each(function () {
				var b = false;
				if (!(!this.grid || this.p.cellEdit !== true)) {
					for (var f = e + 1; f < this.p.colModel.length; f++) if (this.p.colModel[f].editable === true) {
						b = f;
						break
					}
					if (b !== false) a(this).jqGrid("editCell", c, b, true);
					else this.p.savedRow.length > 0 && a(this).jqGrid("saveCell", c, e)
				}
			})
		},
		prevCell: function (c, e) {
			return this.each(function () {
				var b = false;
				if (!(!this.grid || this.p.cellEdit !== true)) {
					for (var f = e - 1; f >= 0; f--) if (this.p.colModel[f].editable === true) {
						b = f;
						break
					}
					if (b !== false) a(this).jqGrid("editCell", c, b, true);
					else this.p.savedRow.length > 0 && a(this).jqGrid("saveCell", c, e)
				}
			})
		},
		GridNav: function () {
			return this.each(function () {
				function c(i, d, k) {
					if (k.substr(0, 1) == "v") {
						var m = a(b.grid.bDiv)[0].clientHeight,
                            l = a(b.grid.bDiv)[0].scrollTop,
                            n = b.rows[i].offsetTop + b.rows[i].clientHeight,
                            o = b.rows[i].offsetTop;
						if (k == "vd") if (n >= m) a(b.grid.bDiv)[0].scrollTop = a(b.grid.bDiv)[0].scrollTop + b.rows[i].clientHeight;
						if (k == "vu") if (o < l) a(b.grid.bDiv)[0].scrollTop = a(b.grid.bDiv)[0].scrollTop - b.rows[i].clientHeight
					}
					if (k == "h") {
						k = a(b.grid.bDiv)[0].clientWidth;
						m = a(b.grid.bDiv)[0].scrollLeft;
						l = b.rows[i].cells[d].offsetLeft;
						if (b.rows[i].cells[d].offsetLeft + b.rows[i].cells[d].clientWidth >= k + parseInt(m, 10)) a(b.grid.bDiv)[0].scrollLeft = a(b.grid.bDiv)[0].scrollLeft + b.rows[i].cells[d].clientWidth;
						else if (l < m) a(b.grid.bDiv)[0].scrollLeft = a(b.grid.bDiv)[0].scrollLeft - b.rows[i].cells[d].clientWidth
					}
				}
				function e(i, d) {
					var k, m;
					if (d == "lft") {
						k = i + 1;
						for (m = i; m >= 0; m--) if (b.p.colModel[m].hidden !== true) {
							k = m;
							break
						}
					}
					if (d == "rgt") {
						k = i - 1;
						for (m = i; m < b.p.colModel.length; m++) if (b.p.colModel[m].hidden !== true) {
							k = m;
							break
						}
					}
					return k
				}
				var b = this;
				if (!(!b.grid || b.p.cellEdit !== true)) {
					b.p.knv = b.p.id + "_kn";
					var f = a("<span style='width:0px;height:0px;background-color:black;' tabindex='0'><span tabindex='-1' style='width:0px;height:0px;background-color:grey' id='" + b.p.knv + "'></span></span>"),
                        g, h;
					a(f).insertBefore(b.grid.cDiv);
					a("#" + b.p.knv).focus().keydown(function (i) {
						h = i.keyCode;
						if (b.p.direction == "rtl") if (h == 37) h = 39;
						else if (h == 39) h = 37;
						switch (h) {
							case 38:
								if (b.p.iRow - 1 > 0) {
									c(b.p.iRow - 1, b.p.iCol, "vu");
									a(b).jqGrid("editCell", b.p.iRow - 1, b.p.iCol, false)
								}
								break;
							case 40:
								if (b.p.iRow + 1 <= b.rows.length - 1) {
									c(b.p.iRow + 1, b.p.iCol, "vd");
									a(b).jqGrid("editCell", b.p.iRow + 1, b.p.iCol, false)
								}
								break;
							case 37:
								if (b.p.iCol - 1 >= 0) {
									g = e(b.p.iCol - 1, "lft");
									c(b.p.iRow, g, "h");
									a(b).jqGrid("editCell", b.p.iRow, g, false)
								}
								break;
							case 39:
								if (b.p.iCol + 1 <= b.p.colModel.length - 1) {
									g = e(b.p.iCol + 1, "rgt");
									c(b.p.iRow, g, "h");
									a(b).jqGrid("editCell", b.p.iRow, g, false)
								}
								break;
							case 13:
								parseInt(b.p.iCol, 10) >= 0 && parseInt(b.p.iRow, 10) >= 0 && a(b).jqGrid("editCell", b.p.iRow, b.p.iCol, true);
								break;
							default:
								return true
						}
						return false
					})
				}
			})
		},
		getChangedCells: function (c) {
			var e = [];
			c || (c = "all");
			this.each(function () {
				var b = this,
                    f;
				!b.grid || b.p.cellEdit !== true || a(b.rows).each(function (g) {
					var h = {};
					if (a(this).hasClass("edited")) {
						a("td", this).each(function (i) {
							f = b.p.colModel[i].name;
							if (f !== "cb" && f !== "subgrid") if (c == "dirty") {
								if (a(this).hasClass("dirty-cell")) try {
									h[f] = a.unformat(this, {
										rowId: b.rows[g].id,
										colModel: b.p.colModel[i]
									}, i)
								} catch (d) {
									h[f] = a.jgrid.htmlDecode(a(this).html())
								}
							} else try {
								h[f] = a.unformat(this, {
									rowId: b.rows[g].id,
									colModel: b.p.colModel[i]
								}, i)
							} catch (k) {
								h[f] = a.jgrid.htmlDecode(a(this).html())
							}
						});
						h.id = this.id;
						e.push(h)
					}
				})
			});
			return e
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.extend({
		setSubGrid: function () {
			return this.each(function () {
				var c;
				this.p.subGridOptions = a.extend({
					plusicon: "ui-icon-plus",
					minusicon: "ui-icon-minus",
					openicon: "ui-icon-carat-1-sw",
					expandOnLoad: false,
					delayOnLoad: 50,
					selectOnExpand: false,
					reloadOnExpand: true
				}, this.p.subGridOptions || {});
				this.p.colNames.unshift("");
				this.p.colModel.unshift({
					name: "subgrid",
					width: a.browser.safari ? this.p.subGridWidth + this.p.cellLayout : this.p.subGridWidth,
					sortable: false,
					resizable: false,
					hidedlg: true,
					search: false,
					fixed: true
				});
				c = this.p.subGridModel;
				if (c[0]) {
					c[0].align = a.extend([], c[0].align || []);
					for (var e = 0; e < c[0].name.length; e++) c[0].align[e] = c[0].align[e] || "left"
				}
			})
		},
		addSubGridCell: function (c, e) {
			var b = "",
                f, g;
			this.each(function () {
				b = this.formatCol(c, e);
				g = this.p.id;
				f = this.p.subGridOptions.plusicon
			});
			return '<td role="gridcell" aria-describedby="' + g + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + b + "><a href='javascript:void(0);'><span class='ui-icon " + f + "'></span></a></td>"
		},
		addSubGrid: function (c, e) {
			return this.each(function () {
				var b = this;
				if (b.grid) {
					var f = function (r, p, q) {
						p = a("<td align='" + b.p.subGridModel[0].align[q] + "'></td>").html(p);
						a(r).append(p)
					},
                        g = function (r, p) {
                        	var q, u, x, D = a("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                C = a("<tr></tr>");
                        	for (u = 0; u < b.p.subGridModel[0].name.length; u++) {
                        		q = a("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + b.p.direction + "'></th>");
                        		a(q).html(b.p.subGridModel[0].name[u]);
                        		a(q).width(b.p.subGridModel[0].width[u]);
                        		a(C).append(q)
                        	}
                        	a(D).append(C);
                        	if (r) {
                        		x = b.p.xmlReader.subgrid;
                        		a(x.root + " " + x.row, r).each(function () {
                        			C = a("<tr class='ui-widget-content ui-subtblcell'></tr>");
                        			if (x.repeatitems === true) a(x.cell, this).each(function (B) {
                        				f(C, a(this).text() || "&#160;", B)
                        			});
                        			else {
                        				var A = b.p.subGridModel[0].mapping || b.p.subGridModel[0].name;
                        				if (A) for (u = 0; u < A.length; u++) f(C, a(A[u], this).text() || "&#160;", u)
                        			}
                        			a(D).append(C)
                        		})
                        	}
                        	q = a("table:first", b.grid.bDiv).attr("id") + "_";
                        	a("#" + q + p).append(D);
                        	b.grid.hDiv.loading = false;
                        	a("#load_" + b.p.id).hide();
                        	return false
                        },
                        h = function (r, p) {
                        	var q, u, x, D, C, A = a("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                B = a("<tr></tr>");
                        	for (u = 0; u < b.p.subGridModel[0].name.length; u++) {
                        		q = a("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + b.p.direction + "'></th>");
                        		a(q).html(b.p.subGridModel[0].name[u]);
                        		a(q).width(b.p.subGridModel[0].width[u]);
                        		a(B).append(q)
                        	}
                        	a(A).append(B);
                        	if (r) {
                        		D = b.p.jsonReader.subgrid;
                        		q = r[D.root];
                        		if (typeof q !== "undefined") for (u = 0; u < q.length; u++) {
                        			x = q[u];
                        			B = a("<tr class='ui-widget-content ui-subtblcell'></tr>");
                        			if (D.repeatitems === true) {
                        				if (D.cell) x = x[D.cell];
                        				for (C = 0; C < x.length; C++) f(B, x[C] || "&#160;", C)
                        			} else {
                        				var J = b.p.subGridModel[0].mapping || b.p.subGridModel[0].name;
                        				if (J.length) for (C = 0; C < J.length; C++) f(B, x[J[C]] || "&#160;", C)
                        			}
                        			a(A).append(B)
                        		}
                        	}
                        	u = a("table:first", b.grid.bDiv).attr("id") + "_";
                        	a("#" + u + p).append(A);
                        	b.grid.hDiv.loading = false;
                        	a("#load_" + b.p.id).hide();
                        	return false
                        },
                        i = function (r) {
                        	var p, q, u, x;
                        	p = a(r).attr("id");
                        	q = {
                        		nd_: (new Date).getTime()
                        	};
                        	q[b.p.prmNames.subgridid] = p;
                        	if (!b.p.subGridModel[0]) return false;
                        	if (b.p.subGridModel[0].params) for (x = 0; x < b.p.subGridModel[0].params.length; x++) for (u = 0; u < b.p.colModel.length; u++) if (b.p.colModel[u].name == b.p.subGridModel[0].params[x]) q[b.p.colModel[u].name] = a("td:eq(" + u + ")", r).text().replace(/\&#160\;/ig, "");
                        	if (!b.grid.hDiv.loading) {
                        		b.grid.hDiv.loading = true;
                        		a("#load_" + b.p.id).show();
                        		if (!b.p.subgridtype) b.p.subgridtype = b.p.datatype;
                        		if (a.isFunction(b.p.subgridtype)) b.p.subgridtype.call(b, q);
                        		else b.p.subgridtype = b.p.subgridtype.toLowerCase();
                        		switch (b.p.subgridtype) {
                        			case "xml":
                        			case "json":
                        				a.ajax(a.extend({
                        					type: b.p.mtype,
                        					url: b.p.subGridUrl,
                        					dataType: b.p.subgridtype,
                        					data: a.isFunction(b.p.serializeSubGridData) ? b.p.serializeSubGridData.call(b, q) : q,
                        					complete: function (D) {
                        						b.p.subgridtype == "xml" ? g(D.responseXML, p) : h(a.jgrid.parse(D.responseText), p)
                        					}
                        				}, a.jgrid.ajaxOptions, b.p.ajaxSubgridOptions || {}))
                        		}
                        	}
                        	return false
                        },
                        d, k, m, l = 0,
                        n, o;
					a.each(b.p.colModel, function () {
						if (this.hidden === true || this.name == "rn" || this.name == "cb") l++
					});
					var j = b.rows.length,
                        v = 1;
					if (e !== undefined && e > 0) {
						v = e;
						j = e + 1
					}
					for (; v < j; ) {
						a(b.rows[v]).hasClass("jqgrow") && a(b.rows[v].cells[c]).bind("click", function () {
							var r = a(this).parent("tr")[0];
							o = r.nextSibling;
							if (a(this).hasClass("sgcollapsed")) {
								k = b.p.id;
								d = r.id;
								if (b.p.subGridOptions.reloadOnExpand === true || b.p.subGridOptions.reloadOnExpand === false && !a(o).hasClass("ui-subgrid")) {
									m = c >= 1 ? "<td colspan='" + c + "'>&#160;</td>" : "";
									n = true;
									if (a.isFunction(b.p.subGridBeforeExpand)) n = b.p.subGridBeforeExpand.call(b, k + "_" + d, d);
									if (n === false) return false;
									a(r).after("<tr role='row' class='ui-subgrid'>" + m + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + b.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(b.p.colNames.length - 1 - l, 10) + "' class='ui-widget-content subgrid-data'><div id=" + k + "_" + d + " class='tablediv'></div></td></tr>");
									a.isFunction(b.p.subGridRowExpanded) ? b.p.subGridRowExpanded.call(b, k + "_" + d, d) : i(r)
								} else a(o).show();
								a(this).html("<a href='javascript:void(0);'><span class='ui-icon " + b.p.subGridOptions.minusicon + "'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
								b.p.subGridOptions.selectOnExpand && a(b).jqGrid("setSelection", d)
							} else if (a(this).hasClass("sgexpanded")) {
								n = true;
								if (a.isFunction(b.p.subGridRowColapsed)) {
									d = r.id;
									n = b.p.subGridRowColapsed.call(b, k + "_" + d, d)
								}
								if (n === false) return false;
								if (b.p.subGridOptions.reloadOnExpand === true) a(o).remove(".ui-subgrid");
								else a(o).hasClass("ui-subgrid") && a(o).hide();
								a(this).html("<a href='javascript:void(0);'><span class='ui-icon " + b.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")
							}
							return false
						});
						b.p.subGridOptions.expandOnLoad === true && a(b.rows[v].cells[c]).trigger("click");
						v++
					}
					b.subGridXml = function (r, p) {
						g(r, p)
					};
					b.subGridJson = function (r, p) {
						h(r, p)
					}
				}
			})
		},
		expandSubGridRow: function (c) {
			return this.each(function () {
				if (this.grid || c) if (this.p.subGrid === true) {
					var e = a(this).jqGrid("getInd", c, true);
					if (e) (e = a("td.sgcollapsed", e)[0]) && a(e).trigger("click")
				}
			})
		},
		collapseSubGridRow: function (c) {
			return this.each(function () {
				if (this.grid || c) if (this.p.subGrid === true) {
					var e = a(this).jqGrid("getInd", c, true);
					if (e) (e = a("td.sgexpanded", e)[0]) && a(e).trigger("click")
				}
			})
		},
		toggleSubGridRow: function (c) {
			return this.each(function () {
				if (this.grid || c) if (this.p.subGrid === true) {
					var e = a(this).jqGrid("getInd", c, true);
					if (e) {
						var b = a("td.sgcollapsed", e)[0];
						if (b) a(b).trigger("click");
						else (b = a("td.sgexpanded", e)[0]) && a(b).trigger("click")
					}
				}
			})
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.extend({
		setTreeNode: function (c, e) {
			return this.each(function () {
				var b = this;
				if (b.grid && b.p.treeGrid) for (var f = b.p.expColInd, g = b.p.treeReader.expanded_field, h = b.p.treeReader.leaf_field, i = b.p.treeReader.level_field, d = b.p.treeReader.icon_field, k = b.p.treeReader.loaded, m, l, n, o; c < e; ) {
					o = b.p.data[b.p._index[b.rows[c].id]];
					if (b.p.treeGridModel == "nested") if (!o[h]) {
						m = parseInt(o[b.p.treeReader.left_field], 10);
						l = parseInt(o[b.p.treeReader.right_field], 10);
						o[h] = l === m + 1 ? "true" : "false";
						b.rows[c].cells[b.p._treeleafpos].innerHTML = o[h]
					}
					m = parseInt(o[i], 10);
					if (b.p.tree_root_level === 0) {
						n = m + 1;
						l = m
					} else {
						n = m;
						l = m - 1
					}
					n = "<div class='tree-wrap tree-wrap-" + b.p.direction + "' style='width:" + n * 18 + "px;'>";
					n += "<div style='" + (b.p.direction == "rtl" ? "right:" : "left:") + l * 18 + "px;' class='ui-icon ";
					if (o[k] !== undefined) o[k] = o[k] == "true" || o[k] === true ? true : false;
					if (o[h] == "true" || o[h] === true) {
						n += (o[d] !== undefined && o[d] !== "" ? o[d] : b.p.treeIcons.leaf) + " tree-leaf treeclick";
						o[h] = true;
						l = "leaf"
					} else {
						o[h] = false;
						l = ""
					}
					o[g] = (o[g] == "true" || o[g] === true ? true : false) && o[k];
					n += o[g] === false ? o[h] === true ? "'" : b.p.treeIcons.plus + " tree-plus treeclick'" : o[h] === true ? "'" : b.p.treeIcons.minus + " tree-minus treeclick'";
					n += "></div></div>";
					a(b.rows[c].cells[f]).wrapInner("<span class='cell-wrapper" + l + "'></span>").prepend(n);
					if (m !== parseInt(b.p.tree_root_level, 10)) (o = (o = a(b).jqGrid("getNodeParent", o)) && o.hasOwnProperty(g) ? o[g] : true) || a(b.rows[c]).css("display", "none");
					a(b.rows[c].cells[f]).find("div.treeclick").bind("click", function (j) {
						j = a(j.target || j.srcElement, b.rows).closest("tr.jqgrow")[0].id;
						j = b.p._index[j];
						if (!b.p.data[j][h]) if (b.p.data[j][g]) {
							a(b).jqGrid("collapseRow", b.p.data[j]);
							a(b).jqGrid("collapseNode", b.p.data[j])
						} else {
							a(b).jqGrid("expandRow", b.p.data[j]);
							a(b).jqGrid("expandNode", b.p.data[j])
						}
						return false
					});
					b.p.ExpandColClick === true && a(b.rows[c].cells[f]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function (j) {
						j = a(j.target || j.srcElement, b.rows).closest("tr.jqgrow")[0].id;
						var v = b.p._index[j];
						if (!b.p.data[v][h]) if (b.p.data[v][g]) {
							a(b).jqGrid("collapseRow", b.p.data[v]);
							a(b).jqGrid("collapseNode", b.p.data[v])
						} else {
							a(b).jqGrid("expandRow", b.p.data[v]);
							a(b).jqGrid("expandNode", b.p.data[v])
						}
						a(b).jqGrid("setSelection", j);
						return false
					});
					c++
				}
			})
		},
		setTreeGrid: function () {
			return this.each(function () {
				var c = this,
                    e = 0,
                    b = false,
                    f, g, h = [];
				if (c.p.treeGrid) {
					c.p.treedatatype || a.extend(c.p, {
						treedatatype: c.p.datatype
					});
					c.p.subGrid = false;
					c.p.altRows = false;
					c.p.pgbuttons = false;
					c.p.pginput = false;
					c.p.gridview = true;
					if (c.p.rowTotal === null) c.p.rowNum = 1E4;
					c.p.multiselect = false;
					c.p.rowList = [];
					c.p.expColInd = 0;
					c.p.treeIcons = a.extend({
						plus: "ui-icon-triangle-1-" + (c.p.direction == "rtl" ? "w" : "e"),
						minus: "ui-icon-triangle-1-s",
						leaf: "ui-icon-radio-off"
					}, c.p.treeIcons || {});
					if (c.p.treeGridModel == "nested") c.p.treeReader = a.extend({
						level_field: "level",
						left_field: "lft",
						right_field: "rgt",
						leaf_field: "isLeaf",
						expanded_field: "expanded",
						loaded: "loaded",
						icon_field: "icon"
					}, c.p.treeReader);
					else if (c.p.treeGridModel == "adjacency") c.p.treeReader = a.extend({
						level_field: "level",
						parent_id_field: "parent",
						leaf_field: "isLeaf",
						expanded_field: "expanded",
						loaded: "loaded",
						icon_field: "icon"
					}, c.p.treeReader);
					for (g in c.p.colModel) if (c.p.colModel.hasOwnProperty(g)) {
						f = c.p.colModel[g].name;
						if (f == c.p.ExpandColumn && !b) {
							b = true;
							c.p.expColInd = e
						}
						e++;
						for (var i in c.p.treeReader) c.p.treeReader[i] == f && h.push(f)
					}
					a.each(c.p.treeReader, function (d, k) {
						if (k && a.inArray(k, h) === -1) {
							if (d === "leaf_field") c.p._treeleafpos = e;
							e++;
							c.p.colNames.push(k);
							c.p.colModel.push({
								name: k,
								width: 1,
								hidden: true,
								sortable: false,
								resizable: false,
								hidedlg: true,
								editable: true,
								search: false
							})
						}
					})
				}
			})
		},
		expandRow: function (c) {
			this.each(function () {
				var e = this;
				if (e.grid && e.p.treeGrid) {
					var b = a(e).jqGrid("getNodeChildren", c),
                        f = e.p.treeReader.expanded_field;
					a(b).each(function () {
						var g = a.jgrid.getAccessor(this, e.p.localReader.id);
						a("#" + g, e.grid.bDiv).css("display", "");
						this[f] && a(e).jqGrid("expandRow", this)
					})
				}
			})
		},
		collapseRow: function (c) {
			this.each(function () {
				var e = this;
				if (e.grid && e.p.treeGrid) {
					var b = a(e).jqGrid("getNodeChildren", c),
                        f = e.p.treeReader.expanded_field;
					a(b).each(function () {
						var g = a.jgrid.getAccessor(this, e.p.localReader.id);
						a("#" + g, e.grid.bDiv).css("display", "none");
						this[f] && a(e).jqGrid("collapseRow", this)
					})
				}
			})
		},
		getRootNodes: function () {
			var c = [];
			this.each(function () {
				var e = this;
				if (e.grid && e.p.treeGrid) switch (e.p.treeGridModel) {
					case "nested":
						var b = e.p.treeReader.level_field;
						a(e.p.data).each(function () {
							parseInt(this[b], 10) === parseInt(e.p.tree_root_level, 10) && c.push(this)
						});
						break;
					case "adjacency":
						var f = e.p.treeReader.parent_id_field;
						a(e.p.data).each(function () {
							if (this[f] === null || String(this[f]).toLowerCase() == "null") c.push(this)
						})
				}
			});
			return c
		},
		getNodeDepth: function (c) {
			var e = null;
			this.each(function () {
				if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
					case "nested":
						e = parseInt(c[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10);
						break;
					case "adjacency":
						e = a(this).jqGrid("getNodeAncestors", c).length
				}
			});
			return e
		},
		getNodeParent: function (c) {
			var e = null;
			this.each(function () {
				if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
					case "nested":
						var b = this.p.treeReader.left_field,
                        f = this.p.treeReader.right_field,
                        g = this.p.treeReader.level_field,
                        h = parseInt(c[b], 10),
                        i = parseInt(c[f], 10),
                        d = parseInt(c[g], 10);
						a(this.p.data).each(function () {
							if (parseInt(this[g], 10) === d - 1 && parseInt(this[b], 10) < h && parseInt(this[f], 10) > i) {
								e = this;
								return false
							}
						});
						break;
					case "adjacency":
						var k = this.p.treeReader.parent_id_field,
                        m = this.p.localReader.id;
						a(this.p.data).each(function () {
							if (this[m] == c[k]) {
								e = this;
								return false
							}
						})
				}
			});
			return e
		},
		getNodeChildren: function (c) {
			var e = [];
			this.each(function () {
				if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
					case "nested":
						var b = this.p.treeReader.left_field,
                        f = this.p.treeReader.right_field,
                        g = this.p.treeReader.level_field,
                        h = parseInt(c[b], 10),
                        i = parseInt(c[f], 10),
                        d = parseInt(c[g], 10);
						a(this.p.data).each(function () {
							parseInt(this[g], 10) === d + 1 && parseInt(this[b], 10) > h && parseInt(this[f], 10) < i && e.push(this)
						});
						break;
					case "adjacency":
						var k = this.p.treeReader.parent_id_field,
                        m = this.p.localReader.id;
						a(this.p.data).each(function () {
							this[k] == c[m] && e.push(this)
						})
				}
			});
			return e
		},
		getFullTreeNode: function (c) {
			var e = [];
			this.each(function () {
				var b;
				if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
					case "nested":
						var f = this.p.treeReader.left_field,
                        g = this.p.treeReader.right_field,
                        h = this.p.treeReader.level_field,
                        i = parseInt(c[f], 10),
                        d = parseInt(c[g], 10),
                        k = parseInt(c[h], 10);
						a(this.p.data).each(function () {
							parseInt(this[h], 10) >= k && parseInt(this[f], 10) >= i && parseInt(this[f], 10) <= d && e.push(this)
						});
						break;
					case "adjacency":
						if (c) {
							e.push(c);
							var m = this.p.treeReader.parent_id_field,
                            l = this.p.localReader.id;
							a(this.p.data).each(function (n) {
								b = e.length;
								for (n = 0; n < b; n++) if (e[n][l] == this[m]) {
									e.push(this);
									break
								}
							})
						}
				}
			});
			return e
		},
		getNodeAncestors: function (c) {
			var e = [];
			this.each(function () {
				if (this.grid && this.p.treeGrid) for (var b = a(this).jqGrid("getNodeParent", c); b; ) {
					e.push(b);
					b = a(this).jqGrid("getNodeParent", b)
				}
			});
			return e
		},
		isVisibleNode: function (c) {
			var e = true;
			this.each(function () {
				if (this.grid && this.p.treeGrid) {
					var b = a(this).jqGrid("getNodeAncestors", c),
                        f = this.p.treeReader.expanded_field;
					a(b).each(function () {
						e = e && this[f];
						if (!e) return false
					})
				}
			});
			return e
		},
		isNodeLoaded: function (c) {
			var e;
			this.each(function () {
				if (this.grid && this.p.treeGrid) {
					var b = this.p.treeReader.leaf_field;
					e = c !== undefined ? c.loaded !== undefined ? c.loaded : c[b] || a(this).jqGrid("getNodeChildren", c).length > 0 ? true : false : false
				}
			});
			return e
		},
		expandNode: function (c) {
			return this.each(function () {
				if (this.grid && this.p.treeGrid) {
					var e = this.p.treeReader.expanded_field,
                        b = this.p.treeReader.parent_id_field,
                        f = this.p.treeReader.loaded,
                        g = this.p.treeReader.level_field,
                        h = this.p.treeReader.left_field,
                        i = this.p.treeReader.right_field;
					if (!c[e]) {
						var d = a.jgrid.getAccessor(c, this.p.localReader.id),
                            k = a("#" + d, this.grid.bDiv)[0],
                            m = this.p._index[d];
						if (a(this).jqGrid("isNodeLoaded", this.p.data[m])) {
							c[e] = true;
							a("div.treeclick", k).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")
						} else {
							c[e] = true;
							a("div.treeclick", k).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus");
							this.p.treeANode = k.rowIndex;
							this.p.datatype = this.p.treedatatype;
							this.p.treeGridModel == "nested" ? a(this).jqGrid("setGridParam", {
								postData: {
									nodeid: d,
									n_left: c[h],
									n_right: c[i],
									n_level: c[g]
								}
							}) : a(this).jqGrid("setGridParam", {
								postData: {
									nodeid: d,
									parentid: c[b],
									n_level: c[g]
								}
							});
							a(this).trigger("reloadGrid");
							c[f] = true;
							this.p.treeGridModel == "nested" ? a(this).jqGrid("setGridParam", {
								postData: {
									nodeid: "",
									n_left: "",
									n_right: "",
									n_level: ""
								}
							}) : a(this).jqGrid("setGridParam", {
								postData: {
									nodeid: "",
									parentid: "",
									n_level: ""
								}
							})
						}
					}
				}
			})
		},
		collapseNode: function (c) {
			return this.each(function () {
				if (this.grid && this.p.treeGrid) {
					var e = this.p.treeReader.expanded_field;
					if (c[e]) {
						c[e] = false;
						e = a.jgrid.getAccessor(c, this.p.localReader.id);
						e = a("#" + e, this.grid.bDiv)[0];
						a("div.treeclick", e).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus")
					}
				}
			})
		},
		SortTree: function (c, e, b, f) {
			return this.each(function () {
				if (this.grid && this.p.treeGrid) {
					var g, h, i, d = [],
                        k = this,
                        m;
					g = a(this).jqGrid("getRootNodes");
					g = a.jgrid.from(g);
					g.orderBy(c, e, b, f);
					m = g.select();
					g = 0;
					for (h = m.length; g < h; g++) {
						i = m[g];
						d.push(i);
						a(this).jqGrid("collectChildrenSortTree", d, i, c, e, b, f)
					}
					a.each(d, function (l) {
						var n = a.jgrid.getAccessor(this, k.p.localReader.id);
						a("#" + k.p.id + " tbody tr:eq(" + l + ")").after(a("tr#" + n, k.grid.bDiv))
					});
					d = m = g = null
				}
			})
		},
		collectChildrenSortTree: function (c, e, b, f, g, h) {
			return this.each(function () {
				if (this.grid && this.p.treeGrid) {
					var i, d, k, m;
					i = a(this).jqGrid("getNodeChildren", e);
					i = a.jgrid.from(i);
					i.orderBy(b, f, g, h);
					m = i.select();
					i = 0;
					for (d = m.length; i < d; i++) {
						k = m[i];
						c.push(k);
						a(this).jqGrid("collectChildrenSortTree", c, k, b, f, g, h)
					}
				}
			})
		},
		setTreeRow: function (c, e) {
			var b = false;
			this.each(function () {
				if (this.grid && this.p.treeGrid) b = a(this).jqGrid("setRowData", c, e)
			});
			return b
		},
		delTreeNode: function (c) {
			return this.each(function () {
				var e = this.p.localReader.id,
                    b = this.p.treeReader.left_field,
                    f = this.p.treeReader.right_field,
                    g, h, i;
				if (this.grid && this.p.treeGrid) {
					var d = this.p._index[c];
					if (d !== undefined) {
						g = parseInt(this.p.data[d][f], 10);
						h = g - parseInt(this.p.data[d][b], 10) + 1;
						d = a(this).jqGrid("getFullTreeNode", this.p.data[d]);
						if (d.length > 0) for (var k = 0; k < d.length; k++) a(this).jqGrid("delRowData", d[k][e]);
						if (this.p.treeGridModel === "nested") {
							e = a.jgrid.from(this.p.data).greater(b, g, {
								stype: "integer"
							}).select();
							if (e.length) for (i in e) e[i][b] = parseInt(e[i][b], 10) - h;
							e = a.jgrid.from(this.p.data).greater(f, g, {
								stype: "integer"
							}).select();
							if (e.length) for (i in e) e[i][f] = parseInt(e[i][f], 10) - h
						}
					}
				}
			})
		},
		addChildNode: function (c, e, b) {
			var f = this[0];
			if (b) {
				var g = f.p.treeReader.expanded_field,
                    h = f.p.treeReader.leaf_field,
                    i = f.p.treeReader.level_field,
                    d = f.p.treeReader.parent_id_field,
                    k = f.p.treeReader.left_field,
                    m = f.p.treeReader.right_field,
                    l = f.p.treeReader.loaded,
                    n, o, j, v, r;
				n = 0;
				var p = e,
                    q;
				if (typeof c === "undefined" || c === null) {
					r = f.p.data.length - 1;
					if (r >= 0) for (; r >= 0; ) {
						n = Math.max(n, parseInt(f.p.data[r][f.p.localReader.id], 10));
						r--
					}
					c = n + 1
				}
				var u = a(f).jqGrid("getInd", e);
				q = false;
				if (e === undefined || e === null || e === "") {
					p = e = null;
					n = "last";
					v = f.p.tree_root_level;
					r = f.p.data.length + 1
				} else {
					n = "after";
					o = f.p._index[e];
					j = f.p.data[o];
					e = j[f.p.localReader.id];
					v = parseInt(j[i], 10) + 1;
					r = a(f).jqGrid("getFullTreeNode", j);
					if (r.length) {
						p = r = r[r.length - 1][f.p.localReader.id];
						r = a(f).jqGrid("getInd", p) + 1
					} else r = a(f).jqGrid("getInd", e) + 1;
					if (j[h]) {
						q = true;
						j[g] = true;
						a(f.rows[u]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(f.p.treeIcons.leaf + " tree-leaf").addClass(f.p.treeIcons.minus + " tree-minus");
						f.p.data[o][h] = false;
						j[l] = true
					}
				}
				o = r + 1;
				b[g] = false;
				b[l] = true;
				b[i] = v;
				b[h] = true;
				if (f.p.treeGridModel === "adjacency") b[d] = e;
				if (f.p.treeGridModel === "nested") {
					var x;
					if (e !== null) {
						h = parseInt(j[m], 10);
						i = a.jgrid.from(f.p.data);
						i = i.greaterOrEquals(m, h, {
							stype: "integer"
						});
						i = i.select();
						if (i.length) for (x in i) {
							i[x][k] = i[x][k] > h ? parseInt(i[x][k], 10) + 2 : i[x][k];
							i[x][m] = i[x][m] >= h ? parseInt(i[x][m], 10) + 2 : i[x][m]
						}
						b[k] = h;
						b[m] = h + 1
					} else {
						h = parseInt(a(f).jqGrid("getCol", m, false, "max"), 10);
						i = a.jgrid.from(f.p.data).greater(k, h, {
							stype: "integer"
						}).select();
						if (i.length) for (x in i) i[x][k] = parseInt(i[x][k], 10) + 2;
						i = a.jgrid.from(f.p.data).greater(m, h, {
							stype: "integer"
						}).select();
						if (i.length) for (x in i) i[x][m] = parseInt(i[x][m], 10) + 2;
						b[k] = h + 1;
						b[m] = h + 2
					}
				}
				if (e === null || a(f).jqGrid("isNodeLoaded", j) || q) {
					a(f).jqGrid("addRowData", c, b, n, p);
					a(f).jqGrid("setTreeNode", r, o)
				}
				j && !j[g] && a(f.rows[u]).find("div.treeclick").click()
			}
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.extend({
		groupingSetup: function () {
			return this.each(function () {
				var c = this.p.groupingView;
				if (c !== null && (typeof c === "object" || a.isFunction(c))) if (c.groupField.length) {
					if (typeof c.visibiltyOnNextGrouping == "undefined") c.visibiltyOnNextGrouping = [];
					for (var e = 0; e < c.groupField.length; e++) {
						c.groupOrder[e] || (c.groupOrder[e] = "asc");
						c.groupText[e] || (c.groupText[e] = "{0}");
						if (typeof c.groupColumnShow[e] != "boolean") c.groupColumnShow[e] = true;
						if (typeof c.groupSummary[e] != "boolean") c.groupSummary[e] = false;
						if (c.groupColumnShow[e] === true) {
							c.visibiltyOnNextGrouping[e] = true;
							a(this).jqGrid("showCol", c.groupField[e])
						} else {
							c.visibiltyOnNextGrouping[e] = a("#" + this.p.id + "_" + c.groupField[e]).is(":visible");
							a(this).jqGrid("hideCol", c.groupField[e])
						}
						c.sortitems[e] = [];
						c.sortnames[e] = [];
						c.summaryval[e] = [];
						if (c.groupSummary[e]) {
							c.summary[e] = [];
							for (var b = this.p.colModel, f = 0, g = b.length; f < g; f++) b[f].summaryType && c.summary[e].push({
								nm: b[f].name,
								st: b[f].summaryType,
								v: ""
							})
						}
					}
					this.p.scroll = false;
					this.p.rownumbers = false;
					this.p.subGrid = false;
					this.p.treeGrid = false;
					this.p.gridview = true
				} else this.p.grouping = false;
				else this.p.grouping = false
			})
		},
		groupingPrepare: function (c, e, b, f) {
			this.each(function () {
				e[0] += "";
				var g = e[0].toString().split(" ").join(""),
                    h = this.p.groupingView,
                    i = this;
				if (b.hasOwnProperty(g)) b[g].push(c);
				else {
					b[g] = [];
					b[g].push(c);
					h.sortitems[0].push(g);
					h.sortnames[0].push(a.trim(e[0].toString()));
					h.summaryval[0][g] = a.extend(true, [], h.summary[0])
				}
				h.groupSummary[0] && a.each(h.summaryval[0][g], function () {
					this.v = a.isFunction(this.st) ? this.st.call(i, this.v, this.nm, f) : a(i).jqGrid("groupingCalculations." + this.st, this.v, this.nm, f)
				})
			});
			return b
		},
		groupingToggle: function (c) {
			this.each(function () {
				var e = this.p.groupingView,
                    b = c.lastIndexOf("_"),
                    f = c.substring(0, b + 1);
				b = parseInt(c.substring(b + 1), 10) + 1;
				var g = e.minusicon,
                    h = e.plusicon,
                    i = a("#" + c);
				i = i.length ? i[0].nextSibling : null;
				var d = a("#" + c + " span.tree-wrap-" + this.p.direction),
                    k = false;
				if (d.hasClass(g)) {
					if (e.showSummaryOnHide && e.groupSummary[0]) {
						if (i) for (; i; ) {
							if (a(i).hasClass("jqfoot")) break;
							a(i).hide();
							i = i.nextSibling
						}
					} else if (i) for (; i; ) {
						if (a(i).attr("id") == f + String(b)) break;
						a(i).hide();
						i = i.nextSibling
					}
					d.removeClass(g).addClass(h);
					k = true
				} else {
					if (i) for (; i; ) {
						if (a(i).attr("id") == f + String(b)) break;
						a(i).show();
						i = i.nextSibling
					}
					d.removeClass(h).addClass(g)
				}
				a.isFunction(this.p.onClickGroup) && this.p.onClickGroup.call(this, c, k)
			});
			return false
		},
		groupingRender: function (c, e) {
			return this.each(function () {
				var b = this,
                    f = b.p.groupingView,
                    g = "",
                    h = "",
                    i, d = f.groupCollapse ? f.plusicon : f.minusicon,
                    k, m, l;
				if (!f.groupDataSorted) {
					f.sortitems[0].sort();
					f.sortnames[0].sort();
					if (f.groupOrder[0].toLowerCase() == "desc") {
						f.sortitems[0].reverse();
						f.sortnames[0].reverse()
					}
				}
				d += " tree-wrap-" + b.p.direction;
				for (l = 0; l < e; ) {
					if (b.p.colModel[l].name == f.groupField[0]) {
						m = l;
						break
					}
					l++
				}
				a.each(f.sortitems[0], function (n, o) {
					i = b.p.id + "ghead_" + n;
					h = "<span style='cursor:pointer;' class='ui-icon " + d + "' onclick=\"jQuery('#" + b.p.id + "').jqGrid('groupingToggle','" + i + "');return false;\"></span>";
					try {
						k = b.formatter(i, f.sortnames[0][n], m, f.sortitems[0])
					} catch (j) {
						k = f.sortnames[0][n]
					}
					g += '<tr id="' + i + '" role="row" class= "ui-widget-content jqgroup ui-row-' + b.p.direction + '"><td colspan="' + e + '">' + h + a.jgrid.format(f.groupText[0], k, c[o].length) + "</td></tr>";
					for (var v = 0; v < c[o].length; v++) g += c[o][v].join("");
					if (f.groupSummary[0]) {
						v = "";
						if (f.groupCollapse && !f.showSummaryOnHide) v = ' style="display:none;"';
						g += "<tr" + v + ' role="row" class="ui-widget-content jqfoot ui-row-' + b.p.direction + '">';
						v = f.summaryval[0][o];
						for (var r = b.p.colModel, p, q = c[o].length, u = 0; u < e; u++) {
							var x = "<td " + b.formatCol(u, 1, "") + ">&#160;</td>",
                                D = "{0}";
							a.each(v, function () {
								if (this.nm == r[u].name) {
									if (r[u].summaryTpl) D = r[u].summaryTpl;
									if (this.st == "avg") if (this.v && q > 0) this.v /= q;
									try {
										p = b.formatter("", this.v, u, this)
									} catch (C) {
										p = this.v
									}
									x = "<td " + b.formatCol(u, 1, "") + ">" + a.jgrid.format(D, p) + "</td>";
									return false
								}
							});
							g += x
						}
						g += "</tr>"
					}
				});
				a("#" + b.p.id + " tbody:first").append(g);
				g = null
			})
		},
		groupingGroupBy: function (c, e) {
			return this.each(function () {
				if (typeof c == "string") c = [c];
				var b = this.p.groupingView;
				this.p.grouping = true;
				if (typeof b.visibiltyOnNextGrouping == "undefined") b.visibiltyOnNextGrouping = [];
				var f;
				for (f = 0; f < b.groupField.length; f++) !b.groupColumnShow[f] && b.visibiltyOnNextGrouping[f] && a(this).jqGrid("showCol", b.groupField[f]);
				for (f = 0; f < c.length; f++) b.visibiltyOnNextGrouping[f] = a("#" + this.p.id + "_" + c[f]).is(":visible");
				this.p.groupingView = a.extend(this.p.groupingView, e || {});
				b.groupField = c;
				a(this).trigger("reloadGrid")
			})
		},
		groupingRemove: function (c) {
			return this.each(function () {
				if (typeof c == "undefined") c = true;
				this.p.grouping = false;
				if (c === true) {
					for (var e = this.p.groupingView, b = 0; b < e.groupField.length; b++) !e.groupColumnShow[b] && e.visibiltyOnNextGrouping[b] && a(this).jqGrid("showCol", e.groupField);
					a("tr.jqgroup, tr.jqfoot", "#" + this.p.id + " tbody:first").remove();
					a("tr.jqgrow:hidden", "#" + this.p.id + " tbody:first").show()
				} else a(this).trigger("reloadGrid")
			})
		},
		groupingCalculations: {
			sum: function (c, e, b) {
				return parseFloat(c || 0) + parseFloat(b[e] || 0)
			},
			min: function (c, e, b) {
				if (c === "") return parseFloat(b[e] || 0);
				return Math.min(parseFloat(c), parseFloat(b[e] || 0))
			},
			max: function (c, e, b) {
				if (c === "") return parseFloat(b[e] || 0);
				return Math.max(parseFloat(c), parseFloat(b[e] || 0))
			},
			count: function (c, e, b) {
				if (c === "") c = 0;
				return b.hasOwnProperty(e) ? c + 1 : 0
			},
			avg: function (c, e, b) {
				return parseFloat(c || 0) + parseFloat(b[e] || 0)
			}
		}
	})
})(jQuery);
(function (a) {
	a.jgrid.extend({
		jqGridImport: function (c) {
			c = a.extend({
				imptype: "xml",
				impstring: "",
				impurl: "",
				mtype: "GET",
				impData: {},
				xmlGrid: {
					config: "roots>grid",
					data: "roots>rows"
				},
				jsonGrid: {
					config: "grid",
					data: "data"
				},
				ajaxOptions: {}
			}, c || {});
			return this.each(function () {
				var e = this,
                    b = function (h, i) {
                    	var d = a(i.xmlGrid.config, h)[0],
                            k = a(i.xmlGrid.data, h)[0],
                            m;
                    	if (xmlJsonClass.xml2json && a.jgrid.parse) {
                    		d = xmlJsonClass.xml2json(d, " ");
                    		d = a.jgrid.parse(d);
                    		for (var l in d) if (d.hasOwnProperty(l)) m = d[l];
                    		if (k) {
                    			k = d.grid.datatype;
                    			d.grid.datatype = "xmlstring";
                    			d.grid.datastr = h;
                    			a(e).jqGrid(m).jqGrid("setGridParam", {
                    				datatype: k
                    			})
                    		} else a(e).jqGrid(m)
                    	} else alert("xml2json or parse are not present")
                    },
                    f = function (h, i) {
                    	if (h && typeof h == "string") {
                    		var d = a.jgrid.parse(h),
                                k = d[i.jsonGrid.config];
                    		if (d = d[i.jsonGrid.data]) {
                    			var m = k.datatype;
                    			k.datatype = "jsonstring";
                    			k.datastr = d;
                    			a(e).jqGrid(k).jqGrid("setGridParam", {
                    				datatype: m
                    			})
                    		} else a(e).jqGrid(k)
                    	}
                    };
				switch (c.imptype) {
					case "xml":
						a.ajax(a.extend({
							url: c.impurl,
							type: c.mtype,
							data: c.impData,
							dataType: "xml",
							complete: function (h, i) {
								if (i == "success") {
									b(h.responseXML, c);
									a.isFunction(c.importComplete) && c.importComplete(h)
								}
							}
						}, c.ajaxOptions));
						break;
					case "xmlstring":
						if (c.impstring && typeof c.impstring == "string") {
							var g = a.jgrid.stringToDoc(c.impstring);
							if (g) {
								b(g, c);
								a.isFunction(c.importComplete) && c.importComplete(g);
								c.impstring = null
							}
							g = null
						}
						break;
					case "json":
						a.ajax(a.extend({
							url: c.impurl,
							type: c.mtype,
							data: c.impData,
							dataType: "json",
							complete: function (h, i) {
								if (i == "success") {
									f(h.responseText, c);
									a.isFunction(c.importComplete) && c.importComplete(h)
								}
							}
						}, c.ajaxOptions));
						break;
					case "jsonstring":
						if (c.impstring && typeof c.impstring == "string") {
							f(c.impstring, c);
							a.isFunction(c.importComplete) && c.importComplete(c.impstring);
							c.impstring = null
						}
				}
			})
		},
		jqGridExport: function (c) {
			c = a.extend({
				exptype: "xmlstring",
				root: "grid",
				ident: "\t"
			}, c || {});
			var e = null;
			this.each(function () {
				if (this.grid) {
					var b = a.extend({}, a(this).jqGrid("getGridParam"));
					if (b.rownumbers) {
						b.colNames.splice(0, 1);
						b.colModel.splice(0, 1)
					}
					if (b.multiselect) {
						b.colNames.splice(0, 1);
						b.colModel.splice(0, 1)
					}
					if (b.subGrid) {
						b.colNames.splice(0, 1);
						b.colModel.splice(0, 1)
					}
					b.knv = null;
					if (b.treeGrid) for (var f in b.treeReader) if (b.treeReader.hasOwnProperty(f)) {
						b.colNames.splice(b.colNames.length - 1);
						b.colModel.splice(b.colModel.length - 1)
					}
					switch (c.exptype) {
						case "xmlstring":
							e = "<" + c.root + ">" + xmlJsonClass.json2xml(b, c.ident) + "</" + c.root + ">";
							break;
						case "jsonstring":
							e = "{" + xmlJsonClass.toJson(b, c.root, c.ident, false) + "}";
							if (b.postData.filters !== undefined) {
								e = e.replace(/filters":"/, 'filters":');
								e = e.replace(/}]}"/, "}]}")
							}
					}
				}
			});
			return e
		},
		excelExport: function (c) {
			c = a.extend({
				exptype: "remote",
				url: null,
				oper: "oper",
				tag: "excel",
				exportOptions: {}
			}, c || {});
			return this.each(function () {
				if (this.grid) {
					var e;
					if (c.exptype == "remote") {
						e = a.extend({}, this.p.postData);
						e[c.oper] = c.tag;
						e = jQuery.param(e);
						e = c.url.indexOf("?") != -1 ? c.url + "&" + e : c.url + "?" + e;
						window.location = e
					}
				}
			})
		}
	})
})(jQuery);
(function (a) {
	if (a.browser.msie && a.browser.version == 8) a.expr[":"].hidden = function (e) {
		return e.offsetWidth === 0 || e.offsetHeight === 0 || e.style.display == "none"
	};
	a.jgrid._multiselect = false;
	if (a.ui) if (a.ui.multiselect) {
		if (a.ui.multiselect.prototype._setSelected) {
			var c = a.ui.multiselect.prototype._setSelected;
			a.ui.multiselect.prototype._setSelected = function (e, b) {
				var f = c.call(this, e, b);
				if (b && this.selectedList) {
					var g = this.element;
					this.selectedList.find("li").each(function () {
						a(this).data("optionLink") && a(this).data("optionLink").remove().appendTo(g)
					})
				}
				return f
			}
		}
		if (a.ui.multiselect.prototype.destroy) a.ui.multiselect.prototype.destroy = function () {
			this.element.show();
			this.container.remove();
			a.Widget === undefined ? a.widget.prototype.destroy.apply(this, arguments) : a.Widget.prototype.destroy.apply(this, arguments)
		};
		a.jgrid._multiselect = true
	}
	a.jgrid.extend({
		sortableColumns: function (e) {
			return this.each(function () {
				function b() {
					f.p.disableClick = true
				}
				var f = this,
                    g = f.p.id;
				g = {
					tolerance: "pointer",
					axis: "x",
					scrollSensitivity: "1",
					items: ">th:not(:has(#jqgh_" + g + "_cb,#jqgh_" + g + "_rn,#jqgh_" + g + "_subgrid),:hidden)",
					placeholder: {
						element: function (i) {
							return a(document.createElement(i[0].nodeName)).addClass(i[0].className + " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]
						},
						update: function (i, d) {
							d.height(i.currentItem.innerHeight() - parseInt(i.currentItem.css("paddingTop") || 0, 10) - parseInt(i.currentItem.css("paddingBottom") || 0, 10));
							d.width(i.currentItem.innerWidth() - parseInt(i.currentItem.css("paddingLeft") || 0, 10) - parseInt(i.currentItem.css("paddingRight") || 0, 10))
						}
					},
					update: function (i, d) {
						var k = a(d.item).parent();
						k = a(">th", k);
						var m = {},
                            l = f.p.id + "_";
						a.each(f.p.colModel, function (o) {
							m[this.name] = o
						});
						var n = [];
						k.each(function () {
							var o = a(">div", this).get(0).id.replace(/^jqgh_/, "").replace(l, "");
							o in m && n.push(m[o])
						});
						a(f).jqGrid("remapColumns", n, true, true);
						a.isFunction(f.p.sortable.update) && f.p.sortable.update(n);
						setTimeout(function () {
							f.p.disableClick = false
						}, 50)
					}
				};
				if (f.p.sortable.options) a.extend(g, f.p.sortable.options);
				else if (a.isFunction(f.p.sortable)) f.p.sortable = {
					update: f.p.sortable
				};
				if (g.start) {
					var h = g.start;
					g.start = function (i, d) {
						b();
						h.call(this, i, d)
					}
				} else g.start = b;
				if (f.p.sortable.exclude) g.items += ":not(" + f.p.sortable.exclude + ")";
				e.sortable(g).data("sortable").floating = true
			})
		},
		columnChooser: function (e) {
			function b(n, o) {
				if (n) if (typeof n == "string") a.fn[n] && a.fn[n].apply(o, a.makeArray(arguments).slice(2));
				else a.isFunction(n) && n.apply(o, a.makeArray(arguments).slice(2))
			}
			var f = this;
			if (!a("#colchooser_" + f[0].p.id).length) {
				var g = a('<div id="colchooser_' + f[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),
                    h = a("select", g);
				e = a.extend({
					width: 420,
					height: 240,
					classname: null,
					done: function (n) {
						n && f.jqGrid("remapColumns", n, true)
					},
					msel: "multiselect",
					dlog: "dialog",
					dlog_opts: function (n) {
						var o = {};
						o[n.bSubmit] = function () {
							n.apply_perm();
							n.cleanup(false)
						};
						o[n.bCancel] = function () {
							n.cleanup(true)
						};
						return {
							buttons: o,
							close: function () {
								n.cleanup(true)
							},
							modal: n.modal ? n.modal : false,
							resizable: n.resizable ? n.resizable : true,
							width: n.width + 20
						}
					},
					apply_perm: function () {
						a("option", h).each(function () {
							this.selected ? f.jqGrid("showCol", i[this.value].name) : f.jqGrid("hideCol", i[this.value].name)
						});
						var n = [];
						a("option:selected", h).each(function () {
							n.push(parseInt(this.value, 10))
						});
						a.each(n, function () {
							delete k[i[parseInt(this, 10)].name]
						});
						a.each(k, function () {
							var o = parseInt(this, 10);
							var j = n,
                                v = o;
							if (v >= 0) {
								var r = j.slice(),
                                    p = r.splice(v, Math.max(j.length - v, v));
								if (v > j.length) v = j.length;
								r[v] = o;
								n = r.concat(p)
							} else n = void 0
						});
						e.done && e.done.call(f, n)
					},
					cleanup: function (n) {
						b(e.dlog, g, "destroy");
						b(e.msel, h, "destroy");
						g.remove();
						n && e.done && e.done.call(f)
					},
					msel_opts: {}
				}, a.jgrid.col, e || {});
				if (a.ui) if (a.ui.multiselect) if (e.msel == "multiselect") {
					if (!a.jgrid._multiselect) {
						alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
						return
					}
					e.msel_opts = a.extend(a.ui.multiselect.defaults, e.msel_opts)
				}
				e.caption && g.attr("title", e.caption);
				if (e.classname) {
					g.addClass(e.classname);
					h.addClass(e.classname)
				}
				if (e.width) {
					a(">div", g).css({
						width: e.width,
						margin: "0 auto"
					});
					h.css("width", e.width)
				}
				if (e.height) {
					a(">div", g).css("height", e.height);
					h.css("height", e.height - 10)
				}
				var i = f.jqGrid("getGridParam", "colModel"),
                    d = f.jqGrid("getGridParam", "colNames"),
                    k = {},
                    m = [];
				h.empty();
				a.each(i, function (n) {
					k[this.name] = n;
					if (this.hidedlg) this.hidden || m.push(n);
					else h.append("<option value='" + n + "' " + (this.hidden ? "" : "selected='selected'") + ">" + d[n] + "</option>")
				});
				var l = a.isFunction(e.dlog_opts) ? e.dlog_opts.call(f, e) : e.dlog_opts;
				b(e.dlog, g, l);
				l = a.isFunction(e.msel_opts) ? e.msel_opts.call(f, e) : e.msel_opts;
				b(e.msel, h, l)
			}
		},
		sortableRows: function (e) {
			return this.each(function () {
				var b = this;
				if (b.grid) if (!b.p.treeGrid) if (a.fn.sortable) {
					e = a.extend({
						cursor: "move",
						axis: "y",
						items: ".jqgrow"
					}, e || {});
					if (e.start && a.isFunction(e.start)) {
						e._start_ = e.start;
						delete e.start
					} else e._start_ = false;
					if (e.update && a.isFunction(e.update)) {
						e._update_ = e.update;
						delete e.update
					} else e._update_ = false;
					e.start = function (f, g) {
						a(g.item).css("border-width", "0px");
						a("td", g.item).each(function (d) {
							this.style.width = b.grid.cols[d].style.width
						});
						if (b.p.subGrid) {
							var h = a(g.item).attr("id");
							try {
								a(b).jqGrid("collapseSubGridRow", h)
							} catch (i) { }
						}
						e._start_ && e._start_.apply(this, [f, g])
					};
					e.update = function (f, g) {
						a(g.item).css("border-width", "");
						b.p.rownumbers === true && a("td.jqgrid-rownum", b.rows).each(function (h) {
							a(this).html(h + 1 + (parseInt(b.p.page, 10) - 1) * parseInt(b.p.rowNum, 10))
						});
						e._update_ && e._update_.apply(this, [f, g])
					};
					a("tbody:first", b).sortable(e);
					a("tbody:first", b).disableSelection()
				}
			})
		},
		gridDnD: function (e) {
			return this.each(function () {
				function b() {
					var h = a.data(f, "dnd");
					a("tr.jqgrow:not(.ui-draggable)", f).draggable(a.isFunction(h.drag) ? h.drag.call(a(f), h) : h.drag)
				}
				var f = this;
				if (f.grid) if (!f.p.treeGrid) if (a.fn.draggable && a.fn.droppable) {
					a("#jqgrid_dnd").html() === null && a("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>");
					if (typeof e == "string" && e == "updateDnD" && f.p.jqgdnd === true) b();
					else {
						e = a.extend({
							drag: function (h) {
								return a.extend({
									start: function (i, d) {
										if (f.p.subGrid) {
											var k = a(d.helper).attr("id");
											try {
												a(f).jqGrid("collapseSubGridRow", k)
											} catch (m) { }
										}
										for (k = 0; k < a.data(f, "dnd").connectWith.length; k++) a(a.data(f, "dnd").connectWith[k]).jqGrid("getGridParam", "reccount") == "0" && a(a.data(f, "dnd").connectWith[k]).jqGrid("addRowData", "jqg_empty_row", {});
										d.helper.addClass("ui-state-highlight");
										a("td", d.helper).each(function (l) {
											this.style.width = f.grid.headers[l].width + "px"
										});
										h.onstart && a.isFunction(h.onstart) && h.onstart.call(a(f), i, d)
									},
									stop: function (i, d) {
										if (d.helper.dropped && !h.dragcopy) {
											var k = a(d.helper).attr("id");
											a(f).jqGrid("delRowData", k)
										}
										for (k = 0; k < a.data(f, "dnd").connectWith.length; k++) a(a.data(f, "dnd").connectWith[k]).jqGrid("delRowData", "jqg_empty_row");
										h.onstop && a.isFunction(h.onstop) && h.onstop.call(a(f), i, d)
									}
								}, h.drag_opts || {})
							},
							drop: function (h) {
								return a.extend({
									accept: function (i) {
										if (!a(i).hasClass("jqgrow")) return i;
										i = a(i).closest("table.ui-jqgrid-btable");
										if (i.length > 0 && a.data(i[0], "dnd") !== undefined) {
											i = a.data(i[0], "dnd").connectWith;
											return a.inArray("#" + this.id, i) != -1 ? true : false
										}
										return false
									},
									drop: function (i, d) {
										if (a(d.draggable).hasClass("jqgrow")) {
											var k = a(d.draggable).attr("id");
											k = d.draggable.parent().parent().jqGrid("getRowData", k);
											if (!h.dropbyname) {
												var m = 0,
                                                    l = {},
                                                    n, o = a("#" + this.id).jqGrid("getGridParam", "colModel");
												try {
													for (var j in k) {
														if (k.hasOwnProperty(j) && o[m]) {
															n = o[m].name;
															l[n] = k[j]
														}
														m++
													}
													k = l
												} catch (v) { }
											}
											d.helper.dropped = true;
											if (h.beforedrop && a.isFunction(h.beforedrop)) {
												n = h.beforedrop.call(this, i, d, k, a("#" + f.id), a(this));
												if (typeof n != "undefined" && n !== null && typeof n == "object") k = n
											}
											if (d.helper.dropped) {
												var r;
												if (h.autoid) if (a.isFunction(h.autoid)) r = h.autoid.call(this, k);
												else {
													r = Math.ceil(Math.random() * 1E3);
													r = h.autoidprefix + r
												}
												a("#" + this.id).jqGrid("addRowData", r, k, h.droppos)
											}
											h.ondrop && a.isFunction(h.ondrop) && h.ondrop.call(this, i, d, k)
										}
									}
								}, h.drop_opts || {})
							},
							onstart: null,
							onstop: null,
							beforedrop: null,
							ondrop: null,
							drop_opts: {
								activeClass: "ui-state-active",
								hoverClass: "ui-state-hover"
							},
							drag_opts: {
								revert: "invalid",
								helper: "clone",
								cursor: "move",
								appendTo: "#jqgrid_dnd",
								zIndex: 5E3
							},
							dragcopy: false,
							dropbyname: false,
							droppos: "first",
							autoid: true,
							autoidprefix: "dnd_"
						}, e || {});
						if (e.connectWith) {
							e.connectWith = e.connectWith.split(",");
							e.connectWith = a.map(e.connectWith, function (h) {
								return a.trim(h)
							});
							a.data(f, "dnd", e);
							f.p.reccount != "0" && !f.p.jqgdnd && b();
							f.p.jqgdnd = true;
							for (var g = 0; g < e.connectWith.length; g++) a(e.connectWith[g]).droppable(a.isFunction(e.drop) ? e.drop.call(a(f), e) : e.drop)
						}
					}
				}
			})
		},
		gridResize: function (e) {
			return this.each(function () {
				var b = this;
				if (b.grid && a.fn.resizable) {
					e = a.extend({}, e || {});
					if (e.alsoResize) {
						e._alsoResize_ = e.alsoResize;
						delete e.alsoResize
					} else e._alsoResize_ = false;
					if (e.stop && a.isFunction(e.stop)) {
						e._stop_ = e.stop;
						delete e.stop
					} else e._stop_ = false;
					e.stop = function (f, g) {
						a(b).jqGrid("setGridParam", {
							height: a("#gview_" + b.p.id + " .ui-jqgrid-bdiv").height()
						});
						a(b).jqGrid("setGridWidth", g.size.width, e.shrinkToFit);
						e._stop_ && e._stop_.call(b, f, g)
					};
					e.alsoResize = e._alsoResize_ ? eval("(" + ("{'#gview_" + b.p.id + " .ui-jqgrid-bdiv':true,'" + e._alsoResize_ + "':true}") + ")") : a(".ui-jqgrid-bdiv", "#gview_" + b.p.id);
					delete e._alsoResize_;
					a("#gbox_" + b.p.id).resizable(e)
				}
			})
		}
	})
})(jQuery);

function tableToGrid(a, c) {
	jQuery(a).each(function () {
		if (!this.grid) {
			jQuery(this).width("99%");
			var e = jQuery(this).width(),
                b = jQuery("tr td:first-child input[type=checkbox]:first", jQuery(this)),
                f = jQuery("tr td:first-child input[type=radio]:first", jQuery(this));
			b = b.length > 0;
			f = !b && f.length > 0;
			var g = b || f,
                h = [],
                i = [];
			jQuery("th", jQuery(this)).each(function () {
				if (h.length === 0 && g) {
					h.push({
						name: "__selection__",
						index: "__selection__",
						width: 0,
						hidden: true
					});
					i.push("__selection__")
				} else {
					h.push({
						name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
						index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
						width: jQuery(this).width() || 150
					});
					i.push(jQuery(this).html())
				}
			});
			var d = [],
                k = [],
                m = [];
			jQuery("tbody > tr", jQuery(this)).each(function () {
				var l = {},
                    n = 0;
				jQuery("td", jQuery(this)).each(function () {
					if (n === 0 && g) {
						var o = jQuery("input", jQuery(this)),
                            j = o.attr("value");
						k.push(j || d.length);
						o.is(":checked") && m.push(j);
						l[h[n].name] = o.attr("value")
					} else l[h[n].name] = jQuery(this).html();
					n++
				});
				n > 0 && d.push(l)
			});
			jQuery(this).empty();
			jQuery(this).addClass("scroll");
			jQuery(this).jqGrid(jQuery.extend({
				datatype: "local",
				width: e,
				colNames: i,
				colModel: h,
				multiselect: b
			}, c || {}));
			for (e = 0; e < d.length; e++) {
				f = null;
				if (k.length > 0) if ((f = k[e]) && f.replace) f = encodeURIComponent(f).replace(/[.\-%]/g, "_");
				if (f === null) f = e + 1;
				jQuery(this).jqGrid("addRowData", f, d[e])
			}
			for (e = 0; e < m.length; e++) jQuery(this).jqGrid("setSelection", m[e])
		}
	})
};