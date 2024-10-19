class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type; // "operator" or "operand"
        this.left = left; 
        this.right = right; 
        this.value = value; 
    }
}

function createRuleAST(ruleString) {
    // Logic to parse ruleString and create AST
}

function evaluateRuleAST(ast, data) {
    // Logic to evaluate AST against data
}

module.exports = { createRuleAST, evaluateRuleAST };
