const SELECTOR = 'ul > li'
// style apply to input, so safe to set class checked on all list items
// nice when we have `- [ ]` inside `.flag` or similar

$(SELECTOR).click(toggleChecked)

function toggleChecked() {
  $(this).toggleClass('checked');
};
