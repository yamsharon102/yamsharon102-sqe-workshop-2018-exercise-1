import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const makeMap = (l, t, n, c, v) => {
    return {Line: l, Type: t, Name: n, Condition: c, Value: v};
};

const flattenDeep = arr1 =>
    arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);

const varDecl = exp =>
    exp.declarations.map((x) => makeMap(x.id.loc.start.line, 'variable declaration', x.id.name, '', x.init === null ? '' : escodegen.generate(x.init)));

const paramsDecl = x =>
    [makeMap(x.loc.start.line, 'variable declaration', x.name, '', '')];

const funcDecl = (func) => {
    let tmp =func.params.map((x) => (paramsDecl(x))).concat(handlers[func.body.type](func.body));
    return [makeMap(func.loc.start.line, 'function declaration', func.id.name, '', '')].concat(tmp);
};

const blkStt = (blk) =>
    blk.body.map((x) => handlers[x.type](x));

const assExp = (ass) => makeMap(ass.loc.start.line, 'assignment expression', ass.left.name, '', escodegen.generate(ass.right));

const expStt = (exp) => (exp.expression.type === 'SequenceExpression' ? exp.expression.expressions.map((x) => assExp(x)) : [assExp(exp.expression)]);

const whileStt = (exp) =>
    [makeMap(exp.loc.start.line, 'while statement', '', escodegen.generate(exp.test), '')].concat(handlers[exp.body.type](exp.body));

const ifStt = (exp) =>
    ifhelp(exp, 'if statement');

const ifhelp = (exp, name) => {
    if (exp.alternate == null)
        return [makeMap(exp.loc.start.line, name, '', escodegen.generate(exp.test), '')].concat(handlers[exp.consequent.type](exp.consequent));
    return exp.alternate.type === 'IfStatement' ? ([makeMap(exp.loc.start.line, name, '', escodegen.generate(exp.test), '')].concat(handlers[exp.consequent.type](exp.consequent))).concat(ifhelp(exp.alternate, 'else if statement')) : ([makeMap(exp.loc.start.line, name, '', escodegen.generate(exp.test), '')].concat(handlers[exp.consequent.type](exp.consequent))).concat(handlers[exp.alternate.type](exp.alternate));
};

const retStt = (ret) => makeMap(ret.argument.loc.start.line, 'return statement', '', '', escodegen.generate(ret.argument));

const forStt = (stt) => ([makeMap(stt.loc.start.line, 'for statement', '', escodegen.generate(stt.test), '')].concat(handlers[stt.init.type](stt.init))).concat(assExp(stt.update)).concat(handlers[stt.body.type](stt.body));

let handlers = {
    'VariableDeclaration': varDecl,
    'FunctionDeclaration': funcDecl,
    'BlockStatement': blkStt,
    'ExpressionStatement': expStt,
    'WhileStatement': whileStt,
    'IfStatement': ifStt,
    'ForStatement': forStt,
    'ReturnStatement': retStt
};

const jsonToObjects = (arr) => flattenDeep(arr.map((x) => (handlers[x.type](x))));

const parseCode = (codeToParse) => jsonToObjects(esprima.parseScript(codeToParse, {loc: true}).body);

export {parseCode};
