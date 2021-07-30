import { useRef, useEffect, useCallback } from 'react'

function useMounted() {
	const mounted = useRef(false)

	useEffect(() => { // To check if component is mounted or not
		mounted.current = true

		return () => { 
			mounted.current = false
		}
	}, [])

	const isMounted = useCallback(() => {
		return mounted.current
	}, [])

	return isMounted
}

export default useMounted