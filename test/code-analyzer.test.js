import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('1. is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('2. is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"1"}]'
        );
    });

    it('3. is parsing a simple assignment declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('a = 1;')),
            '[{"Line":1,"Type":"assignment expression","Name":"a","Condition":"","Value":"1"}]'
        );
    });

    it('4. is parsing a simple function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){}')),
            '[{"Line":1,"Type":"function declaration","Name":"x","Condition":"","Value":""}]'
        );
    });

    it('5. is parsing a function with 3 variable declarations correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){ let x, y, z; }')),
            '[{"Line":1,"Type":"function declaration","Name":"x","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"y","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"z","Condition":"","Value":""}]'
        );
    });

    it('6. is parsing a function with variable declaration and assignment statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){ let x; x = 5; }')),
            '[{"Line":1,"Type":"function declaration","Name":"x","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"5"}]'
        );
    });

    it('7. is parsing a function with an if and return statements correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function ex(x){\n' +
                '     if(x>3){\n' +
                '     \treturn 1;\n' +
                '     }\n' +
                ' }')),
            '[{"Line":1,"Type":"function declaration","Name":"ex","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":""},{"Line":2,"Type":"if statement","Name":"","Condition":"x > 3","Value":""},{"Line":3,"Type":"return statement","Name":"","Condition":"","Value":"1"}]'
        );
    });

    it('8. is parsing parameterized function, while, var declaration, and assignment statements correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function ex(x){\n' +
                'let y = 4;\n' +
                '     while(x<3){\n' +
                '     \ty = y + 2;\n' +
                '     }\n' +
                ' }')),
            '[{"Line":1,"Type":"function declaration","Name":"ex","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"y","Condition":"","Value":"4"},{"Line":3,"Type":"while statement","Name":"","Condition":"x < 3","Value":""},{"Line":4,"Type":"assignment expression","Name":"y","Condition":"","Value":"y + 2"}]'
        );
    });

    it('9. is parsing a function with for statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function ex(){\n' +
                '\tlet a = 3;\n' +
                '    for(let i = 0; i < 6; i = i + 1){\n' +
                '     \ta = a * 3;\n' +
                '    }\t\n' +
                ' }')),
            '[{"Line":1,"Type":"function declaration","Name":"ex","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"3"},{"Line":3,"Type":"for statement","Name":"","Condition":"i < 6","Value":""},{"Line":3,"Type":"variable declaration","Name":"i","Condition":"","Value":"0"},{"Line":3,"Type":"assignment expression","Name":"i","Condition":"","Value":"i + 1"},{"Line":4,"Type":"assignment expression","Name":"a","Condition":"","Value":"a * 3"}]'
        );
    });

    it('10. is parsing the binarySearch function', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){\n' +
                '     let low, high, mid;\n' +
                '     low = 0;\n' +
                '     high = n - 1;\n' +
                '     while (low <= high) {\n' +
                '         mid = (low + high)/2;\n' +
                '         if (X < V[mid])\n' +
                '             return mid - 1;\n' +
                '         else if (X > V[mid])\n' +
                '             low = mid + 1;\n' +
                '         else\n' +
                '             return mid;\n' +
                '     }\n' +
                '     return -1;\n' +
                ' }')),
            '[{"Line":1,"Type":"function declaration","Name":"binarySearch","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"X","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"V","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"n","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"low","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"high","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"mid","Condition":"","Value":""},{"Line":3,"Type":"assignment expression","Name":"low","Condition":"","Value":"0"},{"Line":4,"Type":"assignment expression","Name":"high","Condition":"","Value":"n - 1"},{"Line":5,"Type":"while statement","Name":"","Condition":"low <= high","Value":""},{"Line":6,"Type":"assignment expression","Name":"mid","Condition":"","Value":"(low + high) / 2"},{"Line":7,"Type":"if statement","Name":"","Condition":"X < V[mid]","Value":""},{"Line":8,"Type":"return statement","Name":"","Condition":"","Value":"mid - 1"},{"Line":9,"Type":"else if statement","Name":"","Condition":"X > V[mid]","Value":""},{"Line":10,"Type":"assignment expression","Name":"low","Condition":"","Value":"mid + 1"},{"Line":12,"Type":"return statement","Name":"","Condition":"","Value":"mid"},{"Line":14,"Type":"return statement","Name":"","Condition":"","Value":"-1"}]'
        );
    });

});
