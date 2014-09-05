var Schema = require('node-schema');
var Field = Schema.Field;
var str = require('string-validator');
var React = require('react');
var ValidatingForm = require('../../index').ValidatingForm;
var ValidatingInput = require('../../index').ValidatingInput;
var NestedValue = require('../../index').NestedValue;
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
  }),
  name: {
    first: Field.required('First Name is required', {
      'First Name cannot be empty': str.isLength(1)
    }),
    last: Field.required('Last Name is required', {
      'Last Name cannot be empty': str.isLength(1)
    })
  },
  address: {
    street1: Field.required('Street is required', {
      'Street cannot be empty': str.isLength(1)
    }),
    street2: Field.optional({
      'Street can be anything': str.isLength(0)
    }),
    city: Field.required('City is required', {
      'City cannot be empty': str.isLength(1)
    }),
    state: Field.required('State is required', {
      'State must be a valid state abbreviation (2 Uppercase Letters)': str.matches(/[A-Z]{2}/)
    }),
    zipCode: Field.required('Zip Code is required', {
      'Zip Code must be valid (5 numbers)': str.matches(/\d{5}/),
    }),

  }
});

var Example1 = React.createClass({

  handleSubmit: function(value){
    alert(JSON.stringify(value, null, " "));
  },

  render: function(){
    return (
      <Well className="example">
        <h1>User Info</h1>
        <ValidatingForm
          schema={userSchema}
          onSubmit={this.handleSubmit}
          ref='form'
          horizontal>
          <div className='col-xs-12'>
            <ValidatingInput
              field='username'
              placeholder='Username'/>
            <ValidatingInput
              field='password'
              type='password'
              placeholder='Password'/>
            <ValidatingInput
              field='passwordCheck'
              type='password'
              placeholder='Re-Enter Password'/>
              <NestedValue className='nested' field='name'>
                <div className='form-header'>Name</div>
                <ValidatingInput
                  field='first'
                  placeholder='First Name'/>
                <ValidatingInput
                  field='last'
                  placeholder='Last Name'/>
              </NestedValue>
              <NestedValue className='nested' field='address'>
                <div className='form-header'>Address</div>
                <ValidatingInput
                  field='street1'
                  placeholder='Street'/>
                <ValidatingInput
                  field='street2'
                  placeholder='Street 2'/>
                <div className='row'>
                  <div className='col-xs-8'>
                    <ValidatingInput
                      field='city'
                      placeholder='City'/>
                  </div>
                  <div className='state-div'>
                    <ValidatingInput
                      field='state'
                      placeholder='State'/>
                  </div>
                </div>
                <ValidatingInput
                  field='zipCode'
                  placeholder='Zip Code'/>
              </NestedValue>
            <Button
              bsStyle='primary'
              type='submit'
              className='pull-right'>Submit</Button>
            </div>
        </ValidatingForm>
      </Well>
    );
  }
});

React.renderComponent(<Example1 />, document.getElementById('content'));
