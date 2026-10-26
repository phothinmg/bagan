import type { LayoutParams } from "../lib/types.js";

function getPaginate({ site, page }: Pick<LayoutParams, "site" | "page">) {
	const normalizeUrl = (url: string) =>
		url
			.replace(/\/index\.html$/i, "/")
			.replace(/\.html$/i, "")
			.replace(/\/+$/, "") || "/";
	const currentUrl = normalizeUrl(page.url ?? "/404");
	const pages = site.docs?.flatMap((doc) => doc.sidebar.items) ?? [];
	const currentIndex = pages.findIndex(
		(item) => normalizeUrl(item.link) === currentUrl,
	);

	return {
		prevPage: currentIndex > 0 ? pages[currentIndex - 1] : undefined,
		nextPage:
			currentIndex >= 0 && currentIndex < pages.length - 1
				? pages[currentIndex + 1]
				: undefined,
	};
}

function DocsPaginate({ site, page }: Pick<LayoutParams, "site" | "page">) {
	const { prevPage, nextPage } = getPaginate({ site, page });
	if (prevPage || nextPage) {
		return (
			<nav className="paginate_container" aria-label="Page navigation">
				{prevPage && (
					<>
						<div className="paginate_card prev">
							<p>Previous page</p>
							<a href={prevPage.link} title={prevPage.text}>
								{prevPage.text}
							</a>
						</div>
						<a
							href={prevPage.link}
							className="paginate_card_mobile"
							title={prevPage.text}
						>
							<i className="ri-arrow-left-s-line"></i>
							prev
						</a>
					</>
				)}
				{nextPage && (
					<>
						<div className="paginate_card next">
							<p>Next page</p>
							<a href={nextPage.link} title={nextPage.text}>
								{nextPage.text}
							</a>
						</div>
						<a
							href={nextPage.link}
							className="paginate_card_mobile"
							title={nextPage.text}
						>
							next
							<i className="ri-arrow-right-s-line"></i>
						</a>
					</>
				)}
			</nav>
		);
	}
}

export { DocsPaginate };
