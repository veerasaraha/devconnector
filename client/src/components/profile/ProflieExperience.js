import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProflieExperience = ({
  experience: { company, title, current, to, from, description },
}) => {
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
        {!to ? ' Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      </p>
      <p>
        <strong>Position :</strong> {title}
      </p>
      <p>
        <strong>Description :</strong> {description}
      </p>
    </div>
  )
}

ProflieExperience.propTypes = {
  experience: PropTypes.object.isRequired,
}

export default ProflieExperience