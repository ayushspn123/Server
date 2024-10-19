const request = require('supertest');
const app = require('../index'); 
const Rule = require('../models/models'); 

jest.mock('../models/models');

beforeEach(() => {
  jest.clearAllMocks();
});

// Test Case: Create Rule
describe('POST /api/rules/create', () => {
  it('should create a new rule', async () => {
    const ruleData = {
      _id: '60d21b4667d0d8992e610c85', 
      rule_string: "age > 30",
      name: "Age Greater than 30",
    };

    Rule.mockImplementation(() => ({
      _id: ruleData._id,
      rule_string: ruleData.rule_string,
      name: ruleData.name,
      save: jest.fn().mockResolvedValue(ruleData), 
    }));

    const response = await request(app)
      .post('/api/rules/create')
      .send({ rule_string: "age > 30" }) 
      .expect(200); // Expecting a 201 Created response

    expect(response.body).toHaveProperty('_id'); 
    expect(response.body.name).toBe(ruleData.name); 
  });

  it('should return an error if rule_string is missing', async () => {
    const response = await request(app)
      .post('/api/rules/create')
      .send({ }) 
      .expect(400); 

    expect(response.body).toHaveProperty('message', "Rule string is required");
  });


});

// Define combineASTs function
function combineASTs(ast1, ast2) {
  return {
    type: "operator",
    left: ast1,
    right: ast2,
    value: "AND",
  };
}

// Test Case: Combine Rules
describe('POST /api/rules/combine', () => {
  it('should combine multiple rules', async () => {
      const rule1 = { 
          _id: '60d21b4667d0d8992e610c85', 
          rule_string: "age > 30", 
          ast: { type: 'operand', value: "age > 30" } 
      };
      const rule2 = { 
          _id: '60d21b4667d0d8992e610c86', 
          rule_string: "salary > 50000", 
          ast: { type: 'operand', value: "salary > 50000" } 
      };

      Rule.find.mockResolvedValue([rule1, rule2]);

      const response = await request(app)
          .post('/api/rules/combine')
          .send({ rule_ids: [rule1._id, rule2._id] }) 
          .expect(200);

      const combinedAST = combineASTs(rule1.ast, rule2.ast); 
      expect(response.body).toEqual(combinedAST); 
  });

  it('should return an error if rule IDs are invalid', async () => {
      const response = await request(app)
          .post('/api/rules/combine')
          .send({ rule_ids: ['invalid_id'] }) 
          .expect(400); 

      expect(response.body).toHaveProperty('message', "Invalid rule IDs");
  });

  it('should return an error if one or more rules are not found', async () => {
      const ruleId = '60d21b4667d0d8992e610c85'; 

      Rule.find.mockResolvedValue([]);

      const response = await request(app)
          .post('/api/rules/combine')
          .send({ rule_ids: [ruleId] }) 
          .expect(404); 

      expect(response.body).toHaveProperty('message', "One or more rules not found");
  });

  it('should combine rules even if one of them has empty string as rule_string', async () => {
      const rule1 = { 
          _id: '60d21b4667d0d8992e610c85', 
          rule_string: "age > 30", 
          ast: { type: 'operand', value: "age > 30" } 
      };
      const rule2 = { 
          _id: '60d21b4667d0d8992e610c86', 
          rule_string: "", // Empty rule string
          ast: { type: 'operand', value: "" } 
      };

      Rule.find.mockResolvedValue([rule1, rule2]);

      const response = await request(app)
          .post('/api/rules/combine')
          .send({ rule_ids: [rule1._id, rule2._id] }) 
          .expect(200);

      const combinedAST = combineASTs(rule1.ast, rule2.ast); 
      expect(response.body).toEqual(combinedAST); 
  });

  it('should handle combining rules where all rule strings are empty', async () => {
      const rule1 = { 
          _id: '60d21b4667d0d8992e610c85', 
          rule_string: "", // Empty rule string
          ast: { type: 'operand', value: "" } 
      };
      const rule2 = { 
          _id: '60d21b4667d0d8992e610c86', 
          rule_string: "", // Empty rule string
          ast: { type: 'operand', value: "" } 
      };

      Rule.find.mockResolvedValue([rule1, rule2]);

      const response = await request(app)
          .post('/api/rules/combine')
          .send({ rule_ids: [rule1._id, rule2._id] }) 
          .expect(200);

      const combinedAST = combineASTs(rule1.ast, rule2.ast); 
      expect(response.body).toEqual(combinedAST); 
  });
});
