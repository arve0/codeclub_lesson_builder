const SELECTOR = 'p > input'

$(SELECTOR).click(toggleChecked)

function toggleChecked() {
  $(this).toggleClass('checked');
};
