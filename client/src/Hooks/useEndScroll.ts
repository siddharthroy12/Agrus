import { useEffect } from 'react'

function useEndScroll(func: () => void) {
	useEffect(() => { // If function changes reapply the event listner
		const onScrollCheck = () => {
			// When on end of the page
			if (
				(window.innerHeight + window.scrollY) 
				>= window.document.body.offsetHeight) {
				func()
			}
		}

		window.addEventListener('scroll', onScrollCheck)

		return () => {
			window.removeEventListener('scroll', onScrollCheck)
		}
	}, [func])
}

export default useEndScroll