import type { LayoutParams } from "../lib/types.js";

function NavBar({ site }: Pick<LayoutParams, "site">) {
	const navLinks = [
		...(site.docs ?? [])
			.filter((doc) => doc.nav)
			.map(({ label, link }) => ({ label, link })),
		...(site.posts?.nav
			? [{ label: site.posts.label, link: site.posts.link }]
			: []),
	];
	const pagesNav = site.pagesNav ?? [];
	const hasNavLinks = navLinks.length > 0 || pagesNav.length > 0;

	return (
		<>
			<header className="header">
				<nav aria-label="Main navigation">
					<a href={"/"} className="nav_logo">
						{site.title}
					</a>
					<div className="nav_menu" id="nav-menu">
						{hasNavLinks && (
							<ul className="nav_list">
								{navLinks.map((nav) => (
									<li key={nav.label} className="nav_item">
										<a
											href={nav.link}
											className="nav_link"
											id={nav.label.toLowerCase()}
										>
											{nav.label}
										</a>
									</li>
								))}
								{pagesNav.length > 0 && (
									<li className="nav_item dropdown">
										<button type="button" className="drop">
											Pages
										</button>
										<ul className="drop-content">
											{pagesNav.map((nav) => (
												<li key={nav.text}>
													<a href={nav.link}>{nav.text}</a>
												</li>
											))}
										</ul>
									</li>
								)}
							</ul>
						)}
						<div className="nav_menu_tools">
							<button
								className="nav_theme nav_theme-mobile"
								data-theme-toggle
								type="button"
								aria-label="Switch to dark mode"
								title="Switch to dark mode"
							>
								<i className="ti ti-moon"></i>
								<span>Dark mode</span>
							</button>
						</div>
						<button
							className="nav_close"
							id="nav-close"
							type="button"
							aria-label="Close menu"
						>
							<i className="ti ti-x"></i>
						</button>
					</div>
					<div className="nav_actions">
						<button
							className="nav_theme"
							data-theme-toggle
							type="button"
							aria-label="Switch to dark mode"
							title="Switch to dark mode"
						>
							<i className="ti ti-moon"></i>
						</button>
						<button
							className="nav_search"
							id="search-btn"
							type="button"
							aria-label="Open search"
						>
							<i className="ti ti-search"></i>
						</button>
						<button
							className="nav_toggle"
							id="nav-toggle"
							type="button"
							aria-label="Open menu"
						>
							<i className="ti ti-menu-2"></i>
						</button>
					</div>
				</nav>
			</header>
			<div className="search" id="search">
				<div id="pf-search" className="search_form"></div>
				<button
					className="search_close"
					id="search-close"
					type="button"
					aria-label="Close search"
				>
					<i className="ti ti-x"></i>
				</button>
			</div>
		</>
	);
}

export { NavBar };
