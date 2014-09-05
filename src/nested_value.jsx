var React = require('react');
var NestedMixin = require('./nested_mixin');

module.exports = React.createClass({

  mixins: [NestedMixin],

  render: function(){
    return this.transferPropsTo(
      <div>
        {this.renderChildren(this.props.errors)}
      </div>
    );
  },

});
