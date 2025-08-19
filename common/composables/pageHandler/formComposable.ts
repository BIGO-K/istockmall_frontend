import { makeValidator } from '$/validator';
import { ref } from 'vue';

export function useForm<T extends object>(value: T, validation? : {
    rules?: { [key: string] : string[]},
    messages?: { [key: string] : string},
    extraTester?: {
        name: string,
        validateFunction: () => boolean
    }[]
}) {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/  

    const formValue = ref<T & { 
        validate: typeof validate,
        rules? : { [key: string] : string[] }
    }>({
        ...value,
        rules: validation.rules,
        validate: validate
    });
    
    
    /** //VARIABLE **/

    /** FUNC **/    
    async function validate() {
        try {
            const validator = makeValidator(formValue.value);
            validator.setRules(formValue.value.rules);            
            validator.setMessages(validation.messages);
            if (validation.extraTester && validation.extraTester.length > 0) {
                validation.extraTester.forEach((extra) => {
                    validator.registTester(extra.name, extra.validateFunction);
                })
            }
            await validator.run();
        } catch(e) {
            throw(e);
        }
    }

    
    /** //FUNC **/

    return {
        form : formValue,
    }
}

export function useIdValidate() {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {

    }
}


export function usePasswordValidate() {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {

    }
}