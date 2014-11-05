/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var cloneWithProps = React.addons.cloneWithProps;

module.exports = {

  renderChildren: function(errors){
    var component = this;
    errors = errors || {};

    var getChildValidators = function(child){
      var field = child.props.field;
      if(field === undefined){
        if(child.props.children){
          // make sure to find nested children
          return cloneWithProps(child, {
            children: React.Children.map(child.props.children, getChildValidators)
          });
        }
        else{
          return child;
        }
      }

      return cloneWithProps(child, {
        key: field,
        ref: field,
        errors: errors[field],
        onChange: component.onChildChange,
      });
    };

    return React.Children.map(this.props.children, getChildValidators);
  },

  getValue: function(){
    var fieldsToValidate = {};

    _.forIn(this.refs, function(input, field){
      fieldsToValidate[field] = input.getValue();
    });

    return fieldsToValidate;
  },

  startValidating: function(){
    _.forIn(this.refs, function(input){
      if(_.isFunction(input.startValidating)){
        input.startValidating();
      }
    });
  }
};
