<script>
	import { Line } from 'svelte-chartjs';
	import { stock } from './data';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	} from 'chart.js';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	);
</script>

<!-- <Line {data} options={{ responsive: true }} /> -->
<Line data={stock} options={{ responsive: true }} />
