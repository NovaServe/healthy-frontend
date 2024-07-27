import React from 'react';
import '../style/form.css';

const Form = () => {
  return (
    <>
      <form action="/submit" method="post" className='form-custom'>
        <div className='form-group'>
          <label htmlFor="name" className='form-label'>Name:</label>
          <input type="text" id="name" name="name" className='form-input' required />
        </div>

        <div className='form-group'>
          <label htmlFor="email" className='form-label'>Email:</label>
          <input type="email" id="email" name="email" className='form-input' required />
        </div>

        <div className='form-group'>
          <label htmlFor="message" className='form-label'>Message:</label>
          <textarea id="message" name="message" rows="4" className='form-input' required></textarea>
        </div>

        <input type="submit" value="Submit" className='form-btn' />
      </form>
    </>
  );

};

export default Form;