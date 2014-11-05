/** @jsx React.DOM */
var React = require('react');
var Input = require('react-bootstrap').Input;
var _ = require('lodash');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      isValidating: false,
      timeoutId: null
    }
  },

  getDefaultProps: function(){
    return {
      type: 'text',
      errorStyle: 'error',
      timeout: 500,
      onChange: _.noop,
      onBlur: _.noop
    };
  },

  componentDidMount: function(){
    if(this.props.autofocus){
      this.refs.input.getInputDOMNode().focus();
    }
  },

  render: function(){
    var hasErrors = this.state.isValidating && this.props.errors;
    return this.transferPropsTo(
      <Input
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        ref="input"
        hasFeedback
        help={hasErrors ? _.first(this.props.errors) : null}
        bsStyle={hasErrors ? this.props.errorStyle : null} />
    );
  },

  startValidating: function(){
    if(!this.state.isValidating){
      this.setState({
        isValidating: true
      });
    }
  },

  handleBlur: function(event){
    this.startValidating();
    this.props.onBlur(event);
  },

  handleChange: function(event){
    var timeoutId = this.state.timeoutId;
    if(timeoutId !== null){
      clearTimeout(timeoutId);
    }
    if(!(this.props.timeout < 0)){
      timeoutId = setTimeout(this.startValidating, this.props.timeout);
      this.setState({timeoutId: timeoutId});
    }
    this.props.onChange(event);
  },

  getValue: function(){
    return this.refs.input.getValue();
  }

});
