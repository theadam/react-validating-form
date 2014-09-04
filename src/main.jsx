var Schema = require('node-schema');
var Field = Schema.Field;
var str = require('string-validator');
var React = require('react');
var ValidatingForm = require('../../index').ValidatingForm;
var ValidatingInput = require('../../index').ValidatingInput;
var Well = require('react-bootstrap').Well;
var Button = require('react-bootstrap').Button;

var userSchema = Schema({
  username: Field.required('Username is required', {
    'Username must only contain letters, numbers, _, and -': str.matches(/^[a-zA-Z\-_]*$/),
    'Username must be at least 5 characters long': str.isLength(5)
  }),
  password: Field.required('Password is required', {
    'Password must be at least 5 characters long': str.isLength(5)
  }),
  passwordCheck: Field.optional({
    'Passwords must match': function(val, options, object){
      return val == object.password;
    }
  })
});

var Example1 = React.createClass({

  handleSubmit: function(value){
    alert(JSON.stringify(value));
  },

  render: function(){
    var wrapperClassName='col-xs-12';
    return (
      <Well className="example">
        <ValidatingForm
          schema={userSchema}
          onSubmit={this.handleSubmit}
          submitLabel="Register"
          ref='form'
          horizontal>
          <ValidatingInput
            field='username'
            placeholder='Enter Username'
            wrapperClassName={wrapperClassName}/>
          <ValidatingInput
            field='password'
            type='password'
            placeholder='Enter Password'
            wrapperClassName={wrapperClassName}/>
          <ValidatingInput
            field='passwordCheck'
            type='password'
            placeholder='Re-enter Password'
            wrapperClassName={wrapperClassName}/>
          <Button
            bsStyle='primary'
            type='submit'
            className='pull-right'>Register</Button>
        </ValidatingForm>
      </Well>
    );
  }
});

React.renderComponent(<Example1 />, document.getElementById('content'));
