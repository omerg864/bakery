import { formatDuration, intervalToDuration } from 'date-fns';

export function durationFormatter(ms: number): string {
	const duration = intervalToDuration({ start: 0, end: ms });

	return formatDuration(duration, {
		format: ['days', 'hours', 'minutes'],
	});
}
