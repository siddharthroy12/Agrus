import { useParams } from 'react-router'

export default function UserScreen() {
	const params:any = useParams()

	return (
		<div>
			{params.username}
		</div>
	)
}
