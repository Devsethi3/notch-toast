import { GithubIcon } from "@/components/github-icon";
import { XIcon } from "@/components/x-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const navLinks = [
	{ href: "#", label: "Playground" },
	{ href: "#", label: "Docs" },
	{ href: "#", label: "Changelog" },
];

const socialLinks = [
	{
		href: "https://x.com/imsethidev",
		label: "X",
		icon: <XIcon />,
	},
	{
		href: "https://github.com/Devsethi3",
		label: "Github",
		icon: <GithubIcon />,
	},
];

export function Footer() {
	return (
		<footer className="mx-auto max-w-5xl *:px-4 *:md:px-6 mt-10">
			<div className="flex flex-col gap-6 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						<Logo className="h-4.5" />
						<span className="font-medium">notch-toast</span>
					</div>
					<div className="flex items-center">
						{socialLinks.map(({ href, label, icon }) => (
							<Button key={label} asChild size="icon" variant="ghost">
								<a
									aria-label={label}
									href={href}
									rel="noreferrer"
									target="_blank"
								>
									{icon}
								</a>
							</Button>
						))}
					</div>
				</div>

				<nav>
					<ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
						{navLinks.map((link) => (
							<li key={link.label}>
								<a className="hover:text-foreground" href={link.href}>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<div className="flex items-center justify-between gap-4 border-t py-4 text-muted-foreground text-sm">
				<p>&copy; {new Date().getFullYear()} Notch Toast</p>

				<p className="inline-flex items-center gap-1">
					<span>Built by</span>
					<a
						aria-label="x/twitter"
						className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline"
						href={"https://x.com/imsethidev"}
						rel="noreferrer"
						target="_blank"
					>
						<img
							alt="dev"
							className="size-4 rounded-full"
							height="auto"
							src="https://github.com/devsethi3.png"
							width="auto"
						/>
						Dev
					</a>
				</p>
			</div>
		</footer>
	);
}
