/** @jsx React.DOM */
var React = require('react/addons');
var reactBootstrap = require('react-bootstrap');
var _ = require('lodash');
var cx = React.addons.classSet;
var cloneWithProps = React.addons.cloneWithProps;
var NestedMixin = require('./nested_mixin');

module.exports = React.createClass({

  mixins: [NestedMixin],

  propTypes: {
    schema: React.PropTypes.shape({
      validate: React.PropTypes.func.isRequired
    }),
    validator: React.PropTypes.func
  },

  getDefaultProps: function(){
    return {
      horizontal: false,
      onSubmit: _.noop,
      onSubmitErrors: _.noop
    }
  },

  getInitialState: function(){
    return {
      errors: {}
    };
  },

  componentDidMount: function(){
    this.handleErrors();
  },

  render: function(){
    var classes = cx({
      'form-horizontal': this.props.horizontal,
      clearfix: true
    });

    return this.transferPropsTo(
      <form className={classes} onSubmit={this.submit} action=''>
        {this.renderChildren(this.state.errors)}
      </form>
    );
  },

  onChildChange: function(event){
    this.handleErrors();
  },

  handleErrors: function(next){
    var component = this;
    var fieldsToValidate = this.getValue();
    next = next || _.noop;

    var validationHandler = function(errors){
      errors = errors || {};
      component.setState({errors: errors});
      next(errors);
    };

    if(this.props.schema.validate){
      this.props.schema.validate(fieldsToValidate).then(validationHandler);
    }
    else if(_.isFunction(this.props.validator)){
      if(this.props.validator.length == 1){
        validationHandler(validator(fieldsToValidate));
      }
      else if(this.props.validator.length == 2){
        validator(fieldsToValidate, validationHandler);
      }
    }
  },

  setErrors: function(errors){
    this.setState({errors: errors || {}});
  },

  submit: function(){
    var component = this;

    this.handleErrors(function(errors){
      if(_.isEmpty(errors)){
        component.props.onSubmit(component.getValue());
      }
      else{
        component.startValidating();
        component.props.onSubmitErrors(component.getValue(), errors);
      }
    });

    return false; // Avoid page refresh
  },

});
