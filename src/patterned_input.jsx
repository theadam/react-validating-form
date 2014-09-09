var React = require('react');
var ValidatingInput = require('./validating_input');
var _ = require('lodash');
var Formatter = require('formatter.js');
var caret = require('./utils/caret');

var pattern = /{{([^}]+)}}/g;
var matchOffset = 4;

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
  '9': /[0-9]/,
  'a': /[A-Za-z]/,
  '*': /[A-Za-z0-9]/
};

var sanitize = function(string, pattern, caretPosition){
  string = removeStatics(string, pattern.statics);
  var inputs = pattern.inputs;
  var newString = '';
  var inputIndex = 0;

  /*if(string.length > inputs.length){
    var difference = string.length - inputs.length;
    var start = caretPosition - difference;
    var end = caretPosition;
    string = string.slice(0, start) + string.slice(end, string.length);
  }*/

  for(var i = 0; i < string.length && inputIndex < inputs.length; i++){
    if(defaultPatterns[inputs[inputIndex]].test(string[i])){
      newString += string[i];
      inputIndex++;
    }
  }
  return newString;
};

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
      onChange: _.noop
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
      <ValidatingInput ref='input' pattern={false} onChange={this.handleChange} value={this.getValue()}/>
    );
  },

  handleChange: function(event){
    //console.log(caret.getPosition(this.getInputDOMNode()));
    var value = event.target.value;
    var pattern = this.state.pattern;
    var rawValue = sanitize(value, pattern);
    this.setState({
      rawValue: rawValue,
      forward: rawValue.length > this.state.rawValue.length
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
