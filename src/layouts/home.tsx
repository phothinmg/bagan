import { SiteFooter } from "./components/Footer.js";
import type { LayoutParams } from "./lib/types.js";
import { MainLayout } from "./main.js";

// --------------------------------------------------
function HeroImage({ site }: Pick<LayoutParams, "site">) {
	if (site.logo?.light) {
		return (
			<img
				src={site.logo.light}
				alt=""
				height="100"
				width="100"
				className="logo_light"
				fetchPriority="high"
				aria-hidden="true"
			/>
		);
	}
	if (site.logo?.dark) {
		return (
			<img
				src={site.logo.dark}
				alt=""
				height="100"
				width="100"
				className="logo_dark"
				fetchPriority="high"
				aria-hidden="true"
			/>
		);
	}
	return null;
}

function TagLine({ page }: Pick<LayoutParams, "page">) {
	if (page.layout === "home" && page.tagLine) {
		return <p>{page.tagLine}</p>;
	} else {
		return null;
	}
}

function Actions({ page }: Pick<LayoutParams, "page">) {
	if (page.layout === "home" && page.actions && page.actions.length) {
		return (
			<section className="actions" aria-label="Primary actions">
				<div>
					{page.actions.map((action) => {
						const class_name = action.theme ?? "alt";
						return (
							<a key={action.link} className={class_name} href={action.link}>
								{action.text}
							</a>
						);
					})}
				</div>
			</section>
		);
	} else {
		return null;
	}
}

function Features({ page }: Pick<LayoutParams, "page">) {
	if (page.layout !== "home" || !page.features?.length) {
		return null;
	}

	return (
		<section className="features" aria-label="Features">
			<div className="features_grid">
				{page.features.map((feature) => (
					<article key={feature.title} className="feature_card">
						<div className="feature_icon" aria-hidden="true">
							{feature.icon || (
								<i
									className={
										feature.iconClass ?? "ti ti-rosette-discount-check"
									}
								/>
							)}
						</div>
						<h3>{feature.title}</h3>
						<p>{feature.details}</p>
					</article>
				))}
			</div>
		</section>
	);
}

function Home({ site, page }: LayoutParams) {
	if (page.layout === "home") {
		return (
			<>
				<main className="home">
					<section className="hero">
						<HeroImage site={site} />
						<h1>{site.title}</h1>
						<TagLine page={page} />
					</section>
					<Actions page={page} />
					<Features page={page} />
				</main>
				<SiteFooter site={site} />
			</>
		);
	} else {
		return null;
	}
}

function HomeLayout({ site, page }: LayoutParams) {
	return (
		<MainLayout site={site} page={page}>
			<Home site={site} page={page} />
		</MainLayout>
	);
}

export { HomeLayout };
