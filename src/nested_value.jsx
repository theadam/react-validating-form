/** @jsx React.DOM */
var React = require('react');
var NestedMixin = require('./nested_mixin');
var _ = require('lodash');

module.exports = React.createClass({

  mixins: [NestedMixin],

  getDefaultProps: function(){
    return {
      onChange: _.noop
    }
  },

  render: function(){
    return this.transferPropsTo(
      <div>
        {this.renderChildren(this.props.errors)}
      </div>
    );
  },

  onChildChange: function(event){
    this.props.onChange(event);
  }

});
