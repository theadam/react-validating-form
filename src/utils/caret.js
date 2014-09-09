exports.getPosition = function(elem){

  if (typeof elem.selectionStart === 'number') {
    return elem.selectionStart;
  }

  // IE cool stuff
  var range = document.selection.createRange();
  if (range && range.parentElement() === elem) {
    var selectionLength = range.text.length;
    range.moveStart('character', -input.value.length);
    return range.text.length - selectionLength;
  }

  return 0;
};


exports.setPosition = function(elem, position){
  if(elem.setSelectionRange) {
		elem.setSelectionRange(position, position);
	}
	else if (elem.createTextRange) {
		var range = elem.createTextRange();
		range.collapse(true);
		range.moveEnd('character', position);
		range.moveStart('character', position);
		range.select();
	}
};
