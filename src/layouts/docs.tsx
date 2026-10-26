import { DocsFooter } from "./components/Footer.js";
import { DocsPaginate } from "./components/Paginate.js";
import { SidebarPanel } from "./components/SideBar.js";
import { Toc } from "./components/Toc.js";
import { processContent } from "./lib/toc.js";
import type { LayoutParams } from "./lib/types.js";
import { getContent } from "./lib/utils.js";
import { MainLayout } from "./main.js";

type DocsProps = {
	site: LayoutParams["site"];
	page: LayoutParams["page"];
	content?: string | undefined;
};

function Docs({ site, page, content }: DocsProps) {
	if (page.layout !== "docs" || !page.label) {
		return null;
	}

	const sidebar = site.docs?.find(
		(doc) => doc.sidebar.label.toLowerCase() === page.label?.toLowerCase(),
	)?.sidebar;
	if (!sidebar) {
		return null;
	}

	const processedContent = processContent(content ?? "");
	const html = getContent(page.title, processedContent.content);
	return (
		<main className="docs_main">
			<div className="docs_mobile_menu">
				<button type="button" id="sidebar-mobile-menu">
					<i className="ri-menu-2-line"></i>
					<span>Menu</span>
				</button>
			</div>
			<aside className="sidebar" id="sidebar">
				<nav aria-label={sidebar.label}>
					<SidebarPanel sidebar={sidebar} />
				</nav>
				<dialog
					id="sidebar-mobile-nav"
					aria-label={`${sidebar.label} navigation`}
				>
					<SidebarPanel sidebar={sidebar} />
				</dialog>
			</aside>
			<div className="docs_content">
				<article
					className="content_body"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
				<DocsPaginate site={site} page={page} />
				<DocsFooter site={site} />
			</div>
			<Toc page={page} tocContent={processedContent.toc} />
		</main>
	);
}

function DocsLayout({ site, page, content }: LayoutParams) {
	return (
		<MainLayout site={site} page={page}>
			<Docs site={site} page={page} content={content} />
		</MainLayout>
	);
}

export { DocsLayout };
