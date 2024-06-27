import ollama from 'ollama';

// Usage is shown below. Comment it out when using the function.
// You can also comment out the whole implementation and replace and uncomment the stub
const user_input = "This function returns x plus y";
const generated_code = await generateCode(user_input, 2);
console.log(generated_code);
const result = global.foo(5, 7); // generated code invocation with parameters
console.log(result);

/*
    Function: generateCode

    Description:
        - Generates a JavaScript function named foo using Ollama's codegemma model based on the given
        description and number of parameters.

    Parameters:
        - user_input (string): The user-inputted description. This is fed to the LLM to generate
        a function.
        - num_params (int): The number of parameters the generated function should have. It can
        be one of: 0, 1, 2, or 3.

    Returns:
        - object: Contains the following properties:
            - code: The generated code as a normal JS function. Directly outputted from the LLM
            - global_foo: A function in eval() ready form. Can be called using global.foo()
*/
async function generateCode(user_input, num_params) {

    // const stub = {
    //     code: '\nfunction foo(x, y) {\n  return x + y;\n}\n',
    //     global_foo: 'global.foo = \nfunction foo(x, y) {\n  return x + y;\n}\n'
    // };
    // return stub;

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

    console.log(output); // Contains all the output info. Only for testing purposes for now
                         // Relevant code is at output.response

    let just_the_code = output.response.split("```javascript")[1].split("```")[0];
    let global_foo = "global.foo = " + just_the_code;

    console.log(just_the_code); // testing purposes only
    eval(global_foo);           // TODO: eval here or later?

    // const result = global.foo(5, 7); // generated code invocation with parameters
    // console.log(result);

    return {
        code: just_the_code,
        global_foo: global_foo,
    };

}

export {generateCode};
