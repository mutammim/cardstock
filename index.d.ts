type Data = {
	groups;
	decks;
};

type Card = {
	question: string;
	answer: string;
};

type Deck = {
	id: string;
	name: string;
	cards: Card[];
};
