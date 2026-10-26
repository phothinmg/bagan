import type { LayoutParams } from "../lib/types.js";

const CopyRight = ({ site }: Pick<LayoutParams, "site">) => {
	const cpText = site.footer?.copyRight?.owner
		? site.footer.copyRight.owner
		: site.title;
	const year = new Date().getFullYear();

	if (site.footer?.copyRight?.link) {
		return (
			<p>
				© {year}{" "}
				<a
					href={site.footer.copyRight.link}
					target="_blank"
					rel="noopener noreferrer"
					id="copyright-link"
				>
					{cpText}
				</a>
			</p>
		);
	} else {
		return (
			<p>
				© {year} {cpText}
			</p>
		);
	}
};

function SiteFooter({ site }: Pick<LayoutParams, "site">) {
	return (
		<footer className="site_footer">
			<div className="footer_meta">
				<CopyRight site={site} />
				<div className="footer_icons">
					{site.footer?.socialLinks &&
						site.footer.socialLinks.length > 0 &&
						site.footer.socialLinks.map((link) => {
							const icon_class_parts = link.iconClass.split("-");
							return (
								<a
									key={link.link}
									href={link.link}
									target="_blank"
									aria-label={icon_class_parts[1]?.toUpperCase()}
									rel="noopener"
								>
									<i className={link.iconClass}></i>
								</a>
							);
						})}
				</div>
			</div>
		</footer>
	);
}

function DocsFooter({ site }: Pick<LayoutParams, "site">) {
	return (
		<footer className="docs_footer">
			<div>
				<CopyRight site={site} />
				<div>
					{site.footer?.socialLinks &&
						site.footer.socialLinks.length > 0 &&
						site.footer.socialLinks.map((link) => {
							const icon_class_parts = link.iconClass.split("-");
							return (
								<a
									key={link.link}
									href={link.link}
									target="_blank"
									aria-label={icon_class_parts[1]?.toUpperCase()}
									rel="noopener"
								>
									<i className={link.iconClass}></i>
								</a>
							);
						})}
				</div>
			</div>
		</footer>
	);
}

export { DocsFooter, SiteFooter };
