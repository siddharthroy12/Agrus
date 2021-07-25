import { useParams } from 'react-router'

export default function BoardScreen() {
	const params:any = useParams()

	return (
		<div>
			{params.boardname}
		</div>
	)
}
