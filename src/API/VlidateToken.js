import { apiRefreshToken } from './users.js';
import decode from 'jwt-decode';
function validToken() {
  const tokens = JSON.parse(localStorage.getItem('auth'));

  const refreshTheAccessToken = async (refreshToken, userId) => {
    const res = await apiRefreshToken(refreshToken);
    console.warn('New access Token ' + JSON.stringify(res.data));
    localStorage.setItem(
      'auth',
      JSON.stringify({
        accesstoken: res.data.accesstoken,
        refreshtoken: refreshToken,
        id: userId,
      })
    ); // storing new access token and existing refresh token in to the local storage
  };

  const acssToken = tokens?.accesstoken; // current access token
  const rfrshToken = tokens?.refreshtoken; // current refresh token
  if (acssToken && rfrshToken) {
    const decodedAccesssToken = decode(acssToken);
    // check if the access token is not expired continue
    if (decodedAccesssToken.exp * 1000 > new Date().getTime()) {
      return true;
    } else {
      // if the current access token is expired check the refresh token expiration
      // And if not expired refresh the access token else clear the local storage
      const decodedRefreshToken = decode(rfrshToken);
      if (decodedRefreshToken.exp * 1000 > new Date().getTime()) {
        refreshTheAccessToken(rfrshToken, decodedAccesssToken.id);
        return true;
      } else {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  } else {
    localStorage.clear();
    window.location.href = '/';
    // window.location.reload();
  }
}

export default validToken;
