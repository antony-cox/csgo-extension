/**
 * THIS SCRIPT HANDLES THE OPTIONS PART OF THE EXTENSION
 */

$(document).ready(function()
{
  restore_options();
  document.querySelector('#save').addEventListener('click', save_options);
})

// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("defaultTab");
  var defaultTab = select.children[select.selectedIndex].value;
  var selectTime = document.getElementById("reminderTime");
  var selectedTime = selectTime.children[selectTime.selectedIndex].value;
  var radios = document.getElementsByTagName('input');

  localStorage["defaultTab"] = defaultTab;
  localStorage["reminderTime"] = selectedTime;
  for (var i =0;i<radios.length;i++) {
	if(radios[i].type == 'radio' && radios[i].checked) {
		localStorage[radios[i].name] = radios[i].value;
	}
  }

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
	window.location = "../popup.html";
  }, 750);
}

// Restores options from localStorage.
function restore_options() {
  var defaultTab = localStorage["defaultTab"];
  var twitch = localStorage["twitch"];
  var reminderTime = localStorage["reminderTime"];
  
  if (!defaultTab) {
    return;
  }

  var select = document.getElementById("defaultTab");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == defaultTab) {
      child.selected = "true";
      break;
    }
  }

  var reminder = document.getElementById("reminderTime");
  for(var i = 0;i<reminder.children.length;i++)
  {
    var child = reminder.children[i];
    if(child.value == reminderTime)
    {
      child.selected = true;
      break;
    }
  }
  
  var radios = document.getElementsByTagName('input');
  for (var i = 0;i<radios.length;i++) {
    if (radios[i].type == 'radio') {
      if ((twitch == "" || twitch == null) && radios[i].value == "channel") {
        radios[i].checked = true;
      }
      if (radios[i].value == twitch) {
        radios[i].checked = true;
      }
    }
  }
}
