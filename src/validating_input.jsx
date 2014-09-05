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
      timeout: 500
    };
  },

  render: function(){
    var hasErrors = this.state.isValidating && this.props.errors;
    return this.transferPropsTo(
      <Input
        onBlur={this.startValidating}
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

  handleChange: function(event){
    var timeoutId = this.state.timeoutId;
    if(timeoutId !== null){
      clearTimeout(timeoutId);
    }
    if(!(this.props.timeout < 0)){
      timeoutId = setTimeout(this.startValidating, this.props.timeout);
      this.setState({timeoutId: timeoutId});
    }
    if(this.props.onChange){
      this.props.onChange(event);
    }
  },

  getValue: function(){
    return this.refs.input.getValue();
  }

});
