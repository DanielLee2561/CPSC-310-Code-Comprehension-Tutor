import ollama from 'ollama';

/*
    Function: generateCode

    Inspired by Prof. Kerslake's Python example

    Description:
        - Generates a JavaScript function named foo using Ollama's codegemma model based on the given
        description and number of parameters.

    Parameters:
        - user_input (string): The user-inputted description. This is fed to the LLM to generate
        a function.
        - num_params (int): The number of parameters the generated function should have. It can
        be one of: 0, 1, 2, or 3.

    Returns:
        - The generated code as a normal JS function. Directly outputted from the LLM. Note that to make it
        runnable, you may need to concatenate "global.foo = " before the actual function. Whenever you call
        foo(), you must instead call global.foo().
*/
async function generateCode(user_input, num_params) {

    // const stub = 'function foo(x, y) {\n return "Hello World!";\n}';
    // return stub;

    // Stub above, real code below.

    let parameters;
    switch (num_params) {
        case 1:
            parameters = "1 parameter x";
            break;
        case 2:
            parameters = "2 parameters x and y, in that order";
            break;
        case 3:
            parameters = "3 parameters x, y, and z, in that order";
            break;
        default:
            parameters = "no parameters";
    }

    const llm_model = "codegemma"; // 1.7 min, 2.26min, 1.5min, 2-3x faster than codellama (in my experience)
    const prompt_header = "Generate a Javascript function named foo that has " + parameters + ", that does the following: ";

    const llm_prompt = prompt_header + user_input;

    const output = await ollama.generate({
        model: llm_model,
        prompt: llm_prompt,
    })

    // console.log(output); // Contains all the output info. Only for testing purposes for now
                         // Relevant code is at output.response

    return output.response.split("```javascript")[1].split("```")[0];
}

export {generateCode};