var React = require('react/addons');
var reactBootstrap = require('react-bootstrap');
var Button = reactBootstrap.Button;
var _ = require('lodash');
var cx = React.addons.classSet;
var cloneWithProps = React.addons.cloneWithProps;

var noop = function(){};

module.exports = React.createClass({

  propTypes: {
    schema: React.PropTypes.shape({
      validate: React.PropTypes.func.isRequired
    }),
    validator: React.PropTypes.func
  },

  getDefaultProps: function(){
    return {
      submitLabel: "Submit",
      horizontal: false
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

  renderChildren: function(){
    var component = this;
    return React.Children.map(this.props.children, function(child){
      var field = child.props.field;
      if(field === undefined){
        return child;
      }

      return cloneWithProps(child, {
        key: field,
        ref: field,
        error: component.state.errors[field],
        onChange: component.handleErrors,
      });
    });
  },

  render: function(){

    var classes = cx({
      'form-horizontal': this.props.horizontal,
      clearfix: true
    });

    return this.transferPropsTo(
      <form className={classes} onSubmit={this.submit} action=''>
        {this.renderChildren()}

        <Button
          bsStyle='primary'
          type='submit'
          className='pull-right'>{this.props.submitLabel}</Button>
      </form>
    );
  },

  getValue: function(){
    var fieldsToValidate = {};

    _.forIn(this.refs, function(input, field){
      fieldsToValidate[field] = input.getValue();
    });

    return fieldsToValidate;
  },

  handleErrors: function(next){
    var component = this;
    var fieldsToValidate = this.getValue();
    next = next || noop;

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
        if(component.props.onSubmit){
          component.props.onSubmit();
        }
      }
      else{
        _.forIn(component.refs, function(input){
          input.startValidating();
        });
      }
    });

    return false; // Avoid page refresh
  }
});
