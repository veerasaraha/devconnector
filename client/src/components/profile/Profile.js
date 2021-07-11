import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getProfileByID } from '../../actions/profile'
import { Link } from 'react-router-dom'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProflieExperience from './ProflieExperience'
import ProfileEducation from './ProfileEducation'

const Profile = ({
  getProfileByID,
  profile: { profile, loading },
  auth,
  match,
}) => {
  const id = match.params.id

  useEffect(() => {
    getProfileByID(id)
  }, [getProfileByID, id])

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-white'>
            Back To Profiles
          </Link>

          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}

          <div class='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='proflie-exp bg-white p-2'>
              <h2 class='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((exp) => (
                    <ProflieExperience key={exp._id} experience={exp} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>
            <div className='proflie-edu bg-white p-2'>
              <h2 class='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

Profile.propTypes = {
  getProfileByID: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
})

export default connect(mapStateToProps, { getProfileByID })(Profile)