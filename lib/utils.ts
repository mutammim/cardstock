import data from "../data.json";

export function getDeck(deckID: string): Deck {
	return data.decks.filter(({ id }) => id === deckID)[0];
}

export function getAllDecks(): Deck[] {
	return data.decks;
}
