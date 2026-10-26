export interface HomePage {
	layout: "home";
	url?: string | undefined;
	title?: string | undefined;
	tagLine?: string | undefined;
	actions?:
		| { theme: "brand" | "alt"; text: string; link: string }[]
		| undefined;
	features?:
		| {
				title: string;
				details: string;
				iconClass?: string;
				icon?: string;
		  }[]
		| undefined;
}
export interface BlogPage {
	layout: "blog";
	url?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	tags?: string[] | undefined;
	keywords?: string[] | undefined;
	date?: string | undefined;
	readingTime?: string | undefined;
	toc?: boolean | undefined;
}
export interface DocsPage {
	layout: "docs";
	url?: string | undefined;
	label?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	tags?: string[] | undefined;
	keywords?: string[] | undefined;
	toc?: boolean | undefined;
}

export type Page = HomePage | BlogPage | DocsPage;

interface Item {
	text: string;
	link: string;
}
interface DocsHeader {
	label: string;
	link: string;
	nav: boolean;
}

export type SideBar = {
	label: string;
	items: Item[];
};

interface Docs extends DocsHeader {
	sidebar: SideBar;
}

export interface Site {
	title: string;
	description?: string | undefined;
	favicon?: string | undefined;
	keywords?: string[] | undefined;
	logo?:
		| {
				light: string;
				dark: string;
		  }
		| undefined;
	pagesNav?: Item[] | undefined;
	docs?: Docs[] | undefined;
	posts?: DocsHeader | undefined;
	footer?: {
		copyRight?: {
			owner?: string;
			link?: string;
		};
		socialLinks?: {
			iconClass: string;
			link: string;
		}[];
	};
}
export interface LayoutParams {
	site: Site;
	page: Page;
	content?: string | undefined;
}

export interface IconProps {
	size?: number;
	iconClassName?: string;
}
