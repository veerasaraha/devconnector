import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEducation } from '../../actions/profile'
import { Link } from 'react-router-dom'

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  })

  const [toDataDisplay, setToDateDisplay] = useState(false)

  const { school, degree, fieldofstudy, from, to, current, description } =
    formData

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addEducation(formData, history)
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any school or bootcamp that
        you have attended
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            value={school}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            value={degree}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field of  Study'
            name='fieldofstudy'
            value={fieldofstudy}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              checked={current}
              value={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current })
                setToDateDisplay(!toDataDisplay)
              }}
            />{' '}
            Current Job
          </p>
        </div>
        <div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            disabled={toDataDisplay ? 'disabled' : ''}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            value={description}
            onChange={(e) => handleChange(e)}
            placeholder='Program Description'></textarea>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </Fragment>
  )
}

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
}

export default connect(null, { addEducation })(AddEducation)
