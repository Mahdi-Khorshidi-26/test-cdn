/*!
 * Built with http://stenciljs.com
 * 2025-05-05T14:06:35
 */
!(function (e, t, n, r, o, s, c, i, u, a, p, l, m, d) {
  for (
    p = e.mycomponent = e.mycomponent || {},
      (l = t.createElement("style")).innerHTML =
        u + "{visibility:hidden}.hydrated{visibility:inherit}",
      l.setAttribute("data-styles", ""),
      m = t.head.querySelector("meta[charset]"),
      t.head.insertBefore(l, m ? m.nextSibling : t.head.firstChild),
      (function (e, t, n) {
        (e["s-apps"] = e["s-apps"] || []).push("mycomponent"),
          n.componentOnReady ||
            (n.componentOnReady = function () {
              var t = this;
              function n(n) {
                if (t.nodeName.indexOf("-") > 0) {
                  for (var r = e["s-apps"], o = 0, s = 0; s < r.length; s++)
                    if (e[r[s]].componentOnReady) {
                      if (e[r[s]].componentOnReady(t, n)) return;
                      o++;
                    }
                  if (o < r.length)
                    return void (e["s-cr"] = e["s-cr"] || []).push([t, n]);
                }
                n(null);
              }
              return e.Promise ? new e.Promise(n) : { then: n };
            });
      })(e, 0, a),
      o = o || p.resourcesUrl,
      l = (m = t.querySelectorAll("script")).length - 1;
    l >= 0 && !(d = m[l]).src && !d.hasAttribute("data-resources-url");
    l--
  );
  (m = d.getAttribute("data-resources-url")),
    !o && m && (o = m),
    !o &&
      d.src &&
      (o =
        (m = d.src.split("/").slice(0, -1)).join("/") +
        (m.length ? "/" : "") +
        "mycomponent/"),
    (l = t.createElement("script")),
    (function (e, t, n, r) {
      return (
        !(t.search.indexOf("core=esm") > 0) &&
        (!(
          !(t.search.indexOf("core=es5") > 0 || "file:" === t.protocol) &&
          e.customElements &&
          e.customElements.define &&
          e.fetch &&
          e.CSS &&
          e.CSS.supports &&
          e.CSS.supports("color", "var(--c)") &&
          "noModule" in n
        ) ||
          (function (e) {
            try {
              return new Function('import("")'), !1;
            } catch (e) {}
            return !0;
          })())
      );
    })(e, e.location, l)
      ? (l.src = o + "mycomponent.ysckv8ow.js")
      : ((l.src = o + "mycomponent.wr0unhie.js"),
        l.setAttribute("type", "module"),
        l.setAttribute("crossorigin", !0)),
    l.setAttribute("data-resources-url", o),
    l.setAttribute("data-namespace", "mycomponent"),
    t.head.appendChild(l);
})(
  window,
  document,
  0,
  0,
  0,
  0,
  0,
  0,
  "uc-spinner,uc-stock-finder,uc-stock-price",
  HTMLElement.prototype
);
