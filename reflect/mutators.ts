// This file defines our "mutators".
//
// Mutators are how you change data in Reflect apps.
//
// They are registered with Reflect at construction-time and callable like:
// `myReflect.mutate.increment()`.
//
// Reflect runs each mutation immediately (optimistically) on the client,
// against the local cache, and then later (usually moments later) sends a
// description of the mutation (its name and arguments) to the server, so that
// the server can *re-run* the mutation there against the authoritative
// datastore.
//
// This re-running of mutations is how Reflect handles conflicts: the
// mutators defensively check the database when they run and do the appropriate
// thing. The Reflect sync protocol ensures that the server-side result takes
// precedence over the client-side optimistic result.

import type { ClientID, WriteTransaction } from "@rocicorp/reflect";
import { generate } from "@rocicorp/rails";
import { generatePresence } from "@rocicorp/rails";

export type ChatMessage = {
	id: string;
	name: string;
	message: string;
	time?: number;
};

export const {
	set: setMessage,
	delete: deleteMessage,
	list: listMessage,
} = generate<ChatMessage>("chat");

export type Client = {
	clientID: string;
};

export type PresentClient = {
	id: string;
	name: string;
};

export const {
	set: setClient,
	get: getClient,
	init: initClient,
	update: updateClient,
	list: listClients,
} = generatePresence<Client>("client");

export const {
	set: setPresentClient,
	get: getPresentClient,
	update: updatePresentClient,
	list: listPresentClients,
	delete: deletePresentClient,
} = generate<PresentClient>("presentClient");

export const mutators = {
	increment,
	setMessage,
	deleteMessage,
	listMessage,
	sendMessage: async (tx: WriteTransaction, message: ChatMessage) => {
		await setMessage(tx, { ...message, time: Date.now() });
	},
	initClient,
	listPresentClient: listPresentClients,
	deletePresentClient,
	addPresentClient: async (tx: WriteTransaction, client: PresentClient) => {
		await setPresentClient(tx, client);
	},
	clearClients: async (
		tx: WriteTransaction,
		presentClientIDs: ClientID[],
	) => {
		const clients = await listClients(tx);
		const presentClients = clients.filter((client) =>
			presentClientIDs.find((id) => client.clientID === id),
		);
		console.log("clearing", presentClients);
		tx.set("client", presentClients);
	},
};

export type M = typeof mutators;

async function increment(
	tx: WriteTransaction,
	{ key, delta }: { key: string; delta: number },
) {
	const prev = await tx.get<number>(key);
	const next = (prev ?? 0) + delta;
	await tx.set(key, next);
}
