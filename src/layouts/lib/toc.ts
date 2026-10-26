import { JSDOM } from "jsdom";

type TocHeading = {
	level: number;
	text: string;
	id: string;
};

type TocNode = TocHeading & {
	children: TocNode[];
};

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function slugify(value: string): string {
	const base = value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
	return base || "section";
}

function createTocTree(headings: TocHeading[]): TocNode[] {
	const roots: TocNode[] = [];
	const stack: TocNode[] = [];

	headings.forEach((heading) => {
		const node: TocNode = { ...heading, children: [] };

		let last = stack[stack.length - 1];
		while (last !== undefined && last.level >= node.level) {
			stack.pop();
			last = stack[stack.length - 1];
		}

		const parent = stack[stack.length - 1];
		if (parent === undefined) {
			roots.push(node);
		} else {
			parent.children.push(node);
		}

		stack.push(node);
	});

	return roots;
}

function renderTocItems(nodes: TocNode[]): string {
	return nodes
		.map((node) => {
			const text = escapeHtml(node.text);
			const id = escapeHtml(node.id);
			const children =
				node.children.length > 0
					? `<ul>${renderTocItems(node.children)}</ul>`
					: "";
			return `<li><a href="#${id}">${text}</a>${children}</li>`;
		})
		.join("");
}

function processContent(content: string): { content: string; toc: string } {
	const dom = new JSDOM(content, { contentType: "text/html" });
	const { document } = dom.window;
	const headers = Array.from(document.querySelectorAll("h2,h3,h4"));
	const headingSet = new Set(headers);
	const usedIds = new Set(
		Array.from(document.querySelectorAll<HTMLElement>("[id]"))
			.filter((element) => !headingSet.has(element))
			.map((element) => element.id),
	);
	const slugCounts = new Map<string, number>();
	const headings: TocHeading[] = [];

	headers.forEach((header) => {
		const tagName = header.tagName.toLowerCase();
		const level = Number.parseInt(tagName.slice(1), 10);
		if (Number.isNaN(level)) {
			return;
		}

		const text = header.textContent?.trim() ?? "";
		if (text.length === 0) {
			return;
		}

		const existingId = header.getAttribute("id")?.trim();
		const baseSlug = slugify(existingId || text);
		let count = slugCounts.get(baseSlug) ?? 0;
		let id = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
		while (usedIds.has(id)) {
			count += 1;
			id = `${baseSlug}-${count + 1}`;
		}
		slugCounts.set(baseSlug, count + 1);
		usedIds.add(id);
		header.id = id;

		headings.push({ level, text, id });
	});

	const tree = createTocTree(headings);
	const processedContent = document.body.innerHTML;
	const toc = renderTocItems(tree);
	dom.window.close();
	return { content: processedContent, toc };
}

export { processContent };
