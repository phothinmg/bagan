import { renderToStaticMarkup } from "react-dom/server";
import { BlogLayout } from "./blog.js";
import { DocsLayout } from "./docs.js";
import { HomeLayout } from "./home.js";
import type { LayoutParams, Page, Site } from "./lib/types.js";

function homeLayout(parm: LayoutParams): string {
	return renderToStaticMarkup(<HomeLayout site={parm.site} page={parm.page} />);
}

function blogLayout(parm: LayoutParams): string {
	return renderToStaticMarkup(
		<BlogLayout site={parm.site} page={parm.page} content={parm.content} />,
	);
}

function docsLayout(parm: LayoutParams): string {
	return renderToStaticMarkup(
		<DocsLayout site={parm.site} page={parm.page} content={parm.content} />,
	);
}

export type { LayoutParams, Page, Site };
export { blogLayout, docsLayout, homeLayout };
