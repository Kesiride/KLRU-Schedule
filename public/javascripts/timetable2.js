"use strict";
var Timetable = function() {
    this.scope = {
        hourStart: 9,
        hourEnd: 17
    }, this.locations = [], this.events = []
};
Timetable.Renderer = function(t) {
        if (!(t instanceof Timetable)) throw new Error("Initialize renderer using a Timetable");
        this.timetable = t
    },
    function() {
        function t(t, n) {
            return e(t) && e(n)
        }

        function e(t) {
            return n(t) && o(t)
        }

        function n(t) {
            return t === parseInt(t, 10)
        }

        function o(t) {
            return t >= 0 && t < 24
        }

        function r(t, e) {
            return e.indexOf(t) !== -1
        }

        function i(t, e) {
            var n = t instanceof Date && e instanceof Date,
                o = t < e;
            return n && o
        }

        function a(t, e) {
            return e >= t ? e - t : 24 + e - t
        }

        function c(t) {
            for (; t.firstChild;) t.removeChild(t.firstChild)
        }

        function s(t) {
            var e = t < 10 ? "0" : "";
            return e + t + ":00"
        }
        Timetable.prototype = {
            setScope: function(e, n) {
                if (!t(e, n)) throw new RangeError("Timetable scope should consist of (start, end) in whole hours from 0 to 23");
                return this.scope.hourStart = e, this.scope.hourEnd = n, this
            },
            addLocations: function(t) {
                function e() {
                    return t instanceof Array
                }
                var n = this.locations;
                if (!e()) throw new Error("Tried to add locations in wrong format");
                return t.forEach(function(t) {
                    if (r(t, n)) throw new Error("Location already exists");
                    n.push(t)
                }), this
            },
            addEvent: function(t, e, n, o, showID, programID, type, a) {
                console.log("Title: " + t);
                console.log("Show: " + showID);
                console.log("Program: " + programID);
                console.log("Type: " + type);
                console.log("--------------------");
                if (!r(e, this.locations)) throw new Error("Unknown location");
                if (!i(n, o)) throw new Error("Invalid time range: " + JSON.stringify([n, o]));
                var c = "[object Object]" === Object.prototype.toString.call(a);
                return this.events.push({
                    name: t,
                    location: e,
                    startDate: n,
                    endDate: o,
                    show: showID,
                    program: programID,
                    programType: type,
                    options: c ? a : void 0,
                }), this
            }
        }, Timetable.Renderer.prototype = {
            draw: function(t) {
                function e(t) {
                    if (null === t) throw new Error("Timetable container not found")
                }

                function n(t) {
                    var e = t.appendChild(document.createElement("aside")),
                        n = e.appendChild(document.createElement("ul"));
                    o(n)
                }

                function o(t) {
                    for (var e = 0; e < f.locations.length; e++) {
                        var n = t.appendChild(document.createElement("li")),
                            o = n.appendChild(document.createElement("span"));
                        o.className = "row-heading", o.textContent = f.locations[e]
                    }
                }

                function r(t) {
                    var e = t.appendChild(document.createElement("section")),
                        n = e.appendChild(document.createElement("time"));
                    i(n), l(n)
                }

                function i(t) {
                    for (var e = t.appendChild(document.createElement("header")), n = e.appendChild(document.createElement("ul")), o = !1, r = !1, i = f.scope.hourStart; !o;) {
                        var a = n.appendChild(document.createElement("li")),
                            c = a.appendChild(document.createElement("span"));
                        c.className = "time-label", c.textContent = s(i), i !== f.scope.hourEnd || f.scope.hourStart === f.scope.hourEnd && !r || (o = !0), 24 === ++i && (i = 0, r = !0)
                    }
                }

                function l(t) {
                    var e = t.appendChild(document.createElement("ul"));
                    e.className = "room-timeline";
                    for (var n = 0; n < f.locations.length; n++) {
                        var o = e.appendChild(document.createElement("li"));
                        u(f.locations[n], o)
                    }
                }

                function u(t, e) {
                    for (var n = 0; n < f.events.length; n++) {
                        var o = f.events[n];
                        o.location === t && d(o, e)
                    }
                }

                function d(t, e) {
                    var n, o, r = void 0 !== t.options,
                        i = !1;
                    r && (n = void 0 !== t.options.url, o = void 0 !== t.options["class"], i = void 0 !== t.options.data);
                    var a = n ? "a" : "span",
                        link = e.appendChild(document.createElement("a"))
                        c = link.appendChild(document.createElement(a)),
                        s = c.appendChild(document.createElement("small"));
                    if (c.title = t.name, n && (c.href = t.options.url), i)
                        for (var l in t.options.data) c.setAttribute("data-" + l, t.options.data[l]);
                    link.href = "/schedule/show/" + t.program, c.className = o ? "time-entry " + t.options["class"] : "time-entry", c.style.width = h(t), c.style.left = m(t), s.textContent = t.name
                }

                function h(t) {
                    var e = t.startDate,
                        n = t.endDate,
                        o = p(e, n);
                    return o / v * 100 + "%"
                }

                function p(t, e) {
                    return (e.getTime() - t.getTime()) / 1e3 / 60 / 60
                }

                function m(t) {
                    var e = f.scope.hourStart,
                        n = t.startDate.getHours() + t.startDate.getMinutes() / 60,
                        o = a(e, n);
                    return o / v * 100 + "%"
                }
                var f = this.timetable,
                    v = a(f.scope.hourStart, f.scope.hourEnd),
                    E = document.querySelector(t);
                e(E), c(E), n(E), r(E)
            }
        }
    }();