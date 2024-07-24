function removeWhitespace(code) {
	let codeFormat = "";
	let skip = false;

	if (code == null) {
		return null;
	}

	for (let i = 0; i < code.length; i++) {
		if (code[i] != " ") {
			skip = false;
		}

		if (!skip) {
			codeFormat += code[i];
		}

		if (code[i] == "\n") {
			skip = true;
		}
	}

	return codeFormat;
}

function removeIndent(code) {
	let codeFormat = code;

	for (let i = 0; i < codeFormat.length; i++) {
		if (codeFormat[i] == "}") {
			codeFormat = codeFormat.slice(0,i-1) + codeFormat.slice(i);
			i--;
		}
	}

	return codeFormat;
}
function formatCode(code) {
	let codeFormat = code;
	let count = 0;

	if (code == null) {
		return null;
	}

	codeFormat = removeWhitespace(codeFormat);

	for (let i = 0; i < codeFormat.length; i++) {
		if (codeFormat[i] == "{") {
			count++;
		}

		if (codeFormat[i] == "}") {
			count--;
		}

		if (codeFormat[i] == "\n") {
			for (let c = count; c > 0; c--) {
				codeFormat = codeFormat.slice(0,i+1) + "\t" + codeFormat.slice(i+1);
				i++;
			}
		}
	}

	codeFormat = removeIndent(codeFormat);

	return codeFormat;
}

export { removeWhitespace, removeIndent, formatCode };