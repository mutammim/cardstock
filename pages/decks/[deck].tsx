import type { GetStaticPropsContext } from "next";

import { useLayoutEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getAllDecks, getDeck } from "../../lib/utils";

function Deck({ cards }: Deck) {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);

	useLayoutEffect(() => {
		// Since useLayoutEffect is invoked *before* painting,
		// we don't see the next card's answer flash when
		// moving between cards

		setShowAnswer(false);
	}, [currentCardIndex]);

	const question = (
		<div
			className="flex flex-1 cursor-pointer gap-6 overflow-hidden rounded-xl bg-gray-100 p-6"
			onClick={() => {
				setShowAnswer(true);
			}}
		>
			<ReactMarkdown
				className="prose-lg flex flex-1 justify-center overflow-auto"
				remarkPlugins={[remarkGfm]}
			>
				{cards[currentCardIndex].question}
			</ReactMarkdown>
		</div>
	);

	const answer = (
		<div className="flex flex-1 flex-col gap-6 overflow-hidden rounded-xl bg-gray-700 p-6 text-white">
			<ReactMarkdown
				className="prose-lg flex flex-1 justify-center overflow-auto prose-ul:list-disc"
				remarkPlugins={[remarkGfm]}
			>
				{cards[currentCardIndex].answer}
			</ReactMarkdown>
			<div className="flex gap-4">
				<button
					className="flex-1 rounded-full bg-gray-500 p-2"
					onClick={() => {
						setCurrentCardIndex(currentCardIndex + 1);
					}}
				>
					Easy
				</button>
				<button
					className="flex-1 rounded-full bg-gray-500 p-2"
					onClick={() => {
						setCurrentCardIndex(currentCardIndex + 1);
					}}
				>
					Medium
				</button>
				<button
					className="flex-1 rounded-full bg-gray-500 p-2"
					onClick={() => {
						setCurrentCardIndex(currentCardIndex + 1);
					}}
				>
					Hard
				</button>
			</div>
		</div>
	);

	const end = (
		<div>You&#8217;ve reached the end! Reload to try the deck again.</div>
	);

	return (
		<div className="h-screen w-screen overflow-hidden bg-white text-gray-900">
			<main className="mx-auto flex h-full max-w-lg flex-col gap-2 p-2 md:gap-6 md:p-6">
				{currentCardIndex === cards.length
					? end
					: [question, showAnswer ? answer : null]}
			</main>
		</div>
	);
}

export async function getStaticPaths() {
	const decks = getAllDecks();

	return {
		paths: decks.map((deck) => {
			return { params: { deck: deck.id } };
		}),
		fallback: false,
	};
}

export async function getStaticProps(context: GetStaticPropsContext) {
	const deckID = context?.params?.deck as string;
	const deck = getDeck(deckID);

	return {
		props: deck,
	};
}

export default Deck;
