import { trimContents } from '../src/_dynamicCard.js';

import { describe, it } from 'mocha';
import { expect } from 'chai';

//const calculator = require('../src/calculator')

const testExamples = (examples, f) => {
	examples.forEach(pair => {
		expect(pair.length).to.equal(2);
		//console.log('testing: ' + pair[0])
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

})
