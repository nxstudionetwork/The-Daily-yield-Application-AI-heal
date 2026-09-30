const QuickNotes = (() => {
  let notes = [];

  function init() {
    notes = Utils.storage.get('quickNotes', []);
  }

  function add(text) {
    if (!text.trim()) return;
    notes.unshift({ id: Utils.uid(), text: text.trim(), created: Date.now() });
    if (notes.length > 50) notes = notes.slice(0, 50);
    Utils.storage.set('quickNotes', notes);
  }

  function remove(id) {
    notes = notes.filter(n => n.id !== id);
    Utils.storage.set('quickNotes', notes);
  }

  function getAll() { return notes; }

  return { init, add, remove, getAll };
})();
