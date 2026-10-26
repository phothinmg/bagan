function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function getContent(title?: string | undefined, content?: string | undefined) {
	const titleString = title ? `<h1>${escapeHtml(title)}</h1>` : "";
	return `${titleString}\n${content ?? ""}`;
}

export { getContent };
