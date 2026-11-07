(() => {
	function calculateReadingTime(elementId, wpm = 225) {
		// 1. Grab the text from the target HTML element
		const element = document.getElementById(elementId);
		if (!element) return "0 min read";

		const text = element.innerText || element.textContent;

		// 2. Clean up whitespace and split by spaces to count words
		const words = text
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0).length;

		// 3. Divide word count by WPM and round up
		const readingTime = Math.ceil(words / wpm);

		return `${readingTime} min read`;
	}

	if (typeof window !== undefined) {
		const title = document
			.getElementById("entry-title")
			.textContent.toLowerCase()
			.split(" ")
			.join("-");

		const metaSpan = document.getElementById("post-meta");
		const readingTime = calculateReadingTime("article-body");
		metaSpan.textContent = metaSpan.textContent + " • " + readingTime;
	}
})();
