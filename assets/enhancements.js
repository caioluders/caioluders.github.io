(() => {
  'use strict';
  const heading = document.querySelector('body > h1');
  if (!heading) return;
  const calculator = document.createElement('script');
  calculator.src = '/assets/popcalc-launcher.js';
  document.head.append(calculator);
  const theme = document.createElement('script');
  theme.src = '/assets/theme.js';
  document.body.append(theme);
  const stamp = heading.nextElementSibling;
  if (stamp?.tagName === 'P' && /^\d{10}$/.test(stamp.textContent.trim())) {
    const published = new Date(Number(stamp.textContent.trim()) * 1000);
    const time = document.createElement('time');
    time.dateTime = published.toISOString();
    time.textContent = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Fortaleza' }).format(published);
    stamp.replaceChildren(time);
  }
  const tools = document.createElement('div');
  tools.className = 'blog-tools';
  const table = document.querySelector('table.index');
  if (table) { heading.after(tools); setupSearch(); }

  function setupSearch() {
    tools.innerHTML = '<form role="search"><input id="blog-search" aria-label="Search the blog" type="search" placeholder="Search..." maxlength="200" autocomplete="off"><button type="button" id="clear-search" hidden>Clear</button></form>';
    const results = document.createElement('section');
    results.className = 'blog-search-results';
    results.setAttribute('aria-label', 'Search results');
    results.hidden = true;
    results.innerHTML = '<p role="status" aria-live="polite"></p><ul></ul><button type="button" hidden>Retry search</button>';
    tools.after(results);
    const input = tools.querySelector('input');
    const clear = tools.querySelector('#clear-search');
    const status = results.querySelector('[role="status"]');
    const list = results.querySelector('ul');
    const retry = results.querySelector('button');
    const fold = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    function matchRanges(text, terms) {
      // Map normalized characters back to the original text so accents and
      // multicode-unit characters retain their spelling inside highlights.
      let normalized = '', offset = 0;
      const positions = [];
      for (const character of text) {
        const key = fold(character);
        for (let i = 0; i < key.length; i++) positions.push([offset, offset + character.length]);
        if (!key && positions.length) positions[positions.length - 1][1] = offset + character.length;
        normalized += key;
        offset += character.length;
      }
      const ranges = [];
      for (const term of terms) {
        if (!term) continue;
        let index = normalized.indexOf(term);
        while (index !== -1) {
          ranges.push([positions[index][0], positions[index + term.length - 1][1]]);
          index = normalized.indexOf(term, index + 1);
        }
      }
      ranges.sort((a, b) => a[0] - b[0]);
      const merged = [];
      for (const range of ranges) {
        const previous = merged[merged.length - 1];
        if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
        else merged.push(range);
      }
      return merged;
    }
    function highlight(element, text, terms) {
      let offset = 0;
      for (const [start, end] of matchRanges(text, terms)) {
        element.append(document.createTextNode(text.slice(offset, start)));
        const mark = document.createElement('mark');
        mark.textContent = text.slice(start, end);
        element.append(mark);
        offset = end;
      }
      element.append(document.createTextNode(text.slice(offset)));
    }
    let indexPromise, timer, revision = 0;
    function getIndex() {
      if (!indexPromise) indexPromise = fetch('/assets/search-index.json').then(response => {
        if (!response.ok) throw new Error('Index unavailable');
        return response.json();
      }).then(entries => entries.map(entry => ({...entry, titleKey: fold(entry.title), textKey: fold(entry.title + ' ' + entry.url + ' ' + entry.content)})))
        .catch(error => { indexPromise = undefined; throw error; });
      return indexPromise;
    }
    async function search() {
      const request = ++revision;
      const query = input.value.trim();
      results.hidden = !query;
      clear.hidden = !query;
      retry.hidden = true;
      if (table) table.hidden = Boolean(query);
      list.replaceChildren();
      if (!query) { status.textContent = ''; return; }
      status.textContent = 'Searching…';
      try {
        const entries = await getIndex();
        if (request !== revision) return;
        const terms = fold(query).split(/\s+/).filter(Boolean);
        const matches = entries.filter(entry => terms.every(term => entry.textKey.includes(term)));
        const score = entry => terms.reduce((n, term) => n + (entry.titleKey.includes(term) ? 10 : 0), 0);
        matches.sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date));
        const fragment = document.createDocumentFragment();
        for (const entry of matches) {
          const url = new URL(entry.url, location.origin);
          if (!['http:', 'https:'].includes(url.protocol)) continue;
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = url.href;
          highlight(link, entry.title, terms);
          const meta = document.createElement('small');
          highlight(meta, entry.category + (entry.date ? ' · ' + entry.date : ''), terms);
          item.append(link, meta);
          if (entry.content) {
            const snippet = document.createElement('p');
            snippet.className = 'search-excerpt';
            const firstMatch = matchRanges(entry.content, terms)[0];
            const start = Math.max(0, (firstMatch?.[0] || 0) - 45);
            const end = Math.max(start + 160, (firstMatch?.[1] || 0) + 45);
            highlight(snippet, (start ? '…' : '') + entry.content.slice(start, end) + (entry.content.length > end ? '…' : ''), terms);
            item.append(snippet);
          }
          fragment.append(item);
        }
        list.replaceChildren(fragment);
        status.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for “${query}”` : 'No results. Try another word.';
      } catch {
        if (request !== revision) return;
        status.textContent = 'Search could not load. Retry, or clear the search to browse normally.';
        retry.hidden = false;
      }
    }
    input.addEventListener('input', () => { ++revision; clearTimeout(timer); timer = setTimeout(search, 150); });
    tools.querySelector('form').addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); search(); });
    clear.addEventListener('click', () => { input.value = ''; clearTimeout(timer); search(); input.focus(); });
    retry.addEventListener('click', search);
    // The existing calculator consumes Backspace, digits and punctuation on
    // document. Keep input events local without cancelling native text editing.
    input.addEventListener('keydown', event => {
      event.stopPropagation();
      if (event.key === 'Escape') { clear.click(); event.preventDefault(); }
    });
    input.addEventListener('keyup', event => event.stopPropagation());
  }
  document.querySelectorAll('pre').forEach(pre => { pre.tabIndex = 0; pre.setAttribute('aria-label', 'Code block'); });

  const host = document.createElement('div');
  host.id = 'background';
  host.setAttribute('aria-hidden', 'true');
  document.body.prepend(host);
  // Load decoration separately, so it cannot prevent search or reading.
  const background = document.createElement('script');
  background.type = 'module';
  background.src = '/assets/background-loader.js';
  document.body.append(background);
})();
