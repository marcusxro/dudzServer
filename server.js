const express = require('express');
const cors = require('cors');
const app = express();
const { ObjectId } = require('mongodb');
const Inventory = require('./collection/Data')
const Accounts = require('./collection/Account')

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('connected');
});

app.post('/SendData', async (req, res) => {
    const { userName, Position, Expences, data, date, Uid } = req.body

    try {
        const sendData = new Inventory({
            userName: userName,
            Position: Position,
            Expences: Expences,
            data: data,
            date: date,
            Uid: Uid
        })
        await sendData.save()
        res.status(201).json({ message: 'Inventory created successfully' });
    } catch (err) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});

app.get('/GetData', async (req, res) => {
    Inventory.find()
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            console.log(err)
        })
})

app.put('/update/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    const { riceName, pricePerKilo, productSold } = req.body;
    try {
        // Construct the update object for the specific index
        const updateObject = {
            [`data.${index}.riceName`]: riceName,
            [`data.${index}.pricePerKilo`]: pricePerKilo,
            [`data.${index}.productSold`]: productSold
        };

        // Update the document in the database
        const result = await Inventory.findByIdAndUpdate(tableID, {
            $set: updateObject,
        });

        if (!result) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/delete/:tableID/:index', async (req, res) => {
    const { tableID, index } = req.params;
    try {
        // Convert index to integer
        const dataIndex = parseInt(index);

        // Update the document to remove the element at the specified index
        const result = await Inventory.updateOne(
            { _id: tableID }, // Find document by ID
            {
                $unset: {
                    [`data.${dataIndex}`]: ""
                }
            }
        );

        // Remove any null elements left after the unset operation
        await Inventory.updateOne(
            { _id: tableID },
            { $pull: { data: null } }
        );

        // Check if the data array is empty after removal
        const updatedDoc = await Inventory.findById(tableID);
        if (updatedDoc.data.length === 0) {
            // If data array is empty, delete the entire document
            await Inventory.deleteOne({ _id: tableID });
        }

        // Check if the update operation was successful
        if (result.modifiedCount === 1) {
            res.send("Document updated successfully");
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});




app.post('/SendAcc', async (req, res) => {
    const { Email, Password, position, Uid } = req.body
    try {
        const sendData = new Accounts({
            Email: Email,
            Password: Password,
            position: position,
            Uid: Uid
        })
        await sendData.save()
        res.status(201).json({ message: 'Inventory created successfully' });
    } catch (err) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report' });
    }
});

app.get('/GetAcc', async (req, res) => {
    Accounts.find()
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            console.log(err)
        })
})
app.listen(8080, () => {
    console.log('server started');
});
