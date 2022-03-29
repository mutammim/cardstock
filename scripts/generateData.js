const { writeFileSync } = require("fs");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const path = require("path");

const { NOTION_TOKEN, pageIDs } = require("./config.json");

if (NOTION_TOKEN === null) {
	console.log(
		"This script can't access your pages. You can fix this by opening this file, and setting the `NOTION_TOKEN` variable to your Internal Integration Token."
	);

	process.exit(1);
}

if (pageIDs === null) {
	console.log(
		"This script doesn't know what pages to look at. You can fix this by opening this file, and adding page IDs to the `pageIDs` array."
	);
}

(async () => {
	/* ------------------------------- Processors ------------------------------- */

	const notion = new Client({
		auth: NOTION_TOKEN,
	});

	const n2m = new NotionToMarkdown({
		notionClient: notion,
	});

	/* ------------------------------ Create decks ------------------------------ */

	let decks = [];

	for (const [index, pageID] of pageIDs.entries()) {
		console.log(`Processing ${index + 1}/${pageIDs.length} pages.`);

		let deck = {
			id: pageID,
			name: null,
			cards: [],
		};

		// Get name of page

		deck.name = (
			await notion.pages.retrieve({
				page_id: pageID,
			})
		).properties.title.title[0].plain_text;

		// Get page's block data

		const data = await notion.blocks.children.list({
			block_id: pageID,
		});

		// Find all toggles on page

		const toggles = data.results.filter(
			(result) => result.type === "toggle"
		);

		// Loop through every toggle block

		for (const toggleBlock of toggles) {
			let card = { question: "", answer: "" };

			// Get question (from block value)

			card.question = await n2m.blockToMarkdown(toggleBlock);

			// Get answer (from blocks "inside" this block)

			let answerBlocks = (
				await notion.blocks.children.list({
					block_id: toggleBlock.id,
				})
			).results;

			card.answer = n2m.toMarkdownString(
				await n2m.blocksToMarkdown(answerBlocks)
			);

			// Push new card to array of cards

			deck.cards.push(card);
		}

		// Add deck to array of decks

		decks.push(deck);
	}

	/* --------------------------- Write to data.json --------------------------- */

	writeFileSync(
		path.join(process.cwd(), "data.json"),
		JSON.stringify({ decks: decks })
	);
})();
