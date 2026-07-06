(() => {
  'use strict';

  const nativeRemove = Element.prototype.remove;

  Element.prototype.remove = function stableBlogReminderRemove() {
    const route = location.hash.replace(/^#\//, '') || 'schedule';
    const isScheduleRoute = route === 'schedule' || route === 'july' || route === 'august';

    if (isScheduleRoute && this.classList?.contains('blog-duty-reminder')) {
      return;
    }

    return nativeRemove.call(this);
  };
})();
