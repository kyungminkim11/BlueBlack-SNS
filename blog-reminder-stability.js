(() => {
  'use strict';

  const scheduleRoutes = new Set(['schedule', 'july', 'august']);
  const nativeDocumentQuerySelectorAll = Document.prototype.querySelectorAll;
  const nativeElementRemove = Element.prototype.remove;

  const currentRoute = () => location.hash.replace(/^#\//, '') || 'schedule';
  const shouldKeepReminder = () => scheduleRoutes.has(currentRoute());

  Document.prototype.querySelectorAll = function stableReminderQuerySelectorAll(selector) {
    if (selector === '.blog-duty-reminder' && shouldKeepReminder()) {
      return [];
    }
    return nativeDocumentQuerySelectorAll.call(this, selector);
  };

  Element.prototype.remove = function stableReminderRemove() {
    if (this.classList?.contains('blog-duty-reminder') && shouldKeepReminder()) {
      return;
    }
    return nativeElementRemove.call(this);
  };
})();
