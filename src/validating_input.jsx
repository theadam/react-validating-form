var React = require('react');
var Input = require('react-bootstrap').Input;
var _ = require('lodash');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      isValidating: false,
    }
  },

  getDefaultProps: function(){
    return {
      type: 'text',
      errorStyle: 'error'
    };
  },

  render: function(){
    var hasErrors = this.state.isValidating && this.props.error;
    return this.transferPropsTo(
      <Input
        onBlur={this.startValidating}
        onChange={this.handleChange}
        ref="input"
        hasFeedback
        help={hasErrors ? _.first(this.props.error) : null}
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
    this.startValidating();
    if(this.props.onChange){
      this.props.onChange(event);
    }
  },

  getValue: function(){
    return this.refs.input.getValue();
  }

});
