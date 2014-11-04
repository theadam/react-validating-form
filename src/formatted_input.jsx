/** @jsx React.DOM */
var React = require('react');
var ValidatingInput = require('./validating_input');
var _ = require('lodash');

module.exports = React.createClass({

  getDefaultProps: function(){
    return {
      formatter: function(str){return str},
      onBlur: _.noop,
      onFocus: _.noop,
      onChange: _.noop,
    };
  },

  getInitialState: function(){
    return {
      hasFocus: false,
      rawValue: this.props.value
    };
  },

  componentWillReceiveProps: function(props){
    if(props.value){
      this.setState({rawValue: props.value});
    }
  },

  render: function(){

    return this.transferPropsTo(
      <ValidatingInput
        ref='input'
        value={this.getShowingValue()}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleChange} />
    );
  },

  handleChange: function(event){
    this.setState({rawValue: event.target.value}, function(){
      this.props.onChange(event);
    });
  },

  handleFocus: function(event){
    this.setState({hasFocus: true});
    this.props.onFocus(event);
  },

  handleBlur: function(event){
    this.setState({hasFocus: false});
    this.props.onBlur(event);
  },

  getRawValue: function(){
    return this.state.rawValue || '';
  },

  getShowingValue: function(){
    if(this.state.hasFocus){
      return this.getRawValue();
    }
    else{
      return this.props.formatter(this.getRawValue());
    }
  },
  
  startValidating: function(){
    this.refs.input.startValidating();
  },

  getValue: function(){
    return this.props.formatter(this.getRawValue());
  }

});
