import { SiteFooter } from "./components/Footer.js";
import { Toc } from "./components/Toc.js";
import { processContent } from "./lib/toc.js";
import type { LayoutParams } from "./lib/types.js";
import { getContent } from "./lib/utils.js";
import { MainLayout } from "./main.js";

type PageProps = {
	site: LayoutParams["site"];
	page: LayoutParams["page"];
	content?: string | undefined;
};

function Blog({ site, page, content }: PageProps) {
	const processedContent = processContent(content ?? "");
	const html = getContent(page.title, processedContent.content);
	if (page.layout === "blog") {
		return (
			<>
				<main className="page_main">
					<div className="page_content">
						<article
							className="content_body"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</div>
					<Toc page={page} tocContent={processedContent.toc} />
				</main>
				<SiteFooter site={site} />
			</>
		);
	} else {
		return null;
	}
}

function BlogLayout({ site, page, content }: LayoutParams) {
	return (
		<MainLayout site={site} page={page}>
			<Blog site={site} page={page} content={content} />
		</MainLayout>
	);
}

export { BlogLayout };
