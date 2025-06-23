export function generateLink(
	baseUrl: string,
	route: string[],
	query: Record<string, string | boolean | number> = {}
): string {
	const path = [
		baseUrl.replace(/\/+$/, ''),
		...route.map((r) => r.replace(/^\/+|\/+$/g, '')),
	].join('/');

	const queryString = Object.entries(query)
		.map(
			([key, value]) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
		)
		.join('&');

	return queryString ? `${path}?${queryString}` : path;
}

export function generatePath(
	route: string[],
	query: Record<string, string | boolean | number> = {}
): string {
	const sanitizedSegments = route.map((r) => r.replace(/^\/+|\/+$/g, ''));
	const path = '/' + sanitizedSegments.join('/');

	const queryString = Object.entries(query)
		.map(
			([key, value]) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
		)
		.join('&');

	return queryString ? `${path}?${queryString}` : path;
}
