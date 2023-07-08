const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get all employees
app.get('/employees', (req, res) => {
  const employees = JSON.parse(fs.readFileSync('employees.json'));
  res.json(employees);
});

// Route to get employee by ID
app.get('/employee/:id', (req, res) => {
  const employees = JSON.parse(fs.readFileSync('employees.json'));
  const employee = employees.find((emp) => emp.id === parseInt(req.params.id));

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  res.json(employee);
});

// Route to add a new employee
app.post('/employee', (req, res) => {
  const employees = JSON.parse(fs.readFileSync('employees.json'));
  const newEmployee = req.body;
  newEmployee.id = employees.length + 1;
  employees.push(newEmployee);

  fs.writeFileSync('employees.json', JSON.stringify(employees));
  res.status(201).json(newEmployee);
});

// Route to update an existing employee
app.put('/employee/:id', (req, res) => {
  const employees = JSON.parse(fs.readFileSync('employees.json'));
  const index = employees.findIndex(
    (emp) => emp.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  Object.assign(employees[index], req.body);
  fs.writeFileSync('employees.json', JSON.stringify(employees));
  res.json(employees[index]);
});

// Route to delete an existing employee
app.delete('/employee/:id', (req, res) => {
  const employees = JSON.parse(fs.readFileSync('employees.json'));
  const index = employees.findIndex(
    (emp) => emp.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  employees.splice(index, 1);
  fs.writeFileSync('employees.json', JSON.stringify(employees));
  res.json({ message: 'Employee deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
