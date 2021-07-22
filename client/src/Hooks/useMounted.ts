import { useRef, useEffect } from 'react'

function useMounted() {
	const mounted = useRef(false)

	useEffect(() => { // To check if component is mounted or not
		mounted.current = true

		return () => { 
			mounted.current = false
		}
	}, [])

	return mounted.current
}

export default useMounted