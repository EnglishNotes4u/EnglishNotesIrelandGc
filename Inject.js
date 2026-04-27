// This is the bookmarklet code (minified) that forces the score to 899
(function() {
  const targetScore = 899;
  const scoreKeys = ['score','count','reps','total','points','motionCount'];
  setInterval(() => {
    scoreKeys.forEach(k => { if (window[k] !== undefined) window[k] = targetScore; });
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && /^\d+$/.test(el.innerText.trim())) {
        el.innerText = targetScore;
      }
    });
  }, 100);
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    if (args[1] && args[1].body) {
      try {
        let data = JSON.parse(args[1].body);
        for (let key in data) {
          if (typeof data[key] === 'number') data[key] = targetScore;
          if (typeof data[key] === 'string' && !isNaN(data[key])) data[key] = targetScore.toString();
        }
        args[1].body = JSON.stringify(data);
      } catch(e) {}
    }
    return originalFetch.apply(this, args);
  };
  console.log('✅ Score locked to', targetScore);
})();
