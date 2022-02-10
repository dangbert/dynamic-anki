import { trimContents, stripArticle } from '../src/_dynamicCard.js';

import { describe, it } from 'mocha';
import { expect } from 'chai';

//const calculator = require('../src/calculator')

const testExamples = (examples, f) => {
	examples.forEach(pair => {
		expect(pair.length).to.equal(2);
		//console.log('\ntesting: ' + pair[0])
		expect(f(pair[0])).to.equal(pair[1]);
	});
}

describe('_dynamic_Card.js', () => {
	describe('trimContents()', () => {
		it('should remove content in parenthesis', () => {
			testExamples([
				// [input, expected output],
				["Gesticulate (E)", "Gesticulate"],
				["Gesticulate (EN)", "Gesticulate"],
				["Gesticulate (EN) blah (EN)", "Gesticulate blah"],
			], trimContents);
		});

		it('should remove content in brackets', () => {
			testExamples([
				// [input, expected output],
				["misc text here!", "misc text here!"],
				["mais perto [P]", "mais perto"],
				["A praia [pt]", "A praia"],
				["A praia [pt] blah [pt] blah2", "A praia blah blah2"],
			], trimContents);
		});

		it('should remove arrows', () => {
			testExamples([
				["El transbordador, el ferry ->", "El transbordador, el ferry"],
				["el acantilado -&gt; ", "el acantilado"],
			], trimContents);
		});

		it('should remove "Replay" (for Android)', () => {
			testExamples([
				["εννέαReplay", "εννέα"],
			], trimContents);
		});
	})


	describe('stripArticle()', () => {
		it('removes all spanish articles', () => {
			testExamples([
				// [input, expected output],
				["los ojos", "ojos"],
				["las llantas", "llantas"],
				["el ojo", "ojo"],
				["la llanta", "llanta"],
				["unos ojos", "ojos"],
				["unas llantas", "llantas"],
				["un ojo", "ojo"],
				["una llanta", "llanta"],
			], stripArticle);
		});

		it('removes all portuguese articles', () => {
			testExamples([
				["os amigos", "amigos"],
				["as amigas", "amigas"],
				["o amigo", "amigo"],
				["a amiga", "amiga"],
				["um amigo", "amigo"],
				["Uma amiga", "amiga"],
				["umas amigas", "amigas"],
				["uns amigos", "amigos"],
			], stripArticle);
		});

		it('removes articles from other misc languages', () => {
			// non-exhaustive list
			testExamples([
				// english
				["the dogs are here", "dogs are here"],
				["an example", "example"],
				["a person", "person"],

				// german
				["der Kopf ist hier", "Kopf ist hier"],
				["das Wasser", "Wasser"],

				// french
				["une maison", "maison"],
				["les livres", "livres"],

				// greek
				["το παιδί", "παιδί"],
				["η μορφή", "μορφή"],
				["ο λόγος", "λόγος"],
			], stripArticle);
		});

		it("works with uppercase articles as well", () => {
			testExamples([
				["Les Livres", "Livres"],
				["oS olhOs", "olhOs"],
			], stripArticle);
		});

		it("doesn't remove article if final string would be empty", () => {
			testExamples([
				["los", "los"],
				["las", "las"],
				["unos", "unos"],
				["unas", "unas"],
				["el", "el"],
				["la", "la"],
				["un", "un"],
				["una", "una"],
			], stripArticle);
		});

	});

});
