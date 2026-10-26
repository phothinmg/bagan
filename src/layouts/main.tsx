import type { ReactNode } from "react";
import { NavBar } from "./components/Nav.js";
import type { LayoutParams } from "./lib/types.js";

type MainProps = {
	readonly children: ReactNode;
	site: LayoutParams["site"];
	page: LayoutParams["page"];
};

function MainLayout({ children, site, page }: MainProps) {
	const title = page.title ? `${page.title} | ${site.title}` : site.title;
	const description =
		"layout" in page && (page.layout === "blog" || page.layout === "docs")
			? page.description
			: undefined;
	const keywords =
		"layout" in page && (page.layout === "blog" || page.layout === "docs")
			? page.keywords
			: undefined;
	const des = description ?? site.description;
	const kw = keywords
		? keywords.join(" ")
		: site.keywords
			? site.keywords.join(" ")
			: "";
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8"></meta>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content={des} />
				<meta name="keywords" content={kw} />
				<link
					rel="preload"
					href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
					as="style"
					crossOrigin="anonymous"
				/>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
				/>
				<title>{title}</title>
			</head>
			<body>
				<NavBar site={site} />
				{children}
			</body>
		</html>
	);
}

export { MainLayout };
