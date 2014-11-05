/** @jsx React.DOM */
var React = require('react');
var ValidatingInput = require('./validating_input');
var _ = require('lodash');
var caret = require('./utils/caret');

var pattern = /{{([^}]+)}}/g;
var matchOffset = 4;

/**
 * Parses a pattern like:
 * ({{###}}) {{###}}-{{####}}
 * into an object with the location of static components (like '(,), , -'),
 * and compenents that match input (the '#'s)
 */
var parsePattern = function(value){
  var info = {inputs: '', statics: {}};
  var i = 0;
  var matchIndex = 0;
  var match = pattern.exec(value);
  while(i < value.length){
    if(!match || i < match.index){
      info.statics[i - (matchIndex * matchOffset)] = value[i];
      i++;
    }
    else{
      info.inputs += match[1];
      i += match[1].length + matchOffset;
      match = pattern.exec(value);
      matchIndex++;
    }
  }
  return info;
};

/**
 * Removes static portions of the given pattern from the string
 */
var removeStatics = function(string, statics){
  var newString = '';
  for(var i = 0; i < string.length; i++){
    if(statics[i] != string[i]){
      newString += string[i];
    }
  }
  return newString;
};

var defaultPatterns = {
  '#': /[0-9]/,
  'a': /[A-Za-z]/,
  '*': /[A-Za-z0-9]/
};

/**
 * Sanitizes the string against the pattern by first removing all the static portions
 * then only keeping the characters that match the given input matching characters.
 */
var sanitize = function(string, pattern, inputTypes){
  string = removeStatics(string, pattern.statics);
  var inputs = pattern.inputs;
  var newString = '';
  var inputIndex = 0;
  var patterns = _.merge(defaultPatterns, inputTypes);
  for(var i = 0; i < string.length && inputIndex < inputs.length; i++){
    if(patterns[inputs[inputIndex]].test(string[i])){
      newString += string[i];
      inputIndex++;
    }
  }
  return newString;
};

/**
 * takes a raw value, and inserts the static values in it.  For our phone number example
 * takes: '1234567890', with the statics as defined above, and returns '(123) 456-7890'
 */
var addChars = function(string, statics){
  var newString = '';
  var length = _.size(statics) + string.length;
  var strIndex = 0;
  for(var i = 0; i < length && strIndex < string.length; i++){
    if(statics[i] === undefined){
      newString += string[strIndex++];
    }
    else{
      newString += statics[i];
    }
  }
  return newString;
};

module.exports = React.createClass({

  propTypes:  {
    pattern: React.PropTypes.string.isRequired
  },

  getDefaultProps: function(){
    return {
      onChange: _.noop,
      inputTypes: {}
    };
  },

  getInitialState: function(){
    return {
      rawValue: this.props.value || ''
    };
  },

  componentWillMount: function(){
    this.setState({pattern: parsePattern(this.props.pattern)});
  },

  componentWillReceiveProps: function(props){
    this.setState({
      pattern: parsePattern(props.pattern),
      rawValue: props.value || this.state.rawValue
    });
  },

  render: function(){
    return this.transferPropsTo(
      <ValidatingInput ref='input' pattern={undefined} onChange={this.handleChange} value={this.getValue()}/>
    );
  },

  componentDidUpdate: function(){
    if(this.state.rawCaretPosition !== undefined){
      var input = this.getInputDOMNode();

      var formattedCaretPosition = this.formatValue(this.state.rawValue.slice(0, this.state.rawCaretPosition)).length;

      caret.setPosition(input, formattedCaretPosition);
      this.setState({rawCaretPosition: undefined});
    }
  },

  handleChange: function(event){
    var pattern = this.state.pattern;
    var caretPosition = caret.getPosition(this.getInputDOMNode());

    var value = event.target.value;
    var rawBeforeCaret = sanitize(value.slice(0, caretPosition), pattern, this.props.inputTypes);
    var rawAfterCaret = sanitize(value.slice(caretPosition, value.length), pattern, this.props.inputTypes);

    if((rawBeforeCaret.length + rawAfterCaret.length) > pattern.inputs.length){
      rawBeforeCaret = rawBeforeCaret.slice(0, pattern.inputs.length - rawAfterCaret.length);
    }

    var rawValue = rawBeforeCaret + rawAfterCaret;
    this.setState({
      rawValue: rawValue,
      rawCaretPosition: rawBeforeCaret.length
    }, function(){
      this.props.onChange(event);
    });
  },

  formatValue: function(value){
    return addChars(value, this.state.pattern.statics, this.state.forward);
  },

  startValidating: function(){
    this.refs.input.startValidating();
  },

  getValue: function(){
    return this.formatValue(this.state.rawValue);
  },

  getInputDOMNode: function(){
    return this.getDOMNode().getElementsByTagName('input')[0];
  }

});
