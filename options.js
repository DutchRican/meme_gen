
// Saves options to chrome.storage
function save_options() {
    var fontSize = document.getElementById('fontSize').value;
    var minHeight = document.getElementById('minHeight').value;
    var fontColor = document.getElementById('fontColor').value;
    var fontFamily = document.getElementById('fontFamily').value;
    chrome.storage.sync.set({
      defaultSize: fontSize,
      minHeight,
      defaultColor: fontColor,
      defaultFamily: fontFamily
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        defaultSize: fontSize,
        minHeight,
        defaultColor: fontColor,
        defaultFamily: fontFamily
    }, function(items) {
        console.log(typeof(items.defaultSize), typeof(items.defaultColor), typeof(items.defaultFamily))
        document.getElementById('fontSize').value = typeof(items.defaultSize) == 'string' ? items.defaultSize : DEFAULT_SIZE;
        document.getElementById('minHeight').value = typeof(items.minHeight) == 'string' ? items.minHeight : MIN_HEIGHT;
        document.getElementById('fontColor').value = typeof(items.defaultColor) == 'string' ? items.defaultColor : YELLOW;
        document.getElementById('fontFamily').value = typeof(items.defaultFamily) == 'string' ? items.defaultFamily : DEFAULT_FAMILY;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);