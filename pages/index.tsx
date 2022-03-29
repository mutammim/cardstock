import Link from "next/link";

import { getAllDecks } from "../lib/utils";

const Home = ({ decks }: { decks: Deck[] }) => {
	return (
		<div className="h-screen w-screen bg-white text-gray-900">
			<main className="mx-auto flex h-full max-w-lg flex-col gap-6 p-6">
				<h1 className="mx-6 text-2xl font-bold">Decks</h1>
				<div className="flex flex-col gap-2">
					{decks.map(({ name, id }) => (
						<Link
							href={"http://localhost:3000/decks/" + id}
							key={id}
							passHref
						>
							<div className="cursor-pointer rounded-3xl bg-gray-100 p-6">
								<p className="text-xl font-bold">{name}</p>
							</div>
						</Link>
					))}
				</div>
			</main>
		</div>
	);
};

export async function getStaticProps() {
	const decks: Deck[] = getAllDecks();

	return {
		props: {
			decks: decks.map(({ id, name }) => {
				return { id, name };
			}),
		},
	};
}

export default Home;
