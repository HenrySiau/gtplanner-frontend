export const isSnackbarOpen = (state = false, action) => {
    switch (action.type) {
      case 'SNACKBAR_OPEN':
        return true
      case 'SNACKBAR_CLOSE':
        return false
      default:
        return state
    }
  }
   
  export const snackbarMessage = (state = '', action) => {
    switch (action.type) {
      case 'SET_SNACKBAR_MESSAGE':
        return action.message
      default:
        return state
    }
  }