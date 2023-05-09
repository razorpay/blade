/* eslint-disable */
/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+clike+javascript+jsx+tsx+typescript */
const _self =
  typeof window != 'undefined'
    ? window
    : typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope
    ? self
    : {};
const Prism = (function (e) {
  const n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  let t = 0;
  const r = {};
  var a = {
    manual: e.Prism && e.Prism.manual,
    disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
    util: {
      encode: function e(n) {
        return n instanceof i
          ? new i(n.type, e(n.content), n.alias)
          : Array.isArray(n)
          ? n.map(e)
          : n
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/\u00a0/g, ' ');
      },
      type: function (e) {
        return Object.prototype.toString.call(e).slice(8, -1);
      },
      objId: function (e) {
        return e.__id || Object.defineProperty(e, '__id', { value: ++t }), e.__id;
      },
      clone: function e(n, t) {
        let r, i;
        switch (((t = t || {}), a.util.type(n))) {
          case 'Object':
            if (((i = a.util.objId(n)), t[i])) return t[i];
            for (const l in ((r = {}), (t[i] = r), n)) n.hasOwnProperty(l) && (r[l] = e(n[l], t));
            return r;
          case 'Array':
            return (
              (i = a.util.objId(n)),
              t[i]
                ? t[i]
                : ((r = []),
                  (t[i] = r),
                  n.forEach(function (n, a) {
                    r[a] = e(n, t);
                  }),
                  r)
            );
          default:
            return n;
        }
      },
      getLanguage: function (e) {
        for (; e; ) {
          const t = n.exec(e.className);
          if (t) return t[1].toLowerCase();
          e = e.parentElement;
        }
        return 'none';
      },
      setLanguage: function (e, t) {
        (e.className = e.className.replace(RegExp(n, 'gi'), '')), e.classList.add(`language-${t}`);
      },
      currentScript: function () {
        if (typeof document == 'undefined') return null;
        if ('currentScript' in document) return document.currentScript;
        try {
          throw new Error();
        } catch (r) {
          const e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack) || [])[1];
          if (e) {
            const n = document.getElementsByTagName('script');
            for (const t in n) if (n[t].src == e) return n[t];
          }
          return null;
        }
      },
      isActive: function (e, n, t) {
        for (let r = `no-${n}`; e; ) {
          const a = e.classList;
          if (a.contains(n)) return !0;
          if (a.contains(r)) return !1;
          e = e.parentElement;
        }
        return !!t;
      },
    },
    languages: {
      plain: r,
      plaintext: r,
      text: r,
      txt: r,
      extend: function (e, n) {
        const t = a.util.clone(a.languages[e]);
        for (const r in n) t[r] = n[r];
        return t;
      },
      insertBefore: function (e, n, t, r) {
        const i = (r = r || a.languages)[e];
        const l = {};
        for (const o in i)
          if (i.hasOwnProperty(o)) {
            if (o == n) for (const s in t) t.hasOwnProperty(s) && (l[s] = t[s]);
            t.hasOwnProperty(o) || (l[o] = i[o]);
          }
        const u = r[e];
        return (
          (r[e] = l),
          a.languages.DFS(a.languages, function (n, t) {
            t === u && n != e && (this[n] = l);
          }),
          l
        );
      },
      DFS: function e(n, t, r, i) {
        i = i || {};
        const l = a.util.objId;
        for (const o in n)
          if (n.hasOwnProperty(o)) {
            t.call(n, o, n[o], r || o);
            const s = n[o];
            const u = a.util.type(s);
            u !== 'Object' || i[l(s)]
              ? u !== 'Array' || i[l(s)] || ((i[l(s)] = !0), e(s, t, o, i))
              : ((i[l(s)] = !0), e(s, t, null, i));
          }
      },
    },
    plugins: {},
    highlightAll: function (e, n) {
      a.highlightAllUnder(document, e, n);
    },
    highlightAllUnder: function (e, n, t) {
      const r = {
        callback: t,
        container: e,
        selector:
          'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
      };
      a.hooks.run('before-highlightall', r),
        (r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector))),
        a.hooks.run('before-all-elements-highlight', r);
      for (var i, l = 0; (i = r.elements[l++]); ) a.highlightElement(i, !0 === n, r.callback);
    },
    highlightElement: function (n, t, r) {
      const i = a.util.getLanguage(n);
      const l = a.languages[i];
      a.util.setLanguage(n, i);
      let o = n.parentElement;
      o && o.nodeName.toLowerCase() === 'pre' && a.util.setLanguage(o, i);
      const s = { element: n, language: i, grammar: l, code: n.textContent };
      function u(e) {
        (s.highlightedCode = e),
          a.hooks.run('before-insert', s),
          (s.element.innerHTML = s.highlightedCode),
          a.hooks.run('after-highlight', s),
          a.hooks.run('complete', s),
          r && r.call(s.element);
      }
      if (
        (a.hooks.run('before-sanity-check', s),
        (o = s.element.parentElement) &&
          o.nodeName.toLowerCase() === 'pre' &&
          !o.hasAttribute('tabindex') &&
          o.setAttribute('tabindex', '0'),
        !s.code)
      )
        return a.hooks.run('complete', s), void (r && r.call(s.element));
      if ((a.hooks.run('before-highlight', s), s.grammar))
        if (t && e.Worker) {
          const c = new Worker(a.filename);
          (c.onmessage = function (e) {
            u(e.data);
          }),
            c.postMessage(
              JSON.stringify({ language: s.language, code: s.code, immediateClose: !0 }),
            );
        } else u(a.highlight(s.code, s.grammar, s.language));
      else u(a.util.encode(s.code));
    },
    highlight: function (e, n, t) {
      const r = { code: e, grammar: n, language: t };
      if ((a.hooks.run('before-tokenize', r), !r.grammar))
        throw new Error(`The language "${r.language}" has no grammar.`);
      return (
        (r.tokens = a.tokenize(r.code, r.grammar)),
        a.hooks.run('after-tokenize', r),
        i.stringify(a.util.encode(r.tokens), r.language)
      );
    },
    tokenize: function (e, n) {
      const t = n.rest;
      if (t) {
        for (const r in t) n[r] = t[r];
        delete n.rest;
      }
      const a = new s();
      return (
        u(a, a.head, e),
        o(e, a, n, a.head, 0),
        (function (e) {
          for (var n = [], t = e.head.next; t !== e.tail; ) n.push(t.value), (t = t.next);
          return n;
        })(a)
      );
    },
    hooks: {
      all: {},
      add: function (e, n) {
        const t = a.hooks.all;
        (t[e] = t[e] || []), t[e].push(n);
      },
      run: function (e, n) {
        const t = a.hooks.all[e];
        if (t && t.length) for (var r, i = 0; (r = t[i++]); ) r(n);
      },
    },
    Token: i,
  };
  function i(e, n, t, r) {
    (this.type = e), (this.content = n), (this.alias = t), (this.length = 0 | (r || '').length);
  }
  function l(e, n, t, r) {
    e.lastIndex = n;
    const a = e.exec(t);
    if (a && r && a[1]) {
      const i = a[1].length;
      (a.index += i), (a[0] = a[0].slice(i));
    }
    return a;
  }
  function o(e, n, t, r, s, g) {
    for (const f in t)
      if (t.hasOwnProperty(f) && t[f]) {
        let h = t[f];
        h = Array.isArray(h) ? h : [h];
        for (let d = 0; d < h.length; ++d) {
          if (g && g.cause == `${f},${d}`) return;
          const v = h[d];
          const p = v.inside;
          const m = !!v.lookbehind;
          const y = !!v.greedy;
          const k = v.alias;
          if (y && !v.pattern.global) {
            const x = v.pattern.toString().match(/[imsuy]*$/)[0];
            v.pattern = RegExp(v.pattern.source, `${x}g`);
          }
          for (
            let b = v.pattern || v, w = r.next, A = s;
            w !== n.tail && !(g && A >= g.reach);
            A += w.value.length, w = w.next
          ) {
            let E = w.value;
            if (n.length > e.length) return;
            if (!(E instanceof i)) {
              var P;
              let L = 1;
              if (y) {
                if (!(P = l(b, A, e, m)) || P.index >= e.length) break;
                var S = P.index;
                const O = P.index + P[0].length;
                let j = A;
                for (j += w.value.length; S >= j; ) j += (w = w.next).value.length;
                if (((A = j -= w.value.length), w.value instanceof i)) continue;
                for (let C = w; C !== n.tail && (j < O || typeof C.value == 'string'); C = C.next)
                  L++, (j += C.value.length);
                L--, (E = e.slice(A, j)), (P.index -= A);
              } else if (!(P = l(b, 0, E, m))) continue;
              S = P.index;
              const N = P[0];
              const _ = E.slice(0, S);
              const M = E.slice(S + N.length);
              const W = A + E.length;
              g && W > g.reach && (g.reach = W);
              let z = w.prev;
              if (
                (_ && ((z = u(n, z, _)), (A += _.length)),
                c(n, z, L),
                (w = u(n, z, new i(f, p ? a.tokenize(N, p) : N, k, N))),
                M && u(n, w, M),
                L > 1)
              ) {
                const I = { cause: `${f},${d}`, reach: W };
                o(e, n, t, w.prev, A, I), g && I.reach > g.reach && (g.reach = I.reach);
              }
            }
          }
        }
      }
  }
  function s() {
    const e = { value: null, prev: null, next: null };
    const n = { value: null, prev: e, next: null };
    (e.next = n), (this.head = e), (this.tail = n), (this.length = 0);
  }
  function u(e, n, t) {
    const r = n.next;
    const a = { value: t, prev: n, next: r };
    return (n.next = a), (r.prev = a), e.length++, a;
  }
  function c(e, n, t) {
    for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
    (n.next = r), (r.prev = n), (e.length -= a);
  }
  if (
    ((e.Prism = a),
    (i.stringify = function e(n, t) {
      if (typeof n == 'string') return n;
      if (Array.isArray(n)) {
        let r = '';
        return (
          n.forEach(function (n) {
            r += e(n, t);
          }),
          r
        );
      }
      const i = {
        type: n.type,
        content: e(n.content, t),
        tag: 'span',
        classes: ['token', n.type],
        attributes: {},
        language: t,
      };
      const l = n.alias;
      l && (Array.isArray(l) ? Array.prototype.push.apply(i.classes, l) : i.classes.push(l)),
        a.hooks.run('wrap', i);
      let o = '';
      for (const s in i.attributes)
        o += ` ${s}="${(i.attributes[s] || '').replace(/"/g, '&quot;')}"`;
      return `<${i.tag} class="${i.classes.join(' ')}"${o}>${i.content}</${i.tag}>`;
    }),
    !e.document)
  )
    return e.addEventListener
      ? (a.disableWorkerMessageHandler ||
          e.addEventListener(
            'message',
            function (n) {
              const t = JSON.parse(n.data);
              const r = t.language;
              const i = t.code;
              const l = t.immediateClose;
              e.postMessage(a.highlight(i, a.languages[r], r)), l && e.close();
            },
            !1,
          ),
        a)
      : a;
  const g = a.util.currentScript();
  function f() {
    a.manual || a.highlightAll();
  }
  if ((g && ((a.filename = g.src), g.hasAttribute('data-manual') && (a.manual = !0)), !a.manual)) {
    const h = document.readyState;
    h === 'loading' || (h === 'interactive' && g && g.defer)
      ? document.addEventListener('DOMContentLoaded', f)
      : window.requestAnimationFrame
      ? window.requestAnimationFrame(f)
      : window.setTimeout(f, 16);
  }
  return a;
})(_self);
typeof module != 'undefined' && module.exports && (module.exports = Prism),
  typeof global != 'undefined' && (global.Prism = Prism);
(Prism.languages.markup = {
  comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
  prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
  doctype: {
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      'internal-subset': {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
      punctuation: /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
      },
      'special-attr': [],
      'attr-value': {
        pattern: /[=]\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            { pattern: /^=/, alias: 'attr-equals' },
            { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
          ],
        },
      },
      punctuation: /\/?>/,
      'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } },
    },
  },
  entity: [{ pattern: /&[\da-z]{1,8};/i, alias: 'named-entity' }, /&#x?[\da-f]{1,8};/i],
}),
  (Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside['internal-subset'].inside = Prism.languages.markup),
  Prism.hooks.add('wrap', function (a) {
    a.type === 'entity' && (a.attributes.title = a.content.replace(/&amp;/, '&'));
  }),
  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    value: function (a, e) {
      const s = {};
      (s[`language-${e}`] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
      }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
      const t = { 'included-cdata': { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s } };
      t[`language-${e}`] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
      const n = {};
      (n[a] = {
        pattern: RegExp(
          '(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)'.replace(
            /__/g,
            function () {
              return a;
            },
          ),
          'i',
        ),
        lookbehind: !0,
        greedy: !0,
        inside: t,
      }),
        Prism.languages.insertBefore('markup', 'cdata', n);
    },
  }),
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    value: function (a, e) {
      Prism.languages.markup.tag.inside['special-attr'].push({
        pattern: RegExp(
          `(^|["'\\s])(?:${a})\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,
          'i',
        ),
        lookbehind: !0,
        inside: {
          'attr-name': /^[^\s=]+/,
          'attr-value': {
            pattern: /[=][\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [e, `language-${e}`],
                inside: Prism.languages[e],
              },
              punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/],
            },
          },
        },
      });
    },
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend('markup', {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml);
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
  ],
  string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
  'class-name': {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ },
  },
  keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [
    Prism.languages.clike['class-name'],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: !0,
    },
  ],
  keyword: [
    { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0,
    },
  ],
  function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp(
      '(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])',
    ),
    lookbehind: !0,
  },
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
})),
  (Prism.languages.javascript[
    'class-name'
  ][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: RegExp(
        '((?:^|[^$\\w\\xA0-\\uFFFF."\'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))',
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        'regex-source': {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: 'language-regex',
          inside: Prism.languages.regex,
        },
        'regex-delimiter': /^\/|\/$/,
        'regex-flags': /^[a-z]+$/,
      },
    },
    'function-variable': {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function',
    },
    parameter: [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore('javascript', 'string', {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: 'comment' },
    'template-string': {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            'interpolation-punctuation': { pattern: /^\$\{|\}$/, alias: 'punctuation' },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
    'string-property': {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: 'property',
    },
  }),
  Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: 'property',
    },
  }),
  Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined('script', 'javascript'),
    Prism.languages.markup.tag.addAttribute(
      'on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)',
      'javascript',
    )),
  (Prism.languages.js = Prism.languages.javascript);
!(function (t) {
  const n = t.util.clone(t.languages.javascript);
  let e = '(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})';
  function a(t, n) {
    return (
      (t = t
        .replace(/<S>/g, function () {
          return '(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)';
        })
        .replace(/<BRACES>/g, function () {
          return '(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})';
        })
        .replace(/<SPREAD>/g, function () {
          return e;
        })),
      RegExp(t, n)
    );
  }
  (e = a(e).source),
    (t.languages.jsx = t.languages.extend('markup', n)),
    (t.languages.jsx.tag.pattern = a(
      '</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:"(?:\\\\[^]|[^\\\\"])*"|\'(?:\\\\[^]|[^\\\\\'])*\'|[^\\s{\'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>',
    )),
    (t.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
    (t.languages.jsx.tag.inside[
      'attr-value'
    ].pattern = /[=](?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
    (t.languages.jsx.tag.inside.tag.inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
    (t.languages.jsx.tag.inside.comment = n.comment),
    t.languages.insertBefore(
      'inside',
      'attr-name',
      { spread: { pattern: a('<SPREAD>'), inside: t.languages.jsx } },
      t.languages.jsx.tag,
    ),
    t.languages.insertBefore(
      'inside',
      'special-attr',
      {
        script: {
          pattern: a('=<BRACES>'),
          alias: 'language-javascript',
          inside: {
            'script-punctuation': { pattern: /^=(?=\{)/, alias: 'punctuation' },
            rest: t.languages.jsx,
          },
        },
      },
      t.languages.jsx.tag,
    );
  var s = function (t) {
    return t
      ? typeof t == 'string'
        ? t
        : typeof t.content == 'string'
        ? t.content
        : t.content.map(s).join('')
      : '';
  };
  var g = function (n) {
    for (let e = [], a = 0; a < n.length; a++) {
      const o = n[a];
      let i = !1;
      if (
        (typeof o != 'string' &&
          (o.type === 'tag' && o.content[0] && o.content[0].type === 'tag'
            ? o.content[0].content[0].content === '</'
              ? e.length > 0 && e[e.length - 1].tagName === s(o.content[0].content[1]) && e.pop()
              : o.content[o.content.length - 1].content === '/>' ||
                e.push({ tagName: s(o.content[0].content[1]), openedBraces: 0 })
            : e.length > 0 && o.type === 'punctuation' && o.content === '{'
            ? e[e.length - 1].openedBraces++
            : e.length > 0 &&
              e[e.length - 1].openedBraces > 0 &&
              o.type === 'punctuation' &&
              o.content === '}'
            ? e[e.length - 1].openedBraces--
            : (i = !0)),
        (i || typeof o == 'string') && e.length > 0 && e[e.length - 1].openedBraces === 0)
      ) {
        let r = s(o);
        a < n.length - 1 &&
          (typeof n[a + 1] == 'string' || n[a + 1].type === 'plain-text') &&
          ((r += s(n[a + 1])), n.splice(a + 1, 1)),
          a > 0 &&
            (typeof n[a - 1] == 'string' || n[a - 1].type === 'plain-text') &&
            ((r = s(n[a - 1]) + r), n.splice(a - 1, 1), a--),
          (n[a] = new t.Token('plain-text', r, null, r));
      }
      o.content && typeof o.content != 'string' && g(o.content);
    }
  };
  t.hooks.add('after-tokenize', function (t) {
    (t.language !== 'jsx' && t.language !== 'tsx') || g(t.tokens);
  });
})(Prism);
!(function (e) {
  (e.languages.typescript = e.languages.extend('javascript', {
    'class-name': {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: !0,
      greedy: !0,
      inside: null,
    },
    builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
  })),
    e.languages.typescript.keyword.push(
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      /\btype\b(?=\s*(?:[\{*]|$))/,
    ),
    delete e.languages.typescript.parameter,
    delete e.languages.typescript['literal-property'];
  const s = e.languages.extend('typescript', {});
  delete s['class-name'],
    (e.languages.typescript['class-name'].inside = s),
    e.languages.insertBefore('typescript', 'function', {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: { at: { pattern: /^@/, alias: 'operator' }, function: /^[\s\S]+/ },
      },
      'generic-function': {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: !0,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: { pattern: /<[\s\S]+/, alias: 'class-name', inside: s },
        },
      },
    }),
    (e.languages.ts = e.languages.typescript);
})(Prism);
!(function (e) {
  const a = e.util.clone(e.languages.typescript);
  (e.languages.tsx = e.languages.extend('jsx', a)),
    delete e.languages.tsx.parameter,
    delete e.languages.tsx['literal-property'];
  const t = e.languages.tsx.tag;
  (t.pattern = RegExp(`(^|[^\\w$]|(?=</))(?:${t.pattern.source})`, t.pattern.flags)),
    (t.lookbehind = !0);
})(Prism);
