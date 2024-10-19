const mongoose = require("mongoose");
const Rule = require("./models/models");

// Improved parseRule Function - Parse dynamically
function parseRule(ruleString) {
  // Placeholder: You'll need to implement a more comprehensive parser
  const ast = { 
    type: 'operator', 
    left: { type: 'operand', value: 'age > 30' }, 
    right: { type: 'operand', value: 'salary > 50000' }, 
    value: 'AND' 
  };
  return ast;
}

function combineASTs(ast1, ast2) {
  return { type: 'operator', left: ast1, right: ast2, value: 'AND' };
}

function evaluateCondition(condition, data) {
  const [attribute, operator, value] = condition.split(" ");
  switch (operator) {
    case '>': return data[attribute] > parseInt(value);
    case '<': return data[attribute] < parseInt(value);
    case '>=': return data[attribute] >= parseInt(value);
    case '<=': return data[attribute] <= parseInt(value);
    case '==': return data[attribute] == value;
    case '!=': return data[attribute] != value;
    default: return false;
  }
}

function evaluateRule(ast, data) {
  if (ast.type === 'operand') {
    return evaluateCondition(ast.value, data);
  } else if (ast.type === 'operator') {
    const leftResult = evaluateRule(ast.left, data);
    const rightResult = evaluateRule(ast.right, data);
    return ast.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  }
}

exports.createRule = async (req, res) => {
  try {
    const { rule_string } = req.body;
    if (!rule_string) {
      return res.status(400).json({ message: "Rule string is required" });
    }
    const ast = parseRule(rule_string);
    const rule = new Rule({ name: 'Rule', ast });
    await rule.save();
    res.json(rule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating rule" });
  }
};

exports.combineRules = async (req, res) => {
  try {
    const { rule_ids } = req.body;
    if (!Array.isArray(rule_ids) || rule_ids.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Invalid rule IDs" });
    }

    const rules = await Rule.find({ _id: { $in: rule_ids } });
    if (rules.length !== rule_ids.length) {
      return res.status(404).json({ message: "One or more rules not found" });
    }

    let combinedAST = rules[0].ast;
    rules.slice(1).forEach((rule) => {
      combinedAST = combineASTs(combinedAST, rule.ast);
    });

    res.json(combinedAST);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error combining rules" });
  }
};

exports.evaluateRule = (req, res) => {
  try {
    const { rule_ast, data } = req.body;
    const result = evaluateRule(rule_ast, data);
    res.json({ eligible: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error evaluating rule" });
  }
};
exports.getAllRules = async (req, res) => {
    try {
      const rules = await Rule.find();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };