import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addExperience } from '../../actions/profile'
import { Link } from 'react-router-dom'

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    from: '',
    to: '',
    location: '',
    current: false,
    description: '',
  })

  const [toDataDisplay, setToDateDisplay] = useState(false)

  const { company, title, location, from, to, current, description } = formData

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addExperience(formData, history)
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Job Title'
            name='title'
            value={title}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Company'
            name='company'
            value={company}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
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
            placeholder='Job Description'></textarea>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </Fragment>
  )
}

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
}

export default connect(null, { addExperience })(AddExperience)
