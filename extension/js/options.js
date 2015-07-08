// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("defaultTab");
  var defaultTab = select.children[select.selectedIndex].value;
  var radios = document.getElementsByTagName('input');
  var remember = document.getElementById("rememberLastTab").checked;
  
  localStorage["defaultTab"] = defaultTab;
  localStorage["rememberLastTab"] = remember;
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
  var theme = localStorage["theme"];
  var remember = localStorage["rememberLastTab"];
  var twitch = localStorage["twitch"];
  
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
  
  var radios = document.getElementsByTagName('input');
  for (var i = 0;i<radios.length;i++) {
	if(radios[i].type == 'radio') {
		if((theme == "" || theme == null) && radios[i].value == "dark") {
			radios[i].checked = true;
		}
		if((twitch=="" || twitch==null) && radios[i].value == "channel") {
			radios[i].checked = true;
		}
		if(radios[i].value == theme) {
			radios[i].checked = true;
		} else if(radios[i].value == twitch) {
			radios[i].checked = true;
		}		
	}
  }
  
  document.getElementById('rememberLastTab').checked = remember;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);