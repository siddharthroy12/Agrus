const genConfig  = () => {
	const userInfoFromStorage = localStorage.getItem('loginInfo') ?
		JSON.parse(String(localStorage.getItem('loginInfo'))) : null

	return {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${userInfoFromStorage.token}`
		}
	}
}

export default genConfig