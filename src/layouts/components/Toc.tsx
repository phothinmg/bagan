import type { LayoutParams } from "../lib/types.js";

type TocProps = {
	page: LayoutParams["page"];
	tocContent: string;
};

function Toc({ page, tocContent }: TocProps) {
	if (("toc" in page && page.toc === false) || !tocContent) {
		return null;
	}
	return (
		<aside className="toc_aside" id="toc">
			<div>
				<p className="title">Table of Content</p>
				<ul dangerouslySetInnerHTML={{ __html: tocContent }} />
			</div>
		</aside>
	);
}

export { Toc };
