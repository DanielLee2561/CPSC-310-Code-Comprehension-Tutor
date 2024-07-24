import { expect } from "chai";
import { getBestAttempt } from "../server/functions/getBestAttempt.js"
import { removeWhitespace, removeIndent, formatCode } from "../server/functions/formatCode.js"

describe("Question Bank", () => {
    let attempts;
    let attempt;

    it ("getBestAttempt null", async () => {
        attempts = [];
        attempt = getBestAttempt(attempts);
        expect(attempt).to.equal(null);
    });

    it ("getBestAttempt inProgress", async () => {
        attempts = JSON.parse('[{"description":"","notes":"","inProgress":true,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":null,"testTotal":null}]');
        attempt = getBestAttempt(attempts);
        expect(attempt).to.equal(null);
    });

    it ("getBestAttempt complete", async () => {
        attempts = JSON.parse('[{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":1,"testTotal":null}]');
        attempt = getBestAttempt(attempts);
        expect(attempt.testCorrect).to.equal(1);
    });

    it ("getBestAttempt score", async () => {
        attempts = JSON.parse('[{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":1,"testTotal":null},{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":2,"testTotal":null},{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":null,"generatedCode":null,"failingTestCases":null,"testCorrect":1,"testTotal":null}]');
        attempt = getBestAttempt(attempts);
        expect(attempt.testCorrect).to.equal(2);
    });

    it ("getBestAttempt time", async () => {
        attempts = JSON.parse('[{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":200,"generatedCode":null,"failingTestCases":null,"testCorrect":1,"testTotal":null},{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":100,"generatedCode":null,"failingTestCases":null,"testCorrect":1,"testTotal":null},{"description":"","notes":"","inProgress":false,"startTime":null,"endTime":null,"duration":200,"generatedCode":null,"failingTestCases":null,"testCorrect":1,"testTotal":null}]');
        attempt = getBestAttempt(attempts);
        expect(attempt.duration).to.equal(100);
    });

    it ("getBestAttempt score/time", async () => {
        attempts = JSON.parse('[{"inProgress":false,"duration":100,"testCorrect":1},{"inProgress":false,"duration":200,"testCorrect":2},{"inProgress":false,"duration":100,"testCorrect":2},{"inProgress":false,"duration":200,"testCorrect":2},{"inProgress":false,"duration":100,"testCorrect":1},{"inProgress":true,"duration":null,"testCorrect":null}]');
        attempt = getBestAttempt(attempts);
        expect(attempt.testCorrect).to.equal(2);
        expect(attempt.duration).to.equal(100);
    });
});

describe('Format Whitespace', () => {
	it('null', () => {
		expect(removeWhitespace(null)).to.eql(null);
	});

	it('hello', () => {
		expect(removeWhitespace("hello")).to.eql("hello");
	});

	it('_', () => {
		expect(removeWhitespace(" ")).to.eql(" ");
	});

	it('\\n', () => {
		expect(removeWhitespace("\n")).to.eql("\n");
	});

	it('\\n_', () => {
		expect(removeWhitespace("\n ")).to.eql("\n");
	});

	it('\\n__', () => {
		expect(removeWhitespace("\n  ")).to.eql("\n");
	});

	it('_\\n', () => {
		expect(removeWhitespace(" \n")).to.eql(" \n");
	});

	it('__\\n', () => {
		expect(removeWhitespace("  \n")).to.eql("  \n");
	});

	it('\\n_\\n_\\n', () => {
		expect(removeWhitespace("\n \n \n")).to.eql("\n\n\n");
	});

	it('_\\n_\\n_', () => {
		expect(removeWhitespace(" \n \n ")).to.eql(" \n\n");
	});

	it('hello\\n_world', () => {
		expect(removeWhitespace("hello\n world")).to.eql("hello\nworld");
	});
});

describe('Remove Indent', () => {
	it('\\t}', () => {
		expect(removeIndent("\t}")).to.eql("}");
	});

	it('\\t}\\t}', () => {
		expect(removeIndent("\t}\t}")).to.eql("}}");
	});

	it('\\t}\\t}\\t', () => {
		expect(removeIndent("\t}\t}\t")).to.eql("}}\t");
	});

	it('\\t\\t}\\t}', () => {
		expect(removeIndent("\t\t}\t}")).to.eql("\t}}");
	});
});

describe('Format Code Whitespace', () => {
	it('null', () => {
		expect(formatCode(null)).to.eql(null);
	});

	it('hello', () => {
		expect(formatCode("hello")).to.eql("hello");
	});

	it('_', () => {
		expect(formatCode(" ")).to.eql(" ");
	});

	it('\\n', () => {
		expect(formatCode("\n")).to.eql("\n");
	});

	it('\\n_', () => {
		expect(formatCode("\n ")).to.eql("\n");
	});

	it('\\n__', () => {
		expect(formatCode("\n  ")).to.eql("\n");
	});

	it('_\\n', () => {
		expect(formatCode(" \n")).to.eql(" \n");
	});

	it('__\\n', () => {
		expect(formatCode("  \n")).to.eql("  \n");
	});

	it('\\n_\\n_\\n', () => {
		expect(formatCode("\n \n \n")).to.eql("\n\n\n");
	});

	it('_\\n_\\n_', () => {
		expect(formatCode(" \n \n ")).to.eql(" \n\n");
	});

	it('hello\\n_world', () => {
		expect(formatCode("hello\n world")).to.eql("hello\nworld");
	});
});

describe('Format Code {', () => {
	it('{', () => {
		expect(formatCode("{")).to.eql("{");
	});
	
	it('{\\n', () => {
		expect(formatCode("{\n")).to.eql("{\n\t");
	});

	it('\\n{', () => {
		expect(formatCode("\n{")).to.eql("\n{");
	});

	it('{{\\n', () => {
		expect(formatCode("{{\n")).to.eql("{{\n\t\t");
	});

	it('{\\n{\\n', () => {
		expect(formatCode("{\n{\n")).to.eql("{\n\t{\n\t\t");
	});

	it('{\\n{\\n{\\n', () => {
		expect(formatCode("{\n{\n{\n")).to.eql("{\n\t{\n\t\t{\n\t\t\t");
	});
});

describe('Format Code }', () => {
	it('\\t}', () => {
		expect(formatCode("\t}")).to.eql("}");
	});

	it('\\t}\\t}', () => {
		expect(formatCode("\t}\t}")).to.eql("}}");
	});

	it('\\t}\\t}\\t', () => {
		expect(formatCode("\t}\t}\t")).to.eql("}}\t");
	});

	it('\\t\\t}\\t}', () => {
		expect(formatCode("\t\t}\t}")).to.eql("\t}}");
	});
});

describe('Format Code {}', () => {
	it('{\\t}', () => {
		expect(formatCode("{\t}")).to.eql("{}");
	});
	
	it('{\\n}', () => {
		expect(formatCode("{\n}")).to.eql("{\n}");
	});

	it('{{\\n}\\n}', () => {
		expect(formatCode("{{\n}\n}")).to.eql("{{\n\t}\n}");
	});

	it('{{{\\n}\\n}\\n}', () => {
		expect(formatCode("{{{\n}\n}\n}")).to.eql("{{{\n\t\t}\n\t}\n}");
	});

	it('function Hello World', () => {
		expect(formatCode("function foo() {\n return \"Hello World!\";\n}")).to.eql("function foo() {\n\treturn \"Hello World!\";\n}");
	});

	it('function Sum Of All Elements', () => {
		expect(formatCode("function foo(n) {\n  var val = 0;\n  for (i = 0; i < n.length; i++) {\n val += n[i];\n  }\n return val;\n}")).to.eql("function foo(n) {\n\tvar val = 0;\n\tfor (i = 0; i < n.length; i++) {\n\t\tval += n[i];\n\t}\n\treturn val;\n}");
	});
});