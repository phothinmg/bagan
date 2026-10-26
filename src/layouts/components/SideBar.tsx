import type { SideBar } from "../lib/types.js";

type SidebarProps = {
	sidebar?: SideBar | undefined;
};

function SidebarPanel({ sidebar }: SidebarProps) {
	if (sidebar) {
		return (
			<div className="nav_panel_container">
				<div>
					<div>
						<p>{sidebar.label}</p>
						{sidebar.items.map((item) => (
							<ul key={item.text}>
								<a href={item.link} id={item.text.toLowerCase()}>
									<span>{item.text}</span>
								</a>
							</ul>
						))}
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
}

export { SidebarPanel };
