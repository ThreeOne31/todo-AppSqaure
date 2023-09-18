
export const baseUrl = 'https://todos.appsquare.io'

const generateToken = () => {
  return 'mahomed-token'
}

export const getAppSquareHeaders = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${generateToken()}`
    }
  }
}