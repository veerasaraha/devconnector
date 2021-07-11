import axios from 'axios'
import { setAlert } from './alert'
import {
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from './types'

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me')
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

// Create or update profile
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const body = JSON.stringify(formData)

      const res = await axios.post('/api/profile', body, config)

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })

      dispatch(
        setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
      )

      if (!edit) {
        history.push('/dashboard')
      }
    } catch (error) {
      const errors = error.response.data.errors

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      })
    }
  }

//Add Experience

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const body = JSON.stringify(formData)

    const res = await axios.put('/api/profile/experience', body, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Experience Added', 'success'))

    history.push('/dashboard')
  } catch (error) {
    const errors = error.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

//Add Education

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const body = JSON.stringify(formData)

    const res = await axios.put('/api/profile/education', body, config)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Education Added', 'success'))

    history.push('/dashboard')
  } catch (error) {
    const errors = error.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })
    dispatch(setAlert('Experience Deleted', 'success'))
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

// Delete Experience
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })
    dispatch(setAlert('Education Deleted', 'success'))
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}

// Delete Account & Profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This Can NOT be undone!')) {
    try {
      const res = await axios.delete(`/api/profile`)

      dispatch({ type: CLEAR_PROFILE })
      dispatch({ type: ACCOUNT_DELETED })

      dispatch(setAlert('Your account has been deleted'))
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      })
    }
  }
}
