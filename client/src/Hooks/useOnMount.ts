import { useState , useEffect } from 'react'

function useOnMount(func: () => void) {
	const [oneShot, setOneShot] = useState(false)

	useEffect(() => {
		if (!oneShot) {
			setOneShot(true)
			func()
		}
	}, [oneShot, func])
}

export default useOnMount