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

    const stub = 'function foo(x) {\n return 0;\n}';
    return stub;

    // Stub above, real code below.

    // let parameters;
    // switch (num_params) {
    //     case 1:
    //         parameters = "1 parameter x";
    //         break;
    //     case 2:
    //         parameters = "2 parameters x and y, in that order";
    //         break;
    //     case 3:
    //         parameters = "3 parameters x, y, and z, in that order";
    //         break;
    //     default:
    //         parameters = "no parameters";
    // }
    //
    // const llm_model = "codegemma";
    // const prompt_header = "Generate a Javascript function named foo that has " + parameters + ", that does the following: ";
    //
    // const llm_prompt = prompt_header + user_input;
    //
    // const output = await ollama.generate({
    //     model: llm_model,
    //     prompt: llm_prompt,
    // });
    //
    // return output.response.split("```javascript")[1].split("```")[0];
}

export {generateCode};