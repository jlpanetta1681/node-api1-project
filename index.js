const express = require('express');
const generate = require('shortid').generate;

const app = express();
app.use(express.json());

const PORT = 5001;

let users = [
	{
		id: generate(),
		name: 'Joe Panetta',
		bio: 'Lambda School student for full stack web dev',
	},
];

// 5- ENDPOINTS
// [GET]all users
app.get('/api/users', (req, res) => {
	res.status(200).json(users);
});

// [GET] user with the id passed as a parameter in the URL
app.get('http://localhost5001/api/users/:id', (req, res) => {
	// 1- pull out the id from the request (the URL param)
	const { id } = req.params;
	// 2- find the user in the users arr with the given id
	const user = users.find((user) => user.id === id);
	// 3- set status code and send back the user
	if (!user) {
		res.status(404).json({
			message: `{ message: "The user with the specified ID does not exist." }`,
		});
	} else {
		res.status(200).json(user);
	}
});

// [POST] user using the request body as raw material
app.post('/api/users', (req, res) => {
	// 1- pull out the { name, bio } from the body of req
	const { name, bio } = req.body;
	// 2- make sure the body includes name and bio
	if (!name || !bio) {
		res.status(400).json(
			`{ errorMessage: "Please provide name and bio for the user." }`
		);
	} else {
		// 3- make a new resource, complete with unique id
		const newUser = { id: generate(), name, bio };
		// 4- add the new user to our fake db
		users.push(newUser);
		res.status(201).json(newUser); // up to you what to send
		// 5- send back the newly created resource
	}
});

// [PUT] replace user with given id (params) with the { name, bio }
app.put('/api/users/:id', (req, res) => {
	// 1- pull id from params
	const { id } = req.params;
	// 2- pull name and biofrom body
	const { name, bio } = req.body;
	// 3- validate id and validate req body
	const indexOfUser = users.findIndex((user) => user.id === id);
	// 4- find the user and swap bio and name
	if (indexOfUser !== -1) {
		users[indexOfUser] = { id, name, bio };
		// 5- send back the updated user
		res.status(200).json({ id, name, bio });
	} else {
		res.status(404).json({
			message: `{ message: "The user with id ${id} could noty be modified}`,
		});
	}
});

// [DELETE] remove user with given id in the params
app.delete('/users/:id', (req, res) => {
	// 1- find user by the given id
	// 2- remove it from the users array
	// 3- send back something
	const { id } = req.params;
	try {
		if (!users.find((user) => user.id === id)) {
			res.status(404).json({ message: 'Not found' });
		} else {
			users = users.filter((user) => user.id !== id);
			res.status(200).json({
				message: `User with id ${id} got deleted!`,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'there was an error retrieving the data',
		});
	}
});

// [GET, POST...] catch all endpoint (404 resource not found)
app.use('*', (req, res) => {
	res.status(404).json({ message: 'Not found!' });
});

// 6- LISTEN FOR INCOMING REQUESTS
app.listen(PORT, () => {
	console.log(`LISTENING ON PORT ${PORT}`);
});
